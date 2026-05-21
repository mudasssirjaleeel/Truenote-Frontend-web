export type SubscriptionPlan = "weekly" | "biweekly" | "monthly";
export type SubscriptionStatus = "active" | "paused" | "cancelled";

export interface Subscription {
  id: string;
  product_name: string;
  origin: string | null;
  weight: string | null;
  grind: string | null;
  image_url: string | null;
  delivery_plan: SubscriptionPlan;
  next_delivery: string;
  price: number;
  is_paused: boolean;
  type: "coffee" | "bean";
  status?: SubscriptionStatus;
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
}

export interface SubscriptionDetailResponse {
  subscription: Subscription;
}

export interface CreateSubscriptionPayload {
  beanId?: string;
  productId?: string;
  grindOptionId?: string;
  deliveryPlan: SubscriptionPlan;
  price: number;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  subscription?: Subscription;
}
