'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

interface QuickViewModalProps {
  product: any;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('Obsidian Black');
  const [added, setAdded] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  if (!product) return null;

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
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isWish = isInWishlist(product.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-charcoal">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white border border-border overflow-hidden z-10 shadow-2xl rounded-2xl text-charcoal max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted hover:text-charcoal transition-colors z-20 rounded-md bg-surface-tint border border-border"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto text-charcoal">
            {/* Gallery Column */}
            <div className="p-6 bg-slate-50 flex flex-col justify-between border-r border-border text-charcoal">
              <div className="aspect-[4/5] bg-slate-100 border border-border overflow-hidden mb-4 rounded-xl">
                <img src={currentImage} alt={product.name} className="w-full h-full object-cover object-center" />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-14 h-16 border overflow-hidden rounded-md transition-all ${
                        selectedImageIndex === idx ? 'border-royal ring-1 ring-royal' : 'border-border opacity-70'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column in Black */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 text-charcoal">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-royal font-bold">
                  {product.category?.name || 'HEAVYWEIGHT STREETWEAR'}
                </span>
                <h2 className="font-serif text-2xl font-normal text-charcoal mt-1">
                  {product.name}
                </h2>

                <div className="flex items-baseline space-x-3 mt-3 pb-4 border-b border-border text-charcoal">
                  <span className="font-mono text-xl font-bold text-royal">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="font-mono text-xs line-through text-muted">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                  <span className="bg-surface-tint text-charcoal font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded border border-border">
                    VIP ALLOCATION
                  </span>
                </div>

                <p className="text-xs text-charcoal/80 leading-relaxed my-4 font-normal">
                  {product.description ||
                    '320 GSM organic French Terry cotton engineered with dropped shoulders and reinforced shape-retaining ribbed crewneck collar.'}
                </p>

                {/* Size Selector */}
                <div className="mb-4 text-charcoal">
                  <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal mb-2">
                    Select Size: <span className="text-royal font-bold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((sz: any) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 font-mono text-xs uppercase border flex items-center justify-center transition-all rounded-md ${
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
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-border text-charcoal">
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-royal hover:bg-royal-dark text-white py-3 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center space-x-2 rounded-md shadow-sm"
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>ADDED TO BAG</span>
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
                    className={`p-3 border rounded-md transition-all ${
                      isWish
                        ? 'bg-charcoal text-pink border-charcoal'
                        : 'bg-surface-tint text-charcoal border-border hover:border-royal'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-current text-pink' : ''}`} />
                  </button>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="block text-center font-mono text-[11px] uppercase tracking-widest text-muted hover:text-charcoal transition-colors font-bold pt-1"
                >
                  View Full Drop Specifications →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
