import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price ? parseFloat(body.price) : undefined,
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        sku: body.sku,
        stock: body.stock !== undefined ? parseInt(body.stock, 10) : undefined,
        isFeatured: body.isFeatured,
        isNewArrival: body.isNewArrival,
        isBestSeller: body.isBestSeller,
        status: body.status,
        categoryId: body.categoryId,
        collectionId: body.collectionId || null,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Product update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();

    await prisma.productImage.deleteMany({ where: { productId: params.id } });
    await prisma.productVariant.deleteMany({ where: { productId: params.id } });
    await prisma.inventory.deleteMany({ where: { productId: params.id } });
    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Product deletion failed' }, { status: 500 });
  }
}
