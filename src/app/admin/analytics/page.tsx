'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Award, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-12 text-center uppercase tracking-widest text-luxury-gold text-xs font-bold">Loading Revenue Analytics...</div>;
  }

  const { metrics, bestSellers, categoryPerformance } = data || {};
  const totalRevenue = metrics?.totalRevenue || 0;
  const totalOrders = metrics?.totalOrders || 1;
  const aov = Math.round(totalRevenue / (totalOrders || 1));

  return (
    <div className="space-y-8">
      <div className="border-b border-luxury-border pb-4">
        <h1 className="font-serif text-3xl font-bold text-luxury-black">Maison Revenue & Sales Analytics</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
          Performance Metrics, Average Order Value (AOV) & Bestsellers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-luxury-border p-6 shadow-subtle">
          <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Gross Revenue</span>
          <p className="font-serif text-3xl font-bold text-luxury-black mt-2">{formatPrice(totalRevenue)}</p>
          <span className="text-[11px] text-green-700 font-bold flex items-center mt-2">
            <ArrowUpRight className="w-4 h-4 mr-1" /> +18.4% vs Previous Month
          </span>
        </div>

        <div className="bg-white border border-luxury-border p-6 shadow-subtle">
          <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Total Orders</span>
          <p className="font-serif text-3xl font-bold text-luxury-black mt-2">{totalOrders}</p>
          <span className="text-[11px] text-green-700 font-bold flex items-center mt-2">
            <ArrowUpRight className="w-4 h-4 mr-1" /> +12.1% Order Conversion Rate
          </span>
        </div>

        <div className="bg-white border border-luxury-border p-6 shadow-subtle">
          <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Average Order Value (AOV)</span>
          <p className="font-serif text-3xl font-bold text-luxury-gold mt-2">{formatPrice(aov)}</p>
          <span className="text-[11px] text-gray-500 font-bold mt-2 block">High-End Luxury Benchmark</span>
        </div>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-luxury-border p-6 shadow-subtle">
          <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-luxury-black mb-4">
            Top Performing Bestsellers
          </h2>
          <div className="space-y-4">
            {bestSellers?.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between border-b border-luxury-border/40 pb-3">
                <div className="flex items-center space-x-3">
                  <img src={p.images?.[0]?.url} alt={p.name} className="w-10 h-14 object-cover border" />
                  <div>
                    <span className="font-serif font-bold text-luxury-black text-xs block">{p.name}</span>
                    <span className="text-[10px] text-luxury-gold uppercase font-semibold">{p.category?.name}</span>
                  </div>
                </div>
                <span className="font-bold text-luxury-black text-xs">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-luxury-border p-6 shadow-subtle">
          <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-luxury-black mb-4">
            Category Revenue Distribution
          </h2>
          <div className="space-y-4">
            {categoryPerformance?.map((cat: any) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>{cat.name}</span>
                  <span className="text-luxury-gold">{cat.productCount} Styles Available</span>
                </div>
                <div className="w-full bg-luxury-cream h-2.5 rounded-full overflow-hidden border border-luxury-border">
                  <div
                    className="bg-luxury-black h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, cat.productCount * 12)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
