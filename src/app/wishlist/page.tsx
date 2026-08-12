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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0A1128] text-white">
      <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-10 text-white">
        <div>
          <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal-light flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
            <span>SAVED ARCHIVE</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white mt-1">
            My Saved Wishlist ({items.length})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="font-mono text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors font-bold"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-[#101D3F] border border-white/10 p-8 max-w-lg mx-auto rounded-2xl shadow-subtle text-white">
          <div className="w-16 h-16 rounded-full bg-[#0A1128] flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Heart className="w-8 h-8 text-pink" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-white mb-2">Your Wishlist is Empty</h2>
          <p className="font-mono text-xs text-slate-400 mb-6 uppercase tracking-wider">Save your favorite collaboration drops as you explore the vault.</p>
          <Link
            href="/shop"
            className="inline-block bg-royal hover:bg-royal-dark text-white px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest transition-colors rounded-md shadow-luxury"
          >
            Explore Vault Drops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-white">
          {items.map((item) => (
            <div key={item.productId} className="bg-[#101D3F] border border-white/10 hover:border-royal/60 hover:shadow-card p-4 flex flex-col justify-between group relative transition-all rounded-2xl overflow-hidden shadow-subtle text-white">
              <div>
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-900 mb-3 rounded-xl">
                  <Link href={`/product/${item.slug}`}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-3 left-3 p-1.5 bg-[#0A1128]/80 rounded-md border border-white/15 text-slate-400 hover:text-pink transition-colors shadow-sm"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-mono text-xs font-bold text-white">
                    {formatPrice(item.price)}
                  </span>
                </div>

                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-serif text-xs font-normal text-white group-hover:text-royal-light line-clamp-1 transition-colors">
                    {item.name}
                  </h3>
                </Link>
              </div>

              <button
                onClick={() => handleMoveToCart(item)}
                className="mt-4 w-full bg-royal hover:bg-royal-dark text-white py-3 font-mono text-xs uppercase font-bold tracking-widest transition-colors flex items-center justify-center space-x-2 rounded-md shadow-sm"
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
