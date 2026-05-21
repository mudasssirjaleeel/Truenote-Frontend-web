// store/slices/beanSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { beanApi } from '@/services/beanService';
import type {
    Bean,
    CreateBeanPayload,
    UpdateBeanPayload,
    BeanFilters,
    BeansApiResponse
} from '../../types/beans.types';

interface BeanState {
    beans: Bean[];
    selectedBean: Bean | null;
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
    filters: BeanFilters;
}

const initialState: BeanState = {
    beans: [],
    selectedBean: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
    },
    filters: {
        search: '',
        page: 1,
        limit: 20,
    },
};

// Async Thunks
export const fetchBeans = createAsyncThunk(
    'beans/fetchAll',
    async (filters?: BeanFilters, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { beans: BeanState };
            const currentFilters = state.beans.filters;
            const params = { ...currentFilters, ...filters };

            const response = await beanApi.getAll(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch beans');
        }
    }
);

export const fetchBeanById = createAsyncThunk(
    'beans/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await beanApi.getOne(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch bean');
        }
    }
);

export const createBean = createAsyncThunk(
    'beans/create',
    async (data: CreateBeanPayload, { rejectWithValue }) => {
        try {
            const response = await beanApi.create(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to create bean');
        }
    }
);

export const updateBean = createAsyncThunk(
    'beans/update',
    async ({ id, ...data }: UpdateBeanPayload, { rejectWithValue }) => {
        try {
            const response = await beanApi.update({ id, ...data });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to update bean');
        }
    }
);

export const deleteBean = createAsyncThunk(
    'beans/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await beanApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete bean');
        }
    }
);

const beanSlice = createSlice({
    name: 'beans',
    initialState,
    reducers: {
        clearBeanError: (state) => {
            state.error = null;
        },
        clearSelectedBean: (state) => {
            state.selectedBean = null;
        },
        setBeanFilters: (state, action: PayloadAction<BeanFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = action.payload.page || state.pagination.page;
        },
        resetBeanFilters: (state) => {
            state.filters = {
                search: '',
                page: 1,
                limit: 20,
            };
            state.pagination.page = 1;
        },
        clearBeans: (state) => {
            state.beans = [];
            state.selectedBean = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchBeans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBeans.fulfilled, (state, action: PayloadAction<BeansApiResponse>) => {
                state.loading = false;
                state.beans = action.payload.data;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total,
                };
            })
            .addCase(fetchBeans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch By ID
            .addCase(fetchBeanById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBeanById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBean = action.payload.data;
            })
            .addCase(fetchBeanById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create
            .addCase(createBean.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBean.fulfilled, (state, action) => {
                state.loading = false;
                state.beans.unshift(action.payload.data);
                state.pagination.total += 1;
            })
            .addCase(createBean.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update
            .addCase(updateBean.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBean.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.beans.findIndex(bean => bean.id === action.payload.data.id);
                if (index !== -1) {
                    state.beans[index] = action.payload.data;
                }
                if (state.selectedBean?.id === action.payload.data.id) {
                    state.selectedBean = action.payload.data;
                }
            })
            .addCase(updateBean.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete
            .addCase(deleteBean.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBean.fulfilled, (state, action) => {
                state.loading = false;
                state.beans = state.beans.filter(bean => bean.id !== action.payload);
                state.pagination.total -= 1;
                if (state.selectedBean?.id === action.payload) {
                    state.selectedBean = null;
                }
            })
            .addCase(deleteBean.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearBeanError,
    clearSelectedBean,
    setBeanFilters,
    resetBeanFilters,
    clearBeans
} = beanSlice.actions;

export default beanSlice.reducer;