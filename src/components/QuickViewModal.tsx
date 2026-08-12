'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, Heart, Check, Tag } from 'lucide-react';
import ProductOffersModal from '@/components/ProductOffersModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

interface QuickViewModalProps {
  product: any;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size || 'M');
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color || 'Black');
  const [added, setAdded] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.url || '';

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: primaryImage,
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const sizes = Array.from(new Set(product.variants?.map((v: any) => v.size) || ['XS', 'S', 'M', 'L', 'XL']));
  const colors = Array.from(new Set(product.variants?.map((v: any) => v.color) || ['Default']));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-ink/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4 z-50">
        <div className="bg-surface border border-border max-w-4xl w-full p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-ink hover:text-accent transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="bg-canvas border border-border p-2">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-96 object-cover object-center"
              />
            </div>

            {/* Product Quick Details */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] font-medium text-muted mb-1">
                  {product.category?.name || 'SILHOUETTE'}
                </p>

                <h2 className="font-serif text-2xl font-normal text-ink mb-2">
                  {product.name}
                </h2>

                <div className="flex items-center space-x-3 mb-4">
                  <span className="font-mono text-xl font-semibold text-accent">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="font-mono text-sm line-through text-muted">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="bg-surface border border-border text-ink font-mono text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Special Product Offers Banner (Only displayed when custom offer is set) */}
                {product.customOffer && product.customOffer.trim() !== '' && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => setOffersOpen(true)}
                      className="w-full bg-canvas border border-dashed border-accent hover:border-ink p-2.5 flex items-center justify-between text-left group transition-all"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1 bg-ink text-canvas border border-ink group-hover:bg-accent transition-colors">
                          <Tag className="w-3.5 h-3.5 text-accent group-hover:text-canvas" />
                        </div>
                        <div>
                          <span className="font-mono text-[11px] font-bold text-ink uppercase tracking-wider block">
                            SPECIAL PRODUCT OFFER (1)
                          </span>
                          <span className="font-mono text-[9px] text-muted uppercase">
                            <span className="font-bold text-accent">{product.customOffer}</span>
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                <p className="text-xs text-muted leading-relaxed mb-6 line-clamp-3">
                  {product.description}
                </p>

                {/* Size Selector */}
                <div className="mb-4">
                  <label className="block font-mono text-xs uppercase font-medium tracking-wider text-ink mb-2">
                    Size: <span className="text-muted">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((sz: any) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 font-mono text-xs uppercase transition-all border ${
                          selectedSize === sz
                            ? 'bg-ink text-canvas border-ink'
                            : 'bg-canvas text-ink border-border hover:border-accent'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="mb-6">
                  <label className="block font-mono text-xs uppercase font-medium tracking-wider text-ink mb-2">
                    Color: <span className="text-muted">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((cl: any) => (
                      <button
                        key={cl}
                        onClick={() => setSelectedColor(cl)}
                        className={`px-3 py-1.5 font-mono text-xs uppercase transition-all border ${
                          selectedColor === cl
                            ? 'bg-ink text-canvas border-ink'
                            : 'bg-canvas text-ink border-border hover:border-accent'
                        }`}
                      >
                        {cl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-accent text-canvas py-3.5 font-mono text-xs uppercase font-semibold tracking-[0.2em] hover:bg-ink transition-all flex items-center justify-center space-x-2 border border-accent"
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
                        image: primaryImage,
                        price: product.price,
                      })
                    }
                    className={`p-3.5 border transition-colors ${
                      isWishlisted
                        ? 'bg-ink text-canvas border-ink'
                        : 'border-border text-ink bg-canvas hover:border-accent'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="block text-center font-mono text-xs uppercase tracking-widest text-muted hover:text-ink py-1"
                >
                  View Full Product Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductOffersModal isOpen={offersOpen} onClose={() => setOffersOpen(false)} />
    </div>
  );
}
