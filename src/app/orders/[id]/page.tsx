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
    return <div className="p-20 text-center font-mono uppercase tracking-widest text-slate-400 text-xs">Loading Live Tracking Status...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-[#101D3F] border border-white/10 rounded-2xl text-white shadow-subtle">
        <h2 className="font-serif text-2xl font-normal text-white mb-2">Order Not Found</h2>
        <Link href="/orders" className="font-mono text-xs uppercase font-bold tracking-widest text-royal-light hover:underline">
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0A1128] text-white">
      <div className="border-b border-white/10 pb-6 mb-10 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal-light flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
              <span>LIVE SHIPMENT TRACKING</span>
            </span>
            <h1 className="font-serif text-3xl font-normal text-white mt-1">
              Order {order.orderNumber}
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right font-mono">
            <span className="text-xs text-slate-400 uppercase tracking-widest block">Payment Mode: {order.paymentMethod}</span>
            <span className="text-sm font-bold text-white">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Visual Step Tracker Timeline */}
      <div className="bg-[#101D3F] border border-white/10 p-6 sm:p-10 mb-10 rounded-2xl shadow-subtle text-white">
        <h2 className="font-serif text-lg font-normal uppercase tracking-wider text-white mb-8 text-center sm:text-left">
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
                      : 'bg-[#0A1128] text-slate-500 border border-white/10'
                  } ${isCurrent ? 'ring-2 ring-royal ring-offset-2 ring-offset-[#101D3F]' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : idx + 1}
                </div>
                <p className={`font-mono text-[10px] uppercase tracking-wider ${isCompleted ? 'text-white font-bold' : 'text-slate-500'}`}>
                  {st.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Courier Details */}
        {order.courierName && (
          <div className="mt-10 p-4 bg-[#0D1836] border border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs rounded-xl text-white">
            <div className="space-y-1 text-center sm:text-left mb-3 sm:mb-0">
              <span className="font-mono text-[10px] uppercase text-slate-400 tracking-widest">COURIER DISPATCH</span>
              <p className="font-serif text-white font-normal">{order.courierName} · Tracking AWB: <strong className="font-mono text-royal-light">{order.trackingNumber || 'PENDING'}</strong></p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-xs text-white">
        <div className="bg-[#101D3F] border border-white/10 p-6 rounded-2xl shadow-subtle text-white">
          <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-white mb-4 flex items-center">
            <MapPin className="w-4 h-4 text-royal-light mr-2" /> Destination Address
          </h3>
          <p className="font-bold text-white">{shippingAddr.fullName}</p>
          <p className="text-slate-300">{shippingAddr.street}</p>
          <p className="text-slate-300">{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</p>
          <p className="font-mono text-slate-400 mt-2">Phone: {order.customerPhone}</p>
        </div>

        <div className="bg-[#101D3F] border border-white/10 p-6 rounded-2xl shadow-subtle text-white">
          <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-white mb-4 flex items-center">
            <Package className="w-4 h-4 text-royal-light mr-2" /> Ordered Pieces ({order.items.length})
          </h3>
          <div className="divide-y divide-white/10 text-white">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-white">
                <div>
                  <p className="font-serif font-normal text-white">{item.productName}</p>
                  <p className="font-mono text-[10px] text-slate-400 uppercase">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-white">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/orders"
          className="font-mono text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors font-bold"
        >
          ← Return to Orders
        </Link>
      </div>
    </div>
  );
}
