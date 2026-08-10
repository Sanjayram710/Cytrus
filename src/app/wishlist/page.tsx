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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end border-b border-luxury-border pb-6 mb-10">
        <div>
          <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
            SAVED VAULT
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-luxury-black mt-1">
            My Saved Wishlist ({items.length})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs uppercase tracking-widest font-bold text-red-600 hover:underline"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-luxury-border p-8 max-w-lg mx-auto">
          <Heart className="w-16 h-16 text-luxury-gold/40 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-luxury-black mb-2">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Save your favorite evening dresses and silk gowns as you explore.</p>
          <Link
            href="/shop"
            className="inline-block bg-luxury-black text-luxury-cream px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-colors"
          >
            Explore Couture Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.productId} className="bg-white border border-luxury-border p-4 flex flex-col justify-between group">
              <div>
                <div className="relative h-72 overflow-hidden bg-luxury-cream mb-3">
                  <Link href={`/product/${item.slug}`}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-red-600 hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-serif text-xs font-bold text-luxury-black group-hover:text-luxury-gold line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-xs font-bold text-luxury-black mt-1">{formatPrice(item.price)}</p>
              </div>

              <button
                onClick={() => handleMoveToCart(item)}
                className="mt-4 w-full bg-luxury-black text-luxury-cream py-3 text-xs uppercase font-bold tracking-widest hover:bg-luxury-gold hover:text-black transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move to Bag</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
