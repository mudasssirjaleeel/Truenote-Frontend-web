// types/order.types.ts

export interface OrderItem {
  id: string;
  type: "coffee" | "bean";
  quantity: number;
  unitPrice: number;
  productId?: string | null;
  product?: {
    id: string;
    name: string;
    subtitle: string | null;
    imageUrl: string | null;
  };
  variantId?: string | null;
  variant?: { id: string; name: string };
  sizeId?: string | null;
  size?: { id: string; label: string };
  beanId?: string | null;
  bean?: {
    id: string;
    name: string;
    origin: string;
    imageUrl: string | null;
    weight: number;
  };
  grindId?: string | null;
  grind?: { id: string; grind: string };
  planId?: string | null;
  plan?: {
    id: string;
    plan: string;
    discount: number | null;
    description: string | null;
  };
}

export interface Order {
  id: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  deliveryMethod: "pickup" | "delivery";
  total: number;
  estimatedTime: string;
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  itemCount?: number;
  orderItems?: OrderItem[];
  channel?: "web" | "mobile";
  orderMode?: "dinein" | "takeaway" | "delivery";
  tableNumber?: number;
  pickupTime?: string;
}

export interface OrderDetails extends Order {
  contactDetails: {
    name: string;
    phone: string;
    email: string;
  };
  deliveryInfo: {
    line: string;
    city: string;
    province?: string;
    postal?: string;
  } | null;
  paymentSummary: {
    subtotal: number;
    total: number;
  };
  items: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface CreateOrderPayload {
  deliveryMethod: "pickup" | "delivery";
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  addressLine?: string;
  addressCity?: string;
  addressProvince?: string;
  addressPostal?: string;
  channel?: "web" | "mobile";
  orderMode?: "dinein" | "takeaway" | "delivery";
  tableNumber?: number;
  pickupTime?: string;
}

export interface OrderResponse {
  data: Order | OrderDetails;
  success?: boolean;
}

export interface OrdersListResponse {
  data: Order[];
  page: number;
  limit: number;
  total: number;
}

export interface TrackOrderResponse {
  data: {
    currentStep: number;
    secondsRemaining: number;
    steps: Array<{ step: number; label: string }>;
    isActive: boolean;
    estimatedRemaining?: string;
    message?: string;
  };
}

export interface AdminOrdersResponse {
  success: boolean;
  data: OrderDetails[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderStatsResponse {
  success: boolean;
  data: {
    totalOrders: number;
    totalRevenue: number;
    byStatus: Record<string, { count: number; revenue: number }>;
  };
}

export interface UpdateStatusPayload {
  status: Order["status"];
}
