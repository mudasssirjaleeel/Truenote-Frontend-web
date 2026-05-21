// store/slices/wishlistSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '@/services/wishlistService';
import type { WishlistItem, AddToWishlistPayload } from '@/types/wishlist.types';

interface WishlistState {
    items: WishlistItem[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null,
};

// Async Thunks
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const wishlist = await wishlistService.getWishlist();
            return wishlist;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch wishlist');
        }
    }
);

export const addToWishlist = createAsyncThunk(
    'wishlist/add',
    async (payload: AddToWishlistPayload, { rejectWithValue, dispatch }) => {
        try {
            const wishlistId = await wishlistService.addToWishlist(payload);
            // Refetch to get updated wishlist with full details
            await dispatch(fetchWishlist());
            return wishlistId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to add to wishlist');
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/remove',
    async (wishlistId: string, { rejectWithValue, dispatch }) => {
        try {
            await wishlistService.removeFromWishlist(wishlistId);
            await dispatch(fetchWishlist());
            return wishlistId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to remove from wishlist');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlistError: (state) => {
            state.error = null;
        },
        clearWishlist: (state) => {
            state.items = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Add to Wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Remove from Wishlist
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearWishlistError, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;