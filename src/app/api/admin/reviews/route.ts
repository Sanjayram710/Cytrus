import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    });
    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const { reviewId, isApproved } = await req.json();

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Review update failed' }, { status: 500 });
  }
}
