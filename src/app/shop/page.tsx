'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  Eye,
  Heart,
  ShoppingBag,
  Check,
  ChevronDown,
  X,
  Sparkles,
  Flame,
} from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialNewArrival = searchParams.get('newArrival') === 'true';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `/api/products?sort=${sortBy}`;
    if (selectedCategory) url += `&category=${selectedCategory}`;
    if (selectedSize) url += `&size=${selectedSize}`;
    if (initialNewArrival) url += `&newArrival=true`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, sortBy, selectedSize, initialNewArrival]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0]?.url || '',
      size: selectedSize || 'M',
      color: 'Black',
      price: product.price,
      quantity: 1,
    });
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-charcoal">
      {/* Header Banner */}
      <div className="border-b border-border pb-8 mb-10 text-charcoal">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
              <span>THE COMPLETE VAULT ARCHIVE</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-charcoal mt-1">
              Celebrity Collaboration Drops
            </h1>
          </div>
          <p className="font-mono text-xs text-muted uppercase tracking-widest max-w-sm font-medium">
            Strictly limited editions. Engineered with 320+ GSM French Terry cotton.
          </p>
        </div>
      </div>

      {/* Filter and Product Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-charcoal">
        {/* Desktop Filter Sidebar (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 space-y-8">
          <div className="bg-white border border-border p-6 rounded-2xl shadow-subtle space-y-6 text-charcoal">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-charcoal flex items-center">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-royal" /> Refine Archive
              </h3>
              {(selectedCategory || selectedSize) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSize('');
                  }}
                  className="font-mono text-[10px] uppercase text-royal hover:underline font-bold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Silhouette Category Filter */}
            <div>
              <h4 className="font-mono text-[11px] uppercase font-bold tracking-wider text-charcoal mb-3">
                Drop Silhouette
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left font-mono text-xs uppercase tracking-wider px-3 py-2 transition-all rounded-md flex items-center justify-between ${
                    selectedCategory === ''
                      ? 'bg-royal text-white font-bold shadow-sm'
                      : 'text-charcoal/80 hover:bg-surface-tint hover:text-charcoal'
                  }`}
                >
                  <span>All Drop Categories</span>
                  {selectedCategory === '' && <Check className="w-3 h-3 text-white" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left font-mono text-xs uppercase tracking-wider px-3 py-2 transition-all rounded-md flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-royal text-white font-bold shadow-sm'
                        : 'text-charcoal/80 hover:bg-surface-tint hover:text-charcoal'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.slug && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="border-t border-border pt-6">
              <h4 className="font-mono text-[11px] uppercase font-bold tracking-wider text-charcoal mb-3">
                Boxy Streetwear Fit
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                    className={`py-2 text-center font-mono text-xs uppercase transition-all rounded-md border ${
                      selectedSize === s
                        ? 'bg-royal text-white border-royal font-bold shadow-sm'
                        : 'bg-surface-tint border-border text-charcoal hover:border-royal'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid (9 cols) */}
        <div className="lg:col-span-9 text-charcoal">
          {/* Top Bar Sort & Count */}
          <div className="flex items-center justify-between bg-white border border-border px-4 py-3 mb-6 rounded-2xl shadow-subtle text-charcoal">
            <span className="font-mono text-xs text-muted uppercase tracking-wider font-semibold">
              Showing <span className="text-charcoal font-bold">{products.length}</span> Collaboration Pieces
            </span>

            <div className="flex items-center space-x-3 text-charcoal">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden font-mono text-xs uppercase font-bold text-charcoal border border-border px-3 py-1.5 flex items-center rounded-md bg-surface-tint"
              >
                <Filter className="w-3.5 h-3.5 mr-1 text-royal" /> Filters
              </button>

              <div className="flex items-center space-x-2 text-charcoal">
                <span className="hidden sm:inline font-mono text-xs text-muted uppercase">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-border text-charcoal font-mono text-xs uppercase px-2.5 py-1.5 rounded-md focus:outline-none focus:border-royal"
                >
                  <option value="featured">Featured Allocation</option>
                  <option value="price-asc">Investment: Low to High</option>
                  <option value="price-desc">Investment: High to Low</option>
                  <option value="newest">Latest Drops</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-24 font-mono text-xs uppercase tracking-widest text-muted">
              Loading Drop Vault...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white border border-border p-8 rounded-2xl shadow-subtle text-charcoal">
              <p className="font-serif text-xl text-charcoal mb-2">No Matching Drops Found</p>
              <p className="font-mono text-xs text-muted uppercase tracking-wider mb-6">
                Try selecting another category or fit filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSize('');
                }}
                className="bg-royal hover:bg-royal-dark text-white px-6 py-2.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors rounded-md shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-charcoal">
              {products.map((product, idx) => {
                const isWish = isInWishlist(product.id);
                const primaryImg =
                  product.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000';

                const stockRemaining = 10 + ((idx * 6) % 24);

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white border border-border hover:border-royal/50 hover:shadow-card transition-all duration-300 flex flex-col justify-between rounded-2xl overflow-hidden shadow-subtle text-charcoal"
                  >
                    {/* Top Drop Header */}
                    <div className="p-2 bg-surface-tint border-b border-border flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-charcoal">
                      <span className="font-bold">DROP 0{idx + 1}</span>
                      <span className="text-muted font-medium flex items-center space-x-1">
                        <Flame className="w-2.5 h-2.5 inline text-pink" />
                        <span>{stockRemaining} Left</span>
                      </span>
                    </div>

                    {/* Image Stage */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                      <Link href={`/product/${product.slug}`} className="block w-full h-full">
                        <img
                          src={primaryImg}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Wishlist Button */}
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
                            ? 'bg-charcoal text-pink border-charcoal'
                            : 'bg-white/90 text-charcoal border-border hover:bg-royal hover:text-white hover:border-royal'
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-current text-pink' : ''}`} />
                      </button>

                      {/* Hover Actions */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2 z-10">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="flex-1 bg-white/95 backdrop-blur-sm border border-border text-charcoal hover:bg-charcoal hover:text-white py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 rounded-md shadow-sm"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="bg-royal hover:bg-royal-dark text-white px-3 py-2 font-mono text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center justify-center space-x-1 rounded-md shadow-sm"
                          title="Add to Bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Bag</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Meta Details in Black */}
                    <div className="p-4 bg-white border-t border-border text-charcoal">
                      <p className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-1 font-medium">
                        {product.category?.name || '320 GSM HEAVYWEIGHT'}
                      </p>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-serif text-sm font-normal text-charcoal group-hover:text-royal transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mt-2.5 flex items-baseline justify-between">
                        <span className="font-mono text-xs font-bold text-royal">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                          <span className="font-mono text-[10px] line-through text-muted">
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
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono uppercase tracking-widest text-muted">Loading Vault...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
