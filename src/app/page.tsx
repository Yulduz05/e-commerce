'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryTabs } from '@/components/filters/CategoryTabs';
import { FacetFilter } from '@/components/filters/FacetFilter';
import { ProductCard } from '@/components/products/ProductCard';
import { Product, ProductCategory, ProductFilterQuery } from '@/types/product';
import { Sparkles, PackageX } from 'lucide-react';
import productsData from '@/lib/db/data/products.json';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as ProductCategory) || 'all';

  const [category, setCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [groundType, setGroundType] = useState('all');
  const [gender, setGender] = useState('all');
  const [skinType, setSkinType] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<ProductFilterQuery['sortBy']>('featured');

  useEffect(() => {
    const cat = searchParams.get('category') as ProductCategory | null;
    if (cat) {
      setCategory(cat);
    }
  }, [searchParams]);

  const allProducts: Product[] = productsData as Product[];

  const brandsList = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.brand))).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Category
    if (category !== 'all') {
      list = list.filter((p) => p.category === category);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inBrand = p.brand.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
        return inName || inBrand || inDesc || inTags;
      });
    }

    // Brand
    if (brand) {
      list = list.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // In Stock Only
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // Ground Type for Cleats
    if (groundType !== 'all') {
      list = list.filter((p) => {
        if (p.attributes.category === 'sports-cleats') {
          return p.attributes.groundType === groundType;
        }
        return false;
      });
    }

    // Gender for Apparel
    if (gender !== 'all') {
      list = list.filter((p) => {
        if (p.attributes.category === 'clothing-apparel') {
          return p.attributes.gender === gender || p.attributes.gender === 'unisex';
        }
        return false;
      });
    }

    // Skin Type for Beauty
    if (skinType !== 'all') {
      list = list.filter((p) => {
        if (p.attributes.category === 'cosmetics-beauty') {
          return (
            p.attributes.skinTypes.includes(skinType as any) ||
            p.attributes.skinTypes.includes('all')
          );
        }
        return false;
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [allProducts, category, search, brand, inStockOnly, groundType, gender, skinType, sortBy]);

  const handleResetFilters = () => {
    setCategory('all');
    setSearch('');
    setBrand('');
    setGroundType('all');
    setGender('all');
    setSkinType('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="container" style={{ marginTop: '36px' }}>
      {/* Category Pill Tabs */}
      <div style={{ marginBottom: '28px' }}>
        <CategoryTabs
          selectedCategory={category}
          onSelectCategory={(cat) => setCategory(cat)}
        />
      </div>

      {/* Layout: Sidebar Filter & Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Filter Sidebar */}
        <FacetFilter
          category={category}
          search={search}
          onSearchChange={setSearch}
          brand={brand}
          onBrandChange={setBrand}
          groundType={groundType}
          onGroundTypeChange={setGroundType}
          gender={gender}
          onGenderChange={setGender}
          skinType={skinType}
          onSkinTypeChange={setSkinType}
          inStockOnly={inStockOnly}
          onInStockChange={setInStockOnly}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          brandsList={brandsList}
          onReset={handleResetFilters}
        />

        {/* Right Column: Catalog Grid */}
        <div>
          {/* Results Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--text-main)' }}>{filteredProducts.length}</strong> items
              {category !== 'all' && (
                <span>
                  {' '}in{' '}
                  <strong style={{ color: 'var(--primary-light)', textTransform: 'capitalize' }}>
                    {category.replace('-', ' ')}
                  </strong>
                </span>
              )}
              {search && <span> matching &ldquo;{search}&rdquo;</span>}
            </div>

            {(search || brand || groundType !== 'all' || gender !== 'all' || skinType !== 'all' || inStockOnly) && (
              <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                Clear All Filters
              </button>
            )}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '60px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-subtle)',
                }}
              >
                <PackageX size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>No products match your criteria</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '360px', fontSize: '0.92rem' }}>
                Try relaxing your search terms or ground/skin filters to see more results.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Product Grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '60px 0 40px 0',
          borderBottom: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '800px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#a5b4fc',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={16} />
              <span>Multi-Category Next.js Platform • Production Ready</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                lineHeight: 1.15,
                fontWeight: 900,
                letterSpacing: '-0.03em',
              }}
            >
              Engineered for <span className="gradient-text">Every Passion.</span>
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginTop: '16px',
                maxWidth: '640px',
              }}
            >
              Discover high-performance Tech workstations, Japanese selvedge apparel, pro-tier soccer cleats, clinical skincare serums, and artisan stationery supplies.
            </p>

            {/* Platform Highlights */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: '24px',
              }}
            >
              <span className="badge badge-primary">24 Curated Products</span>
              <span className="badge badge-cyan">5 Diverse Categories</span>
              <span className="badge badge-emerald">Server Anti-Tamper Core</span>
              <span className="badge badge-amber">Automatic Bulk Discounts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog with Suspense Boundary */}
      <Suspense
        fallback={
          <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div className="skeleton" style={{ height: '400px', width: '100%' }} />
          </div>
        }
      >
        <CatalogContent />
      </Suspense>
    </div>
  );
}
