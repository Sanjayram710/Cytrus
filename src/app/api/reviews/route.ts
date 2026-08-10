import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(3, 'Review comment must be at least 3 characters'),
  userName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const validated = reviewSchema.parse(body);

    const userName = session?.name || validated.userName || 'Anonymous Luxury Guest';

    const review = await prisma.review.create({
      data: {
        productId: validated.productId,
        userId: session?.id,
        userName,
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        isVerified: !!session,
        isApproved: true, // Auto approve or set to false for strict admin moderation
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
