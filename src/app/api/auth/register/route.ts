import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setAuthCookie } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase(),
        password: hashedPassword,
        phone: validated.phone,
        role: 'USER',
      },
    });

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    };

    await setAuthCookie(userSession);

    return NextResponse.json({
      success: true,
      user: userSession,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
