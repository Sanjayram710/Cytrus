import nodemailer from 'nodemailer';
import { formatPrice } from '@/lib/utils';

export interface OrderNotificationPayload {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressJson: string;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  createdAt: Date;
  items: Array<{
    productName: string;
    productImage?: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export async function sendOrderEmailReceipt(order: OrderNotificationPayload) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const trackingUrl = `${baseUrl}/orders/${order.id}`;

  let parsedAddress: any = {};
  try {
    parsedAddress = JSON.parse(order.shippingAddressJson);
  } catch (err) {
    parsedAddress = {};
  }

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #EAE5DC;">
        <td style="padding: 12px 0;">
          <strong style="color: #121212; font-size: 14px;">${item.productName}</strong><br/>
          <span style="font-size: 11px; color: #707070; font-family: monospace;">Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #121212; font-size: 14px;">
          ${formatPrice(item.total)}
        </td>
      </tr>
    `
    )
    .join('');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CELEBRITEE.in Order Receipt #${order.orderNumber}</title>
    </head>
    <body style="margin:0; padding:0; background-color: #F8FAFC; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,72,217,0.08); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color: #0048D9; padding: 32px; text-align: center;">
                  <h1 style="color: #FFFFFF; font-style: italic; font-weight: 900; font-size: 28px; letter-spacing: -0.5px; margin: 0;">
                    CELEBRI<span style="color: #FF4D97;">TEE.in</span>
                  </h1>
                  <p style="color: #EFF4FF; font-size: 10px; letter-spacing: 0.3em; margin: 6px 0 0 0; font-weight: bold; text-transform: uppercase;">LUXURY CELEBRITY-COMMERCE</p>
                </td>
              </tr>

              <!-- Greeting & Order Info -->
              <tr>
                <td style="padding: 30px 40px 20px 40px;">
                  <h2 style="color: #0B0F19; font-size: 20px; margin-top: 0; font-weight: bold;">Order Confirmation & Official Receipt</h2>
                  <p style="font-size: 13px; color: #4A4A4A; line-height: 1.6;">Dear <strong>${order.customerName}</strong>,</p>
                  <p style="font-size: 13px; color: #4A4A4A; line-height: 1.6;">Thank you for your order with CELEBRITEE.in. Your limited collaboration drop order has been confirmed and is currently being prepared for white-glove dispatch.</p>
                  
                  <div style="background-color: #F4F7FC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px 20px; margin: 20px 0;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold;">Order Reference</td>
                        <td style="font-size: 14px; font-weight: bold; color: #0048D9; font-family: monospace; text-align: right;">${order.orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em; padding-top: 8px; font-weight: bold;">Payment Method</td>
                        <td style="font-size: 12px; font-weight: bold; color: #0B0F19; font-family: monospace; text-align: right; padding-top: 8px;">${order.paymentMethod}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em; padding-top: 8px; font-weight: bold;">Order Date</td>
                        <td style="font-size: 12px; font-weight: bold; color: #0B0F19; font-family: monospace; text-align: right; padding-top: 8px;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding: 0 40px 20px 40px;">
                  <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #0B0F19; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 12px; font-weight: bold;">Reserved Pieces</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    ${itemsHtml}
                  </table>
                </td>
              </tr>

              <!-- Totals -->
              <tr>
                <td style="padding: 10px 40px 30px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #E2E8F0; padding-top: 15px;">
                    <tr>
                      <td style="font-size: 13px; color: #64748B; padding-bottom: 6px;">Subtotal</td>
                      <td style="font-size: 13px; color: #0B0F19; font-family: monospace; text-align: right; padding-bottom: 6px;">${formatPrice(order.subtotal)}</td>
                    </tr>
                    ${
                      order.discount > 0
                        ? `
                      <tr>
                        <td style="font-size: 13px; color: #0048D9; font-weight: bold; padding-bottom: 6px;">VIP Promo Discount</td>
                        <td style="font-size: 13px; color: #0048D9; font-family: monospace; font-weight: bold; text-align: right; padding-bottom: 6px;">-${formatPrice(order.discount)}</td>
                      </tr>
                    `
                        : ''
                    }
                    <tr>
                      <td style="font-size: 13px; color: #64748B; padding-bottom: 6px;">White-Glove Courier</td>
                      <td style="font-size: 13px; color: #0B0F19; font-family: monospace; text-align: right; padding-bottom: 6px;">${order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748B; padding-bottom: 10px;">Estimated GST (12%)</td>
                      <td style="font-size: 13px; color: #0B0F19; font-family: monospace; text-align: right; padding-bottom: 10px;">${formatPrice(order.tax)}</td>
                    </tr>
                    <tr style="border-top: 2px solid #0048D9;">
                      <td style="font-size: 15px; font-weight: bold; color: #0B0F19; padding-top: 10px;">Total Investment</td>
                      <td style="font-size: 18px; font-weight: bold; color: #0048D9; font-family: monospace; text-align: right; padding-top: 10px;">${formatPrice(order.total)}</td>
                    </tr>
                  </table>

                  <!-- Shipping Address Summary -->
                  <div style="background-color: #FAF8F5; border: 1px solid #EAE5DC; padding: 15px; margin-top: 25px; font-size: 12px; color: #4A4A4A;">
                    <strong style="color: #121212; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; display: block; margin-bottom: 5px;">Shipping Destination:</strong>
                    ${parsedAddress.fullName || order.customerName}<br/>
                    ${parsedAddress.street || ''}, ${parsedAddress.city || ''}, ${parsedAddress.state || ''} - ${parsedAddress.postalCode || ''}<br/>
                    Contact Phone: <strong>${order.customerPhone}</strong>
                  </div>

                  <!-- Live Tracking CTA -->
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${trackingUrl}" style="background-color: #121212; color: #FAF8F5; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; padding: 14px 30px; display: inline-block; border-radius: 2px;">
                      TRACK YOUR ORDER LIVE →
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #FAF8F5; border-top: 1px solid #EAE5DC; padding: 20px; text-align: center; font-size: 11px; color: #999999;">
                  &copy; 2026 CYTRUS Heavyweight Tees. All Rights Reserved.<br/>
                  45 Marine Drive, Mumbai 400020 &bull; Support: support@cytrus.com
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Send email if SMTP config is present in environment
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"CELEBRITEE.in Concierge" <${process.env.SMTP_FROM || 'concierge@celebritee.in'}>`,
        to: order.customerEmail,
        subject: `CELEBRITEE.in Order Confirmation & Receipt #${order.orderNumber}`,
        html: htmlTemplate,
      });

      console.log(`✅ [EMAIL DISPATCHED] Order receipt sent to ${order.customerEmail}`);
      return { success: true, mode: 'SMTP' };
    } catch (err: any) {
      console.error(`❌ [EMAIL ERROR] Failed to send email via SMTP:`, err.message);
    }
  }

  // Simulated Email Receipt Dispatch log (for local dev & test environment)
  console.log('====================================================');
  console.log(`📧 [EMAIL RECEIPT SIMULATED DISPATCH]`);
  console.log(`TO: ${order.customerEmail}`);
  console.log(`SUBJECT: CELEBRITEE.in Order Confirmation & Receipt #${order.orderNumber}`);
  console.log(`TOTAL AMOUNT: ${formatPrice(order.total)} | PAYMENT: ${order.paymentMethod}`);
  console.log(`TRACKING URL: ${trackingUrl}`);
  console.log('====================================================');

  return { success: true, mode: 'SIMULATED' };
}

export async function sendOrderSMSNotification(order: OrderNotificationPayload) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const trackingUrl = `${baseUrl}/orders/${order.id}`;

  const smsText = `[CELEBRITEE.in] Hello ${order.customerName}, your order #${order.orderNumber} for ${formatPrice(order.total)} has been confirmed! Track your shipment live: ${trackingUrl}`;

  // If Twilio env variables exist, send real SMS
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);

      await client.messages.create({
        body: smsText,
        from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        to: order.customerPhone,
      });

      console.log(`✅ [SMS DISPATCHED] SMS receipt sent to ${order.customerPhone}`);
      return { success: true, mode: 'TWILIO' };
    } catch (err: any) {
      console.error(`❌ [SMS ERROR] Failed to send SMS via Twilio:`, err.message);
    }
  }

  // Simulated SMS Receipt Dispatch log (for local dev & test environment)
  console.log('====================================================');
  console.log(`📱 [SMS RECEIPT SIMULATED DISPATCH]`);
  console.log(`TO PHONE NUMBER: ${order.customerPhone}`);
  console.log(`MESSAGE CONTENT: "${smsText}"`);
  console.log('====================================================');

  return { success: true, mode: 'SIMULATED' };
}
