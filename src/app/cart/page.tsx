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
  const shipping = subtotal >= 10000 || subtotal === 0 ? 0 : 500;
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
        setCouponMsg(`Coupon ${data.code} applied! Saved ${formatPrice(data.discountAmount)}`);
        setCouponInput('');
      } else {
        setCouponMsg(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponMsg('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-luxury-border pb-6 mb-10">
        <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
          YOUR SELECTIONS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-luxury-black mt-1">
          Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-luxury-border p-8 max-w-lg mx-auto">
          <ShoppingBag className="w-16 h-16 text-luxury-gold/40 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-luxury-black mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Explore our evening gowns, silk sarees, and bespoke suits.</p>
          <Link
            href="/shop"
            className="inline-block bg-luxury-black text-luxury-cream px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-colors"
          >
            Explore Couture Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items Table (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="hidden sm:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-gray-500 pb-3 border-b border-luxury-border">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Size & Color</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 border-b border-luxury-border/60 pb-6"
              >
                <div className="sm:col-span-6 flex space-x-4 w-full">
                  <img src={item.productImage} alt={item.productName} className="w-20 h-28 object-cover bg-white" />
                  <div>
                    <h3 className="font-serif text-sm font-bold text-luxury-black line-clamp-1">{item.productName}</h3>
                    <p className="text-xs font-semibold text-luxury-black mt-1">{formatPrice(item.price)}</p>
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-xs text-red-600 font-semibold hover:underline mt-2 flex items-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 text-xs text-center uppercase tracking-wider font-medium text-gray-700">
                  <span>{item.size} / {item.color}</span>
                </div>

                <div className="sm:col-span-2 flex justify-center">
                  <div className="flex items-center border border-luxury-border bg-white">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="p-1.5 hover:bg-luxury-cream"
                    >
                      <Minus className="w-3.5 h-3.5 text-luxury-black" />
                    </button>
                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="p-1.5 hover:bg-luxury-cream"
                    >
                      <Plus className="w-3.5 h-3.5 text-luxury-black" />
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 text-right font-bold text-sm text-luxury-black">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-luxury-border p-6 space-y-6 h-fit shadow-subtle">
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-luxury-black border-b border-luxury-border pb-3">
              Order Summary
            </h2>

            {/* Coupon input */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider mb-2 text-luxury-black">
                Promotional Code
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between bg-luxury-cream p-3 border border-luxury-gold text-xs font-bold text-luxury-gold">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>{couponCode} (-{formatPrice(couponDiscount)})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-red-600 hover:underline text-xs font-bold">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="ENTER CODE (e.g. LUXE10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 border border-luxury-border px-3 py-2 text-xs uppercase focus:outline-none focus:border-luxury-gold"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-luxury-black text-luxury-cream px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-luxury-gold hover:text-black"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponMsg && <p className="text-[11px] font-medium text-luxury-gold mt-1">{couponMsg}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-gray-600 pt-3 border-t border-luxury-border">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-luxury-black">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-luxury-gold font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (12% GST)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-700 font-bold">COMPLIMENTARY</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg font-bold text-luxury-black pt-3 border-t border-luxury-border">
                <span>Estimated Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-luxury-black text-luxury-cream py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 hover:bg-luxury-gold hover:text-black transition-all shadow-luxury"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
