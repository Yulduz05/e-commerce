'use client';

import React from 'react';
import { Laptop, Shirt, Activity, Sparkles, BookOpen, LayoutGrid } from 'lucide-react';
import { ProductCategory } from '@/types/product';
import styles from './CategoryTabs.module.css';

interface CategoryTabsProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const tabs = [
    { id: 'all', label: 'All Products', icon: LayoutGrid },
    { id: 'computers-tech', label: 'Computers & Tech', icon: Laptop },
    { id: 'clothing-apparel', label: 'Clothing & Apparel', icon: Shirt },
    { id: 'sports-cleats', label: 'Soccer & Cleats', icon: Activity },
    { id: 'cosmetics-beauty', label: 'Cosmetics & Beauty', icon: Sparkles },
    { id: 'school-office', label: 'School & Office', icon: BookOpen },
  ];

  return (
    <div className={styles.tabsContainer} role="tablist" aria-label="Product Categories">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = selectedCategory === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(tab.id as ProductCategory | 'all')}
            className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
            id={`tab-category-${tab.id}`}
          >
            <span className={styles.tabIcon}>
              <Icon size={18} />
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
