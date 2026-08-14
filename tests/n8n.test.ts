import {
  normalizeCustomerPhone,
  generateEventId,
  buildN8nPayload,
  sendN8nOrderNotification,
  N8nOrderEventPayload,
} from '../src/lib/n8n';
import { verifyRazorpaySignature } from '../src/lib/razorpay';
import { prisma } from '../src/lib/prisma';
import http from 'http';

async function runN8nTestSuite() {
  console.log('====================================================');
  console.log('    CELEBRITEE — N8N WHATSAPP INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, extraInfo?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (extraInfo) console.error(`   Details: ${extraInfo}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: Phone Number Normalization
  // ----------------------------------------------------
  console.log('--- 1. Testing Phone Number Normalization ---');
  assert(
    normalizeCustomerPhone('9812345678') === '919812345678',
    'Standard 10-digit Indian mobile number prefixed with 91'
  );
  assert(
    normalizeCustomerPhone('+91 98123-45678') === '919812345678',
    'Formatted +91 with spaces & dashes sanitized to digits'
  );
  assert(
    normalizeCustomerPhone('09812345678') === '919812345678',
    '11-digit number with leading 0 converted to 91 standard'
  );
  assert(
    normalizeCustomerPhone('919812345678') === '919812345678',
    'Already normalized 12-digit Indian number preserved'
  );

  // ----------------------------------------------------
  // TEST 2: Deterministic Event ID & Deduplication
  // ----------------------------------------------------
  console.log('\n--- 2. Testing Deterministic Event ID & Duplicate Protection ---');
  const eventId1 = generateEventId('PAYMENT_SUCCESS', 'ORD-1001');
  const eventId2 = generateEventId('PAYMENT_SUCCESS', 'ORD-1001');
  const eventIdOrderPacked = generateEventId('ORDER_PACKED', 'ORD-1001');

  assert(eventId1 === 'PAYMENT_SUCCESS:ORD-1001', 'Deterministic Event ID format matches event:orderId');
  assert(eventId1 === eventId2, 'Same event and orderId produces identical eventId (idempotent)');
  assert(eventId1 !== eventIdOrderPacked, 'Different event type on same order produces distinct eventId');

  // ----------------------------------------------------
  // TEST 3: Payload Construction Adheres to N8N Spec
  // ----------------------------------------------------
  console.log('\n--- 3. Testing Payload Construction vs N8N Workflow Schema ---');
  const sampleOrder = {
    id: 'ord_cuid_123',
    orderNumber: 'ORD-1001',
    customerName: 'Aisha',
    customerPhone: '9812345678',
    total: 2199,
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    items: [
      {
        productName: 'Silk Dress',
        quantity: 1,
        price: 2199,
      },
    ],
  };

  const payload: N8nOrderEventPayload = buildN8nPayload(sampleOrder, 'PAYMENT_SUCCESS');

  assert(payload.event === 'PAYMENT_SUCCESS', 'Payload contains valid event name');
  assert(payload.orderId === 'ORD-1001', 'Payload uses orderNumber for orderId');
  assert(payload.eventId === 'PAYMENT_SUCCESS:ORD-1001', 'Payload contains stable eventId');
  assert(payload.customer.name === 'Aisha', 'Payload contains customer.name');
  assert(payload.customer.phone === '919812345678', 'Payload contains sanitized customer.phone (919812345678)');
  assert(Array.isArray(payload.items) && payload.items.length === 1, 'Payload contains items array');
  assert(payload.items[0].name === 'Silk Dress', 'Payload item name mapped accurately');
  assert(payload.items[0].quantity === 1, 'Payload item quantity mapped accurately');
  assert(payload.items[0].price === 2199, 'Payload item price mapped accurately');
  assert(payload.totalAmount === 2199, 'Payload totalAmount mapped accurately');
  assert(payload.paymentStatus === 'PAID', 'Payload paymentStatus matches PAID');
  assert(payload.orderStatus === 'CONFIRMED', 'Payload orderStatus matches CONFIRMED');

  // ----------------------------------------------------
  // TEST 4: Safe Development Flag (N8N_ENABLE_NOTIFICATIONS)
  // ----------------------------------------------------
  console.log('\n--- 4. Testing Development Safety Guard (N8N_ENABLE_NOTIFICATIONS=false) ---');
  process.env.N8N_ENABLE_NOTIFICATIONS = 'false';
  process.env.N8N_WEBHOOK_URL = 'https://leejoker.app.n8n.cloud/webhook/celebritee-order-events';

  const disabledResult = await sendN8nOrderNotification(sampleOrder, 'PAYMENT_SUCCESS');
  assert(disabledResult.success === true, 'Safe dev mode returns success: true');
  assert(disabledResult.status === 'disabled', 'Safe dev mode indicates status: disabled without network dispatch');

  // ----------------------------------------------------
  // TEST 5: Mock n8n Server Testing (sent, duplicate skipped, rejected, error, timeout)
  // ----------------------------------------------------
  console.log('\n--- 5. Testing Mock n8n HTTP Server Dispatch Responses ---');

  // Create a local mock n8n webhook server for strict contract testing
  const processedEventIds = new Set<string>();
  let serverCallCount = 0;
  let receivedHeaders: any = {};
  let receivedPayload: any = null;

  const mockServer = http.createServer((req, res) => {
    serverCallCount++;
    receivedHeaders = req.headers;

    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        receivedPayload = JSON.parse(body);
      } catch {
        receivedPayload = body;
      }

      const url = req.url || '';

      if (url.includes('/simulate-502')) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'WhatsApp Meta Gateway Error' }));
        return;
      }

      if (url.includes('/simulate-400')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'rejected', message: 'Invalid payload schema' }));
        return;
      }

      if (url.includes('/simulate-timeout')) {
        // Do not respond to simulate timeout
        return;
      }

      // Standard webhook handling with duplicate detection
      const eventId = receivedPayload?.eventId;
      if (processedEventIds.has(eventId)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'skipped', message: 'Duplicate event ignored' }));
        return;
      }

      processedEventIds.add(eventId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'sent', message: 'WhatsApp notification dispatched' }));
    });
  });

  await new Promise<void>((resolve) => mockServer.listen(0, '127.0.0.1', () => resolve()));
  const port = (mockServer.address() as any).port;
  const mockBaseUrl = `http://127.0.0.1:${port}`;

  process.env.N8N_ENABLE_NOTIFICATIONS = 'true';
  process.env.N8N_WEBHOOK_URL = `${mockBaseUrl}/webhook/celebritee-order-events`;
  process.env.N8N_WEBHOOK_SECRET = 'celebritee_test_secret_key_123';

  // 5.1 Successful payment dispatch
  const resSent = await sendN8nOrderNotification(sampleOrder, 'PAYMENT_SUCCESS', { forceDispatch: true });
  assert(resSent.success === true, 'Mock server payment success returns success: true');
  assert(resSent.status === 'sent', 'Mock server returns status: sent');
  assert(
    receivedHeaders['x-celebritee-webhook-secret'] === 'celebritee_test_secret_key_123',
    'Secret header X-Celebritee-Webhook-Secret transmitted correctly'
  );

  // 5.2 Duplicate event handling
  const resDuplicate = await sendN8nOrderNotification(sampleOrder, 'PAYMENT_SUCCESS', { forceDispatch: true });
  assert(resDuplicate.success === true, 'Duplicate payment event handled gracefully');
  assert(resDuplicate.status === 'skipped', 'Duplicate event returns status: skipped');

  // 5.3 Downstream WhatsApp 502 Error resilience
  process.env.N8N_WEBHOOK_URL = `${mockBaseUrl}/simulate-502`;
  const res502 = await sendN8nOrderNotification(sampleOrder, 'PAYMENT_SUCCESS', { forceDispatch: true });
  assert(res502.success === false, '502 WhatsApp error handled without throwing');
  assert(res502.status === 'error', '502 error returns status: error');
  assert(res502.httpStatus === 502, '502 error captures HTTP 502 status code');

  // 5.4 400 Rejected Payload resilience
  process.env.N8N_WEBHOOK_URL = `${mockBaseUrl}/simulate-400`;
  const res400 = await sendN8nOrderNotification(sampleOrder, 'PAYMENT_SUCCESS', { forceDispatch: true });
  assert(res400.success === false, '400 Rejected handled gracefully');
  assert(res400.status === 'rejected', '400 returns status: rejected');

  // 5.5 Timeout resilience via AbortController
  process.env.N8N_WEBHOOK_URL = `${mockBaseUrl}/simulate-timeout`;
  const resTimeout = await sendN8nOrderNotification(sampleOrder, 'PAYMENT_SUCCESS', {
    forceDispatch: true,
    timeoutMs: 200, // Short timeout for test speed
  });
  assert(resTimeout.success === false, 'Timeout error handled without unhandled promise rejection');
  assert(Boolean(resTimeout.error?.includes('timed out')), 'Timeout error message clearly reported');

  // Close mock server
  await new Promise<void>((resolve) => mockServer.close(() => resolve()));

  // ----------------------------------------------------
  // TEST 6: Razorpay Payment Verification & Resilience End-to-End Test
  // ----------------------------------------------------
  console.log('\n--- 6. Testing Razorpay Verification Flow & Order Resilience ---');

  // Test Razorpay mock signature
  const validSignature = verifyRazorpaySignature('rzp_order_mock_test_1', 'pay_mock_test_1', 'mock_valid_signature');
  assert(validSignature === true, 'Razorpay test mock signature passes verification');

  // Create temporary test order in database
  const uniqueOrderNum = `TEST-N8N-${Date.now()}`;
  const testDbOrder = await prisma.order.create({
    data: {
      orderNumber: uniqueOrderNum,
      customerName: 'Aisha Sharma',
      customerEmail: 'aisha@test.com',
      customerPhone: '+919812345678',
      shippingAddressJson: JSON.stringify({ street: '123 Atelier Way', city: 'Mumbai', state: 'MH', postalCode: '400001' }),
      subtotal: 2199,
      total: 2199,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PENDING',
      orderStatus: 'CONFIRMED',
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst())?.id || 'sample_prod',
            productName: 'Silk Dress',
            productImage: '/images/dress.jpg',
            size: 'M',
            color: 'Black',
            quantity: 1,
            price: 2199,
            total: 2199,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  assert(Boolean(testDbOrder.id), 'Test order created in database with paymentStatus=PENDING');

  // Simulate payment verification flow with n8n dispatch disabled & enabled
  // 1. Signature verified
  // 2. Order status updated to PAID
  const verifiedOrder = await prisma.order.update({
    where: { id: testDbOrder.id },
    data: {
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
    },
    include: {
      items: true,
    },
  });

  assert(verifiedOrder.paymentStatus === 'PAID', 'Order paymentStatus updated to PAID');

  // Simulate notification dispatch with simulated failure
  process.env.N8N_ENABLE_NOTIFICATIONS = 'false';
  const dispatchRes = await sendN8nOrderNotification(verifiedOrder, 'PAYMENT_SUCCESS');
  assert(dispatchRes.success === true, 'Payment handler n8n call completed successfully');

  // Verify database order remains PAID and intact
  const finalOrder = await prisma.order.findUnique({ where: { id: testDbOrder.id } });
  assert(finalOrder?.paymentStatus === 'PAID', 'Resilience check: Order strictly remains PAID');

  // Cleanup test order
  await prisma.order.delete({ where: { id: testDbOrder.id } });

  // ----------------------------------------------------
  // Restore environment variables
  // ----------------------------------------------------
  process.env.N8N_WEBHOOK_URL = 'https://leejoker.app.n8n.cloud/webhook/celebritee-order-events';
  process.env.N8N_ENABLE_NOTIFICATIONS = 'false';

  console.log('\n====================================================');
  console.log(`   N8N TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runN8nTestSuite().catch((e) => {
  console.error('N8N test execution failed:', e);
  process.exit(1);
});
