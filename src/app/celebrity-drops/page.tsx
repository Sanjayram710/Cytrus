'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, ShoppingBag, Sparkles, Star, Zap, Flame, ShieldCheck } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import ProductOffersModal from '@/components/ProductOffersModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

export default function CelebrityDropsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [offerModalProduct, setOfferModalProduct] = useState<any | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVE'>('ALL');

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch('/api/products?limit=24')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0]?.url || '',
      size: product.variants?.[0]?.size || 'M',
      color: product.variants?.[0]?.color || 'Black',
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className="bg-canvas min-h-screen pb-24">
      {/* Editorial Hero Banner for Celebrity Drops */}
      <section className="relative border-b border-border bg-ink text-canvas py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 border border-white/20 text-white font-mono text-[10px] uppercase tracking-[0.25em] mb-2">
            <Flame className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>Strictly Numbered Runs • 2026 Collaboration Edition</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-[0.15em] uppercase text-white">
            CELEBRITY DROPS
          </h1>

          <p className="font-mono text-xs sm:text-sm text-canvas/70 max-w-2xl mx-auto uppercase tracking-wider leading-relaxed">
            Exclusive celebrity collaborations, limited numbered drops &amp; high-density 240 GSM organic French Terry streetwear capsules.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-canvas/80">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>NFC Authenticated</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Limited 500 Pieces Worldwide</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-accent" />
              <span>240 GSM Heavyweight French Terry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Navigation & Counter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-border">
          <div className="flex items-center space-x-3 font-mono text-xs uppercase tracking-wider">
            {(['ALL', 'ACTIVE', 'ARCHIVE'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-2 border transition-all ${
                  selectedFilter === tab
                    ? 'bg-ink text-canvas border-ink font-semibold'
                    : 'bg-surface text-muted border-border hover:text-ink'
                }`}
              >
                {tab === 'ALL' ? 'All Collaborations' : tab === 'ACTIVE' ? 'Active Drops (Live)' : 'Vault Archive'}
              </button>
            ))}
          </div>

          <span className="font-mono text-xs text-muted uppercase tracking-widest">
            Showing {products.length} Curated Drop Editions
          </span>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[3/4] bg-surface animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-10">
            {products.map((product) => {
              const inWish = isInWishlist(product.id);
              const primaryImage = product.images?.[0]?.url || '/mockups/tshirt_black_front.png';
              const secondaryImage = product.images?.[1]?.url || primaryImage;

              return (
                <div key={product.id} className="group relative flex flex-col justify-between">
                  {/* Image Container with Hover Actions */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface border border-border">
                    <Link href={`/product/${product.slug}`} className="block w-full h-full">
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {secondaryImage !== primaryImage && (
                        <img
                          src={secondaryImage}
                          alt={`${product.name} alternate view`}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                    </Link>

                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      <span className="bg-ink text-canvas font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold">
                        CELEBRITY DROP
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          image: primaryImage,
                          slug: product.slug,
                        });
                      }}
                      className="absolute top-3 right-3 p-2 bg-canvas/90 hover:bg-canvas text-ink transition-colors shadow-sm"
                      aria-label="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-accent text-accent' : ''}`} />
                    </button>

                    {/* Hover Bottom Action Suite */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                        className="p-2 bg-canvas text-ink hover:bg-accent hover:text-canvas transition-colors font-mono text-xs flex items-center space-x-1"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Quick Look</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-2 bg-accent text-canvas hover:bg-canvas hover:text-ink transition-colors font-mono text-xs flex items-center space-x-1 font-semibold"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Meta */}
                  <div className="pt-4 space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
                        {product.category?.name || '240 GSM HEAVYWEIGHT'}
                      </span>
                      <span className="font-mono text-[10px] text-accent font-semibold">
                        Strictly Numbered
                      </span>
                    </div>

                    <Link href={`/product/${product.slug}`} className="block">
                      <h3 className="font-serif text-sm text-ink group-hover:text-accent transition-colors line-clamp-1 font-medium">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center space-x-2 font-mono text-xs pt-0.5">
                      <span className="font-semibold text-ink">{formatPrice(product.price)}</span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-muted line-through text-[11px]">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onViewDetails={() => setQuickViewProduct(null)}
        />
      )}

      {/* Product Offers Modal */}
      {offerModalProduct && (
        <ProductOffersModal
          product={offerModalProduct}
          onClose={() => setOfferModalProduct(null)}
        />
      )}
    </div>
  );
}
