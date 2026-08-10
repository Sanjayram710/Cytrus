import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        image: body.image,
        isFeatured: body.isFeatured ?? false,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Category creation failed' }, { status: 500 });
  }
}
