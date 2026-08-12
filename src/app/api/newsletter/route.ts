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
      return NextResponse.json({ message: 'You are already on the CELEBRITEE VIP invitation list.' });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: email.toLowerCase() },
    });

    return NextResponse.json({ success: true, message: 'Welcome to CELEBRITEE VIP Gazette. You have priority drop access.' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
