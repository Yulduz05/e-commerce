import { NextRequest, NextResponse } from 'next/server';
import { validateAndCalculateCart } from '@/lib/security/priceValidator';
import { CartValidationRequest } from '@/types/cart';

export async function POST(request: NextRequest) {
  try {
    const body: CartValidationRequest = await request.json();

    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json(
        { valid: false, errors: ['Invalid request format. "items" array is required.'] },
        { status: 400 }
      );
    }

    const validationResult = validateAndCalculateCart(body);

    return NextResponse.json(validationResult);
  } catch (error) {
    console.error('API /api/cart/validate error:', error);
    return NextResponse.json(
      { valid: false, errors: ['Failed to validate cart data.'] },
      { status: 500 }
    );
  }
}
