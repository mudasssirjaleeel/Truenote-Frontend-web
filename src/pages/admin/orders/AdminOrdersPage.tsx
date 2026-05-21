// ─── AdminOrdersPage ──────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, Pagination } from "../../../components/admin/Adminshared";
import StatusBadge from "../../../components/admin/Statusbadge";
import { adminOrdersService } from "../../../services/adminService";
import type { AdminOrder, OrderStatus } from "../../../types/admin.types";
import { Filter, Eye } from "lucide-react";
import toast from "react-hot-toast";

const STATUSES: Array<OrderStatus | ""> = [
  "",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [loading, setLoading] = useState(true);
  const LIMIT = 20;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await adminOrdersService.getAll({
          status: status || undefined,
          page,
          limit: LIMIT,
        });

        console.log("Orders response:", response);

        // Handle the response structure
        const ordersData = response.data?.data ?? [];
        const totalCount = response.data?.total ?? 0;

        setOrders(ordersData);
        setTotal(totalCount);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, status]);

  console.log("orders :", orders);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const columns = [
    {
      key: "id",
      header: "Order",
      render: (r: AdminOrder) => (
        <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          #{r.id.slice(-8)}
        </span>
      ),
    },
    {
      key: "user",
      header: "Customer",
      render: (r: AdminOrder) => (
        <div>
          <p className="text-sm font-medium text-gray-800">{r.contactName}</p>
          <p className="text-xs text-gray-400">{r.contactEmail}</p>
        </div>
      ),
    },
    {
      key: "method",
      header: "Method",
      render: (r: AdminOrder) => (
        <span className="capitalize text-xs text-gray-600">
          {r.deliveryMethod}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (r: AdminOrder) => (
        <span className="text-sm font-semibold text-gray-800">
          ${Number(r.total).toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r: AdminOrder) => <StatusBadge status={r.status} />,
    },
    {
      key: "date",
      header: "Date",
      render: (r: AdminOrder) => (
        <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
      ),
    },
    {
      key: "action",
      header: "",
      render: (r: AdminOrder) => (
        <button
          onClick={() => navigate(`/admin/orders/${r.id}`)}
          className="text-amber-600 hover:text-amber-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  // Mobile card view
  const MobileOrderCard = ({ order }: { order: AdminOrder }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          #{order.id.slice(-8)}
        </span>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-400">Customer</p>
          <p className="text-sm font-medium text-gray-800">
            {order.contactName}
          </p>
          <p className="text-xs text-gray-500">{order.contactEmail}</p>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-xs text-gray-400">Method</p>
            <p className="text-xs text-gray-600 capitalize">
              {order.deliveryMethod}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Date</p>
            <p className="text-xs text-gray-500">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-800">
            ${Number(order.total).toFixed(2)}
          </span>
          <button
            onClick={() => navigate(`/admin/orders/${order.id}`)}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{total} total orders</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as OrderStatus | "");
            setPage(1);
          }}
          className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s ? s.replace(/_/g, " ") : "All statuses"}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          keyFn={(r) => r.id}
          emptyMsg="No orders found"
        />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <MobileOrderCard key={order.id} order={order} />
          ))
        )}
      </div>

      <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />
    </div>
  );
}

export default AdminOrdersPage;
