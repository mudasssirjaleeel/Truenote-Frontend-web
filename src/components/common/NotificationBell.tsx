import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "@/services/notificationService";
import type { Notification } from "@/services/notificationService";
import {
  Bell,
  CheckCircle,
  Package,
  Truck,
  Coffee,
  XCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface NotificationBellProps {
  isDark?: boolean; // ← Change from textColor/hoverColor to simple boolean
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "order_status":
      return <Package className="w-4 h-4 text-green-500" />;
    case "order_confirmed":
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case "order_ready":
      return <Coffee className="w-4 h-4 text-amber-500" />;
    case "order_delivered":
      return <Truck className="w-4 h-4 text-purple-500" />;
    case "subscription":
      return <Coffee className="w-4 h-4 text-amber-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-400" />;
  }
};

const formatTime = (dateString: string) => {
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

export default function NotificationBell({
  isDark = false,
}: NotificationBellProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine colors based on isDark prop
  const iconColor = isDark ? "text-[#474653]" : "text-white";
  const buttonHoverClass = isDark ? "hover:bg-gray-100" : "hover:bg-white/10";

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications(1, 10);
      setNotifications(response.data?.data || []);
      setUnreadCount(response.data?.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const getUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data?.unreadCount || 0);
    } catch (error) {
      console.error("Failed to get unread count:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);

    if (notification.data?.orderId) {
      navigate(`/order_history`);
    } else if (notification.data?.subscriptionId) {
      navigate(`/my_subscription`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadNotifications();
      const interval = setInterval(() => {
        getUnreadCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${buttonHoverClass}`}
      >
        <Bell className={`w-5 h-5 ${iconColor}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-0.5">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-amber-600 hover:text-amber-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead
                      ? "bg-amber-50 hover:bg-amber-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${!notification.isRead ? "font-semibold text-gray-800" : "text-gray-600"}`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notification.sentAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-100 text-center bg-gray-50">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/notifications");
              }}
              className="text-xs text-amber-600 hover:text-amber-700"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
