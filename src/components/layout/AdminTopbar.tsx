import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { notificationService } from "../../services/notificationService";
import {
  Menu,
  Bell,
  User,
  LogOut,
  CheckCircle,
  Package,
  Truck,
  Coffee,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  sentAt: string;
  data?: any;
}

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/beans": "Beans",
  "/admin/orders": "Orders",
  "/admin/categories": "Categories",
  "/admin/banners": "Banners",
  "/admin/loyalty": "Loyalty",
  "/admin/users": "Users",
  "/admin/subscriptions": "Subscriptions",
  "/admin/staff": "Staff Management",
  "/admin/kds": "Kitchen Display",
  "/admin/reports": "Reports",
  "/admin/permissions": "Permissions",
};

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

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { pathname } = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title =
    Object.entries(TITLES)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([key]) => pathname.startsWith(key))?.[1] ?? "Admin";

  // Load notifications
  const loadNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications(1, 10);
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  // Mark as read
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

  // Mark all as read
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

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    // Navigate if needed
    if (notification.data?.orderId) {
      window.location.href = `/admin/orders/${notification.data.orderId}`;
    }
  };

  // Close dropdown when clicking outside
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

  // Load notifications on mount and every 30 seconds
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between shrink-0">
      {/* Left Section - Menu Button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base font-semibold text-gray-800 truncate">
          {title}
        </h1>
      </div>

      {/* Right Section - User Info & Notifications */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
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

              {/* Notifications List */}
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

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-100 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = "/admin/notifications";
                  }}
                  className="text-xs text-amber-600 hover:text-amber-700"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() ??
              user?.email?.[0]?.toUpperCase() ??
              "A"}
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">
            {user?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
