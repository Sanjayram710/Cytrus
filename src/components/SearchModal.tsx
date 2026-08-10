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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative min-h-screen flex items-start justify-center pt-16 px-4 pb-12 z-50">
        <div className="w-full max-w-3xl bg-luxury-cream border border-luxury-border shadow-2xl p-6 sm:p-8">
          {/* Header & Input */}
          <div className="flex items-center justify-between border-b-2 border-luxury-black pb-4">
            <Search className="w-6 h-6 text-luxury-gold mr-3" />
            <input
              type="text"
              placeholder="SEARCH EVENING GOWNS, SAREES, SILK SHIRTS..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-luxury-black focus:outline-none placeholder:text-gray-400 placeholder:font-sans placeholder:text-xs placeholder:tracking-widest"
            />
            <button onClick={onClose} className="p-2 text-luxury-black hover:text-luxury-gold">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Popular Categories suggestions */}
          {!query && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-4">
                POPULAR SEARCHES
              </p>
              <div className="flex flex-wrap gap-2">
                {['Emerald Gowns', 'Kanjeevaram Sarees', 'Silk Symphony', 'Velvet Blazers', 'Resort Linen', 'Black Eveningwear'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="bg-white border border-luxury-border px-4 py-2 text-xs uppercase tracking-wider text-luxury-black hover:border-luxury-gold hover:bg-luxury-beige transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Grid */}
          {loading && <p className="text-center py-8 text-xs uppercase tracking-widest text-luxury-gold">Searching Couture Catalog...</p>}

          {results.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-4">
                MATCHING PIECES ({results.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="group bg-white p-3 border border-luxury-border/60 hover:border-luxury-gold transition-all"
                  >
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-44 object-cover object-center mb-3"
                    />
                    <p className="font-serif text-xs font-bold text-luxury-black group-hover:text-luxury-gold line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs font-semibold text-luxury-black mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="inline-flex items-center text-xs uppercase font-bold tracking-widest text-luxury-black hover:text-luxury-gold"
                >
                  <span>View All Results for "{query}"</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
