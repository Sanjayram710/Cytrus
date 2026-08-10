'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-12 text-center uppercase tracking-widest text-luxury-gold text-xs font-bold">Loading Dashboard Metrics...</div>;
  }

  const { metrics, recentOrders, bestSellers, categoryPerformance } = data || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-luxury-border pb-4">
        <h1 className="font-serif text-3xl font-bold text-luxury-black">Dashboard Overview</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
          LUXEWEAR Maison Live Real-Time Analytics
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-luxury-border p-5 shadow-subtle">
          <div className="flex items-center justify-between text-luxury-gold mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Revenue</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl font-bold text-luxury-black">
            {formatPrice(metrics?.totalRevenue || 0)}
          </p>
        </div>

        <div className="bg-white border border-luxury-border p-5 shadow-subtle">
          <div className="flex items-center justify-between text-luxury-gold mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Orders</span>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl font-bold text-luxury-black">
            {metrics?.totalOrders || 0}
          </p>
        </div>

        <div className="bg-white border border-luxury-border p-5 shadow-subtle">
          <div className="flex items-center justify-between text-luxury-gold mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Customers</span>
            <Users className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl font-bold text-luxury-black">
            {metrics?.totalCustomers || 0}
          </p>
        </div>

        <div className="bg-white border border-luxury-border p-5 shadow-subtle">
          <div className="flex items-center justify-between text-luxury-gold mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Active Products</span>
            <Package className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl font-bold text-luxury-black">
            {metrics?.totalProducts || 0}
          </p>
        </div>

        <div className="bg-white border border-red-200 p-5 shadow-subtle bg-red-50/30">
          <div className="flex items-center justify-between text-red-600 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock Alert</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl font-bold text-red-700">
            {metrics?.lowStockProducts || 0}
          </p>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-luxury-border p-6 shadow-subtle">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-luxury-black">
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-xs uppercase font-bold text-luxury-gold hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-luxury-border bg-luxury-cream text-luxury-black uppercase tracking-wider font-bold">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border">
                {recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-luxury-cream/40">
                    <td className="p-3 font-mono font-bold text-luxury-black">{ord.orderNumber}</td>
                    <td className="p-3 font-medium">{ord.customerName}</td>
                    <td className="p-3 font-bold">{formatPrice(ord.total)}</td>
                    <td className="p-3">
                      <span className="bg-luxury-cream border border-luxury-gold text-[10px] font-bold px-2 py-0.5 uppercase">
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Performance & Best Sellers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-luxury-border p-6 shadow-subtle">
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-luxury-black mb-4">
              Category Distribution
            </h2>
            <div className="space-y-3 text-xs">
              {categoryPerformance?.map((cat: any) => (
                <div key={cat.id} className="flex justify-between items-center border-b border-luxury-border/40 pb-2">
                  <span className="font-semibold text-luxury-black uppercase">{cat.name}</span>
                  <span className="font-mono bg-luxury-cream px-2 py-0.5 text-luxury-gold font-bold">
                    {cat.productCount} Styles
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
