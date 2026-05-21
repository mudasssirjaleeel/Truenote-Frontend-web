import type { ReactNode } from "react";
import { usePermissions } from "../../hooks/usePermissions";

interface PermissionGuardProps {
  permission: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export const PermissionGuard = ({
  permission,
  fallback = null,
  children,
}: PermissionGuardProps) => {
  const { hasPermission, isAdmin } = usePermissions();

  if (isAdmin || hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

// For multiple permissions (any)
interface AnyPermissionGuardProps {
  permissions: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const AnyPermissionGuard = ({
  permissions,
  fallback = null,
  children,
}: AnyPermissionGuardProps) => {
  const { hasAnyPermission, isAdmin } = usePermissions();

  if (isAdmin || hasAnyPermission(permissions)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

// For role-based guard
interface RoleGuardProps {
  roles: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const RoleGuard = ({
  roles,
  fallback = null,
  children,
}: RoleGuardProps) => {
  const { hasAnyRole, isAdmin } = usePermissions();

  if (isAdmin || hasAnyRole(roles)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
