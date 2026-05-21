import { useEffect, useState } from "react";
import { notificationService } from "@/services/notificationService";
import type { Notification } from "@/services/notificationService";
import {
  Bell,
  Package,
  Truck,
  Coffee,
  CheckCircle,
  AlertCircle,
  Users,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const getNotificationIcon = (type: string, data?: any) => {
  switch (type) {
    case "order_status":
      return <Package className="w-5 h-5 text-green-500" />;
    case "admin_alert":
      if (data?.type === "new_order")
        return <Bell className="w-5 h-5 text-amber-500" />;
      if (data?.type === "sla_breach")
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      if (data?.type === "payment_failed")
        return <CreditCard className="w-5 h-5 text-red-500" />;
      return <Bell className="w-5 h-5 text-blue-500" />;
    case "subscription":
      return <Coffee className="w-5 h-5 text-amber-500" />;
    case "order_confirmed":
      return <CheckCircle className="w-5 h-5 text-blue-500" />;
    case "order_ready":
      return <Coffee className="w-5 h-5 text-amber-500" />;
    case "order_delivered":
      return <Truck className="w-5 h-5 text-purple-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-400" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

export default function AdminNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async (reset = true) => {
    setLoading(true);
    try {
      const response = await notificationService.getUserNotifications(
        reset ? 1 : page,
        20,
      );
      const data = response.data?.data || [];
      if (reset) {
        setNotifications(data);
        setPage(2);
      } else {
        setNotifications((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
      setHasMore(data.length === 20);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    setRefreshing(true);
    await loadNotifications(true);
    setRefreshing(false);
    toast.success("Notifications refreshed");
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.data?.orderId) {
      navigate(`/admin/orders/${notification.data.orderId}`);
    } else if (notification.data?.subscriptionId) {
      navigate("/admin/subscriptions");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            System alerts and order updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshNotifications}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {loading && notifications.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Loading notifications...</p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-500 text-sm">
            When you receive notifications, they will appear here
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                    !notification.isRead
                      ? "bg-amber-50/30 border-l-4 border-l-amber-500"
                      : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(
                        notification.type,
                        notification.data,
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm ${!notification.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}
                        >
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(notification.sentAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.body}
                      </p>
                      {!notification.isRead && (
                        <span className="inline-block mt-2 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => loadNotifications(false)}
                className="px-6 py-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
