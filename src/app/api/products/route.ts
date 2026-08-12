import { NextResponse } from 'next/server';
import { OfferService } from '@/services/OfferService';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const collection = searchParams.get('collection');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const featured = searchParams.get('featured') === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const bestSeller = searchParams.get('bestSeller') === 'true';
    const sort = searchParams.get('sort') || 'recommended';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const where: any = {
      status: 'ACTIVE',
    };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { sku: { contains: query } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (collection) {
      where.collection = { slug: collection };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (featured) where.isFeatured = true;
    if (newArrival) where.isNewArrival = true;
    if (bestSeller) where.isBestSeller = true;

    if (size || color) {
      where.variants = {
        some: {
          ...(size ? { size: { equals: size } } : {}),
          ...(color ? { color: { equals: color } } : {}),
        },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    else if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };
    else if (sort === 'best-selling') orderBy = { isBestSeller: 'desc' };

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
        collection: true,
        variants: true,
        reviews: { where: { isApproved: true } },
      },
    });

    const items = await Promise.all(
      products.map(async (p) => {
        const avgRating =
          p.reviews.length > 0
            ? Math.round((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length) * 10) / 10
            : 5.0;

        const activeOffer = await OfferService.getActiveApprovedOfferForProduct(p.id);

        let finalPrice = p.price;
        let finalComparePrice = p.comparePrice;
        let discountPercentage = 0;

        if (activeOffer) {
          finalPrice = activeOffer.salePrice;
          finalComparePrice = activeOffer.claimedOriginalPrice;
          discountPercentage = activeOffer.discountPercentage;
        } else if (p.comparePrice && p.comparePrice > p.price) {
          discountPercentage = Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100);
        }

        return {
          ...p,
          price: finalPrice,
          comparePrice: finalComparePrice,
          rating: avgRating,
          reviewCount: p.reviews.length,
          discountPercentage,
          activeOffer: activeOffer ? {
            id: activeOffer.id,
            offerName: activeOffer.offerName,
            claimedOriginalPrice: activeOffer.claimedOriginalPrice,
            salePrice: activeOffer.salePrice,
            discountPercentage: activeOffer.discountPercentage,
          } : null,
        };
      })
    );

    return NextResponse.json({
      products: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}
