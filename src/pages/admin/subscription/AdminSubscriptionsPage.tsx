import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  Pagination,
  ConfirmModal,
} from "../../../components/admin/Adminshared";
import { adminSubscriptionsService } from "../../../services/adminService";
import toast from "react-hot-toast";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Pause,
  Play,
  SkipForward,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface Subscription {
  id: string;
  user: { id: string; name: string; email: string; phone: string };
  product: { id: string; name: string; imageUrl: string } | null;
  bean: {
    id: string;
    name: string;
    imageUrl: string;
    origin: string;
    weight: string;
  } | null;
  grindOption: { grind: string } | null;
  deliveryPlan: string;
  nextDeliveryDate: string;
  price: number;
  status: string;
  createdAt: string;
}

interface SubscriptionStats {
  total: number;
  active: number;
  paused: number;
  cancelled: number;
  monthlyRecurringRevenue: number;
  byPlan: Array<{ plan: string; count: number; revenue: number }>;
}

export default function AdminSubscriptionsPage() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [upcomingRenewals, setUpcomingRenewals] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const LIMIT = 15;

  const loadData = async () => {
    setLoading(true);
    try {
      const [subscriptionsRes, statsRes, upcomingRes] = await Promise.all([
        adminSubscriptionsService.getAll({
          status: statusFilter || undefined,
          plan: planFilter || undefined,
          page,
          limit: LIMIT,
          search: search || undefined,
        }),
        adminSubscriptionsService.getStats(),
        adminSubscriptionsService.getUpcoming(30),
      ]);

      setSubscriptions(subscriptionsRes.data?.data ?? []);
      setTotal(subscriptionsRes.data?.total ?? 0);
      setStats(statsRes.data?.stats ?? null);
      setUpcomingRenewals(upcomingRes.data?.data ?? []);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, statusFilter, planFilter, search]);

  const handlePause = async (id: string) => {
    setActionLoading(id);
    try {
      await adminSubscriptionsService.pauseSubscription(id);
      toast.success("Subscription paused");
      loadData();
    } catch {
      toast.error("Failed to pause");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (id: string) => {
    setActionLoading(id);
    try {
      await adminSubscriptionsService.resumeSubscription(id);
      toast.success("Subscription resumed");
      loadData();
    } catch {
      toast.error("Failed to resume");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSkip = async (id: string) => {
    setActionLoading(id);
    try {
      await adminSubscriptionsService.skipDelivery(id);
      toast.success("Next delivery skipped");
      loadData();
    } catch {
      toast.error("Failed to skip");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelClick = (id: string) => {
    setCancelId(id);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelId) return;
    setActionLoading(cancelId);
    try {
      await adminSubscriptionsService.cancelSubscription(cancelId);
      toast.success("Subscription cancelled");
      setShowCancelModal(false);
      setCancelId(null);
      loadData();
    } catch {
      toast.error("Failed to cancel");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `${days} days`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case "weekly":
        return "Weekly";
      case "biweekly":
        return "Bi-Weekly";
      case "monthly":
        return "Monthly";
      default:
        return plan;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Active
          </span>
        );
      case "paused":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            Paused
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            Cancelled
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

  const statCards = [
    {
      label: "Total Subscriptions",
      value: stats?.total || 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "Active",
      value: stats?.active || 0,
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Paused",
      value: stats?.paused || 0,
      icon: Pause,
      color: "yellow",
    },
    {
      label: "MRR",
      value: `$${stats?.monthlyRecurringRevenue?.toFixed(2) || "0"}`,
      icon: DollarSign,
      color: "amber",
    },
  ];

  const columns = [
    {
      key: "customer",
      header: "Customer",
      render: (r: Subscription) => (
        <div>
          <p className="font-medium text-gray-800">{r.user?.name || "—"}</p>
          <p className="text-xs text-gray-400">{r.user?.email || "—"}</p>
        </div>
      ),
    },
    {
      key: "product",
      header: "Product",
      render: (r: Subscription) => {
        const productName = r.product?.name || r.bean?.name || "—";
        return <p className="text-sm text-gray-800">{productName}</p>;
      },
    },
    {
      key: "plan",
      header: "Plan",
      render: (r: Subscription) => (
        <span className="text-sm text-gray-600">
          {getPlanLabel(r.deliveryPlan)}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (r: Subscription) => (
        <span className="text-sm font-semibold text-gray-800">
          ${Number(r.price).toFixed(2)}
        </span>
      ),
    },
    {
      key: "nextDelivery",
      header: "Next Delivery",
      render: (r: Subscription) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-600">
            {formatDate(r.nextDeliveryDate)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r: Subscription) => getStatusBadge(r.status),
    },
    {
      key: "actions",
      header: "",
      render: (r: Subscription) => (
        <div className="flex items-center gap-2">
          {r.status === "active" && (
            <>
              <button
                onClick={() => handlePause(r.id)}
                disabled={actionLoading === r.id}
                className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                title="Pause"
              >
                <Pause className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSkip(r.id)}
                disabled={actionLoading === r.id}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Skip"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </>
          )}
          {r.status === "paused" && (
            <button
              onClick={() => handleResume(r.id)}
              disabled={actionLoading === r.id}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
              title="Resume"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {r.status !== "cancelled" && (
            <button
              onClick={() => handleCancelClick(r.id)}
              disabled={actionLoading === r.id}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              title="Cancel"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const MobileSubscriptionCard = ({ sub }: { sub: Subscription }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-gray-800">{sub.user?.name || "—"}</p>
          <p className="text-xs text-gray-500">{sub.user?.email || "—"}</p>
        </div>
        {getStatusBadge(sub.status)}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Product:</span>
          <span className="text-sm text-gray-700">
            {sub.product?.name || sub.bean?.name || "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Plan:</span>
          <span className="text-sm text-gray-700">
            {getPlanLabel(sub.deliveryPlan)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Price:</span>
          <span className="text-sm font-semibold text-gray-800">
            ${Number(sub.price).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Next Delivery:</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatDate(sub.nextDeliveryDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        {sub.status === "active" && (
          <>
            <button
              onClick={() => handlePause(sub.id)}
              className="flex-1 py-1.5 text-xs bg-yellow-50 text-yellow-600 rounded-lg"
            >
              Pause
            </button>
            <button
              onClick={() => handleSkip(sub.id)}
              className="flex-1 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg"
            >
              Skip
            </button>
          </>
        )}
        {sub.status === "paused" && (
          <button
            onClick={() => handleResume(sub.id)}
            className="flex-1 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg"
          >
            Resume
          </button>
        )}
        {sub.status !== "cancelled" && (
          <button
            onClick={() => handleCancelClick(sub.id)}
            className="flex-1 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Subscriptions
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage customer coffee bean subscriptions
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            <div className={`p-2 rounded-lg bg-${stat.color}-50 w-fit mb-2`}>
              <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Renewals */}
      {upcomingRenewals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-gray-800">
                Upcoming Renewals (Next 30 Days)
              </h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {upcomingRenewals.slice(0, 5).map((renewal) => (
              <div
                key={renewal.id}
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {renewal.user?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {renewal.product?.name || renewal.bean?.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">
                    {getPlanLabel(renewal.deliveryPlan)}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    ${Number(renewal.price).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-500" />
                    <span className="text-xs text-amber-600 font-medium">
                      {formatDate(renewal.nextDeliveryDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by customer or product..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">All Plans</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={subscriptions}
          loading={loading}
          keyFn={(r) => r.id}
          emptyMsg="No subscriptions found"
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No subscriptions found</p>
          </div>
        ) : (
          subscriptions.map((sub) => (
            <MobileSubscriptionCard key={sub.id} sub={sub} />
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />

      {/* Cancel Modal */}
      <ConfirmModal
        open={showCancelModal}
        danger
        title="Cancel Subscription"
        message="This subscription will be permanently cancelled. This action cannot be undone."
        onConfirm={handleCancelConfirm}
        onCancel={() => {
          setShowCancelModal(false);
          setCancelId(null);
        }}
        loading={actionLoading === cancelId}
      />
    </div>
  );
}
