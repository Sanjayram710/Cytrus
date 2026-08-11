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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      <div className="border-b border-border pb-6 mb-10">
        <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
          CLIENT PORTAL
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1">
          Order History & Tracking
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-16 font-mono uppercase tracking-widest text-muted text-xs">Loading Order History...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border p-8">
          <Package className="w-10 h-10 text-muted mx-auto mb-4" />
          <p className="font-serif text-lg font-normal text-ink mb-2">No Past Orders Found</p>
          <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">When you place an order, it will appear here with live tracking updates.</p>
          <Link href="/shop" className="bg-accent text-canvas px-6 py-3 font-mono text-xs uppercase font-semibold tracking-widest hover:bg-ink transition-colors border border-accent">
            Explore Drops
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface border border-border p-6 hover:border-accent transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-4 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-muted uppercase">ORDER ID:</span>
                  <p className="font-serif font-normal text-ink text-sm">{order.orderNumber}</p>
                  <p className="font-mono text-[11px] text-muted">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`font-mono text-[10px] uppercase font-medium px-3 py-1 border ${
                    order.orderStatus === 'DELIVERED'
                      ? 'bg-canvas text-ink border-border'
                      : order.orderStatus === 'CANCELLED'
                      ? 'bg-canvas text-muted border-border'
                      : 'bg-canvas text-accent border-accent'
                  }`}>
                    {order.orderStatus}
                  </span>

                  <span className="font-mono text-sm font-semibold text-accent">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-2 mb-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="font-serif text-ink font-normal line-clamp-1">{item.productName} ({item.size} / {item.color}) x{item.quantity}</span>
                    <span className="font-mono font-semibold text-ink">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href={`/orders/${order.id}`}
                  className="font-mono text-xs uppercase tracking-wider text-accent hover:text-ink flex items-center space-x-1"
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
