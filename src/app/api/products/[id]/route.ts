import { NextRequest, NextResponse } from 'next/server';
import { productRepository } from '@/lib/db/productRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required.' }, { status: 400 });
    }

    // Try finding by id or by slug
    const product = productRepository.getById(id) || productRepository.getBySlug(id);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('API /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching product.' },
      { status: 500 }
    );
  }
}
