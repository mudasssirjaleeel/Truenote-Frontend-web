// ─── Enums ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type DeliveryMethod = "pickup" | "delivery";
export type CartItemType = "coffee" | "bean";
export type GrindOption =
  | "whole_bean"
  | "espresso"
  | "v60"
  | "chemex"
  | "french_press";
export type PurchasePlan = "one_time" | "subscribe";
export type UserRole = "user" | "admin";

// ─── User ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  loyaltyPoints?: number;
  orderCount?: number;
  joined_at: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
}

export interface ProductSize {
  id: string;
  label: string;
  price: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  imageUrls: string[];
  isAvailable: boolean;
  categoryId?: string;
  category?: { id: string; label: string; slug: string };
  variants: ProductVariant[];
  sizes: ProductSize[];
  createdAt: string;
  updatedAt: string;
}

// ─── Bean ─────────────────────────────────────────────────────────────────────

export interface BeanGrindOption {
  id: string;
  grind: GrindOption;
}

export interface BeanPurchasePlan {
  id: string;
  plan: PurchasePlan;
  discount?: number;
  description?: string;
}

export interface AdminBean {
  id: string;
  name: string;
  origin: string;
  weight: string;
  price: number;
  imageUrl?: string;
  imageUrls: string[];
  description?: string;
  isDark: boolean;
  isAvailable: boolean;
  grindOptions: BeanGrindOption[];
  purchasePlans: BeanPurchasePlan[];
  createdAt: string;
  updatedAt: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface AdminCategory {
  id: string;
  label: string;
  slug: string;
  sortOrder: number;
  createdAt: string;
}

// ─── Banner ───────────────────────────────────────────────────────────────────

export interface AdminBanner {
  id: string;
  imageUrl: string;
  imageUrls: string[];
  linkTarget?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  type: CartItemType;
  quantity: number;
  unitPrice: number;
  product?: { id: string; name: string; imageUrl?: string };
  bean?: { id: string; name: string; imageUrl?: string };
  variant?: { name: string };
  size?: { label: string };
  grind?: { grind: GrindOption };
  plan?: { plan: PurchasePlan };
}

export interface AdminOrder {
  id: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  total: number;
  estimatedTime?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  addressLine?: string;
  addressCity?: string;
  addressProvince?: string;
  addressPostal?: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string };
  orderItems: OrderItem[];
}

// ─── Loyalty ──────────────────────────────────────────────────────────────────

export interface LoyaltyReward {
  id: string;
  title: string;
  description?: string;
  pointsCost: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EarnAction {
  id: string;
  title: string;
  pointsEarned: number;
  actionKey: string;
  maxPerUser?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserLoyalty {
  userId: string;
  userName: string;
  userEmail: string;
  totalPoints: number;
  transactions: Array<{
    id: string;
    points: number;
    source: string;
    sourceId?: string;
    createdAt: string;
  }>;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  totalProducts: number;
  totalBeans: number;
}
