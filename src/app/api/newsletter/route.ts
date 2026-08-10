import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ message: 'You are already subscribed to LUXEWEAR Gazette.' });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: email.toLowerCase() },
    });

    return NextResponse.json({ success: true, message: 'Welcome to LUXEWEAR Gazette. You are subscribed.' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
