import React from 'react';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { adminOrdersService, kdsService } from "../../../services/adminService";
import toast from "react-hot-toast";
import {
  Clock,
  CheckCircle,
  Coffee,
  UtensilsCrossed,
  Bike,
  Bell,
  Volume2,
  VolumeX,
  RefreshCw,
} from "lucide-react";

interface KDSOrder {
  id: string;
  orderNumber: string;
  customer: string;
  status: string;
  method: string;
  orderMode?: string;  
  tableNumber?: number;  
  items: Array<{ name: string; quantity: number; modifiers?: string[] }>;
  createdAt: string;
  timer: number;
}

type FilterType = "all" | "dinein" | "pickup" | "delivery";
type StatusType = "confirmed" | "preparing" | "ready" | "out_for_delivery";

const STATUS_FLOW: StatusType[] = [
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
];

export default function KDSDisplay() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<KDSOrder[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousOrdersRef = useRef<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate timer for order
  const calculateTimer = (createdAt: string, status: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const minutes = Math.floor((now.getTime() - created.getTime()) / 1000 / 60);

    if (status === "delivered" || status === "cancelled") return 0;
    return minutes;
  };

  // Load active orders
  const loadOrders = async () => {
    try {
      const response = await adminOrdersService.getAll({
        status: "confirmed,preparing,ready,out_for_delivery",
        limit: 50,
      });

      const ordersData = response.data?.data ?? [];
      const formattedOrders = ordersData.map((order: any) => ({
  id: order.id,
  orderNumber: `#${order.id.slice(-8).toUpperCase()}`,
  customer: order.contactName || "Guest",
  status: order.status,
  method: order.orderMode || (order.deliveryMethod === 'pickup' ? 'takeaway' : order.deliveryMethod),
  orderMode: order.orderMode,
  tableNumber: order.tableNumber,
  items: order.orderItems?.map((item: any) => ({
    name: item.product?.name || item.bean?.name || "Unknown",
    quantity: item.quantity,
    modifiers: [],
  })) || [],
  createdAt: order.createdAt,
  timer: calculateTimer(order.createdAt, order.status),
}));
      setOrders(formattedOrders);

      // Play sound for new orders
      const newOrderIds = formattedOrders.map((o: KDSOrder) => o.id);
      const previousIds = previousOrdersRef.current;
      const hasNewOrder = newOrderIds.some(
        (id: any) => !previousIds.includes(id),
      );

      if (
        hasNewOrder &&
        soundEnabled &&
        formattedOrders.length > previousIds.length
      ) {
        playNotificationSound();
      }

      previousOrdersRef.current = newOrderIds;
    } catch (error) {
      console.error("Error loading KDS orders:", error);
    }
  };

  // Refresh with loader
  const refreshOrders = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  // Play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    } else {
      // Browser beep as fallback
      try {
        const beep = new Audio("data:audio/wav;base64,U3RlYWx0aC...");
        beep.play().catch(() => console.log("Beep failed"));
      } catch (e) {
        console.log("🔔 New order!");
      }
    }
  };

  // Get timer color class
  const getTimerColor = (minutes: number, status: string) => {
    if (status === "ready") return "text-green-600";
    if (minutes > 15) return "text-red-600 font-bold";
    if (minutes > 10) return "text-orange-500";
    return "text-gray-500";
  };

  // Get status badge class
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            New
          </span>
        );
      case "preparing":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            Preparing
          </span>
        );
      case "ready":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
            Ready
          </span>
        );
      case "out_for_delivery":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
            Out for Delivery
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  // Get method icon and label
  const getMethodInfo = (method: string, orderMode?: string, tableNumber?: number) => {
  // Use orderMode if available
  if (orderMode === 'dinein') {
    return {
      icon: <Coffee className="w-4 h-4" />,
      label: tableNumber ? `Dine-in T${tableNumber}` : 'Dine-in',
    };
  }
  
  switch (method) {
    case "pickup":
    case "takeaway":
      return {
        icon: <UtensilsCrossed className="w-4 h-4" />,
        label: "Takeaway",
      };
    case "delivery":
      return { icon: <Bike className="w-4 h-4" />, label: "Delivery" };
    default:
      return { icon: <Coffee className="w-4 h-4" />, label: "Dine-in" };
  }
};


  // Get next status for button text
  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case "confirmed":
        return "Start Preparing";
      case "preparing":
        return "Mark Ready";
      case "ready":
        return "Out for Delivery";
      case "out_for_delivery":
        return "Complete";
      default:
        return "Advance";
    }
  };

  // Advance order status
  const advanceOrderStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus = "";
    switch (currentStatus) {
      case "confirmed":
        nextStatus = "preparing";
        break;
      case "preparing":
        nextStatus = "ready";
        break;
      case "ready":
        nextStatus = "out_for_delivery";
        break;
      case "out_for_delivery":
        nextStatus = "delivered";
        break;
      default:
        return;
    }

    try {
      await adminOrdersService.updateStatus(orderId, nextStatus as any);
      toast.success(`Order moved to ${nextStatus.replace("_", " ")}`);
      loadOrders(); // Refresh after update
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.method === filter;
  });

  // Auto-refresh every 15 seconds
  useEffect(() => {
    loadOrders();
    timerRef.current = setInterval(loadOrders, 15000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Group orders by status for better organization
  const confirmedOrders = filteredOrders.filter(
    (o) => o.status === "confirmed",
  );
  const preparingOrders = filteredOrders.filter(
    (o) => o.status === "preparing",
  );
  const readyOrders = filteredOrders.filter((o) => o.status === "ready");
  const outForDeliveryOrders = filteredOrders.filter(
    (o) => o.status === "out_for_delivery",
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading KDS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/sounds/ding.mp3" preload="auto" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Kitchen Display System
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Active Orders: {filteredOrders.length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
            title={soundEnabled ? "Mute" : "Unmute"}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={refreshOrders}
            disabled={refreshing}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: "all", label: "All Orders", icon: null },
          {
            value: "dinein",
            label: "Dine-in",
            icon: <Coffee className="w-4 h-4" />,
          },
          {
            value: "pickup",
            label: "Takeaway",
            icon: <UtensilsCrossed className="w-4 h-4" />,
          },
          {
            value: "delivery",
            label: "Delivery",
            icon: <Bike className="w-4 h-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as FilterType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              filter === tab.value
                ? "bg-amber-500 text-black"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Grid by Status */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <p className="text-gray-400 text-lg">No active orders</p>
          <p className="text-gray-500 text-sm">
            New orders will appear here automatically
          </p>
        </div>
      ) : (
        <>
          {/* New Orders Section */}
          {confirmedOrders.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                New Orders ({confirmedOrders.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {renderOrderCards(
                 confirmedOrders,
  advanceOrderStatus,
  getMethodInfo,
  getTimerColor,
  getStatusBadge,
  getNextStatusLabel,
                )}
              </div>
            </div>
          )}

          {/* Preparing Orders Section */}
          {preparingOrders.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-yellow-400 mb-3">
                In Progress ({preparingOrders.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {renderOrderCards(
                  preparingOrders,
                  advanceOrderStatus,
                  getMethodInfo,
                  getTimerColor,
                  getStatusBadge,
                  getNextStatusLabel,
                )}
              </div>
            </div>
          )}

          {/* Ready Orders Section */}
          {readyOrders.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-blue-400 mb-3">
                Ready for Pickup ({readyOrders.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {renderOrderCards(
                  readyOrders,
                  advanceOrderStatus,
                  getMethodInfo,
                  getTimerColor,
                  getStatusBadge,
                  getNextStatusLabel,
                )}
              </div>
            </div>
          )}

          {/* Out for Delivery Section */}
          {outForDeliveryOrders.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-purple-400 mb-3">
                Out for Delivery ({outForDeliveryOrders.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {renderOrderCards(
                  outForDeliveryOrders,
                  advanceOrderStatus,
                  getMethodInfo,
                  getTimerColor,
                  getStatusBadge,
                  getNextStatusLabel,
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Helper function to render order cards
function renderOrderCards(
 orders: KDSOrder[],
  advanceOrderStatus: (id: string, status: string) => void,
  getMethodInfo: (method: string, orderMode?: string, tableNumber?: number) => { icon: JSX.Element; label: string },
  getTimerColor: (minutes: number, status: string) => string,
  getStatusBadge: (status: string) => JSX.Element,
  getNextStatusLabel: (status: string) => string,
) {
  return orders.map((order) => {
    const methodInfo = getMethodInfo(order.method, order.orderMode, order.tableNumber);
    const isLate = order.timer > 15 && order.status !== "ready";

    return (
      <div
        key={order.id}
        className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all hover:scale-105 ${
          order.status === "confirmed" ? "ring-2 ring-green-500" : ""
        } ${isLate ? "ring-2 ring-red-500" : ""}`}
        onClick={() => advanceOrderStatus(order.id, order.status)}
      >
        {/* Order Header */}
        <div className="bg-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {methodInfo.icon}
            <span className="text-white font-semibold">{methodInfo.label}</span>
          </div>
          <span className="text-amber-400 font-mono font-bold">
            {order.orderNumber}
          </span>
        </div>

        {/* Timer and Status */}
        <div className="px-4 py-2 bg-gray-750 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span
              className={`text-sm font-mono ${getTimerColor(order.timer, order.status)}`}
            >
              {order.timer} min
            </span>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Order Items */}
        <div className="p-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="mb-2 last:mb-0">
              <div className="flex items-start justify-between">
                <span className="text-white text-sm">
                  {item.quantity}x {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="px-4 py-3 bg-gray-700 border-t border-gray-600">
          <button
            onClick={(e) => {
              e.stopPropagation();
              advanceOrderStatus(order.id, order.status);
            }}
            className="w-full py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors text-sm"
          >
            {getNextStatusLabel(order.status)}
          </button>
        </div>

        {/* Customer Name for Pickup */}
        {order.method === "pickup" && (
          <div className="px-4 py-2 bg-gray-700 text-right text-xs text-gray-400">
            Customer: {order.customer}
          </div>
        )}
      </div>
    );
  });
}
