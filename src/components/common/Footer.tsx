import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Headphones, Layers, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
      {/* Value Proposition Strip */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(99, 102, 241, 0.04)' }}>
        <div className="container" style={{ padding: '30px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
              <Truck size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '0.92rem' }}>Free Express Shipping</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>On all orders over $100</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '0.92rem' }}>Anti-Tamper Security</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Server-validated pricing & stock</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#67e8f9' }}>
              <RotateCcw size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '0.92rem' }}>30-Day Hassle-Free Returns</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Easy prepaid returns on all items</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fda4af' }}>
              <Headphones size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '0.92rem' }}>24/7 Expert Support</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real human product specialists</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '50px 24px 30px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Layers size={18} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>OmniStore</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '280px' }}>
            The production-grade multi-category platform engineered with modular clean architecture, server-authoritative integrity, and modern UX.
          </p>
        </div>

        <div>
          <strong style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)' }}>Categories</strong>
          <ul style={{ listStyle: 'none', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <li><Link href="/?category=computers-tech">Computers & Tech</Link></li>
            <li><Link href="/?category=clothing-apparel">Clothing & Apparel</Link></li>
            <li><Link href="/?category=sports-cleats">Soccer Cleats & Gear</Link></li>
            <li><Link href="/?category=cosmetics-beauty">Cosmetics & Beauty</Link></li>
            <li><Link href="/?category=school-office">School & Office Supplies</Link></li>
          </ul>
        </div>

        <div>
          <strong style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)' }}>Security & Trust</strong>
          <ul style={{ listStyle: 'none', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <li><span style={{ color: '#6ee7b7' }}>✓ OWASP Top 10 Hardened</span></li>
            <li><span>✓ Strict Content Security Policy</span></li>
            <li><span>✓ Zero Client-Side Price Reliance</span></li>
            <li><span>✓ Phishing-Resilient Simulated Flow</span></li>
            <li><span>✓ Atomic Stock Deductions</span></li>
          </ul>
        </div>

        <div>
          <strong style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)' }}>Test Promo Coupons</strong>
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
            <div><code style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '2px 6px', borderRadius: '4px' }}>WELCOME10</code> - 10% Off Order</div>
            <div><code style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '2px 6px', borderRadius: '4px' }}>CYBER20</code> - 20% Off Order</div>
            <div><code style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '2px 6px', borderRadius: '4px' }}>OMNIFREE</code> - Free Shipping</div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '20px 24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
        © 2026 OmniStore Platform • Built with Next.js 15, TypeScript, React 19 & Vanilla CSS System • Simulated Sandbox
      </div>
    </footer>
  );
};
