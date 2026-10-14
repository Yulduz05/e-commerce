import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getProducts } from '@/app/api/products/route';
import { GET as getProductById } from '@/app/api/products/[id]/route';
import { POST as validateCart } from '@/app/api/cart/validate/route';
import { POST as checkout } from '@/app/api/checkout/route';
import { inventoryManager } from '@/lib/db/inventoryManager';

describe('OmniStore API Endpoints Integration Test Suite', () => {
  beforeEach(() => {
    inventoryManager.initializeFromProducts();
  });

  it('GET /api/products returns filtered catalog with facets', async () => {
    const req = new NextRequest('http://localhost:3000/api/products?category=sports-cleats&groundType=FG');
    const res = await getProducts(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);
    // All returned items must be sports-cleats with groundType FG
    data.products.forEach((p: any) => {
      expect(p.category).toBe('sports-cleats');
      expect(p.attributes.groundType).toBe('FG');
    });
    expect(data.facets).toBeDefined();
    expect(data.facets.brands.length).toBeGreaterThan(0);
  });

  it('GET /api/products/[id] retrieves product by ID or slug', async () => {
    const req = new NextRequest('http://localhost:3000/api/products/tech-01');
    const params = Promise.resolve({ id: 'tech-01' });
    const res = await getProductById(req, { params });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.product.id).toBe('tech-01');
    expect(data.product.attributes.category).toBe('computers-tech');
    expect(data.product.attributes.cpu).toBeDefined();
  });

  it('POST /api/cart/validate calculates authoritative totals & detects bulk tiers', async () => {
    const body = {
      items: [
        {
          productId: 'office-02', // Fineliner 12-pack ($24.50)
          quantity: 6, // Triggers 20% tier
        },
      ],
      promoCode: 'WELCOME10',
    };

    const req = new NextRequest('http://localhost:3000/api/cart/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const res = await validateCart(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.valid).toBe(true);
    expect(data.items[0].appliedBulkDiscountPercent).toBe(20);
    expect(data.totals.appliedPromoCode).toBe('WELCOME10');
    expect(data.totals.bulkDiscountTotal).toBeGreaterThan(0);
    expect(data.totals.promoDiscountTotal).toBeGreaterThan(0);
  });

  it('POST /api/checkout atomically deduces stock and returns receipt summary', async () => {
    const initialStock = inventoryManager.getAvailableStock('beauty-02');

    const body = {
      items: [
        {
          productId: 'beauty-02',
          quantity: 2,
        },
      ],
      shippingAddress: {
        fullName: 'Jordan Miller',
        email: 'jordan@example.com',
        phone: '555-0199',
        street: '100 Main Street',
        city: 'Portland',
        state: 'OR',
        postalCode: '97201',
        country: 'US',
      },
      payment: {
        method: 'test_card',
        cardNumberMasked: '4242 •••• •••• 4242',
        isSimulatedSuccess: true,
      },
    };

    const req = new NextRequest('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const res = await checkout(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.orderId).toMatch(/^OMNI-/);
    expect(data.trackingNumber).toMatch(/^TRK-/);
    expect(data.receiptSummary.itemCount).toBe(2);

    // Verify atomic inventory reduction
    const updatedStock = inventoryManager.getAvailableStock('beauty-02');
    expect(updatedStock).toBe(initialStock - 2);
  });

  it('POST /api/checkout cleanly rejects orders when stock is insufficient', async () => {
    const body = {
      items: [
        {
          productId: 'tech-02', // Titan Valkyrie (7 in stock)
          quantity: 999,
        },
      ],
      shippingAddress: {
        fullName: 'Attacker',
        email: 'attack@test.com',
        street: '123 Fake St',
        city: 'Nowhere',
        state: 'NA',
        postalCode: '00000',
        country: 'US',
      },
      payment: {
        method: 'test_card',
        cardNumberMasked: '4242',
        isSimulatedSuccess: true,
      },
    };

    const req = new NextRequest('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const res = await checkout(req);
    expect(res.status).toBe(400); // Fails cart validation check

    const data = await res.json();
    expect(data.success).toBe(false);
  });
});
