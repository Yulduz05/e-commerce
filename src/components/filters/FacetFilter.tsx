'use client';

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProductCategory, ProductFilterQuery } from '@/types/product';
import styles from './FacetFilter.module.css';

interface FacetFilterProps {
  category: ProductCategory | 'all';
  search: string;
  onSearchChange: (val: string) => void;
  brand: string;
  onBrandChange: (val: string) => void;
  groundType: string;
  onGroundTypeChange: (val: string) => void;
  gender: string;
  onGenderChange: (val: string) => void;
  skinType: string;
  onSkinTypeChange: (val: string) => void;
  inStockOnly: boolean;
  onInStockChange: (val: boolean) => void;
  sortBy: ProductFilterQuery['sortBy'];
  onSortByChange: (val: ProductFilterQuery['sortBy']) => void;
  brandsList: string[];
  onReset: () => void;
}

export const FacetFilter: React.FC<FacetFilterProps> = ({
  category,
  search,
  onSearchChange,
  brand,
  onBrandChange,
  groundType,
  onGroundTypeChange,
  gender,
  onGenderChange,
  skinType,
  onSkinTypeChange,
  inStockOnly,
  onInStockChange,
  sortBy,
  onSortByChange,
  brandsList,
  onReset,
}) => {
  return (
    <aside className={styles.filterCard} aria-label="Catalog Filters">
      <div className={styles.header}>
        <div className={styles.title}>
          <SlidersHorizontal size={18} className="gradient-text-accent" />
          <span>Filters</span>
        </div>
        <button onClick={onReset} className={styles.resetBtn}>
          Reset All
        </button>
      </div>

      {/* Real-time Search */}
      <div className={styles.section}>
        <label htmlFor="search-input" className={styles.sectionTitle}>
          Search Catalog
        </label>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            id="search-input"
            type="text"
            placeholder="Search keywords, specs..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Sorting */}
      <div className={styles.section}>
        <label htmlFor="sort-select" className={styles.sectionTitle}>
          Sort By
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as ProductFilterQuery['sortBy'])}
          className={styles.selectInput}
        >
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">New Arrivals</option>
        </select>
      </div>

      {/* In-Stock Filter */}
      <div className={styles.section}>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className={styles.checkbox}
            id="instock-checkbox"
          />
          <span>In-Stock Items Only</span>
        </label>
      </div>

      {/* Category Specific Facet 1: Ground Type (Soccer Cleats) */}
      {(category === 'sports-cleats' || category === 'all') && (
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Pitch Ground Type</span>
          <div className={styles.pillGroup}>
            {[
              { id: 'all', label: 'All Grounds' },
              { id: 'FG', label: 'FG (Firm Grass)' },
              { id: 'AG', label: 'AG (Artificial)' },
              { id: 'SG', label: 'SG (Soft Mud)' },
              { id: 'IN', label: 'IN (Futsal / Court)' },
              { id: 'TF', label: 'TF (Astro Turf)' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onGroundTypeChange(item.id)}
                className={`${styles.filterPill} ${groundType === item.id ? styles.filterPillActive : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Specific Facet 2: Gender Fit (Apparel) */}
      {(category === 'clothing-apparel' || category === 'all') && (
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Apparel Gender</span>
          <div className={styles.pillGroup}>
            {[
              { id: 'all', label: 'All' },
              { id: 'men', label: 'Men' },
              { id: 'women', label: 'Women' },
              { id: 'unisex', label: 'Unisex' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onGenderChange(item.id)}
                className={`${styles.filterPill} ${gender === item.id ? styles.filterPillActive : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Specific Facet 3: Skin Type (Cosmetics) */}
      {(category === 'cosmetics-beauty' || category === 'all') && (
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Skin Compatibility</span>
          <div className={styles.pillGroup}>
            {[
              { id: 'all', label: 'All Types' },
              { id: 'dry', label: 'Dry Skin' },
              { id: 'oily', label: 'Oily Skin' },
              { id: 'sensitive', label: 'Sensitive' },
              { id: 'combination', label: 'Combination' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSkinTypeChange(item.id)}
                className={`${styles.filterPill} ${skinType === item.id ? styles.filterPillActive : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand Selection */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Brand</span>
        <select
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          className={styles.selectInput}
        >
          <option value="">All Brands</option>
          {brandsList.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};
