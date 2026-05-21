// store/slices/cartSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '@/services/cartService';
import type { CartResponse, AddToCartPayload, CartItem } from '@/types/cart.types';

interface CartState {
    items: CartItem[];
    total: number;
    loading: boolean;
    error: string | null;
    itemCount: number;
}

const initialState: CartState = {
    items: [],
    total: 0,
    loading: false,
    error: null,
    itemCount: 0,
};

// Async Thunks
export const fetchCart = createAsyncThunk(
    'cart/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const cart = await cartService.getCart();
            return cart;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch cart');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/add',
    async (payload: AddToCartPayload, { rejectWithValue, dispatch }) => {
        try {
            const cart = await cartService.addToCart(payload);
            return cart;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to add to cart');
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/update',
    async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
        try {
            const cart = await cartService.updateCartItem(itemId, quantity);
            return cart;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to update cart');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/remove',
    async (itemId: string, { rejectWithValue }) => {
        try {
            const cart = await cartService.removeFromCart(itemId);
            return cart;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to remove from cart');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clear',
    async (_, { rejectWithValue }) => {
        try {
            await cartService.clearCart();
            return { items: [], total: 0 };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to clear cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
        resetCart: (state) => {
            state.items = [];
            state.total = 0;
            state.itemCount = 0;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Clear Cart
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.total = 0;
                state.itemCount = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCartError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;