import { ProductType } from './product.model';

export enum PaymentOptions {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPAL = 'PAYPAL'
}

export interface OrderSearchResponse {
  id: string;
  orderNumber?: string;
  orderDate: Date;
  customerId: string;
  customerName?: string;
  total: number;
  orderStatus: string;
  fulfillmentStatus: string;
  paymentStatus: string;
}

export interface LineItem {
  fulfillableQuantity?: number;
  fulfillmentStatus?: string;
  name?: string;
  price: number;
  productId: string;
  quantity: number;
  title: string;
  variantTitle?: string;
  imageUrl?: string;
  variantId: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Payment {
  id?: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
}

export interface PaymentInfo {
  paymentOption: string;
  paid?: boolean;
  payments?: Payment[];
  totalPaidAmount?: number;
}

export interface TimeLineDetails {
  createdAt?: Date;
  comment: string;
  images?: string[];
  imgUrls?: string[];
}

export interface Order {
  id?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  name?: string;
  note?: string;
  paymentMethod?: string[];
  phone?: string;
  subtotalPrice: number;
  totalLineItemsPrice: number;
  totalPrice: number;
  totalShippingPrice: number;
  totalDiscountPrice: number;
  shippingAddress: ShippingAddress;
  customer: CustomerInfo;
  lineItems: LineItem[];
  paymentInfo: PaymentInfo;
  isCancelled?: boolean;
  timeLineDetails?: TimeLineDetails[];
  tags?: string[];
}

export interface OrderPaymentWebDto {
  subtotalPrice?: number;
  totalLineItemsPrice?: number;
  totalPrice?: number;
  totalShippingPrice?: number;
  totalDiscountPrice?: number;
} 