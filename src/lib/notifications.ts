import nodemailer from 'nodemailer';
import { formatPrice } from '@/lib/utils';
import { generateOrderPdfInvoice } from '@/lib/pdf-generator';
import { sendN8nOrderNotification } from '@/lib/n8n';

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

function getSmtpTransporter() {
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465 || process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export async function sendOrderEmailReceipt(order: OrderNotificationPayload) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const trackingUrl = `${baseUrl}/orders/${order.id}`;
  const invoicePdfUrl = `${baseUrl}/api/orders/${order.id}/invoice`;

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
      <title>Celebritee.in Order Receipt #${order.orderNumber}</title>
    </head>
    <body style="margin:0; padding:0; background-color: #FAF8F5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 1px solid #EAE5DC; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color: #121212; padding: 30px; text-align: center;">
                  <h1 style="color: #FAF8F5; font-family: Georgia, serif; font-size: 26px; letter-spacing: 0.2em; margin: 0;">CELEBRITEE</h1>
                  <p style="color: #D4AF37; font-size: 10px; letter-spacing: 0.3em; margin: 5px 0 0 0; font-weight: bold; text-transform: uppercase;">HEAVYWEIGHT TEES ATELIER</p>
                </td>
              </tr>

              <!-- Greeting & Order Info -->
              <tr>
                <td style="padding: 30px 40px 20px 40px;">
                  <h2 style="font-family: Georgia, serif; color: #121212; font-size: 20px; margin-top: 0;">Order Confirmation & Official Receipt</h2>
                  <p style="font-size: 13px; color: #4A4A4A; line-height: 1.6;">Dear <strong>${order.customerName}</strong>,</p>
                  <p style="font-size: 13px; color: #4A4A4A; line-height: 1.6;">Thank you for your order with Celebritee.in. Your bespoke t-shirt order has been confirmed and is currently being processed by our atelier staff.</p>
                  
                  <div style="background-color: #FAF8F5; border: 1px solid #EAE5DC; padding: 15px 20px; margin: 20px 0;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-size: 12px; color: #707070; text-transform: uppercase; letter-spacing: 0.1em;">Order Reference</td>
                        <td style="font-size: 14px; font-weight: bold; color: #D4AF37; font-family: monospace; text-align: right;">${order.orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #707070; text-transform: uppercase; letter-spacing: 0.1em; padding-top: 8px;">Payment Method</td>
                        <td style="font-size: 12px; font-weight: bold; color: #121212; text-align: right; padding-top: 8px; text-transform: uppercase;">${order.paymentMethod}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding: 0 40px;">
                  <h3 style="font-family: Georgia, serif; font-size: 16px; color: #121212; border-bottom: 2px solid #121212; padding-bottom: 8px; margin-bottom: 10px;">Ordered Items</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    ${itemsHtml}
                  </table>
                </td>
              </tr>

              <!-- Calculation Totals -->
              <tr>
                <td style="padding: 20px 40px 30px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 2px solid #121212; padding-top: 15px;">
                    <tr>
                      <td style="font-size: 12px; color: #707070; padding: 4px 0;">Subtotal</td>
                      <td style="font-size: 12px; font-weight: bold; color: #121212; text-align: right; padding: 4px 0;">${formatPrice(order.subtotal)}</td>
                    </tr>
                    ${
                      order.discount > 0
                        ? `<tr>
                            <td style="font-size: 12px; color: #2E7D32; padding: 4px 0;">Voucher Discount</td>
                            <td style="font-size: 12px; font-weight: bold; color: #2E7D32; text-align: right; padding: 4px 0;">-${formatPrice(order.discount)}</td>
                           </tr>`
                        : ''
                    }
                    <tr>
                      <td style="font-size: 12px; color: #707070; padding: 4px 0;">Estimated Tax (12% GST)</td>
                      <td style="font-size: 12px; font-weight: bold; color: #121212; text-align: right; padding: 4px 0;">${formatPrice(order.tax)}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 12px; color: #707070; padding: 4px 0;">Express Courier Shipping</td>
                      <td style="font-size: 12px; font-weight: bold; color: #121212; text-align: right; padding: 4px 0;">${formatPrice(order.shippingFee)}</td>
                    </tr>
                    <tr style="border-top: 1px solid #EAE5DC;">
                      <td style="font-size: 16px; font-family: Georgia, serif; font-weight: bold; color: #121212; padding-top: 12px;">Total Paid / Payable</td>
                      <td style="font-size: 18px; font-weight: bold; color: #D4AF37; text-align: right; padding-top: 12px;">${formatPrice(order.total)}</td>
                    </tr>
                  </table>

                  <!-- Shipping Address Summary -->
                  <div style="background-color: #FAF8F5; border: 1px solid #EAE5DC; padding: 15px; margin-top: 25px; font-size: 12px; color: #4A4A4A;">
                    <strong style="color: #121212; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; display: block; margin-bottom: 5px;">Shipping Destination:</strong>
                    ${parsedAddress.fullName || order.customerName}<br/>
                    ${parsedAddress.street || ''}, ${parsedAddress.city || ''}, ${parsedAddress.state || ''} - ${parsedAddress.postalCode || ''}<br/>
                    Contact Phone: <strong>${order.customerPhone}</strong>
                  </div>

                  <!-- Live Tracking & PDF Download CTAs -->
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${invoicePdfUrl}" style="background-color: #6B5B45; color: #FFFFFF; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; padding: 13px 22px; display: inline-block; border-radius: 2px; margin-right: 8px; margin-bottom: 10px;">
                      📄 DOWNLOAD TAX INVOICE (PDF)
                    </a>
                    <a href="${trackingUrl}" style="background-color: #121212; color: #FAF8F5; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; padding: 13px 22px; display: inline-block; border-radius: 2px; margin-bottom: 10px;">
                      TRACK YOUR ORDER LIVE →
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #FAF8F5; border-top: 1px solid #EAE5DC; padding: 20px; text-align: center; font-size: 11px; color: #999999;">
                  &copy; 2026 Celebritee.in Heavyweight Tees. All Rights Reserved.<br/>
                  45 Marine Drive, Mumbai 400020 &bull; Support: support@celebritee.in
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
      const transporter = getSmtpTransporter();

      // Generate PDF Tax Invoice attachment
      let attachments: any[] = [];
      try {
        const pdfBuffer = await generateOrderPdfInvoice(order);
        attachments.push({
          filename: `Celebritee_Tax_Invoice_${order.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        });
      } catch (pdfErr) {
        console.error('PDF invoice generation warning:', pdfErr);
      }

      await transporter.sendMail({
        from: `"Celebritee.in Atelier" <${process.env.SMTP_FROM || 'orders@celebritee.in'}>`,
        to: order.customerEmail,
        subject: `Celebritee.in Order Confirmation & Tax Invoice #${order.orderNumber}`,
        html: htmlTemplate,
        attachments,
      });

      console.log(`✅ [EMAIL DISPATCHED] Order receipt & PDF Tax Invoice sent to ${order.customerEmail}`);
      return { success: true, mode: 'SMTP' };
    } catch (err: any) {
      console.error(`❌ [EMAIL ERROR] Failed to send email via SMTP:`, err.message);
    }
  }

  // Simulated Email Receipt Dispatch log (for local dev & test environment)
  console.log('====================================================');
  console.log(`📧 [EMAIL RECEIPT SIMULATED DISPATCH]`);
  console.log(`TO: ${order.customerEmail}`);
  console.log(`SUBJECT: Celebritee.in Order Confirmation & Receipt #${order.orderNumber}`);
  console.log(`TOTAL AMOUNT: ${formatPrice(order.total)} | PAYMENT: ${order.paymentMethod}`);
  console.log(`TRACKING URL: ${trackingUrl}`);
  console.log('====================================================');

  return { success: true, mode: 'SIMULATED' };
}

