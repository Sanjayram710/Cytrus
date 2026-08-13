import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const collection = await prisma.collection.findFirst({
      where: { slug: params.slug, isActive: true },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { collectionId: collection.id, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
        collection: true,
        variants: true,
        reviews: { where: { isApproved: true } },
      },
    });

    const items = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? Math.round((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length) * 10) / 10
          : 5.0;

      const discountPercentage = p.comparePrice
        ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)
        : 0;

      return {
        ...p,
        rating: avgRating,
        reviewCount: p.reviews.length,
        discountPercentage,
      };
    });

    return NextResponse.json({ collection, products: items });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch collection details' }, { status: 500 });
  }
}
