import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderPdfInvoice } from '@/lib/pdf-generator';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const pdfBuffer = await generateOrderPdfInvoice(order as any);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="CYTRUS_Invoice_${order.orderNumber}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Invoice PDF route error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF invoice' }, { status: 500 });
  }
}
