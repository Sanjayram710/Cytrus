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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      {/* Editorial Banner Header */}
      <div className="relative bg-ink text-canvas p-8 sm:p-14 mb-12 border border-border overflow-hidden">
        {collection?.image && (
          <img
            src={collection.image}
            alt={collectionName}
            className="absolute inset-0 w-full h-full object-cover opacity-20 filter brightness-[0.6]"
          />
        )}
        <div className="relative z-10 max-w-2xl">
          <span className="font-mono text-border text-xs uppercase font-medium tracking-[0.25em]">
            EDITORIAL CAPSULE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal uppercase mt-1 mb-4 text-canvas">
            {collectionName}
          </h1>
          <p className="text-xs sm:text-sm font-normal text-canvas/70 leading-relaxed">
            {collection?.description || 'Curated capsule drops featuring 300 GSM French Terry cotton, mineral acid washes, and raw streetwear silhouettes.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 font-mono uppercase tracking-widest text-muted text-xs">Loading Capsule Collection...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isWish = isInWishlist(product.id);
            const primaryImg = product.images?.[0]?.url || '';

            return (
              <div
                key={product.id}
                className="group relative bg-surface border border-border hover:border-accent transition-all duration-300"
              >
                {/* Signature Swing-Tag Detail */}
                <div className="absolute top-0 right-3 z-20 flex flex-col items-center pointer-events-none">
                  <div className="w-[1px] h-3.5 bg-border group-hover:bg-accent transition-colors" />
                  <div className="swing-tag px-2.5 py-1 text-center group-hover:-translate-y-0.5 group-hover:-rotate-2 transition-transform duration-300">
                    <span className="font-mono text-[11px] font-semibold tracking-wider text-accent block">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="font-mono text-[9px] line-through text-muted block -mt-0.5">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative h-72 sm:h-84 overflow-hidden bg-surface">
                  <Link href={`/product/${product.slug}`}>
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

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
                    className={`absolute bottom-3 right-3 z-10 p-2 border transition-all ${
                      isWish
                        ? 'bg-ink text-canvas border-ink'
                        : 'bg-canvas/90 text-ink border-border hover:bg-ink hover:text-canvas'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-current' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1.5 z-10">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="flex-1 bg-canvas/95 backdrop-blur-sm border border-border text-ink hover:bg-ink hover:text-canvas py-2 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-ink text-canvas hover:bg-accent p-2 transition-colors border border-ink"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-surface border-t border-border">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-xs font-normal text-ink group-hover:text-accent transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
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
