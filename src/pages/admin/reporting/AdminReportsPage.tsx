import { useEffect, useState } from "react";
import { adminReportsService } from "../../../services/adminService";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Truck,
  Clock,
  Download,
  Calendar,
  Filter,
  Package,
  Coffee,
  Users,
  Eye,
} from "lucide-react";
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import toast from "react-hot-toast";

interface SalesSummary {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    revenueGrowth: number;
    startDate: string;
    endDate: string;
  };
  dailySales: Array<{ date: string; revenue: number; orders: number }>;
  byMethod: Array<{ method: string; orders: number; revenue: number }>;
}

interface BestSeller {
  id: string;
  name: string;
  type: "coffee" | "bean";
  quantity: number;
  revenue: number;
  imageUrl: string | null;
}

interface HourlyHeatmap {
  heatmap: Array<{
    hour: string;
    day: string;
    orders: number;
    revenue: number;
  }>;
  days: string[];
  hours: string[];
}

interface DeliveryPerformance {
  totalDeliveryOrders: number;
  completedDeliveries: number;
  avgDeliveryTime: number;
  pendingDeliveries: number;
  byStatus: {
    pending: number;
    confirmed: number;
    preparing: number;
    out_for_delivery: number;
    delivered: number;
    cancelled: number;
  };
}

interface CustomerLTV {
  summary: {
    totalCustomers: number;
    averageLTV: number;
    averageOrderCount: number;
    totalRevenue: number;
  };
  topCustomers: Array<{
    name: string;
    email: string;
    totalSpent: number;
    orderCount: number;
    avgOrderValue: number;
  }>;
}

