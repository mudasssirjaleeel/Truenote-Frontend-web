// services/orderService.ts
import api from "./api";
import type {
  Order,
  OrderDetails,
  CreateOrderPayload,
  OrderResponse,
  OrdersListResponse,
  TrackOrderResponse,
  AdminOrdersResponse,
  OrderStatsResponse,
  UpdateStatusPayload,
} from "@/types/order.types";

class OrderService {
  private readonly basePath = "/orders";

  // ─────────────────────────────────────────
  //  User endpoints
  // ─────────────────────────────────────────

  /**
   * Create a new order from cart
   */
  async createOrder(payload: CreateOrderPayload): Promise<OrderDetails> {
    const response = await api.post<OrderResponse>(this.basePath, payload);
    return response.data.data as OrderDetails;
  }

  /**
   * Get user's order history (paginated)
   */
  async getUserOrders(
    page: number = 1,
    limit: number = 10,
  ): Promise<OrdersListResponse> {
    const response = await api.get<OrdersListResponse>(this.basePath, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Get single order details
   */
  async getOrder(orderId: string): Promise<OrderDetails> {
    const response = await api.get<OrderResponse>(
      `${this.basePath}/${orderId}`,
    );
    return response.data.data as OrderDetails;
  }

  /**
   * Track order status (polling fallback)
   */
  async trackOrder(orderId: string): Promise<TrackOrderResponse["data"]> {
    const response = await api.get<TrackOrderResponse>(
      `${this.basePath}/${orderId}/track`,
    );
    return response.data.data;
  }

  // ─────────────────────────────────────────
  //  Admin endpoints (protected by adminOnly)
  // ─────────────────────────────────────────

  /**
   * Admin: Get all orders with filters
   */
  async getAllOrdersAdmin(
    status?: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
  ): Promise<AdminOrdersResponse> {
    const response = await api.get<AdminOrdersResponse>(
      `${this.basePath}/admin/all`,
      {
        params: { status, page, limit, search },
      },
    );
    return response.data;
  }

  /**
   * Cancel a pending order
   */
  async cancelOrder(
    orderId: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      `${this.basePath}/${orderId}/cancel`,
    );
    return response.data;
  }

  /**
   * Admin: Get single order details (any user)
   */
  async getOrderAdmin(orderId: string): Promise<OrderDetails> {
    const response = await api.get<{ success: boolean; data: OrderDetails }>(
      `${this.basePath}/admin/${orderId}`,
    );
    return response.data.data;
  }

  /**
   * Admin: Get order statistics
   */
  async getOrderStats(): Promise<OrderStatsResponse["data"]> {
    const response = await api.get<OrderStatsResponse>(
      `${this.basePath}/admin/stats`,
    );
    return response.data.data;
  }

  /**
   * Admin: Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: UpdateStatusPayload["status"],
  ): Promise<OrderDetails> {
    const response = await api.patch<OrderResponse>(
      `${this.basePath}/${orderId}/status`,
      { status },
    );
    return response.data.data as OrderDetails;
  }

  // ─────────────────────────────────────────
  //  Helper methods
  // ─────────────────────────────────────────

  /**
   * Format order date
   */
  formatOrderDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: Order["status"]): string {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      out_for_delivery: "bg-orange-100 text-orange-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  /**
   * Get status label
   */
  getStatusLabel(status: Order["status"]): string {
    const labels = {
      pending: "Pending",
      confirmed: "Confirmed",
      preparing: "Preparing",
      ready: "Ready for Pickup",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  }
}

export const orderService = new OrderService();
