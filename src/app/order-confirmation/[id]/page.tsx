'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, MapPin, Download, MessageSquare } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

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
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-surface border border-border">
        <h2 className="font-serif text-2xl font-normal text-ink mb-2">Order Not Found</h2>
        <Link href="/shop" className="font-mono text-xs uppercase font-semibold tracking-widest text-accent hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const shippingAddr = JSON.parse(order.shippingAddressJson || '{}');
  const cleanPhone = (order.customerPhone || '').replace(/\D/g, '').slice(-10);
  const whatsappMsg = encodeURIComponent(
    `Hello ${order.customerName}, your CYTRUS Order #${order.orderNumber} for ${formatPrice(order.total)} is confirmed! Track live: ${window.location.origin}/orders/${order.id}`
  );
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${whatsappMsg}`;
  const pdfInvoiceUrl = `/api/orders/${order.id}/invoice`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-canvas">
      <div className="bg-surface border border-border p-8 sm:p-12 text-center">
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
          CONFIRMED & RESERVED
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1 mb-2">
          Thank You For Your Order
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
          Order Reference: <span className="text-ink font-semibold">{order.orderNumber}</span>
        </p>

        <p className="text-xs text-muted leading-relaxed max-w-lg mx-auto mb-6">
          We have received your CYTRUS order. An official receipt and notification with dispatch tracking have been dispatched to your contact details.
        </p>

        <div className="bg-canvas border border-border p-4 mb-8 max-w-lg mx-auto text-left space-y-3 font-mono">
          <div className="flex items-center space-x-2 text-xs text-ink">
            <span className="text-base">📧</span>
            <span>Official Email Receipt sent to <strong className="text-accent">{order.customerEmail}</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-ink">
            <span className="text-base">📱</span>
            <span>SMS Notification dispatched to <strong className="text-accent">{order.customerPhone}</strong></span>
          </div>
        </div>

        {/* Action Bar: Download PDF & WhatsApp Updates */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10 max-w-xl mx-auto">
          <a
            href={pdfInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-ink text-canvas px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-accent transition-colors border border-ink"
          >
            <Download className="w-4 h-4 text-canvas" />
            <span>Download Tax Invoice (PDF)</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-[#25D366] text-white px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity border border-[#25D366]"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>WhatsApp Order Notification</span>
          </a>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left border-t border-b border-border py-8 mb-10 text-xs">
          <div className="space-y-2">
            <h3 className="font-serif font-normal uppercase tracking-wider text-ink flex items-center">
              <MapPin className="w-4 h-4 text-accent mr-1" /> Shipping Address
            </h3>
            <p className="font-semibold text-ink">{shippingAddr.fullName}</p>
            <p className="text-muted">{shippingAddr.street}</p>
            <p className="text-muted">{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</p>
            <p className="font-mono text-muted">Phone: {order.customerPhone}</p>
          </div>

          <div className="space-y-2 font-mono">
            <h3 className="font-serif font-normal uppercase tracking-wider text-ink flex items-center font-sans">
              <Package className="w-4 h-4 text-accent mr-1" /> Order Details
            </h3>
            <p className="text-muted">Payment Mode: <span className="font-semibold text-ink">{order.paymentMethod}</span></p>
            <p className="text-muted">Payment Status: <span className="font-semibold text-ink">{order.paymentStatus}</span></p>
            <p className="text-muted">Order Status: <span className="font-semibold text-ink">{order.orderStatus}</span></p>
            <p className="text-muted font-semibold">Total Paid: <span className="text-accent">{formatPrice(order.total)}</span></p>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="text-left space-y-4 mb-10">
          <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-ink">
            Reserved Pieces ({order.items.length})
          </h3>
          <div className="divide-y divide-border">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-serif font-normal text-ink">{item.productName}</p>
                  <p className="font-mono text-muted uppercase text-[10px]">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                </div>
                <span className="font-mono font-semibold text-ink">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href={`/orders/${order.id}`}
            className="bg-accent text-canvas px-8 py-3.5 font-mono text-xs uppercase tracking-widest font-semibold hover:bg-ink transition-colors border border-accent"
          >
            Track Order Live →
          </Link>
          <Link
            href="/shop"
            className="border border-border text-ink bg-canvas px-8 py-3.5 font-mono text-xs uppercase tracking-widest hover:border-accent transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
