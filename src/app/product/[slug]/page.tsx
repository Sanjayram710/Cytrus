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
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // Review submission form state
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
            setSelectedSize(resData.product.variants[0].size);
            setSelectedColor(resData.product.variants[0].color);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return <div className="p-20 text-center uppercase tracking-widest text-luxury-gold text-xs">Loading Couture Details...</div>;
  }

  if (!data || !data.product) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border border-luxury-border">
        <h2 className="font-serif text-2xl font-bold text-luxury-black mb-2">Product Not Found</h2>
        <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">The requested dress or silk piece does not exist.</p>
        <Link href="/shop" className="bg-luxury-black text-luxury-cream px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black">
          Return to Shop
        </Link>
      </div>
    );
  }

  const { product, relatedProducts } = data;
  const isWish = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8' }];
  const currentImage = images[selectedImageIndex]?.url || images[0].url;

  const sizes = Array.from(new Set(product.variants?.map((v: any) => v.size) || ['XS', 'S', 'M', 'L', 'XL']));
  const colors = Array.from(new Set(product.variants?.map((v: any) => v.color) || ['Emerald Green', 'Obsidian Black']));

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
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
    router.push('/checkout');
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
        // Refresh product details
        const refresh = await fetch(`/api/products/${params.slug}`).then((r) => r.json());
        if (refresh.product) setData(refresh);
      }
    } catch (err) {
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      {/* Breadcrumb Navigation */}
      <nav className="font-mono text-xs uppercase tracking-widest text-muted mb-8 space-x-2">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <span>/</span>
        <Link href={`/category/${product.category?.slug}`} className="hover:text-ink">{product.category?.name}</Link>
        <span>/</span>
        <span className="text-ink font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto no-scrollbar">
            {images.map((img: any, idx: number) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-24 flex-shrink-0 border overflow-hidden bg-surface transition-all ${
                  selectedImageIndex === idx ? 'border-accent' : 'border-border opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover object-center" />
              </button>
            ))}
          </div>

          {/* Main Image Stage */}
          <div className="relative flex-1 bg-surface border border-border overflow-hidden group">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-[550px] sm:h-[650px] object-cover object-center transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setFullscreenImage(currentImage)}
            />

            {/* Expand Fullscreen Button */}
            <button
              onClick={() => setFullscreenImage(currentImage)}
              className="absolute top-4 right-4 p-3 bg-canvas/80 backdrop-blur-sm text-ink hover:bg-ink hover:text-canvas border border-border transition-colors"
              title="Expand Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Information Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
                {product.category?.name || 'SILHOUETTE'}
              </span>
              <span className="font-mono text-[11px] uppercase text-muted">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink mt-2 mb-3">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-border'}`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs font-semibold text-ink">{product.rating}</span>
              <span className="font-mono text-xs text-muted">({product.reviewCount} reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline space-x-4 mb-6 pb-6 border-b border-border">
              <span className="font-mono text-3xl font-semibold text-accent">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="font-mono text-base line-through text-muted">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="bg-surface border border-border text-ink font-mono text-xs font-semibold px-2.5 py-1 uppercase tracking-widest">
                  SAVE {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Stock Level Warning */}
            <div className="mb-6">
              {product.stock <= 5 && product.stock > 0 ? (
                <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  ⚠️ ONLY {product.stock} PIECES REMAINING IN DROP VAULT
                </p>
              ) : product.stock > 0 ? (
                <p className="font-mono text-xs uppercase tracking-wider text-muted flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1 text-ink" /> IN STOCK & READY TO SHIP
                </p>
              ) : (
                <p className="font-mono text-xs uppercase tracking-wider text-muted">OUT OF STOCK</p>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6 font-normal">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="mb-6">
              <label className="block font-mono text-xs uppercase font-medium tracking-wider text-ink mb-2">
                Color: <span className="text-muted">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((clr: any) => (
                  <button
                    key={clr}
                    onClick={() => setSelectedColor(clr)}
                    className={`px-4 py-2 font-mono text-xs uppercase border transition-all ${
                      selectedColor === clr
                        ? 'bg-ink text-canvas border-ink'
                        : 'bg-surface text-ink border-border hover:border-accent'
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
                <label className="font-mono text-xs uppercase font-medium tracking-wider text-ink">
                  Select Size: <span className="text-muted">{selectedSize}</span>
                </label>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="font-mono text-xs uppercase tracking-wider text-accent hover:underline flex items-center"
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
                        ? 'bg-ink text-canvas border-ink'
                        : 'bg-surface text-ink border-border hover:border-accent'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block font-mono text-xs uppercase font-medium tracking-wider text-ink mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-border bg-surface">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-ink hover:bg-canvas"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-6 font-mono text-sm font-semibold text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-ink hover:bg-canvas"
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
                className="flex-1 bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-all flex items-center justify-center space-x-2 border border-accent"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-canvas" />
                    <span>ADDED TO BAG</span>
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
                className={`p-4 border transition-colors ${
                  isWish ? 'bg-ink text-canvas border-ink' : 'border-border text-ink bg-surface hover:border-accent'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-ink text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-accent border border-ink transition-colors"
            >
              EXPRESS CHECKOUT
            </button>

            {/* Delivery & Assurance info */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-border text-center font-mono text-[9px] text-muted uppercase tracking-wider">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-accent mb-1" />
                <span>Express Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-accent mb-1" />
                <span>240 GSM Organic Cotton</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-accent mb-1" />
                <span>Complimentary Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="border-t border-border pt-16 mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-ink mt-1">
              Customer Reviews ({product.reviews?.length || 0})
            </h2>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="mt-4 sm:mt-0 bg-accent text-canvas px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-ink transition-colors inline-flex items-center space-x-2 border border-accent"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev: any) => (
              <div key={rev.id} className="bg-surface border border-border p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-border'}`} />
                    ))}
                  </div>
                  {rev.isVerified && (
                    <span className="font-mono text-[9px] uppercase tracking-wider text-muted border border-border px-2 py-0.5">
                      Verified Buyer
                    </span>
                  )}
                </div>
                {rev.title && <h4 className="font-serif text-sm font-normal text-ink">{rev.title}</h4>}
                <p className="text-xs text-muted leading-relaxed font-normal">{rev.comment}</p>
                <div className="font-mono text-[10px] text-muted uppercase tracking-wider">
                  {rev.userName} • {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-mono text-xs text-muted uppercase tracking-widest text-center py-8">Be the first to leave a review for this drop.</p>
        )}
      </section>

      {/* Related Products Grid */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-border pt-16">
          <div className="text-center mb-10">
            <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
              COMPLEMENTARY SILHOUETTES
            </span>
            <h2 className="font-serif text-3xl font-normal text-ink mt-1">
              Related Drops
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((rel: any) => (
              <Link
                key={rel.id}
                href={`/product/${rel.slug}`}
                className="group relative bg-surface border border-border p-3 hover:border-accent transition-all"
              >
                {/* Signature Swing-Tag Detail */}
                <div className="absolute top-0 right-3 z-20 flex flex-col items-center pointer-events-none">
                  <div className="w-[1px] h-3 bg-border group-hover:bg-accent transition-colors" />
                  <div className="swing-tag px-2 py-0.5 text-center group-hover:-translate-y-0.5 group-hover:-rotate-2 transition-transform duration-300">
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-accent block">
                      {formatPrice(rel.price)}
                    </span>
                  </div>
                </div>

                <div className="relative h-64 overflow-hidden bg-surface mb-3 border border-border">
                  <img src={rel.images[0]?.url} alt={rel.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-serif text-xs font-normal text-ink group-hover:text-accent line-clamp-1">
                  {rel.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 p-3 text-canvas hover:text-border"
          >
            <X className="w-7 h-7" />
          </button>
          <img src={fullscreenImage} alt="Fullscreen View" className="max-h-[90vh] max-w-[90vw] object-contain border border-border" />
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border max-w-md w-full p-6 relative">
            <button onClick={() => setReviewModalOpen(false)} className="absolute top-4 right-4 text-ink hover:text-accent">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-normal text-ink mb-4">Write a Review</h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase font-medium mb-1 text-ink">Rating</label>
                <div className="flex text-accent space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-current' : 'text-border'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-medium mb-1 text-ink">Review Title</label>
                <input
                  type="text"
                  placeholder="e.g. Heavyweight drape and boxy cut"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-canvas border border-border p-2.5 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-medium mb-1 text-ink">Your Feedback</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the GSM weight, fit, ribbing, and wash..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-canvas border border-border p-2.5 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full bg-accent text-canvas py-3 font-mono text-xs uppercase tracking-widest font-semibold hover:bg-ink border border-accent transition-colors"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
