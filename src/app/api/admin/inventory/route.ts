import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const inventory = await prisma.inventory.findMany({
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true } },
            category: true,
          },
        },
        variant: true,
      },
      orderBy: { stock: 'asc' },
    });
    return NextResponse.json({ inventory });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const { productId, variantId, stock } = await req.json();

    const newStock = Math.max(0, parseInt(stock, 10) || 0);

    if (variantId) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock },
      });
    }

    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      const invRecord = await prisma.inventory.findFirst({ where: { productId } });
      if (invRecord) {
        await prisma.inventory.update({
          where: { id: invRecord.id },
          data: { stock: newStock },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Stock updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Inventory update failed' }, { status: 500 });
  }
}
