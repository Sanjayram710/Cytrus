'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    setLoading(true);
    fetch('/api/admin/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .finally(() => setLoading(false));
  };

  const handleToggleApproval = async (reviewId: string, isApproved: boolean) => {
    await fetch('/api/admin/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, isApproved: !isApproved }),
    });
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-luxury-border pb-4">
        <h1 className="font-serif text-3xl font-bold text-luxury-black">Customer Reviews Moderation</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
          Approve, Reject & Moderate Client Testimonials
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading Reviews...</div>
      ) : (
        <div className="bg-white border border-luxury-border shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-luxury-border bg-luxury-cream text-luxury-black uppercase tracking-wider font-bold">
                <th className="p-3">Product</th>
                <th className="p-3">Reviewer</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Feedback Comment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-luxury-cream/40">
                  <td className="p-3 font-serif font-bold text-luxury-black">{rev.product?.name}</td>
                  <td className="p-3 font-semibold">{rev.userName}</td>
                  <td className="p-3">
                    <div className="flex text-luxury-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    {rev.title && <p className="font-bold text-luxury-black">{rev.title}</p>}
                    <p className="text-gray-600 line-clamp-2">{rev.comment}</p>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${rev.isApproved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {rev.isApproved ? 'Approved' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        rev.isApproved
                          ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {rev.isApproved ? 'Reject' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
