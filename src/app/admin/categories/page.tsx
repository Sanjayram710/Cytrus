'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isFeatured: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setModalOpen(false);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-luxury-border pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-black">Category Management</h1>
          <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
            Manage Fashion Categories & Banner Images
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: '',
              slug: '',
              description: '',
              image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
              isFeatured: true,
            });
            setModalOpen(true);
          }}
          className="bg-luxury-black text-luxury-cream px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading Categories...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-luxury-border p-4 shadow-subtle flex flex-col justify-between">
              <div>
                <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover mb-3" />
                <h3 className="font-serif text-lg font-bold text-luxury-black">{cat.name}</h3>
                <p className="text-xs text-gray-500 font-mono">/category/{cat.slug}</p>
                <p className="text-xs text-gray-600 line-clamp-2 mt-2">{cat.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-luxury-border flex justify-between items-center text-xs">
                <span className="font-bold text-luxury-gold uppercase">{cat._count?.products || 0} Products</span>
                <span className="bg-luxury-cream px-2 py-0.5 text-[10px] font-bold uppercase">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-luxury-cream border border-luxury-border max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-luxury-black">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-2xl font-bold uppercase text-luxury-black mb-4">Add New Category</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    })
                  }
                  className="w-full border border-luxury-border p-2.5 bg-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full border border-luxury-border p-2.5 bg-white font-mono focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-luxury-border p-2.5 bg-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border border-luxury-border p-2.5 bg-white font-mono focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-luxury-black text-luxury-cream py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
