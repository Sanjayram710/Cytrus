'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const [collection, setCollection] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch(`/api/products?collection=${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          if (data.products[0]?.collection) {
            setCollection(data.products[0].collection);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
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

  const collectionName = collection?.name || params.slug.replace('-', ' ').toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white text-charcoal">
      {/* Editorial Banner Header */}
      <div className="relative bg-surface-tint text-charcoal p-8 sm:p-14 mb-12 border border-border rounded-2xl overflow-hidden shadow-subtle">
        {collection?.image && (
          <img
            src={collection.image}
            alt={collectionName}
            className="absolute inset-0 w-full h-full object-cover opacity-15 filter brightness-[0.9]"
          />
        )}
        <div className="relative z-10 max-w-2xl text-charcoal">
          <span className="font-mono text-royal text-xs uppercase font-bold tracking-[0.25em] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
            <span>EDITORIAL CAPSULE</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal uppercase mt-1 mb-4 text-charcoal">
            {collectionName}
          </h1>
          <p className="text-xs sm:text-sm font-normal text-muted leading-relaxed">
            {collection?.description || 'Curated capsule drops featuring 320+ GSM French Terry cotton, mineral acid washes, and bespoke streetwear silhouettes.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 font-mono uppercase tracking-widest text-muted text-xs">Loading Capsule Collection...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-charcoal">
          {products.map((product) => {
            const isWish = isInWishlist(product.id);
            const primaryImg = product.images?.[0]?.url || '';

            return (
              <div
                key={product.id}
                className="group relative bg-white border border-border hover:border-royal/50 hover:shadow-card transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-subtle text-charcoal"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <Link href={`/product/${product.slug}`}>
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Wishlist button */}
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

                  {/* Hover Quick Action buttons */}
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
                      className="bg-royal hover:bg-royal-dark text-white px-3.5 py-2 transition-colors rounded-md shadow-sm"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-border text-charcoal">
                  <p className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-1">
                    {product.category?.name || 'CAPSULE DROP'}
                  </p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-xs font-normal text-charcoal group-hover:text-royal transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-2 flex items-baseline justify-between text-charcoal">
                    <span className="font-mono text-xs font-bold text-royal">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
