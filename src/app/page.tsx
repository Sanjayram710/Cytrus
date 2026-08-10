'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, ShoppingBag, ArrowRight, Sparkles, Star } from 'lucide-react';
import HeroSlider, { HeroSlideData } from '@/components/HeroSlider';
import QuickViewModal from '@/components/QuickViewModal';
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

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    // Fetch Hero Slides
    fetch('/api/hero-slides')
      .then((res) => res.json())
      .then((data) => {
        if (data.slides) setSlides(data.slides);
      })
      .catch(() => {});

    // Fetch New Arrivals
    fetch('/api/products?newArrival=true&limit=8')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setNewArrivals(data.products);
      })
      .catch(() => {});

    // Fetch Featured Products
    fetch('/api/products?featured=true&limit=4')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setFeaturedProducts(data.products);
      })
      .catch(() => {});

    // Fetch Categories & Collections
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
    <div className="space-y-24 pb-20">
      {/* 1. Exactly 5 Hero Showcase Slides */}
      <HeroSlider initialSlides={slides} />

      {/* 2. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-luxury-border pb-4">
          <div>
            <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
              FALL / WINTER 2026
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-luxury-black mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?newArrival=true"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-[0.2em] text-luxury-black hover:text-luxury-gold transition-colors inline-flex items-center space-x-1"
          >
            <span>Explore All New Arrivals</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => {
            const isWish = isInWishlist(product.id);
            const primaryImg = product.images?.[0]?.url || '';
            const secondaryImg = product.images?.[1]?.url || primaryImg;

            return (
              <div key={product.id} className="group relative bg-white border border-luxury-border/60 hover:border-luxury-gold transition-all duration-300">
                {/* Image & Hover Action Overlay */}
                <div className="relative h-80 sm:h-96 overflow-hidden bg-luxury-cream">
                  <Link href={`/product/${product.slug}`}>
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-opacity duration-700 group-hover:opacity-0"
                    />
                    <img
                      src={secondaryImg}
                      alt={`${product.name} hover view`}
                      className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
                    <span className="bg-luxury-black text-luxury-cream text-[10px] uppercase font-bold tracking-widest px-2.5 py-1">
                      NEW
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="bg-luxury-gold text-luxury-black text-[10px] uppercase font-bold tracking-widest px-2 py-0.5">
                        -{product.discountPercentage}%
                      </span>
                    )}
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
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
                      isWish ? 'bg-red-50 text-red-600' : 'bg-white/80 text-luxury-black hover:bg-luxury-gold hover:text-black'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
                  </button>

                  {/* Hover Quick Actions */}
                  <div className="absolute bottom-4 inset-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2 z-10">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="flex-1 bg-white/90 backdrop-blur-sm text-luxury-black hover:bg-luxury-black hover:text-white py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-luxury-black text-luxury-cream hover:bg-luxury-gold hover:text-black p-2.5 transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4">
                  <p className="text-[10px] font-semibold text-luxury-gold uppercase tracking-[0.2em] mb-1">
                    {product.category?.name || 'COUTURE'}
                  </p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-sm font-bold text-luxury-black group-hover:text-luxury-gold transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm font-bold text-luxury-black">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-xs line-through text-gray-400">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Editorial Collections Section */}
      <section className="bg-luxury-charcoal text-luxury-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-luxury-gold text-xs font-semibold uppercase tracking-[0.35em]">
              CURATED CAPSULES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mt-2 mb-4">
              Editorial Collections
            </h2>
            <p className="text-xs sm:text-sm font-light text-luxury-cream/70 leading-relaxed">
              Explore themed haute couture edits crafted for evening galas, high-sun retreats, and heritage celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collection/${col.slug}`}
                className="group relative h-[420px] overflow-hidden border border-luxury-cream/10"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
                  <h3 className="font-serif text-2xl font-bold text-luxury-cream group-hover:text-luxury-gold transition-colors mb-2">
                    {col.name}
                  </h3>
                  <p className="text-xs text-luxury-cream/70 line-clamp-2 mb-4">
                    {col.description}
                  </p>
                  <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-luxury-gold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>EXPLORE EDIT</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
          <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
            BY CATEGORY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black mt-1">
            Shop By Silhouette
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative h-64 overflow-hidden border border-luxury-border shadow-subtle"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center filter brightness-[0.8] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-luxury-black/30 group-hover:bg-luxury-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="font-serif text-xl font-bold uppercase tracking-widest text-luxury-cream group-hover:text-luxury-gold transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-luxury-cream/70 mt-1">
                  {cat._count?.products || 10}+ Styles
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-luxury-black text-luxury-cream overflow-hidden border border-luxury-gold/40 shadow-luxury py-16 px-8 sm:px-16 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl text-center md:text-left mb-8 md:mb-0 z-10">
            <span className="text-luxury-gold text-xs uppercase font-bold tracking-[0.35em] block mb-2">
              EXCLUSIVE COUTURE OFFER
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold uppercase leading-tight mb-4">
              Enjoy 10% Off Your First Trunk Show Order
            </h2>
            <p className="text-xs sm:text-sm font-light text-luxury-cream/80 leading-relaxed mb-6">
              Use promotional voucher code <span className="text-luxury-gold font-bold">LUXE10</span> at checkout to claim your introductory privilege.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-luxury-gold text-luxury-black font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-white transition-colors"
            >
              CLAIM YOUR OFFER NOW
            </Link>
          </div>

          <div className="relative w-64 h-64 sm:w-80 sm:h-80 z-10">
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800"
              alt="Promotional Fashion"
              className="w-full h-full object-cover border-2 border-luxury-gold rounded-sm filter brightness-90 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* 6. Brand Story Section */}
      <section className="bg-luxury-beige/40 py-20 border-y border-luxury-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[480px]">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000"
                alt="CYTRUS Atelier"
                className="w-full h-full object-cover shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-luxury-black text-luxury-cream p-6 hidden sm:block border border-luxury-gold">
                <p className="font-serif text-2xl font-bold text-luxury-gold">EST. 2026</p>
                <p className="text-[10px] uppercase tracking-widest text-luxury-cream/80">HAUTE COUTURE ATELIER</p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-xs uppercase font-semibold tracking-[0.35em] text-luxury-gold">
                THE CYTRUS MAISON
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-luxury-black">
                Where Timeless Indian Heritage Meets Modern Paris Runway
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Founded with a devotion to rare textiles and architectural tailoring, CYTRUS brings together master Banarasi weavers, hand Chikankari artisans, and French drape patternmakers under one roof.
              </p>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Every dress, saree, and tailored coat is crafted with mulberry silk, hand-strung crystals, and gold zari wire designed to endure for generations.
              </p>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-block border-b-2 border-luxury-black text-luxury-black font-serif text-sm font-bold uppercase tracking-widest hover:text-luxury-gold hover:border-luxury-gold transition-colors pb-1"
                >
                  Read Our Full Maison Story →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
