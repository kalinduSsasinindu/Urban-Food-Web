import { Product, ProductVariant } from './product.model';

export interface CartItem {
  id: string;
  productId: string;
  variantId: number; 
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variantTitle?: string;
  maxQuantity?: number;
  sellerId?: string;
  sellerName?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
} 