import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { processAndSaveImageUrl } from '@/lib/server-utils';
import { PriceHistoryService } from '@/services/PriceHistoryService';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required'),
  description: z.string().min(1).optional().default('High quality combed cotton luxury t-shirt.'),
  price: z.number().positive('Price must be a positive number'),
  comparePrice: z.number().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  collectionId: z.string().optional().nullable(),
  customOffer: z.string().optional().nullable(),
  sku: z.string().optional().default(''),
  stock: z.number().min(0).default(10),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
  images: z.array(z.string().min(1)).min(1, 'At least one product image URL is required'),
  sizes: z.array(z.string()).default(['S', 'M', 'L']),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })).default([{ name: 'Black', hex: '#000000' }]),
});

export async function GET() {
  try {
    await requireAdmin();
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
      },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const validated = productSchema.parse(body);

    const processedImages = await Promise.all(
      validated.images.map((url) => processAndSaveImageUrl(url))
    );

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        price: validated.price,
        comparePrice: validated.comparePrice,
        sku: validated.sku,
        stock: validated.stock,
        isFeatured: validated.isFeatured,
        isNewArrival: validated.isNewArrival,
        isBestSeller: validated.isBestSeller,
        status: validated.status,
        categoryId: validated.categoryId,
        collectionId: validated.collectionId,
        customOffer: validated.customOffer || null,
        images: {
          create: processedImages.map((url, idx) => ({
            url,
            alt: `${validated.name} image ${idx + 1}`,
            isPrimary: idx === 0,
            displayOrder: idx,
          })),
        },
        variants: {
          create: validated.sizes.flatMap((size) =>
            validated.colors.map((color) => ({
              size,
              color: color.name,
              colorHex: color.hex,
              sku: `${validated.sku}-${size}-${color.name.slice(0, 3).toUpperCase()}`,
              stock: Math.max(15, validated.stock),
              price: validated.price,
            }))
          ),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        stock: validated.stock,
        lowStockThreshold: 5,
      },
    });

    await PriceHistoryService.recordPriceChange({
      productId: product.id,
      newPrice: validated.price,
      oldPrice: null,
      reason: 'INITIAL_PRICE',
      source: 'ADMIN',
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Product creation failed' }, { status: 500 });
  }
}
