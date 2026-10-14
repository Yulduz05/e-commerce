import { describe, it, expect, beforeEach } from 'vitest';
import { inventoryManager } from '@/lib/db/inventoryManager';

describe('Inventory Manager Stock Control & Atomic Bounds', () => {
  beforeEach(() => {
    inventoryManager.initializeFromProducts();
  });

  it('correctly tracks available stock for products and variants', () => {
    const stock = inventoryManager.getAvailableStock('tech-01');
    expect(stock).toBe(18);

    const variantStock = inventoryManager.getAvailableStock('cleats-01', 'size-9');
    expect(variantStock).toBe(6);
  });

  it('atomically deducts stock when sufficient inventory exists', () => {
    const deductRes = inventoryManager.deduct([
      { productId: 'tech-01', quantity: 2 },
    ]);

    expect(deductRes.success).toBe(true);
    expect(inventoryManager.getAvailableStock('tech-01')).toBe(16);
  });

  it('rejects deduction and preserves state when requested quantity exceeds inventory', () => {
    const initialStock = inventoryManager.getAvailableStock('tech-02'); // 7 units in stock
    const deductRes = inventoryManager.deduct([
      { productId: 'tech-02', quantity: 99 },
    ]);

    expect(deductRes.success).toBe(false);
    expect(deductRes.error).toContain('Insufficient inventory');
    // Ensure stock remained intact
    expect(inventoryManager.getAvailableStock('tech-02')).toBe(initialStock);
  });

  it('restores stock accurately upon order cancellation', () => {
    inventoryManager.deduct([{ productId: 'apparel-01', quantity: 3 }]);
    expect(inventoryManager.getAvailableStock('apparel-01')).toBe(19);

    inventoryManager.restore([{ productId: 'apparel-01', quantity: 3 }]);
    expect(inventoryManager.getAvailableStock('apparel-01')).toBe(22);
  });
});
