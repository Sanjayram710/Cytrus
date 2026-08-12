import { prisma } from '@/lib/prisma';
import { PriceHistoryService } from './PriceHistoryService';
import { DiscountCalculationService } from './DiscountCalculationService';

export interface ValidateOfferInput {
  productId: string;
  claimedOriginalPrice: number;
  salePrice: number;
  startDate: Date | string;
  endDate: Date | string;
  maxUsage?: number | null;
  minOrderValue?: number | null;
  ignoreOfferId?: string; // Exclude current offer when updating
}

export interface OfferValidationOutput {
  isValid: boolean;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'INVALID';
  validationResult: 'VALID' | 'WARNING' | 'INVALID';
  validationReason: string;
  calculatedDiscountPercentage: number;
}

export class OfferValidationService {
  /**
   * Performs thorough server-side price history and offer validation.
   */
  static async validateOffer(input: ValidateOfferInput): Promise<OfferValidationOutput> {
    const { productId, claimedOriginalPrice, salePrice, startDate, endDate, ignoreOfferId } = input;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Validate Date Range
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return {
        isValid: false,
        status: 'INVALID',
        validationResult: 'INVALID',
        validationReason: 'Offer start date must be strictly earlier than end date.',
        calculatedDiscountPercentage: 0,
      };
    }

    // 2. Validate Product Availability & Status
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, price: true, status: true, stock: true },
    });

    if (!product || product.status === 'ARCHIVED') {
      return {
        isValid: false,
        status: 'INVALID',
        validationResult: 'INVALID',
        validationReason: 'Target product is unavailable or archived.',
        calculatedDiscountPercentage: 0,
      };
    }

    // 3. Validate Prices & Discount Math using DiscountCalculationService
    const discountCalc = DiscountCalculationService.calculateDiscount(claimedOriginalPrice, salePrice);
    if (!discountCalc.isValid) {
      return {
        isValid: false,
        status: 'INVALID',
        validationResult: 'INVALID',
        validationReason: discountCalc.errorMessage || 'Invalid discount price ratio.',
        calculatedDiscountPercentage: 0,
      };
    }

    // 4. Check Existing Active Offers Conflict
    const overlappingOffers = await prisma.offer.findMany({
      where: {
        productId,
        status: { in: ['APPROVED', 'ACTIVE'] },
        id: ignoreOfferId ? { not: ignoreOfferId } : undefined,
        OR: [
          { startDate: { lte: end }, endDate: { gte: start } },
        ],
      },
    });

    if (overlappingOffers.length > 0) {
      return {
        isValid: false,
        status: 'INVALID',
        validationResult: 'INVALID',
        validationReason: `Product already has an active overlapping offer ("${overlappingOffers[0].offerName}").`,
        calculatedDiscountPercentage: discountCalc.discountPercentage,
      };
    }

    // 5. Price History Integrity Verification
    // Retrieve all verified historical prices for this product + current product price
    const verifiedPrices = await PriceHistoryService.getVerifiedHistoricalPrices(productId);
    if (typeof product.price === 'number') {
      verifiedPrices.push(product.price);
    }

    // Check if the claimed original price matches any verified historical price (within ₹1 precision)
    const isVerifiedOriginalPrice = verifiedPrices.some(
      (hPrice) => Math.abs(hPrice - claimedOriginalPrice) < 1.0
    );

    if (!isVerifiedOriginalPrice) {
      const recentPriceText = verifiedPrices.length > 0 ? `₹${Math.min(...verifiedPrices).toLocaleString('en-IN')}` : '₹' + product.price.toLocaleString('en-IN');
      return {
        isValid: true, // Allow submission for admin review
        status: 'PENDING_REVIEW',
        validationResult: 'WARNING',
        validationReason: `The claimed original price of ₹${claimedOriginalPrice.toLocaleString('en-IN')} was not found in the product's recent valid price history (recent verified price: ${recentPriceText}). Price verification required before publishing to customers.`,
        calculatedDiscountPercentage: discountCalc.discountPercentage,
      };
    }

    // 6. Valid genuine discount
    return {
      isValid: true,
      status: 'APPROVED',
      validationResult: 'VALID',
      validationReason: 'Sufficient verified price history. Genuine offer approved.',
      calculatedDiscountPercentage: discountCalc.discountPercentage,
    };
  }
}
