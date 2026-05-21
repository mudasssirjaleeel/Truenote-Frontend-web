import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSubscriptions,
  createSubscriptionThunk,
  pauseSubscriptionThunk,
  resumeSubscriptionThunk,
  skipDeliveryThunk,
  cancelSubscriptionThunk,
  clearError,
} from '@/store/slices/subscriptionSlice';
import type { CreateSubscriptionPayload } from '@/types/subscription.types';
import toast from 'react-hot-toast';

export const useSubscriptions = (autoFetch = true) => {
  const dispatch = useAppDispatch();
  const { subscriptions, loading, error } = useAppSelector((state) => state.subscriptions);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchSubscriptions());
    }
  }, [dispatch, autoFetch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const createSubscription = useCallback(
    async (payload: CreateSubscriptionPayload) => {
      const result = await dispatch(createSubscriptionThunk(payload));
      if (createSubscriptionThunk.fulfilled.match(result)) {
        toast.success('Subscription created successfully!');
        return result.payload;
      }
      return null;
    },
    [dispatch]
  );

  const pauseSubscription = useCallback(
    async (id: string) => {
      const result = await dispatch(pauseSubscriptionThunk(id));
      if (pauseSubscriptionThunk.fulfilled.match(result)) {
        toast.success('Subscription paused');
        return true;
      }
      return false;
    },
    [dispatch]
  );

  const resumeSubscription = useCallback(
    async (id: string) => {
      const result = await dispatch(resumeSubscriptionThunk(id));
      if (resumeSubscriptionThunk.fulfilled.match(result)) {
        toast.success('Subscription resumed');
        return true;
      }
      return false;
    },
    [dispatch]
  );

  const skipDelivery = useCallback(
    async (id: string) => {
      const result = await dispatch(skipDeliveryThunk(id));
      if (skipDeliveryThunk.fulfilled.match(result)) {
        toast.success('Next delivery skipped');
        return true;
      }
      return false;
    },
    [dispatch]
  );

  const cancelSubscription = useCallback(
    async (id: string) => {
      const result = await dispatch(cancelSubscriptionThunk(id));
      if (cancelSubscriptionThunk.fulfilled.match(result)) {
        toast.success('Subscription cancelled');
        return true;
      }
      return false;
    },
    [dispatch]
  );

  const refresh = useCallback(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  return {
    subscriptions,
    loading,
    error,
    createSubscription,
    pauseSubscription,
    resumeSubscription,
    skipDelivery,
    cancelSubscription,
    refresh,
  };
};