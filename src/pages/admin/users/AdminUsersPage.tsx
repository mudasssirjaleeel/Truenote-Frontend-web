import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  ConfirmModal,
  Pagination,
} from "../../../components/admin/Adminshared";
import { adminUsersService } from "../../../services/adminService";
import type { AdminUser } from "../../../types/admin.types";
import toast from "react-hot-toast";
import {
  Users,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [delId, setDelId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const LIMIT = 15;

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminUsersService.getAll({
        search,
        page,
        limit: LIMIT,
        role: roleFilter !== "all" ? roleFilter : undefined,
      });
      setUsers(res.data?.data ?? []);
      console.log("users...", setUsers);
      setTotal(res.data?.total ?? 0);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, search, roleFilter]);

  const handleDelete = async () => {
    if (!delId) return;
    setDeleting(true);
    try {
      await adminUsersService.remove(delId);
      toast.success("User deleted successfully");
      setDelId(null);
      load();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPointsColor = (points: number) => {
    if (points > 0) return "text-green-600";
    if (points < 0) return "text-red-600";
    return "text-gray-500";
  };

  const columns = [
    {
      key: "name",
      header: "User",
      render: (r: AdminUser) => (
        <div>
          <p className="font-medium text-gray-800">{r.name || "N/A"}</p>
          <p className="text-xs text-gray-400">{r.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (r: AdminUser) => (
        <span className="text-sm text-gray-600">{r.phone || "N/A"}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (r: AdminUser) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${r.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
        >
          {r.role === "admin" ? "Admin" : "User"}
        </span>
      ),
    },
    {
      key: "points",
      header: "Points",
      render: (r: AdminUser) => (
        <div className="flex items-center gap-1">
          {(r as any).total_points !== undefined ? (
            <>
              <Star className="w-3 h-3 text-amber-500" />
              <span
                className={`text-sm font-semibold ${getPointsColor((r as any).net_points)}`}
              >
                {(r as any).net_points || 0}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (r: AdminUser) => (
        <span className="text-xs text-gray-500">{formatDate(r.joined_at)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (r: AdminUser) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/users/${r.id}`)}
            className="p-1 text-amber-600 hover:text-amber-700 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {r.role !== "admin" && (
            <button
              onClick={() => setDelId(r.id)}
              className="p-1 text-red-500 hover:text-red-600 transition-colors"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // Mobile Card View
  const MobileUserCard = ({ user }: { user: AdminUser }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-gray-800">{user.name || "N/A"}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
        >
          {user.role === "admin" ? "Admin" : "User"}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Phone:</span>
          <span className="text-gray-700">{user.phone || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Points:</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500" />
            <span
              className={`font-semibold ${getPointsColor((user as any).net_points)}`}
            >
              {(user as any).net_points || 0}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Joined:</span>
          <span className="text-gray-600">{formatDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => navigate(`/admin/users/${user.id}`)}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <Eye className="w-3 h-3" />
          View Details
        </button>
        {user.role !== "admin" && (
          <button
            onClick={() => setDelId(user.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Users Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage customers and their loyalty points
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
          <Users className="w-4 h-4" />
          <span>
            Total: {total} user{total !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-white appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          keyFn={(r) => r.id}
          emptyMsg="No users found"
        />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No users found</p>
          </div>
        ) : (
          users.map((user) => <MobileUserCard key={user.id} user={user} />)
        )}
      </div>

      {/* Pagination */}
      <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!delId}
        danger
        title="Delete User"
        message="This user will be permanently deleted. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDelId(null)}
        loading={deleting}
      />
    </div>
  );
}
