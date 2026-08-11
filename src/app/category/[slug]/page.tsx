'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch(`/api/products?category=${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          if (data.products[0]?.category) {
            setCategory(data.products[0].category);
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

  const categoryName = category?.name || params.slug.replace('-', ' ').toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="relative bg-luxury-black text-luxury-cream p-8 sm:p-16 mb-12 border border-luxury-gold/40 shadow-luxury overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-luxury-gold text-xs font-semibold uppercase tracking-[0.35em]">
            CATEGORY COUTURE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold uppercase mt-1 mb-4">
            {categoryName}
          </h1>
          <p className="text-xs sm:text-sm font-light text-luxury-cream/80 leading-relaxed">
            {category?.description || 'Explore our hand-curated silhouette collection designed with pure silk and bespoke tailoring.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 uppercase tracking-widest text-luxury-gold text-xs">Loading Category Pieces...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-luxury-border p-8">
          <p className="font-serif text-xl font-bold text-luxury-black mb-2">No products currently available in {categoryName}</p>
          <Link href="/shop" className="text-xs uppercase font-bold tracking-widest text-luxury-gold hover:underline">
            Browse All Couture →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isWish = isInWishlist(product.id);
            const primaryImg = product.images?.[0]?.url || '';

            return (
              <div key={product.id} className="group relative bg-white border border-luxury-border/60 hover:border-luxury-gold transition-all duration-300">
                <div className="relative h-72 sm:h-84 overflow-hidden bg-luxury-cream">
                  <Link href={`/product/${product.slug}`}>
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000';
                      }}
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
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
                      isWish ? 'bg-red-50 text-red-600' : 'bg-white/80 text-luxury-black hover:bg-luxury-gold hover:text-black'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2 z-10">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="flex-1 bg-white/90 backdrop-blur-sm text-luxury-black hover:bg-luxury-black hover:text-white py-2 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-luxury-black text-luxury-cream hover:bg-luxury-gold hover:text-black p-2 transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-xs font-bold text-luxury-black group-hover:text-luxury-gold transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-bold text-luxury-black mt-1">
                    {formatPrice(product.price)}
                  </p>
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
