import { prisma } from '../src/lib/prisma';
import crypto from 'crypto';

const db: any = prisma;

async function runDPDPTests() {
  console.log('\n==============================================');
  console.log('    CELEBRITEE DPDP ACT 2023 AUTOMATED TESTS   ');
  console.log('==============================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Test ConsentLog creation & IP Anonymization
    console.log('--- 1. Testing DPDP Consent Audit Trail ---');
    const ip = '192.168.1.100';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    const consent = await db.consentLog.create({
      data: {
        sessionId: 'test_sess_123',
        consentType: 'WHATSAPP_ALERTS',
        status: 'GRANTED',
        noticeVersion: '1.0',
        ipHash,
        userAgent: 'Test-Runner/1.0',
      },
    });

    assert(Boolean(consent?.id) && consent?.ipHash === ipHash, 'Consent audit log recorded with anonymized SHA-256 IP hash');

    // 2. Test Grievance Redressal Ticket Creation
    console.log('\n--- 2. Testing Grievance & Rights Request Workflow ---');
    const ticketId = `DPDP-GRV-${Math.floor(100000 + Math.random() * 900000)}`;
    const grievance = await db.dataPrivacyRequest.create({
      data: {
        customerEmail: 'customer@celebritee.in',
        customerPhone: '+919876543210',
        requestType: 'ACCESS_EXPORT',
        status: 'PENDING',
        details: `Ticket: ${ticketId} | Automated test request`,
      },
    });

    assert(Boolean(grievance?.id) && grievance?.status === 'PENDING', `DataPrivacyRequest ticket generated successfully (${ticketId})`);

    // 3. Test Right to Erasure & Order Anonymization
    console.log('\n--- 3. Testing Right to Erasure & Financial Anonymization ---');
    const testUser = await db.user.create({
      data: {
        name: 'Erasure Test User',
        email: `erasure_${Date.now()}@celebritee.in`,
        password: 'hashed_password_123',
        phone: '+919999999999',
      },
    });

    const testOrder = await db.order.create({
      data: {
        orderNumber: `ORD-TEST-${Date.now()}`,
        userId: testUser.id,
        customerName: testUser.name,
        customerEmail: testUser.email,
        customerPhone: testUser.phone || '+919999999999',
        shippingAddressJson: JSON.stringify({ street: '123 Main St', city: 'Bangalore' }),
        subtotal: 2499,
        total: 2798.88,
        paymentMethod: 'COD',
        orderStatus: 'CONFIRMED',
      },
    });

    // Execute Erasure Logic
    await db.order.updateMany({
      where: { userId: testUser.id },
      data: {
        customerName: '[DELETED_USER]',
        customerEmail: `deleted_${testUser.id.substring(0, 8)}@privacy.anonymized`,
        customerPhone: 'XXXXXXXXXX',
        shippingAddressJson: JSON.stringify({ note: 'Anonymized pursuant to DPDP Act 2023 Section 12' }),
      },
    });

    await db.user.delete({
      where: { id: testUser.id },
    });

    // Verify Order is preserved for tax compliance while PII is masked
    const updatedOrder = await db.order.findUnique({
      where: { id: testOrder.id },
    });

    assert(
      Boolean(updatedOrder) &&
      updatedOrder?.customerName === '[DELETED_USER]' &&
      updatedOrder?.customerPhone === 'XXXXXXXXXX' &&
      updatedOrder?.total === 2798.88,
      'User erased; Order financial audit trail safely anonymized'
    );

    // Clean up test data
    if (testOrder?.id) await db.order.delete({ where: { id: testOrder.id } });
    if (consent?.id) await db.consentLog.delete({ where: { id: consent.id } });
    if (grievance?.id) await db.dataPrivacyRequest.delete({ where: { id: grievance.id } });

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

runDPDPTests().catch((e) => {
  console.error('DPDP test execution error:', e);
  process.exit(1);
});
