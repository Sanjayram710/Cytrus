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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      <div className="border-b border-border pb-6 mb-8">
        <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
          SEARCH CATALOG
        </span>
        <h1 className="font-serif text-3xl font-normal tracking-tight text-ink mt-1">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-widest mt-1">
          Found {products.length} matching item(s)
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 font-mono text-xs uppercase tracking-widest text-muted">Searching Celebritee.in Catalog...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-border p-8">
          <Search className="w-10 h-10 text-muted mx-auto mb-4" />
          <p className="font-serif text-xl font-normal text-ink mb-2">No Matching Products Found</p>
          <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">Try searching for &quot;oversized&quot;, &quot;graphic&quot;, &quot;vintage wash&quot;, or &quot;french terry&quot;.</p>
          <Link href="/shop" className="bg-accent text-canvas px-6 py-3 font-mono text-xs uppercase font-semibold tracking-widest hover:bg-ink border border-accent">
            Explore All Drops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group relative bg-surface border border-border p-3 hover:border-accent transition-all"
            >
              {/* Signature Swing-Tag Detail */}
              <div className="absolute top-0 right-3 z-20 flex flex-col items-center pointer-events-none">
                <div className="w-[1px] h-3.5 bg-border group-hover:bg-accent transition-colors" />
                <div className="swing-tag px-2 py-0.5 text-center group-hover:-translate-y-0.5 group-hover:-rotate-2 transition-transform duration-300">
                  <span className="font-mono text-[10px] font-semibold tracking-wider text-accent block">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              <div className="relative h-72 overflow-hidden bg-surface mb-3 border border-border">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="font-mono text-[10px] font-medium text-muted uppercase tracking-widest">
                {product.category?.name}
              </p>
              <h3 className="font-serif text-xs font-normal text-ink group-hover:text-accent line-clamp-1">
                {product.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono uppercase tracking-widest text-muted">Loading Search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
