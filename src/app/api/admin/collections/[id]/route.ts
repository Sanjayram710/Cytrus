import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json();
    const collection = await prisma.collection.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        image: body.image,
        isFeatured: body.isFeatured ?? true,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();

    // Check if products are associated with this collection
    const productCount = await prisma.product.count({
      where: { collectionId: params.id },
    });

    if (productCount > 0) {
      // Unlink products from collection before deleting
      await prisma.product.updateMany({
        where: { collectionId: params.id },
        data: { collectionId: null },
      });
    }

    await prisma.collection.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete collection' }, { status: 500 });
  }
}
