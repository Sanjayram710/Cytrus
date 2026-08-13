'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white text-charcoal">
      <div className="border-b border-border pb-6 mb-10 text-charcoal">
        <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
          <span>CLIENT PORTAL</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal mt-1">
          Order History & Tracking
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-16 font-mono uppercase tracking-widest text-muted text-xs">Loading Order History...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-border p-8 rounded-2xl shadow-subtle text-charcoal">
          <Package className="w-10 h-10 text-muted mx-auto mb-4" />
          <p className="font-serif text-xl font-normal text-charcoal mb-2">No Past Orders Found</p>
          <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">When you place an order, it will appear here with live tracking updates.</p>
          <Link href="/shop" className="bg-royal hover:bg-royal-dark text-white px-6 py-3 font-mono text-xs uppercase font-bold tracking-widest transition-colors rounded-md shadow-sm">
            Explore Drops
          </Link>
        </div>
      ) : (
        <div className="space-y-6 text-charcoal">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-border p-6 hover:border-royal/50 hover:shadow-card transition-all rounded-2xl shadow-subtle text-charcoal">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-4 gap-2 text-charcoal">
                <div>
                  <span className="text-[10px] font-mono text-muted uppercase">ORDER ID:</span>
                  <p className="font-serif font-normal text-charcoal text-sm">{order.orderNumber}</p>
                  <p className="font-mono text-[11px] text-muted">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-md border ${
                    order.orderStatus === 'DELIVERED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : order.orderStatus === 'CANCELLED'
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-royal-light text-royal border-royal/30'
                  }`}>
                    {order.orderStatus}
                  </span>

                  <span className="font-mono text-sm font-bold text-royal">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-2 mb-4 text-charcoal">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs text-charcoal">
                    <span className="font-serif text-charcoal font-normal line-clamp-1">{item.productName} ({item.size} / {item.color}) x{item.quantity}</span>
                    <span className="font-mono font-bold text-royal">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end text-charcoal">
                <Link
                  href={`/orders/${order.id}`}
                  className="font-mono text-xs uppercase tracking-wider text-royal hover:underline font-bold flex items-center space-x-1"
                >
                  <span>View Full Order & Tracking Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
