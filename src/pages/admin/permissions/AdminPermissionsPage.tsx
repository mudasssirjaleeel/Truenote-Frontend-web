import { useEffect, useState } from "react";
import { adminPermissionsService } from "../../../services/adminService";
import toast from "react-hot-toast";
import {
  Save,
  RefreshCw,
  Shield,
  CheckSquare,
  Square,
  MinusSquare,
} from "lucide-react";

interface PermissionGroup {
  [module: string]: string[];
}

interface RolePermissions {
  role: string;
  permissions: string[];
}

const ROLES = [
  { value: "super_admin", label: "Super Admin", color: "purple" },
  { value: "manager", label: "Manager", color: "blue" },
  { value: "barista", label: "Barista", color: "amber" },
  { value: "counter", label: "Counter", color: "green" },
  { value: "rider", label: "Rider", color: "orange" },
];

export default function AdminPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState("manager");
  const [permissionsByModule, setPermissionsByModule] =
    useState<PermissionGroup>({});
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Get current permissions for selected role
  const currentPermissions =
    rolePermissions.find((r) => r.role === selectedRole)?.permissions || [];

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [permissionsRes, rolesRes] = await Promise.all([
        adminPermissionsService.getAllPermissions(),
        adminPermissionsService.getAllRoles(),
      ]);

      setPermissionsByModule(permissionsRes.data?.data || {});
      setRolePermissions(rolesRes.data?.data || []);
    } catch (error) {
      console.error("Error loading permissions:", error);
      toast.error("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toggle a single permission
  const togglePermission = (permission: string) => {
    const updatedPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];

    setRolePermissions((prev) =>
      prev.map((r) =>
        r.role === selectedRole ? { ...r, permissions: updatedPermissions } : r,
      ),
    );
  };

  // Toggle all permissions in a module
  const toggleModule = (module: string, permissions: string[]) => {
    const allChecked = permissions.every((p) => currentPermissions.includes(p));

    let updatedPermissions;
    if (allChecked) {
      updatedPermissions = currentPermissions.filter(
        (p) => !permissions.includes(p),
      );
    } else {
      const newPermissions = permissions.filter(
        (p) => !currentPermissions.includes(p),
      );
      updatedPermissions = [...currentPermissions, ...newPermissions];
    }

    setRolePermissions((prev) =>
      prev.map((r) =>
        r.role === selectedRole ? { ...r, permissions: updatedPermissions } : r,
      ),
    );
  };

  // Check if all permissions in a module are selected
  const isModuleFullyChecked = (permissions: string[]) => {
    return (
      permissions.length > 0 &&
      permissions.every((p) => currentPermissions.includes(p))
    );
  };

  // Check if some permissions in a module are selected
  const isModulePartiallyChecked = (permissions: string[]) => {
    const someChecked = permissions.some((p) => currentPermissions.includes(p));
    const allChecked = permissions.every((p) => currentPermissions.includes(p));
    return someChecked && !allChecked;
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const roleData = rolePermissions.find((r) => r.role === selectedRole);
      if (roleData) {
        await adminPermissionsService.updateRolePermissions(selectedRole, {
          permissions: roleData.permissions,
        });
        toast.success(
          `Permissions updated for ${ROLES.find((r) => r.value === selectedRole)?.label}`,
        );
        await loadData();
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  // Reset to current saved state
  const handleReset = async () => {
    await loadData();
    toast.success("Reset to saved permissions");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Role Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage access control for each staff role
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
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {ROLES.map((role) => (
          <button
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors ${
              selectedRole === role.value
                ? `bg-${role.color}-100 text-${role.color}-700 border-b-2 border-${role.color}-500`
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">
                  Module / Permission
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Permission Key
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(permissionsByModule).map(
                ([module, permissions]) => (
                  <>
                    {/* Module Header Row */}
                    <tr className="bg-gray-50">
                      <td className="px-5 py-3 font-semibold text-gray-800">
                        <button
                          onClick={() => toggleModule(module, permissions)}
                          className="flex items-center gap-2 hover:text-amber-600 transition-colors"
                        >
                          {isModuleFullyChecked(permissions) ? (
                            <CheckSquare className="w-4 h-4 text-green-600" />
                          ) : isModulePartiallyChecked(permissions) ? (
                            <MinusSquare className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                          {module}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400">
                        Module level
                      </td>
                      <td className="px-5 py-3 text-center"></td>
                    </tr>

                    {/* Permission Rows */}
                    {permissions.map((permission) => (
                      <tr key={permission} className="hover:bg-gray-50">
                        <td className="px-5 py-3 pl-10 text-gray-600">
                          {permission
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </td>
                        <td className="px-5 py-3">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {permission}
                          </code>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => togglePermission(permission)}
                            className="flex items-center justify-center w-full"
                          >
                            {currentPermissions.includes(permission) ? (
                              <CheckSquare className="w-5 h-5 text-green-600" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
