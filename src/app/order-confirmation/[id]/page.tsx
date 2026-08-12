'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, Calendar, MapPin, ArrowRight } from 'lucide-react';
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
    return <div className="p-20 text-center font-mono uppercase tracking-widest text-slate-400 text-xs">Generating Order Receipt...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-[#101D3F] border border-white/10 rounded-2xl text-white shadow-subtle">
        <h2 className="font-serif text-2xl font-normal text-white mb-2">Order Not Found</h2>
        <Link href="/shop" className="font-mono text-xs uppercase font-bold tracking-widest text-royal-light hover:underline">
          Return to Vault
        </Link>
      </div>
    );
  }

  const shippingAddr = JSON.parse(order.shippingAddressJson || '{}');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#0A1128] text-white">
      <div className="bg-[#101D3F] border border-white/10 p-8 sm:p-12 text-center rounded-2xl shadow-subtle text-white">
        <div className="mb-6 flex justify-center">
          <CelebriteeLogo variant="rectangle" size="sm" />
        </div>

        <CheckCircle2 className="w-12 h-12 text-royal-light mx-auto mb-3" />
        <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal-light flex items-center justify-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
          <span>CONFIRMED & RESERVED</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white mt-1 mb-2">
          Thank You For Your Order
        </h1>
        <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-6">
          Order Reference: <span className="text-white font-bold">{order.orderNumber}</span>
        </p>

        <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto mb-6">
          We have received your CELEBRITEE order. An official receipt and notification with dispatch tracking will be sent to your contact details.
        </p>

        <div className="bg-[#0D1836] border border-white/10 p-4 mb-8 max-w-lg mx-auto text-left space-y-2 font-mono rounded-xl text-white">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-base">📧</span>
            <span>Official Receipt dispatched to <strong className="font-bold text-white">{order.customerEmail}</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-base">📱</span>
            <span>Notification sent to <strong className="font-bold text-white">{order.customerPhone}</strong></span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left border-t border-b border-white/10 py-8 mb-10 text-xs text-white">
          <div className="space-y-2 text-white">
            <h3 className="font-serif font-normal uppercase tracking-wider text-white flex items-center">
              <MapPin className="w-4 h-4 text-royal-light mr-1" /> Shipping Address
            </h3>
            <p className="font-bold text-white">{shippingAddr.fullName}</p>
            <p className="text-slate-300">{shippingAddr.street}</p>
            <p className="text-slate-300">{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</p>
            <p className="font-mono text-slate-400">Phone: {order.customerPhone}</p>
          </div>

          <div className="space-y-2 font-mono text-white">
            <h3 className="font-serif font-normal uppercase tracking-wider text-white flex items-center font-sans">
              <Package className="w-4 h-4 text-royal-light mr-1" /> Order Details
            </h3>
            <p className="text-slate-400">Payment Mode: <span className="font-bold text-white">{order.paymentMethod}</span></p>
            <p className="text-slate-400">Payment Status: <span className="font-bold text-white">{order.paymentStatus}</span></p>
            <p className="text-slate-400">Order Status: <span className="font-bold text-white">{order.orderStatus}</span></p>
            <p className="text-slate-400 font-bold">Total Paid: <span className="text-white font-black text-sm">{formatPrice(order.total)}</span></p>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="text-left space-y-4 mb-10 text-white">
          <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-white">
            Reserved Pieces ({order.items.length})
          </h3>
          <div className="divide-y divide-white/10 border-t border-b border-white/10 py-2 text-white">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs text-white">
                <div>
                  <h4 className="font-serif text-white font-normal">{item.productName}</h4>
                  <p className="font-mono text-[10px] text-slate-400 uppercase">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-white">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white">
          <Link
            href={`/orders/${order.id}`}
            className="w-full sm:w-auto bg-royal hover:bg-royal-dark text-white px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-widest transition-all rounded-md shadow-luxury"
          >
            Track Live Shipment
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-[#0D1836] hover:bg-[#16254F] text-white border border-white/10 px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors rounded-md shadow-sm"
          >
            Continue Browsing Drops
          </Link>
        </div>
      </div>
    </div>
  );
}
