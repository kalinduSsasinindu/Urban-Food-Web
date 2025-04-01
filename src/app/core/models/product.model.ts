export interface Product {
  id?: string;
  title: string;
  description: string;
  images?: string[];
  imgUrls?: string[];
  variants?: ProductVariant[];
  options?: VariantOption[];
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductVariant {
  variantId: number;
  sku: string;
  name: string;
  price?: number;
  availableQuantity?: number;
  committedQuantity?: number;
  isActive: boolean;
  onHandQuantity?: number;
}

export interface VariantOption {
  name: string;
  values: string[];
}

export interface ProductSearchResponse {
  id?: string;
  title: string;
  description: string;
  imgUrls?: string[];
  tags?: string[];
}

export interface MediaServiceDto {
  productId: string;
  newMediaBase64: string[];
  mediaUpdates: MediaUpdate[];
}

export interface MediaUpdate {
  url: string;
  isDeleted: boolean;
} 