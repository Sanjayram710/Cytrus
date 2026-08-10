import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const collections = await prisma.collection.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ collections });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const collection = await prisma.collection.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        image: body.image,
        isFeatured: body.isFeatured ?? false,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Collection creation failed' }, { status: 500 });
  }
}
