'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, Check, CreditCard, Truck, Tag, AlertTriangle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, couponCode, couponDiscount, clearCart, getCartSubtotal } = useCartStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'COD', // COD or RAZORPAY
  });

  const subtotal = getCartSubtotal();
  const tax = Math.round(Math.max(0, subtotal - couponDiscount) * 0.12);
  const shipping = subtotal >= 10000 || subtotal === 0 ? 0 : 500;
  const total = Math.max(0, subtotal - couponDiscount + tax + shipping);

  useEffect(() => {
    // Populate user details if logged in
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFormData((prev) => ({
            ...prev,
            customerName: data.user.name || '',
            customerEmail: data.user.email || '',
            fullName: data.user.name || '',
          }));
        }
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-surface border border-border">
        <h2 className="font-serif text-2xl font-normal text-ink mb-2">Your Bag is Empty</h2>
        <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">Please add items to your bag before proceeding to checkout.</p>
        <Link href="/shop" className="bg-accent text-canvas px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest hover:bg-ink transition-colors border border-accent">
          Browse Drops
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create order on server (recalculating pricing & stock)
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName || formData.fullName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone || formData.phone,
          address: {
            fullName: formData.fullName,
            phone: formData.phone || formData.customerPhone,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          })),
          paymentMethod: formData.paymentMethod,
          couponCode: couponCode || undefined,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to place order');
      }

      // If Payment Method is COD
      if (formData.paymentMethod === 'COD') {
        clearCart();
        router.push(`/order-confirmation/${orderData.orderId}`);
        return;
      }

      // If Payment Method is RAZORPAY
      if (formData.paymentMethod === 'RAZORPAY') {
        const rzpRes = await fetch('/api/payments/razorpay/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: orderData.orderId }),
        });
        const rzpData = await rzpRes.json();

        if (!rzpRes.ok) throw new Error(rzpData.error || 'Razorpay order creation failed');

        // Handle Razorpay Payment flow (or test mode simulated verification)
        const options = {
          key: rzpData.key,
          amount: rzpData.razorpayOrder.amount,
          currency: 'INR',
          name: 'CYTRUS',
          description: `Order ${orderData.orderNumber}`,
          order_id: rzpData.razorpayOrder.id,
          handler: async function (response: any) {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id || rzpData.razorpayOrder.id,
                razorpayPaymentId: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
                razorpaySignature: response.razorpay_signature || 'mock_valid_signature',
              }),
            });

            if (verifyRes.ok) {
              clearCart();
              router.push(`/order-confirmation/${orderData.orderId}`);
            } else {
              setErrorMsg('Payment signature verification failed.');
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.customerEmail,
            contact: formData.phone,
          },
          theme: {
            color: '#6B5B45',
          },
        };

        if (typeof window !== 'undefined' && (window as any).Razorpay) {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          // Fallback test mode simulation if Razorpay script is unavailable
          const verifyRes = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderData.orderId,
              razorpayOrderId: rzpData.razorpayOrder.id,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              razorpaySignature: 'mock_valid_signature',
            }),
          });
          if (verifyRes.ok) {
            clearCart();
            router.push(`/order-confirmation/${orderData.orderId}`);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      {/* Checkout Step Tracker Bar */}
      <div className="border-b border-border pb-8 mb-10 text-center">
        <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
          SECURE CHECKOUT
        </span>
        <h1 className="font-serif text-3xl font-normal tracking-tight text-ink mt-1">
          CYTRUS Order Placement
        </h1>

        <div className="flex justify-center items-center space-x-6 mt-6">
          <div className={`flex items-center space-x-2 font-mono text-xs uppercase tracking-widest font-semibold ${step >= 1 ? 'text-ink' : 'text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-ink text-canvas' : 'bg-surface border border-border text-muted'}`}>1</span>
            <span>Customer Info</span>
          </div>
          <span className="text-border">—</span>
          <div className={`flex items-center space-x-2 font-mono text-xs uppercase tracking-widest font-semibold ${step >= 2 ? 'text-ink' : 'text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-ink text-canvas' : 'bg-surface border border-border text-muted'}`}>2</span>
            <span>Shipping Address</span>
          </div>
          <span className="text-border">—</span>
          <div className={`flex items-center space-x-2 font-mono text-xs uppercase tracking-widest font-semibold ${step >= 3 ? 'text-ink' : 'text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-ink text-canvas' : 'bg-surface border border-border text-muted'}`}>3</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-surface border border-border p-4 mb-8 font-mono text-xs text-accent flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Step Forms (7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-border p-6 sm:p-8 space-y-8">
          {/* STEP 1: Customer Contact */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-normal uppercase tracking-wider text-ink border-b border-border pb-3">
                1. Customer Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Full Name</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aarya Sharma"
                    className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Email Address</label>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="e.g. aarya@example.com"
                    className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Phone Number</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!formData.customerName || !formData.customerEmail) {
                    setErrorMsg('Please fill in your name and email address.');
                    return;
                  }
                  setErrorMsg('');
                  setStep(2);
                }}
                className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-all border border-accent"
              >
                Continue to Shipping Address →
              </button>
            </div>
          )}

          {/* STEP 2: Shipping Address */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h2 className="font-serif text-xl font-normal uppercase tracking-wider text-ink">
                  2. Shipping Address
                </h2>
                <button onClick={() => setStep(1)} className="font-mono text-xs uppercase text-accent hover:underline">
                  Edit Contact
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Recipient Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aarya Sharma"
                    className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="45 Indiranagar, 12th Main Road"
                    className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Bengaluru"
                      className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Karnataka"
                      className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Pincode</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="560038"
                      className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none text-ink"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!formData.fullName || !formData.street || !formData.city) {
                    setErrorMsg('Please complete all required shipping fields.');
                    return;
                  }
                  setErrorMsg('');
                  setStep(3);
                }}
                className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-all border border-accent"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* STEP 3: Payment Choice */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h2 className="font-serif text-xl font-normal uppercase tracking-wider text-ink">
                  3. Select Payment Method
                </h2>
                <button onClick={() => setStep(2)} className="font-mono text-xs uppercase text-accent hover:underline">
                  Edit Address
                </button>
              </div>

              <div className="space-y-4">
                {/* Razorpay Option */}
                <label className={`block border p-4 cursor-pointer transition-all ${formData.paymentMethod === 'RAZORPAY' ? 'border-accent bg-canvas' : 'border-border bg-surface'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={formData.paymentMethod === 'RAZORPAY'}
                        onChange={handleInputChange}
                        className="text-accent focus:ring-accent"
                      />
                      <CreditCard className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-mono font-semibold text-xs uppercase tracking-wider text-ink">Razorpay Online Payment</p>
                        <p className="font-mono text-[10px] text-muted">Credit / Debit Cards, UPI, NetBanking, Wallets</p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label className={`block border p-4 cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-accent bg-canvas' : 'border-border bg-surface'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={handleInputChange}
                        className="text-accent focus:ring-accent"
                      />
                      <Truck className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-mono font-semibold text-xs uppercase tracking-wider text-ink">Cash on Delivery (COD)</p>
                        <p className="font-mono text-[10px] text-muted">Pay upon doorstep delivery</p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-all border border-accent"
              >
                {loading ? 'Processing Drop Order...' : `COMPLETE ORDER (${formatPrice(total)})`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-border p-6 space-y-6 h-fit">
          <h3 className="font-serif text-base font-normal uppercase tracking-wider border-b border-border pb-3 text-ink">
            Bag Items ({items.length})
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex space-x-4 items-center">
                <img src={item.productImage} alt={item.productName} className="w-14 h-18 object-cover bg-canvas border border-border" />
                <div className="flex-1 text-xs">
                  <h4 className="font-serif font-normal text-ink line-clamp-1">{item.productName}</h4>
                  <p className="font-mono text-muted text-[10px] uppercase">Qty: {item.quantity} | {item.size} / {item.color}</p>
                  <p className="font-mono font-semibold text-accent mt-1">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 font-mono text-xs text-muted pt-4 border-t border-border">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-accent font-semibold">
                <span>Coupon Savings ({couponCode})</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Tax (12% GST)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Shipping</span>
              <span>{shipping === 0 ? <span className="text-ink font-semibold">FREE</span> : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-serif text-lg font-normal text-ink pt-3 border-t border-border">
              <span>Total Payable</span>
              <span className="font-mono font-semibold text-accent">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
