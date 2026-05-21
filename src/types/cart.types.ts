// types/cart.types.ts

export interface CartItem {
    id: string;
    type: 'coffee' | 'bean';
    quantity: number;
    unitPrice: number;
    createdAt: string;
    updatedAt: string;
    // Coffee specific
    productId?: string | null;
    product?: {
        id: string;
        name: string;
        imageUrl: string | null;
        price: number;
    };
    variantId?: string | null;
    variant?: {
        id: string;
        name: string;
        price: number;
    };
    sizeId?: string | null;
    size?: {
        id: string;
        label: string;
        price: number;
    };
    // Bean specific
    beanId?: string | null;
    bean?: {
        id: string;
        name: string;
        origin: string;
        imageUrl: string | null;
        price: number;
        weight: number;
    };
    grindId?: string | null;
    grind?: {
        id: string;
        grind: string;
    };
    planId?: string | null;
    plan?: {
        id: string;
        plan: string;
        discount: number | null;
        description: string | null;
    };
}

export interface CartResponse {
    items: CartItem[];
    total: number;
}

export interface AddToCartPayload {
    type: 'coffee' | 'bean';
    quantity?: number;
    productId?: string;
    variantId?: string | null;
    sizeId?: string | null;
    beanId?: string;
    grindId?: string | null;
    planId?: string | null;
}

export interface UpdateCartItemPayload {
    quantity: number;
}

export interface CartItemResponse extends CartResponse { }

export interface ClearCartResponse {
    success: boolean;
}