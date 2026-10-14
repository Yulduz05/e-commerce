'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { toggleCart, totals, isBouncing, isHydrated } = useCartStore();

  const itemCount = isHydrated ? totals.itemCount : 0;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logoArea} id="brand-logo-link">
          <div className={styles.logoIcon}>
            <Layers size={22} />
          </div>
          <span className={styles.brandText}>
            Omni<span className={styles.brandAccent}>Store</span>
          </span>
        </Link>

        {/* Categories Navigation */}
        <nav className={styles.navLinks} aria-label="Main Navigation">
          <Link
            href="/?category=all"
            className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
          >
            All Catalog
          </Link>
          <Link href="/?category=computers-tech" className={styles.navLink}>
            Tech
          </Link>
          <Link href="/?category=clothing-apparel" className={styles.navLink}>
            Apparel
          </Link>
          <Link href="/?category=sports-cleats" className={styles.navLink}>
            Cleats
          </Link>
          <Link href="/?category=cosmetics-beauty" className={styles.navLink}>
            Beauty
          </Link>
          <Link href="/?category=school-office" className={styles.navLink}>
            Office
          </Link>
        </nav>

        {/* Right Actions */}
        <div className={styles.actions}>
          <div className={styles.sandboxPill} title="Production-grade secure test sandbox">
            <ShieldCheck size={14} />
            <span>Phishing Shield Active</span>
          </div>

          <button
            onClick={toggleCart}
            className={styles.cartButton}
            aria-label={`Open shopping cart with ${itemCount} items`}
            id="nav-cart-toggle-btn"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span
                className={`${styles.cartBadge} ${isBouncing ? 'animate-bounce-badge' : ''}`}
                id="cart-item-count-badge"
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
