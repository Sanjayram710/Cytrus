import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const slides = await prisma.heroSlide.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ slides });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const slide = await prisma.heroSlide.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        image: body.image,
        mobileImage: body.mobileImage || body.image,
        buttonText: body.buttonText || 'Explore Collection',
        buttonUrl: body.buttonUrl || '/shop',
        displayOrder: body.displayOrder ? parseInt(body.displayOrder, 10) : 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, slide });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create slide' }, { status: 500 });
  }
}
