import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { OfferService } from '@/services/OfferService';

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const productId = searchParams.get('productId');

    // Run expiration/activation check
    await OfferService.checkAndExpireOffers();

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (productId) {
      where.productId = productId;
    }

    const offers = await prisma.offer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            sku: true,
            images: { take: 1, orderBy: { displayOrder: 'asc' } },
          },
        },
      },
    });

    return NextResponse.json({ offers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const {
      offerName,
      description,
      productId,
      claimedOriginalPrice,
      salePrice,
      startDate,
      endDate,
      maxUsage,
      minOrderValue,
      saveAsDraft,
    } = body;

    if (!offerName || !productId || !claimedOriginalPrice || !salePrice || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required offer fields (offerName, productId, claimedOriginalPrice, salePrice, startDate, endDate)' },
        { status: 400 }
      );
    }

    const result = await OfferService.createOffer({
      offerName,
      description,
      productId,
      claimedOriginalPrice: parseFloat(claimedOriginalPrice),
      salePrice: parseFloat(salePrice),
      startDate,
      endDate,
      maxUsage: maxUsage ? parseInt(maxUsage, 10) : null,
      minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
      createdBy: session.name || session.email || 'Admin',
      saveAsDraft: Boolean(saveAsDraft),
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating offer' }, { status: 400 });
  }
}
