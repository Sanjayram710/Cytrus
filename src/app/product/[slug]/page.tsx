'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  Heart,
  ShoppingBag,
  Maximize2,
  X,
  Check,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
  Award,
  Lock,
  Flame,
  ArrowRight,
  Package,
} from 'lucide-react';
import SizeGuideModal from '@/components/SizeGuideModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('Obsidian Black');
  const [quantity, setQuantity] = useState(1);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // Delivery Pincode Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Review state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.product) {
          setData(resData);
          if (resData.product.variants && resData.product.variants.length > 0) {
            setSelectedSize(resData.product.variants[0].size || 'L');
            setSelectedColor(resData.product.variants[0].color || 'Obsidian Black');
          }
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="p-24 text-center font-mono uppercase tracking-[0.25em] text-royal text-xs">
        Loading Iconic Drop Specifications...
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div className="max-w-md mx-auto my-24 text-center p-8 bg-ivory border border-border">
        <h2 className="font-serif text-2xl font-normal text-charcoal mb-2">Edition Not Found</h2>
        <p className="text-xs text-muted mb-6 uppercase tracking-wider font-mono">
          The requested collaboration drop does not exist or has been archived.
        </p>
        <Link
          href="/shop"
          className="bg-royal text-ivory px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-pink transition-colors inline-block"
        >
          Return to Vault
        </Link>
      </div>
    );
  }

  const { product, relatedProducts } = data;
  const isWish = isInWishlist(product.id);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000' }];
  const currentImage = images[selectedImageIndex]?.url || images[0].url;

  const sizes = Array.from(
    new Set(product.variants?.map((v: any) => v.size) || ['S', 'M', 'L', 'XL', 'XXL'])
  );
  const colors = Array.from(
    new Set(
      product.variants?.map((v: any) => v.color) || ['Obsidian Black', 'Washed Espresso', 'Mineral Slate']
    )
  );

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: currentImage,
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
    router.push('/checkout');
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      setPincodeStatus('Please enter a valid 6-digit PIN code.');
      return;
    }
    setPincodeStatus('✓ Verified: Express White-Glove Delivery available (2-3 business days).');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        setReviewModalOpen(false);
        setReviewComment('');
        setReviewTitle('');
        const refresh = await fetch(`/api/products/${params.slug}`).then((r) => r.json());
        if (refresh.product) setData(refresh);
      }
    } catch (err) {
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-ivory">
      {/* Breadcrumb */}
      <nav className="font-mono text-xs uppercase tracking-widest text-muted mb-8 space-x-2">
        <Link href="/" className="hover:text-royal transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-royal transition-colors">Drops</Link>
        <span>/</span>
        <span className="text-charcoal font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        {/* ========================================================================= */}
        {/* Gallery Column (7 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto no-scrollbar">
            {images.map((img: any, idx: number) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-24 flex-shrink-0 border overflow-hidden bg-softgrey transition-all ${
                  selectedImageIndex === idx ? 'border-royal ring-1 ring-royal' : 'border-border opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover object-center" />
              </button>
            ))}
          </div>

          {/* Main Image Stage */}
          <div className="relative flex-1 bg-softgrey border border-border overflow-hidden group">
            {/* Numbered Collaboration Drop Tag */}
            <div className="absolute top-4 left-4 z-20 flex flex-col space-y-1">
              <span className="bg-charcoal text-ivory font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1">
                LIMITED EDITION // DROP 04
              </span>
              <span className="bg-royal text-ivory font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 self-start">
                OFFICIAL COLLABORATION
              </span>
            </div>

            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-[540px] sm:h-[680px] object-cover object-center transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setFullscreenImage(currentImage)}
            />

            {/* Expand Fullscreen Button */}
            <button
              onClick={() => setFullscreenImage(currentImage)}
              className="absolute top-4 right-4 p-2.5 bg-ivory/90 backdrop-blur-sm text-charcoal hover:bg-charcoal hover:text-ivory border border-border transition-colors z-20"
              title="Expand Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Purchase & Information Column (5 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/80">
              <span className="font-mono text-xs uppercase font-semibold tracking-[0.25em] text-royal">
                {product.category?.name || 'HEAVYWEIGHT STREETWEAR'}
              </span>
              <span className="font-mono text-[10px] uppercase text-muted tracking-wider">
                SKU: {product.sku || 'CLB-2026-04'}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-charcoal mt-3 mb-2">
              {product.name}
            </h1>

            {/* Rating Stars & Drop Stats */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-border'}`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs font-semibold text-charcoal">{product.rating || 5.0}</span>
              <span className="font-mono text-xs text-muted">({product.reviewCount || 14} client reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline space-x-4 mb-5 pb-5 border-b border-border">
              <span className="font-mono text-3xl font-semibold text-charcoal">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="font-mono text-base line-through text-muted">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              <span className="bg-royal-light text-royal font-mono text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest border border-royal/20">
                VIP ALLOCATION
              </span>
            </div>

            {/* Limited Stock Indicator */}
            <div className="mb-6 p-3 bg-softgrey border border-border flex items-center justify-between font-mono text-xs">
              <span className="text-charcoal font-medium uppercase tracking-wider flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-pink" />
                <span>Strictly Capped Run</span>
              </span>
              <span className="text-pink font-bold uppercase tracking-wider">
                Only 14 of 250 Units Left
              </span>
            </div>

            {/* Garment Editorial Description */}
            <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6 font-light">
              {product.description ||
                'Tailored from 320 GSM organic combed French Terry cotton. Engineered with dropped shoulders, reinforced shape-retaining ribbed crewneck collar, and subtle tonal embroidery.'}
            </p>

            {/* Color Swatches */}
            <div className="mb-6">
              <label className="block font-mono text-xs uppercase font-medium tracking-wider text-charcoal mb-2">
                Color Edition: <span className="text-muted font-normal">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((clr: any) => (
                  <button
                    key={clr}
                    onClick={() => setSelectedColor(clr)}
                    className={`px-4 py-2 font-mono text-xs uppercase border transition-all ${
                      selectedColor === clr
                        ? 'bg-charcoal text-ivory border-charcoal font-semibold'
                        : 'bg-softgrey text-charcoal border-border hover:border-royal'
                    }`}
                  >
                    {clr}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector + Size Guide Modal Trigger */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-xs uppercase font-medium tracking-wider text-charcoal">
                  Select Size: <span className="text-muted font-normal">{selectedSize} (Relaxed Boxy Fit)</span>
                </label>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="font-mono text-xs uppercase tracking-wider text-royal hover:underline flex items-center"
                >
                  <Ruler className="w-3.5 h-3.5 mr-1" /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {sizes.map((sz: any) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-12 font-mono text-xs uppercase border flex items-center justify-center transition-all ${
                      selectedSize === sz
                        ? 'bg-charcoal text-ivory border-charcoal font-bold shadow-sm'
                        : 'bg-softgrey text-charcoal border-border hover:border-royal'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block font-mono text-xs uppercase font-medium tracking-wider text-charcoal mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-border bg-softgrey">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-charcoal hover:bg-ivory"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-6 font-mono text-sm font-semibold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-charcoal hover:bg-ivory"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs: SIGNATURE PINK "ADD TO BAG" */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-pink hover:bg-pink-hover text-ivory py-4 font-mono text-xs uppercase tracking-[0.22em] font-bold transition-all duration-200 flex items-center justify-center space-x-2 border border-pink shadow-luxury"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-ivory" />
                    <span>ADDED TO CLIENT BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  toggleWishlist({
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    image: currentImage,
                    price: product.price,
                  })
                }
                className={`p-4 border transition-all ${
                  isWish
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-ivory text-charcoal border-border hover:bg-royal hover:text-ivory hover:border-royal'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-royal hover:bg-royal-dark text-ivory py-3.5 font-mono text-xs uppercase tracking-[0.22em] font-semibold transition-all border border-royal flex items-center justify-center space-x-2"
            >
              <span>Instant VIP Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="pt-6 border-t border-border space-y-3">
            <label className="block font-mono text-xs uppercase font-medium tracking-wider text-charcoal">
              White-Glove Delivery Estimator
            </label>
            <form onSubmit={checkPincode} className="flex max-w-sm">
              <input
                type="text"
                placeholder="ENTER 6-DIGIT PINCODE"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 bg-softgrey border border-border px-3.5 py-2.5 font-mono text-xs uppercase text-charcoal focus:outline-none focus:border-royal placeholder:text-muted"
              />
              <button
                type="submit"
                className="bg-charcoal hover:bg-royal text-ivory px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="font-mono text-[11px] text-royal tracking-wide">
                {pincodeStatus}
              </p>
            )}
          </div>

          {/* Premium Packaging & Authenticity Note */}
          <div className="p-4 bg-softgrey border border-border space-y-2 font-mono text-[11px] text-muted">
            <div className="flex items-center space-x-2 text-charcoal font-semibold">
              <Package className="w-4 h-4 text-gold" />
              <span className="uppercase tracking-wider">Signature Velvet-Lined Packaging</span>
            </div>
            <p className="leading-relaxed">
              Every drop is hand-packed in a rigid matte-black CELEBRITEE collector box with magnetic closure and numbered Certificate of Collaboration.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RECOMMENDATIONS: "Selected for You" Carousel */}
      {/* ========================================================================= */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-royal">
                CURATED COMPANIONS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-charcoal mt-1">
                Selected for You
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-mono text-xs uppercase tracking-widest text-charcoal hover:text-royal transition-colors font-semibold"
            >
              View Full Vault →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel: any, idx: number) => (
              <Link
                key={rel.id}
                href={`/product/${rel.slug}`}
                className="group bg-ivory border border-border hover:border-royal transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-softgrey">
                  <img
                    src={rel.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000'}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-charcoal text-ivory text-[8px] font-mono tracking-widest uppercase px-2 py-0.5">
                    DROP 0{idx + 1}
                  </div>
                </div>
                <div className="p-3.5 bg-ivory border-t border-border">
                  <h3 className="font-serif text-xs font-normal text-charcoal group-hover:text-royal transition-colors line-clamp-1">
                    {rel.name}
                  </h3>
                  <p className="font-mono text-xs font-semibold text-charcoal mt-1">
                    {formatPrice(rel.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 text-ivory hover:text-pink transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen View"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}

      {/* Global Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
