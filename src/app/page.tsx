'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  Heart,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  Flame,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import QuickViewModal from '@/components/QuickViewModal';
import CelebriteeLogo from '@/components/CelebriteeLogo';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

// Curated Celebrity Collaboration Icons
const ICON_EDITIONS = [
  {
    id: 'icon-01',
    celebrity: 'Ranveer Singh',
    title: 'The Maximalist Atelier',
    dropNumber: 'DROP 01 // 200 UNITS',
    status: 'ALMOST SOLD OUT',
    tag: 'Official Collaboration',
    description: '320 GSM French Terry streetwear engineered with raw edge hems and heavy distressed wash.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
    link: '/shop?category=oversized-tees',
    badge: '92% Claimed',
  },
  {
    id: 'icon-02',
    celebrity: 'Zendaya',
    title: 'Haute Silhouette Series',
    dropNumber: 'DROP 02 // 150 UNITS',
    status: 'VIP VAULT ACCESS',
    tag: 'Limited Capsule',
    description: 'Architectural boxy drop-shoulder cuts crafted with Peruvian long-staple cotton.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
    link: '/shop?category=oversized-tees',
    badge: 'Selling Fast',
  },
  {
    id: 'icon-03',
    celebrity: 'Diljit Dosanjh',
    title: 'Royal Heritage Boxy',
    dropNumber: 'DROP 03 // 250 UNITS',
    status: 'NEW RELEASE',
    tag: 'Signature Edition',
    description: 'Deep mineral-dyed acid wash tees with high-density metallic and neon puff prints.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200',
    link: '/shop?category=vintage-wash-tees',
    badge: 'Just Dropped',
  },
];

