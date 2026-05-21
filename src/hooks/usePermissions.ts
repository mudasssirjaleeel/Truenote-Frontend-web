import { useSelector } from "react-redux";
import {
  selectPermissions,
  selectUserRole,
  selectIsAdmin,
} from "../store/slices/authSlice";

export const usePermissions = () => {
  // Try to get from Redux first
  let permissions = useSelector(selectPermissions);
  let role = useSelector(selectUserRole);
  let isAdmin = useSelector(selectIsAdmin);

  // If Redux doesn't have permissions, try localStorage
  if (!permissions || permissions.length === 0) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      permissions = user.permissions || [];
      role = user.roleName || user.role;
      isAdmin = user.role === "admin" || user.roleName === "super_admin";
    }
  }

  console.log("🔐 usePermissions - isAdmin:", isAdmin);
  console.log("🔐 usePermissions - role:", role);
  console.log("🔐 usePermissions - permissions count:", permissions?.length);

  const hasPermission = (permission: string): boolean => {
    if (isAdmin) return true;
    return permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissionsList: string[]): boolean => {
    if (isAdmin) return true;
    return permissionsList.some((p) => permissions?.includes(p));
  };

  const hasAllPermissions = (permissionsList: string[]): boolean => {
    if (isAdmin) return true;
    return permissionsList.every((p) => permissions?.includes(p));
  };

  const hasRole = (roleName: string): boolean => {
    return role === roleName;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(role || "");
  };

  return {
    permissions,
    role,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  };
};
