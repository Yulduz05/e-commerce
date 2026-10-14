import { productRepository } from './productRepository';

interface InventoryEntry {
  stock: number;
  variantStocks: Record<string, number>; // variantKey -> stock
}

class InventoryManager {
  private inventory: Map<string, InventoryEntry> = new Map();

  constructor() {
    this.initializeFromProducts();
  }

  public initializeFromProducts() {
    const products = productRepository.getAll();
    for (const p of products) {
      const variantStocks: Record<string, number> = {};

      if (p.attributes.category === 'clothing-apparel') {
        p.attributes.sizes.forEach((s) => {
          variantStocks[`size-${s.size}`] = s.stock;
        });
      } else if (p.attributes.category === 'sports-cleats') {
        p.attributes.shoeSizes.forEach((s) => {
          variantStocks[`size-${s.size}`] = s.stock;
        });
      }

      this.inventory.set(p.id, {
        stock: p.stock,
        variantStocks,
      });
    }
  }

  public getAvailableStock(productId: string, variantKey?: string): number {
    const entry = this.inventory.get(productId);
    if (!entry) return 0;

    if (variantKey && entry.variantStocks[variantKey] !== undefined) {
      return entry.variantStocks[variantKey];
    }
    return entry.stock;
  }

  public canFulfill(productId: string, requestedQty: number, variantKey?: string): boolean {
    const available = this.getAvailableStock(productId, variantKey);
    return available >= requestedQty && requestedQty > 0;
  }

  public deduct(
    items: Array<{ productId: string; quantity: number; variantKey?: string }>
  ): { success: boolean; error?: string } {
    // 1. Verify all items first (atomic check)
    for (const item of items) {
      if (!this.canFulfill(item.productId, item.quantity, item.variantKey)) {
        const prod = productRepository.getById(item.productId);
        const name = prod ? prod.name : item.productId;
        const available = this.getAvailableStock(item.productId, item.variantKey);
        return {
          success: false,
          error: `Insufficient inventory for "${name}". Requested: ${item.quantity}, Available: ${available}`,
        };
      }
    }

    // 2. Perform atomic deduction
    for (const item of items) {
      const entry = this.inventory.get(item.productId);
      if (entry) {
        entry.stock = Math.max(0, entry.stock - item.quantity);
        if (item.variantKey && entry.variantStocks[item.variantKey] !== undefined) {
          entry.variantStocks[item.variantKey] = Math.max(
            0,
            entry.variantStocks[item.variantKey] - item.quantity
          );
        }
      }
    }

    return { success: true };
  }

  public restore(items: Array<{ productId: string; quantity: number; variantKey?: string }>) {
    for (const item of items) {
      const entry = this.inventory.get(item.productId);
      if (entry) {
        entry.stock += item.quantity;
        if (item.variantKey && entry.variantStocks[item.variantKey] !== undefined) {
          entry.variantStocks[item.variantKey] += item.quantity;
        }
      }
    }
  }
}

export const inventoryManager = new InventoryManager();