export async function sendOrderSMSNotification(order: OrderNotificationPayload) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const trackingUrl = `${baseUrl}/orders/${order.id}`;

  const smsText = `[Celebritee.in] Hello ${order.customerName}, your order #${order.orderNumber} for ${formatPrice(order.total)} has been confirmed! Track your shipment live: ${trackingUrl}`;

  // 1. Fast2SMS Integration (Instant Indian SMS Gateway)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const cleanPhone = order.customerPhone.replace(/\D/g, '').slice(-10);
      const orderRefDigits = order.orderNumber.replace(/\D/g, '') || '101';

      const f2sRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: orderRefDigits.slice(-6),
          numbers: cleanPhone,
        }),
      });
      const f2sData = await f2sRes.json();
      if (f2sData && f2sData.return) {
        console.log(`✅ [FAST2SMS DISPATCHED] Order #${order.orderNumber} SMS sent to ${order.customerPhone}`);
        return { success: true, mode: 'FAST2SMS' };
      } else {
        console.error('Fast2SMS dispatch warning:', f2sData);
      }
    } catch (err: any) {
      console.error(`❌ [FAST2SMS ERROR] Failed to send SMS via Fast2SMS:`, err.message);
    }
  }

  // 2. Twilio Integration (Global SMS Gateway)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      let twilioModule: any = null;
      try {
        twilioModule = eval('require')('twilio');
      } catch (e) {
        twilioModule = null;
      }
      if (twilioModule) {
        const client = twilioModule(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: smsText,
          from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
          to: order.customerPhone,
        });
        console.log(`✅ [SMS DISPATCHED] SMS receipt sent to ${order.customerPhone}`);
        return { success: true, mode: 'TWILIO' };
      }
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

