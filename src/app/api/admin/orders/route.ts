import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const { orderId, orderStatus, paymentStatus, courierName, trackingNumber, notes } = await req.json();

    const currentOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(orderStatus ? { orderStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(courierName !== undefined ? { courierName } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    if (orderStatus && orderStatus !== currentOrder.orderStatus) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: orderStatus,
          notes: notes || `Order status updated to ${orderStatus} by Admin`,
          createdBy: 'ADMIN',
        },
      });

      // Restock inventory if order is cancelled
      if (orderStatus === 'CANCELLED') {
        const orderItems = await prisma.orderItem.findMany({ where: { orderId } });
        for (const item of orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
