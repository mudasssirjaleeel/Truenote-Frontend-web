import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { usePermissions } from "../../hooks/usePermissions";
import { useEffect, useState } from "react";

interface AdminRouteProps {
  permission?: string;
  permissions?: string[];
}

export default function AdminRoute({
  permission,
  permissions,
}: AdminRouteProps) {
  const { token, user } = useAppSelector((s) => s.auth);
  const { hasPermission, hasAnyPermission, isAdmin } = usePermissions();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Debug logs
  useEffect(() => {
    console.log("🔐 AdminRoute Debug - isAdmin:", isAdmin);
    console.log("🔐 AdminRoute Debug - user:", user);
    console.log("🔐 AdminRoute Debug - permissions:", user?.permissions);
  }, [user, isAdmin]);

  // Not logged in
  if (!token) {
    console.log("No token, redirecting to login");
    return <Navigate to="/admin/login" replace />;
  }

  // Wait for readiness
  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const hasAdminAccess = user?.role === "admin" || user?.role === "staff";

  if (!hasAdminAccess) {
    console.log("Not admin or staff, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // For admin users (super_admin), skip permission checks
  if (isAdmin) {
    console.log("Admin user, access granted");
    return <Outlet />;
  }

  // For staff users, check specific permissions
  if (permission && !hasPermission(permission)) {
    console.log(`Permission denied: ${permission}`);
    return <Navigate to="/admin/unauthorized" replace />;
  }

  if (permissions && !hasAnyPermission(permissions)) {
    console.log(`Permissions denied: need one of ${permissions.join(", ")}`);
    return <Navigate to="/admin/unauthorized" replace />;
  }

  console.log("Staff access granted");
  return <Outlet />;
}
