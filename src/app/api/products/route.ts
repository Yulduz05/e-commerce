import { NextRequest, NextResponse } from 'next/server';
import { productRepository } from '@/lib/db/productRepository';
import { sanitizeInput } from '@/lib/security/sanitizer';
import { ProductCategory, ProductFilterQuery } from '@/types/product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category') as ProductCategory | 'all' | null;
    const searchRaw = searchParams.get('search') || undefined;
    const search = searchRaw ? sanitizeInput(searchRaw) : undefined;
    const brand = searchParams.get('brand') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const groundType = searchParams.get('groundType') || undefined;
    const gender = searchParams.get('gender') || undefined;
    const skinType = searchParams.get('skinType') || undefined;
    const sortBy = (searchParams.get('sortBy') as ProductFilterQuery['sortBy']) || 'featured';

    const filterQuery: ProductFilterQuery = {
      category: category || 'all',
      search,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStockOnly,
      groundType,
      gender,
      skinType,
      sortBy,
    };

    const { products, total } = productRepository.filter(filterQuery);
    const facets = productRepository.getFacets();

    return NextResponse.json({
      success: true,
      total,
      products,
      facets,
    });
  } catch (error) {
    console.error('API /api/products error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching catalog.' },
      { status: 500 }
    );
  }
}
