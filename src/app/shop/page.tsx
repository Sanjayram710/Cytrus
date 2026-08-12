'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Filter, SlidersHorizontal, Eye, Heart, ShoppingBag, X, ChevronDown, Check, Zap, Tag } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import ProductOffersModal from '@/components/ProductOffersModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [offerModalProduct, setOfferModalProduct] = useState<any | null>(null);

  // Active Filter state
  const currentCategory = searchParams.get('category') || '';
  const currentCollection = searchParams.get('collection') || '';
  const currentSort = searchParams.get('sort') || 'recommended';
  const currentQuery = searchParams.get('q') || '';
  const isNewArrival = searchParams.get('newArrival') === 'true';
  const isBestSeller = searchParams.get('bestSeller') === 'true';
  const selectedSize = searchParams.get('size') || '';

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    // Fetch filter categories & collections
    fetch('/api/categories').then((res) => res.json()).then((d) => d.categories && setCategories(d.categories));
    fetch('/api/collections').then((res) => res.json()).then((d) => d.collections && setCollections(d.collections));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has('limit')) params.set('limit', '16');

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/shop');
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-canvas">
      {/* Header Banner */}
      <div className="border-b border-border pb-8 mb-8 text-center sm:text-left">
        <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
          CYTRUS CATALOG
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-ink mt-1">
          {currentCategory ? `${currentCategory.replace('-', ' ')} Collection` : 'All Streetwear & Silhouette Drops'}
        </h1>
        {currentQuery && (
          <p className="font-mono text-xs uppercase tracking-widest text-ink mt-2">
            Showing search results for "{currentQuery}"
          </p>
        )}
      </div>

      {/* Filter Controls & Sort Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-ink border border-border px-4 py-2 bg-surface"
        >
          <Filter className="w-3.5 h-3.5 text-accent" />
          <span>Filters</span>
        </button>

        <div className="hidden lg:flex items-center space-x-2 font-mono text-xs text-muted uppercase tracking-wider">
          <span>Total {products.length} Products Found</span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-3">
          <label className="font-mono text-xs uppercase tracking-widest text-muted hidden sm:inline">
            Sort By:
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-surface border border-border font-mono text-xs uppercase tracking-wider text-ink px-3 py-2 focus:outline-none focus:border-accent"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="best-selling">Best Sellers</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block space-y-8 pr-4">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink">
                Categories
              </h3>
              {(currentCategory || currentCollection || selectedSize || isNewArrival) && (
                <button
                  onClick={clearAllFilters}
                  className="font-mono text-[10px] uppercase tracking-wider text-accent hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
            <ul className="space-y-2 font-mono text-xs uppercase tracking-wider text-muted">
              <li>
                <button
                  onClick={() => updateParam('category', '')}
                  className={`hover:text-ink transition-colors ${!currentCategory ? 'text-ink font-bold' : ''}`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => updateParam('category', cat.slug)}
                    className={`hover:text-ink transition-colors text-left ${currentCategory === cat.slug ? 'text-ink font-bold' : ''}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink mb-4">
              Collections
            </h3>
            <ul className="space-y-2 font-mono text-xs uppercase tracking-wider text-muted">
              <li>
                <button
                  onClick={() => updateParam('collection', '')}
                  className={`hover:text-ink transition-colors ${!currentCollection ? 'text-ink font-bold' : ''}`}
                >
                  All Collections
                </button>
              </li>
              {collections.map((col) => (
                <li key={col.id}>
                  <button
                    onClick={() => updateParam('collection', col.slug)}
                    className={`hover:text-ink transition-colors text-left ${currentCollection === col.slug ? 'text-ink font-bold' : ''}`}
                  >
                    {col.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink mb-4">
              Sizes
            </h3>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Oversized'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateParam('size', selectedSize === sz ? '' : sz)}
                  className={`px-3 py-1.5 font-mono text-xs uppercase border transition-colors ${
                    selectedSize === sz
                      ? 'bg-ink text-canvas border-ink'
                      : 'bg-surface text-ink border-border hover:border-accent'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-surface h-96 border border-border" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border p-8">
              <p className="font-serif text-2xl font-normal text-ink mb-2">No Products Found</p>
              <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">Try adjusting your filters or search terms.</p>
              <button
                onClick={clearAllFilters}
                className="bg-accent text-canvas px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-ink transition-colors border border-accent"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {products.map((product) => {
                const isWish = isInWishlist(product.id);
                const primaryImg = product.images?.[0]?.url || '';
                const secondaryImg = product.images?.[1]?.url || primaryImg;

                return (
                  <div
                    key={product.id}
                    className="group relative bg-surface border border-border hover:border-accent transition-all duration-300"
                  >
                    {/* Signature Swing-Tag Detail */}
                    <div className="absolute top-0 right-3 z-20 flex flex-col items-center pointer-events-none">
                      <div className="w-[1px] h-3.5 bg-border group-hover:bg-accent transition-colors" />
                      <div className="swing-tag px-2.5 py-1 text-center group-hover:-translate-y-0.5 group-hover:-rotate-2 transition-transform duration-300">
                        <span className="font-mono text-[11px] font-semibold tracking-wider text-accent block">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                          <span className="font-mono text-[9px] line-through text-muted block -mt-0.5">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative h-72 sm:h-84 overflow-hidden bg-surface">
                      {/* Product Offers Trigger Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOfferModalProduct(product);
                        }}
                        className="absolute top-3 left-3 z-20 bg-accent text-canvas font-mono text-[9px] uppercase tracking-widest px-2 py-1 font-bold flex items-center space-x-1 hover:bg-ink transition-colors shadow-sm border border-accent"
                        title="View Special Deals for this Item"
                      >
                        <Zap className="w-3 h-3 text-canvas" />
                        <span>OFFERS</span>
                      </button>

                      <Link href={`/product/${product.slug}`}>
                        <img
                          src={primaryImg}
                          alt={product.name}
                          className="w-full h-full object-cover object-center transition-opacity duration-500 group-hover:opacity-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000';
                          }}
                        />
                        <img
                          src={secondaryImg}
                          alt={product.name}
                          className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000';
                          }}
                        />
                      </Link>

                      {/* Wishlist button */}
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
                        className={`absolute bottom-3 right-3 z-10 p-2 border transition-all ${
                          isWish
                            ? 'bg-ink text-canvas border-ink'
                            : 'bg-canvas/90 text-ink border-border hover:bg-ink hover:text-canvas'
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-current' : ''}`} />
                      </button>

                      {/* Hover Quick Action buttons */}
                      <div className="absolute bottom-3 left-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1.5 z-10">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="flex-1 bg-canvas/95 backdrop-blur-sm border border-border text-ink hover:bg-ink hover:text-canvas py-2 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="bg-ink text-canvas hover:bg-accent p-2 transition-colors border border-ink"
                          title="Add to Bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-surface border-t border-border">
                      <p className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-1">
                        {product.category?.name || 'SILHOUETTE'}
                      </p>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-serif text-xs font-normal text-ink group-hover:text-accent transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick View & Product Offers Modals */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
      <ProductOffersModal
        isOpen={Boolean(offerModalProduct)}
        onClose={() => setOfferModalProduct(null)}
        product={offerModalProduct}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono uppercase tracking-widest text-muted">Loading Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
