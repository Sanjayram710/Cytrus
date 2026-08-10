'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '10',
    minSpend: '2000',
    maxDiscount: '5000',
    usageLimit: '1000',
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    setLoading(true);
    fetch('/api/admin/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (data.coupons) setCoupons(data.coupons);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setModalOpen(false);
    fetchCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-luxury-border pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-black">Coupons & Discounts</h1>
          <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
            Create Promotional Vouchers, Percentage & Fixed Order Discounts
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              code: '',
              type: 'PERCENTAGE',
              value: '15',
              minSpend: '5000',
              maxDiscount: '5000',
              usageLimit: '500',
              isActive: true,
            });
            setModalOpen(true);
          }}
          className="bg-luxury-black text-luxury-cream px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading Coupons...</div>
      ) : (
        <div className="bg-white border border-luxury-border shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-luxury-border bg-luxury-cream text-luxury-black uppercase tracking-wider font-bold">
                <th className="p-3">Coupon Code</th>
                <th className="p-3">Discount Type</th>
                <th className="p-3">Value</th>
                <th className="p-3">Min Order Spend</th>
                <th className="p-3">Usage Count</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-luxury-cream/40">
                  <td className="p-3 font-mono font-bold text-luxury-gold text-sm">{c.code}</td>
                  <td className="p-3 uppercase font-semibold">{c.type}</td>
                  <td className="p-3 font-bold">
                    {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : formatPrice(c.value)}
                  </td>
                  <td className="p-3 font-medium">{formatPrice(c.minSpend)}</td>
                  <td className="p-3 font-mono">{c.usageCount} / {c.usageLimit} Redemptions</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${c.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-luxury-cream border border-luxury-border max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-luxury-black">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-2xl font-bold uppercase text-luxury-black mb-4">Create Coupon</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXE25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full border border-luxury-border p-2.5 bg-white font-mono font-bold focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white font-bold focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FIXED">FIXED AMOUNT (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase font-bold mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white font-bold focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-luxury-black text-luxury-cream py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all"
              >
                Save Coupon Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
