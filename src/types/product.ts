export type ProductCategory =
  | 'computers-tech'
  | 'clothing-apparel'
  | 'sports-cleats'
  | 'cosmetics-beauty'
  | 'school-office';

export interface BaseProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  slug: string;
  category: ProductCategory;
  price: number; // in USD (e.g. 129.99)
  compareAtPrice?: number; // original price for discount comparison
  rating: number; // 0 - 5
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  images: string[];
  thumbnail: string;
  description: string;
  shortDescription: string;
  tags: string[];
}

export interface WarrantyOption {
  id: string;
  title: string;
  price: number;
  durationMonths: number;
  coverage: string;
}

export interface TechAttributes {
  category: 'computers-tech';
  cpu: string;
  ram: string[];
  gpu?: string;
  storageOptions: string[];
  screenSize?: string;
  ports: string[];
  operatingSystem: string;
  warrantyOptions: WarrantyOption[];
}

export interface ApparelAttributes {
  category: 'clothing-apparel';
  gender: 'men' | 'women' | 'unisex';
  material: string;
  fit: 'slim' | 'regular' | 'relaxed' | 'oversized';
  sizes: Array<{ size: string; stock: number }>;
  colors: Array<{ name: string; hex: string }>;
  careInstructions: string;
}

export interface SportsCleatsAttributes {
  category: 'sports-cleats';
  groundType: 'FG' | 'AG' | 'SG' | 'IN' | 'TF'; // Firm Ground, Artificial Grass, Soft Ground, Indoor, Turf
  groundDescription: string;
  studType: string;
  collarStyle: 'low-cut' | 'mid-collar' | 'high-collar';
  upperMaterial: string;
  shoeSizes: Array<{ size: number; stock: number }>;
  proTier: 'Elite' | 'Pro' | 'Academy' | 'Club';
}

export interface CosmeticsAttributes {
  category: 'cosmetics-beauty';
  skinTypes: Array<'all' | 'dry' | 'oily' | 'combination' | 'sensitive'>;
  keyIngredients: string[];
  fullIngredients: string;
  usageInstructions: string;
  safetyWarnings: string;
  isCrueltyFree: boolean;
  isVegan: boolean;
  volume: string;
  shades?: Array<{ name: string; hex: string; inStock: boolean }>;
}

export interface BulkDiscountTier {
  minQuantity: number;
  discountPercent: number; // e.g. 10 for 10%
}

export interface OfficeSuppliesAttributes {
  category: 'school-office';
  packQuantity: number;
  isBundleEligible: boolean;
  bundleIncludes?: string[];
  bulkDiscountTiers: BulkDiscountTier[];
  paperGsm?: number;
  dimensions?: string;
  colorAssortment?: string[];
}

export type ProductAttributes =
  | TechAttributes
  | ApparelAttributes
  | SportsCleatsAttributes
  | CosmeticsAttributes
  | OfficeSuppliesAttributes;

export type Product = BaseProduct & {
  attributes: ProductAttributes;
};

export interface ProductFilterQuery {
  category?: ProductCategory | 'all';
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStockOnly?: boolean;
  groundType?: string;
  gender?: string;
  skinType?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
