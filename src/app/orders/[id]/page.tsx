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
    return <div className="p-20 text-center uppercase tracking-widest text-luxury-gold text-xs">Loading Live Tracking Status...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border border-luxury-border">
        <h2 className="font-serif text-2xl font-bold text-luxury-black mb-2">Order Not Found</h2>
        <Link href="/orders" className="text-xs uppercase font-bold tracking-widest text-luxury-gold hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'CONFIRMED', label: 'Order Confirmed' },
    { key: 'PROCESSING', label: 'Processing at Atelier' },
    { key: 'PACKED', label: 'Quality Inspected & Packed' },
    { key: 'SHIPPED', label: 'Handed to Courier' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.orderStatus);
  const activeStepIdx = currentStepIndex >= 0 ? currentStepIndex : 0;
  const shippingAddr = JSON.parse(order.shippingAddressJson || '{}');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-luxury-border pb-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
              LIVE SHIPMENT TRACKING
            </span>
            <h1 className="font-serif text-3xl font-bold text-luxury-black mt-1">
              Order {order.orderNumber}
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right">
            <span className="text-xs text-gray-500 uppercase tracking-widest block">Payment Mode: {order.paymentMethod}</span>
            <span className="text-sm font-extrabold text-luxury-black">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Visual Step Tracker Timeline */}
      <div className="bg-white border border-luxury-border p-6 sm:p-10 mb-10 shadow-subtle">
        <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-luxury-black mb-8 text-center sm:text-left">
          Delivery Status Progress
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative">
          {steps.map((st, idx) => {
            const isCompleted = idx <= activeStepIdx;
            const isCurrent = idx === activeStepIdx;

            return (
              <div key={st.key} className="flex flex-col items-center text-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-3 transition-all ${
                    isCompleted
                      ? 'bg-luxury-black text-luxury-cream shadow-md'
                      : 'bg-gray-100 text-gray-400 border border-gray-300'
                  } ${isCurrent ? 'ring-4 ring-luxury-gold/40' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-luxury-gold" /> : idx + 1}
                </div>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isCompleted ? 'text-luxury-black' : 'text-gray-400'}`}>
                  {st.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Courier Details */}
        {order.courierName && (
          <div className="mt-10 p-4 bg-luxury-cream border border-luxury-gold/40 flex flex-col sm:flex-row items-center justify-between text-xs">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <Truck className="w-6 h-6 text-luxury-gold" />
              <div>
                <p className="font-bold text-luxury-black uppercase">Courier: {order.courierName}</p>
                <p className="text-gray-600 font-mono">Tracking AWB: {order.trackingNumber || 'AWB Pending'}</p>
              </div>
            </div>
            {order.trackingNumber && (
              <span className="text-[11px] uppercase font-bold text-luxury-gold hover:underline flex items-center">
                Track on {order.courierName} Portal <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Shipment & Address Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 text-xs">
        <div className="bg-white border border-luxury-border p-6 space-y-2">
          <h3 className="font-serif font-bold uppercase tracking-wider text-luxury-black flex items-center">
            <MapPin className="w-4 h-4 text-luxury-gold mr-1" /> Delivery Address
          </h3>
          <p className="font-bold text-luxury-black">{shippingAddr.fullName}</p>
          <p className="text-gray-600">{shippingAddr.street}</p>
          <p className="text-gray-600">{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</p>
          <p className="text-gray-600">Phone: {order.customerPhone}</p>
        </div>

        <div className="bg-white border border-luxury-border p-6 space-y-2">
          <h3 className="font-serif font-bold uppercase tracking-wider text-luxury-black flex items-center">
            <Clock className="w-4 h-4 text-luxury-gold mr-1" /> Audit Status Log
          </h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {order.statusHistory?.map((h: any) => (
              <div key={h.id} className="border-b border-luxury-border/40 pb-1">
                <span className="font-bold text-luxury-black uppercase">{h.status}</span>
                <p className="text-[11px] text-gray-500">{h.notes} ({new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
