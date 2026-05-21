import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "@/services/notificationService";
import type { Notification } from "@/services/notificationService";
import {
  Bell,
  Package,
  Truck,
  Coffee,
  CheckCircle,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "order_status":
      return <Package className="w-5 h-5 text-green-500" />;
    case "order_confirmed":
      return <CheckCircle className="w-5 h-5 text-blue-500" />;
    case "order_ready":
      return <Coffee className="w-5 h-5 text-amber-500" />;
    case "order_delivered":
      return <Truck className="w-5 h-5 text-purple-500" />;
    case "subscription":
      return <ShoppingBag className="w-5 h-5 text-amber-500" />;
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

// ── Back Arrow ────────────────────────────────────────────────────────────────
const BackArrow = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#474653" />
    <path
      d="M19 10l-6 6 6 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Loading Skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="flex flex-col gap-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="w-full flex items-center gap-4 p-4 rounded-2xl animate-pulse"
        style={{ background: "#F6DDC5" }}
      >
        <div className="w-10 h-10 bg-[#D5B89D] rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-[#D5B89D] rounded w-32" />
          <div className="h-4 bg-[#D5B89D] rounded w-48" />
        </div>
      </div>
    ))}
  </div>
);

export default function UserNotificationsPage() {
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

    if (notification.data?.orderId) {
      navigate("/order_history");
    } else if (notification.data?.subscriptionId) {
      navigate("/my_subscription");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const showLoadingSkeleton = loading && notifications.length === 0;

  // Empty state component defined inside to access navigate
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="#474653"
          strokeWidth="1.5"
          fill="#474653"
          fillOpacity="0.1"
        />
        <path
          d="M12 8V12M12 16H12.01"
          stroke="#474653"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M18 12C18 15.3137 15.3137 18 12 18"
          stroke="#474653"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <p
        className="text-[#474653] text-xl font-medium text-center"
        style={{ fontFamily: "'League Spartan', sans-serif" }}
      >
        No notifications yet
      </p>
      <button
        onClick={() => navigate("/coffee_beans")}
        className="px-6 py-3 bg-[#474653] text-[#F7D5A0] rounded-full hover:bg-[#5a5a6b] transition-colors"
        style={{ fontFamily: "'League Spartan', sans-serif" }}
      >
        Browse Coffee Beans
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#E2C4A7]">
      {/* Side white glows - hide on mobile */}
      <div
        className="absolute z-0 pointer-events-none hidden lg:block"
        style={{
          width: 309,
          height: 933,
          left: -175,
          top: 230,
          background: "rgba(255,255,255,0.50)",
          borderRadius: 9999,
          filter: "blur(216px)",
        }}
      />
      <div
        className="absolute z-0 pointer-events-none hidden lg:block"
        style={{
          width: 309,
          height: 933,
          left: "auto",
          right: -175,
          top: 230,
          background: "rgba(255,255,255,0.50)",
          borderRadius: 9999,
          filter: "blur(216px)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-[80px] pt-[100px] sm:pt-[130px] lg:pt-[150px] pb-12 sm:pb-16">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-6 sm:gap-8">
          {/* Header */}
          <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-4 lg:mb-8 md:mt-8">
            <div>
              <div className="md:flex md:gap-3 md:items-center md:justify-start">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer mt-1"
                >
                  <BackArrow />
                </button>
                <h1
                  className="text-[#474653] text-[30px] md:text-[35px] lg:text-[40px] 2xl:text-[50px] font-bold"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  Notifications
                </h1>
              </div>
              <p
                className="text-[#474653] text-[16px] md:text-[20px] lg:text-[24px] 2xl:text-[30px] font-semibold mt-1 sm:mt-2 md:pl-8 lg:pl-12"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                Stay updated on your orders and subscriptions
              </p>
            </div>
          </div>

          {/* Mark All Button */}
          {notifications.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-[#474653] text-[#F7D5A0] rounded-lg hover:bg-[#5a5a6b] transition-colors text-sm"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                <RefreshCw className="w-4 h-4" />
                Mark All as Read
              </button>
            </div>
          )}

          {/* Notifications List */}
          {showLoadingSkeleton ? (
            <LoadingSkeleton />
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full flex items-start gap-3 sm:gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer ${
                    !notification.isRead ? "ring-2 ring-amber-500/50" : ""
                  }`}
                  style={{ background: "#F6DDC5" }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p
                        className={`text-[#333] text-sm sm:text-base ${!notification.isRead ? "font-semibold" : "font-normal"}`}
                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                      >
                        {notification.title}
                      </p>
                      <span
                        className="text-xs text-[#474653]/50 whitespace-nowrap"
                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                      >
                        {formatDate(notification.sentAt)}
                      </span>
                    </div>
                    <p
                      className="text-sm text-[#474653]/70 mt-1"
                      style={{ fontFamily: "'League Spartan', sans-serif" }}
                    >
                      {notification.body}
                    </p>
                    {!notification.isRead && (
                      <span className="inline-block mt-2 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                        Unread
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => loadNotifications(false)}
                    className="px-6 py-2 text-sm text-[#474653] hover:text-[#5a5a6b] font-medium transition-colors"
                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
