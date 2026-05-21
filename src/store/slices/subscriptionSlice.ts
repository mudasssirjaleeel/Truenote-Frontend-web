import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionService } from '@/services/subscriptionService';
import type { Subscription, CreateSubscriptionPayload } from '@/types/subscription.types';

interface SubscriptionState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscriptions: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionService.getSubscriptions();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch subscriptions');
    }
  }
);

export const createSubscriptionThunk = createAsyncThunk(
  'subscriptions/create',
  async (payload: CreateSubscriptionPayload, { rejectWithValue }) => {
    try {
      return await subscriptionService.createSubscription(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create subscription');
    }
  }
);

export const pauseSubscriptionThunk = createAsyncThunk(
  'subscriptions/pause',
  async (id: string, { rejectWithValue }) => {
    try {
      await subscriptionService.pauseSubscription(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to pause subscription');
    }
  }
);

export const resumeSubscriptionThunk = createAsyncThunk(
  'subscriptions/resume',
  async (id: string, { rejectWithValue }) => {
    try {
      await subscriptionService.resumeSubscription(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to resume subscription');
    }
  }
);

export const skipDeliveryThunk = createAsyncThunk(
  'subscriptions/skip',
  async (id: string, { rejectWithValue }) => {
    try {
      await subscriptionService.skipNextDelivery(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to skip delivery');
    }
  }
);

export const cancelSubscriptionThunk = createAsyncThunk(
  'subscriptions/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      await subscriptionService.cancelSubscription(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to cancel subscription');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create subscription
      .addCase(createSubscriptionThunk.fulfilled, (state, action) => {
        state.subscriptions.push(action.payload);
      })
      // Pause subscription
      .addCase(pauseSubscriptionThunk.fulfilled, (state, action) => {
        const sub = state.subscriptions.find(s => s.id === action.payload);
        if (sub) {
          sub.is_paused = true;
          sub.status = 'paused' as any;
        }
      })
      // Resume subscription
      .addCase(resumeSubscriptionThunk.fulfilled, (state, action) => {
        const sub = state.subscriptions.find(s => s.id === action.payload);
        if (sub) {
          sub.is_paused = false;
          sub.status = 'active' as any;
        }
      })
      // Cancel subscription
      .addCase(cancelSubscriptionThunk.fulfilled, (state, action) => {
        state.subscriptions = state.subscriptions.filter(s => s.id !== action.payload);
      });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;