import { useEffect, useState } from "react";
import {
  adminOrdersService,
  adminProductsService,
  adminBeansService,
  adminDashboardService,
} from "../../services/adminService";
import StatusBadge from "../../components/admin/Statusbadge";
import type { AdminOrder } from "../../types/admin.types";
import {
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  TrendingUp,
  Users,
  Eye,
  RefreshCw,
  AlertCircle,
  Coffee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Add adminDashboardService to your adminService.ts first
// export const adminDashboardService = {
//   getOverview: () => api.get('/orders/admin/metrics/overview'),
//   getSalesHourly: () => api.get('/orders/admin/metrics/sales-hourly'),
//   getChannelSplit: () => api.get('/orders/admin/metrics/channel-split'),
//   getLiveOrders: () => api.get('/orders/admin/orders/live'),
// };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    products: 0,
    beans: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dashboard Metrics
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeSubscriptions: 0,
    averagePrepTime: 0,
    todayRevenue: 0,
    revenueChange: 0,
  });

  // Charts Data
  const [hourlySales, setHourlySales] = useState<
    { hour: string; today: number; avg: number }[]
  >([]);
  const [channelData, setChannelData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [liveOrders, setLiveOrders] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const [
        ordersRes,
        productsRes,
        beansRes,
        metricsRes,
        hourlyRes,
        channelRes,
        liveRes,
      ] = await Promise.all([
        adminOrdersService.getAll({ limit: 5 }),
        adminProductsService.getAll(),
        adminBeansService.getAll(),
        adminDashboardService.getOverview(),
        adminDashboardService.getSalesHourly(),
        adminDashboardService.getChannelSplit(),
        adminDashboardService.getLiveOrders(),
      ]);

      const allOrders: AdminOrder[] = ordersRes.data?.data ?? [];
      setOrders(allOrders.slice(0, 5));
      setStats({
        orders: ordersRes.data?.total ?? 0,
        revenue: allOrders.reduce((s, o) => s + Number(o.total), 0),
        products: productsRes.data?.total ?? 0,
        beans: beansRes.data?.total ?? 0,
        pending: allOrders.filter((o) => o.status === "pending").length,
      });

      // Set metrics
      const metrics = metricsRes.data?.data;
      setDashboardMetrics({
        activeSubscriptions: Number(metrics?.activeSubscriptions) || 0,
        averagePrepTime: Number(metrics?.averagePrepTime) || 0,
        todayRevenue: Number(metrics?.todayRevenue) || 0,
        revenueChange: Number(metrics?.revenueChange) || 0,
      });

      // Set hourly sales
      const hourly = hourlyRes.data?.data;
      if (hourly && hourly.hours) {
        const combined = hourly.hours.map((hour: string, i: number) => ({
          hour: hour.replace(":00", ""),
          today: hourly.today[i] || 0,
          avg: hourly.average[i] || 0,
        }));
        setHourlySales(combined);
      }

      // Set channel split
      const channel = channelRes.data?.data;
      if (channel?.byMode && channel.byMode.length > 0) {
        const colors = ["#10B981", "#F59E0B", "#3B82F6"];
        const data = channel.byMode.map((item: any, i: number) => ({
          name:
            item.name === "dinein"
              ? "Dine-in"
              : item.name === "takeaway"
                ? "Takeaway"
                : item.name === "delivery"
                  ? "Delivery"
                  : "Other",
          value: item.count,
          color: colors[i % colors.length],
        }));
        setChannelData(data);
      }

      // Set live orders
      setLiveOrders(liveRes.data?.data || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => {
    load();
    // Auto refresh every 30 seconds
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      label: "Today's Revenue",
      value: `$${Number(dashboardMetrics.todayRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "green",
      trend:
        dashboardMetrics.revenueChange > 0
          ? `+${dashboardMetrics.revenueChange.toFixed(1)}%`
          : `${dashboardMetrics.revenueChange.toFixed(1)}%`,
      trendUp: dashboardMetrics.revenueChange > 0,
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      label: "Active Subscriptions",
      value: dashboardMetrics.activeSubscriptions,
      icon: Coffee,
      color: "amber",
    },
    {
      label: "Avg Prep Time",
      value: `${dashboardMetrics.averagePrepTime} min`,
      icon: Clock,
      color: "purple",
    },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Last 30 days</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              {stat.trend && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? "text-green-600" : "text-red-600"}`}
                >
                  <span>{stat.trend}</span>
                  {stat.trendUp ? "↑" : "↓"}
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Hour Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                Sales by Hour
              </h3>
              <p className="text-xs text-gray-400">Today vs 7-day average</p>
            </div>
          </div>
          <div className="h-80">
            {hourlySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar
                    dataKey="today"
                    fill="#F59E0B"
                    name="Today"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="avg"
                    fill="#94A3B8"
                    name="7-Day Avg"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">No sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Channel Split Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                Order Channel Split
              </h3>
              <p className="text-xs text-gray-400">
                Distribution by order type
              </p>
            </div>
          </div>
          <div className="h-80">
            {channelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">No order data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Orders Ticker */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-gray-700">Live Orders</h2>
            <span className="text-xs text-gray-400">Last 10 orders</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
          {liveOrders.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-gray-400 text-sm">No orders yet</p>
            </div>
          ) : (
            liveOrders.map((order, idx) => (
              <div
                key={idx}
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    #{order.id}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {order.customer}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {order.method} ·{" "}
                      {new Date(order.time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <span className="text-sm font-semibold text-gray-800">
                    ${order.total.toFixed(2)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">
              Recent Orders
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Latest 5 orders from your store
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            View all orders
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Method",
                  "Date",
                  "Total",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      #{order.id?.slice(-8)?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {order.contactName || "—"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.contactEmail || "—"}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-gray-600 capitalize">
                      {order.deliveryMethod || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-gray-800">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-gray-400 hover:text-amber-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-400 text-sm">No orders yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {orders.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
              <p className="text-gray-400 text-sm">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      #{order.id?.slice(-8)?.toUpperCase()}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="space-y-1.5 mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Customer:</span>
                    <span className="text-gray-800 font-medium">
                      {order.contactName || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Method:</span>
                    <span className="text-gray-600 capitalize">
                      {order.deliveryMethod || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Date:</span>
                    <span className="text-gray-600">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-50 mt-1">
                    <span className="text-gray-500">Total:</span>
                    <span className="text-gray-800 font-bold">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all hover:border-amber-200 group"
        >
          <div className="p-2 rounded-lg bg-amber-50 group-hover:bg-amber-100 transition-colors">
            <Package className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">Add Product</p>
            <p className="text-xs text-gray-400">Create new product</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/beans/new")}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all hover:border-amber-200 group"
        >
          <div className="p-2 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">Add Bean</p>
            <p className="text-xs text-gray-400">Create new coffee bean</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all hover:border-amber-200 group"
        >
          <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">View Orders</p>
            <p className="text-xs text-gray-400">Manage customer orders</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all hover:border-amber-200 group"
        >
          <div className="p-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">Manage Users</p>
            <p className="text-xs text-gray-400">View and manage customers</p>
          </div>
        </button>
      </div>
    </div>
  );
}
