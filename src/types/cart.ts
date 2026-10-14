import { Product, WarrantyOption } from './product';

export interface SelectedVariants {
  size?: string | number;
  color?: string;
  ram?: string;
  storage?: string;
  shade?: string;
  warranty?: WarrantyOption;
}

export interface CartLineItem {
  id: string; // unique item entry id (e.g. productId-variantHash)
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants: SelectedVariants;
  lineSubtotal: number; // calculated server-side or optimistically
  appliedBulkDiscountPercent?: number;
  discountedUnitPrice?: number;
}

export interface CartTotals {
  subtotal: number;
  bulkDiscountTotal: number;
  promoDiscountTotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  appliedPromoCode?: string;
}

export interface CartValidationRequest {
  items: Array<{
    productId: string;
    quantity: number;
    selectedVariants?: {
      size?: string | number;
      color?: string;
      ram?: string;
      storage?: string;
      shade?: string;
      warrantyId?: string;
    };
  }>;
  promoCode?: string;
}

export interface CartValidationResponse {
  valid: boolean;
  errors: string[];
  items: CartLineItem[];
  totals: CartTotals;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentSimulation {
  method: 'test_card' | 'apple_pay_sim' | 'crypto_sim';
  cardNumberMasked: string;
  isSimulatedSuccess: boolean;
}

export interface CheckoutRequest {
  items: CartValidationRequest['items'];
  shippingAddress: ShippingAddress;
  payment: PaymentSimulation;
  promoCode?: string;
}

export interface CheckoutResponse {
  success: boolean;
  orderId?: string;
  trackingNumber?: string;
  orderDate?: string;
  receiptSummary?: {
    totals: CartTotals;
    shippingAddress: ShippingAddress;
    itemCount: number;
  };
  error?: string;
}
