'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, History, ShieldCheck, Lock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function ProductPriceHistoryPage({ params }: { params: { id: string } }) {
  const [history, setHistory] = useState<any[]>([]);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/products/${params.id}/price-history`);
        const data = await res.json();
        if (data.history) {
          setHistory(data.history);
          if (data.history.length > 0 && data.history[0].product) {
            setProduct(data.history[0].product);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [params.id]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Navigation */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-luxury-gold hover:underline mb-4 font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Products
        </Link>

        <div className="flex justify-between items-start border-b border-luxury-gold/30 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <History className="w-6 h-6 text-luxury-gold" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-luxury-gold font-bold">
                AUDIT LOG & PRICE TIMELINE
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-wider text-luxury-black mt-1">
              {product?.name ? `Price History: ${product.name}` : 'Product Historical Price Log'}
            </h1>
          </div>

          <div className="flex items-center space-x-1.5 bg-luxury-black text-luxury-gold font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-luxury-gold/40">
            <Lock className="w-3 h-3 text-luxury-gold" />
            <span>READ-ONLY IMMUTABLE LOG</span>
          </div>
        </div>
      </div>

      {/* Audit Banner Note */}
      <div className="bg-amber-50 border border-amber-300 p-4 font-sans text-xs text-amber-900 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Historical price records are append-only and immutable. Historical prices are automatically logged whenever an administrator updates product or variant pricing to guarantee price display integrity.
        </p>
      </div>

      {/* History Timeline Table */}
      <div className="bg-white border border-luxury-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs uppercase tracking-widest text-luxury-gold">
            Loading Historical Audit Trail...
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs uppercase text-gray-500">
            No historical price changes recorded for this product yet.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-luxury-black text-luxury-cream font-mono text-[10px] uppercase tracking-widest border-b border-luxury-gold/30">
                <th className="p-4">Date & Time</th>
                <th className="p-4">Previous Price</th>
                <th className="p-4">New Price</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Source</th>
                <th className="p-4 text-right">Changed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans text-xs">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="p-4 font-mono font-semibold text-luxury-black">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(record.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-semibold text-gray-400 line-through">
                    {record.oldPrice !== null && record.oldPrice !== undefined
                      ? formatPrice(record.oldPrice)
                      : '—'}
                  </td>

                  <td className="p-4 font-mono font-bold text-luxury-black text-sm">
                    {formatPrice(record.price)}
                  </td>

                  <td className="p-4 font-mono text-[10px] uppercase font-bold text-amber-800">
                    <span className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                      {record.reason}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[10px] uppercase text-gray-600 font-bold">
                    {record.source}
                  </td>

                  <td className="p-4 font-mono text-[10px] uppercase font-bold text-right text-luxury-black">
                    {record.createdBy || 'Admin'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
