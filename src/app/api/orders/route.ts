import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { recalculateCartAndVerifyStock } from '@/lib/cart-server';
import { validateCouponCode } from '@/lib/coupon';
import { sendOrderEmailReceipt, sendOrderSMSNotification, sendOrderWhatsAppNotification } from '@/lib/notifications';
import { z } from 'zod';

const orderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z.string().min(1, 'Phone number is required'),
  address: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('India'),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      size: z.string(),
      color: z.string(),
      quantity: z.number().min(1),
    })
  ),
  paymentMethod: z.enum(['COD', 'RAZORPAY']),
  couponCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const validated = orderSchema.parse(body);

    // 1. Recalculate raw subtotal on server
    const rawCalc = await recalculateCartAndVerifyStock(validated.items, 0);

    if (rawCalc.outOfStockItems.length > 0) {
      return NextResponse.json(
        { error: `Stock error: ${rawCalc.outOfStockItems.join(', ')}` },
        { status: 400 }
      );
    }

    // 2. Validate Coupon on server if provided
    let discountAmount = 0;
    let validCouponCode: string | undefined;

    if (validated.couponCode && validated.couponCode.trim() !== '') {
      const couponRes = await validateCouponCode(validated.couponCode, rawCalc.subtotal, session?.id);
      if (couponRes.valid) {
        discountAmount = couponRes.discountAmount;
        validCouponCode = couponRes.code;
      }
    }

    // 3. Final calculation of subtotal, tax, shipping, total
    const calc = await recalculateCartAndVerifyStock(validated.items, discountAmount);

    const orderNumber = `LXW-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Check if session user exists in database to prevent foreign key constraint violations
    let validUserId: string | undefined = undefined;
    if (session?.id) {
      const existingUser = await prisma.user.findUnique({ where: { id: session.id } });
      if (existingUser) {
        validUserId = existingUser.id;
      }
    }

    // 4. Create Order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: validUserId,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        shippingAddressJson: JSON.stringify(validated.address),
        subtotal: calc.subtotal,
        discount: calc.discount,
        tax: calc.tax,
        shippingFee: calc.shippingFee,
        total: calc.total,
        couponCode: validCouponCode,
        paymentMethod: validated.paymentMethod,
        paymentStatus: 'PENDING',
        orderStatus: 'CONFIRMED',
        items: {
          create: calc.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.unitPrice,
            total: item.totalPrice,
          })),
        },
        statusHistory: {
          create: {
            status: 'CONFIRMED',
            notes: 'Order placed by customer.',
          },
        },
      },
      include: {
        items: true,
      },
    });

    // 5. Deduct stock for variants / products safely (minimum 0)
    for (const item of calc.items) {
      if (item.variantId) {
        const v = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
        if (v) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: Math.max(0, v.stock - item.quantity) },
          });
        }
      }
      const p = await prisma.product.findUnique({ where: { id: item.productId } });
      if (p) {
        const newStock = Math.max(0, p.stock - item.quantity);
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        });

        const invRecord = await prisma.inventory.findFirst({ where: { productId: item.productId } });
        if (invRecord) {
          await prisma.inventory.update({
            where: { id: invRecord.id },
            data: { stock: newStock },
          });
        }
      }
    }

    // 6. Record coupon usage if applied
    if (validCouponCode) {
      const couponRecord = await prisma.coupon.findUnique({ where: { code: validCouponCode } });
      if (couponRecord) {
        await prisma.coupon.update({
          where: { id: couponRecord.id },
          data: { usageCount: { increment: 1 } },
        });
        await prisma.couponUsage.create({
          data: {
            couponId: couponRecord.id,
            userId: validUserId,
            orderId: order.id,
          },
        });
      }
    }

    // 7. Dispatch automated Email Receipt, SMS, and WhatsApp Notifications to customer
    try {
      await sendOrderEmailReceipt(order as any);
      await sendOrderSMSNotification(order as any);
      // For COD orders, dispatch ORDER_CONFIRMED WhatsApp event immediately.
      // For RAZORPAY orders, WhatsApp notification is dispatched strictly after payment verification.
      if (order.paymentMethod === 'COD') {
        await sendOrderWhatsAppNotification(order as any);
      }
    } catch (notifErr) {
      console.error('Notification dispatch warning:', notifErr);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      paymentMethod: order.paymentMethod,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      receiptDispatched: true,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Order creation failed' }, { status: 500 });
  }
}
