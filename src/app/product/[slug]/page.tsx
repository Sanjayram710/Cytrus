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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs uppercase tracking-widest text-gray-500 mb-8 space-x-2">
        <Link href="/" className="hover:text-luxury-gold">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-luxury-gold">Shop</Link>
        <span>/</span>
        <Link href={`/category/${product.category?.slug}`} className="hover:text-luxury-gold">{product.category?.name}</Link>
        <span>/</span>
        <span className="text-luxury-black font-semibold">{product.name}</span>
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
                className={`w-20 h-24 flex-shrink-0 border-2 overflow-hidden bg-white transition-all ${
                  selectedImageIndex === idx ? 'border-luxury-gold shadow-md' : 'border-luxury-border opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover object-center" />
              </button>
            ))}
          </div>

          {/* Main Image Stage */}
          <div className="relative flex-1 bg-white border border-luxury-border overflow-hidden group">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-[550px] sm:h-[650px] object-cover object-center transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setFullscreenImage(currentImage)}
            />

            {/* Expand Fullscreen Button */}
            <button
              onClick={() => setFullscreenImage(currentImage)}
              className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm text-luxury-black hover:bg-luxury-gold transition-colors rounded-full shadow-subtle"
              title="Expand Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Information Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
                {product.category?.name || 'COUTURE'}
              </span>
              <span className="text-[11px] font-mono uppercase text-gray-400">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-luxury-black mt-2 mb-3">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-luxury-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-luxury-black">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline space-x-4 mb-6 pb-6 border-b border-luxury-border">
              <span className="text-3xl font-extrabold text-luxury-black">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-base line-through text-gray-400">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="bg-luxury-black text-luxury-cream text-xs font-bold px-2.5 py-1 uppercase tracking-widest">
                  SAVE {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Stock Level Warning */}
            <div className="mb-6">
              {product.stock <= 5 && product.stock > 0 ? (
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 animate-pulse">
                  ⚠️ ONLY {product.stock} PIECES REMAINING IN COUTURE VAULT
                </p>
              ) : product.stock > 0 ? (
                <p className="text-xs font-semibold uppercase tracking-wider text-green-700 flex items-center">
                  <Check className="w-4 h-4 mr-1 text-green-700" /> IN STOCK & READY TO SHIP
                </p>
              ) : (
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">OUT OF STOCK</p>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="mb-6">
              <label className="block text-xs uppercase font-bold tracking-wider text-luxury-black mb-2">
                Color: <span className="text-luxury-gold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map((clr: any) => (
                  <button
                    key={clr}
                    onClick={() => setSelectedColor(clr)}
                    className={`px-4 py-2 text-xs font-bold uppercase border transition-all ${
                      selectedColor === clr
                        ? 'bg-luxury-black text-luxury-cream border-luxury-black shadow-md'
                        : 'bg-white text-luxury-black border-luxury-border hover:border-luxury-gold'
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
                <label className="text-xs uppercase font-bold tracking-wider text-luxury-black">
                  Select Size: <span className="text-luxury-gold">{selectedSize}</span>
                </label>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs uppercase font-bold tracking-wider text-luxury-gold hover:underline flex items-center"
                >
                  <Ruler className="w-4 h-4 mr-1" /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {sizes.map((sz: any) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-12 text-xs font-bold uppercase border flex items-center justify-center transition-all ${
                      selectedSize === sz
                        ? 'bg-luxury-black text-luxury-cream border-luxury-black shadow-md'
                        : 'bg-white text-luxury-black border-luxury-border hover:border-luxury-gold'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-xs uppercase font-bold tracking-wider text-luxury-black mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-luxury-border bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-luxury-black hover:bg-luxury-cream"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 text-sm font-bold text-luxury-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-luxury-black hover:bg-luxury-cream"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-luxury-border">
            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-luxury-black text-luxury-cream py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center space-x-2 shadow-luxury"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
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
                  isWish ? 'bg-red-50 border-red-200 text-red-600' : 'border-luxury-border text-luxury-black hover:border-luxury-gold'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWish ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-luxury-gold text-luxury-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:border-luxury-gold border border-transparent transition-all shadow-subtle"
            >
              BUY NOW WITH EXPRESS CHECKOUT
            </button>

            {/* Delivery & Assurance info */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-luxury-border text-center text-[10px] text-gray-600 uppercase tracking-wider font-semibold">
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-luxury-gold mb-1" />
                <span>Express Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-luxury-gold mb-1" />
                <span>Authentic Mulberry Silk</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-luxury-gold mb-1" />
                <span>Complimentary Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="border-t border-luxury-border pt-16 mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-black mt-1">
              Customer Reviews ({product.reviews?.length || 0})
            </h2>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="mt-4 sm:mt-0 bg-luxury-black text-luxury-cream px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-luxury-gold hover:text-black transition-colors inline-flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev: any) => (
              <div key={rev.id} className="bg-white border border-luxury-border p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-luxury-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  {rev.isVerified && (
                    <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                      Verified Buyer
                    </span>
                  )}
                </div>
                {rev.title && <h4 className="font-serif text-sm font-bold text-luxury-black">{rev.title}</h4>}
                <p className="text-xs text-gray-700 leading-relaxed font-light">{rev.comment}</p>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                  {rev.userName} • {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 uppercase tracking-widest text-center py-8">Be the first to leave a review for this couture piece.</p>
        )}
      </section>

      {/* Related Products Grid */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-luxury-border pt-16">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
              YOU MAY ALSO ADMIRE
            </span>
            <h2 className="font-serif text-3xl font-bold text-luxury-black mt-1">
              Related Couture
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((rel: any) => (
              <Link
                key={rel.id}
                href={`/product/${rel.slug}`}
                className="group bg-white border border-luxury-border p-3 hover:border-luxury-gold transition-all"
              >
                <img src={rel.images[0]?.url} alt={rel.name} className="w-full h-64 object-cover object-center mb-3" />
                <h3 className="font-serif text-xs font-bold text-luxury-black group-hover:text-luxury-gold line-clamp-1">
                  {rel.name}
                </h3>
                <p className="text-xs font-bold text-luxury-black mt-1">{formatPrice(rel.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 p-3 text-white hover:text-luxury-gold"
          >
            <X className="w-8 h-8" />
          </button>
          <img src={fullscreenImage} alt="Fullscreen View" className="max-h-[90vh] max-w-[90vw] object-contain" />
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-luxury-cream border border-luxury-border max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setReviewModalOpen(false)} className="absolute top-4 right-4 text-luxury-black">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-luxury-black mb-4">Write a Review</h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold mb-1">Rating</label>
                <div className="flex text-luxury-gold space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold mb-1">Review Title</label>
                <input
                  type="text"
                  placeholder="e.g. Breathtaking Silk Fabric"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-white border border-luxury-border p-2 text-xs focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold mb-1">Your Feedback</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the fit, drape, and quality..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-luxury-border p-2 text-xs focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full bg-luxury-black text-luxury-cream py-3 text-xs uppercase font-bold tracking-widest hover:bg-luxury-gold hover:text-black"
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
