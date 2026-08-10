import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json();

    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        image: body.image,
        mobileImage: body.mobileImage,
        buttonText: body.buttonText,
        buttonUrl: body.buttonUrl,
        displayOrder: body.displayOrder !== undefined ? parseInt(body.displayOrder, 10) : undefined,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, slide });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.heroSlide.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Hero slide deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Slide deletion failed' }, { status: 500 });
  }
}
