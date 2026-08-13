import { prisma } from '@/lib/prisma';

export interface PriceHistoryRecordParams {
  productId: string;
  variantId?: string | null;
  oldPrice?: number | null;
  newPrice: number;
  reason?: string;
  source?: string;
  createdBy?: string;
}

export class PriceHistoryService {
  /**
   * Appends a new immutable price history entry.
   * Updates previous history entry's validUntil date to now().
   */
  static async recordPriceChange(params: PriceHistoryRecordParams) {
    const {
      productId,
      variantId = null,
      oldPrice = null,
      newPrice,
      reason = 'PRICE_UPDATE',
      source = 'ADMIN',
      createdBy = 'Admin',
    } = params;

    const now = new Date();

    // 1. Close out current open price history record for this product/variant
    await prisma.productPriceHistory.updateMany({
      where: {
        productId,
        variantId: variantId || null,
        validUntil: null,
      },
      data: {
        validUntil: now,
      },
    });

    // 2. Insert new append-only price history entry
    const historyEntry = await prisma.productPriceHistory.create({
      data: {
        productId,
        variantId: variantId || null,
        oldPrice,
        price: newPrice,
        currency: 'INR',
        reason,
        source,
        validFrom: now,
        validUntil: null,
        createdBy,
      },
    });

    // 3. Log Audit Entry
    await prisma.auditLog.create({
      data: {
        user: createdBy,
        action: 'PRICE_CHANGED',
        entity: 'PRODUCT',
        entityId: productId,
        oldValue: oldPrice !== null && oldPrice !== undefined ? oldPrice.toString() : null,
        newValue: newPrice.toString(),
        notes: `Reason: ${reason}. Source: ${source}`,
      },
    });

    return historyEntry;
  }

  /**
   * Fetches read-only price history timeline for a product.
   */
  static async getPriceHistory(productId: string) {
    return await prisma.productPriceHistory.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true, sku: true } },
        variant: { select: { size: true, color: true, sku: true } },
      },
    });
  }

  /**
   * Fetches all verified unique historical prices for a product.
   */
  static async getVerifiedHistoricalPrices(productId: string): Promise<number[]> {
    const history = await prisma.productPriceHistory.findMany({
      where: { productId },
      select: { price: true, oldPrice: true },
    });

    const pricesSet = new Set<number>();
    for (const item of history) {
      if (typeof item.price === 'number' && !isNaN(item.price)) {
        pricesSet.add(item.price);
      }
      if (typeof item.oldPrice === 'number' && !isNaN(item.oldPrice)) {
        pricesSet.add(item.oldPrice);
      }
    }

    return Array.from(pricesSet);
  }
}
