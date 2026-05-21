// hooks/useOrders.ts
import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    createOrder,
    fetchUserOrders,
    fetchOrderById,
    trackOrder,
    fetchAllOrdersAdmin,
    fetchOrderAdmin,
    fetchOrderStats,
    updateOrderStatus,
    clearOrderError,
    clearCurrentOrder,
    clearTracking,
    clearOrders,
} from '@/store/slices/orderSlice';
import type { CreateOrderPayload, UpdateStatusPayload } from '@/types/order.types';
import { orderService } from '@/services/orderService';
import toast from 'react-hot-toast';

export const useOrders = (autoFetch = false) => {
    const dispatch = useAppDispatch();
    const { orders, currentOrder, tracking, loading, error, pagination } = useAppSelector(
        (state) => state.orders
    );

    useEffect(() => {
        if (autoFetch) {
            dispatch(fetchUserOrders({ page: 1, limit: 10 }));
        }
    }, [dispatch, autoFetch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearOrderError());
        }
    }, [error, dispatch]);

    // User Actions
    const placeOrder = useCallback(
        async (payload: CreateOrderPayload) => {
            const result = await dispatch(createOrder(payload));
            if (createOrder.fulfilled.match(result)) {
                toast.success('Order placed successfully!');
                return result.payload;
            }
            return null;
        },
        [dispatch]
    );

    const getUserOrders = useCallback(
        async (page: number = 1, limit: number = 10) => {
            await dispatch(fetchUserOrders({ page, limit }));
        },
        [dispatch]
    );

    const getOrderDetails = useCallback(
        async (orderId: string) => {
            const result = await dispatch(fetchOrderById(orderId));
            if (fetchOrderById.fulfilled.match(result)) {
                return result.payload;
            }
            return null;
        },
        [dispatch]
    );

    const getOrderTracking = useCallback(
        async (orderId: string) => {
            const result = await dispatch(trackOrder(orderId));
            if (trackOrder.fulfilled.match(result)) {
                return result.payload;
            }
            return null;
        },
        [dispatch]
    );

    // Admin Actions
    const getAllOrdersAdmin = useCallback(
        async (status?: string, page: number = 1, limit: number = 20, search?: string) => {
            await dispatch(fetchAllOrdersAdmin({ status, page, limit, search }));
        },
        [dispatch]
    );

    const getOrderAdmin = useCallback(
        async (orderId: string) => {
            const result = await dispatch(fetchOrderAdmin(orderId));
            if (fetchOrderAdmin.fulfilled.match(result)) {
                return result.payload;
            }
            return null;
        },
        [dispatch]
    );

    const getOrderStats = useCallback(async () => {
        const result = await dispatch(fetchOrderStats());
        if (fetchOrderStats.fulfilled.match(result)) {
            return result.payload;
        }
        return null;
    }, [dispatch]);

    const changeOrderStatus = useCallback(
        async (orderId: string, status: UpdateStatusPayload['status']) => {
            const result = await dispatch(updateOrderStatus({ orderId, status }));
            if (updateOrderStatus.fulfilled.match(result)) {
                toast.success(`Order status updated to ${orderService.getStatusLabel(status)}`);
                return result.payload;
            }
            return null;
        },
        [dispatch]
    );

    // Helper Functions
    const formatDate = useCallback((date: string) => {
        return orderService.formatOrderDate(date);
    }, []);

    const getStatusColor = useCallback((status: string) => {
        return orderService.getStatusColor(status as any);
    }, []);

    const getStatusLabel = useCallback((status: string) => {
        return orderService.getStatusLabel(status as any);
    }, []);

    // Cleanup
    const resetCurrentOrder = useCallback(() => {
        dispatch(clearCurrentOrder());
    }, [dispatch]);

    const resetTracking = useCallback(() => {
        dispatch(clearTracking());
    }, [dispatch]);

    const resetOrders = useCallback(() => {
        dispatch(clearOrders());
    }, [dispatch]);

    // Cancel Order
const cancelOrder = useCallback(
    async (orderId: string) => {
        try {
            const result = await orderService.cancelOrder(orderId);
            toast.success(result.message || 'Order cancelled successfully');
            // Refresh orders list after cancellation
            await getUserOrders(1, 10);
            return result;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'Failed to cancel order';
            toast.error(errorMessage);
            throw error;
        }
    },
    [getUserOrders]
);


    return {
        // State
        orders,
        currentOrder,
        tracking,
        loading,
        error,
        pagination,

        // User Actions
        placeOrder,
        getUserOrders,
        getOrderDetails,
        getOrderTracking,
        cancelOrder,

        // Admin Actions
        getAllOrdersAdmin,
        getOrderAdmin,
        getOrderStats,
        changeOrderStatus,

        // Helpers
        formatDate,
        getStatusColor,
        getStatusLabel,

        // Cleanup
        resetCurrentOrder,
        resetTracking,
        resetOrders,
    };
};