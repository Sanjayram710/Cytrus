'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, MapPin, Download, MessageSquare, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import CelebriteeLogo from '@/components/CelebriteeLogo';

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="p-20 text-center font-mono uppercase tracking-widest text-muted text-xs">Generating Order Receipt...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border border-border rounded-2xl text-charcoal shadow-subtle">
        <h2 className="font-serif text-2xl font-normal text-charcoal mb-2">Order Not Found</h2>
        <Link href="/shop" className="font-mono text-xs uppercase font-bold tracking-widest text-royal hover:underline">
          Return to Vault
        </Link>
      </div>
    );
  }

  const shippingAddr = JSON.parse(order.shippingAddressJson || '{}');
  const cleanPhone = (order.customerPhone || '').replace(/\D/g, '').slice(-10);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const whatsappMsg = encodeURIComponent(
    `Hello ${order.customerName}, your CELEBRITEE.in Order #${order.orderNumber} for ${formatPrice(order.total)} is confirmed! Track live: ${origin}/orders/${order.id}`
  );
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${whatsappMsg}`;
  const pdfInvoiceUrl = `/api/orders/${order.id}/invoice`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-charcoal">
      <div className="bg-white border border-border p-8 sm:p-12 text-center rounded-2xl shadow-subtle text-charcoal">
        <div className="mb-6 flex justify-center">
          <CelebriteeLogo variant="rectangle" size="sm" />
        </div>

        <CheckCircle2 className="w-12 h-12 text-royal mx-auto mb-3" />
        <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center justify-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
          <span>CONFIRMED & RESERVED</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal mt-1 mb-2">
          Thank You For Your Order
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
          Order Reference: <span className="text-charcoal font-bold">{order.orderNumber}</span>
        </p>

        <p className="text-xs text-charcoal/80 leading-relaxed max-w-lg mx-auto mb-6">
          We have received your CELEBRITEE order. An official receipt and notification with dispatch tracking have been dispatched to your contact details.
        </p>

        <div className="bg-surface-tint border border-border p-4 mb-8 max-w-lg mx-auto text-left space-y-2 font-mono rounded-xl text-charcoal">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-base">📧</span>
            <span>Official Email Receipt sent to <strong className="font-bold text-charcoal">{order.customerEmail}</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-base">📱</span>
            <span>Notification dispatched to <strong className="font-bold text-charcoal">{order.customerPhone}</strong></span>
          </div>
        </div>

        {/* Action Bar: Download PDF & WhatsApp Updates */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10 max-w-xl mx-auto">
          <a
            href={pdfInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-[#0F172A] text-white px-6 py-3.5 font-mono text-xs uppercase tracking-wider font-bold hover:bg-black transition-colors rounded-md shadow-sm"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Tax Invoice (PDF)</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-[#25D366] text-white px-6 py-3.5 font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 transition-opacity rounded-md shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>WhatsApp Order Notification</span>
          </a>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left border-t border-b border-border py-8 mb-10 text-xs text-charcoal">
          <div className="space-y-2 text-charcoal">
            <h3 className="font-serif font-normal uppercase tracking-wider text-charcoal flex items-center">
              <MapPin className="w-4 h-4 text-royal mr-1" /> Shipping Address
            </h3>
            <p className="font-bold text-charcoal">{shippingAddr.fullName}</p>
            <p className="text-muted">{shippingAddr.street}</p>
            <p className="text-muted">{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</p>
            <p className="font-mono text-muted">Phone: {order.customerPhone}</p>
          </div>

          <div className="space-y-2 font-mono text-charcoal">
            <h3 className="font-serif font-normal uppercase tracking-wider text-charcoal flex items-center font-sans">
              <Package className="w-4 h-4 text-royal mr-1" /> Order Details
            </h3>
            <p className="text-muted">Payment Mode: <span className="font-bold text-charcoal">{order.paymentMethod}</span></p>
            <p className="text-muted">Payment Status: <span className="font-bold text-charcoal">{order.paymentStatus}</span></p>
            <p className="text-muted">Order Status: <span className="font-bold text-charcoal">{order.orderStatus}</span></p>
            <p className="text-muted font-bold">Total Paid: <span className="text-royal font-black text-sm">{formatPrice(order.total)}</span></p>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="text-left space-y-4 mb-10 text-charcoal">
          <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-charcoal">
            Reserved Pieces ({order.items.length})
          </h3>
          <div className="divide-y divide-border border-t border-b border-border py-2 text-charcoal">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs text-charcoal">
                <div>
                  <h4 className="font-serif text-charcoal font-normal">{item.productName}</h4>
                  <p className="font-mono text-[10px] text-muted uppercase">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-royal">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-charcoal">
          <Link
            href={`/orders/${order.id}`}
            className="w-full sm:w-auto bg-royal hover:bg-royal-dark text-white px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-widest transition-all rounded-md shadow-luxury"
          >
            Track Live Shipment
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-charcoal border border-border px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors rounded-md shadow-sm"
          >
            Continue Browsing Drops
          </Link>
        </div>
      </div>
    </div>
  );
}
