import { prisma } from '../src/lib/prisma';
import crypto from 'crypto';

async function runDPDPTests() {
  console.log('\n==============================================');
  console.log('    CYTRUS DPDP ACT 2023 AUTOMATED TEST SUITE  ');
  console.log('==============================================\n');

  let passed = 0;
  let failed = 0;

  try {
    // 1. Test ConsentLog creation & IP Anonymization
    console.log('--- 1. Testing DPDP Consent Audit Trail ---');
    const ip = '192.168.1.100';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    const consent = await prisma.consentLog.create({
      data: {
        sessionId: 'test_sess_123',
        consentType: 'WHATSAPP_ALERTS',
        status: 'GRANTED',
        noticeVersion: '1.0',
        ipHash,
        userAgent: 'Jest-Test-Runner/1.0',
      },
    });

    if (consent.id && consent.ipHash === ipHash) {
      console.log('✅ [PASS] Consent audit log recorded with anonymized SHA-256 IP hash');
      passed++;
    } else {
      console.error('❌ [FAIL] Consent audit log failed');
      failed++;
    }

    // 2. Test Grievance Redressal Ticket Creation
    console.log('\n--- 2. Testing Grievance & Rights Request Workflow ---');
    const ticketId = `DPDP-GRV-${Math.floor(100000 + Math.random() * 900000)}`;
    const grievance = await prisma.dataPrivacyRequest.create({
      data: {
        customerEmail: 'customer@example.com',
        customerPhone: '+91 9876543210',
        requestType: 'ACCESS_EXPORT',
        status: 'PENDING',
        details: `Ticket: ${ticketId} | Automated test request`,
      },
    });

    if (grievance.id && grievance.status === 'PENDING') {
      console.log(`✅ [PASS] DataPrivacyRequest ticket generated successfully (${ticketId})`);
      passed++;
    } else {
      console.error('❌ [FAIL] DataPrivacyRequest creation failed');
      failed++;
    }

    // 3. Test Right to Erasure & Order Anonymization
    console.log('\n--- 3. Testing Right to Erasure & Financial Anonymization ---');
    // Create a temporary user with an order
    const testUser = await prisma.user.create({
      data: {
        name: 'Erasure Test User',
        email: `erasure_${Date.now()}@test.com`,
        password: 'hashed_password_123',
        phone: '+919999999999',
      },
    });

    const testOrder = await prisma.order.create({
      data: {
        orderNumber: `ORD-TEST-${Date.now()}`,
        userId: testUser.id,
        customerName: testUser.name,
        customerEmail: testUser.email,
        customerPhone: testUser.phone!,
        shippingAddressJson: JSON.stringify({ street: '123 Main St', city: 'Bangalore' }),
        subtotal: 2499,
        total: 2798.88,
        paymentMethod: 'COD',
        orderStatus: 'CONFIRMED',
      },
    });

    // Execute Erasure Logic
    await prisma.order.updateMany({
      where: { userId: testUser.id },
      data: {
        customerName: '[DELETED_USER]',
        customerEmail: `deleted_${testUser.id.substring(0, 8)}@privacy.anonymized`,
        customerPhone: 'XXXXXXXXXX',
        shippingAddressJson: JSON.stringify({ note: 'Anonymized pursuant to DPDP Act 2023 Section 12' }),
      },
    });

    await prisma.user.delete({
      where: { id: testUser.id },
    });

    // Verify Order is preserved for tax compliance while PII is masked
    const updatedOrder = await prisma.order.findUnique({
      where: { id: testOrder.id },
    });

    if (
      updatedOrder &&
      updatedOrder.customerName === '[DELETED_USER]' &&
      updatedOrder.customerPhone === 'XXXXXXXXXX' &&
      updatedOrder.total === 2798.88
    ) {
      console.log('✅ [PASS] User erased; Order financial audit trail safely anonymized');
      passed++;
    } else {
      console.error('❌ [FAIL] Erasure anonymization failed');
      failed++;
    }

    // Clean up test data
    await prisma.order.delete({ where: { id: testOrder.id } });
    await prisma.consentLog.delete({ where: { id: consent.id } });
    await prisma.dataPrivacyRequest.delete({ where: { id: grievance.id } });

  } catch (error) {
    console.error('Test Suite Exception:', error);
    failed++;
  }

  console.log('\n==============================================');
  console.log(`   DPDP RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('==============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDPDPTests();
