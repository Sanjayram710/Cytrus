'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Eye, Heart, ShoppingBag } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0]?.url || '',
      size: 'M',
      color: 'Black',
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0A1128] text-white">
      <div className="border-b border-white/10 pb-6 mb-10 text-white">
        <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal-light flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
          <span>VAULT ARCHIVE SEARCH</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white mt-1">
          Search Results for "{query}"
        </h1>
        <p className="font-mono text-xs text-slate-400 uppercase tracking-wider mt-2">
          Found {products.length} matching collaboration pieces
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 font-mono uppercase tracking-widest text-slate-400 text-xs">Scanning Vault Archive...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-[#101D3F] border border-white/10 p-8 max-w-lg mx-auto rounded-2xl shadow-subtle text-white">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-normal text-white mb-2">No Matching Drops Found</h2>
          <p className="font-mono text-xs text-slate-400 mb-6 uppercase tracking-wider">
            Try searching for celebrity collaborators, boxy cuts, or acid wash editions.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-royal hover:bg-royal-dark text-white px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors rounded-md shadow-luxury"
          >
            Browse All Drops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-white">
          {products.map((product) => {
            const isWish = isInWishlist(product.id);
            const primaryImg = product.images?.[0]?.url || '';

            return (
              <div
                key={product.id}
                className="group relative bg-[#101D3F] border border-white/10 hover:border-royal/60 hover:shadow-card transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-subtle text-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                  <Link href={`/product/${product.slug}`}>
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <button
                    onClick={() =>
                      toggleWishlist({
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        image: primaryImg,
                        price: product.price,
                      })
                    }
                    className={`absolute top-3 right-3 z-10 p-2 rounded-md border transition-all ${
                      isWish
                        ? 'bg-pink text-white border-pink'
                        : 'bg-[#0A1128]/80 text-white border-white/20 hover:bg-royal hover:text-white hover:border-royal'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-current text-white' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2 z-10">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="flex-1 bg-[#0A1128]/95 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-[#0A1128] py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 rounded-md shadow-sm"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-royal hover:bg-royal-dark text-white px-3.5 py-2 transition-colors rounded-md shadow-sm"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#101D3F] border-t border-white/10 text-white">
                  <p className="font-mono text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-1">
                    {product.category?.name || 'EDITION'}
                  </p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-xs font-normal text-white group-hover:text-royal-light transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-2 flex items-baseline justify-between text-white">
                    <span className="font-mono text-xs font-bold text-white">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono uppercase tracking-widest text-slate-400">Searching Vault...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
