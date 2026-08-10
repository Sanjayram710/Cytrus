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
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-surface border border-border">
        <h2 className="font-serif text-2xl font-normal text-ink mb-2">Order Not Found</h2>
        <Link href="/orders" className="font-mono text-xs uppercase font-semibold tracking-widest text-accent hover:underline">
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      <div className="border-b border-border pb-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
              LIVE SHIPMENT TRACKING
            </span>
            <h1 className="font-serif text-3xl font-normal text-ink mt-1">
              Order {order.orderNumber}
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right font-mono">
            <span className="text-xs text-muted uppercase tracking-widest block">Payment Mode: {order.paymentMethod}</span>
            <span className="text-sm font-semibold text-accent">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Visual Step Tracker Timeline */}
      <div className="bg-surface border border-border p-6 sm:p-10 mb-10">
        <h2 className="font-serif text-lg font-normal uppercase tracking-wider text-ink mb-8 text-center sm:text-left">
          Delivery Status Progress
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative">
          {steps.map((st, idx) => {
            const isCompleted = idx <= activeStepIdx;
            const isCurrent = idx === activeStepIdx;

            return (
              <div key={st.key} className="flex flex-col items-center text-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-semibold text-xs mb-3 transition-all ${
                    isCompleted
                      ? 'bg-ink text-canvas'
                      : 'bg-canvas text-muted border border-border'
                  } ${isCurrent ? 'ring-2 ring-accent' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-accent" /> : idx + 1}
                </div>
                <p className={`font-mono text-[10px] uppercase tracking-wider ${isCompleted ? 'text-ink font-semibold' : 'text-muted'}`}>
                  {st.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Courier Details */}
        {order.courierName && (
          <div className="mt-10 p-4 bg-canvas border border-border flex flex-col sm:flex-row items-center justify-between text-xs">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <Truck className="w-5 h-5 text-accent" />
              <div>
                <p className="font-mono font-semibold text-ink uppercase">Courier: {order.courierName}</p>
                <p className="text-muted font-mono text-[11px]">Tracking AWB: {order.trackingNumber || 'AWB Pending'}</p>
              </div>
            </div>
            {order.trackingNumber && (
              <span className="font-mono text-[11px] uppercase font-semibold text-accent hover:underline flex items-center">
                Track on {order.courierName} Portal <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Shipment & Address Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 text-xs">
        <div className="bg-surface border border-border p-6 space-y-2">
          <h3 className="font-serif font-normal uppercase tracking-wider text-ink flex items-center">
            <MapPin className="w-4 h-4 text-accent mr-1" /> Delivery Address
          </h3>
          <p className="font-semibold text-ink">{shippingAddr.fullName}</p>
          <p className="text-muted">{shippingAddr.street}</p>
          <p className="text-muted">{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</p>
          <p className="font-mono text-muted">Phone: {order.customerPhone}</p>
        </div>

        <div className="bg-surface border border-border p-6 space-y-2">
          <h3 className="font-serif font-normal uppercase tracking-wider text-ink flex items-center">
            <Clock className="w-4 h-4 text-accent mr-1" /> Audit Status Log
          </h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {order.statusHistory?.map((h: any) => (
              <div key={h.id} className="border-b border-border pb-1">
                <span className="font-mono font-semibold text-ink uppercase text-[11px]">{h.status}</span>
                <p className="font-mono text-[10px] text-muted">{h.notes} ({new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
