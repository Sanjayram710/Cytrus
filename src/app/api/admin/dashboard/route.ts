import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const totalRevenue = await prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true },
    });

    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.user.count({ where: { role: 'USER' } });
    const totalProducts = await prisma.product.count();

    const lowStockProducts = await prisma.product.count({
      where: { stock: { lte: 5 } },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });

    const bestSellers = await prisma.product.findMany({
      where: { isBestSeller: true },
      take: 5,
      include: {
        images: { where: { isPrimary: true } },
        category: true,
      },
    });

    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });

    const categoryPerformance = categories.map((c) => ({
      id: c.id,
      name: c.name,
      productCount: c._count.products,
    }));

    return NextResponse.json({
      metrics: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
        lowStockProducts,
      },
      recentOrders,
      bestSellers,
      categoryPerformance,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED_ADMIN_ACCESS') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to load admin metrics' }, { status: 500 });
  }
}
