'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders') // or user order endpoint
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-luxury-border pb-6 mb-10">
        <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
          CLIENT PORTAL
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black mt-1">
          Order History & Tracking
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-16 uppercase tracking-widest text-luxury-gold text-xs">Loading Order History...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-luxury-border p-8">
          <Package className="w-12 h-12 text-luxury-gold/40 mx-auto mb-4" />
          <p className="font-serif text-lg font-bold text-luxury-black mb-2">No Past Orders Found</p>
          <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">When you place an order, it will appear here with live tracking updates.</p>
          <Link href="/shop" className="bg-luxury-black text-luxury-cream px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-luxury-gold hover:text-black">
            Explore Couture Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-luxury-border p-6 shadow-subtle hover:border-luxury-gold transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-luxury-border pb-4 mb-4 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">ORDER ID:</span>
                  <p className="font-serif font-bold text-luxury-black text-sm">{order.orderNumber}</p>
                  <p className="text-[11px] text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`text-[10px] uppercase font-bold px-3 py-1 border ${
                    order.orderStatus === 'DELIVERED'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : order.orderStatus === 'CANCELLED'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-luxury-cream text-luxury-black border-luxury-gold'
                  }`}>
                    {order.orderStatus}
                  </span>

                  <span className="text-sm font-extrabold text-luxury-black">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-2 mb-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="font-serif text-luxury-black font-semibold line-clamp-1">{item.productName} ({item.size} / {item.color}) x{item.quantity}</span>
                    <span className="font-bold text-luxury-black">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-xs uppercase tracking-wider font-bold text-luxury-black hover:text-luxury-gold flex items-center space-x-1"
                >
                  <span>View Full Order & Tracking Timeline</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
