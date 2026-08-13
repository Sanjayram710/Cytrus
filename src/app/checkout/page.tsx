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
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border border-border rounded-2xl shadow-subtle text-charcoal">
        <h2 className="font-serif text-2xl font-normal text-charcoal mb-2">Your Bag is Empty</h2>
        <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">Please add items to your bag before proceeding to checkout.</p>
        <Link href="/shop" className="bg-royal hover:bg-royal-dark text-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors rounded-md shadow-sm">
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
          couponCode,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place drop reservation order');
      }

      const order = data.order;

      if (formData.paymentMethod === 'RAZORPAY') {
        const razorpayRes = await fetch('/api/payments/razorpay/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        });
        const razorpayData = await razorpayRes.json();

        if (!razorpayRes.ok) {
          throw new Error(razorpayData.error || 'Failed to initiate Razorpay transaction');
        }

        const loadScript = (src: string) => {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const resScript = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!resScript) {
          await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.id,
              razorpayOrderId: razorpayData.orderId,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              razorpaySignature: 'mock_valid_signature',
            }),
          });
          clearCart();
          router.push(`/order-confirmation/${order.id}`);
          return;
        }

        const options = {
          key: razorpayData.key,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          name: 'CELEBRITEE.in',
          description: `VIP Drop Reservation #${order.orderNumber}`,
          order_id: razorpayData.orderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/payments/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: order.id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyRes.ok) {
                clearCart();
                router.push(`/order-confirmation/${order.id}`);
              } else {
                setErrorMsg(verifyData.error || 'Payment signature verification failed');
              }
            } catch (err: any) {
              setErrorMsg('Error processing payment confirmation');
            }
          },
          prefill: {
            name: formData.fullName || formData.customerName,
            email: formData.customerEmail,
            contact: formData.phone || formData.customerPhone,
          },
          theme: {
            color: '#1E5AE6',
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        clearCart();
        router.push(`/order-confirmation/${order.id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while creating your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white text-charcoal">
      {/* Stepper */}
      <div className="border-b border-border pb-8 mb-10 text-charcoal">
        <div className="flex justify-between items-center max-w-xl mx-auto">
          <div className={`flex items-center space-x-2 font-mono text-xs uppercase tracking-widest font-bold ${step >= 1 ? 'text-charcoal' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-royal text-white shadow-sm' : 'bg-surface-tint border border-border text-muted'}`}>1</span>
            <span>Contact</span>
          </div>
          <div className="w-12 h-[1px] bg-border" />
          <div className={`flex items-center space-x-2 font-mono text-xs uppercase tracking-widest font-bold ${step >= 2 ? 'text-charcoal' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-royal text-white shadow-sm' : 'bg-surface-tint border border-border text-muted'}`}>2</span>
            <span>Shipping</span>
          </div>
          <div className="w-12 h-[1px] bg-border" />
          <div className={`flex items-center space-x-2 font-mono text-xs uppercase tracking-widest font-bold ${step >= 3 ? 'text-charcoal' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-royal text-white shadow-sm' : 'bg-surface-tint border border-border text-muted'}`}>3</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 p-4 mb-8 font-mono text-xs text-rose-700 flex items-center rounded-xl font-bold">
          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-charcoal">
        {/* Step Forms (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-border p-6 sm:p-8 space-y-8 rounded-2xl shadow-subtle text-charcoal">
          {/* STEP 1: Customer Contact */}
          {step === 1 && (
            <div className="space-y-6 text-charcoal">
              <h2 className="font-serif text-xl font-normal uppercase tracking-wider text-charcoal border-b border-border pb-3">
                1. Customer Details
              </h2>
              <div className="space-y-4 text-charcoal">
                <div>
                  <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Full Name</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aarya Sharma"
                    className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Email Address</label>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="e.g. aarya@example.com"
                    className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Phone Number</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
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
                className="w-full bg-royal hover:bg-royal-dark text-white py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all rounded-md shadow-luxury"
              >
                Continue to Shipping Address →
              </button>
            </div>
          )}

          {/* STEP 2: Shipping Address */}
          {step === 2 && (
            <div className="space-y-6 text-charcoal">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h2 className="font-serif text-xl font-normal uppercase tracking-wider text-charcoal">
                  2. Shipping Address
                </h2>
                <button onClick={() => setStep(1)} className="font-mono text-xs uppercase text-royal hover:underline font-bold">
                  Edit Contact
                </button>
              </div>

              <div className="space-y-4 text-charcoal">
                <div>
                  <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Recipient Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aarya Sharma"
                    className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="45 Indiranagar, 12th Main Road"
                    className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Bengaluru"
                      className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Karnataka"
                      className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Pincode</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="560038"
                      className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none text-charcoal rounded-md"
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
                className="w-full bg-royal hover:bg-royal-dark text-white py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all rounded-md shadow-luxury"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* STEP 3: Payment Choice */}
          {step === 3 && (
            <div className="space-y-6 text-charcoal">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h2 className="font-serif text-xl font-normal uppercase tracking-wider text-charcoal">
                  3. Select Payment Method
                </h2>
                <button onClick={() => setStep(2)} className="font-mono text-xs uppercase text-royal hover:underline font-bold">
                  Edit Address
                </button>
              </div>

              <div className="space-y-4">
                {/* Razorpay Option */}
                <label className={`block border p-4 cursor-pointer transition-all rounded-xl ${formData.paymentMethod === 'RAZORPAY' ? 'border-royal bg-royal-subtle shadow-sm' : 'border-border bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={formData.paymentMethod === 'RAZORPAY'}
                        onChange={handleInputChange}
                        className="text-royal focus:ring-royal"
                      />
                      <CreditCard className="w-5 h-5 text-royal" />
                      <div>
                        <p className="font-mono font-bold text-xs uppercase tracking-wider text-charcoal">Razorpay Online Payment</p>
                        <p className="font-mono text-[10px] text-muted">Credit / Debit Cards, UPI, NetBanking, Wallets</p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label className={`block border p-4 cursor-pointer transition-all rounded-xl ${formData.paymentMethod === 'COD' ? 'border-royal bg-royal-subtle shadow-sm' : 'border-border bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={handleInputChange}
                        className="text-royal focus:ring-royal"
                      />
                      <Truck className="w-5 h-5 text-royal" />
                      <div>
                        <p className="font-mono font-bold text-xs uppercase tracking-wider text-charcoal">Cash on Delivery (COD)</p>
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
                className="w-full bg-royal hover:bg-royal-dark text-white py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all rounded-md shadow-luxury"
              >
                {loading ? 'Processing Drop Order...' : `COMPLETE ORDER (${formatPrice(total)})`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-border p-6 sm:p-8 space-y-6 h-fit rounded-2xl shadow-subtle text-charcoal">
          <h2 className="font-serif text-lg font-normal uppercase tracking-wider text-charcoal border-b border-border pb-4">
            Reservation Summary ({items.length} items)
          </h2>

          <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-border pr-2 text-charcoal">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="pt-3 first:pt-0 flex items-center justify-between text-xs text-charcoal">
                <div className="flex items-center space-x-3">
                  <img src={item.productImage} alt={item.productName} className="w-12 h-14 object-cover bg-slate-100 border border-border rounded-md" />
                  <div>
                    <h4 className="font-serif text-charcoal line-clamp-1">{item.productName}</h4>
                    <p className="font-mono text-[10px] text-muted">Size: {item.size} | Color: {item.color} | x{item.quantity}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-royal">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-2 font-mono text-xs text-charcoal">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-charcoal font-bold">{formatPrice(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-pink font-bold">
                <span>VIP Promo Discount</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">White-Glove Courier</span>
              <span className="text-charcoal font-bold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Estimated GST (12%)</span>
              <span className="text-charcoal font-bold">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-charcoal border-t border-border pt-3">
              <span>Total Investment</span>
              <span className="text-royal font-mono text-lg font-bold">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
