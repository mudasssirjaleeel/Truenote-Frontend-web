// types/wishlist.types.ts

export interface WishlistProduct {
    id: string;
    name: string;
    subtitle: string | null;
    description: string | null;
    price: number;
    imageUrl: string | null;
    imageUrls: string[];
    isAvailable: boolean;
    categoryId: string;
}

export interface WishlistBean {
    id: string;
    name: string;
    origin: string;
    weight: number;
    price: number;
    imageUrl: string | null;
    imageUrls: string[];
    description: string | null;
    isDark: boolean;
    isAvailable: boolean;
}

export interface WishlistItem {
    id: string;
    type: 'coffee' | 'bean';
    name: string;
    origin?: string;
    weight?: number;
    price: number;
    imageUrl: string | null;
    imageUrls: string[];
    description: string | null;
    isAvailable: boolean;
    wishlistId: string;
    addedAt: string;
    // Coffee specific
    subtitle?: string;
    categoryId?: string;
    // Bean specific
    isDark?: boolean;
}

export interface AddToWishlistPayload {
    type: 'coffee' | 'bean';
    productId?: string;
    beanId?: string;
}

export interface WishlistResponse {
    wishlist: WishlistItem[];
}

export interface AddToWishlistResponse {
    success: boolean;
    wishlistId: string;
}

export interface RemoveFromWishlistResponse {
    success: boolean;
}