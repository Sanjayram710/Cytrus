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
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[460px] bg-[#0A1128] border-l border-white/10 z-50 flex flex-col justify-between shadow-2xl text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-[#060B1A] text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-royal-light" />
                  <h2 className="font-serif text-lg font-normal tracking-tight text-white">
                    Client Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-md"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Milestone Indicator */}
              <div className="space-y-1.5 text-white">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <span>
                    {subtotal >= threshold ? (
                      <strong className="text-emerald-400 font-bold">✓ Complimentary Express Courier Unlocked</strong>
                    ) : (
                      <>Add {formatPrice(threshold - subtotal)} for Free White-Glove Delivery</>
                    )}
                  </span>
                  <span className="font-bold text-white">{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-royal transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bag Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-white/10 text-white">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-4 text-white">
                  <div className="w-16 h-16 rounded-full bg-[#101D3F] flex items-center justify-center mx-auto text-slate-400 border border-white/10">
                    <ShoppingBag className="w-8 h-8 text-royal-light" />
                  </div>
                  <p className="font-serif text-xl font-normal text-white">Your Bag is Empty</p>
                  <p className="font-mono text-xs text-slate-400 max-w-xs mx-auto">
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
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="pt-5 first:pt-0 flex space-x-4 text-white">
                    {/* Thumbnail */}
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-24 object-cover object-center bg-slate-900 border border-white/10 flex-shrink-0 rounded-xl"
                    />

                    {/* Meta in White Typography */}
                    <div className="flex-1 flex flex-col justify-between text-white">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-xs font-normal text-white line-clamp-1 pr-2">
                            {item.productName}
                          </h3>
                          <button
                            onClick={() => removeItem(item.productId, item.size, item.color)}
                            className="text-slate-400 hover:text-pink transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
                          Size: <span className="text-white font-bold">{item.size}</span> · Color: {item.color}
                        </p>
                      </div>

                      {/* Quantity Selector & Price */}
                      <div className="flex items-center justify-between mt-3 text-white">
                        <div className="flex items-center border border-white/15 bg-[#101D3F] rounded-md">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                            className="p-1.5 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs px-2.5 font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                            className="p-1.5 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-xs font-bold text-white">
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
              <div className="p-6 bg-[#060B1A] border-t border-white/10 space-y-4 text-white">
                {/* VIP Promo Code */}
                {couponCode ? (
                  <div className="flex items-center justify-between bg-royal/20 border border-royal/40 p-2.5 text-xs font-mono rounded-md text-royal-light">
                    <span className="font-bold">VIP CODE: {couponCode} (-{formatPrice(couponDiscount)})</span>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-white text-[10px] uppercase font-bold"
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
                      className="flex-1 bg-[#101D3F] border border-white/15 px-3 py-2 text-xs font-mono uppercase text-white focus:outline-none focus:border-royal placeholder:text-slate-500 rounded-md"
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
                <div className="space-y-1.5 font-mono text-xs text-slate-300 border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-pink font-bold">
                      <span>VIP Discount</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
                    <span>Estimated Total</span>
                    <span className="font-mono text-white font-bold text-base">
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

                <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-royal-light" />
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
