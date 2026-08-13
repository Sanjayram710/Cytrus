'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const router = useRouter();
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
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  const subtotal = getCartSubtotal();
  const threshold = 2500;
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setCouponMsg(`VIP Code ${data.code} applied (-${formatPrice(data.discountAmount)})`);
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

  const handleProceedToCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[460px] bg-white border-l border-border z-50 flex flex-col justify-between shadow-2xl text-charcoal"
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-surface-tint text-charcoal">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-royal" />
                  <h2 className="font-serif text-lg font-normal tracking-tight text-charcoal">
                    Client Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-muted hover:text-charcoal transition-colors rounded-md"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Milestone Indicator */}
              <div className="space-y-1.5 text-charcoal">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-muted">
                  <span>
                    {subtotal >= threshold ? (
                      <strong className="text-emerald-600 font-bold">✓ Complimentary Express Courier Unlocked</strong>
                    ) : (
                      <>Add {formatPrice(threshold - subtotal)} for Free White-Glove Delivery</>
                    )}
                  </span>
                  <span className="font-bold text-charcoal">{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-royal transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bag Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-border text-charcoal">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-4 text-charcoal">
                  <div className="w-16 h-16 rounded-full bg-surface-tint flex items-center justify-center mx-auto text-muted border border-border">
                    <ShoppingBag className="w-8 h-8 text-royal" />
                  </div>
                  <p className="font-serif text-xl font-normal text-charcoal">Your Bag is Empty</p>
                  <p className="font-mono text-xs text-muted max-w-xs mx-auto">
                    Explore our numbered collaboration drops before units are permanently archived.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-2 bg-royal hover:bg-royal-dark text-white px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-widest transition-colors rounded-md shadow-sm"
                  >
                    Browse The Vault
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="pt-5 first:pt-0 flex space-x-4 text-charcoal">
                    {/* Thumbnail */}
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-24 object-cover object-center bg-slate-100 border border-border flex-shrink-0 rounded-xl"
                    />

                    {/* Meta in Black Typography */}
                    <div className="flex-1 flex flex-col justify-between text-charcoal">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-xs font-normal text-charcoal line-clamp-1 pr-2">
                            {item.productName}
                          </h3>
                          <button
                            onClick={() => removeItem(item.productId, item.size, item.color)}
                            className="text-muted hover:text-pink transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mt-0.5">
                          Size: <span className="text-charcoal font-bold">{item.size}</span> · Color: {item.color}
                        </p>
                      </div>

                      {/* Quantity Selector & Price */}
                      <div className="flex items-center justify-between mt-3 text-charcoal">
                        <div className="flex items-center border border-border bg-surface-tint rounded-md">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                            className="p-1.5 text-muted hover:text-charcoal"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs px-2.5 font-bold text-charcoal">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                            className="p-1.5 text-muted hover:text-charcoal"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-xs font-bold text-royal">
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
              <div className="p-6 bg-surface-tint border-t border-border space-y-4 text-charcoal">
                {/* VIP Promo Code */}
                {couponCode ? (
                  <div className="flex items-center justify-between bg-royal-light border border-royal/30 p-2.5 text-xs font-mono rounded-md text-royal">
                    <span className="font-bold">VIP CODE: {couponCode} (-{formatPrice(couponDiscount)})</span>
                    <button
                      onClick={removeCoupon}
                      className="text-muted hover:text-charcoal text-[10px] uppercase font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="VIP INVITATION CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-border px-3 py-2 text-xs font-mono uppercase text-charcoal focus:outline-none focus:border-royal placeholder:text-muted rounded-md"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="bg-royal hover:bg-royal-dark text-white px-4 py-2 text-xs font-mono uppercase font-bold tracking-wider transition-colors rounded-md shadow-sm"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponMsg && <p className="font-mono text-[10px] text-pink font-bold">{couponMsg}</p>}

                {/* Subtotal Calculation */}
                <div className="space-y-1.5 font-mono text-xs text-charcoal border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-charcoal font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-pink font-bold">
                      <span>VIP Discount</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal font-bold text-sm pt-2 border-t border-border">
                    <span>Estimated Total</span>
                    <span className="font-mono text-royal font-bold text-base">
                      {formatPrice(Math.max(0, subtotal - couponDiscount))}
                    </span>
                  </div>
                </div>

                {/* Direct Checkout CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-royal hover:bg-royal-dark text-white py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 flex items-center justify-center space-x-2 rounded-md shadow-luxury"
                >
                  <span>Proceed to VIP Checkout</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-muted uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-royal" />
                  <span>Insured Packaging · Secured Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
