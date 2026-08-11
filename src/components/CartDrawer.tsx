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
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-ink" />
              <h2 className="font-serif text-xl font-normal uppercase tracking-wider text-ink">
                Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-muted hover:text-ink transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="font-serif text-lg text-ink mb-2">Your bag is empty</p>
                <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">Explore our latest oversized & streetwear drops.</p>
                <button
                  onClick={closeCart}
                  className="bg-accent text-canvas px-6 py-3 font-mono text-xs uppercase tracking-widest font-semibold hover:bg-ink transition-colors border border-accent"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex space-x-4 border-b border-border pb-6"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-24 object-cover object-center bg-canvas border border-border"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-sm font-normal text-ink line-clamp-1">
                          {item.productName}
                        </h3>
                        <button
                          onClick={() => removeItem(item.productId, item.size, item.color)}
                          className="text-muted hover:text-ink transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="font-mono text-[10px] text-muted uppercase tracking-wider mt-1">
                        Size: <span className="text-ink font-semibold">{item.size}</span> | Color:{' '}
                        <span className="text-ink font-semibold">{item.color}</span>
                      </p>
                      <p className="font-mono text-xs font-semibold text-accent mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border bg-canvas">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="p-1.5 hover:bg-surface text-ink"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-mono text-xs font-bold text-ink">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="p-1.5 hover:bg-surface text-ink"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-semibold text-ink">
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
            <div className="p-6 border-t border-border bg-surface space-y-4">
              {/* Coupon Form */}
              <div className="space-y-1">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-canvas p-2.5 border border-border text-xs">
                    <div className="flex items-center space-x-2 text-accent font-mono font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>COUPON: {couponCode} (-{formatPrice(couponDiscount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="font-mono text-xs text-muted hover:text-ink font-semibold underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="COUPON CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-canvas border border-border px-3 py-2 font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-accent text-ink"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="bg-accent text-canvas px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-ink transition-colors border border-accent"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="font-mono text-[10px] text-muted">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 font-mono text-xs text-muted pt-2 border-t border-border">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-accent font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (12% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span>{shipping === 0 ? <span className="text-ink font-semibold">FREE</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-serif text-base font-normal text-ink pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="font-mono font-semibold text-accent">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center space-x-2 hover:bg-ink transition-all border border-accent"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
