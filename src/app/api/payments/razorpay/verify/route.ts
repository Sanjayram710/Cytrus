import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';

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

    // Update Order & Payment status to PAID / SUCCESS
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
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

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
