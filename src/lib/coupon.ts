import { prisma } from './prisma';

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discountAmount: number;
  message: string;
}

export async function validateCouponCode(
  code: string,
  subtotal: number,
  userId?: string
): Promise<CouponValidationResult> {
  if (!code || code.trim() === '') {
    return { valid: false, discountAmount: 0, message: 'Invalid coupon code.' };
  }

  const cleanCode = code.trim().toUpperCase();
  const coupon = await prisma.coupon.findUnique({
    where: { code: cleanCode },
  });

  if (!coupon || !coupon.isActive) {
    return { valid: false, discountAmount: 0, message: 'Coupon code does not exist or is inactive.' };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discountAmount: 0, message: 'This coupon code has expired.' };
  }

  if (coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, message: 'Coupon usage limit has been reached.' };
  }

  if (subtotal < coupon.minSpend) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum order value of ₹${coupon.minSpend.toLocaleString('en-IN')} required for coupon ${cleanCode}.`,
    };
  }

  let discountAmount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discountAmount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.type === 'FIXED') {
    discountAmount = coupon.value;
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return {
    valid: true,
    code: coupon.code,
    discountAmount,
    message: `Coupon ${coupon.code} applied successfully! You saved ₹${discountAmount.toLocaleString('en-IN')}.`,
  };
}
