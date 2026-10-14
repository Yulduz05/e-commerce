'use client';

import React from 'react';
import { Product, WarrantyOption } from '@/types/product';
import { SelectedVariants } from '@/types/cart';
import { ShieldCheck, Check } from 'lucide-react';

interface VariantSelectorProps {
  product: Product;
  selectedVariants: SelectedVariants;
  onChangeVariants: (updated: SelectedVariants) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  product,
  selectedVariants,
  onChangeVariants,
}) => {
  const attr = product.attributes;

  // 1. Tech: Warranty Tier Selection & RAM/Storage
  if (attr.category === 'computers-tech') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* RAM Selector if available */}
        {attr.ram && attr.ram.length > 1 && (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Memory (RAM): <span style={{ color: 'var(--text-main)' }}>{selectedVariants.ram || attr.ram[0]}</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              {attr.ram.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChangeVariants({ ...selectedVariants, ram: r })}
                  className={`btn btn-sm ${
                    (selectedVariants.ram || attr.ram[0]) === r ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Storage Selector if available */}
        {attr.storageOptions && attr.storageOptions.length > 1 && (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Storage Capacity: <span style={{ color: 'var(--text-main)' }}>{selectedVariants.storage || attr.storageOptions[0]}</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              {attr.storageOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChangeVariants({ ...selectedVariants, storage: s })}
                  className={`btn btn-sm ${
                    (selectedVariants.storage || attr.storageOptions[0]) === s ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Extended Warranty Plans */}
        {attr.warrantyOptions && attr.warrantyOptions.length > 0 && (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span>Hardware Protection & Warranty Plan</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {attr.warrantyOptions.map((w) => {
                const isSelected = (selectedVariants.warranty?.id || attr.warrantyOptions[0].id) === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => onChangeVariants({ ...selectedVariants, warranty: w })}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                        {w.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {w.coverage}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: w.price === 0 ? '#6ee7b7' : 'var(--text-main)' }}>
                      {w.price === 0 ? 'Included ($0)' : `+$${w.price.toFixed(2)}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Apparel: Sizes & Colors
  if (attr.category === 'clothing-apparel') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Colors */}
        {attr.colors && attr.colors.length > 0 && (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Color: <span style={{ color: 'var(--text-main)' }}>{selectedVariants.color || attr.colors[0].name}</span>
            </label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {attr.colors.map((c) => {
                const isSelected = (selectedVariants.color || attr.colors[0].name) === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => onChangeVariants({ ...selectedVariants, color: c.name })}
                    title={c.name}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: c.hex,
                      border: `2px solid ${isSelected ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.2)'}`,
                      boxShadow: isSelected ? '0 0 0 3px rgba(99, 102, 241, 0.4)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <Check size={16} color={c.hex === '#f5f5f0' || c.hex === '#faf0e6' ? '#000' : '#fff'} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sizes */}
        {attr.sizes && attr.sizes.length > 0 && (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Size: <span style={{ color: 'var(--text-main)' }}>{selectedVariants.size || attr.sizes[0].size}</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              {attr.sizes.map((s) => {
                const isSelected = (selectedVariants.size || attr.sizes[0].size) === s.size;
                const isOutOfStock = s.stock === 0;
                return (
                  <button
                    key={s.size}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => onChangeVariants({ ...selectedVariants, size: s.size })}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '48px', opacity: isOutOfStock ? 0.4 : 1 }}
                  >
                    <span>{s.size}</span>
                    {s.stock < 5 && s.stock > 0 && (
                      <span style={{ fontSize: '0.65rem', color: '#fcd34d' }}>({s.stock} left)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Soccer Cleats: Shoe Sizes
  if (attr.category === 'sports-cleats') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              US Men's Shoe Size: <span style={{ color: 'var(--text-main)' }}>{selectedVariants.size || attr.shoeSizes[0].size}</span>
            </label>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', cursor: 'pointer' }}>
              📐 Sizing Guide (True-to-Fit)
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            {attr.shoeSizes.map((s) => {
              const isSelected = (selectedVariants.size || attr.shoeSizes[0].size) === s.size;
              const isOutOfStock = s.stock === 0;
              return (
                <button
                  key={s.size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onChangeVariants({ ...selectedVariants, size: s.size })}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: '54px' }}
                >
                  US {s.size}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 4. Cosmetics: Shades
  if (attr.category === 'cosmetics-beauty' && attr.shades && attr.shades.length > 0) {
    return (
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Shade / Tone: <span style={{ color: 'var(--text-main)' }}>{selectedVariants.shade || attr.shades[0].name}</span>
        </label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
          {attr.shades.map((shade) => {
            const isSelected = (selectedVariants.shade || attr.shades![0].name) === shade.name;
            return (
              <button
                key={shade.name}
                type="button"
                onClick={() => onChangeVariants({ ...selectedVariants, shade: shade.name })}
                title={shade.name}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: shade.hex,
                    display: 'inline-block',
                  }}
                />
                <span>{shade.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
