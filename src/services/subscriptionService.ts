import api from './api';
import type {
  Subscription,
  SubscriptionsResponse,
  SubscriptionDetailResponse,
  CreateSubscriptionPayload,
  ApiResponse,
} from '@/types/subscription.types';

class SubscriptionService {
  private readonly basePath = '/subscriptions';

  // Get all user subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    const response = await api.get<SubscriptionsResponse>(this.basePath);
    return response.data.subscriptions;
  }

  // Get single subscription by ID
  async getSubscriptionById(id: string): Promise<Subscription> {
    const response = await api.get<SubscriptionDetailResponse>(`${this.basePath}/${id}`);
    return response.data.subscription;
  }

  // Create new subscription
  async createSubscription(payload: CreateSubscriptionPayload): Promise<Subscription> {
    const response = await api.post<ApiResponse>(this.basePath, payload);
    return response.data.subscription!;
  }

  // Pause subscription
  async pauseSubscription(id: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.basePath}/${id}/pause`);
    return response.data;
  }

  // Resume subscription
  async resumeSubscription(id: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.basePath}/${id}/resume`);
    return response.data;
  }

  // Skip next delivery
  async skipNextDelivery(id: string): Promise<ApiResponse> {
    const response = await api.patch<ApiResponse>(`${this.basePath}/${id}/skip`);
    return response.data;
  }

  // Cancel subscription
  async cancelSubscription(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`${this.basePath}/${id}`);
    return response.data;
  }
}

export const subscriptionService = new SubscriptionService();