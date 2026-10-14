'use client';

import React from 'react';
import { Product } from '@/types/product';
import { CheckCircle2, AlertTriangle, Shield, Sparkles, Layers, Tag, Info } from 'lucide-react';

interface ProductSpecsProps {
  product: Product;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ product }) => {
  const attr = product.attributes;

  if (attr.category === 'computers-tech') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Technical Specifications</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Processor</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{attr.cpu}</div>
          </div>
          {attr.gpu && (
            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Graphics (GPU)</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{attr.gpu}</div>
            </div>
          )}
          {attr.screenSize && (
            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Display</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{attr.screenSize}</div>
            </div>
          )}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Operating System</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{attr.operatingSystem}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Connectivity & I/O Ports:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {attr.ports.map((port, i) => (
              <span key={i} className="badge badge-cyan" style={{ fontSize: '0.8rem' }}>
                {port}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (attr.category === 'clothing-apparel') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Material & Construction</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Fabric Blend</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{attr.material}</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Silhouette & Fit</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px', textTransform: 'capitalize' }}>
              {attr.fit} Fit ({attr.gender})
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Info size={20} style={{ color: 'var(--primary-light)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '0.9rem' }}>Garment Care Instructions</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {attr.careInstructions}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (attr.category === 'sports-cleats') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Field Traction & Performance</h3>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.85rem' }}>Ground Type: {attr.groundType}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Pro Tier: {attr.proTier}</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '10px' }}>
            {attr.groundDescription}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Stud Technology</span>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: '4px' }}>{attr.studType}</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Upper Material</span>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: '4px' }}>{attr.upperMaterial}</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Collar Construction</span>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: '4px', textTransform: 'capitalize' }}>
              {attr.collarStyle}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (attr.category === 'cosmetics-beauty') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Clinical Formula & Skin Compatibility</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {attr.isCrueltyFree && <span className="badge badge-emerald">🐰 100% Cruelty-Free</span>}
          {attr.isVegan && <span className="badge badge-emerald">🌱 Certified Vegan</span>}
          <span className="badge badge-rose">Net Vol: {attr.volume}</span>
          {attr.skinTypes.map((type, i) => (
            <span key={i} className="badge badge-primary">Suitable: {type} skin</span>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <strong style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>Key Bio-Actives</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {attr.keyIngredients.map((item, i) => (
              <span key={i} className="badge badge-cyan" style={{ fontSize: '0.82rem' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <strong style={{ fontSize: '0.9rem' }}>Directions For Use</strong>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.6 }}>
            {attr.usageInstructions}
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(244, 63, 94, 0.08)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
          <AlertTriangle size={18} style={{ color: 'var(--accent-rose)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.82rem', color: '#fda4af' }}>
            <strong>Safety & Precautions:</strong> {attr.safetyWarnings}
          </div>
        </div>

        <details className="glass-panel" style={{ padding: '14px 18px', cursor: 'pointer' }}>
          <summary style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Full INCI Ingredients List
          </summary>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '10px', lineHeight: 1.6 }}>
            {attr.fullIngredients}
          </p>
        </details>
      </div>
    );
  }

  if (attr.category === 'school-office') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Stationery Specifications & Bulk Tiers</h3>

        {attr.bulkDiscountTiers && attr.bulkDiscountTiers.length > 0 && (
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-amber)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fcd34d' }}>
              <Tag size={18} />
              <strong style={{ fontSize: '0.95rem' }}>Automatic Volume Savings</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Stock up your classroom or office. Discounts automatically apply in cart!
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              {attr.bulkDiscountTiers.map((tier, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontSize: '0.85rem',
                  }}
                >
                  Buy <strong>{tier.minQuantity}+</strong>: Save <strong>{tier.discountPercent}%</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Package Count</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>Pack of {attr.packQuantity} Units</div>
          </div>
          {attr.paperGsm && (
            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Paper Density</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{attr.paperGsm} GSM (Zero Bleed)</div>
            </div>
          )}
          {attr.dimensions && (
            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Dimensions</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{attr.dimensions}</div>
            </div>
          )}
        </div>

        {attr.bundleIncludes && attr.bundleIncludes.length > 0 && (
          <div className="glass-panel" style={{ padding: '18px' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>Complimentary Bundle Inclusions</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {attr.bundleIncludes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
};
