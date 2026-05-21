// hooks/useAddress.ts
import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    clearAddressError,
    clearAddresses
} from '@/store/slices/addressSlice';
import type { CreateAddressPayload, UpdateAddressPayload, Address } from '@/types/address.types';
import { addressService } from '@/services/addressService';
import toast from 'react-hot-toast';

export const useAddress = (autoFetch = true) => {
    const dispatch = useAppDispatch();
    const { addresses, loading, error } = useAppSelector((state) => state.addresses);

    useEffect(() => {
        if (autoFetch) {
            dispatch(fetchAddresses());
        }
    }, [dispatch, autoFetch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearAddressError());
        }
    }, [error, dispatch]);

    const getAddresses = useCallback(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const addNewAddress = useCallback(async (payload: CreateAddressPayload) => {
        const result = await dispatch(addAddress(payload));
        if (addAddress.fulfilled.match(result)) {
            toast.success('Address added successfully');
            return result.payload;
        }
        return null;
    }, [dispatch]);

    const editAddress = useCallback(async (id: string, payload: UpdateAddressPayload) => {
        const result = await dispatch(updateAddress({ id, payload }));
        if (updateAddress.fulfilled.match(result)) {
            toast.success('Address updated successfully');
            return result.payload;
        }
        return null;
    }, [dispatch]);

    const removeAddress = useCallback(async (id: string) => {
        const result = await dispatch(deleteAddress(id));
        if (deleteAddress.fulfilled.match(result)) {
            toast.success('Address deleted successfully');
            return true;
        }
        return false;
    }, [dispatch]);

    const getDefaultAddress = useCallback(() => {
        return addresses.find(addr => addr.isDefault);
    }, [addresses]);

    const formatAddressForDisplay = useCallback((address: Address) => {
        return addressService.formatAddress(address.street, address.city, address.postalCode);
    }, []);

    const clearAllAddresses = useCallback(() => {
        dispatch(clearAddresses());
    }, [dispatch]);

    return {
        // State
        addresses,
        loading,
        error,
        addressCount: addresses.length,
        defaultAddress: getDefaultAddress(),

        // Actions
        getAddresses,
        addAddress: addNewAddress,
        updateAddress: editAddress,
        deleteAddress: removeAddress,
        formatAddress: formatAddressForDisplay,
        clearAllAddresses,
    };
};