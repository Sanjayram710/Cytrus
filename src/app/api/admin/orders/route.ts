import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { sendOrderStatusEmail } from '@/lib/notifications';
import { sendN8nOrderNotification, N8nEventType } from '@/lib/n8n';

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
      include: {
        items: true,
        user: true,
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

      // Send status update email notification to customer
      try {
        await sendOrderStatusEmail(updatedOrder, orderStatus, trackingNumber || updatedOrder.trackingNumber || undefined, courierName || updatedOrder.courierName || undefined);
      } catch (err) {
        console.error('Status update email error:', err);
      }

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

      // Dispatch lifecycle event to n8n WhatsApp workflow
      const statusEventMap: Record<string, N8nEventType> = {
        CONFIRMED: 'ORDER_CONFIRMED',
        PACKED: 'ORDER_PACKED',
        ORDER_PACKED: 'ORDER_PACKED',
        SHIPPED: 'ORDER_SHIPPED',
        ORDER_SHIPPED: 'ORDER_SHIPPED',
        OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
        DELIVERED: 'DELIVERED',
        CANCELLED: 'CANCELLED',
      };

      const mappedEvent = statusEventMap[orderStatus.toUpperCase()];
      if (mappedEvent) {
        try {
          await sendN8nOrderNotification(updatedOrder, mappedEvent);
        } catch (notifErr) {
          console.error(`[N8N WhatsApp] Admin status update notification error (${mappedEvent}):`, notifErr);
        }
      }
    }

    // If payment status was updated to REFUNDED
    if (paymentStatus === 'REFUNDED' && currentOrder.paymentStatus !== 'REFUNDED') {
      try {
        await sendN8nOrderNotification(updatedOrder, 'REFUNDED');
      } catch (notifErr) {
        console.error('[N8N WhatsApp] Admin refund notification error:', notifErr);
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}

