'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Filter, SlidersHorizontal, Eye, Heart, ShoppingBag, X, ChevronDown, Check } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="border-b border-luxury-border pb-8 mb-8 text-center sm:text-left">
        <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
          LUXEWEAR CATALOG
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-black mt-1">
          {currentCategory ? `${currentCategory.replace('-', ' ')} Collection` : 'All Couture & Ready-To-Wear'}
        </h1>
        {currentQuery && (
          <p className="text-xs uppercase tracking-widest text-luxury-black font-semibold mt-2">
            Showing search results for "{currentQuery}"
          </p>
        )}
      </div>

      {/* Filter Controls & Sort Bar */}
      <div className="flex items-center justify-between border-b border-luxury-border pb-4 mb-8">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-luxury-black border border-luxury-border px-4 py-2 bg-white"
        >
          <Filter className="w-4 h-4 text-luxury-gold" />
          <span>Filters</span>
        </button>

        <div className="hidden lg:flex items-center space-x-2 text-xs text-luxury-black uppercase tracking-wider font-semibold">
          <span>Total {products.length} Products Found</span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-3">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-medium hidden sm:inline">
            Sort By:
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-white border border-luxury-border text-xs uppercase tracking-wider text-luxury-black px-3 py-2 focus:outline-none focus:border-luxury-gold font-medium"
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
              <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-luxury-black">
                Categories
              </h3>
              {(currentCategory || currentCollection || selectedSize || isNewArrival) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] uppercase tracking-wider text-luxury-gold font-bold hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
            <ul className="space-y-2 text-xs uppercase tracking-wider font-medium text-gray-700">
              <li>
                <button
                  onClick={() => updateParam('category', '')}
                  className={`hover:text-luxury-gold ${!currentCategory ? 'text-luxury-gold font-bold' : ''}`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => updateParam('category', cat.slug)}
                    className={`hover:text-luxury-gold ${currentCategory === cat.slug ? 'text-luxury-gold font-bold' : ''}`}
                  >
                    {cat.name} ({cat._count?.products || 0})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections Filter */}
          <div className="border-t border-luxury-border pt-6">
            <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-luxury-black mb-4">
              Editorial Collections
            </h3>
            <ul className="space-y-2 text-xs uppercase tracking-wider font-medium text-gray-700">
              {collections.map((col) => (
                <li key={col.id}>
                  <button
                    onClick={() => updateParam('collection', currentCollection === col.slug ? '' : col.slug)}
                    className={`hover:text-luxury-gold ${currentCollection === col.slug ? 'text-luxury-gold font-bold' : ''}`}
                  >
                    {col.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Size Filter */}
          <div className="border-t border-luxury-border pt-6">
            <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-luxury-black mb-4">
              Filter By Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateParam('size', selectedSize === sz ? '' : sz)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border ${
                    selectedSize === sz
                      ? 'bg-luxury-black text-luxury-cream border-luxury-black'
                      : 'bg-white text-luxury-black border-luxury-border hover:border-luxury-gold'
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
                <div key={i} className="animate-pulse bg-luxury-cream h-96 border border-luxury-border" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-luxury-border p-8">
              <p className="font-serif text-2xl font-bold text-luxury-black mb-2">No Couture Found</p>
              <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Try adjusting your filters or search terms.</p>
              <button
                onClick={clearAllFilters}
                className="bg-luxury-black text-luxury-cream px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-luxury-gold hover:text-black transition-colors"
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
                  <div key={product.id} className="group relative bg-white border border-luxury-border/60 hover:border-luxury-gold transition-all duration-300">
                    <div className="relative h-72 sm:h-84 overflow-hidden bg-luxury-cream">
                      <Link href={`/product/${product.slug}`}>
                        <img
                          src={primaryImg}
                          alt={product.name}
                          className="w-full h-full object-cover object-center transition-opacity duration-700 group-hover:opacity-0"
                        />
                        <img
                          src={secondaryImg}
                          alt={product.name}
                          className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
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
                        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
                          isWish ? 'bg-red-50 text-red-600' : 'bg-white/80 text-luxury-black hover:bg-luxury-gold hover:text-black'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
                      </button>

                      {/* Quick Action buttons */}
                      <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2 z-10">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="flex-1 bg-white/90 backdrop-blur-sm text-luxury-black hover:bg-luxury-black hover:text-white py-2 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick View</span>
                        </button>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="bg-luxury-black text-luxury-cream hover:bg-luxury-gold hover:text-black p-2 transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-[10px] font-semibold text-luxury-gold uppercase tracking-[0.2em] mb-1">
                        {product.category?.name || 'COUTURE'}
                      </p>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-serif text-xs font-bold text-luxury-black group-hover:text-luxury-gold transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs font-bold text-luxury-black">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                          <span className="text-[11px] line-through text-gray-400">
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
    <Suspense fallback={<div className="p-20 text-center uppercase tracking-widest text-luxury-gold">Loading Couture Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
