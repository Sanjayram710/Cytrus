import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OfferService } from '@/services/OfferService';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
        collection: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const avgRating =
      product.reviews.length > 0
        ? Math.round((product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length) * 10) / 10
        : 5.0;

    const activeOffer = await OfferService.getActiveApprovedOfferForProduct(product.id);

    let finalPrice = product.price;
    let finalComparePrice = product.comparePrice;
    let discountPercentage = 0;

    if (activeOffer) {
      finalPrice = activeOffer.salePrice;
      finalComparePrice = activeOffer.claimedOriginalPrice;
      discountPercentage = activeOffer.discountPercentage;
    } else if (product.comparePrice && product.comparePrice > product.price) {
      discountPercentage = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
    }

    // Fetch related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: 'ACTIVE',
      },
      take: 4,
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
      },
    });

    return NextResponse.json({
      product: {
        ...product,
        price: finalPrice,
        comparePrice: finalComparePrice,
        rating: avgRating,
        reviewCount: product.reviews.length,
        discountPercentage,
        activeOffer: activeOffer ? {
          id: activeOffer.id,
          offerName: activeOffer.offerName,
          claimedOriginalPrice: activeOffer.claimedOriginalPrice,
          salePrice: activeOffer.salePrice,
          discountPercentage: activeOffer.discountPercentage,
        } : null,
      },
      relatedProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching product' }, { status: 500 });
  }
}
