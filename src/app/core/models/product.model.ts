export enum ProductType {
  Fruit = 1,
  Vegetable = 2,
  DairyProduct = 3,
  BakedGood = 4,
  HandmadeCraft = 5
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images?: string[];
  imgUrls?: string[];
  productType: ProductType;
  variants: ProductVariant[];
  options: VariantOption[];
  tags?: string[];
  productReviews?: ProductReview[];
  averageRating?: number;
  reviewCount?: number;
  featuredReviewId?: string;
}

export interface ProductReview {
  id?: string;
  productId?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewerProfilePicture?: string;
  rating?: number;
  comment?: string;
  reviewImages?: string[];
  likesCount?: number;
  isFeatured?: boolean;
  createdAt?: Date;
  isVerified?: boolean;
  isDeleted?: boolean;
}

export interface CreateProductReviewDto {
  rating?: number;
  comment?: string;
  reviewImages?: string[];
}

export interface UpdateProductReviewDto {
  rating?: number;
  comment?: string;
  newReviewImages?: string[];
  imageUrlsToRemove?: string[];
}

export interface ProductReviewSummary {
  averageRating?: number;
  reviewCount?: number;
  featuredReview?: ProductReview;
  ratingDistribution?: { [key: number]: number };
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
  originalPrice?: number;
  discountPercentage?: number;
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
  originalPrice?: number;
  discountPercentage?: number;
  rating?: number;
  reviewsCount?: number;
  soldCount?: number;
  deliveryTime?: string;
  variants?: string[];
}

export interface MediaServiceDto {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  size: number;
} 