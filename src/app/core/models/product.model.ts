export interface Product {
  id: string;
  title: string;
  description: string;
  images?: string[];
  imgUrls?: string[];
  variants: ProductVariant[];
  options: VariantOption[];
  tags?: string[];
}

export interface VariantOption {
  name: string;
  values: string[];
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

export interface ProductSearchResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  imgUrl: string;
  tags: string[];
}

export interface MediaServiceDto {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  size: number;
} 