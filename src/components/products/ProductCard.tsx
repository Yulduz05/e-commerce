'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Plus, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/lib/store/useCartStore';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Default variant selections for quick add
    let defaultVariants: any = {};
    if (product.attributes.category === 'clothing-apparel' && product.attributes.sizes.length > 0) {
      defaultVariants.size = product.attributes.sizes[0].size;
      defaultVariants.color = product.attributes.colors[0]?.name;
    } else if (product.attributes.category === 'sports-cleats' && product.attributes.shoeSizes.length > 0) {
      defaultVariants.size = product.attributes.shoeSizes[0].size;
    } else if (product.attributes.category === 'cosmetics-beauty' && product.attributes.shades) {
      defaultVariants.shade = product.attributes.shades[0]?.name;
    }

    addItem(product, 1, defaultVariants);
  };

  const getCategoryBadge = () => {
    switch (product.category) {
      case 'computers-tech':
        return <span className="badge badge-cyan">Tech</span>;
      case 'clothing-apparel':
        return <span className="badge badge-primary">Apparel</span>;
      case 'sports-cleats':
        return <span className="badge badge-emerald">Cleats</span>;
      case 'cosmetics-beauty':
        return <span className="badge badge-rose">Beauty</span>;
      case 'school-office':
        return <span className="badge badge-amber">Office</span>;
    }
  };

  const getPolymorphicSnippet = () => {
    const attr = product.attributes;
    if (attr.category === 'computers-tech') {
      return <span>⚡ {attr.cpu.split('(')[0].trim()}</span>;
    } else if (attr.category === 'clothing-apparel') {
      return <span>🧵 {attr.material.split('(')[0].trim()}</span>;
    } else if (attr.category === 'sports-cleats') {
      return <span>⚽ Ground: {attr.groundType} ({attr.proTier})</span>;
    } else if (attr.category === 'cosmetics-beauty') {
      return <span>🌿 {attr.isCrueltyFree ? 'Cruelty-Free' : 'Clean'} • {attr.volume}</span>;
    } else if (attr.category === 'school-office') {
      return <span>📦 Pack of {attr.packQuantity} {attr.paperGsm ? `• ${attr.paperGsm} GSM` : ''}</span>;
    }
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className={styles.card} id={`product-card-${product.id}`}>
      <Link href={`/products/${product.id}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Product Image & Badges */}
        <div className={styles.imageWrapper}>
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.productImage}
          />

          <div className={styles.badgeOverlay}>
            {getCategoryBadge()}
            {discountPercent && (
              <span className="badge badge-rose">-{discountPercent}% OFF</span>
            )}
          </div>

          <div className={styles.stockBadge}>
            {product.stock <= 10 ? (
              <span className="badge badge-amber">Only {product.stock} left</span>
            ) : (
              <span className="badge badge-emerald">In Stock</span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className={styles.content}>
          <div>
            <div className={styles.brand}>{product.brand}</div>
            <h3 className={styles.title}>{product.name}</h3>

            <div className={styles.ratingRow} style={{ marginTop: '6px' }}>
              <div className={styles.stars}>
                <Star size={14} fill="#fbbf24" stroke="none" />
              </div>
              <span><strong>{product.rating.toFixed(1)}</strong></span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          <div className={styles.polySpecBadge}>
            {getPolymorphicSnippet()}
          </div>

          {/* Pricing & Add Button */}
          <div className={styles.footer}>
            <div className={styles.priceBlock}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className={styles.comparePrice}>${product.compareAtPrice.toFixed(2)}</span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              className={styles.quickAddBtn}
              title={`Quick Add ${product.name} to Cart`}
              aria-label={`Quick Add ${product.name} to Cart`}
              id={`quick-add-${product.id}`}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};
