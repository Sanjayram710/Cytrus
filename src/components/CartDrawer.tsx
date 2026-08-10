'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getCartSubtotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = getCartSubtotal();
  const tax = Math.round(Math.max(0, subtotal - couponDiscount) * 0.12);
  const shipping = subtotal >= 10000 || subtotal === 0 ? 0 : 500;
  const total = Math.max(0, subtotal - couponDiscount + tax + shipping);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();

      if (data.valid) {
        applyCoupon(data.code, data.discountAmount);
        setCouponInput('');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-luxury-cream shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-luxury-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-luxury-black" />
              <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-luxury-black">
                Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-luxury-black hover:text-luxury-gold transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-luxury-gold/40 mx-auto mb-4" />
                <p className="font-serif text-lg text-luxury-black mb-2">Your shopping bag is empty</p>
                <p className="text-xs text-gray-500 mb-6">Discover our latest editorial evening dresses and silk drapes.</p>
                <button
                  onClick={closeCart}
                  className="bg-luxury-black text-luxury-cream px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold hover:text-luxury-black transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex space-x-4 border-b border-luxury-border/60 pb-6"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-28 object-cover object-center bg-white"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-sm font-semibold text-luxury-black line-clamp-1">
                          {item.productName}
                        </h3>
                        <button
                          onClick={() => removeItem(item.productId, item.size, item.color)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">
                        Size: <span className="text-luxury-black font-semibold">{item.size}</span> | Color:{' '}
                        <span className="text-luxury-black font-semibold">{item.color}</span>
                      </p>
                      <p className="text-xs font-semibold text-luxury-black mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-luxury-border bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="p-1.5 hover:bg-luxury-cream text-luxury-black"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-luxury-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="p-1.5 hover:bg-luxury-cream text-luxury-black"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-luxury-black">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-luxury-border bg-white space-y-4">
              {/* Coupon Form */}
              <div className="space-y-1">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-luxury-cream p-2.5 border border-luxury-gold/40 text-xs">
                    <div className="flex items-center space-x-2 text-luxury-gold font-bold">
                      <Tag className="w-4 h-4" />
                      <span>COUPON APPLIED: {couponCode} (-{formatPrice(couponDiscount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 border border-luxury-border px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-luxury-gold"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="bg-luxury-black text-luxury-cream px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-luxury-gold hover:text-luxury-black transition-colors"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-luxury-border">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-luxury-black">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-luxury-gold font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (12% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span>{shipping === 0 ? <span className="text-green-700 font-semibold">FREE</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-serif text-base font-bold text-luxury-black pt-2 border-t border-luxury-border">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-luxury-black text-luxury-cream py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 hover:bg-luxury-gold hover:text-luxury-black transition-all shadow-luxury"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
