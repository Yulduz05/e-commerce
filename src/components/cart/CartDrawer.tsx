'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import styles from './CartDrawer.module.css';

export const CartDrawer: React.FC = () => {
  const {
    isOpen,
    closeCart,
    items,
    totals,
    removeItem,
    updateQuantity,
    promoCode,
    setPromoCode,
    validationErrors,
  } = useCartStore();

  const [inputCode, setInputCode] = useState(promoCode || '');

  if (!isOpen) return null;

  const freeShippingThreshold = 100;
  const netSubtotal = Math.max(0, totals.subtotal - totals.bulkDiscountTotal - totals.promoDiscountTotal);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - netSubtotal);
  const freeShippingProgress = Math.min(100, (netSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoCode(inputCode);
  };

  const handleApplyQuickPromo = (code: string) => {
    setInputCode(code);
    setPromoCode(code);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
      id="cart-drawer-overlay"
    >
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <ShoppingBag size={22} className="gradient-text-accent" />
            <h2 className={styles.title}>Shopping Bag</h2>
            <span className={styles.itemCountBadge}>{totals.itemCount}</span>
          </div>
          <button
            onClick={closeCart}
            className={styles.closeButton}
            aria-label="Close cart drawer"
            id="close-cart-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className={styles.shippingProgress}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {remainingForFreeShipping === 0 ? (
                <strong style={{ color: '#6ee7b7' }}>🎉 You unlocked FREE Express Shipping!</strong>
              ) : (
                <>Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for FREE shipping</>
              )}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Server Validation Warnings if any */}
        {validationErrors.length > 0 && (
          <div style={{ padding: '10px 24px', background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', fontSize: '0.82rem', borderBottom: '1px solid rgba(244, 63, 94, 0.3)' }}>
            {validationErrors.map((err, i) => (
              <div key={i}>⚠️ {err}</div>
            ))}
          </div>
        )}

        {/* Line Items List */}
        <div className={styles.itemsList}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <ShoppingBag size={36} />
              </div>
              <h3>Your bag is empty</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '280px' }}>
                Explore our catalog of tech, sports cleats, beauty serums, apparel, and supplies.
              </p>
              <button onClick={closeCart} className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }}>
                Start Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    fill
                    sizes="76px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <div className={styles.itemDetails}>
                  <div className={styles.itemTop}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {item.product.brand}
                      </div>
                      <h4 className={styles.itemName} title={item.product.name}>
                        {item.product.name}
                      </h4>

                      {/* Variant Badges */}
                      <div className={styles.itemVariants}>
                        {item.selectedVariants?.size && (
                          <span className={styles.variantTag}>Size: {item.selectedVariants.size}</span>
                        )}
                        {item.selectedVariants?.color && (
                          <span className={styles.variantTag}>Color: {item.selectedVariants.color}</span>
                        )}
                        {item.selectedVariants?.shade && (
                          <span className={styles.variantTag}>Shade: {item.selectedVariants.shade}</span>
                        )}
                        {item.selectedVariants?.warranty && (
                          <span className={styles.variantTag} style={{ color: '#67e8f9', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                            + {item.selectedVariants.warranty.title} (${item.selectedVariants.warranty.price})
                          </span>
                        )}
                        {item.appliedBulkDiscountPercent && item.appliedBulkDiscountPercent > 0 && (
                          <span className={styles.bulkTag}>
                            {item.appliedBulkDiscountPercent}% Bulk Tier
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className={styles.deleteBtn}
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Quantity Stepper & Line Price */}
                  <div className={styles.itemBottom}>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyText}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className={styles.priceColumn}>
                      <span className={styles.lineTotal}>
                        ${item.lineSubtotal.toFixed(2)}
                      </span>
                      {item.appliedBulkDiscountPercent && (
                        <span className={styles.originalPrice}>
                          ${((item.product.price + (item.selectedVariants.warranty?.price || 0)) * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className={styles.footer}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className={styles.promoArea}>
              <input
                type="text"
                placeholder="Enter Promo Code"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className={styles.promoInput}
                aria-label="Discount coupon code"
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                Apply
              </button>
            </form>

            {/* Quick Coupons */}
            <div className={styles.quickPromos}>
              <span>Try:</span>
              <button
                type="button"
                onClick={() => handleApplyQuickPromo('WELCOME10')}
                className={styles.promoChip}
              >
                WELCOME10 (10% off)
              </button>
              <button
                type="button"
                onClick={() => handleApplyQuickPromo('OMNIFREE')}
                className={styles.promoChip}
              >
                OMNIFREE (Free Shipping)
              </button>
            </div>

            {/* Financial Breakdown */}
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>

              {totals.bulkDiscountTotal > 0 && (
                <div className={styles.summaryRow}>
                  <span>Bulk Volume Savings</span>
                  <span className={styles.discountText}>-${totals.bulkDiscountTotal.toFixed(2)}</span>
                </div>
              )}

              {totals.promoDiscountTotal > 0 && (
                <div className={styles.summaryRow}>
                  <span>Promo Code ({totals.appliedPromoCode})</span>
                  <span className={styles.discountText}>-${totals.promoDiscountTotal.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span>Estimated Shipping</span>
                <span>{totals.shipping === 0 ? <strong style={{ color: '#6ee7b7' }}>FREE</strong> : `$${totals.shipping.toFixed(2)}`}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Estimated Sales Tax (8.25%)</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>

              <div className={styles.totalRow}>
                <span>Total</span>
                <span className="gradient-text">${totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className={`btn btn-primary ${styles.checkoutBtn}`}
              id="proceed-to-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
              <ShieldCheck size={14} style={{ color: '#6ee7b7' }} />
              <span>Simulated anti-phishing sandbox checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
