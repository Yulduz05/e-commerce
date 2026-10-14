import { describe, it, expect } from 'vitest';
import { validateAndCalculateCart } from '@/lib/security/priceValidator';
import { productRepository } from '@/lib/db/productRepository';

describe('OmniStore Cart Calculations & Anti-Tamper Security', () => {
  it('correctly calculates basic cart subtotal, tax, and standard shipping under $100', () => {
    // Single tee ($42.00)
    const result = validateAndCalculateCart({
      items: [
        {
          productId: 'apparel-02',
          quantity: 1,
          selectedVariants: { size: 'M', color: 'Vintage White' },
        },
      ],
    });

    expect(result.valid).toBe(true);
    expect(result.items.length).toBe(1);
    expect(result.totals.subtotal).toBe(42.0);
    // Shipping under $100 is $9.99
    expect(result.totals.shipping).toBe(9.99);
    // Tax is 8.25% of 42.00 = 3.47
    expect(result.totals.tax).toBe(3.47);
    // Total = 42.00 + 9.99 + 3.47 = 55.46
    expect(result.totals.total).toBe(55.46);
  });

  it('applies free shipping when subtotal exceeds $100', () => {
    // 3 tees = 3 * 42 = $126.00
    const result = validateAndCalculateCart({
      items: [
        {
          productId: 'apparel-02',
          quantity: 3,
        },
      ],
    });

    expect(result.valid).toBe(true);
    expect(result.totals.subtotal).toBe(126.0);
    expect(result.totals.shipping).toBe(0);
    expect(result.totals.tax).toBe(10.4);
    expect(result.totals.total).toBe(136.4);
  });

  it('triggers bulk volume discount tiers for school & office supplies', () => {
    // Artisan Dot Journal: 1 = $26.00
    // Tiers: 3+ -> 10% off ($23.40 each), 5+ -> 15% off ($22.10 each), 10+ -> 25% off ($19.50 each)
    const result = validateAndCalculateCart({
      items: [
        {
          productId: 'office-01',
          quantity: 5, // Triggers 15% tier
        },
      ],
    });

    expect(result.valid).toBe(true);
    const lineItem = result.items[0];
    expect(lineItem.appliedBulkDiscountPercent).toBe(15);
    // Base unit price $26, discounted unit price 26 * 0.85 = 22.10
    expect(lineItem.discountedUnitPrice).toBe(22.1);
    // Line subtotal = 5 * 22.10 = 110.50
    expect(lineItem.lineSubtotal).toBe(110.5);
    // Normal subtotal was 5 * 26 = 130.00
    expect(result.totals.subtotal).toBe(130.0);
    expect(result.totals.bulkDiscountTotal).toBe(19.5);
    // Since net 110.50 > 100, shipping is free
    expect(result.totals.shipping).toBe(0);
  });

  it('applies promotional coupon code WELCOME10 (10% discount)', () => {
    const result = validateAndCalculateCart({
      items: [
        {
          productId: 'beauty-01', // HydraGlow Serum $68.00
          quantity: 2, // 2 * 68 = 136.00
        },
      ],
      promoCode: 'WELCOME10',
    });

    expect(result.valid).toBe(true);
    expect(result.totals.subtotal).toBe(136.0);
    // 10% of 136.00 = 13.60
    expect(result.totals.promoDiscountTotal).toBe(13.6);
    // Net subtotal = 136.00 - 13.60 = 122.40
    // Tax: 122.40 * 0.0825 = 10.10
    expect(result.totals.tax).toBe(10.1);
    expect(result.totals.total).toBe(132.5);
  });

  it('rejects client-side price tampering by enforcing database price', () => {
    // Malicious payload attempting to inject price: 0.01 for a $2399.99 laptop
    const maliciousPayload: any = {
      items: [
        {
          productId: 'tech-01',
          quantity: 1,
          price: 0.01, // Client spoof attempt
        },
      ],
    };

    const result = validateAndCalculateCart(maliciousPayload);
    expect(result.valid).toBe(true);
    // Must strictly equal real product price of $2399.99, ignoring the client spoof
    const realProduct = productRepository.getById('tech-01')!;
    expect(result.totals.subtotal).toBe(realProduct.price);
    expect(result.totals.subtotal).toBe(2399.99);
  });

  it('accurately prices add-on warranty tiers for technology products', () => {
    // ApexBook Pro 16 with ApexCare+ 2-Year ($199.99)
    const result = validateAndCalculateCart({
      items: [
        {
          productId: 'tech-01',
          quantity: 1,
          selectedVariants: {
            warrantyId: 'warr-tech-02',
          },
        },
      ],
    });

    expect(result.valid).toBe(true);
    const item = result.items[0];
    expect(item.selectedVariants.warranty?.id).toBe('warr-tech-02');
    expect(item.selectedVariants.warranty?.price).toBe(199.99);
    // Subtotal: 2399.99 + 199.99 = 2599.98
    expect(result.totals.subtotal).toBe(2599.98);
  });
});
