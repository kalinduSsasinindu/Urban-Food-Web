export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: GeoCoordinates;
}

export interface GeoCoordinates {
    latitude: number;
    longitude: number;
}

export interface BusinessHours {
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}

export interface UserProfileUpdateDto {
    name: string;
    phone: string;
    address: Address;
}

export interface SellerProfileUpdateDto {
    storeName: string;
    storeDescription: string;
    businessHours: { [key: string]: BusinessHours };
}

export interface User {
    id?: string;
    clientId?: string;
    email?: string;
    name?: string;
    phone?: string;
    profilePictureUrl?: string;
    userRole?: 'Customer' | 'Seller' | 'Admin';
    address?: Address;
    sellerProfile?: SellerProfile;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginDate?: Date;
    isActive?: boolean;
    isDeleted?: boolean;
}

export interface StoreDetails {
    storeName?: string;
    storeDescription?: string;
}
///csdagasdm sfdkh bdfkbhj vfhfdkjgbn, 
export interface SellerProfile {
    storeDetails?: StoreDetails;
    sellerReviews?: SellerReview[];
    averageRating?: number;
    isVerifiedSeller?: boolean;
}

export interface SellerReview {
    id?: string;
    reviewerId?: string;
    reviewerName?: string;
    reviewerProfilePicture?: string;
    sellerId?: string;
    rating?: number;
    comment?: string;
    reviewImages?: string[];
    likesCount?: number;
    isFeatured?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    isVerified?: boolean;
    isDeleted?: boolean;
}