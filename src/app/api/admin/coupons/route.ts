import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { usages: true } } },
    });
    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.trim().toUpperCase(),
        type: body.type || 'PERCENTAGE',
        value: parseFloat(body.value),
        minSpend: body.minSpend ? parseFloat(body.minSpend) : 0,
        maxDiscount: body.maxDiscount ? parseFloat(body.maxDiscount) : null,
        usageLimit: body.usageLimit ? parseInt(body.usageLimit, 10) : 1000,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Coupon creation failed' }, { status: 500 });
  }
}
