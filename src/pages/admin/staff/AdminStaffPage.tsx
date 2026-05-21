import { useEffect, useState } from "react";
import { adminStaffService } from "../../../services/adminService";
import type { StaffMember, StaffAuditLog } from "../../../types/staff.types";
import {
  DataTable,
  Pagination,
  ConfirmModal,
} from "../../../components/admin/Adminshared";
import toast from "react-hot-toast";
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Shield,
  Clock,
  Activity,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ROLE_OPTIONS = [
  { value: "admin", label: "Super Admin", color: "purple" },
  { value: "manager", label: "Manager", color: "blue" },
  { value: "barista", label: "Barista", color: "amber" },
  { value: "counter", label: "Counter Staff", color: "green" },
  { value: "rider", label: "Rider", color: "orange" },
];

const getRoleBadge = (role: string) => {
  const option = ROLE_OPTIONS.find((r) => r.value === role);
  const colors: Record<string, string> = {
    purple: "bg-purple-100 text-purple-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return `px-2 py-1 text-xs rounded-full ${colors[option?.color || "gray"]}`;
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [auditLogs, setAuditLogs] = useState<StaffAuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    name: "",
    role: "barista",
    phone: "",
  });
  const [inviting, setInviting] = useState(false);
  const LIMIT = 15;

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await adminStaffService.getAll({
        search: search || undefined,
        role: roleFilter || undefined,
        isActive:
          statusFilter === "active"
            ? true
            : statusFilter === "inactive"
              ? false
              : undefined,
        page,
        limit: LIMIT,
      });
      setStaff(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (error) {
      console.error("Error loading staff:", error);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [page, search, roleFilter, statusFilter]);

  const handleInvite = async () => {
    if (!inviteForm.email) {
      toast.error("Email is required");
      return;
    }
    setInviting(true);
    try {
      await adminStaffService.invite(inviteForm);
      toast.success(`Invitation sent to ${inviteForm.email}`);
      setShowInviteModal(false);
      setInviteForm({ email: "", name: "", role: "barista", phone: "" });
      loadStaff();
    } catch (error: any) {
      toast.error(
        error.response?.data?.error?.message || "Failed to send invitation",
      );
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await adminStaffService.updateRole(id, newRole);
      toast.success("Role updated successfully");
      loadStaff();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleToggleStatus = async (staff: StaffMember) => {
    try {
      if (staff.isActive) {
        await adminStaffService.deactivate(staff.id);
        toast.success("Staff member deactivated");
      } else {
        await adminStaffService.activate(staff.id);
        toast.success("Staff member activated");
      }
      loadStaff();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleViewAudit = async (staff: StaffMember) => {
    setSelectedStaff(staff);
    setAuditLoading(true);
    setShowAuditModal(true);
    try {
      const res = await adminStaffService.getAudit(staff.id, { limit: 50 });
      setAuditLogs(res.data?.data ?? []);
    } catch (error) {
      console.error("Error loading audit logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setAuditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminStaffService.remove(deleteId);
      toast.success("Staff member removed");
      setDeleteId(null);
      loadStaff();
    } catch (error) {
      toast.error("Failed to remove staff");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      invite: "Invited",
      role_change: "Role Changed",
      deactivate: "Deactivated",
      activate: "Activated",
      delete: "Deleted",
    };
    return labels[action] || action;
  };

  const columns = [
    {
      key: "user",
      header: "Staff Member",
      render: (r: StaffMember) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-600 font-semibold">
              {r.user?.name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{r.user?.name || "—"}</p>
            <p className="text-xs text-gray-400">{r.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (r: StaffMember) => (
        <select
          value={r.role}
          onChange={(e) => handleRoleChange(r.id, e.target.value)}
          className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-amber-500 ${getRoleBadge(r.role)}`}
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (r: StaffMember) => (
        <span className="text-sm text-gray-600">{r.user?.phone || "—"}</span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (r: StaffMember) => (
        <span className="text-sm text-gray-500">{formatDate(r.joinedAt)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r: StaffMember) => (
        <button
          onClick={() => handleToggleStatus(r)}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors ${r.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-600 hover:bg-red-200"}`}
        >
          {r.isActive ? (
            <UserCheck className="w-3 h-3" />
          ) : (
            <UserX className="w-3 h-3" />
          )}
          {r.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (r: StaffMember) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewAudit(r)}
            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="View Audit Log"
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(r.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove Staff"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const MobileStaffCard = ({ staff: s }: { staff: StaffMember }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-600 font-semibold">
              {s.user?.name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{s.user?.name || "—"}</p>
            <p className="text-xs text-gray-400">{s.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => handleToggleStatus(s)}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          {s.isActive ? "Active" : "Inactive"}
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Role:</span>
          <span className={`text-xs ${getRoleBadge(s.role)}`}>
            {ROLE_OPTIONS.find((r) => r.value === s.role)?.label}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Phone:</span>
          <span className="text-gray-700">{s.user?.phone || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Joined:</span>
          <span className="text-gray-600">{formatDate(s.joinedAt)}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => handleViewAudit(s)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-amber-50 text-amber-600 rounded-lg"
        >
          <Activity className="w-3 h-3" /> Audit Log
        </button>
        <button
          onClick={() => setDeleteId(s.id)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg"
        >
          <Trash2 className="w-3 h-3" /> Remove
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Staff Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage café staff and their roles
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Invite Staff
        </button>
      </div>

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
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            <option value="">All Roles</option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={staff}
          loading={loading}
          keyFn={(r) => r.id}
          emptyMsg="No staff members found"
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No staff members found</p>
          </div>
        ) : (
          staff.map((s) => <MobileStaffCard key={s.id} staff={s} />)
        )}
      </div>

      {/* Pagination */}
      <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Invite Staff Member
              </h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  placeholder="staff@truenote.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={inviteForm.phone}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, phone: e.target.value })
                  }
                  placeholder="+923001234567"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                {inviting ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {showAuditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Audit Log
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedStaff.user?.name} ·{" "}
                  {
                    ROLE_OPTIONS.find((r) => r.value === selectedStaff.role)
                      ?.label
                  }
                </p>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-4">
              {auditLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No audit logs found
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {getActionLabel(log.action)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                        {log.oldValue && log.newValue && (
                          <p className="text-xs text-gray-500 mt-1">
                            Changed from{" "}
                            <span className="text-gray-700">
                              {JSON.stringify(log.oldValue)}
                            </span>{" "}
                            to{" "}
                            <span className="text-gray-700">
                              {JSON.stringify(log.newValue)}
                            </span>
                          </p>
                        )}
                        {log.ipAddress && (
                          <p className="text-xs text-gray-400 mt-1">
                            IP: {log.ipAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!deleteId}
        danger
        title="Remove Staff Member"
        message="This staff member will be permanently removed. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
