'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';
import {
  CartLineItem,
  CartTotals,
  SelectedVariants,
  CartValidationResponse,
} from '@/types/cart';

interface CartState {
  items: CartLineItem[];
  totals: CartTotals;
  isOpen: boolean;
  isBouncing: boolean;
  promoCode: string;
  isValidating: boolean;
  validationErrors: string[];
  isHydrated: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, selectedVariants?: SelectedVariants) => void;
  removeItem: (lineItemId: string) => void;
  updateQuantity: (lineItemId: string, quantity: number) => void;
  setPromoCode: (code: string) => void;
  validateWithServer: () => Promise<void>;
  clearCart: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const initialTotals: CartTotals = {
  subtotal: 0,
  bulkDiscountTotal: 0,
  promoDiscountTotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
};

function calculateLocalTotals(items: CartLineItem[], promoCode: string): CartTotals {
  let subtotal = 0;
  let bulkDiscountTotal = 0;
  let itemCount = 0;

  for (const item of items) {
    const warrantyPrice = item.selectedVariants?.warranty?.price || 0;
    const basePrice = item.product.price;
    const unitPrice = basePrice + warrantyPrice;

    // Check bulk discount for office supplies
    let appliedDiscount = 0;
    if (
      item.product.attributes.category === 'school-office' &&
      item.product.attributes.bulkDiscountTiers
    ) {
      const sortedTiers = [...item.product.attributes.bulkDiscountTiers].sort(
        (a, b) => b.minQuantity - a.minQuantity
      );
      for (const tier of sortedTiers) {
        if (item.quantity >= tier.minQuantity) {
          appliedDiscount = tier.discountPercent;
          break;
        }
      }
    }

    const discountedUnit = appliedDiscount > 0 ? unitPrice * (1 - appliedDiscount / 100) : unitPrice;
    const normalSub = unitPrice * item.quantity;
    const itemSavings = (unitPrice - discountedUnit) * item.quantity;

    subtotal += normalSub;
    bulkDiscountTotal += itemSavings;
    itemCount += item.quantity;
  }

  let promoDiscountTotal = 0;
  let isFreeShipping = false;
  const upperCode = promoCode.trim().toUpperCase();

  if (upperCode === 'WELCOME10') {
    const net = Math.max(0, subtotal - bulkDiscountTotal);
    promoDiscountTotal = Number(((net * 10) / 100).toFixed(2));
  } else if (upperCode === 'CYBER20') {
    const net = Math.max(0, subtotal - bulkDiscountTotal);
    promoDiscountTotal = Number(((net * 20) / 100).toFixed(2));
  } else if (upperCode === 'OMNIFREE') {
    isFreeShipping = true;
  }

  const netAfterDiscounts = Math.max(0, subtotal - bulkDiscountTotal - promoDiscountTotal);
  const shipping = netAfterDiscounts >= 100 || isFreeShipping || itemCount === 0 ? 0 : 9.99;
  const tax = Number((netAfterDiscounts * 0.0825).toFixed(2));
  const total = Number((netAfterDiscounts + shipping + tax).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    bulkDiscountTotal: Number(bulkDiscountTotal.toFixed(2)),
    promoDiscountTotal: Number(promoDiscountTotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax,
    total,
    itemCount,
    appliedPromoCode: promoCode ? upperCode : undefined,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totals: initialTotals,
      isOpen: false,
      isBouncing: false,
      promoCode: '',
      isValidating: false,
      validationErrors: [],
      isHydrated: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setHydrated: (isHydrated) => set({ isHydrated }),

      addItem: (product, quantity = 1, selectedVariants = {}) => {
        const state = get();
        const warrantyId = selectedVariants.warranty?.id || '';
        const size = selectedVariants.size ? String(selectedVariants.size) : '';
        const color = selectedVariants.color || '';
        const shade = selectedVariants.shade || '';

        const lineItemId = `${product.id}-${size}-${color}-${shade}-${warrantyId}`;
        const existingIndex = state.items.findIndex((item) => item.id === lineItemId);

        let newItems = [...state.items];

        if (existingIndex > -1) {
          const currentItem = newItems[existingIndex];
          const newQty = currentItem.quantity + quantity;
          const warrantyPrice = currentItem.selectedVariants.warranty?.price || 0;
          const unit = currentItem.product.price + warrantyPrice;

          newItems[existingIndex] = {
            ...currentItem,
            quantity: newQty,
            lineSubtotal: Number((unit * newQty).toFixed(2)),
          };
        } else {
          const warrantyPrice = selectedVariants.warranty?.price || 0;
          const unit = product.price + warrantyPrice;

          newItems.push({
            id: lineItemId,
            productId: product.id,
            product,
            quantity,
            selectedVariants,
            lineSubtotal: Number((unit * quantity).toFixed(2)),
          });
        }

        const newTotals = calculateLocalTotals(newItems, state.promoCode);

        set({
          items: newItems,
          totals: newTotals,
          isOpen: true,
          isBouncing: true,
        });

        // Clear bounce animation flag after 400ms
        setTimeout(() => {
          set({ isBouncing: false });
        }, 400);

        // Async server re-validation
        get().validateWithServer();
      },

      removeItem: (lineItemId) => {
        const state = get();
        const newItems = state.items.filter((item) => item.id !== lineItemId);
        const newTotals = calculateLocalTotals(newItems, state.promoCode);
        set({ items: newItems, totals: newTotals });
        get().validateWithServer();
      },

      updateQuantity: (lineItemId, quantity) => {
        const state = get();
        if (quantity <= 0) {
          get().removeItem(lineItemId);
          return;
        }

        const newItems = state.items.map((item) => {
          if (item.id === lineItemId) {
            const warrantyPrice = item.selectedVariants.warranty?.price || 0;
            const unit = item.product.price + warrantyPrice;
            return {
              ...item,
              quantity,
              lineSubtotal: Number((unit * quantity).toFixed(2)),
            };
          }
          return item;
        });

        const newTotals = calculateLocalTotals(newItems, state.promoCode);
        set({ items: newItems, totals: newTotals });
        get().validateWithServer();
      },

      setPromoCode: (promoCode) => {
        set({ promoCode });
        const state = get();
        const newTotals = calculateLocalTotals(state.items, promoCode);
        set({ totals: newTotals });
        get().validateWithServer();
      },

      validateWithServer: async () => {
        const state = get();
        if (state.items.length === 0) {
          set({ totals: initialTotals, validationErrors: [] });
          return;
        }

        set({ isValidating: true });
        try {
          const payload = {
            items: state.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              selectedVariants: {
                size: item.selectedVariants?.size,
                color: item.selectedVariants?.color,
                ram: item.selectedVariants?.ram,
                storage: item.selectedVariants?.storage,
                shade: item.selectedVariants?.shade,
                warrantyId: item.selectedVariants?.warranty?.id,
              },
            })),
            promoCode: state.promoCode,
          };

          const res = await fetch('/api/cart/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data: CartValidationResponse = await res.json();
            set({
              items: data.items,
              totals: data.totals,
              validationErrors: data.errors || [],
            });
          }
        } catch (err) {
          console.error('Server cart validation error:', err);
        } finally {
          set({ isValidating: false });
        }
      },

      clearCart: () => {
        set({
          items: [],
          totals: initialTotals,
          promoCode: '',
          validationErrors: [],
        });
      },
    }),
    {
      name: 'omnistore-cart-session',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null as any)),
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        state?.validateWithServer();
      },
    }
  )
);
