'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, ShoppingBag, ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import HeroSlider, { HeroSlideData } from '@/components/HeroSlider';
import QuickViewModal from '@/components/QuickViewModal';
import ProductOffersModal from '@/components/ProductOffersModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

export default function HomePage() {
  const [slides, setSlides] = useState<HeroSlideData[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [offerModalProduct, setOfferModalProduct] = useState<any | null>(null);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch('/api/hero-slides')
      .then((res) => res.json())
      .then((data) => {
        if (data.slides) setSlides(data.slides);
      })
      .catch(() => {});

    fetch('/api/products?newArrival=true&limit=8')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setNewArrivals(data.products);
      })
      .catch(() => {});

    fetch('/api/products?featured=true&limit=4')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setFeaturedProducts(data.products);
      })
      .catch(() => {});

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories.slice(0, 8));
      })
      .catch(() => {});

    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        if (data.collections) setCollections(data.collections.slice(0, 4));
      })
      .catch(() => {});
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
    <div className="space-y-24 pb-20 bg-canvas">
      {/* 1. Exactly 5 Hero Showcase Slides */}
      <HeroSlider initialSlides={slides} />

      {/* 2. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-border pb-4">
          <div>
            <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
              FALL / WINTER 2026 DROPS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink mt-1">
              New T-Shirt Arrivals
            </h2>
          </div>
          <Link
            href="/shop?newArrival=true"
            className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-ink transition-colors inline-flex items-center space-x-1"
          >
            <span>Explore All T-Shirts</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => {
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

                <div className="relative h-80 sm:h-96 overflow-hidden bg-surface">
                  <Link href={`/product/${product.slug}`}>
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-opacity duration-500 group-hover:opacity-0"
                    />
                    <img
                      src={secondaryImg}
                      alt={`${product.name} hover view`}
                      className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </Link>

                  {/* Minimal Status Badge & Offers Trigger */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
                    <span className="bg-ink text-canvas font-mono text-[9px] uppercase tracking-widest px-2 py-0.5">
                      DROP
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOfferModalProduct(product);
                      }}
                      className="bg-accent text-canvas font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 font-bold flex items-center space-x-0.5 hover:bg-ink transition-colors border border-accent"
                      title="View Product Offers"
                    >
                      <Zap className="w-2.5 h-2.5 text-canvas" />
                      <span>OFFERS</span>
                    </button>
                  </div>

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
                    className={`absolute bottom-3 right-3 z-10 p-2 border transition-all ${
                      isWish
                        ? 'bg-ink text-canvas border-ink'
                        : 'bg-canvas/90 text-ink border-border hover:bg-ink hover:text-canvas'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-current' : ''}`} />
                  </button>

                  {/* Hover Quick Action Drawer */}
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
                    {product.category?.name || 'HEAVYWEIGHT TEE'}
                  </p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-sm font-normal text-ink group-hover:text-accent transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Editorial Collections Section */}
      <section className="bg-ink text-canvas py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-border text-xs uppercase tracking-[0.3em]">
              STREETWEAR EDITS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mt-2 mb-4">
              Featured Collections
            </h2>
            <p className="text-xs sm:text-sm font-normal text-canvas/70 leading-relaxed">
              Explore mineral-washed vintage fades, 240 GSM graphic back prints, and raw Peruvian Pima cotton essentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collection/${col.slug}`}
                className="group relative h-[420px] overflow-hidden border border-border/40 bg-surface"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.75] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />

                <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
                  <h3 className="font-serif text-2xl font-normal text-canvas group-hover:text-border transition-colors mb-2">
                    {col.name}
                  </h3>
                  <p className="text-xs text-canvas/70 line-clamp-2 mb-4 font-light">
                    {col.description}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-border flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>DISCOVER COLLECTION</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Category Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
            BY CUT & GRAMMAGE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1">
            Shop By Silhouette
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative h-64 overflow-hidden border border-border bg-surface"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center filter brightness-[0.75] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="font-serif text-xl font-normal uppercase tracking-widest text-canvas group-hover:text-border transition-colors">
                  {cat.name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-canvas/80 mt-1">
                  {cat._count?.products || 5}+ Styles
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Promotional Editorial Drop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-surface text-ink overflow-hidden border border-border p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl text-center md:text-left mb-8 md:mb-0 z-10">
            <span className="font-mono text-muted text-xs uppercase font-medium tracking-[0.25em] block mb-2">
              INTRODUCTORY DROP PROMO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal uppercase leading-tight mb-4 text-ink">
              Get ₹500 Off Your First Heavyweight Tee
            </h2>
            <p className="text-xs sm:text-sm font-normal text-muted leading-relaxed mb-6">
              Apply voucher code <span className="font-mono font-bold text-accent">TEE500</span> at checkout on orders over ₹1,500.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-accent text-canvas font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-ink transition-colors border border-accent"
            >
              SHOP T-SHIRT DROPS NOW
            </Link>
          </div>

          <div className="relative w-64 h-64 sm:w-72 sm:h-72 z-10">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800"
              alt="Heavyweight Tee Promo"
              className="w-full h-full object-cover border border-border filter contrast-[1.05]"
            />
          </div>
        </div>
      </section>

      {/* 6. Brand Atelier Section */}
      <section className="bg-surface/50 py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[440px] border border-border bg-surface">
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000"
                alt="CYTRUS T-Shirt Studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-ink text-canvas p-5 hidden sm:block border border-border">
                <p className="font-mono text-xl font-bold text-canvas">240 GSM</p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted">FRENCH TERRY COTTON</p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
                THE CYTRUS ATELIER
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
                Architectural Oversized Fits & Non-Deforming Heavy Ribbed Collars
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Most t-shirts lose their structure after three washes. At CYTRUS, every garment is constructed with high-density 240 GSM French Terry organic cotton and double-needle reinforced necklines.
              </p>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                From hand-dyed mineral acid washes to high-density puff prints, our t-shirts are crafted for the modern luxury streetwear aesthetic.
              </p>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-block border-b border-ink text-ink font-mono text-xs uppercase tracking-widest hover:text-accent hover:border-accent transition-colors pb-1"
                >
                  Explore All T-Shirt Silhouettes →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Quick View & Product Offers Modals */}
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
