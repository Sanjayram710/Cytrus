'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Edit, Plus, Trash2, X, Eye, EyeOff } from 'lucide-react';

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    mobileImage: '',
    buttonText: 'EXPLORE COLLECTION',
    buttonUrl: '/shop',
    displayOrder: '1',
    isActive: true,
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = () => {
    setLoading(true);
    fetch('/api/admin/slides')
      .then((res) => res.json())
      .then((data) => {
        if (data.slides) setSlides(data.slides);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenEdit = (slide: any) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      image: slide.image,
      mobileImage: slide.mobileImage || slide.image,
      buttonText: slide.buttonText || 'EXPLORE COLLECTION',
      buttonUrl: slide.buttonUrl || '/shop',
      displayOrder: slide.displayOrder.toString(),
      isActive: slide.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      displayOrder: parseInt(formData.displayOrder, 10),
    };

    if (editingSlide) {
      await fetch(`/api/admin/slides/${editingSlide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/admin/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setModalOpen(false);
    fetchSlides();
  };

  const toggleActiveStatus = async (slide: any) => {
    await fetch(`/api/admin/slides/${slide.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...slide, isActive: !slide.isActive }),
    });
    fetchSlides();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-luxury-border pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-black">Homepage Hero Slides (5)</h1>
          <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
            Database-Driven Showcase Slider Management
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSlide(null);
            setFormData({
              title: '',
              subtitle: '',
              description: '',
              image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920',
              mobileImage: '',
              buttonText: 'EXPLORE COLLECTION',
              buttonUrl: '/shop',
              displayOrder: (slides.length + 1).toString(),
              isActive: true,
            });
            setModalOpen(true);
          }}
          className="bg-luxury-black text-luxury-cream px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading Slides...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white border border-luxury-border p-6 shadow-subtle flex flex-col md:flex-row gap-6 items-center">
              <img src={slide.image} alt={slide.title} className="w-full md:w-64 h-36 object-cover bg-luxury-black border" />

              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-luxury-gold text-luxury-black font-bold text-[10px] uppercase px-2 py-0.5">
                    Order #{slide.displayOrder}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${slide.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'}`}>
                    {slide.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs font-bold text-luxury-gold tracking-widest uppercase">{slide.subtitle}</p>
                <h3 className="font-serif text-xl font-bold text-luxury-black">{slide.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{slide.description}</p>
                <p className="text-[11px] font-mono text-gray-400">Button: "{slide.buttonText}" → {slide.buttonUrl}</p>
              </div>

              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                <button
                  onClick={() => handleOpenEdit(slide)}
                  className="bg-luxury-black text-luxury-cream p-2.5 text-xs font-bold uppercase hover:bg-luxury-gold hover:text-black flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Slide</span>
                </button>
                <button
                  onClick={() => toggleActiveStatus(slide)}
                  className="border border-luxury-border p-2.5 text-xs font-bold uppercase hover:border-luxury-gold flex items-center space-x-1"
                >
                  {slide.isActive ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4 text-green-600" />}
                  <span>{slide.isActive ? 'Hide' : 'Show'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-luxury-cream border border-luxury-border max-w-xl w-full p-6 relative shadow-2xl">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-luxury-black">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-2xl font-bold uppercase text-luxury-black mb-4">
              {editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold mb-1">Slide Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-luxury-border p-2.5 bg-white font-serif font-bold text-sm focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Subtitle / Badge Text</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full border border-luxury-border p-2.5 bg-white focus:outline-none focus:border-luxury-gold"
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
                <label className="block uppercase font-bold mb-1">Desktop Image URL (1920x1080)</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border border-luxury-border p-2.5 bg-white font-mono focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold mb-1">Button Text</label>
                  <input
                    type="text"
                    required
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold mb-1">Button URL</label>
                  <input
                    type="text"
                    required
                    value={formData.buttonUrl}
                    onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white font-mono focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold mb-1">Display Order (1-5)</label>
                  <input
                    type="number"
                    required
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white font-bold focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>Active Display</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-luxury-black text-luxury-cream py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all mt-4"
              >
                Save Hero Slide
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
