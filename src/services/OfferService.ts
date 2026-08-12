import { prisma } from '@/lib/prisma';
import { OfferValidationService, ValidateOfferInput } from './OfferValidationService';

export interface CreateOfferParams {
  offerName: string;
  description?: string;
  productId: string;
  claimedOriginalPrice: number;
  salePrice: number;
  startDate: Date | string;
  endDate: Date | string;
  maxUsage?: number | null;
  minOrderValue?: number | null;
  createdBy?: string;
  saveAsDraft?: boolean;
}

export class OfferService {
  /**
   * Creates a new offer with mandatory server-side validation.
   */
  static async createOffer(params: CreateOfferParams) {
    const {
      offerName,
      description,
      productId,
      claimedOriginalPrice,
      salePrice,
      startDate,
      endDate,
      maxUsage,
      minOrderValue,
      createdBy = 'Admin',
      saveAsDraft = false,
    } = params;

    // 1. Run Server Validation
    const validation = await OfferValidationService.validateOffer({
      productId,
      claimedOriginalPrice,
      salePrice,
      startDate,
      endDate,
      maxUsage,
      minOrderValue,
    });

    const initialStatus = saveAsDraft ? 'DRAFT' : validation.status;
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If approved and current time is within window, set status to ACTIVE
    let finalStatus = initialStatus;
    if (initialStatus === 'APPROVED' && now >= start && now <= end) {
      finalStatus = 'ACTIVE';
    }

    // 2. Create Offer Record
    const offer = await prisma.offer.create({
      data: {
        offerName,
        description,
        productId,
        claimedOriginalPrice,
        salePrice,
        discountPercentage: validation.calculatedDiscountPercentage,
        startDate: start,
        endDate: end,
        maxUsage: maxUsage || null,
        minOrderValue: minOrderValue || 0,
        status: finalStatus,
        validationResult: validation.validationResult,
        validationReason: validation.validationReason,
        createdBy,
      },
    });

    // 3. Log Audit Entry
    await prisma.auditLog.create({
      data: {
        user: createdBy,
        action: 'OFFER_CREATED',
        entity: 'OFFER',
        entityId: offer.id,
        newValue: JSON.stringify({
          offerName,
          status: finalStatus,
          claimedOriginalPrice,
          salePrice,
          discountPercentage: validation.calculatedDiscountPercentage,
        }),
        notes: `Validation Result: ${validation.validationResult}. Reason: ${validation.validationReason}`,
      },
    });

    return { offer, validation };
  }

  /**
   * Admin Review: Approves a pending/draft offer.
   */
  static async approveOffer(offerId: string, adminUser: string = 'Admin', notes?: string) {
    const existing = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!existing) throw new Error('Offer not found');

