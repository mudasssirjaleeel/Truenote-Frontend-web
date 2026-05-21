// hooks/useWishlist.ts
import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlistError,
    clearWishlist
} from '@/store/slices/wishlistSlice';
import type { AddToWishlistPayload } from '@/types/wishlist.types';
import toast from 'react-hot-toast';

export const useWishlist = (autoFetch = true) => {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((state) => state.wishlist);

    useEffect(() => {
        if (autoFetch) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, autoFetch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearWishlistError());
        }
    }, [error, dispatch]);

    const getWishlist = useCallback(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    const addItem = useCallback(async (payload: AddToWishlistPayload) => {
        const result = await dispatch(addToWishlist(payload));
        if (addToWishlist.fulfilled.match(result)) {
            toast.success('Added to wishlist');
            return result.payload;
        }
        return null;
    }, [dispatch]);

    const removeItem = useCallback(async (wishlistId: string) => {
        const result = await dispatch(removeFromWishlist(wishlistId));
        if (removeFromWishlist.fulfilled.match(result)) {
            toast.success('Removed from wishlist');
            return true;
        }
        return false;
    }, [dispatch]);

    const isInWishlist = useCallback((type: 'coffee' | 'bean', id: string) => {
        return items.some(item => item.type === type && item.id === id);
    }, [items]);

    const getWishlistItem = useCallback((type: 'coffee' | 'bean', id: string) => {
        return items.find(item => item.type === type && item.id === id);
    }, [items]);

    const clearAll = useCallback(() => {
        dispatch(clearWishlist());
    }, [dispatch]);

    return {
        // State
        wishlist: items,
        loading,
        error,
        wishlistCount: items.length,

        // Actions
        getWishlist,
        addItem,
        removeItem,
        isInWishlist,
        getWishlistItem,
        clearAll,
    };
};