import { Product, ProductCategory, ProductFilterQuery } from '@/types/product';
import productsData from './data/products.json';

// In-memory product collection initialized from seed data
let products: Product[] = [...(productsData as Product[])];

export const productRepository = {
  getAll(): Product[] {
    return products;
  },

  getById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
  },

  getBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
  },

  filter(query: ProductFilterQuery = {}): { products: Product[]; total: number } {
    let result = [...products];

    // Filter by Category
    if (query.category && query.category !== 'all') {
      result = result.filter((p) => p.category === query.category);
    }

    // Filter by Search Term (sanitized, case-insensitive)
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      result = result.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inBrand = p.brand.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
        return inName || inBrand || inDesc || inTags;
      });
    }

    // Filter by Brand
    if (query.brand) {
      result = result.filter((p) => p.brand.toLowerCase() === query.brand?.toLowerCase());
    }

    // Filter by Price range
    if (typeof query.minPrice === 'number') {
      result = result.filter((p) => p.price >= query.minPrice!);
    }
    if (typeof query.maxPrice === 'number') {
      result = result.filter((p) => p.price <= query.maxPrice!);
    }

    // Filter by Minimum Rating
    if (typeof query.rating === 'number' && query.rating > 0) {
      result = result.filter((p) => p.rating >= query.rating!);
    }

    // In Stock Only
    if (query.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Category-specific facet: Ground Type (cleats)
    if (query.groundType && query.groundType !== 'all') {
      result = result.filter((p) => {
        if (p.attributes.category === 'sports-cleats') {
          return p.attributes.groundType === query.groundType;
        }
        return false;
      });
    }

    // Category-specific facet: Gender (apparel)
    if (query.gender && query.gender !== 'all') {
      result = result.filter((p) => {
        if (p.attributes.category === 'clothing-apparel') {
          return p.attributes.gender === query.gender || p.attributes.gender === 'unisex';
        }
        return false;
      });
    }

    // Category-specific facet: Skin Type (beauty)
    if (query.skinType && query.skinType !== 'all') {
      result = result.filter((p) => {
        if (p.attributes.category === 'cosmetics-beauty') {
          return (
            p.attributes.skinTypes.includes(query.skinType as any) ||
            p.attributes.skinTypes.includes('all')
          );
        }
        return false;
      });
    }

    // Sort
    switch (query.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return {
      products: result,
      total: result.length,
    };
  },

  getFacets() {
    const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
    const categories: ProductCategory[] = [
      'computers-tech',
      'clothing-apparel',
      'sports-cleats',
      'cosmetics-beauty',
      'school-office',
    ];
    const groundTypes = ['FG', 'AG', 'SG', 'IN', 'TF'];
    const skinTypes = ['all', 'dry', 'oily', 'combination', 'sensitive'];

    const prices = products.map((p) => p.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    return {
      brands,
      categories,
      groundTypes,
      skinTypes,
      priceRange: { min: minPrice, max: maxPrice },
    };
  },
};
