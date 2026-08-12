export interface DiscountResult {
  discountPercentage: number;
  savingsAmount: number;
  isValid: boolean;
  errorMessage?: string;
}

export class DiscountCalculationService {
  /**
   * Safely calculates discount percentage on the server.
   * Returns rounded percentage and savings amount with strict mathematical validation.
   */
  static calculateDiscount(originalPrice: number, salePrice: number): DiscountResult {
    if (
      typeof originalPrice !== 'number' ||
      typeof salePrice !== 'number' ||
      isNaN(originalPrice) ||
      isNaN(salePrice) ||
      !isFinite(originalPrice) ||
      !isFinite(salePrice)
    ) {
      return {
        discountPercentage: 0,
        savingsAmount: 0,
        isValid: false,
        errorMessage: 'Invalid numeric price input.',
      };
    }

    if (originalPrice <= 0) {
      return {
        discountPercentage: 0,
        savingsAmount: 0,
        isValid: false,
        errorMessage: 'Claimed original price must be greater than zero.',
      };
    }

    if (salePrice < 0) {
      return {
        discountPercentage: 0,
        savingsAmount: 0,
        isValid: false,
        errorMessage: 'Sale price cannot be negative.',
      };
    }

    if (salePrice > originalPrice) {
      return {
        discountPercentage: 0,
        savingsAmount: 0,
        isValid: false,
        errorMessage: 'Sale price cannot be greater than original price.',
      };
    }

    const savings = originalPrice - salePrice;
    const rawPercentage = (savings / originalPrice) * 100;
    const roundedPercentage = Math.round(rawPercentage);

    return {
      discountPercentage: roundedPercentage,
      savingsAmount: Math.round(savings * 100) / 100,
      isValid: true,
    };
  }

  /**
   * Calculates order financial breakdown strictly on the server.
   */
  static calculateOrderTotals(params: {
    items: Array<{ price: number; quantity: number }>;
    couponDiscount?: number;
    shippingFee?: number;
    tax?: number;
  }) {
    const subtotal = params.items.reduce((acc, item) => {
      const p = Math.max(0, item.price || 0);
      const q = Math.max(1, item.quantity || 1);
      return acc + p * q;
    }, 0);

    const couponDiscount = Math.max(0, params.couponDiscount || 0);
    const totalDiscount = Math.min(subtotal, couponDiscount);
    const shippingFee = Math.max(0, params.shippingFee || 0);
    const tax = Math.max(0, params.tax || 0);

    const total = Math.max(0, Math.round((subtotal - totalDiscount + shippingFee + tax) * 100) / 100);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(totalDiscount * 100) / 100,
      shippingFee: Math.round(shippingFee * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total,
    };
  }
}
