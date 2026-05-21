// store/slices/addressSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressService } from '@/services/addressService';
import type { Address, CreateAddressPayload, UpdateAddressPayload } from '@/types/address.types';

interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
}

const initialState: AddressState = {
    addresses: [],
    loading: false,
    error: null,
};

// Async Thunks
export const fetchAddresses = createAsyncThunk(
    'addresses/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const addresses = await addressService.getAddresses();
            return addresses;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch addresses');
        }
    }
);

export const addAddress = createAsyncThunk(
    'addresses/add',
    async (payload: CreateAddressPayload, { rejectWithValue, dispatch }) => {
        try {
            const address = await addressService.addAddress(payload);
            await dispatch(fetchAddresses());
            return address;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to add address');
        }
    }
);

export const updateAddress = createAsyncThunk(
    'addresses/update',
    async ({ id, payload }: { id: string; payload: UpdateAddressPayload }, { rejectWithValue, dispatch }) => {
        try {
            const address = await addressService.updateAddress(id, payload);
            await dispatch(fetchAddresses());
            return address;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to update address');
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'addresses/delete',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            await addressService.deleteAddress(id);
            await dispatch(fetchAddresses());
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete address');
        }
    }
);

const addressSlice = createSlice({
    name: 'addresses',
    initialState,
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        },
        clearAddresses: (state) => {
            state.addresses = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Add Address
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update Address
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete Address
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearAddressError, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;