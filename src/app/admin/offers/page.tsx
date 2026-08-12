'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  X,
  FileText,
  Lock,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalOffer, setReviewModalOffer] = useState<any | null>(null);
  const [overrideModalOffer, setOverrideModalOffer] = useState<any | null>(null);
  const [overrideReasonInput, setOverrideReasonInput] = useState('');

  // Form State for Offer Creation
  const [formData, setFormData] = useState({
    offerName: '',
    description: '',
    productId: '',
    claimedOriginalPrice: '',
    salePrice: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    maxUsage: '',
    minOrderValue: '',
  });

  const [validationOutput, setValidationOutput] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOffers();
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          if (data.products.length > 0) {
            setFormData((prev) => ({
              ...prev,
              productId: data.products[0].id,
              claimedOriginalPrice: data.products[0].comparePrice
                ? data.products[0].comparePrice.toString()
                : data.products[0].price.toString(),
              salePrice: data.products[0].price.toString(),
            }));
          }
        }
      });
  }, []);

  const fetchOffers = () => {
    setLoading(true);
    fetch('/api/admin/offers')
      .then((res) => res.json())
      .then((data) => {
        if (data.offers) setOffers(data.offers);
      })
      .finally(() => setLoading(false));
  };

  const handleProductSelectChange = (pid: string) => {
    const sel = products.find((p) => p.id === pid);
    setFormData((prev) => ({
      ...prev,
      productId: pid,
      claimedOriginalPrice: sel?.comparePrice ? sel.comparePrice.toString() : sel?.price?.toString() || '',
      salePrice: sel?.price?.toString() || '',
    }));
    setValidationOutput(null);
  };

  // Automatic Discount % Calculation
  const origPriceNum = parseFloat(formData.claimedOriginalPrice) || 0;
  const salePriceNum = parseFloat(formData.salePrice) || 0;
  const calculatedDiscount =
    origPriceNum > 0 && salePriceNum < origPriceNum
      ? Math.round(((origPriceNum - salePriceNum) / origPriceNum) * 100)
      : 0;

  const handleCreateSubmit = async (saveAsDraft = false) => {
    setSubmitting(true);
    setValidationOutput(null);

    try {
      const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          saveAsDraft,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.validation && data.validation.status === 'PENDING_REVIEW' && !saveAsDraft) {
          setValidationOutput(data.validation);
        } else {
          setCreateModalOpen(false);
          fetchOffers();
        }
      } else {
        alert(data.error || 'Failed to create offer.');
      }
    } catch (err: any) {
      alert(err.message || 'Server connection error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (offerId: string) => {
    await fetch(`/api/admin/offers/${offerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'APPROVE', notes: 'Approved after verification' }),
    });
    setReviewModalOffer(null);
    fetchOffers();
  };

  const handleReject = async (offerId: string) => {
    const notes = prompt('Enter rejection reason for audit log:');
    if (notes === null) return;
    await fetch(`/api/admin/offers/${offerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REJECT', notes: notes || 'Rejected by admin' }),
    });
    setReviewModalOffer(null);
    fetchOffers();
  };

  const handleOverrideSubmit = async () => {
    if (!overrideReasonInput.trim()) {
      alert('Administrative override requires an explicit reason.');
      return;
    }

    await fetch(`/api/admin/offers/${overrideModalOffer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'OVERRIDE', overrideReason: overrideReasonInput.trim() }),
    });

    setOverrideModalOffer(null);
    setOverrideReasonInput('');
    setReviewModalOffer(null);
    fetchOffers();
  };

  const filteredOffers = offers.filter((o) => {
    const matchesStatus = activeFilter === 'ALL' || o.status === activeFilter;
    const matchesSearch =
      o.offerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats Counters
  const totalOffers = offers.length;
  const activeCount = offers.filter((o) => o.status === 'ACTIVE').length;
  const pendingCount = offers.filter((o) => o.status === 'PENDING_REVIEW').length;
  const expiredCount = offers.filter((o) => o.status === 'EXPIRED' || o.status === 'REJECTED').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-luxury-gold/30 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-luxury-gold" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-luxury-gold font-bold">
              PRICE & OFFER INTEGRITY ENGINE
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-luxury-black mt-1">
            Offer Management & Price Verification
          </h1>
        </div>

        <button
          onClick={() => {
            setValidationOutput(null);
            setCreateModalOpen(true);
          }}
          className="mt-4 sm:mt-0 bg-luxury-black text-luxury-cream hover:bg-luxury-gold hover:text-luxury-black px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center space-x-2 border border-luxury-gold/40 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white border border-luxury-border p-5">
          <p className="font-mono text-[10px] uppercase font-bold text-gray-500">Total Promotional Offers</p>
          <p className="font-serif text-3xl font-bold text-luxury-black mt-2">{totalOffers}</p>
        </div>

        <div className="bg-white border border-green-300 p-5">
          <p className="font-mono text-[10px] uppercase font-bold text-green-700 flex items-center">
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active Store Offers
          </p>
          <p className="font-serif text-3xl font-bold text-green-700 mt-2">{activeCount}</p>
        </div>

        <div className="bg-amber-50 border border-amber-300 p-5">
          <p className="font-mono text-[10px] uppercase font-bold text-amber-800 flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Pending Review Warnings
          </p>
          <p className="font-serif text-3xl font-bold text-amber-800 mt-2">{pendingCount}</p>
        </div>

        <div className="bg-white border border-gray-300 p-5">
          <p className="font-mono text-[10px] uppercase font-bold text-gray-500 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" /> Expired / Rejected
          </p>
          <p className="font-serif text-3xl font-bold text-gray-600 mt-2">{expiredCount}</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-luxury-border p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2 font-mono text-xs font-bold uppercase">
          {['ALL', 'ACTIVE', 'PENDING_REVIEW', 'APPROVED', 'EXPIRED', 'REJECTED', 'DRAFT'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3 py-1.5 transition-all border ${
                activeFilter === st
                  ? 'bg-luxury-black text-luxury-cream border-luxury-black'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-luxury-gold'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search offer or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 pl-9 pr-3 py-2 font-mono text-xs focus:outline-none focus:border-luxury-gold text-luxury-black"
          />
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white border border-luxury-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs uppercase tracking-widest text-luxury-gold">
            Running Price Integrity Verification...
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs uppercase text-gray-500">
            No offer records match the selected filter.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-luxury-black text-luxury-cream font-mono text-[10px] uppercase tracking-widest border-b border-luxury-gold/30">
                <th className="p-4">Offer Name</th>
                <th className="p-4">Product</th>
                <th className="p-4 text-right">Claimed Orig.</th>
                <th className="p-4 text-right">Sale Price</th>
                <th className="p-4 text-center">Discount</th>
                <th className="p-4 text-center">Verification Status</th>
                <th className="p-4 text-center">Validity Window</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans text-xs">
              {filteredOffers.map((offer) => {
                const isPending = offer.status === 'PENDING_REVIEW';
                const isActive = offer.status === 'ACTIVE';

                return (
                  <tr key={offer.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-4 font-bold text-luxury-black">
                      {offer.offerName}
                      {offer.isOverride && (
                        <span className="block text-[9px] font-mono text-purple-700 uppercase font-bold mt-0.5">
                          🛡️ Admin Override Active
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-luxury-black">{offer.product?.name}</div>
                      <Link
                        href={`/admin/products/${offer.productId}/price-history`}
                        className="font-mono text-[9px] text-luxury-gold hover:underline uppercase"
                      >
                        View Price History →
                      </Link>
                    </td>

                    <td className="p-4 text-right font-mono font-semibold line-through text-gray-400">
                      {formatPrice(offer.claimedOriginalPrice)}
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-luxury-black">
                      {formatPrice(offer.salePrice)}
                    </td>

                    <td className="p-4 text-center font-mono font-bold text-amber-700">
                      <span className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                        {offer.discountPercentage}% OFF
                      </span>
                    </td>

                    <td className="p-4 text-center font-mono text-[10px] uppercase font-bold">
                      {isPending ? (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 inline-flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          <span>PENDING REVIEW</span>
                        </span>
                      ) : isActive ? (
                        <span className="bg-green-100 text-green-800 border border-green-300 px-2.5 py-1 inline-flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>ACTIVE</span>
                        </span>
                      ) : offer.status === 'APPROVED' ? (
                        <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1">
                          APPROVED
                        </span>
                      ) : offer.status === 'REJECTED' ? (
                        <span className="bg-red-100 text-red-800 border border-red-300 px-2 py-1">
                          REJECTED
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 border border-gray-300 px-2 py-1">
                          {offer.status}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center font-mono text-[10px] text-gray-600">
                      <div>{new Date(offer.startDate).toLocaleDateString('en-IN')}</div>
                      <div>to {new Date(offer.endDate).toLocaleDateString('en-IN')}</div>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setReviewModalOffer(offer)}
                        className="bg-luxury-black text-luxury-cream hover:bg-luxury-gold hover:text-luxury-black px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider font-bold transition-all border border-luxury-black"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE OFFER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />

          <div className="relative min-h-screen flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-luxury-gold max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="absolute top-4 right-4 text-luxury-black hover:text-luxury-gold"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-serif text-2xl font-bold text-luxury-black mb-2 border-b pb-3">
                Create & Validate Product Offer
              </h2>

              {/* WARNING ALERT BANNER IF PENDING_REVIEW DETECTED */}
              {validationOutput && validationOutput.status === 'PENDING_REVIEW' && (
                <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-400 font-sans text-xs space-y-3">
                  <div className="flex items-center space-x-2 text-amber-900 font-mono font-bold uppercase text-sm border-b border-amber-200 pb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span>PRICE VERIFICATION REQUIRED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div>
                      <span className="text-gray-500">Claimed Original Price:</span>
                      <div className="font-bold text-luxury-black">{formatPrice(origPriceNum)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Sale Price:</span>
                      <div className="font-bold text-luxury-black">{formatPrice(salePriceNum)}</div>
                    </div>
                  </div>

                  <p className="text-amber-900 leading-relaxed font-semibold">
                    {validationOutput.validationReason}
                  </p>

                  <div className="pt-2 border-t border-amber-200 flex justify-end space-x-3">
                    <button
                      onClick={() => handleCreateSubmit(true)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 font-mono text-xs uppercase font-bold"
                    >
                      Save as Draft
                    </button>
                    <button
                      onClick={() => {
                        setCreateModalOpen(false);
                        fetchOffers();
                      }}
                      className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 font-mono text-xs uppercase font-bold"
                    >
                      Submit for Review
                    </button>
                  </div>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateSubmit(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block font-mono text-xs uppercase font-bold mb-1 text-luxury-black">
                    Offer Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Atelier Capsule Drop - 25% Off"
                    value={formData.offerName}
                    onChange={(e) => setFormData({ ...formData, offerName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 p-2.5 font-sans text-xs focus:outline-none focus:border-luxury-gold text-luxury-black font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase font-bold mb-1 text-luxury-black">
                    Select Target Product
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => handleProductSelectChange(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 p-2.5 font-sans text-xs focus:outline-none focus:border-luxury-gold text-luxury-black font-semibold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Current: ₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1 text-luxury-black">
                      Claimed Orig. Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.claimedOriginalPrice}
                      onChange={(e) => setFormData({ ...formData, claimedOriginalPrice: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 p-2.5 font-mono text-xs focus:outline-none focus:border-luxury-gold text-luxury-black font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1 text-luxury-black">
                      Sale Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 p-2.5 font-mono text-xs focus:outline-none focus:border-luxury-gold text-luxury-black font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1 text-luxury-black">
                      Calculated Discount
                    </label>
                    <div className="w-full bg-gray-100 border border-gray-300 p-2.5 font-mono text-xs font-bold text-amber-700">
                      {calculatedDiscount > 0 ? `${calculatedDiscount}% OFF` : '0%'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1 text-luxury-black">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 p-2.5 font-mono text-xs focus:outline-none focus:border-luxury-gold text-luxury-black"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1 text-luxury-black">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 p-2.5 font-mono text-xs focus:outline-none focus:border-luxury-gold text-luxury-black"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t flex space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-luxury-black text-luxury-cream py-3 font-mono text-xs uppercase tracking-widest font-bold hover:bg-luxury-gold hover:text-luxury-black transition-colors"
                  >
                    {submitting ? 'Validating on Server...' : 'Validate & Publish Offer'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-6 border border-gray-300 font-mono text-xs uppercase font-bold hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT / REVIEW OFFER MODAL */}
      {reviewModalOffer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setReviewModalOffer(null)} />

          <div className="relative min-h-screen flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-luxury-gold max-w-xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6">
              <button
                onClick={() => setReviewModalOffer(null)}
                className="absolute top-4 right-4 text-luxury-black hover:text-luxury-gold"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b pb-4">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-luxury-gold block">
                  ADMIN REVIEW & AUDIT LOG
                </span>
                <h3 className="font-serif text-2xl font-bold text-luxury-black mt-1">
                  {reviewModalOffer.offerName}
                </h3>
              </div>

              <div className="bg-gray-50 border p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Product:</span>
                  <span className="font-bold text-luxury-black">{reviewModalOffer.product?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Claimed Original Price:</span>
                  <span className="font-bold text-luxury-black">{formatPrice(reviewModalOffer.claimedOriginalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Proposed Sale Price:</span>
                  <span className="font-bold text-luxury-black">{formatPrice(reviewModalOffer.salePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Calculated Discount:</span>
                  <span className="font-bold text-amber-700">{reviewModalOffer.discountPercentage}% OFF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Status:</span>
                  <span className="font-bold uppercase text-luxury-black">{reviewModalOffer.status}</span>
                </div>
              </div>

              {reviewModalOffer.validationReason && (
                <div className="bg-amber-50 border border-amber-300 p-4 text-xs font-sans text-amber-900 leading-relaxed">
                  <span className="font-mono font-bold uppercase block mb-1">Validation Audit Note:</span>
                  {reviewModalOffer.validationReason}
                </div>
              )}

              <div className="pt-2 flex flex-col space-y-2">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(reviewModalOffer.id)}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 font-mono text-xs uppercase font-bold tracking-wider"
                  >
                    Approve Offer
                  </button>

                  <button
                    onClick={() => handleReject(reviewModalOffer.id)}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-3 font-mono text-xs uppercase font-bold tracking-wider"
                  >
                    Reject Offer
                  </button>
                </div>

                <button
                  onClick={() => setOverrideModalOffer(reviewModalOffer)}
                  className="w-full bg-purple-900 hover:bg-purple-800 text-white py-2.5 font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center space-x-2"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-300" />
                  <span>Admin Override with Audit Reason</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERRIDE DIALOG MODAL */}
      {overrideModalOffer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOverrideModalOffer(null)} />

          <div className="relative min-h-screen flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-purple-800 max-w-md w-full p-6 relative shadow-2xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-luxury-black border-b pb-2">
                Administrative Price Override
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                You are forcing an administrative override for offer "{overrideModalOffer.offerName}".
                Please record an explicit business rationale for the audit log.
              </p>

              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Override Rationale (Required)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Legitimate pre-announcement price adjustment for luxury holiday capsule drop."
                  value={overrideReasonInput}
                  onChange={(e) => setOverrideReasonInput(e.target.value)}
                  className="w-full border border-gray-300 p-2 font-sans text-xs focus:outline-none focus:border-purple-800"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleOverrideSubmit}
                  className="flex-1 bg-purple-900 text-white py-2.5 font-mono text-xs uppercase font-bold hover:bg-purple-800"
                >
                  Confirm & Audit Override
                </button>
                <button
                  onClick={() => setOverrideModalOffer(null)}
                  className="px-4 border font-mono text-xs uppercase font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
