import api from "./api";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  sentAt: string;
  data?: any;
}

export const notificationService = {
  getUserNotifications: (page: number = 1, limit: number = 20) =>
    api.get("/notifications", { params: { page, limit } }),

  getUnreadCount: () => api.get("/notifications/unread-count"),

  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),

  markAllAsRead: () => api.post("/notifications/mark-all-read"),

  registerDeviceToken: (token: string, deviceType: string) =>
    api.post("/notifications/register-token", { token, deviceType }),
};
