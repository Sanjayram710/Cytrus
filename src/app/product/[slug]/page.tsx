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
import ProductOffersModal from '@/components/ProductOffersModal';
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
  const [offersOpen, setOffersOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // Delivery Pincode Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

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
      <div className="p-24 text-center font-mono uppercase tracking-[0.25em] text-muted text-xs">
        Loading Iconic Drop Specifications...
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div className="max-w-md mx-auto my-24 text-center p-8 bg-white border border-border rounded-2xl shadow-subtle text-charcoal">
        <h2 className="font-serif text-2xl font-normal text-charcoal mb-2">Edition Not Found</h2>
        <p className="text-xs text-muted mb-6 uppercase tracking-wider font-mono">
          The requested collaboration drop does not exist or has been archived.
        </p>
        <Link
          href="/shop"
          className="bg-royal hover:bg-royal-dark text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors inline-block rounded-md shadow-sm"
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-charcoal">
      {/* Breadcrumb */}
      <nav className="font-mono text-xs uppercase tracking-widest text-muted mb-8 space-x-2">
        <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-charcoal transition-colors">Drops</Link>
        <span>/</span>
        <span className="text-charcoal font-bold">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 text-charcoal">
        {/* ========================================================================= */}
        {/* Gallery Column (7 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 text-charcoal">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto no-scrollbar">
            {images.map((img: any, idx: number) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-24 flex-shrink-0 border overflow-hidden bg-slate-100 transition-all rounded-lg ${
                  selectedImageIndex === idx ? 'border-royal ring-2 ring-royal/30' : 'border-border opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover object-center" />
              </button>
            ))}
          </div>

          {/* Main Image Stage */}
          <div className="relative flex-1 bg-slate-100 border border-border overflow-hidden group rounded-2xl shadow-subtle">
            {/* Numbered Collaboration Drop Tag */}
            <div className="absolute top-4 left-4 z-20 flex flex-col space-y-1">
              <span className="bg-[#0F172A]/90 text-white font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-md backdrop-blur-sm border border-slate-700 shadow-sm">
                LIMITED EDITION // DROP 04
              </span>
              <span className="bg-royal text-white font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 self-start rounded-md shadow-sm">
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
              className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm text-charcoal hover:bg-royal hover:text-white border border-border transition-colors z-20 rounded-md shadow-sm"
              title="Expand Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Purchase & Information Column (5 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-white border border-border p-8 rounded-2xl shadow-subtle text-charcoal">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border">
              <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal">
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
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs font-bold text-charcoal">{product.rating || 5.0}</span>
              <span className="font-mono text-xs text-muted">({product.reviewCount || 14} client reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline space-x-4 mb-5 pb-5 border-b border-border">
              <span className="font-mono text-3xl font-bold text-royal">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="font-mono text-base line-through text-muted">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              <span className="bg-surface-tint text-charcoal font-mono text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-md border border-border">
                VIP ALLOCATION
              </span>
            </div>

            {/* Limited Stock Indicator */}
            <div className="mb-6 p-3 bg-surface-tint border border-border flex items-center justify-between font-mono text-xs rounded-xl text-charcoal">
              <span className="font-bold uppercase tracking-wider flex items-center space-x-1.5 text-charcoal">
                <Flame className="w-3.5 h-3.5 text-pink" />
                <span>Strictly Capped Run</span>
              </span>
              <span className="text-pink font-bold uppercase tracking-wider">
                Only 14 of 250 Units Left
              </span>
            </div>

            {/* Special Product Offer Banner */}
            {product.customOffer && product.customOffer.trim() !== '' && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setOffersOpen(true)}
                  className="w-full bg-royal-subtle border border-royal/30 p-3.5 flex items-center justify-between hover:border-royal transition-all group rounded-xl"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-7 h-7 rounded-full bg-royal text-white flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-royal block font-bold">
                        SPECIAL PRODUCT OFFER (1)
                      </span>
                      <span className="font-mono text-xs text-charcoal font-bold">
                        {product.customOffer}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-royal group-hover:underline font-bold">
                    View & Apply →
                  </span>
                </button>
              </div>
            )}

            {/* Garment Editorial Description */}
            <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed mb-6 font-normal">
              {product.description ||
                'Tailored from 320 GSM organic combed French Terry cotton. Engineered with dropped shoulders, reinforced shape-retaining ribbed crewneck collar, and subtle tonal embroidery.'}
            </p>

            {/* Color Swatches */}
            <div className="mb-6">
              <label className="block font-mono text-xs uppercase font-bold tracking-wider text-charcoal mb-2">
                Color Edition: <span className="text-royal font-bold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((clr: any) => (
                  <button
                    key={clr}
                    onClick={() => setSelectedColor(clr)}
                    className={`px-4 py-2 font-mono text-xs uppercase border transition-all rounded-md ${
                      selectedColor === clr
                        ? 'bg-royal text-white border-royal font-bold shadow-sm'
                        : 'bg-surface-tint border-border text-charcoal hover:border-royal'
                    }`}
                  >
                    {clr}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector + Size Guide Modal Trigger */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2 text-charcoal">
                <label className="font-mono text-xs uppercase font-bold tracking-wider text-charcoal">
                  Select Size: <span className="text-royal font-bold">{selectedSize} (Relaxed Boxy Fit)</span>
                </label>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="font-mono text-xs uppercase tracking-wider text-royal hover:underline flex items-center font-bold"
                >
                  <Ruler className="w-3.5 h-3.5 mr-1" /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {sizes.map((sz: any) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-12 font-mono text-xs uppercase border flex items-center justify-center transition-all rounded-md ${
                      selectedSize === sz
                        ? 'bg-royal text-white border-royal font-bold shadow-sm'
                        : 'bg-surface-tint border-border text-charcoal hover:border-royal'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8 text-charcoal">
              <label className="block font-mono text-xs uppercase font-bold tracking-wider text-charcoal mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-border bg-surface-tint rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-muted hover:text-charcoal"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-6 font-mono text-sm font-bold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-muted hover:text-charcoal"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-royal hover:bg-royal-dark text-white py-4 font-mono text-xs uppercase tracking-[0.22em] font-bold transition-all duration-200 flex items-center justify-center space-x-2 rounded-md shadow-luxury"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>ADDED TO CLIENT BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>ADD TO CLIENT BAG</span>
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
                className={`p-4 border rounded-md transition-all ${
                  isWish
                    ? 'bg-charcoal text-pink border-charcoal'
                    : 'bg-surface-tint text-charcoal border-border hover:border-royal'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWish ? 'fill-current text-pink' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-[#0F172A] hover:bg-black text-white py-3.5 font-mono text-xs uppercase tracking-[0.22em] font-bold transition-all rounded-md shadow-sm flex items-center justify-center space-x-2"
            >
              <span>Instant VIP Checkout</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="pt-6 border-t border-border space-y-3 text-charcoal">
            <label className="block font-mono text-xs uppercase font-bold tracking-wider text-charcoal">
              White-Glove Delivery Estimator
            </label>
            <form onSubmit={checkPincode} className="flex max-w-sm">
              <input
                type="text"
                placeholder="ENTER 6-DIGIT PINCODE"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 bg-surface-tint border border-border px-3.5 py-2.5 font-mono text-xs uppercase text-charcoal focus:outline-none focus:border-royal placeholder:text-muted rounded-l-md"
              />
              <button
                type="submit"
                className="bg-royal hover:bg-royal-dark text-white px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold rounded-r-md transition-colors"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="font-mono text-[11px] text-emerald-600 tracking-wide font-bold">
                {pincodeStatus}
              </p>
            )}
          </div>

          {/* Premium Packaging Note */}
          <div className="p-4 bg-surface-tint border border-border space-y-2 font-mono text-[11px] text-charcoal rounded-xl">
            <div className="flex items-center space-x-2 text-charcoal font-bold">
              <Package className="w-4 h-4 text-royal" />
              <span className="uppercase tracking-wider">Signature Presentation Packaging</span>
            </div>
            <p className="leading-relaxed text-muted">
              Every drop is hand-packed in a rigid CELEBRITEE collector box with magnetic closure and numbered Certificate of Collaboration.
            </p>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-border text-charcoal">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal">
                CURATED COMPANIONS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-charcoal mt-1">
                Selected for You
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-mono text-xs uppercase tracking-widest text-royal hover:underline transition-colors font-bold"
            >
              View Full Vault →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel: any, idx: number) => (
              <Link
                key={rel.id}
                href={`/product/${rel.slug}`}
                className="group bg-white border border-border hover:border-royal/50 hover:shadow-card transition-all duration-300 flex flex-col justify-between rounded-2xl overflow-hidden shadow-subtle text-charcoal"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <img
                    src={rel.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000'}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-[#0F172A] text-white text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm">
                    DROP 0{idx + 1}
                  </div>
                </div>
                <div className="p-3.5 bg-white border-t border-border text-charcoal">
                  <h3 className="font-serif text-xs font-normal text-charcoal group-hover:text-royal transition-colors line-clamp-1">
                    {rel.name}
                  </h3>
                  <p className="font-mono text-xs font-bold text-royal mt-1">
                    {formatPrice(rel.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 text-white hover:text-pink transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen View"
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
        </div>
      )}

      {/* Global Size Guide & Offers Modals */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <ProductOffersModal isOpen={offersOpen} onClose={() => setOffersOpen(false)} product={product} />
    </div>
  );
}
