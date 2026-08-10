import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const razorpayOrder = await createRazorpayOrder(order.total, order.id);

    // Save payment record in DB
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'RAZORPAY',
        razorpayOrderId: razorpayOrder.id,
        amount: order.total,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_luxewear_mock_key',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Razorpay order creation failed' }, { status: 500 });
  }
}
