import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { processAndSaveImageUrl } from '@/lib/server-utils';
import { PriceHistoryService } from '@/services/PriceHistoryService';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const oldPrice = existingProduct.price;
    const newPrice = body.price ? parseFloat(body.price) : oldPrice;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price ? parseFloat(body.price) : undefined,
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        sku: body.sku,
        stock: body.stock !== undefined ? Math.max(0, parseInt(body.stock, 10) || 0) : undefined,
        isFeatured: body.isFeatured,
        isNewArrival: body.isNewArrival,
        isBestSeller: body.isBestSeller,
        status: body.status,
        categoryId: body.categoryId,
        collectionId: body.collectionId || null,
        customOffer: body.customOffer !== undefined ? body.customOffer : undefined,
      },
    });

    if (body.price && Math.abs(oldPrice - newPrice) > 0.01) {
      await PriceHistoryService.recordPriceChange({
        productId: params.id,
        oldPrice,
        newPrice,
        reason: body.priceChangeReason || 'ADMIN_UPDATE',
        source: 'ADMIN',
        createdBy: session.name || session.email || 'Admin',
      });
    }

    if (body.stock !== undefined) {
      const sanitizedStock = Math.max(0, parseInt(body.stock, 10) || 0);
      const invRecord = await prisma.inventory.findFirst({ where: { productId: params.id } });
      if (invRecord) {
        await prisma.inventory.update({
          where: { id: invRecord.id },
          data: { stock: sanitizedStock },
        });
      }
    }

    if (Array.isArray(body.images) && body.images.length > 0) {
      const processedImages = await Promise.all(
        body.images.map((url: string) => processAndSaveImageUrl(url))
      );

      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      await prisma.productImage.createMany({
        data: processedImages.map((url: string, idx: number) => ({
          productId: params.id,
          url,
          alt: `${body.name || 'Product'} image ${idx + 1}`,
          isPrimary: idx === 0,
          displayOrder: idx,
        })),
      });
    }

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
