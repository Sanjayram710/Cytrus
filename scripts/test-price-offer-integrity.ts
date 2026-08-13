import { prisma } from '../src/lib/prisma';
import { PriceHistoryService } from '../src/services/PriceHistoryService';
import { OfferValidationService } from '../src/services/OfferValidationService';
import { OfferService } from '../src/services/OfferService';
import { DiscountCalculationService } from '../src/services/DiscountCalculationService';
import { recalculateCartAndVerifyStock } from '../src/lib/cart-server';

async function runTests() {
  console.log('====================================================');
  console.log('STARTING AUTOMATED PRICE & OFFER INTEGRITY TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ✓ ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ✗ ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  try {
    // Cleanup temporary test data if any
    const testSku = `TEST-INTEGRITY-${Date.now()}`;
    const category = await prisma.category.findFirst();

    if (!category) {
      throw new Error('No category found in database to run tests.');
    }

    // -------------------------------------------------------------
    // TEST 1: Initial Price History Logging
    // -------------------------------------------------------------
    console.log('--- TEST 1: Initial Price History Logging ---');
    const testProduct = await prisma.product.create({
      data: {
        name: 'Test Integrity Silk Dress',
        slug: `test-integrity-dress-${Date.now()}`,
        description: 'Test luxury dress for price verification',
        price: 3000,
        sku: testSku,
        stock: 20,
        categoryId: category.id,
      },
    });

    await PriceHistoryService.recordPriceChange({
      productId: testProduct.id,
      newPrice: 3000,
      oldPrice: null,
      reason: 'INITIAL_PRICE',
      source: 'SYSTEM',
    });

    const initialHistory = await PriceHistoryService.getPriceHistory(testProduct.id);
    assert(initialHistory.length === 1, 'Initial price history recorded');
    assert(initialHistory[0].price === 3000, 'Initial recorded price matches ₹3,000');
    assert(initialHistory[0].reason === 'INITIAL_PRICE', 'Initial record reason is INITIAL_PRICE');

    // -------------------------------------------------------------
    // TEST 2: Genuine Price Change & Append-Only History
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: Genuine Price Change & Append-Only History ---');
    await PriceHistoryService.recordPriceChange({
      productId: testProduct.id,
      oldPrice: 3000,
      newPrice: 3500,
      reason: 'PRICE_UPDATE',
      source: 'ADMIN',
    });

    const updatedHistory = await PriceHistoryService.getPriceHistory(testProduct.id);
    assert(updatedHistory.length === 2, 'History count incremented to 2 without deletion');
    assert(updatedHistory[0].price === 3500, 'Latest price record is ₹3,500');
    assert(updatedHistory[1].price === 3000, 'Older price record retained at ₹3,000');
    assert(updatedHistory[1].validUntil !== null, 'Older record closed out with validUntil timestamp');

    // Reset price back to 3000 for suspicious test
    await PriceHistoryService.recordPriceChange({
      productId: testProduct.id,
      oldPrice: 3500,
      newPrice: 3000,
      reason: 'PRICE_UPDATE',
      source: 'ADMIN',
    });
    await prisma.product.update({ where: { id: testProduct.id }, data: { price: 3000 } });

    // -------------------------------------------------------------
    // TEST 3: Suspicious Offer Detection (Unverified Original Price)
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: Suspicious Offer Detection (Unverified Claimed Original Price) ---');
    // Admin claims original price ₹6,000, sale price ₹3,000 for product currently at ₹3,000 with NO ₹6,000 in history
    const suspiciousInput = {
      productId: testProduct.id,
      claimedOriginalPrice: 6000,
      salePrice: 3000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    const suspiciousValidation = await OfferValidationService.validateOffer(suspiciousInput);
    assert(
      suspiciousValidation.status === 'PENDING_REVIEW',
      'Suspicious offer flagged as PENDING_REVIEW',
      `Got status: ${suspiciousValidation.status}`
    );
    assert(
      suspiciousValidation.validationResult === 'WARNING',
      'Validation result is WARNING',
      `Got result: ${suspiciousValidation.validationResult}`
    );

    // Save suspicious offer
    const { offer: suspiciousOffer } = await OfferService.createOffer({
      offerName: 'Suspicious 50% Off Claim',
      ...suspiciousInput,
    });

    // Verify Customer API does NOT return this offer
    const activeOfferForCustomer = await OfferService.getActiveApprovedOfferForProduct(testProduct.id);
    assert(
      activeOfferForCustomer === null,
      'Customer website DOES NOT display unapproved PENDING_REVIEW offer'
    );

    // -------------------------------------------------------------
    // TEST 4: Verified Historical Price Update & Genuine Offer Approval
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Genuine Historical Price Update & Offer Approval ---');
    // Admin genuinely updates product price to ₹6,000 in price history
    await PriceHistoryService.recordPriceChange({
      productId: testProduct.id,
      oldPrice: 3000,
      newPrice: 6000,
      reason: 'ADMIN_UPDATE',
      source: 'ADMIN',
    });
    await prisma.product.update({ where: { id: testProduct.id }, data: { price: 6000 } });

    // Now admin creates offer claiming original price ₹6,000, sale price ₹3,000
    const genuineValidation = await OfferValidationService.validateOffer({
      productId: testProduct.id,
      claimedOriginalPrice: 6000,
      salePrice: 3000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    assert(
      genuineValidation.status === 'APPROVED',
      'Genuine offer with historical price verification approved',
      `Got status: ${genuineValidation.status}`
    );
    assert(
      genuineValidation.calculatedDiscountPercentage === 50,
      'Calculated discount percentage is 50%'
    );

    const { offer: genuineOffer } = await OfferService.createOffer({
      offerName: 'Genuine 50% Off Flash Sale',
      productId: testProduct.id,
      claimedOriginalPrice: 6000,
      salePrice: 3000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Verify Customer API returns active approved offer
    const customerVerifiedOffer = await OfferService.getActiveApprovedOfferForProduct(testProduct.id);
    assert(
      customerVerifiedOffer !== null && customerVerifiedOffer.id === genuineOffer.id,
      'Customer website displays APPROVED & ACTIVE offer'
    );
    assert(
      customerVerifiedOffer?.discountPercentage === 50,
      'Customer website receives verified 50% OFF badge'
    );

    // -------------------------------------------------------------
    // TEST 5: Automatic Offer Expiration
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Automatic Offer Expiration ---');
    // Create offer with past end date
    const expiredOfferRecord = await prisma.offer.create({
      data: {
        offerName: 'Expired Holiday Flash Sale',
        productId: testProduct.id,
        claimedOriginalPrice: 6000,
        salePrice: 3000,
        discountPercentage: 50,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        validationResult: 'VALID',
      },
    });

    const cronResult = await OfferService.checkAndExpireOffers();
    const checkedExpiredOffer = await prisma.offer.findUnique({ where: { id: expiredOfferRecord.id } });
    assert(
      checkedExpiredOffer?.status === 'EXPIRED',
      'Offer past end date automatically transitioned to EXPIRED',
      `Got status: ${checkedExpiredOffer?.status}`
    );

    // -------------------------------------------------------------
    // TEST 6: Server-Side Financial Security Math
    // -------------------------------------------------------------
    console.log('\n--- TEST 6: Server-Side Financial Security Math ---');
    const mathCheck1 = DiscountCalculationService.calculateDiscount(6000, 3000);
    assert(mathCheck1.discountPercentage === 50, 'Safe discount math: 6000 to 3000 = 50%');

    const mathCheck2 = DiscountCalculationService.calculateDiscount(3000, 6000);
    assert(mathCheck2.isValid === false, 'Disallows sale price > original price');

    const mathCheck3 = DiscountCalculationService.calculateDiscount(0, 500);
    assert(mathCheck3.isValid === false, 'Disallows original price 0 (division by zero)');

    // -------------------------------------------------------------
    // TEST 7: Order Item Price Snapshot Isolation
    // -------------------------------------------------------------
    console.log('\n--- TEST 7: Order Item Price Snapshot Isolation ---');
    // 1. Recalculate cart for item
    const cartSummary = await recalculateCartAndVerifyStock([
      { productId: testProduct.id, size: 'M', color: 'Black', quantity: 1 },
    ]);

    // Active offer salePrice ₹3,000 applies
    assert(cartSummary.items[0].unitPrice === 3000, 'Cart item unitPrice uses active offer salePrice ₹3,000');

    // Create Order with snapshot
    const orderNumber = `TEST-ORDER-${Date.now()}`;
    const orderSnapshot = await prisma.order.create({
      data: {
        orderNumber,
        customerName: 'Test Buyer',
        customerEmail: 'buyer@celebritee.in',
        customerPhone: '9998887776',
        shippingAddressJson: JSON.stringify({ street: '123 Atelier Way' }),
        subtotal: cartSummary.subtotal,
        discount: cartSummary.discount,
        shippingFee: cartSummary.shippingFee,
        tax: cartSummary.tax,
        total: cartSummary.total,
        items: {
          create: cartSummary.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.unitPrice,
            total: item.totalPrice,
          })),
        },
      },
      include: { items: true },
    });

    // 2. Admin later updates product price to ₹7,000
    await prisma.product.update({ where: { id: testProduct.id }, data: { price: 7000 } });

    // 3. Inspect saved order item
    const savedOrderItem = await prisma.orderItem.findFirst({ where: { orderId: orderSnapshot.id } });
    assert(
      savedOrderItem?.price === 3000,
      'Order item retains exact purchase price snapshot (₹3,000) despite future product price change to ₹7,000'
    );

    // -------------------------------------------------------------
    // TEST 8: Audit Log Verification
    // -------------------------------------------------------------
    console.log('\n--- TEST 8: Audit Log Verification ---');
    const auditLogs = await prisma.auditLog.findMany({
      where: { entityId: testProduct.id },
    });
    assert(auditLogs.length >= 3, 'Audit logs recorded for price changes and product updates');

    // Clean up test product and offers
    await prisma.offer.deleteMany({ where: { productId: testProduct.id } });
    await prisma.orderItem.deleteMany({ where: { productId: testProduct.id } });
    await prisma.order.delete({ where: { id: orderSnapshot.id } });
    await prisma.productPriceHistory.deleteMany({ where: { productId: testProduct.id } });
    await prisma.product.delete({ where: { id: testProduct.id } });

    console.log('\n====================================================');
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err: any) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
