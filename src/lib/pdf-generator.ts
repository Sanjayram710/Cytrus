import PDFDocument from 'pdfkit';
import { OrderNotificationPayload } from './notifications';
import { formatPrice } from './utils';

export async function generateOrderPdfInvoice(order: OrderNotificationPayload): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err: Error) => reject(err));

      // Header Banner Background
      doc.rect(40, 40, 515, 80).fill('#121212');

      // Brand Title & Tagline
      doc
        .fillColor('#FAF8F5')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('CYTRUS', 60, 58, { characterSpacing: 4 });

      doc
        .fillColor('#D4AF37')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('ATELIER HEAVYWEIGHT APPAREL & SILHOUETTES', 60, 88, { characterSpacing: 2 });

      // Invoice Title (Right aligned in Header)
      doc
        .fillColor('#FFFFFF')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('TAX INVOICE', 380, 60, { align: 'right' });

      doc
        .fillColor('#D4AF37')
        .fontSize(10)
        .font('Helvetica')
        .text(`#${order.orderNumber}`, 380, 80, { align: 'right' });

      // Section: Metadata Grid
      let y = 140;

      // Order Details Box (Left Column)
      doc
        .fillColor('#121212')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('ORDER DETAILS', 40, y);

      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#555555')
        .text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { dateStyle: 'medium' })}`, 40, y + 16)
        .text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 40, y + 30)
        .text(`Order Reference: #${order.orderNumber}`, 40, y + 44);

      // Customer & Shipping Address (Right Column)
      doc
        .fillColor('#121212')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('SHIPPING DESTINATION', 300, y);

      let parsedAddr: any = {};
      try {
        parsedAddr = JSON.parse(order.shippingAddressJson);
      } catch (e) {
        parsedAddr = {};
      }

      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#555555')
        .text(parsedAddr.fullName || order.customerName, 300, y + 16)
        .text(`${parsedAddr.street || ''}, ${parsedAddr.city || ''}`, 300, y + 30)
        .text(`${parsedAddr.state || ''} - ${parsedAddr.postalCode || ''}, ${parsedAddr.country || 'India'}`, 300, y + 44)
        .text(`Phone: ${order.customerPhone}`, 300, y + 58)
        .text(`Email: ${order.customerEmail}`, 300, y + 72);

      // Table Header Line
      y = 235;
      doc.rect(40, y, 515, 22).fill('#FAF8F5');
      doc.rect(40, y, 515, 22).stroke('#D9CFC0');

      doc
        .fillColor('#121212')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('ITEM DESCRIPTION', 50, y + 7)
        .text('SIZE', 260, y + 7)
        .text('COLOR', 320, y + 7)
        .text('QTY', 380, y + 7)
        .text('UNIT PRICE', 420, y + 7)
        .text('TOTAL', 490, y + 7, { align: 'right' });

      // Table Rows
      y += 28;
      order.items.forEach((item) => {
        doc
          .fillColor('#222222')
          .fontSize(9)
          .font('Helvetica-Bold')
          .text(item.productName, 50, y, { width: 200, height: 16 });

        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor('#555555')
          .text(item.size, 260, y)
          .text(item.color, 320, y)
          .text(item.quantity.toString(), 380, y)
          .text(formatPrice(item.price), 420, y)
          .text(formatPrice(item.total), 490, y, { align: 'right' });

        y += 20;
        doc.moveTo(40, y - 4).lineTo(555, y - 4).strokeColor('#EAE5DC').stroke();
      });

      // Totals Box
      y += 10;

      // Draw Separator Line
      doc.moveTo(350, y).lineTo(555, y).strokeColor('#121212').lineWidth(1).stroke();
      y += 10;

      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#555555')
        .text('Subtotal:', 350, y)
        .text(formatPrice(order.subtotal), 490, y, { align: 'right' });

      if (order.discount > 0) {
        y += 16;
        doc
          .fillColor('#2E7D32')
          .text('Voucher Discount:', 350, y)
          .text(`-${formatPrice(order.discount)}`, 490, y, { align: 'right' });
      }

      y += 16;
      doc
        .fillColor('#555555')
        .text('Estimated GST (12%):', 350, y)
        .text(formatPrice(order.tax), 490, y, { align: 'right' });

      y += 16;
      doc
        .text('Express Shipping:', 350, y)
        .text(formatPrice(order.shippingFee), 490, y, { align: 'right' });

      y += 20;
      doc.rect(345, y - 5, 210, 26).fill('#121212');

      doc
        .fillColor('#FAF8F5')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('TOTAL AMOUNT:', 355, y + 2)
        .fillColor('#D4AF37')
        .text(formatPrice(order.total), 490, y + 2, { align: 'right' });

      // Footer
      doc
        .fillColor('#888888')
        .fontSize(8)
        .font('Helvetica')
        .text('Thank you for choosing CYTRUS Heavyweight Atelier. For any queries, contact support@cytrus.com', 40, 780, {
          align: 'center',
          width: 515,
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
