import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { productRepository } from '@/lib/db/productRepository';
import { ProductSpecs } from '@/components/products/ProductSpecs';
import { ProductDetailClient } from './ProductDetailClient';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = productRepository.getById(id) || productRepository.getBySlug(id);
  if (!product) return { title: 'Product Not Found | OmniStore' };

  return {
    title: `${product.name} | OmniStore`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = productRepository.getById(id) || productRepository.getBySlug(id);

  if (!product) {
    notFound();
  }

  // Get related products from same category
  const related = productRepository
    .getAll()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div style={{ padding: '30px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} />
            <span>Catalog</span>
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/?category=${product.category}`}
            style={{ textTransform: 'capitalize' }}
          >
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* Client Interactive Product Detail Area */}
        <ProductDetailClient product={product} />

        {/* Polymorphic Specs & In-Depth Details */}
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: '900px' }}>
            <ProductSpecs product={product} />

            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>
                Full Product Overview
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Category Recommendations */}
        {related.length > 0 && (
          <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                More in <span className="gradient-text" style={{ textTransform: 'capitalize' }}>{product.category.replace('-', ' ')}</span>
              </h3>
              <Link href={`/?category=${product.category}`} className="btn btn-secondary btn-sm">
                View All Category
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
