'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function OrderTrackingDetailPage({ params }: { params: { id: string } }) {
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
    return <div className="p-20 text-center font-mono uppercase tracking-widest text-muted text-xs">Loading Live Tracking Status...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border border-border rounded-2xl text-charcoal shadow-subtle">
        <h2 className="font-serif text-2xl font-normal text-charcoal mb-2">Order Not Found</h2>
        <Link href="/orders" className="font-mono text-xs uppercase font-bold tracking-widest text-royal hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'CONFIRMED', label: 'Order Confirmed' },
    { key: 'PROCESSING', label: 'Processing Drop' },
    { key: 'PACKED', label: 'Inspected & Packed' },
    { key: 'SHIPPED', label: 'Handed to Courier' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.orderStatus);
  const activeStepIdx = currentStepIndex >= 0 ? currentStepIndex : 0;
  const shippingAddr = JSON.parse(order.shippingAddressJson || '{}');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white text-charcoal">
      <div className="border-b border-border pb-6 mb-10 text-charcoal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
              <span>LIVE SHIPMENT TRACKING</span>
            </span>
            <h1 className="font-serif text-3xl font-normal text-charcoal mt-1">
              Order {order.orderNumber}
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right font-mono">
            <span className="text-xs text-muted uppercase tracking-widest block">Payment Mode: {order.paymentMethod}</span>
            <span className="text-sm font-bold text-royal">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Visual Step Tracker Timeline */}
      <div className="bg-white border border-border p-6 sm:p-10 mb-10 rounded-2xl shadow-subtle text-charcoal">
        <h2 className="font-serif text-lg font-normal uppercase tracking-wider text-charcoal mb-8 text-center sm:text-left">
          Delivery Status Progress
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative">
          {steps.map((st, idx) => {
            const isCompleted = idx <= activeStepIdx;
            const isCurrent = idx === activeStepIdx;

            return (
              <div key={st.key} className="flex flex-col items-center text-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs mb-3 transition-all ${
                    isCompleted
                      ? 'bg-royal text-white shadow-sm'
                      : 'bg-surface-tint text-muted border border-border'
                  } ${isCurrent ? 'ring-2 ring-royal ring-offset-2' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : idx + 1}
                </div>
                <p className={`font-mono text-[10px] uppercase tracking-wider ${isCompleted ? 'text-charcoal font-bold' : 'text-muted'}`}>
                  {st.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Courier Details */}
        {order.courierName && (
          <div className="mt-10 p-4 bg-surface-tint border border-border flex flex-col sm:flex-row items-center justify-between text-xs rounded-xl text-charcoal">
            <div className="space-y-1 text-center sm:text-left mb-3 sm:mb-0">
              <span className="font-mono text-[10px] uppercase text-muted tracking-widest">COURIER DISPATCH</span>
              <p className="font-serif text-charcoal font-normal">{order.courierName} · Tracking AWB: <strong className="font-mono text-royal">{order.trackingNumber || 'PENDING'}</strong></p>
            </div>
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-royal hover:bg-royal-dark text-white font-mono text-xs uppercase tracking-wider px-4 py-2 flex items-center space-x-1.5 rounded-md font-bold transition-colors shadow-sm"
              >
                <span>Live Courier Tracker</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Order Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-xs text-charcoal">
        <div className="bg-white border border-border p-6 rounded-2xl shadow-subtle text-charcoal">
          <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-charcoal mb-4 flex items-center">
            <MapPin className="w-4 h-4 text-royal mr-2" /> Destination Address
          </h3>
          <p className="font-bold text-charcoal">{shippingAddr.fullName}</p>
          <p className="text-muted">{shippingAddr.street}</p>
          <p className="text-muted">{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</p>
          <p className="font-mono text-muted mt-2">Phone: {order.customerPhone}</p>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-subtle text-charcoal">
          <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-charcoal mb-4 flex items-center">
            <Package className="w-4 h-4 text-royal mr-2" /> Ordered Pieces ({order.items.length})
          </h3>
          <div className="divide-y divide-border text-charcoal">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-charcoal">
                <div>
                  <p className="font-serif font-normal text-charcoal">{item.productName}</p>
                  <p className="font-mono text-[10px] text-muted uppercase">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-royal">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/orders"
          className="font-mono text-xs uppercase tracking-widest text-muted hover:text-charcoal transition-colors font-bold"
        >
          ← Return to Orders
        </Link>
      </div>
    </div>
  );
}
