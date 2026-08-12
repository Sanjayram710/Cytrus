import { prisma } from './prisma';

import { OfferService } from '@/services/OfferService';

export interface RawCartItemInput {
  productId: string;
  variantId?: string;
  size: string;
  color: string;
  quantity: number;
}

export interface ValidatedCartItem {
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availableStock: number;
}

export interface CalculatedOrderSummary {
  items: ValidatedCartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  outOfStockItems: string[];
}

export async function recalculateCartAndVerifyStock(
  rawItems: RawCartItemInput[],
  couponDiscountValue = 0
): Promise<CalculatedOrderSummary> {
  const validatedItems: ValidatedCartItem[] = [];
  const outOfStockItems: string[] = [];
  let subtotal = 0;

  for (const rawItem of rawItems) {
    if (rawItem.quantity <= 0) continue;

    const product = await prisma.product.findUnique({
      where: { id: rawItem.productId },
      include: {
        images: true,
        variants: true,
      },
    });

    if (!product || product.status !== 'ACTIVE') {
      outOfStockItems.push(`Product unavailable (ID: ${rawItem.productId})`);
      continue;
    }

    let unitPrice = product.price;
    const activeOffer = await OfferService.getActiveApprovedOfferForProduct(product.id);
    if (activeOffer) {
      unitPrice = activeOffer.salePrice;
    }
    let availableStock = product.stock;

    // Check specific variant if variantId or size/color provided
    if (rawItem.variantId) {
      const variant = product.variants.find((v) => v.id === rawItem.variantId);
      if (variant) {
        availableStock = variant.stock;
        if (variant.price) unitPrice = variant.price;
      }
    } else {
      const matchingVariant = product.variants.find(
        (v) => v.size.toLowerCase() === rawItem.size.toLowerCase() && v.color.toLowerCase() === rawItem.color.toLowerCase()
      );
      if (matchingVariant) {
        availableStock = matchingVariant.stock;
        if (matchingVariant.price) unitPrice = matchingVariant.price;
      }
    }

    if (rawItem.quantity > availableStock) {
      outOfStockItems.push(`${product.name} (${rawItem.size} / ${rawItem.color}) - Only ${availableStock} left in stock.`);
    }

    const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || '';
    const itemTotal = unitPrice * rawItem.quantity;
    subtotal += itemTotal;

    validatedItems.push({
      productId: product.id,
      productName: product.name,
      productImage: primaryImage,
      variantId: rawItem.variantId,
      size: rawItem.size,
      color: rawItem.color,
      quantity: rawItem.quantity,
      unitPrice,
      totalPrice: itemTotal,
      availableStock,
    });
  }

  const discount = Math.min(couponDiscountValue, subtotal);
  const taxableAmount = Math.max(0, subtotal - discount);
  // 12% GST / Luxury clothing tax
  const tax = Math.round(taxableAmount * 0.12);
  // Free shipping above 10,000 INR
  const shippingFee = subtotal >= 10000 || subtotal === 0 ? 0 : 500;
  const total = Math.max(0, taxableAmount + tax + shippingFee);

  return {
    items: validatedItems,
    subtotal,
    discount,
    tax,
    shippingFee,
    total,
    outOfStockItems,
  };
}
