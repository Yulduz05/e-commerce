'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Printer,
  ShoppingBag,
} from 'lucide-react';
import { CheckoutResponse, ShippingAddress } from '@/types/cart';

export default function CheckoutPage() {
  const { items, totals, promoCode, clearCart, isHydrated } = useCartStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderResult, setOrderResult] = useState<CheckoutResponse | null>(null);

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Alex Vance',
    email: 'alex.vance@example.com',
    phone: '+1 (555) 019-2834',
    street: '742 Evergreen Terrace',
    apartment: 'Suite 4B',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
  });

  // Payment Sim State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('ALEX VANCE');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  if (!isHydrated) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Preparing secure checkout session...</p>
      </div>
    );
  }

  if (items.length === 0 && step !== 3) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '480px' }}>
        <ShoppingBag size={48} style={{ color: 'var(--text-subtle)', margin: '0 auto 16px auto' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>No Items in Bag</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Please add products to your bag before proceeding to checkout.
        </p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.email || !address.street || !address.city || !address.postalCode) {
      setErrorMessage('Please complete all required shipping address fields.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedVariants: {
            size: i.selectedVariants?.size,
            color: i.selectedVariants?.color,
            ram: i.selectedVariants?.ram,
            storage: i.selectedVariants?.storage,
            shade: i.selectedVariants?.shade,
            warrantyId: i.selectedVariants?.warranty?.id,
          },
        })),
        shippingAddress: address,
        payment: {
          method: 'test_card' as const,
          cardNumberMasked: cardNumber,
          isSimulatedSuccess: true,
        },
        promoCode,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: CheckoutResponse = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to complete order. Please check inventory.');
        setIsSubmitting(false);
        return;
      }

      setOrderResult(data);
      clearCart();
      setStep(3);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage('A network error occurred while communicating with the checkout engine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillTestCard = (brandName: string, numberStr: string) => {
    setCardNumber(numberStr);
    setCardHolder(address.fullName.toUpperCase());
    setExpiry('12/28');
    setCvv('888');
  };

  return (
    <div className="container" style={{ padding: '40px 24px 100px 24px', maxWidth: '1100px' }}>
      {/* Anti-Phishing Safeguard Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '32px',
          background: 'rgba(6, 182, 212, 0.08)',
          borderColor: 'rgba(6, 182, 212, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <ShieldCheck size={24} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem', color: '#cffafe' }}>
          <strong>Phishing-Resilient Sandbox Mode:</strong> This checkout flow is an educational development simulation.
          Do NOT enter real personal financial information. Use the preset test cards provided in Step 2.
        </div>
      </div>

      {/* Stepper Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step >= 1 ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            1
          </div>
          <span style={{ fontWeight: 600, color: step >= 1 ? 'var(--text-main)' : 'var(--text-subtle)' }}>
            Shipping Address
          </span>
        </div>

        <div style={{ width: '40px', height: '2px', background: step >= 2 ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step >= 2 ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            2
          </div>
          <span style={{ fontWeight: 600, color: step >= 2 ? 'var(--text-main)' : 'var(--text-subtle)' }}>
            Simulated Payment
          </span>
        </div>

        <div style={{ width: '40px', height: '2px', background: step >= 3 ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step >= 3 ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            3
          </div>
          <span style={{ fontWeight: 600, color: step >= 3 ? '#6ee7b7' : 'var(--text-subtle)' }}>
            Confirmation
          </span>
        </div>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: '10px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fda4af',
            marginBottom: '24px',
            fontSize: '0.9rem',
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      {/* STEP 1: SHIPPING ADDRESS */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '36px', alignItems: 'start' }}>
          <form onSubmit={handleAddressSubmit} className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={20} className="gradient-text-accent" />
              <span>Contact & Delivery Address</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    ZIP *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '24px' }}
              id="continue-to-payment-btn"
            >
              <span>Continue to Payment Simulation</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Mini Cart Summary */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              Order Review ({totals.itemCount} items)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {items.map((it) => (
                <div key={it.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                    <Image src={it.product.thumbnail} alt={it.product.name} fill sizes="48px" style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {it.product.name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      Qty: {it.quantity} • ${(it.lineSubtotal).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.bulkDiscountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6ee7b7' }}>
                  <span>Bulk Savings</span>
                  <span>-${totals.bulkDiscountTotal.toFixed(2)}</span>
                </div>
              )}
              {totals.promoDiscountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6ee7b7' }}>
                  <span>Promo ({totals.appliedPromoCode})</span>
                  <span>-${totals.promoDiscountTotal.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Tax (8.25%)</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'white', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Total</span>
                <span className="gradient-text">${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: SIMULATED PAYMENT */}
      {step === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '36px', alignItems: 'start' }}>
          <form onSubmit={handlePlaceOrder} className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={20} className="gradient-text-accent" />
                <span>Simulated Card Payment</span>
              </h2>
              <span className="badge badge-emerald">🔒 TLS 1.3 Emulated</span>
            </div>

            {/* Test Card Quick Generator Buttons */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Instant Test Credentials:
              </span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => fillTestCard('Visa', '4242 •••• •••• 4242')}
                  className="btn btn-secondary btn-sm"
                >
                  💳 Visa (4242...)
                </button>
                <button
                  type="button"
                  onClick={() => fillTestCard('Mastercard', '5555 •••• •••• 5555')}
                  className="btn btn-secondary btn-sm"
                >
                  💳 Mastercard (5555...)
                </button>
              </div>
            </div>

            {/* Simulated Card Display */}
            <div
              style={{
                padding: '24px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.5)',
                marginBottom: '24px',
                color: 'white',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', fontWeight: 700 }}>OMNISTORE SANDBOX</span>
                <Lock size={18} />
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.35rem', letterSpacing: '0.15em', margin: '24px 0' }}>
                {cardNumber}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <div>
                  <div style={{ opacity: 0.6, fontSize: '0.65rem' }}>CARDHOLDER</div>
                  <div style={{ fontWeight: 600 }}>{cardHolder}</div>
                </div>
                <div>
                  <div style={{ opacity: 0.6, fontSize: '0.65rem' }}>EXPIRES</div>
                  <div style={{ fontWeight: 600 }}>{expiry}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <ArrowLeft size={16} />
                <span>Back to Shipping</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ flex: 2 }}
                id="place-simulated-order-btn"
              >
                <Lock size={16} />
                <span>{isSubmitting ? 'Verifying with Engine...' : `Authorize $${totals.total.toFixed(2)}`}</span>
              </button>
            </div>
          </form>

          {/* Delivery destination summary */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Shipment Recipient</h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div style={{ color: 'white', fontWeight: 600 }}>{address.fullName}</div>
              <div>{address.street} {address.apartment}</div>
              <div>{address.city}, {address.state} {address.postalCode}</div>
              <div>{address.email} • {address.phone}</div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER CONFIRMATION RECEIPT */}
      {step === 3 && orderResult && (
        <div
          className="glass-panel"
          style={{
            padding: '48px',
            maxWidth: '780px',
            margin: '0 auto',
            borderTop: '4px solid var(--accent-emerald)',
          }}
          id="order-confirmation-receipt"
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#6ee7b7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Simulated Order Placed!</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
              Your order was verified, inventory was atomically deducted, and receipt tokens generated.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '32px',
              fontSize: '0.9rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Order ID</span>
              <div style={{ fontWeight: 700, color: 'var(--primary-light)', fontFamily: 'monospace' }}>
                {orderResult.orderId}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Carrier Tracking</span>
              <div style={{ fontWeight: 700, color: '#6ee7b7', fontFamily: 'monospace' }}>
                {orderResult.trackingNumber}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Timestamp</span>
              <div style={{ color: 'var(--text-muted)' }}>
                {orderResult.orderDate ? new Date(orderResult.orderDate).toLocaleString() : 'Just now'}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Payment Method</span>
              <div style={{ color: 'var(--text-muted)' }}>
                Sandbox Test Card (4242)
              </div>
            </div>
          </div>

          {/* Receipt Breakdown */}
          {orderResult.receiptSummary && (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Receipt Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Items Purchased Subtotal</span>
                  <span>${orderResult.receiptSummary.totals.subtotal.toFixed(2)}</span>
                </div>
                {orderResult.receiptSummary.totals.bulkDiscountTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6ee7b7' }}>
                    <span>Bulk Tier Savings</span>
                    <span>-${orderResult.receiptSummary.totals.bulkDiscountTotal.toFixed(2)}</span>
                  </div>
                )}
                {orderResult.receiptSummary.totals.promoDiscountTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6ee7b7' }}>
                    <span>Promo Code Savings</span>
                    <span>-${orderResult.receiptSummary.totals.promoDiscountTotal.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Express Shipping</span>
                  <span>{orderResult.receiptSummary.totals.shipping === 0 ? 'FREE' : `$${orderResult.receiptSummary.totals.shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Taxes (8.25%)</span>
                  <span>${orderResult.receiptSummary.totals.tax.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.3rem',
                    fontWeight: 900,
                    color: 'white',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span>Grand Total Paid</span>
                  <span className="gradient-text">${orderResult.receiptSummary.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', marginTop: '36px' }}>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              <Printer size={16} />
              <span>Print Receipt</span>
            </button>
            <Link
              href="/"
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: 'center' }}
            >
              <span>Continue Shopping</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
