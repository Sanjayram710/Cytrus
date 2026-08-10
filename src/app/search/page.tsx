'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/products?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-luxury-border pb-6 mb-8">
        <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
          COUTURE SEARCH
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-luxury-black mt-1">
          Search Results for "{query}"
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
          Found {products.length} matching item(s)
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs uppercase tracking-widest text-luxury-gold">Searching CYTRUS Catalog...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-luxury-border p-8">
          <Search className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
          <p className="font-serif text-xl font-bold text-luxury-black mb-2">No Matching Couture Found</p>
          <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Try searching for "silk gown", "saree", "velvet", or "linen".</p>
          <Link href="/shop" className="bg-luxury-black text-luxury-cream px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-luxury-gold hover:text-black">
            Explore All Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group bg-white border border-luxury-border p-3 hover:border-luxury-gold transition-all"
            >
              <img
                src={product.images[0]?.url}
                alt={product.name}
                className="w-full h-72 object-cover object-center mb-3"
              />
              <p className="text-[10px] font-semibold text-luxury-gold uppercase tracking-widest">
                {product.category?.name}
              </p>
              <h3 className="font-serif text-xs font-bold text-luxury-black group-hover:text-luxury-gold line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs font-bold text-luxury-black mt-1">
                {formatPrice(product.price)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center uppercase tracking-widest text-luxury-gold">Loading Search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
