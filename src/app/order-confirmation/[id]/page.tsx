'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, Calendar, MapPin, ArrowRight } from 'lucide-react';
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
    return <div className="p-20 text-center uppercase tracking-widest text-luxury-gold text-xs">Generating Order Receipt...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border border-luxury-border">
        <h2 className="font-serif text-2xl font-bold text-luxury-black mb-2">Order Not Found</h2>
        <Link href="/shop" className="text-xs uppercase font-bold tracking-widest text-luxury-gold hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const shippingAddr = JSON.parse(order.shippingAddressJson || '{}');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white border border-luxury-border shadow-luxury p-8 sm:p-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-luxury-gold mx-auto mb-4" />
        <span className="text-xs uppercase font-semibold tracking-[0.35em] text-luxury-gold">
          CONFIRMED & RESERVED
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black mt-1 mb-2">
          Thank You For Your Order
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">
          Order Reference: <span className="text-luxury-black font-bold">{order.orderNumber}</span>
        </p>

        <p className="text-xs text-gray-700 leading-relaxed max-w-lg mx-auto mb-6">
          We have received your CYTRUS order. An official receipt and SMS notification with dispatch tracking will be sent to your contact details.
        </p>

        <div className="bg-luxury-cream border border-luxury-border p-4 mb-8 max-w-lg mx-auto text-left space-y-2">
          <div className="flex items-center space-x-2 text-xs text-luxury-black font-semibold">
            <span className="text-base">📧</span>
            <span>Official Email Receipt dispatched to <strong className="text-luxury-gold">{order.customerEmail}</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-luxury-black font-semibold">
            <span className="text-base">📱</span>
            <span>SMS Notification sent to <strong className="text-luxury-gold">{order.customerPhone}</strong></span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left border-t border-b border-luxury-border py-8 mb-10 text-xs">
          <div className="space-y-2">
            <h3 className="font-serif font-bold uppercase tracking-wider text-luxury-black flex items-center">
              <MapPin className="w-4 h-4 text-luxury-gold mr-1" /> Shipping Address
            </h3>
            <p className="font-bold text-luxury-black">{shippingAddr.fullName}</p>
            <p className="text-gray-600">{shippingAddr.street}</p>
            <p className="text-gray-600">{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</p>
            <p className="text-gray-600">Phone: {order.customerPhone}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif font-bold uppercase tracking-wider text-luxury-black flex items-center">
              <Package className="w-4 h-4 text-luxury-gold mr-1" /> Order Details
            </h3>
            <p className="text-gray-600">Payment Mode: <span className="font-bold text-luxury-black">{order.paymentMethod}</span></p>
            <p className="text-gray-600">Payment Status: <span className="font-bold text-green-700">{order.paymentStatus}</span></p>
            <p className="text-gray-600">Order Status: <span className="font-bold text-luxury-black">{order.orderStatus}</span></p>
            <p className="text-gray-600 font-bold">Total Paid: {formatPrice(order.total)}</p>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="text-left space-y-4 mb-10">
          <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-luxury-black">
            Reserved Pieces ({order.items.length})
          </h3>
          <div className="divide-y divide-luxury-border">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-serif font-bold text-luxury-black">{item.productName}</p>
                  <p className="text-gray-500 uppercase text-[11px]">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-luxury-black">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href={`/orders/${order.id}`}
            className="bg-luxury-black text-luxury-cream px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-colors"
          >
            Track Order Live →
          </Link>
          <Link
            href="/shop"
            className="border border-luxury-border text-luxury-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:border-luxury-gold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
