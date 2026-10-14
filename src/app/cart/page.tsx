'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    totals,
    removeItem,
    updateQuantity,
    promoCode,
    setPromoCode,
    isHydrated,
  } = useCartStore();

  const [inputCode, setInputCode] = useState(promoCode || '');

  if (!isHydrated) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading shopping bag...</p>
      </div>
    );
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoCode(inputCode);
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '500px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: 'var(--text-subtle)',
          }}
        >
          <ShoppingBag size={40} />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Your Shopping Bag is Empty</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '10px', fontSize: '0.95rem' }}>
          Explore our wide range of products across tech, apparel, soccer cleats, skincare, and office supplies.
        </p>
        <Link href="/" className="btn btn-primary btn-lg" style={{ marginTop: '24px' }}>
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Link href="/" className="btn btn-secondary btn-sm" style={{ padding: '6px 10px' }}>
          <ArrowLeft size={16} />
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Shopping Bag ({totals.itemCount})</h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
          gap: '36px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Item Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100px',
                  height: '100px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#111',
                }}
              >
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  fill
                  sizes="100px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.product.brand}
                </div>
                <Link
                  href={`/products/${item.product.id}`}
                  style={{ fontSize: '1.05rem', fontWeight: 700, display: 'block', marginTop: '2px' }}
                >
                  {item.product.name}
                </Link>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {item.selectedVariants?.size && (
                    <span className="badge badge-primary">Size: {item.selectedVariants.size}</span>
                  )}
                  {item.selectedVariants?.color && (
                    <span className="badge badge-primary">Color: {item.selectedVariants.color}</span>
                  )}
                  {item.selectedVariants?.shade && (
                    <span className="badge badge-rose">Shade: {item.selectedVariants.shade}</span>
                  )}
                  {item.selectedVariants?.warranty && (
                    <span className="badge badge-cyan">
                      + {item.selectedVariants.warranty.title} (${item.selectedVariants.warranty.price})
                    </span>
                  )}
                  {item.appliedBulkDiscountPercent && item.appliedBulkDiscountPercent > 0 && (
                    <span className="badge badge-emerald">
                      {item.appliedBulkDiscountPercent}% Bulk Discount
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '14px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-sm"
                      style={{ padding: '6px 10px', color: 'var(--text-muted)' }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-sm"
                      style={{ padding: '6px 10px', color: 'var(--text-muted)' }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--accent-rose)', gap: '4px' }}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                  ${item.lineSubtotal.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                  ${((item.product.price + (item.selectedVariants.warranty?.price || 0))).toFixed(2)} each
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Order Summary</h2>

          {/* Promo code */}
          <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Promo Code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                textTransform: 'uppercase',
                fontSize: '0.88rem',
              }}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              Apply
            </button>
          </form>

          {/* Line Breakdowns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items Subtotal</span>
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
                <span>Coupon ({totals.appliedPromoCode})</span>
                <span>-${totals.promoDiscountTotal.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span>{totals.shipping === 0 ? <strong style={{ color: '#6ee7b7' }}>FREE</strong> : `$${totals.shipping.toFixed(2)}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Sales Tax (8.25%)</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.35rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span>Total</span>
              <span className="gradient-text">${totals.total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            id="cart-page-checkout-btn"
          >
            <span>Proceed to Simulated Checkout</span>
            <ArrowRight size={18} />
          </Link>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.78rem',
              color: 'var(--text-subtle)',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={16} style={{ color: '#6ee7b7' }} />
            <span>Phishing-resilient test environment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