    const now = new Date();
    let newStatus = 'APPROVED';
    if (now >= existing.startDate && now <= existing.endDate) {
      newStatus = 'ACTIVE';
    }

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: newStatus,
        reviewedBy: adminUser,
        reviewedAt: now,
        reviewNotes: notes || 'Offer approved by admin.',
      },
    });

    await prisma.auditLog.create({
      data: {
        user: adminUser,
        action: 'OFFER_APPROVED',
        entity: 'OFFER',
        entityId: offerId,
        oldValue: existing.status,
        newValue: newStatus,
        notes: notes || 'Offer approved.',
      },
    });

    return updated;
  }

  /**
   * Admin Review: Rejects an offer.
   */
  static async rejectOffer(offerId: string, adminUser: string = 'Admin', notes?: string) {
    const existing = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!existing) throw new Error('Offer not found');

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: 'REJECTED',
        reviewedBy: adminUser,
        reviewedAt: new Date(),
        reviewNotes: notes || 'Offer rejected by admin review.',
      },
    });

    await prisma.auditLog.create({
      data: {
        user: adminUser,
        action: 'OFFER_REJECTED',
        entity: 'OFFER',
        entityId: offerId,
        oldValue: existing.status,
        newValue: 'REJECTED',
        notes: notes || 'Offer rejected.',
      },
    });

    return updated;
  }

  /**
   * Admin Override: Approves offer with recorded override reason.
   */
  static async overrideOffer(offerId: string, adminUser: string = 'Admin', overrideReason: string) {
    if (!overrideReason || !overrideReason.trim()) {
      throw new Error('Override reason is required for administrative override.');
    }

    const existing = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!existing) throw new Error('Offer not found');

    const now = new Date();
    let newStatus = 'APPROVED';
    if (now >= existing.startDate && now <= existing.endDate) {
      newStatus = 'ACTIVE';
    }

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: newStatus,
        isOverride: true,
        overrideReason: overrideReason.trim(),
        reviewedBy: adminUser,
        reviewedAt: now,
        reviewNotes: `Admin Override: ${overrideReason.trim()}`,
      },
    });

    await prisma.auditLog.create({
      data: {
        user: adminUser,
        action: 'OFFER_APPROVED',
        entity: 'OFFER',
        entityId: offerId,
        oldValue: existing.status,
        newValue: `${newStatus} (OVERRIDE)`,
        notes: `Admin Override Reason: ${overrideReason.trim()}`,
      },
    });

    return updated;
  }

  /**
   * Suspends an active offer.
   */
  static async suspendOffer(offerId: string, adminUser: string = 'Admin', notes?: string) {
    const existing = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!existing) throw new Error('Offer not found');

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: 'SUSPENDED',
        reviewedBy: adminUser,
        reviewedAt: new Date(),
        reviewNotes: notes || 'Offer suspended by admin.',
      },
    });

    await prisma.auditLog.create({
      data: {
        user: adminUser,
        action: 'OFFER_SUSPENDED',
        entity: 'OFFER',
        entityId: offerId,
        oldValue: existing.status,
        newValue: 'SUSPENDED',
        notes: notes || 'Offer suspended.',
      },
    });

    return updated;
  }

  /**
   * Server background job method: automatically expires offers past endDate.
   */
  static async checkAndExpireOffers() {
    const now = new Date();
    const expiredOffers = await prisma.offer.findMany({
      where: {
        status: { in: ['APPROVED', 'ACTIVE'] },
        endDate: { lt: now },
      },
    });

    for (const offer of expiredOffers) {
      await prisma.offer.update({
        where: { id: offer.id },
        data: { status: 'EXPIRED' },
      });

      await prisma.auditLog.create({
        data: {
          user: 'SYSTEM_CRON',
          action: 'OFFER_EXPIRED',
          entity: 'OFFER',
          entityId: offer.id,
          oldValue: offer.status,
          newValue: 'EXPIRED',
          notes: `Offer end date (${offer.endDate.toISOString()}) reached.`,
        },
      });
    }

    // Also activate any APPROVED offers whose startDate has arrived
    const readyToActivate = await prisma.offer.findMany({
      where: {
        status: 'APPROVED',
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    for (const offer of readyToActivate) {
      await prisma.offer.update({
        where: { id: offer.id },
        data: { status: 'ACTIVE' },
      });

      await prisma.auditLog.create({
        data: {
          user: 'SYSTEM_CRON',
          action: 'OFFER_ACTIVATED',
          entity: 'OFFER',
          entityId: offer.id,
          oldValue: 'APPROVED',
          newValue: 'ACTIVE',
          notes: 'Offer start date reached.',
        },
      });
    }

    return { expiredCount: expiredOffers.length, activatedCount: readyToActivate.length };
  }

  /**
   * Customer-Facing Helper: Returns the active, approved offer for a product if valid.
   */
  static async getActiveApprovedOfferForProduct(productId: string) {
    const now = new Date();
    await this.checkAndExpireOffers(); // Run quick expiration check

    const offer = await prisma.offer.findFirst({
      where: {
        productId,
        status: { in: ['APPROVED', 'ACTIVE'] },
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { discountPercentage: 'desc' },
    });

    return offer;
  }
}
