import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminUsersService } from "../../../services/adminService";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Trophy,
  Award,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  loyalty?: {
    total_earned: number;
    total_redeemed: number;
    current_points: number;
    current_badge: string;
    next_milestone: string;
    next_milestone_points: number;
  };
  history?: {
    points: Array<{
      points: number;
      source: string;
      sourceId: string;
      createdAt: string;
    }>;
    redemptions: Array<{
      id: string;
      pointsSpent: number;
      createdAt: string;
      reward: {
        title: string;
        description: string;
        pointsCost: number;
      };
    }>;
  };
}

export default function AdminUsersDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "points" | "redemptions"
  >("overview");

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      setLoading(true);
      try {
        const response = await adminUsersService.getOne(id);
        console.log("user data :", response);
        setUser(response.data?.data);
      } catch (error) {
        console.error("Error loading user:", error);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getPointsColor = (points: number) => {
    if (points > 0) return "text-green-600";
    if (points < 0) return "text-red-600";
    return "text-gray-500";
  };

  const getPointsIcon = (points: number) => {
    if (points > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (points < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Star className="w-4 h-4 text-gray-400" />;
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "admin_adjustment":
        return "Admin Adjustment";
      case "redemption":
        return "Reward Redemption";
      case "purchase":
        return "Purchase";
      default:
        return source;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">User not found</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="mt-4 px-4 py-2 text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-lg"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              {user.name || "User Details"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              View customer information and loyalty activity
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
          >
            {user.role === "admin" ? "Administrator" : "Customer"}
          </span>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Full Name</p>
              <p className="text-sm font-medium text-gray-800">
                {user.name || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Mail className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email Address</p>
              <p className="text-sm font-medium text-gray-800 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Phone className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Phone Number</p>
              <p className="text-sm font-medium text-gray-800">
                {user.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Joined Date</p>
              <p className="text-sm font-medium text-gray-800">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Summary */}
      {user.loyalty && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold text-gray-800">
              Loyalty Program
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Points Earned</p>
              <p className="text-2xl font-bold text-green-600">
                {user.loyalty.total_earned}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Points Redeemed</p>
              <p className="text-2xl font-bold text-red-600">
                {user.loyalty.total_redeemed}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Current Balance</p>
              <p
                className={`text-2xl font-bold ${getPointsColor(user.loyalty.current_points)}`}
              >
                {user.loyalty.current_points}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Current Badge</p>
              <div className="flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-semibold text-gray-800">
                  {user.loyalty.current_badge}
                </p>
              </div>
              {user.loyalty.next_milestone && (
                <p className="text-xs text-gray-400 mt-1">
                  Next: {user.loyalty.next_milestone} (
                  {user.loyalty.next_milestone_points} pts)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("points")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "points"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Points History
          </button>
          <button
            onClick={() => setActiveTab("redemptions")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "redemptions"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Reward Redemptions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Account Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">User ID</span>
                    <span className="text-sm font-mono text-gray-700">
                      {user.id}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Account Type</span>
                    <span className="text-sm text-gray-700 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Member Since</span>
                    <span className="text-sm text-gray-700">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {user.loyalty && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Loyalty Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">
                        Current Status
                      </span>
                      <span className="text-sm font-medium text-amber-600">
                        {user.loyalty.current_badge}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">
                        Points to Next Level
                      </span>
                      <span className="text-sm text-gray-700">
                        {Math.max(
                          0,
                          user.loyalty.next_milestone_points -
                            user.loyalty.current_points,
                        )}{" "}
                        points
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">
                        Total Orders
                      </span>
                      <span className="text-sm text-gray-700">0</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Points History Tab */}
        {activeTab === "points" && user.history?.points && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Source
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {user.history.points.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatRelativeDate(item.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        {getPointsIcon(item.points)}
                        <span className="text-sm text-gray-700">
                          {getSourceLabel(item.source)}
                        </span>
                      </div>
                      {item.sourceId && item.source !== "redemption" && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.sourceId}
                        </p>
                      )}
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-semibold ${getPointsColor(item.points)}`}
                    >
                      {item.points > 0 ? `+${item.points}` : item.points}
                    </td>
                  </tr>
                ))}
                {user.history.points.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-12 text-center text-gray-400"
                    >
                      No points history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Redemptions Tab */}
        {activeTab === "redemptions" && user.history?.redemptions && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Reward
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Points Spent
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {user.history.redemptions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatRelativeDate(item.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.reward.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.reward.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-semibold text-red-600">
                        -{item.pointsSpent}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">
                          Completed
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {user.history.redemptions.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-gray-400"
                    >
                      <Gift className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      No rewards redeemed yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
