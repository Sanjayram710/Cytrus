'use client';

import React from 'react';
import { X, ShieldCheck, Zap, Sparkles, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Offer {
  title: string;
  description: string;
  minSpend?: string;
  tag: string;
}

interface ProductOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export default function ProductOffersModal({ isOpen, onClose, product }: ProductOffersModalProps) {
  if (!isOpen) return null;

  const productName = product?.name || 'CYTRUS Heavyweight Tee';
  const productPrice = product?.price || 1500;
  const primaryImg = product?.images?.[0]?.url || product?.image || '';

  // Clean custom offer text by stripping any "(Code: XYZ)" text if previously entered
  const cleanedCustomOffer = product?.customOffer
    ? product.customOffer.replace(/\s*\(Code:[^\)]+\)/i, '').trim()
    : null;

  let offers: Offer[] = [];

  if (cleanedCustomOffer) {
    // If Admin set a specific custom offer for this product, show ONLY that offer!
    offers = [
      {
        title: cleanedCustomOffer.toUpperCase(),
        description: `Exclusive promotion assigned to ${productName}. Applied automatically at checkout.`,
        minSpend: 'Exclusive Product Perk',
        tag: 'SPECIAL OFFER',
      },
    ];
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4 z-50">
        <div className="bg-canvas border border-border max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-ink hover:text-accent transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-4 border-b border-border pb-4">
            <div className="p-2.5 bg-ink text-canvas border border-border">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-semibold tracking-[0.25em] text-accent block">
                ATELIER SPECIAL PROMOTION
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-ink">
                {offers.length === 1 ? 'Exclusive Product Offer' : 'Exclusive Product Offers'}
              </h2>
            </div>
          </div>

          {/* Product Banner if Product is Passed */}
          {product && (
            <div className="bg-surface border border-border p-3 mb-5 flex items-center space-x-3">
              {primaryImg && (
                <img
                  src={primaryImg}
                  alt={productName}
                  className="w-12 h-14 object-cover border border-border bg-canvas"
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted block">
                  ACTIVE OFFER FOR
                </span>
                <h4 className="font-serif text-sm font-bold text-ink truncate">{productName}</h4>
                <span className="font-mono text-xs font-semibold text-accent">{formatPrice(productPrice)}</span>
              </div>
            </div>
          )}

          {/* Offers List */}
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            {offers.length === 0 ? (
              <div className="p-8 text-center bg-surface border border-border">
                <p className="font-mono text-xs uppercase text-muted font-bold">
                  No active promotional offer assigned to this product.
                </p>
              </div>
            ) : (
              offers.map((offer, idx) => (
                <div
                  key={idx}
                  className="bg-surface border border-border p-4 relative group hover:border-accent transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-ink text-canvas font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 font-semibold flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5 text-accent mr-1" />
                      <span>{offer.tag}</span>
                    </span>
                    <span className="font-mono text-[10px] text-muted uppercase font-semibold">
                      {offer.minSpend}
                    </span>
                  </div>

                  <h3 className="font-serif text-sm sm:text-base font-normal text-ink mb-1">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed font-normal mb-3">
                    {offer.description}
                  </p>

                  <div className="pt-2 border-t border-border/60 flex items-center space-x-1.5 text-accent font-mono text-[10px] uppercase font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Offer Applied Automatically at Checkout</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-muted font-mono text-[10px] uppercase tracking-wider">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-accent" /> Instant savings automatically calculated at checkout
            </span>
            <button
              onClick={onClose}
              className="text-ink hover:text-accent font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
