// hooks/useCart.ts
import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearCartError,
    resetCart
} from '@/store/slices/cartSlice';
import type { AddToCartPayload } from '@/types/cart.types';
import toast from 'react-hot-toast';

export const useCart = (autoFetch = true) => {
    const dispatch = useAppDispatch();
    const { items, total, loading, error, itemCount } = useAppSelector((state) => state.cart);

    useEffect(() => {
        if (autoFetch) {
            dispatch(fetchCart());
        }
    }, [dispatch, autoFetch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearCartError());
        }
    }, [error, dispatch]);

    const getCart = useCallback(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const addItem = useCallback(async (payload: AddToCartPayload) => {
        const result = await dispatch(addToCart(payload));
        if (addToCart.fulfilled.match(result)) {
            toast.success('Added to cart');
            return result.payload;
        }
        return null;
    }, [dispatch]);

    const updateItem = useCallback(async (itemId: string, quantity: number) => {
        if (quantity === 0) {
            return dispatch(removeFromCart(itemId));
        }
        const result = await dispatch(updateCartItem({ itemId, quantity }));
        if (updateCartItem.fulfilled.match(result)) {
            toast.success('Cart updated');
            return result.payload;
        }
        return null;
    }, [dispatch]);

    const removeItem = useCallback(async (itemId: string) => {
        const result = await dispatch(removeFromCart(itemId));
        if (removeFromCart.fulfilled.match(result)) {
            toast.success('Item removed from cart');
            return result.payload;
        }
        return null;
    }, [dispatch]);

    const emptyCart = useCallback(async () => {
        const result = await dispatch(clearCart());
        if (clearCart.fulfilled.match(result)) {
            toast.success('Cart cleared');
            return true;
        }
        return false;
    }, [dispatch]);

    const resetCartState = useCallback(() => {
        dispatch(resetCart());
    }, [dispatch]);

    const getItemCount = useCallback(() => {
        return itemCount;
    }, [itemCount]);

    const getSubtotal = useCallback(() => {
        return total;
    }, [total]);

    return {
        // State
        cart: items,
        total,
        loading,
        error,
        itemCount,

        // Actions
        getCart,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
        resetCartState,
        getItemCount,
        getSubtotal,
    };
};