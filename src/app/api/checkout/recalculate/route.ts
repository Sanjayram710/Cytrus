import { NextResponse } from 'next/server';
import { recalculateCartAndVerifyStock } from '@/lib/cart-server';
import { validateCouponCode } from '@/lib/coupon';

export async function POST(req: Request) {
  try {
    const { items, couponCode } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    // Step 1: Preliminary subtotal calculation
    const rawCalculation = await recalculateCartAndVerifyStock(items, 0);

    let couponDiscount = 0;
    if (couponCode) {
      const couponRes = await validateCouponCode(couponCode, rawCalculation.subtotal);
      if (couponRes.valid) {
        couponDiscount = couponRes.discountAmount;
      }
    }

    // Step 2: Full recalculated calculation with coupon discount applied on server
    const finalCalculation = await recalculateCartAndVerifyStock(items, couponDiscount);

    return NextResponse.json(finalCalculation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Recalculation failed' }, { status: 500 });
  }
}
