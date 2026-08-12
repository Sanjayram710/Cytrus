'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getCartSubtotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getCartSubtotal();
  const tax = Math.round(Math.max(0, subtotal - couponDiscount) * 0.12);
  const shipping = subtotal >= 2500 || subtotal === 0 ? 0 : 250;
  const total = Math.max(0, subtotal - couponDiscount + tax + shipping);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMsg('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        applyCoupon(data.code, data.discountAmount);
        setCouponMsg(`VIP Code ${data.code} applied! Saved ${formatPrice(data.discountAmount)}`);
        setCouponInput('');
      } else {
        setCouponMsg(data.message || 'Invalid VIP access code');
      }
    } catch (err) {
      setCouponMsg('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0A1128] text-white">
      <div className="border-b border-white/10 pb-6 mb-10 text-white">
        <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal-light flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
          <span>YOUR CURATED SELECTIONS</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white mt-1">
          Client Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-[#101D3F] border border-white/10 p-8 max-w-lg mx-auto rounded-2xl shadow-subtle text-white">
          <div className="w-16 h-16 rounded-full bg-[#0A1128] flex items-center justify-center mx-auto mb-4 border border-white/10">
            <ShoppingBag className="w-8 h-8 text-royal-light" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-white mb-2">Your Bag is Empty</h2>
          <p className="font-mono text-xs text-slate-400 mb-6 uppercase tracking-wider">Explore our latest exclusive celebrity collaborations.</p>
          <Link
            href="/shop"
            className="inline-block bg-royal hover:bg-royal-dark text-white px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest transition-colors rounded-md shadow-luxury"
          >
            Explore Vault Drops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-white">
          {/* Cart Items Table (8 cols) */}
          <div className="lg:col-span-8 space-y-6 text-white">
            <div className="hidden sm:grid grid-cols-12 font-mono text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-white/10">
              <div className="col-span-6 text-white">Drop Edition</div>
              <div className="col-span-2 text-center text-white">Specifications</div>
              <div className="col-span-2 text-center text-white">Quantity</div>
              <div className="col-span-2 text-right text-white">Investment</div>
            </div>

            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 border-b border-white/10 pb-6 text-white"
              >
                <div className="sm:col-span-6 flex space-x-4 w-full">
                  <img src={item.productImage} alt={item.productName} className="w-20 h-24 object-cover bg-slate-900 border border-white/10 rounded-xl" />
                  <div>
                    <h3 className="font-serif text-sm font-normal text-white">{item.productName}</h3>
                    <p className="font-mono text-xs font-bold text-white mt-1">{formatPrice(item.price)}</p>
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-slate-400 hover:text-pink font-mono text-[10px] uppercase tracking-wider flex items-center space-x-1 mt-2 font-bold transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 font-mono text-xs text-center text-slate-300">
                  <span className="font-bold text-white">{item.size}</span> / {item.color}
                </div>

                <div className="sm:col-span-2 flex justify-center">
                  <div className="flex items-center border border-white/15 bg-[#101D3F] rounded-md">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="p-2 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold px-2 text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="p-2 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 font-mono text-sm font-bold text-right text-white">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Column (4 cols) */}
          <div className="lg:col-span-4 bg-[#101D3F] border border-white/10 p-8 rounded-2xl shadow-subtle space-y-6 h-fit text-white">
            <h2 className="font-serif text-xl font-normal text-white uppercase tracking-wider border-b border-white/10 pb-4">
              Order Investment
            </h2>

            {/* Promo Code */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between bg-royal/20 border border-royal/40 p-3 rounded-md text-xs font-mono text-royal-light">
                  <span className="font-bold">VIP CODE: {couponCode}</span>
                  <button onClick={removeCoupon} className="text-slate-400 hover:text-white font-bold uppercase text-[10px]">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="ENTER VIP PROMO CODE"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#0A1128] border border-white/15 px-3 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-royal uppercase rounded-md"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-royal hover:bg-royal-dark text-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponMsg && <p className="text-pink font-mono text-[10px] mt-1 font-bold">{couponMsg}</p>}
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300 border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-pink font-bold">
                  <span>VIP Promo Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>White-Glove Delivery</span>
                <span className="text-white font-bold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (12%)</span>
                <span className="text-white font-bold">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-3">
                <span>Total Investment</span>
                <span className="text-white font-mono text-lg font-bold">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-royal hover:bg-royal-dark text-white py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center space-x-2 rounded-md shadow-luxury"
            >
              <span>Proceed to VIP Checkout</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
