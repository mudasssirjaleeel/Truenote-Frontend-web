// store/slices/orderSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '@/services/orderService';
import type { Order, OrderDetails, CreateOrderPayload, UpdateStatusPayload } from '@/types/order.types';

interface OrderState {
    orders: Order[];
    currentOrder: OrderDetails | null;
    tracking: {
        currentStep: number;
        secondsRemaining: number;
        steps: Array<{ step: number; label: string }>;
        isActive: boolean;
    } | null;
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    tracking: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
    },
};

// ─────────────────────────────────────────
//  User Async Thunks
// ─────────────────────────────────────────

export const createOrder = createAsyncThunk(
    'orders/create',
    async (payload: CreateOrderPayload, { rejectWithValue }) => {
        try {
            const order = await orderService.createOrder(payload);
            return order;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to create order');
        }
    }
);

export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const response = await orderService.getUserOrders(page, limit);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch orders');
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (orderId: string, { rejectWithValue }) => {
        try {
            const order = await orderService.getOrder(orderId);
            return order;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch order');
        }
    }
);

export const trackOrder = createAsyncThunk(
    'orders/track',
    async (orderId: string, { rejectWithValue }) => {
        try {
            const tracking = await orderService.trackOrder(orderId);
            return tracking;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to track order');
        }
    }
);

// ─────────────────────────────────────────
//  Admin Async Thunks
// ─────────────────────────────────────────

export const fetchAllOrdersAdmin = createAsyncThunk(
    'orders/fetchAllAdmin',
    async ({ status, page, limit, search }: { status?: string; page: number; limit: number; search?: string }, { rejectWithValue }) => {
        try {
            const response = await orderService.getAllOrdersAdmin(status, page, limit, search);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch orders');
        }
    }
);

export const fetchOrderAdmin = createAsyncThunk(
    'orders/fetchOrderAdmin',
    async (orderId: string, { rejectWithValue }) => {
        try {
            const order = await orderService.getOrderAdmin(orderId);
            return order;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch order');
        }
    }
);

export const fetchOrderStats = createAsyncThunk(
    'orders/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const stats = await orderService.getOrderStats();
            return stats;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch stats');
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ orderId, status }: { orderId: string; status: UpdateStatusPayload['status'] }, { rejectWithValue }) => {
        try {
            const order = await orderService.updateOrderStatus(orderId, status);
            return order;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to update status');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearOrderError: (state) => {
            state.error = null;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearTracking: (state) => {
            state.tracking = null;
        },
        clearOrders: (state) => {
            state.orders = [];
            state.pagination = initialState.pagination;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch User Orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total,
                };
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch Order By ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Track Order
            .addCase(trackOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(trackOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.tracking = action.payload;
            })
            .addCase(trackOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Admin: Fetch All Orders
            .addCase(fetchAllOrdersAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total,
                };
            })
            .addCase(fetchAllOrdersAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Admin: Update Order Status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                // Update in orders list if present
                const index = state.orders.findIndex(o => o.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearOrderError, clearCurrentOrder, clearTracking, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;