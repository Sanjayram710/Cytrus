'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Edit, Truck, Check, X, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Edit State
  const [editStatus, setEditStatus] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('');
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenEdit = (ord: any) => {
    setSelectedOrder(ord);
    setEditStatus(ord.orderStatus);
    setEditPaymentStatus(ord.paymentStatus);
    setCourierName(ord.courierName || '');
    setTrackingNumber(ord.trackingNumber || '');
    setNotes(ord.notes || '');
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: selectedOrder.id,
        orderStatus: editStatus,
        paymentStatus: editPaymentStatus,
        courierName,
        trackingNumber,
        notes,
      }),
    });

    setSelectedOrder(null);
    fetchOrders();
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-luxury-border pb-4">
        <h1 className="font-serif text-3xl font-bold text-luxury-black">Orders Management</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
          Fulfill Shipments, Assign Courier Tracking & Update Statuses
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-luxury-gold absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="SEARCH ORDER ID, CUSTOMER NAME, EMAIL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-luxury-border pl-10 pr-4 py-2 text-xs uppercase font-medium focus:outline-none focus:border-luxury-gold"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading Orders...</div>
      ) : (
        <div className="bg-white border border-luxury-border shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-luxury-border bg-luxury-cream text-luxury-black uppercase tracking-wider font-bold">
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Order Status</th>
                <th className="p-3">Courier AWB</th>
                <th className="p-3">Total</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-luxury-cream/40">
                  <td className="p-3 font-mono font-bold text-luxury-black">{ord.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-bold text-luxury-black">{ord.customerName}</p>
                    <p className="text-[10px] text-gray-500">{ord.customerEmail}</p>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${ord.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="bg-luxury-cream border border-luxury-gold text-[10px] font-bold px-2 py-0.5 uppercase">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-gray-600">
                    {ord.courierName ? `${ord.courierName} (${ord.trackingNumber || 'Pending'})` : 'Unassigned'}
                  </td>
                  <td className="p-3 font-extrabold">{formatPrice(ord.total)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenEdit(ord)}
                      className="bg-luxury-black text-luxury-cream px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-luxury-gold hover:text-black"
                    >
                      Update Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Order Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-luxury-cream border border-luxury-border max-w-lg w-full p-6 relative shadow-2xl">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-luxury-black">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-xl font-bold uppercase text-luxury-black mb-1">
              Update Order {selectedOrder.orderNumber}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">Customer: {selectedOrder.customerName}</p>

            <form onSubmit={handleUpdateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold mb-1">Order Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full border border-luxury-border p-2.5 bg-white font-bold focus:outline-none focus:border-luxury-gold"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING AT ATELIER</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED (RESTOCK STOCK)</option>
                  <option value="RETURNED">RETURNED</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Payment Status</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="w-full border border-luxury-border p-2.5 bg-white font-bold focus:outline-none focus:border-luxury-gold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold mb-1">Courier Partner</label>
                  <input
                    type="text"
                    placeholder="e.g. BlueDart Express"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full border border-luxury-border p-2.5 bg-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold mb-1">Tracking Number / AWB</label>
                  <input
                    type="text"
                    placeholder="e.g. BD99882231"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full border border-luxury-border p-2.5 bg-white font-mono focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  placeholder="Special instructions or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-luxury-border p-2.5 bg-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-luxury-black text-luxury-cream py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all"
              >
                Save Order Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
