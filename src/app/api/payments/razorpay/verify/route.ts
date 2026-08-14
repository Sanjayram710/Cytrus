import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { sendN8nOrderNotification } from '@/lib/n8n';

export async function POST(req: Request) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      // Mark payment as failed
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED' },
      });

      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update Order & Payment status to PAID / SUCCESS and load items for notification payload
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
      },
      include: {
        items: true,
        user: true,
      },
    });

    await prisma.payment.updateMany({
      where: { orderId },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'SUCCESS',
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: 'PAID',
        notes: `Payment verified via Razorpay (${razorpayPaymentId})`,
      },
    });

    // Dispatch secure server-side WhatsApp order notification via n8n webhook
    try {
      await sendN8nOrderNotification(updatedOrder, 'PAYMENT_SUCCESS');
    } catch (notifErr: any) {
      console.error('[N8N WhatsApp] Notification failed during payment verification:', notifErr?.message || notifErr);
    }

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}