type PeriodType = "today" | "week" | "month" | "year" | "custom";

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<
    "sales" | "bestsellers" | "heatmap" | "delivery" | "ltv"
  >("sales");
  const [period, setPeriod] = useState<PeriodType>("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Data states
  const [salesData, setSalesData] = useState<SalesSummary | null>(null);
  const [bestSellers, setBestSellers] = useState<{
    topByQuantity: BestSeller[];
    topByRevenue: BestSeller[];
  } | null>(null);
  const [heatmapData, setHeatmapData] = useState<HourlyHeatmap | null>(null);
  const [deliveryData, setDeliveryData] = useState<DeliveryPerformance | null>(
    null,
  );
  const [ltvData, setLtvData] = useState<CustomerLTV | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const promises = [];

      if (
        activeTab === "sales" ||
        activeTab === "bestsellers" ||
        activeTab === "heatmap" ||
        activeTab === "delivery"
      ) {
        const params =
          period !== "custom"
            ? { period }
            : { startDate: customStartDate, endDate: customEndDate };

        if (activeTab === "sales") {
          promises.push(
            adminReportsService
              .getSalesSummary(params)
              .then((res) => setSalesData(res.data?.data)),
          );
        }
        if (activeTab === "bestsellers") {
          promises.push(
            adminReportsService
              .getBestSellers({
                limit: 10,
                period: period !== "custom" ? period : "month",
              })
              .then((res) => setBestSellers(res.data?.data)),
          );
        }
        if (activeTab === "heatmap") {
          promises.push(
            adminReportsService
              .getHourlyHeatmap({ days: 30 })
              .then((res) => setHeatmapData(res.data?.data)),
          );
        }
        if (activeTab === "delivery") {
          promises.push(
            adminReportsService
              .getDeliveryPerformance({ days: 30 })
              .then((res) => setDeliveryData(res.data?.data)),
          );
        }
        if (activeTab === "ltv") {
          promises.push(
            adminReportsService
              .getCustomerLTV()
              .then((res) => setLtvData(res.data?.data)),
          );
        }
      } else if (activeTab === "ltv") {
        promises.push(
          adminReportsService
            .getCustomerLTV()
            .then((res) => setLtvData(res.data?.data)),
        );
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, period, customStartDate, customEndDate]);

  const handleExport = async () => {
    setExporting(true);
    try {
      let exportData: any[] = [];
      let filename = "";
      let headers: string[] = [];

      // Prepare data based on active tab
      switch (activeTab) {
        case "sales":
          exportData = salesData?.dailySales || [];
          filename = `sales_report_${new Date().toISOString().split("T")[0]}.csv`;
          headers = ["Date", "Revenue", "Orders"];
          break;
        case "bestsellers":
          exportData = bestSellers?.topByQuantity || [];
          filename = `bestsellers_report_${new Date().toISOString().split("T")[0]}.csv`;
          headers = [
            "Rank",
            "Product Name",
            "Type",
            "Quantity Sold",
            "Revenue",
          ];
          break;
        case "delivery":
          exportData = deliveryData?.byStatus
            ? Object.entries(deliveryData.byStatus).map(([status, count]) => ({
                status,
                count,
              }))
            : [];
          filename = `delivery_performance_${new Date().toISOString().split("T")[0]}.csv`;
          headers = ["Status", "Count"];
          break;
        case "ltv":
          exportData = ltvData?.topCustomers || [];
          filename = `customer_ltv_${new Date().toISOString().split("T")[0]}.csv`;
          headers = [
            "Customer Name",
            "Email",
            "Total Orders",
            "Total Spent",
            "Average Order Value",
          ];
          break;
        case "heatmap":
          exportData = heatmapData?.heatmap || [];
          filename = `hourly_heatmap_${new Date().toISOString().split("T")[0]}.csv`;
          headers = ["Hour", "Day", "Orders", "Revenue"];
          break;
        default:
          exportData = [];
          filename = `report_${new Date().toISOString().split("T")[0]}.csv`;
          headers = [];
      }

      if (exportData.length === 0) {
        toast.error("No data to export");
        setExporting(false);
        return;
      }

      // Convert data to CSV
      const csvRows = [];

      // Add headers
      csvRows.push(headers.join(","));

      // Add data rows
      for (const row of exportData) {
        const values = [];
        for (const header of headers) {
          let value = "";
          switch (header) {
            case "Date":
              value = row.date || "";
              break;
            case "Revenue":
              value = row.revenue?.toString() || "0";
              break;
            case "Orders":
              value = row.orders?.toString() || "0";
              break;
            case "Rank":
              value = (exportData.indexOf(row) + 1).toString();
              break;
            case "Product Name":
              value = row.name || "";
              break;
            case "Type":
              value = row.type || "";
              break;
            case "Quantity Sold":
              value = row.quantity?.toString() || "0";
              break;
            case "Customer Name":
              value = row.name || "";
              break;
            case "Email":
              value = row.email || "";
              break;
            case "Total Orders":
              value = row.orderCount?.toString() || "0";
              break;
            case "Total Spent":
              value = row.totalSpent?.toString() || "0";
              break;
            case "Average Order Value":
              value = row.avgOrderValue?.toString() || "0";
              break;
            case "Status":
              value = row.status || "";
              break;
            case "Count":
              value = row.count?.toString() || "0";
              break;
            case "Hour":
              value = row.hour || "";
              break;
            case "Day":
              value = row.day || "";
              break;
            default:
              value = "";
          }
          // Escape quotes and wrap in quotes if contains comma
          const escapedValue = String(value).replace(/"/g, '""');
          const formattedValue = escapedValue.includes(",")
            ? `"${escapedValue}"`
            : escapedValue;
          values.push(formattedValue);
        }
        csvRows.push(values.join(","));
      }

      // Create blob and download
      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Report exported as ${filename}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export report");
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatNumber = (value: number) => value.toLocaleString();

  const COLORS = [
    "#10B981",
    "#F59E0B",
    "#3B82F6",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
  ];

  // Sales Tab
  const renderSalesTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-50">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(salesData?.summary.totalRevenue || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
          {salesData?.summary.revenueGrowth !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs mt-2 ${salesData.summary.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {salesData.summary.revenueGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {Math.abs(salesData.summary.revenueGrowth).toFixed(1)}% vs
                previous period
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatNumber(salesData?.summary.totalOrders || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(salesData?.summary.avgOrderValue || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Average Order Value</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Period</p>
          <p className="text-sm font-medium text-gray-800">
            {period === "today" && "Today"}
            {period === "week" && "Last 7 Days"}
            {period === "month" && "Last 30 Days"}
            {period === "year" && "Last 12 Months"}
            {period === "custom" && `${customStartDate} to ${customEndDate}`}
          </p>
        </div>
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Daily Sales Trend
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData?.dailySales || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area
                type="monotone"
                dataKey="revenue"
                fill="#F59E0B"
                stroke="#D97706"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Orders by Method
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData?.byMethod || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="orders"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {(salesData?.byMethod || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Revenue by Method
          </h3>
          <div className="space-y-3">
            {(salesData?.byMethod || []).map((method, i) => (
              <div
                key={method.method}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600 capitalize">
                    {method.method}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {formatCurrency(method.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Best Sellers Tab
  const renderBestSellersTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top by Quantity */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-linear-to-r from-amber-50 to-white border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            Top 10 by Quantity Sold
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {(bestSellers?.topByQuantity || []).map((item, idx) => (
            <div
              key={item.id}
              className="px-5 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-6">
                  #{idx + 1}
                </span>
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.type === "coffee" ? (
                    <Coffee className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Package className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {item.type}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {item.quantity} sold
                </p>
                <p className="text-xs text-gray-400">
                  {formatCurrency(item.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top by Revenue */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-linear-to-r from-green-50 to-white border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            Top 10 by Revenue
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {(bestSellers?.topByRevenue || []).map((item, idx) => (
            <div
              key={item.id}
              className="px-5 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-6">
                  #{idx + 1}
                </span>
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.type === "coffee" ? (
                    <Coffee className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Package className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {item.type}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {formatCurrency(item.revenue)}
                </p>
                <p className="text-xs text-gray-400">{item.quantity} sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Heatmap Tab
  const renderHeatmapTab = () => {
    const matrix = heatmapData?.days.map((day) => ({
      day,
      data: heatmapData.hours.map((hour) => {
        const cell = heatmapData.heatmap.find(
          (h) => h.hour === hour && h.day === day,
        );
        return cell?.orders || 0;
      }),
    }));

    const maxOrders = Math.max(
      ...(heatmapData?.heatmap.map((h) => h.orders) || [0]),
    );

    const getCellColor = (orders: number) => {
      if (orders === 0) return "bg-gray-100";
      const intensity = orders / maxOrders;
      if (intensity > 0.7) return "bg-orange-600 text-white";
      if (intensity > 0.4) return "bg-orange-400 text-white";
      return "bg-orange-200 text-gray-700";
    };

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Order Heatmap (Last 30 Days)
        </h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs text-gray-500">
                Hour / Day
              </th>
              {heatmapData?.days.map((day) => (
                <th key={day} className="p-2 text-center text-xs text-gray-500">
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData?.hours.map((hour) => (
              <tr key={hour}>
                <td className="p-2 text-xs font-medium text-gray-600">
                  {hour}
                </td>
                {matrix?.map((day) => {
                  const index = heatmapData.hours.indexOf(hour);
                  const orders = day.data[index];
                  return (
                    <td key={day.day} className="p-1">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium ${getCellColor(orders)}`}
                      >
                        {orders > 0 ? orders : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Delivery Tab
  const renderDeliveryTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatNumber(deliveryData?.totalDeliveryOrders || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Delivery Orders</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-50">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatNumber(deliveryData?.completedDeliveries || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Completed Deliveries</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {deliveryData?.avgDeliveryTime || 0} min
          </p>
          <p className="text-xs text-gray-500 mt-1">Average Delivery Time</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-red-50">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatNumber(deliveryData?.pendingDeliveries || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending Deliveries</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Delivery Status Breakdown
        </h3>
        <div className="space-y-3">
          {deliveryData?.byStatus &&
            Object.entries(deliveryData.byStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 capitalize">
                    {status.replace("_", " ")}
                  </span>
                  <span className="text-gray-800 font-medium">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${(count / (deliveryData.totalDeliveryOrders || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // LTV Tab
  const renderLTVTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatNumber(ltvData?.summary.totalCustomers || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Customers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-50">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(ltvData?.summary.averageLTV || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Average Customer LTV</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {ltvData?.summary.averageOrderCount.toFixed(1) || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Avg Orders per Customer</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(ltvData?.summary.totalRevenue || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Customer Revenue</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-linear-to-r from-amber-50 to-white border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            Top Customers by Lifetime Value
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                  Customer
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                  Orders
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                  Total Spent
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                  Avg Order Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(ltvData?.topCustomers || []).map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{customer.name}</p>
                    <p className="text-xs text-gray-400">{customer.email}</p>
                  </td>
                  <td className="px-5 py-3 text-right text-gray-600">
                    {customer.orderCount}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-800">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-600">
                    {formatCurrency(customer.avgOrderValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            View sales performance and business insights
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          {exporting ? "Exporting..." : "Export Report"}
        </button>
      </div>

      {/* Period Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(["today", "week", "month", "year"] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${period === p ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {p === "today" && "Today"}
                {p === "week" && "Last 7 Days"}
                {p === "month" && "Last 30 Days"}
                {p === "year" && "Last 12 Months"}
              </button>
            ))}
            <button
              onClick={() => setPeriod("custom")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${period === "custom" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Custom
            </button>
          </div>
          {period === "custom" && (
            <div className="flex gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 overflow-x-auto">
          {[
            { id: "sales", label: "Sales Summary", icon: DollarSign },
            { id: "bestsellers", label: "Best Sellers", icon: TrendingUp },
            { id: "heatmap", label: "Hourly Heatmap", icon: Calendar },
            { id: "delivery", label: "Delivery Performance", icon: Truck },
            { id: "ltv", label: "Customer LTV", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Loading reports...</p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === "sales" && renderSalesTab()}
          {activeTab === "bestsellers" && renderBestSellersTab()}
          {activeTab === "heatmap" && renderHeatmapTab()}
          {activeTab === "delivery" && renderDeliveryTab()}
          {activeTab === "ltv" && renderLTVTab()}
        </>
      )}
    </div>
  );
}