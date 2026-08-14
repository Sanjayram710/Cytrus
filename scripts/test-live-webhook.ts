import { sendN8nOrderNotification } from '../src/lib/n8n';

async function main() {
  process.env.N8N_WEBHOOK_URL = 'https://leejoker.app.n8n.cloud/webhook/celebritee-order-events';
  process.env.N8N_ENABLE_NOTIFICATIONS = 'true';

  const testOrder = {
    orderNumber: `TEST-LIVE-${Date.now()}`,
    customerName: 'Aisha Test Customer',
    customerPhone: '919812345678',
    total: 2499,
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    items: [
      {
        productName: 'Heavyweight Luxe Tee',
        quantity: 1,
        price: 2499,
      },
    ],
  };

  console.log('Sending live webhook test payload to n8n URL:', process.env.N8N_WEBHOOK_URL);
  const result = await sendN8nOrderNotification(testOrder, 'PAYMENT_SUCCESS', { forceDispatch: true });
  console.log('\n--- Result from n8n Webhook ---');
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error('Error running live webhook script:', err);
});
