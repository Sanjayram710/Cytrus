import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { normalizeImageUrl } from '@/lib/utils';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function processAndSaveImageUrl(url: string): Promise<string> {
  if (!url) return '';
  const normalized = normalizeImageUrl(url);
  if (normalized.includes('lh3.googleusercontent.com/d/')) {
    try {
      const res = await fetch(normalized);
      if (res.ok) {
        const bytes = await res.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const match = normalized.match(/\/d\/([a-zA-Z0-9_-]+)/);
        const fileId = match ? match[1] : Date.now().toString();
        const fileName = `upload_${Date.now()}_drive_${fileId}.jpg`;
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });
        await writeFile(path.join(uploadsDir, fileName), buffer);
        return `/uploads/${fileName}`;
      }
    } catch (e) {
      console.error('Failed to download drive image locally:', e);
    }
  }
  return normalized;
}

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
