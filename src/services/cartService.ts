// services/cartService.ts
import api from './api';
import type {
    CartResponse,
    AddToCartPayload,
    UpdateCartItemPayload,
    ClearCartResponse
} from '@/types/cart.types';

class CartService {
    private readonly basePath = '/cart';

    /**
     * Get user's cart
     */
    async getCart(): Promise<CartResponse> {
        const response = await api.get<CartResponse>(this.basePath);
        return response.data;
    }

    /**
     * Add item to cart
     */
    async addToCart(payload: AddToCartPayload): Promise<CartResponse> {
        const response = await api.post<CartResponse>(`${this.basePath}/items`, payload);
        return response.data;
    }

    /**
     * Update cart item quantity
     */
    async updateCartItem(itemId: string, quantity: number): Promise<CartResponse> {
        const response = await api.patch<CartResponse>(`${this.basePath}/items/${itemId}`, { quantity });
        return response.data;
    }

    /**
     * Remove item from cart
     */
    async removeFromCart(itemId: string): Promise<CartResponse> {
        const response = await api.delete<CartResponse>(`${this.basePath}/items/${itemId}`);
        return response.data;
    }

    /**
     * Clear entire cart
     */
    async clearCart(): Promise<void> {
        const response = await api.delete<ClearCartResponse>(this.basePath);
        if (!response.data.success) {
            throw new Error('Failed to clear cart');
        }
    }

    /**
     * Calculate item total price
     */
    calculateItemTotal(item: { unitPrice: number; quantity: number }): number {
        return item.unitPrice * item.quantity;
    }

    /**
     * Format cart item for display
     */
    formatCartItem(item: any) {
        if (item.type === 'coffee') {
            return {
                id: item.id,
                cartId: item.id,
                type: 'coffee' as const,
                name: item.product?.name || '',
                subtitle: item.size?.label || item.variant?.name || '',
                detail: item.grind?.grind ? `Grind: ${item.grind.grind}` : undefined,
                price: item.unitPrice,
                quantity: item.quantity,
                image: item.product?.imageUrl,
                size: item.size,
                variant: item.variant,
            };
        } else {
            return {
                id: item.id,
                cartId: item.id,
                type: 'bean' as const,
                name: item.bean?.name || '',
                subtitle: item.bean?.origin || '',
                detail: `${item.bean?.weight}g • ${item.plan?.plan || 'One Time'}`,
                price: item.unitPrice,
                quantity: item.quantity,
                image: item.bean?.imageUrl,
                grind: item.grind,
                plan: item.plan,
            };
        }
    }
}

export const cartService = new CartService();