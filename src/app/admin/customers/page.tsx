'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => {
        // Sample customers or fetched customers
        fetch('/api/admin/orders')
          .then((r) => r.json())
          .then((oData) => {
            if (oData.orders) {
              const custs = oData.orders.map((o: any) => ({
                id: o.id,
                name: o.customerName,
                email: o.customerEmail,
                phone: o.customerPhone,
                orderCount: 1,
                totalSpent: o.total,
                createdAt: o.createdAt,
              }));
              setCustomers(custs);
            }
          });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-luxury-border pb-4">
        <h1 className="font-serif text-3xl font-bold text-luxury-black">Customer Management</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
          Registered Clients Profile Database & Order History
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading Customers...</div>
      ) : (
        <div className="bg-white border border-luxury-border shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-luxury-border bg-luxury-cream text-luxury-black uppercase tracking-wider font-bold">
                <th className="p-3">Client Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Orders Count</th>
                <th className="p-3">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {customers.map((c, idx) => (
                <tr key={c.id || idx} className="hover:bg-luxury-cream/40">
                  <td className="p-3 font-serif font-bold text-luxury-black">{c.name}</td>
                  <td className="p-3 font-mono text-gray-600">{c.email}</td>
                  <td className="p-3 font-mono text-gray-600">{c.phone || '+91 98765 43210'}</td>
                  <td className="p-3 font-bold text-luxury-gold">{c.orderCount || 1} Order(s)</td>
                  <td className="p-3 text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
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