// Editorial Journal Articles
const JOURNAL_ARTICLES = [
  {
    id: 'j-01',
    category: 'BEHIND THE DROP',
    title: 'Deconstructing 320 GSM: How We Engineered The Perfect Heavyweight Drape',
    date: 'AUGUST 2026',
    author: 'CELEBRITEE ATELIER',
    readTime: '4 MIN READ',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    summary: 'A deep dive into French Terry knitting techniques, combed organic yarn, and why weight dictates modern silhouette posture.',
  },
  {
    id: 'j-02',
    category: 'ICON PROFILE',
    title: 'In The Green Room With Culture Definers: The Art of Uncompromising Streetwear',
    date: 'JULY 2026',
    author: 'EDITORIAL DESK',
    readTime: '6 MIN READ',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    summary: 'Exclusive polaroids, handwritten fit notes, and design sessions with our celebrity collaborators in Mumbai & London.',
  },
  {
    id: 'j-03',
    category: 'STYLING NOTES',
    title: 'Proportions & Posture: Pairing Oversized Streetwear with Tailored Outerwear',
    date: 'JUNE 2026',
    author: 'HAUTE STYLING',
    readTime: '3 MIN READ',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
    summary: 'How stylists balance structured high-gsm collars with drop shoulders for day-to-night luxury versatility.',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch('/api/products?limit=8')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="space-y-20 sm:space-y-28 pb-24 bg-white text-charcoal">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO (Crisp White Canvas, Natural Model Image & Pure Black Font) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden select-none bg-white border-b border-border">
        {/* Crystal Clear, Fully Visible Fashion Model Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=90&w=2000"
            alt="CELEBRITEE Iconic Collection"
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
          />
          {/* Subtle Neutral Radial Lightening for High-Contrast Black Typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-white/40 backdrop-blur-[1.5px]" />
        </div>

        {/* Hero Content Box with Crisp Black Typography */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-charcoal space-y-6 py-16 sm:py-24">
          {/* Master Headline in Black */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.08] text-charcoal drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            The Art of Being Iconic.
          </h1>

          {/* Subline in Charcoal */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-charcoal font-medium max-w-2xl mx-auto leading-relaxed tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            Limited edition couture and heavyweight streetwear created in exclusive collaboration with the icons who define culture.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-royal hover:bg-royal-dark text-white px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 rounded-md shadow-luxury flex items-center justify-center space-x-2 group"
            >
              <span>Explore the Vault</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop?newArrival=true"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-charcoal px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 border border-slate-300 rounded-md flex items-center justify-center space-x-2 shadow-md"
            >
              <span>View New Arrivals</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED "ICON EDITIONS" (Clean White Surface Cards with Black Typography) */}
      {/* ========================================================================= */}
      <section id="icons" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-charcoal">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-border pb-4">
          <div>
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
              <span>LIMITED VAULT RELEASES</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-charcoal mt-1">
              Featured Icon Editions
            </h2>
          </div>
          <p className="font-mono text-xs text-muted uppercase tracking-widest mt-2 md:mt-0 font-medium">
            Co-created with icons of music, cinema, and art
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ICON_EDITIONS.map((edition) => (
            <Link
              key={edition.id}
              href={edition.link}
              className="group relative bg-white border border-border overflow-hidden flex flex-col justify-between hover:border-royal/50 hover:shadow-card transition-all duration-300 rounded-2xl shadow-subtle text-charcoal"
            >
              {/* Image Container with Hover Zoom */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                <img
                  src={edition.image}
                  alt={edition.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 filter contrast-[1.05]"
                />
                
                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1.5">
                  <span className="bg-[#0F172A]/90 text-white text-[9px] font-mono font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-sm shadow-sm backdrop-blur-sm border border-slate-700">
                    {edition.dropNumber}
                  </span>
                  <span className="bg-royal text-white text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 self-start rounded-sm shadow-sm">
                    {edition.tag}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-pink text-white text-[9px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-sm">
                    {edition.badge}
                  </span>
                </div>

                {/* Bottom Gradient for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                
                <div className="absolute bottom-5 left-5 right-5 text-white z-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-300 font-bold">
                    {edition.celebrity}
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white mt-1">
                    {edition.title}
                  </h3>
                </div>
              </div>

              {/* Bottom Card Copy & Action in Black */}
              <div className="p-5 flex items-center justify-between bg-white border-t border-border text-charcoal">
                <p className="font-sans text-xs text-muted font-normal line-clamp-1 pr-3">
                  {edition.description}
                </p>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-charcoal group-hover:bg-royal group-hover:text-white group-hover:border-royal transition-colors flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CURATED PRODUCT GRID (Clean White Cards with Black Typography) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-charcoal">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-border pb-4">
          <div>
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
              <span>CURATED DROPS</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-charcoal mt-1">
              Iconic Streetwear Garments
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-[0.2em] text-charcoal hover:text-royal transition-colors inline-flex items-center space-x-1 font-bold"
          >
            <span>Explore All Drops</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 text-royal" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 font-mono text-xs uppercase tracking-widest text-muted">
            Loading Curated Vault...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-charcoal">
            {products.map((product, idx) => {
              const isWish = isInWishlist(product.id);
              const primaryImg =
                product.images?.[0]?.url ||
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000';

              const stockRemaining = 12 + ((idx * 7) % 28);

              return (
                <div
                  key={product.id}
                  className="group relative bg-white border border-border hover:border-royal/50 hover:shadow-card transition-all duration-300 flex flex-col justify-between rounded-2xl overflow-hidden shadow-subtle text-charcoal"
                >
                  {/* Top Bar Details */}
                  <div className="p-2.5 bg-surface-tint border-b border-border flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-charcoal">
                    <span className="font-bold">EDITION 0{idx + 1}</span>
                    <span className="text-muted font-medium flex items-center space-x-1">
                      <Flame className="w-2.5 h-2.5 inline text-pink" />
                      <span>{stockRemaining} Left</span>
                    </span>
                  </div>

                  {/* Product Image Stage */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                    <Link href={`/product/${product.slug}`} className="block w-full h-full">
                      <img
                        src={primaryImg}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000';
                        }}
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

                    {/* Hover Quick Actions */}
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

                  {/* Card Bottom Meta in Black */}
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
                      <span className="font-mono text-xs font-bold tracking-wider text-royal">
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
      </section>

      {/* ========================================================================= */}
      {/* 4. EDITORIAL MANIFESTO (Clean White Canvas with Black Typography) */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 border-y border-border overflow-hidden text-charcoal shadow-subtle">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          {/* Left Column: Storytelling Manifesto in Black */}
          <div className="lg:col-span-6 p-8 sm:p-14 lg:p-20 flex flex-col justify-between space-y-8 text-charcoal">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-royal font-bold">
                THE CELEBRITEE MANIFESTO
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-charcoal leading-tight">
                Not Merch. <br />
                <span className="text-pink italic font-serif">Wearable Artifacts.</span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-charcoal/80 font-normal leading-relaxed pt-2">
                Every CELEBRITEE piece begins in closed-door design ateliers with culture-shaping icons. From custom dye formulation to custom collar tension and weight calibration, nothing is generic. Once a drop sells out, the moulds are retired forever.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6 text-charcoal">
              <Link
                href="/shop"
                className="bg-royal hover:bg-royal-dark text-white px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 rounded-md shadow-luxury inline-flex items-center space-x-2"
              >
                <span>Enter The Archive</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
              <div className="font-mono text-[11px] text-muted uppercase tracking-widest font-semibold">
                VERIFIED COLLABORATION CONTRACTS
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Campaign Image */}
          <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-full bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1200"
              alt="Editorial Campaign"
              className="w-full h-full object-cover object-center filter contrast-105"
            />
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md border border-border p-4 max-w-xs text-charcoal text-left hidden sm:block rounded-xl shadow-lg">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
                CAMPAIGN NO. 04
              </p>
              <p className="font-serif text-xs font-normal text-charcoal">
                "We don’t chase trends. We collaborate with those who create them."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE CELEBRITEE STANDARD */}
      {/* ========================================================================= */}
      <section id="standards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-charcoal">
        <div className="text-center max-w-2xl mx-auto mb-14 text-charcoal">
          <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center justify-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
            <span>THE MAISON BENCHMARK</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-charcoal mt-1">
            The CELEBRITEE Standard
          </h2>
          <p className="font-sans text-xs sm:text-sm text-muted font-normal mt-2">
            Engineered to bridge haute couture precision with luxury heavyweight streetwear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-charcoal">
          <div className="bg-white border border-border p-6 sm:p-8 space-y-4 hover:border-royal/50 hover:shadow-card transition-all rounded-2xl shadow-subtle">
            <div className="w-9 h-9 rounded-full bg-surface-tint text-royal flex items-center justify-center font-mono text-xs font-bold border border-border">
              01
            </div>
            <h3 className="font-serif text-lg font-normal text-charcoal">
              Numbered Authenticity
            </h3>
            <p className="font-sans text-xs text-muted font-normal leading-relaxed">
              Every garment includes a tamper-proof certificate and encrypted NFC label linking directly to the collaborator’s authentication ledger.
            </p>
          </div>

          <div className="bg-white border border-border p-6 sm:p-8 space-y-4 hover:border-royal/50 hover:shadow-card transition-all rounded-2xl shadow-subtle">
            <div className="w-9 h-9 rounded-full bg-surface-tint text-royal flex items-center justify-center font-mono text-xs font-bold border border-border">
              02
            </div>
            <h3 className="font-serif text-lg font-normal text-charcoal">
              320+ GSM Master Knit
            </h3>
            <p className="font-sans text-xs text-muted font-normal leading-relaxed">
              Crafted from 100% long-staple combed cotton French Terry with structured drop-shoulders and 1.2-inch shape-retaining ribbed collars.
            </p>
          </div>

          <div className="bg-white border border-border p-6 sm:p-8 space-y-4 hover:border-royal/50 hover:shadow-card transition-all rounded-2xl shadow-subtle">
            <div className="w-9 h-9 rounded-full bg-surface-tint text-royal flex items-center justify-center font-mono text-xs font-bold border border-border">
              03
            </div>
            <h3 className="font-serif text-lg font-normal text-charcoal">
              Exclusive VIP Drops
            </h3>
            <p className="font-sans text-xs text-muted font-normal leading-relaxed">
              Strictly capped unit counts per release. No endless reprints. Clients gain priority access to upcoming celebrity drops.
            </p>
          </div>

          <div className="bg-white border border-border p-6 sm:p-8 space-y-4 hover:border-royal/50 hover:shadow-card transition-all rounded-2xl shadow-subtle">
            <div className="w-9 h-9 rounded-full bg-surface-tint text-royal flex items-center justify-center font-mono text-xs font-bold border border-border">
              04
            </div>
            <h3 className="font-serif text-lg font-normal text-charcoal">
              White-Glove Delivery
            </h3>
            <p className="font-sans text-xs text-muted font-normal leading-relaxed">
              Shipped in signature presentation boxes with complimentary insured express courier to your doorstep across India.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. THE EDITORIAL JOURNAL */}
      {/* ========================================================================= */}
      <section id="journal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-charcoal">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-border pb-4">
          <div>
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
              <span>EDITORIAL GAZETTE</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-charcoal mt-1">
              The CELEBRITEE Journal
            </h2>
          </div>
          <p className="font-mono text-xs text-muted uppercase tracking-widest mt-2 md:mt-0 font-medium">
            Stories, backstage ateliers & styling notes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-charcoal">
          {JOURNAL_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group bg-white border border-border hover:border-royal/50 hover:shadow-card transition-all duration-300 flex flex-col justify-between rounded-2xl overflow-hidden shadow-subtle text-charcoal"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0F172A] text-white text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-sm">
                  {article.category}
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between text-charcoal">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase tracking-wider mb-2">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg font-normal text-charcoal group-hover:text-royal transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="font-sans text-xs text-muted font-normal leading-relaxed mt-2 line-clamp-2">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-charcoal font-bold">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-royal" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. QUICK VIEW MODAL */}
      {/* ========================================================================= */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
