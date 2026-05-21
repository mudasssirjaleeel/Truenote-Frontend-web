// services/wishlistService.ts
import api from './api';
import type {
    WishlistResponse,
    AddToWishlistPayload,
    AddToWishlistResponse,
    RemoveFromWishlistResponse,
    WishlistItem
} from '@/types/wishlist.types';

class WishlistService {
    private readonly basePath = '/user/wishlist';

    /**
     * Get user's wishlist
     */
    async getWishlist(): Promise<WishlistItem[]> {
        const response = await api.get<WishlistResponse>(this.basePath);
        return response.data.wishlist;
    }

    /**
     * Add item to wishlist
     */
    async addToWishlist(payload: AddToWishlistPayload): Promise<string> {
        const response = await api.post<AddToWishlistResponse>(this.basePath, payload);
        return response.data.wishlistId;
    }

    /**
     * Remove item from wishlist
     */
    async removeFromWishlist(wishlistId: string): Promise<void> {
        await api.delete<RemoveFromWishlistResponse>(`${this.basePath}/${wishlistId}`);
    }

    /**
     * Check if item is in wishlist (client-side helper)
     */
    isInWishlist(wishlist: WishlistItem[], type: 'coffee' | 'bean', id: string): boolean {
        return wishlist.some(item => item.type === type && item.id === id);
    }

    /**
     * Get wishlist item by product/bean ID
     */
    getWishlistItem(wishlist: WishlistItem[], type: 'coffee' | 'bean', id: string): WishlistItem | undefined {
        return wishlist.find(item => item.type === type && item.id === id);
    }
}

export const wishlistService = new WishlistService();