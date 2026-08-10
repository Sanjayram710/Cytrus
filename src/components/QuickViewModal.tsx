'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, Heart, Check } from 'lucide-react';
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
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4 z-50">
        <div className="bg-luxury-cream border border-luxury-border max-w-4xl w-full p-6 sm:p-8 relative shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-luxury-black hover:text-luxury-gold transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="bg-white p-2">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-96 object-cover object-center"
              />
            </div>

            {/* Product Quick Details */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-luxury-gold mb-1">
                  {product.category?.name || 'COUTURE'}
                </p>

                <h2 className="font-serif text-2xl font-bold text-luxury-black mb-2">
                  {product.name}
                </h2>

                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-xl font-bold text-luxury-black">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm line-through text-gray-400">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="bg-luxury-black text-luxury-cream text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {product.description}
                </p>

                {/* Size Selector */}
                <div className="mb-4">
                  <label className="block text-xs uppercase font-bold tracking-wider text-luxury-black mb-2">
                    Size: <span className="text-luxury-gold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((sz: any) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                          selectedSize === sz
                            ? 'bg-luxury-black text-luxury-cream border-luxury-black'
                            : 'bg-white text-luxury-black border border-luxury-border hover:border-luxury-gold'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="mb-6">
                  <label className="block text-xs uppercase font-bold tracking-wider text-luxury-black mb-2">
                    Color: <span className="text-luxury-gold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((cl: any) => (
                      <button
                        key={cl}
                        onClick={() => setSelectedColor(cl)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                          selectedColor === cl
                            ? 'bg-luxury-black text-luxury-cream border-luxury-black'
                            : 'bg-white text-luxury-black border border-luxury-border hover:border-luxury-gold'
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
                    className="flex-1 bg-luxury-black text-luxury-cream py-3.5 text-xs uppercase font-bold tracking-[0.2em] hover:bg-luxury-gold hover:text-luxury-black transition-all flex items-center justify-center space-x-2"
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
                        image: primaryImage,
                        price: product.price,
                      })
                    }
                    className={`p-3.5 border transition-colors ${
                      isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'border-luxury-border text-luxury-black hover:border-luxury-gold'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="block text-center text-xs uppercase tracking-widest font-bold text-luxury-black hover:text-luxury-gold py-1"
                >
                  View Full Product Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
