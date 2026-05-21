// hooks/useBeans.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchBeans,
    fetchBeanById,
    createBean,
    updateBean,
    deleteBean,
    setBeanFilters,
    resetBeanFilters,
    clearBeanError,
    clearSelectedBean
} from '@/store/slices/beanSlice';
import type { BeanFilters, CreateBeanPayload, UpdateBeanPayload } from '../types/beans.types';
import toast from 'react-hot-toast';

export const useBeans = (autoFetch = true, initialFilters?: BeanFilters) => {
    const dispatch = useAppDispatch();
    const { beans, selectedBean, loading, error, pagination, filters } = useAppSelector((s) => s.beans);

    // Auto-fetch on mount if enabled
    useEffect(() => {
        if (autoFetch) {
            dispatch(fetchBeans(initialFilters || filters));
        }
    }, [dispatch, autoFetch]);

    // Show error toast when error occurs
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearBeanError());
        }
    }, [error, dispatch]);

    // Fetch all beans with filters
    const getBeans = (newFilters?: BeanFilters) => {
        dispatch(fetchBeans(newFilters));
    };

    // Get single bean by ID
    const getBeanById = (id: string) => {
        return dispatch(fetchBeanById(id));
    };

    // Create new bean
    const addBean = async (data: CreateBeanPayload) => {
        const result = await dispatch(createBean(data));
        if (createBean.fulfilled.match(result)) {
            toast.success('Bean created successfully!');
            return result.payload;
        }
        return null;
    };

    // Update existing bean
    const editBean = async (data: UpdateBeanPayload) => {
        const result = await dispatch(updateBean(data));
        if (updateBean.fulfilled.match(result)) {
            toast.success('Bean updated successfully!');
            return result.payload;
        }
        return null;
    };

    // Delete bean
    const removeBean = async (id: string) => {
        const result = await dispatch(deleteBean(id));
        if (deleteBean.fulfilled.match(result)) {
            toast.success('Bean deleted successfully!');
            return true;
        }
        return false;
    };

    // Update filters and refetch
    const updateFilters = (newFilters: BeanFilters) => {
        dispatch(setBeanFilters(newFilters));
        dispatch(fetchBeans({ ...filters, ...newFilters }));
    };

    // Reset all filters
    const resetFilters = () => {
        dispatch(resetBeanFilters());
        dispatch(fetchBeans({ search: '', page: 1, limit: 20 }));
    };

    // Clear selected bean
    const clearBean = () => {
        dispatch(clearSelectedBean());
    };

    // Go to page
    const goToPage = (page: number) => {
        updateFilters({ page });
    };

    return {
        // State
        beans,
        selectedBean,
        loading,
        error,
        pagination,
        filters,

        // Actions
        getBeans,
        getBeanById,
        addBean,
        editBean,
        removeBean,
        updateFilters,
        resetFilters,
        clearBean,
        goToPage,
    };
};