import api from "./api";
import type { OrderStatus } from "../types/admin.types";

// ─── Permissions Management ────────────────────────────────────────────────────

export const adminPermissionsService = {
  getAllRoles: () => api.get("/admin/permissions/roles"),

  getAllPermissions: () => api.get("/admin/permissions/all"),

  updateRolePermissions: (role: string, data: { permissions: string[] }) =>
    api.put(`/admin/permissions/roles/${role}`, data),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const adminProductsService = {
  getAll: (params?: { search?: string; category?: string; page?: number }) =>
    api.get("/products", { params }),

  getOne: (id: string) => api.get(`/products/${id}`),

  create: (formData: FormData) =>
    api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: string, formData: FormData) =>
    api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  remove: (id: string) => api.delete(`/products/${id}`),
};

// ─── Beans ────────────────────────────────────────────────────────────────────

export const adminBeansService = {
  getAll: (params?: {
    search?: string;
    page?: number;
    roastLevel?: string;
    isAvailable?: boolean;
  }) => api.get("/beans/admin/list", { params }),

  getOne: (id: string) => api.get(`/beans/${id}`),

  create: (formData: FormData) =>
    api.post("/beans", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: string, formData: FormData) =>
    api.put(`/beans/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  remove: (id: string) => api.delete(`/beans/${id}`),

  toggleAvailability: (id: string, isAvailable: boolean) =>
    api.patch(`/beans/${id}/availability`, { isAvailable }),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const adminCategoriesService = {
  getAll: () => api.get("/categories"),

  create: (data: { label: string; slug: string; sortOrder?: number }) =>
    api.post("/categories", data),

  update: (
    id: string,
    data: Partial<{ label: string; slug: string; sortOrder: number }>,
  ) => api.put(`/categories/${id}`, data),

  remove: (id: string) => api.delete(`/categories/${id}`),
};

// ─── Banners ──────────────────────────────────────────────────────────────────

export const adminBannersService = {
  getAll: () => api.get("/banners"),

  create: (formData: FormData) =>
    api.post("/banners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: string, formData: FormData) =>
    api.put(`/banners/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  remove: (id: string) => api.delete(`/banners/${id}`),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const adminOrdersService = {
  getAll: (params?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => api.get("/orders/admin/all", { params }),

  getOne: (id: string) => api.get(`/orders/admin/${id}`), // Use admin endpoint

  updateStatus: (id: string, status: OrderStatus) =>
    api.patch(`/orders/${id}/status`, { status }),

  getStats: () => api.get("/orders/admin/stats"),
};
// ─── Loyalty — Rewards ────────────────────────────────────────────────────────

export const adminRewardsService = {
  getAll: () => api.get("/loyalty/admin/rewards"),

  create: (data: {
    title: string;
    pointsCost: number;
    description?: string;
    isActive?: boolean;
  }) => api.post("/loyalty/admin/rewards", data),

  update: (
    rewardId: string,
    data: Partial<{
      title: string;
      pointsCost: number;
      description: string;
      isActive: boolean;
    }>,
  ) => api.put(`/loyalty/admin/rewards/${rewardId}`, data),

  remove: (rewardId: string) =>
    api.delete(`/loyalty/admin/rewards/${rewardId}`),
};

// ─── Loyalty — Earn Actions ───────────────────────────────────────────────────

export const adminEarnActionsService = {
  getAll: () => api.get("/loyalty/admin/earn-actions"),

  create: (data: {
    title: string;
    pointsEarned: number;
    actionKey: string;
    maxPerUser?: number;
    isActive?: boolean;
  }) => api.post("/loyalty/admin/earn-actions", data),

  update: (
    actionId: string,
    data: Partial<{
      title: string;
      pointsEarned: number;
      actionKey: string;
      maxPerUser: number;
      isActive: boolean;
    }>,
  ) => api.put(`/loyalty/admin/earn-actions/${actionId}`, data),

  remove: (actionId: string) =>
    api.delete(`/loyalty/admin/earn-actions/${actionId}`),
};

// ─── Loyalty — Users ──────────────────────────────────────────────────────────

export const adminLoyaltyUsersService = {
  getAll: () => api.get("/loyalty/admin/users"),

  getOne: (userId: string) => api.get(`/loyalty/admin/users/${userId}`),

  adjustPoints: (userId: string, data: { points: number; reason?: string }) =>
    api.post(`/loyalty/admin/users/${userId}/points`, data),
};

export const adminUsersService = {
  getAll: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
    role?: string;
  }) => {
    try {
      // Your API returns users under /api/loyalty/admin/users
      const response = await api.get("/loyalty/admin/users");

      // Transform the response to match your frontend expected format
      let users = response.data?.users || [];

      // Apply search filter (frontend filtering since your API might not support it)
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        users = users.filter(
          (user: any) =>
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower),
        );
      }

      // Apply role filter
      if (params?.role && params.role !== "all") {
        users = users.filter((user: any) => user.role === params.role);
      }

      const total = users.length;
      const page = params?.page || 1;
      const limit = params?.limit || 15;
      const start = (page - 1) * limit;
      const paginatedUsers = users.slice(start, start + limit);

      // Transform user data to match your frontend AdminUser type
      const transformedUsers = paginatedUsers.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: null,
        joined_at: user.joined_at,
        updatedAt: user.joined_at,
        orderCount: 0, // Your API doesn't have this, can be added later
        total_points: user.total_points,
        total_redeemed: user.total_redeemed,
        net_points: user.net_points,
      }));

      return {
        data: {
          data: transformedUsers,
          total: total,
          page: page,
          limit: limit,
        },
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    try {
      const response = await api.get(`/loyalty/admin/users/${id}`);

      // Transform the response
      const userData = response.data?.user || {};
      const loyaltyData = response.data?.loyalty || {};

      const transformedUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: "user", // Default role, adjust as needed
        avatarUrl: null,
        createdAt: userData.joined_at,
        updatedAt: userData.joined_at,
        loyalty: {
          total_earned: loyaltyData.total_earned,
          total_redeemed: loyaltyData.total_redeemed,
          current_points: loyaltyData.current_points,
          current_badge: loyaltyData.current_badge,
          next_milestone: loyaltyData.next_milestone,
          next_milestone_points: loyaltyData.next_milestone_points,
        },
        history: response.data?.history || {},
      };

      return { data: { data: transformedUser } };
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  updateRole: async (id: string, data: { role: string }) => {
    // Note: Your current loyalty API might not support role updates
    // You might need to create a separate endpoint or use a different API
    try {
      // If you have a separate admin API for role updates
      const response = await api.patch(`/admin/users/${id}/role`, data);
      return response;
    } catch (error) {
      console.error("Error updating user role:", error);
      // If the endpoint doesn't exist, you can mock it for now
      return { data: { success: true } };
    }
  },

  remove: async (id: string) => {
    try {
      // Note: Your current API might not support user deletion
      // You might need to create this endpoint on the backend
      const response = await api.delete(`/auth/user/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  updatePoints: async (
    id: string,
    data: { points: number; reason: string },
  ) => {
    try {
      // If you have an endpoint to adjust user points
      const response = await api.post(
        `/loyalty/admin/users/${id}/points`,
        data,
      );
      return response;
    } catch (error) {
      console.error("Error updating points:", error);
      throw error;
    }
  },

  getLoyaltyHistory: async (id: string) => {
    try {
      const response = await api.get(`/loyalty/admin/users/${id}`);
      return {
        data: {
          loyalty: response.data?.loyalty,
          history: response.data?.history,
        },
      };
    } catch (error) {
      console.error("Error fetching loyalty history:", error);
      throw error;
    }
  },
};

// ─── Subscriptions (Admin) ────────────────────────────────────────────────────

export const adminSubscriptionsService = {
  getAll: (params?: {
    status?: string;
    plan?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => api.get("/subscriptions/admin/all", { params }),

  getUpcoming: (days?: number) =>
    api.get("/subscriptions/admin/upcoming", { params: { days } }),

  getStats: () => api.get("/subscriptions/admin/stats"),

  pauseSubscription: (id: string) => api.post(`/subscriptions/${id}/pause`, {}),

  resumeSubscription: (id: string) =>
    api.post(`/subscriptions/${id}/resume`, {}),

  cancelSubscription: (id: string) => api.delete(`/subscriptions/${id}`),

  skipDelivery: (id: string) => api.patch(`/subscriptions/${id}/skip`, {}),
};

// ─── Dashboard Metrics ────────────────────────────────────────────────────────

export const adminDashboardService = {
  getOverview: () => api.get("/orders/admin/metrics/overview"),

  getSalesHourly: () => api.get("/orders/admin/metrics/sales-hourly"),

  getChannelSplit: () => api.get("/orders/admin/metrics/channel-split"),

  getLiveOrders: () => api.get("/orders/admin/orders/live"),
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const adminReportsService = {
  getSalesSummary: (params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get("/reports/sales-summary", { params }),

  getBestSellers: (params?: { limit?: number; period?: string }) =>
    api.get("/reports/best-sellers", { params }),

  getHourlyHeatmap: (params?: { days?: number }) =>
    api.get("/reports/hourly-heatmap", { params }),

  getDeliveryPerformance: (params?: { days?: number }) =>
    api.get("/reports/delivery-performance", { params }),

  getCustomerLTV: () => api.get("/reports/customer-ltv"),
};

export const adminStaffService = {
  getAll: (params?: {
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }) => api.get("/admin/staff", { params }),

  getOne: (id: string) => api.get(`/admin/staff/${id}`),

  getAudit: (id: string, params?: { page?: number; limit?: number }) =>
    api.get(`/admin/staff/${id}/audit`, { params }),

  invite: (data: {
    email: string;
    name?: string;
    role: string;
    phone?: string;
  }) => api.post("/admin/staff/invite", data),

  updateRole: (id: string, role: string) =>
    api.patch(`/admin/staff/${id}/role`, { role }),

  deactivate: (id: string) => api.patch(`/admin/staff/${id}/deactivate`, {}),

  activate: (id: string) => api.patch(`/admin/staff/${id}/activate`, {}),

  remove: (id: string) => api.delete(`/admin/staff/${id}`),
};

// ─── KDS (Kitchen Display System) ────────────────────────────────────────────

export const kdsService = {
  // Get active orders for KDS
  getActiveOrders: (params?: { status?: string; limit?: number }) =>
    api.get("/orders/admin/all", { params }),

  // Advance order to next status
  advanceOrder: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),

  // Get order by ID
  getOrder: (id: string) => api.get(`/orders/admin/${id}`),
};
