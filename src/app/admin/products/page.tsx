'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, X, Check, History } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import ImageUploadInput from '@/components/ImageUploadInput';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    comparePrice: '',
    sku: '',
    stock: '10',
    categoryId: '',
    collectionId: '',
    imageUrl: '',
    imageUrl2: '',
    customOffer: '',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchProducts();
    fetch('/api/admin/categories').then((r) => r.json()).then((d) => d.categories && setCategories(d.categories));
    fetch('/api/admin/collections').then((r) => r.json()).then((d) => d.collections && setCollections(d.collections));
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      comparePrice: '',
      sku: '',
      stock: '10',
      categoryId: categories[0]?.id || '',
      collectionId: collections[0]?.id || '',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000',
      imageUrl2: '',
      customOffer: 'FLAT ₹500 OFF (Code: TEE500)',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      status: 'ACTIVE',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: prod.price.toString(),
      comparePrice: prod.comparePrice ? prod.comparePrice.toString() : '',
      sku: prod.sku,
      stock: prod.stock.toString(),
      categoryId: prod.categoryId,
      collectionId: prod.collectionId || '',
      imageUrl: prod.images?.[0]?.url || '',
      imageUrl2: prod.images?.[1]?.url || '',
      customOffer: prod.customOffer || '',
      isFeatured: prod.isFeatured,
      isNewArrival: prod.isNewArrival,
      isBestSeller: prod.isBestSeller,
      status: prod.status,
    });
    setModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeCategoryId = formData.categoryId || (categories.length > 0 ? categories[0].id : '');
    if (!activeCategoryId) {
      alert('Category is required. Please select or create a Category first.');
      return;
    }
    const generatedSku = formData.sku.trim() || `TEE-${(formData.name || 'ITEM').replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() || 'ITEM'}-${Math.floor(100 + Math.random() * 900)}`;
    const payload = {
      ...formData,
      categoryId: activeCategoryId,
      sku: generatedSku,
      price: parseFloat(formData.price),
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
      stock: parseInt(formData.stock, 10),
      images: formData.imageUrl2 ? [formData.imageUrl, formData.imageUrl2] : [formData.imageUrl],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Emerald Green', hex: '#004B49' }, { name: 'Obsidian Black', hex: '#121212' }],
    };

    let res: Response;
    if (editingProduct) {
      res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    const data = await res.json();
    if (res.ok && data.success) {
      setModalOpen(false);
      fetchProducts();
    } else {
      alert(data.error || 'Failed to save product. Please check form fields.');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-luxury-border pb-4 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-black">Product Management</h1>
          <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
            Manage Couture Gowns, Sarees, SKUs & Inventory Stock
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-luxury-black text-luxury-cream px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-luxury-gold absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="SEARCH BY NAME, SKU, OR CATEGORY..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-luxury-border pl-10 pr-4 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-luxury-gold font-medium"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading Products...</div>
      ) : (
        <div className="bg-white border border-luxury-border shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-luxury-border bg-luxury-cream text-luxury-black uppercase tracking-wider font-bold">
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-luxury-cream/40">
                  <td className="p-3 flex items-center space-x-3">
                    <img
                      src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000'}
                      alt={prod.name}
                      className="w-10 h-14 object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000';
                      }}
                    />
                    <div>
                      <span className="font-serif font-bold text-luxury-black text-xs block">{prod.name}</span>
                      <span className="text-[10px] text-luxury-gold uppercase font-semibold">
                        {prod.isFeatured ? 'Featured ' : ''}{prod.isNewArrival ? '• New' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 uppercase font-semibold">{prod.category?.name}</td>
                  <td className="p-3 font-mono font-semibold">{prod.sku}</td>
                  <td className="p-3 font-bold">{formatPrice(prod.price)}</td>
                  <td className="p-3 font-bold">
                    <span className={prod.stock <= 5 ? 'text-red-600 font-extrabold' : 'text-green-700'}>
                      {prod.stock} Units
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="bg-luxury-cream text-luxury-black px-2 py-0.5 border border-luxury-gold text-[10px] font-bold uppercase">
                      {prod.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      href={`/admin/products/${prod.id}/price-history`}
                      className="p-1.5 inline-block text-luxury-gold hover:text-luxury-black"
                      title="View Price History"
                    >
                      <History className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="p-1.5 text-luxury-black hover:text-luxury-gold"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-luxury-cream border border-luxury-border max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-luxury-black">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-2xl font-bold uppercase text-luxury-black mb-6">
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-luxury-black">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold mb-1 text-luxury-black">Product Name</label>
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
                  <label className="block uppercase font-bold mb-1 text-luxury-black">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white text-luxury-black focus:outline-none focus:border-luxury-gold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold mb-1 text-luxury-black">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-luxury-border p-2.5 bg-white text-luxury-black focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ImageUploadInput
                  label="Primary Product Image"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                />

                <ImageUploadInput
                  label="Secondary Hover Image (Optional)"
                  value={formData.imageUrl2}
                  onChange={(url) => setFormData({ ...formData, imageUrl2: url })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase font-bold mb-1 text-luxury-black">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white text-luxury-black focus:outline-none focus:border-luxury-gold font-bold"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold mb-1 text-luxury-black">Original Price (INR)</label>
                  <input
                    type="number"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white text-luxury-black focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold mb-1 text-luxury-black">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white text-luxury-black focus:outline-none focus:border-luxury-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase font-bold mb-1 text-luxury-black">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                      setFormData({ ...formData, stock: val.toString() });
                    }}
                    className="w-full border border-luxury-border p-2.5 bg-white text-luxury-black focus:outline-none focus:border-luxury-gold font-bold"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold mb-1 text-luxury-black">Category</label>
                  <select
                    value={formData.categoryId || (categories.length > 0 ? categories[0].id : '')}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white text-luxury-black focus:outline-none focus:border-luxury-gold"
                  >
                    {categories.length === 0 && <option value="">No categories available</option>}
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block uppercase font-bold mb-1 text-luxury-black">Collection</label>
                  <select
                    value={formData.collectionId}
                    onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                    className="w-full border border-luxury-border p-2.5 bg-white text-luxury-black focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="">None</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Product Offer / Promo Badge */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block uppercase font-bold text-luxury-black text-xs">
                    ⚡ CUSTOM PRODUCT OFFER / PROMO BADGE (OPTIONAL)
                  </label>
                  <span className="font-mono text-[10px] text-gray-500 uppercase">Displayed in Offers Modal & Badge</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. FLAT ₹500 INSTANT DISCOUNT or BUY 2 FOR ₹1,599"
                  value={formData.customOffer}
                  onChange={(e) => setFormData({ ...formData, customOffer: e.target.value })}
                  className="w-full border border-luxury-border p-2.5 bg-white text-luxury-black focus:outline-none focus:border-luxury-gold font-mono text-xs"
                />
                <div className="flex flex-wrap gap-1.5 mt-2 font-mono text-[10px]">
                  <span className="text-gray-400 self-center uppercase font-bold">Quick Presets:</span>
                  {[
                    'FLAT ₹500 INSTANT DISCOUNT',
                    'BUY 2 FOR ₹1,599 BUNDLE',
                    'FREE CYTRUS TOTE BAG GIFT',
                    'EXTRA 15% UPI CASHBACK',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, customOffer: preset })}
                      className="bg-gray-100 border border-gray-300 hover:border-black px-2 py-0.5 text-gray-700 hover:text-black transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-6 pt-2">
                <label className="flex items-center space-x-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center space-x-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center space-x-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-luxury-black text-luxury-cream py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all mt-4"
              >
                {editingProduct ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
