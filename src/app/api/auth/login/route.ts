import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, setAuthCookie } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(validated.password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

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
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
