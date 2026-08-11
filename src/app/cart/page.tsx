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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      <div className="border-b border-border pb-6 mb-10">
        <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
          YOUR SELECTIONS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink mt-1">
          Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-border p-8 max-w-lg mx-auto">
          <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="font-serif text-xl font-normal text-ink mb-2">Your Bag is Empty</h2>
          <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">Explore our latest oversized tees and streetwear drops.</p>
          <Link
            href="/shop"
            className="inline-block bg-accent text-canvas px-8 py-4 font-mono text-xs font-semibold uppercase tracking-widest hover:bg-ink transition-colors border border-accent"
          >
            Explore Drops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items Table (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="hidden sm:grid grid-cols-12 font-mono text-xs font-semibold uppercase tracking-wider text-muted pb-3 border-b border-border">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Size & Color</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 border-b border-border pb-6"
              >
                <div className="sm:col-span-6 flex space-x-4 w-full">
                  <img src={item.productImage} alt={item.productName} className="w-20 h-24 object-cover bg-surface border border-border" />
                  <div>
                    <h3 className="font-serif text-sm font-normal text-ink line-clamp-1">{item.productName}</h3>
                    <p className="font-mono text-xs font-semibold text-accent mt-1">{formatPrice(item.price)}</p>
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="font-mono text-xs text-muted hover:text-ink transition-colors mt-2 flex items-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 font-mono text-xs text-center uppercase tracking-wider text-muted">
                  <span>{item.size} / {item.color}</span>
                </div>

                <div className="sm:col-span-2 flex justify-center">
                  <div className="flex items-center border border-border bg-surface">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="p-1.5 hover:bg-canvas text-ink"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-mono text-xs font-bold text-ink">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="p-1.5 hover:bg-canvas text-ink"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 text-right font-mono font-semibold text-sm text-ink">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-surface border border-border p-6 space-y-6 h-fit">
            <h2 className="font-serif text-lg font-normal uppercase tracking-wider text-ink border-b border-border pb-3">
              Order Summary
            </h2>

            {/* Coupon input */}
            <div>
              <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-2 text-ink">
                Promotional Code
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between bg-canvas p-3 border border-border text-xs font-mono font-semibold text-accent">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>{couponCode} (-{formatPrice(couponDiscount)})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-muted hover:text-ink text-xs underline font-semibold">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="ENTER CODE (e.g. TEE500)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-canvas border border-border px-3 py-2 font-mono text-xs uppercase focus:outline-none focus:border-accent text-ink"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-accent text-canvas px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-ink transition-colors border border-accent"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponMsg && <p className="font-mono text-[11px] font-medium text-muted mt-1">{couponMsg}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 font-mono text-xs text-muted pt-3 border-t border-border">
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
                <span>Estimated Tax (12% GST)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span>{shipping === 0 ? <span className="text-ink font-semibold">COMPLIMENTARY</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg font-normal text-ink pt-3 border-t border-border">
                <span>Estimated Total</span>
                <span className="font-mono font-semibold text-accent">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center space-x-2 hover:bg-ink transition-all border border-accent"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
