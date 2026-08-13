'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
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
      fetch(`/api/products?q=${encodeURIComponent(query)}&limit=4`)
        .then((res) => res.json())
        .then((data) => {
          if (data.products) setResults(data.products);
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const trendingTags = ['Ranveer Singh', 'Oversized Boxy', 'Acid Wash', 'Zendaya Drop', 'Heavyweight French Terry'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 text-charcoal">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl bg-white border border-border overflow-hidden z-10 shadow-2xl rounded-2xl text-charcoal"
          >
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-border p-4 bg-surface-tint text-charcoal">
              <Search className="w-5 h-5 text-royal mr-3 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search collection drops, silhouette cuts, celebrity icons..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-sans text-charcoal placeholder:text-muted focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-muted hover:text-charcoal mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-muted hover:text-charcoal rounded-md bg-white border border-border"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            {/* Results / Suggestions Container */}
            <div className="p-6 max-h-[60vh] overflow-y-auto text-charcoal">
              {/* Trending Quick Search Chips */}
              {!query && (
                <div className="space-y-3 text-charcoal">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider text-muted font-bold">
                    <TrendingUp className="w-3.5 h-3.5 text-royal" />
                    <span>Popular Searches in The Vault</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="bg-surface-tint hover:bg-royal hover:text-white border border-border px-3 py-1.5 text-xs font-mono transition-colors rounded-md text-charcoal font-medium"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Live Query Results */}
              {query && (
                <div className="text-charcoal">
                  {loading ? (
                    <div className="py-8 text-center font-mono text-xs uppercase tracking-widest text-muted">
                      Searching Collaboration Ledger...
                    </div>
                  ) : results.length === 0 ? (
                    <div className="py-8 text-center space-y-2 text-charcoal">
                      <p className="font-serif text-base text-charcoal">No direct drop match for "{query}"</p>
                      <p className="font-mono text-xs text-muted">Press enter to run a complete vault archive search.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-charcoal">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">
                        Top Drop Matches ({results.length})
                      </span>
                      <div className="divide-y divide-border">
                        {results.map((prod) => (
                          <Link
                            key={prod.id}
                            href={`/product/${prod.slug}`}
                            onClick={onClose}
                            className="py-3 flex items-center space-x-4 hover:bg-surface-tint px-2 transition-colors rounded-lg group text-charcoal"
                          >
                            <img
                              src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000'}
                              alt={prod.name}
                              className="w-12 h-14 object-cover rounded bg-slate-100 border border-border"
                            />
                            <div className="flex-1 text-charcoal">
                              <p className="font-mono text-[9px] uppercase tracking-wider text-muted">
                                {prod.category?.name || 'EDITION'}
                              </p>
                              <h4 className="font-serif text-sm font-normal text-charcoal group-hover:text-royal transition-colors line-clamp-1">
                                {prod.name}
                              </h4>
                              <p className="font-mono text-xs font-bold text-royal mt-0.5">
                                {formatPrice(prod.price)}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted group-hover:text-charcoal group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>

                      <button
                        onClick={handleSearchSubmit}
                        className="w-full mt-2 bg-royal hover:bg-royal-dark text-white py-2.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors flex items-center justify-center space-x-2 rounded-md shadow-sm"
                      >
                        <span>View All Results for "{query}"</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
