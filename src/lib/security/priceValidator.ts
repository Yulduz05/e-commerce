import { productRepository } from '../db/productRepository';
import { inventoryManager } from '../db/inventoryManager';
import {
  CartLineItem,
  CartTotals,
  CartValidationRequest,
  CartValidationResponse,
  SelectedVariants,
} from '@/types/cart';
import { WarrantyOption } from '@/types/product';

export const PROMO_CODES: Record<string, { type: 'percent' | 'free_shipping'; value: number }> = {
  WELCOME10: { type: 'percent', value: 10 },
  CYBER20: { type: 'percent', value: 20 },
  OMNIFREE: { type: 'free_shipping', value: 0 },
};

export function validateAndCalculateCart(request: CartValidationRequest): CartValidationResponse {
  const errors: string[] = [];
  const items: CartLineItem[] = [];
  let subtotal = 0;
  let bulkDiscountTotal = 0;
  let itemCount = 0;

  for (const rawItem of request.items) {
    if (!rawItem.productId || typeof rawItem.quantity !== 'number' || rawItem.quantity <= 0) {
      errors.push(`Invalid cart item format or non-positive quantity.`);
      continue;
    }

    const product = productRepository.getById(rawItem.productId);
    if (!product) {
      errors.push(`Product with ID "${rawItem.productId}" not found.`);
      continue;
    }

    // Determine variant key for inventory check if applicable
    let variantKey: string | undefined;
    if (rawItem.selectedVariants?.size) {
      variantKey = `size-${rawItem.selectedVariants.size}`;
    }

    // Inventory check
    const available = inventoryManager.getAvailableStock(product.id, variantKey);
    const quantity = Math.min(rawItem.quantity, Math.max(available, 0));

    if (available <= 0) {
      errors.push(`"${product.name}" is currently out of stock.`);
      continue;
    } else if (rawItem.quantity > available) {
      errors.push(
        `Quantity for "${product.name}" adjusted from ${rawItem.quantity} to available stock (${available}).`
      );
    }

    // Resolve warranty add-on server-side
    let selectedWarranty: WarrantyOption | undefined;
    let warrantyPrice = 0;
    if (
      product.attributes.category === 'computers-tech' &&
      rawItem.selectedVariants?.warrantyId
    ) {
      const foundWarranty = product.attributes.warrantyOptions.find(
        (w) => w.id === rawItem.selectedVariants?.warrantyId
      );
      if (foundWarranty) {
        selectedWarranty = foundWarranty;
        warrantyPrice = foundWarranty.price;
      }
    }

    // Calculate Bulk Discount for School & Office Supplies
    let appliedBulkDiscountPercent = 0;
    if (product.attributes.category === 'school-office' && product.attributes.bulkDiscountTiers) {
      // Find highest tier matching quantity
      const sortedTiers = [...product.attributes.bulkDiscountTiers].sort(
        (a, b) => b.minQuantity - a.minQuantity
      );
      for (const tier of sortedTiers) {
        if (quantity >= tier.minQuantity) {
          appliedBulkDiscountPercent = tier.discountPercent;
          break;
        }
      }
    }

    const baseUnitPrice = product.price;
    const discountedUnitPrice =
      appliedBulkDiscountPercent > 0
        ? Number((baseUnitPrice * (1 - appliedBulkDiscountPercent / 100)).toFixed(2))
        : baseUnitPrice;

    const unitPriceWithWarranty = discountedUnitPrice + warrantyPrice;
    const lineSubtotal = Number((unitPriceWithWarranty * quantity).toFixed(2));
    const normalLineSubtotal = Number(((baseUnitPrice + warrantyPrice) * quantity).toFixed(2));
    const itemBulkSavings = Number((normalLineSubtotal - lineSubtotal).toFixed(2));

    subtotal += normalLineSubtotal;
    bulkDiscountTotal += itemBulkSavings;
    itemCount += quantity;

    const resolvedVariants: SelectedVariants = {
      size: rawItem.selectedVariants?.size,
      color: rawItem.selectedVariants?.color,
      ram: rawItem.selectedVariants?.ram,
      storage: rawItem.selectedVariants?.storage,
      shade: rawItem.selectedVariants?.shade,
      warranty: selectedWarranty,
    };

    const lineItemId = `${product.id}-${resolvedVariants.size || ''}-${resolvedVariants.color || ''}-${resolvedVariants.shade || ''}-${selectedWarranty?.id || ''}`;

    items.push({
      id: lineItemId,
      productId: product.id,
      product,
      quantity,
      selectedVariants: resolvedVariants,
      lineSubtotal,
      appliedBulkDiscountPercent: appliedBulkDiscountPercent > 0 ? appliedBulkDiscountPercent : undefined,
      discountedUnitPrice,
    });
  }

  // Calculate promotional code discount
  let promoDiscountTotal = 0;
  let isFreeShippingPromo = false;

  if (request.promoCode && request.promoCode.trim()) {
    const code = request.promoCode.trim().toUpperCase();
    const promo = PROMO_CODES[code];
    if (promo) {
      if (promo.type === 'percent') {
        const netSubtotal = Math.max(0, subtotal - bulkDiscountTotal);
        promoDiscountTotal = Number(((netSubtotal * promo.value) / 100).toFixed(2));
      } else if (promo.type === 'free_shipping') {
        isFreeShippingPromo = true;
      }
    } else {
      errors.push(`Invalid or expired promo code: "${request.promoCode}"`);
    }
  }

  const netAfterDiscounts = Math.max(0, subtotal - bulkDiscountTotal - promoDiscountTotal);

  // Shipping calculation: Free over $100 or promo code, else $9.99
  const shipping = netAfterDiscounts >= 100 || isFreeShippingPromo || itemCount === 0 ? 0 : 9.99;

  // Tax calculation: 8.25%
  const tax = Number((netAfterDiscounts * 0.0825).toFixed(2));

  // Grand total
  const total = Number((netAfterDiscounts + shipping + tax).toFixed(2));

  const totals: CartTotals = {
    subtotal: Number(subtotal.toFixed(2)),
    bulkDiscountTotal: Number(bulkDiscountTotal.toFixed(2)),
    promoDiscountTotal: Number(promoDiscountTotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax,
    total,
    itemCount,
    appliedPromoCode: request.promoCode?.trim().toUpperCase(),
  };

  return {
    valid: errors.length === 0,
    errors,
    items,
    totals,
  };
}
