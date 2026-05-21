import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/admin/Statusbadge";
import { adminOrdersService } from "../../../services/adminService";
import type { AdminOrder, OrderStatus } from "../../../types/admin.types";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Truck,
  Package,
  User,
  MapPin,
  CreditCard,
} from "lucide-react";

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await adminOrdersService.getOne(id);
        console.log("Order API Response:", response);

        // Handle different response structures
        let orderData = response.data?.data || response.data;

        // If the response has a nested data property
        if (orderData?.data) {
          orderData = orderData.data;
        }

        console.log("Processed order data:", orderData);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const updateStatus = async (status: OrderStatus) => {
    if (!id) return;
    setSaving(true);
    try {
      await adminOrdersService.updateStatus(id, status);
      setOrder((o: any) => (o ? { ...o, status } : o));
      toast.success(`Order marked as ${status.replace(/_/g, " ")}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const getStatusStep = (currentStatus: OrderStatus) => {
    const index = STATUS_FLOW.indexOf(currentStatus);
    return index + 1;
  };

  // Helper to safely get order items
  const getOrderItems = () => {
    if (!order) return [];

    // Try different possible paths for order items
    if (order.orderItems && Array.isArray(order.orderItems)) {
      return order.orderItems;
    }
    if (order.items && Array.isArray(order.items)) {
      return order.items;
    }
    if (order.data?.orderItems && Array.isArray(order.data?.orderItems)) {
      return order.data.orderItems;
    }
    return [];
  };

  // Helper to safely get contact details
  const getContactDetails = () => {
    if (!order) return { name: "—", email: "—", phone: "—" };

    // Try different possible paths
    if (order.contactDetails) {
      return order.contactDetails;
    }
    return {
      name: order.contactName || "—",
      email: order.contactEmail || "—",
      phone: order.contactPhone || "—",
    };
  };

  // Helper to safely get delivery info
  const getDeliveryInfo = () => {
    if (!order) return { method: "—", address: null };

    if (order.deliveryInfo) {
      return {
        method: order.deliveryMethod || order.deliveryInfo.method,
        address: order.deliveryInfo,
      };
    }
    return {
      method: order.deliveryMethod || "—",
      address: order.addressLine
        ? {
            line: order.addressLine,
            city: order.addressCity,
            province: order.addressProvince,
            postal: order.addressPostal,
          }
        : null,
    };
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading order details...</p>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">Order not found.</p>
        <button
          onClick={() => navigate("/admin/orders")}
          className="mt-4 px-4 py-2 text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-lg"
        >
          Back to Orders
        </button>
      </div>
    );

  const orderItems = getOrderItems();
  const contactDetails = getContactDetails();
  const deliveryInfo = getDeliveryInfo();

  return (
    <div className="max-w-full mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate("/admin/orders")}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Order #{order.id?.slice(-8) || "N/A"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Placed on{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "Unknown date"}
          </p>
        </div>
        <StatusBadge status={order.status || "pending"} />
      </div>

      {/* Status Update Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-4 h-4 text-amber-500" />
          <p className="text-sm font-semibold text-gray-700">Order Status</p>
          <span className="text-xs text-gray-400">
            Step {getStatusStep(order.status || "pending")} of{" "}
            {STATUS_FLOW.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {STATUS_FLOW.map((s) => (
            <button
              key={s}
              disabled={saving || order.status === s}
              onClick={() => updateStatus(s)}
              className={`px-2 py-1.5 text-xs rounded-lg border font-medium transition-all text-center ${
                order.status === s
                  ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                  : STATUS_FLOW.indexOf(s) <
                      STATUS_FLOW.indexOf(order.status || "pending")
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Contact & Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-semibold text-gray-700">
              Customer Information
            </p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <p className="text-sm font-medium text-gray-800">
                {contactDetails.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm text-gray-600">
                {contactDetails.email || "—"}
              </p>
            </div>
            {contactDetails.phone && (
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-gray-600">{contactDetails.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-semibold text-gray-700">
              Delivery Information
            </p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-400">Method</p>
              <p className="text-sm font-medium text-gray-800 capitalize">
                {deliveryInfo.method || "—"}
              </p>
            </div>
            {deliveryInfo.method === "delivery" && deliveryInfo.address && (
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm text-gray-600">
                  {[
                    deliveryInfo.address.line,
                    deliveryInfo.address.city,
                    deliveryInfo.address.province,
                    deliveryInfo.address.postal,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Package className="w-4 h-4 text-amber-500" />
          <p className="text-sm font-semibold text-gray-700">
            Order Items ({orderItems.length})
          </p>
        </div>

        {orderItems.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No items found in this order
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orderItems.map((item: any, index: number) => (
              <div
                key={item.id || index}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.product?.imageUrl ??
                      item.bean?.imageUrl ??
                      "https://truenotecoffee.com/cdn/shop/files/Colombia_Transparent.png?v=1764090551&width=1200"
                    }
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://truenotecoffee.com/cdn/shop/files/Colombia_Transparent.png?v=1764090551&width=1200";
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.product?.name ??
                        item.bean?.name ??
                        item.name ??
                        "Product"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {[
                        item.variant?.name,
                        item.size?.label,
                        item.grind?.grind?.replace(/_/g, " "),
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Standard"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      ${Number(item.unitPrice || item.price || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">
                      $
                      {(
                        Number(item.unitPrice || item.price || 0) *
                        (item.quantity || 1)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Total</span>
          </div>
          <span className="text-xl font-bold text-gray-800">
            $
            {Number(order.total || order.paymentSummary?.total || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
