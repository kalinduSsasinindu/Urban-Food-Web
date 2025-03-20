export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
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
    id: string;
    googleId: string;
    clientId?: string;
    email: string;
    name: string;
    phone: string;
    profilePictureUrl: string;
    userRole: 'Customer' | 'Seller' | 'Admin';
    address: Address;
    storeName?: string;
    storeDescription?: string;
    businessHours?: { [key: string]: BusinessHours };
    isVerifiedSeller?: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginDate?: Date;
    isEmailVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;
}