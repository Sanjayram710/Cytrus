import { NextResponse } from 'next/server';
import { validateCouponCode } from '@/lib/coupon';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
    const result = await validateCouponCode(code, subtotal);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ valid: false, discountAmount: 0, message: 'Coupon validation failed' }, { status: 400 });
  }
}
