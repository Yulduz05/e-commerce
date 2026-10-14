'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingBag, Plus, Minus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '@/types/product';
import { SelectedVariants } from '@/types/cart';
import { VariantSelector } from '@/components/products/VariantSelector';
import { useCartStore } from '@/lib/store/useCartStore';

interface ProductDetailClientProps {
  product: Product;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Initialize default variants
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>(() => {
    const init: SelectedVariants = {};
    const attr = product.attributes;

    if (attr.category === 'computers-tech') {
      if (attr.ram?.length) init.ram = attr.ram[0];
      if (attr.storageOptions?.length) init.storage = attr.storageOptions[0];
      if (attr.warrantyOptions?.length) init.warranty = attr.warrantyOptions[0];
    } else if (attr.category === 'clothing-apparel') {
      if (attr.sizes?.length) init.size = attr.sizes[0].size;
      if (attr.colors?.length) init.color = attr.colors[0].name;
    } else if (attr.category === 'sports-cleats') {
      if (attr.shoeSizes?.length) init.size = attr.shoeSizes[0].size;
    } else if (attr.category === 'cosmetics-beauty') {
      if (attr.shades?.length) init.shade = attr.shades[0].name;
    }
    return init;
  });

  const warrantyPrice = selectedVariants.warranty?.price || 0;
  const unitPrice = product.price + warrantyPrice;
  const totalItemPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariants);
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
        gap: '48px',
        alignItems: 'start',
      }}
    >
      {/* Left Column: Media Gallery */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            background: '#0f172a',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <Image
            src={images[activeImageIndex]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                style={{
                  position: 'relative',
                  width: '84px',
                  height: '84px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: `2px solid ${activeImageIndex === i ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  opacity: activeImageIndex === i ? 1 : 0.6,
                  transition: 'all 0.15s ease',
                }}
              >
                <Image src={img} alt={`${product.name} preview ${i + 1}`} fill sizes="84px" style={{ objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Pricing & Interactive Configurator */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-light)' }}>
              {product.brand}
            </span>
            <span style={{ color: 'var(--text-subtle)' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SKU: {product.sku}</span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.25 }}>
            {product.name}
          </h1>

          {/* Rating & Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                  stroke="#fbbf24"
                />
              ))}
            </div>
            <strong style={{ fontSize: '0.95rem' }}>{product.rating.toFixed(1)}</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>({product.reviewCount} verified customer reviews)</span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>
                ${unitPrice.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--text-subtle)' }}>
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            {warrantyPrice > 0 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                Includes {selectedVariants.warranty?.title} (+${warrantyPrice.toFixed(2)})
              </div>
            )}
          </div>

          <div>
            {product.stock <= 10 ? (
              <span className="badge badge-amber" style={{ padding: '6px 14px' }}>Only {product.stock} units left!</span>
            ) : (
              <span className="badge badge-emerald" style={{ padding: '6px 14px' }}>In Stock & Ready to Ship</span>
            )}
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {product.shortDescription}
        </p>

        {/* Interactive Variant Picker */}
        <div style={{ padding: '20px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <VariantSelector
            product={product}
            selectedVariants={selectedVariants}
            onChangeVariants={(v) => setSelectedVariants(v)}
          />
        </div>

        {/* Quantity Stepper & Add to Bag */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="btn btn-sm"
              style={{ padding: '10px', color: 'var(--text-muted)' }}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span style={{ padding: '0 16px', fontWeight: 700, fontSize: '1.05rem' }}>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="btn btn-sm"
              style={{ padding: '10px', color: 'var(--text-muted)' }}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn btn-primary btn-lg"
            style={{ flex: 1, gap: '10px' }}
            id="pdp-add-to-cart-btn"
          >
            <ShoppingBag size={20} />
            <span>Add to Bag • ${totalItemPrice.toFixed(2)}</span>
          </button>
        </div>

        {/* Value Trust Assurances */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '10px' }}>
          <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', fontSize: '0.78rem' }}>
            <Truck size={18} style={{ color: 'var(--primary-light)', margin: '0 auto 6px auto' }} />
            <div>Free Shipping over $100</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', fontSize: '0.78rem' }}>
            <RotateCcw size={18} style={{ color: '#67e8f9', margin: '0 auto 6px auto' }} />
            <div>30-Day Money Back</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', fontSize: '0.78rem' }}>
            <ShieldCheck size={18} style={{ color: '#6ee7b7', margin: '0 auto 6px auto' }} />
            <div>Anti-Tamper Validated</div>
          </div>
        </div>
      </div>
    </div>
  );
};
