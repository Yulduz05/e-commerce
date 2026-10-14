import { NextRequest, NextResponse } from 'next/server';
import { validateAndCalculateCart } from '@/lib/security/priceValidator';
import { inventoryManager } from '@/lib/db/inventoryManager';
import { sanitizeInput } from '@/lib/security/sanitizer';
import { CheckoutRequest, CheckoutResponse } from '@/types/cart';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json<CheckoutResponse>(
        { success: false, error: 'Checkout requires at least one item.' },
        { status: 400 }
      );
    }

    if (!body.shippingAddress || !body.shippingAddress.fullName || !body.shippingAddress.email) {
      return NextResponse.json<CheckoutResponse>(
        { success: false, error: 'Valid shipping address and contact email are required.' },
        { status: 400 }
      );
    }

    // 1. Authoritative price & stock calculation
    const cartValidation = validateAndCalculateCart({
      items: body.items,
      promoCode: body.promoCode,
    });

    if (!cartValidation.valid || cartValidation.items.length === 0) {
      return NextResponse.json<CheckoutResponse>(
        {
          success: false,
          error: `Cart validation failed: ${cartValidation.errors.join('; ')}`,
        },
        { status: 400 }
      );
    }

    // 2. Prepare atomic deduction list
    const deductionItems = cartValidation.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      variantKey: item.selectedVariants?.size ? `size-${item.selectedVariants.size}` : undefined,
    }));

    // 3. Atomically deduct inventory
    const deductionResult = inventoryManager.deduct(deductionItems);
    if (!deductionResult.success) {
      return NextResponse.json<CheckoutResponse>(
        {
          success: false,
          error: deductionResult.error || 'Inventory deduction failed.',
        },
        { status: 409 }
      );
    }

    // 4. Generate order confirmation details
    const orderId = `OMNI-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const trackingNumber = `TRK-${crypto.randomBytes(4).toString('hex').toUpperCase()}-US`;
    const orderDate = new Date().toISOString();

    const sanitizedAddress = {
      fullName: sanitizeInput(body.shippingAddress.fullName),
      email: sanitizeInput(body.shippingAddress.email),
      phone: sanitizeInput(body.shippingAddress.phone),
      street: sanitizeInput(body.shippingAddress.street),
      apartment: body.shippingAddress.apartment ? sanitizeInput(body.shippingAddress.apartment) : undefined,
      city: sanitizeInput(body.shippingAddress.city),
      state: sanitizeInput(body.shippingAddress.state),
      postalCode: sanitizeInput(body.shippingAddress.postalCode),
      country: sanitizeInput(body.shippingAddress.country),
    };

    const response: CheckoutResponse = {
      success: true,
      orderId,
      trackingNumber,
      orderDate,
      receiptSummary: {
        totals: cartValidation.totals,
        shippingAddress: sanitizedAddress,
        itemCount: cartValidation.totals.itemCount,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API /api/checkout error:', error);
    return NextResponse.json<CheckoutResponse>(
      { success: false, error: 'Internal server error while processing checkout.' },
      { status: 500 }
    );
  }
}
