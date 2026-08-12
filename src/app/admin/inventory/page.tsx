'use client';

import React, { useState, useEffect } from 'react';
import { Warehouse, Save, AlertTriangle, Check } from 'lucide-react';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedIds, setUpdatedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    setLoading(true);
    fetch('/api/admin/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (data.inventory) setInventory(data.inventory);
      })
      .finally(() => setLoading(false));
  };

  const handleStockChange = (id: string, value: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: value } : item))
    );
  };

  const handleSaveStock = async (item: any) => {
    await fetch('/api/admin/inventory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: item.productId,
        variantId: item.variantId,
        stock: item.stock,
      }),
    });

    setUpdatedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setUpdatedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-luxury-border pb-4">
        <h1 className="font-serif text-3xl font-bold text-luxury-black">Inventory Stock Control</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold mt-1">
          Real-Time Variant SKU Stock Levels & Quick Inline Updates
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading Inventory...</div>
      ) : (
        <div className="bg-white border border-luxury-border shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-luxury-border bg-luxury-cream text-luxury-black uppercase tracking-wider font-bold">
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-luxury-cream/40">
                  <td className="p-3 flex items-center space-x-3">
                    <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="w-10 h-14 object-cover border" />
                    <div>
                      <span className="font-serif font-bold text-luxury-black text-xs block">{item.product?.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">SKU: {item.product?.sku}</span>
                    </div>
                  </td>
                  <td className="p-3 uppercase font-semibold">{item.product?.category?.name}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      value={item.stock}
                      onChange={(e) => handleStockChange(item.id, Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-20 border border-luxury-border p-1.5 font-bold text-center bg-white focus:outline-none focus:border-luxury-gold"
                    />
                  </td>
                  <td className="p-3 font-mono text-gray-500">{item.lowStockThreshold || 5} Units</td>
                  <td className="p-3">
                    {item.stock <= (item.lowStockThreshold || 5) ? (
                      <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 uppercase flex items-center w-fit">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 uppercase w-fit block">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleSaveStock(item)}
                      className="bg-luxury-black text-luxury-cream px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-luxury-gold hover:text-black inline-flex items-center space-x-1"
                    >
                      {updatedIds[item.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Stock</span>
                        </>
                      )}
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
