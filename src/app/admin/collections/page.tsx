'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import ImageUploadInput from '@/components/ImageUploadInput';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isFeatured: true,
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = () => {
    setLoading(true);
    fetch('/api/admin/collections')
      .then((res) => res.json())
      .then((data) => {
        if (data.collections) setCollections(data.collections);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenCreateModal = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (col: any) => {
    setEditingCollection(col);
    setFormData({
      name: col.name || '',
      slug: col.slug || '',
      description: col.description || '',
      image: col.image || '',
      isFeatured: col.isFeatured ?? true,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the collection "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCollections();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete collection');
      }
    } catch (err: any) {
      alert('Error deleting collection');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = Boolean(editingCollection);
    const url = isEdit ? `/api/admin/collections/${editingCollection.id}` : '/api/admin/collections';
    const method = isEdit ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setModalOpen(false);
    fetchCollections();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-luxury-border pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-black">Editorial Collections</h1>
          <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
            Manage Curated Capsules & Runway Lookbooks
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-luxury-black text-luxury-cream px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading Collections...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <div key={col.id} className="bg-white border border-luxury-border p-4 shadow-subtle flex flex-col justify-between group">
              <div>
                <div className="relative h-40 overflow-hidden mb-3 bg-luxury-cream">
                  <img
                    src={col.image || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1200'}
                    alt={col.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1200';
                    }}
                  />
                </div>
                <h3 className="font-serif text-lg font-bold text-luxury-black">{col.name}</h3>
                <p className="text-xs text-gray-500 font-mono">/collection/{col.slug}</p>
                <p className="text-xs text-gray-600 line-clamp-2 mt-2">{col.description || 'No description added.'}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-luxury-border flex justify-between items-center text-xs">
                <span className="font-bold text-luxury-gold uppercase">{col._count?.products || 0} Products</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(col)}
                    className="bg-luxury-black text-luxury-cream hover:bg-luxury-gold hover:text-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(col.id, col.name)}
                    className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors"
                    title="Remove Collection"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
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
            <h2 className="font-serif text-2xl font-bold uppercase text-luxury-black mb-4">
              {editingCollection ? 'Edit Collection' : 'Add New Collection'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold mb-1">Collection Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingCollection ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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

              <ImageUploadInput
                label="Editorial Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />

              <button
                type="submit"
                className="w-full bg-luxury-black text-luxury-cream py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all"
              >
                {editingCollection ? 'Update Collection' : 'Save Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
