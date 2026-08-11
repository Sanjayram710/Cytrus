'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
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
  const shippingThreshold = 2500;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 250;
  const total = Math.max(0, subtotal - couponDiscount + tax + shipping);
  const progressToFreeShip = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));

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
        setCouponError(data.message || 'Invalid collaboration access code');
      }
    } catch (err) {
      setCouponError('Failed to apply code');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory border-l border-border flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-softgrey/60">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-royal" />
              <h2 className="font-serif text-lg font-normal uppercase tracking-wider text-charcoal">
                Client Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-muted hover:text-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Meter */}
          <div className="bg-royal-light px-6 py-2.5 border-b border-royal/20 text-[10px] font-mono uppercase tracking-wider text-royal flex flex-col space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span>
                {subtotal >= shippingThreshold
                  ? '✓ Complimentary White-Glove Express Unlocked'
                  : `Add ${formatPrice(shippingThreshold - subtotal)} for Express Free Shipping`}
              </span>
              <span>{progressToFreeShip}%</span>
            </div>
            <div className="w-full h-1 bg-royal/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-royal transition-all duration-300"
                style={{ width: `${progressToFreeShip}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-10 h-10 text-muted mx-auto mb-3 opacity-60" />
                <p className="font-serif text-lg text-charcoal mb-1">Your bag is empty</p>
                <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">
                  Explore our exclusive celebrity drops.
                </p>
                <button
                  onClick={closeCart}
                  className="bg-royal text-ivory px-6 py-3 font-mono text-xs uppercase tracking-widest font-semibold hover:bg-pink transition-colors"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex space-x-4 border-b border-border pb-5"
                >
                  <div className="w-20 h-24 bg-softgrey border border-border overflow-hidden flex-shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-xs font-normal text-charcoal line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeItem(item.productId, item.size, item.color)}
                          className="text-muted hover:text-pink p-0.5 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-mono text-[10px] text-muted uppercase mt-0.5">
                        {item.color} · Size {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-border bg-softgrey">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                          }
                          className="p-1.5 text-charcoal hover:bg-ivory"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-mono text-xs font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                          }
                          className="p-1.5 text-charcoal hover:bg-ivory"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-mono text-xs font-semibold text-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="p-6 bg-softgrey/80 border-t border-border space-y-4">
              {/* Promo Code Input */}
              <div className="space-y-1">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-ivory border border-royal/30 p-2.5 font-mono text-xs">
                    <span className="text-royal font-semibold">CODE: {couponCode} (-{formatPrice(couponDiscount)})</span>
                    <button onClick={removeCoupon} className="text-pink hover:underline text-[10px] uppercase">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="VIP PROMO CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-ivory border border-border px-3 py-2 font-mono text-xs uppercase text-charcoal focus:outline-none focus:border-royal"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="bg-charcoal hover:bg-royal text-ivory px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="font-mono text-[10px] text-pink">{couponError}</p>}
              </div>

              {/* Total Calculation */}
              <div className="space-y-1.5 font-mono text-xs text-muted border-t border-border pt-3">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-charcoal">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-royal">
                    <span>VIP Code Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated GST (12%)</span>
                  <span className="text-charcoal">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Courier</span>
                  <span className="text-charcoal">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-charcoal pt-2 border-t border-border">
                  <span>Total Investment</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Signature Pink Checkout CTA Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-pink hover:bg-pink-hover text-ivory py-4 font-mono text-xs uppercase tracking-[0.22em] font-bold transition-all duration-200 flex items-center justify-center space-x-2 border border-pink shadow-luxury"
              >
                <span>Proceed to VIP Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