export async function sendOrderWhatsAppNotification(order: OrderNotificationPayload) {
  // 1. Primary: Dispatch to n8n WhatsApp Webhook Workflow
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      const n8nResult = await sendN8nOrderNotification(order, 'ORDER_CONFIRMED');
      if (n8nResult.success) {
        return { success: true, mode: 'N8N_WEBHOOK', n8nStatus: n8nResult.status };
      }
    } catch (n8nErr: any) {
      console.error('[N8N WhatsApp] Dispatch error in notification service:', n8nErr?.message || n8nErr);
    }
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const trackingUrl = `${baseUrl}/orders/${order.id}`;
  const cleanPhone = order.customerPhone.replace(/\D/g, '').slice(-10);

  const whatsappText = `*Celebritee.in Atelier Order Confirmation*\n\nHello ${order.customerName},\nThank you for your order *#${order.orderNumber}*!\n\n*Total Amount:* ${formatPrice(order.total)}\n*Payment Method:* ${order.paymentMethod}\n\nTrack your shipment live:\n${trackingUrl}`;

  // 2. UltraMsg WhatsApp API Integration (Fallback)
  if (process.env.WHATSAPP_ULTRAMSG_INSTANCE_ID && process.env.WHATSAPP_ULTRAMSG_TOKEN) {
    try {
      const instanceId = process.env.WHATSAPP_ULTRAMSG_INSTANCE_ID;
      const token = process.env.WHATSAPP_ULTRAMSG_TOKEN;
      const params = new URLSearchParams({
        token,
        to: `+91${cleanPhone}`,
        body: whatsappText,
      });

      const waRes = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const waData = await waRes.json();
      if (waData && waData.sent === 'true') {
        console.log(`✅ [WHATSAPP DISPATCHED] UltraMsg WhatsApp sent to ${order.customerPhone}`);
        return { success: true, mode: 'ULTRAMSG' };
      }
    } catch (err: any) {
      console.error(`❌ [WHATSAPP ERROR] UltraMsg error:`, err.message);
    }
  }

  // 3. Twilio WhatsApp Integration (Fallback)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
    try {
      let twilioModule: any = null;
      try {
        twilioModule = eval('require')('twilio');
      } catch (e) {
        twilioModule = null;
      }
      if (twilioModule) {
        const client = twilioModule(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: whatsappText,
          from: process.env.TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:')
            ? process.env.TWILIO_WHATSAPP_NUMBER
            : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:+91${cleanPhone}`,
        });
        console.log(`✅ [WHATSAPP DISPATCHED] Twilio WhatsApp sent to ${order.customerPhone}`);
        return { success: true, mode: 'TWILIO_WHATSAPP' };
      }
    } catch (err: any) {
      console.error(`❌ [WHATSAPP ERROR] Twilio WhatsApp error:`, err.message);
    }
  }

  const directWaLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;
  console.log('====================================================');
  console.log(`🟢 [WHATSAPP ORDER NOTIFICATION LINK READY]`);
  console.log(`CUSTOMER PHONE: +91 ${cleanPhone}`);
  console.log(`DIRECT WHATSAPP LINK: ${directWaLink}`);
  console.log('====================================================');

  return { success: true, mode: 'WA_LINK', link: directWaLink };
}

export async function sendOrderStatusEmail(order: any, newStatus: string, trackingNumber?: string, courierName?: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const trackingUrl = `${baseUrl}/orders/${order.id}`;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0; padding:0; background-color: #FAF8F5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 1px solid #EAE5DC; border-radius: 4px; overflow: hidden;">
              <tr>
                <td style="background-color: #121212; padding: 30px; text-align: center;">
                  <h1 style="color: #FAF8F5; font-family: Georgia, serif; font-size: 26px; letter-spacing: 0.2em; margin: 0;">CELEBRITEE</h1>
                  <p style="color: #D4AF37; font-size: 10px; letter-spacing: 0.3em; margin: 5px 0 0 0; font-weight: bold; text-transform: uppercase;">ATELIER ORDER UPDATE</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 40px;">
                  <h2 style="font-family: Georgia, serif; color: #121212; font-size: 20px;">Order Status Update: ${newStatus}</h2>
                  <p style="font-size: 13px; color: #4A4A4A;">Dear <strong>${order.customerName}</strong>,</p>
                  <p style="font-size: 13px; color: #4A4A4A;">Your order <strong>#${order.orderNumber}</strong> status has been updated to: <strong style="color: #D4AF37;">${newStatus}</strong>.</p>
                  ${
                    trackingNumber
                      ? `<div style="background-color: #FAF8F5; border: 1px solid #EAE5DC; padding: 15px; margin: 20px 0; font-size: 13px;">
                          <strong>Courier:</strong> ${courierName || 'Express Courier'}<br/>
                          <strong>Tracking Number:</strong> <span style="font-family: monospace; font-weight: bold;">${trackingNumber}</span>
                        </div>`
                      : ''
                  }
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${trackingUrl}" style="background-color: #121212; color: #FAF8F5; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; padding: 14px 30px; display: inline-block;">
                      VIEW ORDER STATUS →
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const transporter = getSmtpTransporter();

      await transporter.sendMail({
        from: `"Celebritee.in Atelier" <${process.env.SMTP_FROM || 'orders@celebritee.in'}>`,
        to: order.customerEmail,
        subject: `Celebritee.in Order #${order.orderNumber} Status Updated: ${newStatus}`,
        html: htmlTemplate,
      });

      console.log(`✅ [EMAIL DISPATCHED] Order status update sent to ${order.customerEmail}`);
      return { success: true, mode: 'SMTP' };
    } catch (err: any) {
      console.error(`❌ [EMAIL ERROR] Failed to send status email via SMTP:`, err.message);
    }
  }

  console.log(`📧 [SIMULATED STATUS EMAIL] Order #${order.orderNumber} -> ${newStatus} to ${order.customerEmail}`);
  return { success: true, mode: 'SIMULATED' };
}

