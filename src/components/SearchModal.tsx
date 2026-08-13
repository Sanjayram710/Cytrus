'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/products?q=${encodeURIComponent(query)}&limit=6`)
        .then((res) => res.json())
        .then((data) => {
          if (data.products) setResults(data.products);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-ink/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative min-h-screen flex items-start justify-center pt-16 px-4 pb-12 z-50">
        <div className="w-full max-w-3xl bg-surface border border-border p-6 sm:p-8">
          {/* Header & Input */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <Search className="w-5 h-5 text-accent mr-3" />
            <input
              type="text"
              placeholder="SEARCH OVERSIZED TEES, GRAPHICS, ACID WASH..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent font-serif text-lg sm:text-xl font-normal uppercase tracking-wider text-ink focus:outline-none placeholder:text-muted placeholder:font-mono placeholder:text-xs placeholder:tracking-widest"
            />
            <button onClick={onClose} className="p-2 text-ink hover:text-accent">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Popular Categories suggestions */}
          {!query && (
            <div className="mt-8">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted mb-4">
                POPULAR SEARCHES
              </p>
              <div className="flex flex-wrap gap-2">
                {['Oversized Tee', 'Graphic Tee', 'Vintage Wash', 'French Terry', 'Acid Wash', 'Heavyweight Cut'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="bg-canvas border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink hover:border-accent transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Grid */}
          {loading && <p className="text-center py-8 font-mono text-xs uppercase tracking-widest text-muted">Searching CYTRUS Catalog...</p>}

          {results.length > 0 && (
            <div className="mt-8">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted mb-4">
                MATCHING DROPS ({results.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="group relative bg-canvas p-3 border border-border hover:border-accent transition-all"
                  >
                    {/* Signature Swing-Tag Detail */}
                    <div className="absolute top-0 right-2 z-20 flex flex-col items-center pointer-events-none">
                      <div className="w-[1px] h-3 bg-border group-hover:bg-accent transition-colors" />
                      <div className="swing-tag px-2 py-0.5 text-center group-hover:-translate-y-0.5 group-hover:-rotate-2 transition-transform duration-300">
                        <span className="font-mono text-[9px] font-semibold tracking-wider text-accent block">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>

                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-44 object-cover object-center mb-3 bg-surface border border-border"
                    />
                    <p className="font-serif text-xs font-normal text-ink group-hover:text-accent line-clamp-1">
                      {product.name}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-accent hover:text-ink font-semibold"
                >
                  <span>View All Results for &quot;{query}&quot;</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
