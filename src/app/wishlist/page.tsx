'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (item: any) => {
    addItem({
      productId: item.productId,
      productName: item.name,
      productImage: item.image,
      size: 'M',
      color: 'Black',
      price: item.price,
      quantity: 1,
    });
    removeItem(item.productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      <div className="flex justify-between items-end border-b border-border pb-6 mb-10">
        <div>
          <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
            SAVED VAULT
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink mt-1">
            My Saved Wishlist ({items.length})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-border p-8 max-w-lg mx-auto">
          <Heart className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="font-serif text-xl font-normal text-ink mb-2">Your Wishlist is Empty</h2>
          <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">Save your favorite t-shirts and streetwear cuts as you explore.</p>
          <Link
            href="/shop"
            className="inline-block bg-accent text-canvas px-8 py-4 font-mono text-xs font-semibold uppercase tracking-widest hover:bg-ink transition-colors border border-accent"
          >
            Explore Drops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.productId} className="bg-surface border border-border hover:border-accent p-4 flex flex-col justify-between group relative transition-colors">
              {/* Signature Swing-Tag Detail */}
              <div className="absolute top-0 right-3 z-20 flex flex-col items-center pointer-events-none">
                <div className="w-[1px] h-3.5 bg-border group-hover:bg-accent transition-colors" />
                <div className="swing-tag px-2 py-0.5 text-center group-hover:-translate-y-0.5 group-hover:-rotate-2 transition-transform duration-300">
                  <span className="font-mono text-[10px] font-semibold tracking-wider text-accent block">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>

              <div>
                <div className="relative h-72 overflow-hidden bg-surface mb-3 border border-border">
                  <Link href={`/product/${item.slug}`}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-3 left-3 p-1.5 bg-canvas/90 border border-border text-muted hover:text-ink"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-serif text-xs font-normal text-ink group-hover:text-accent line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
              </div>

              <button
                onClick={() => handleMoveToCart(item)}
                className="mt-4 w-full bg-accent text-canvas py-3 font-mono text-xs uppercase font-medium tracking-widest hover:bg-ink transition-colors flex items-center justify-center space-x-2 border border-accent"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
