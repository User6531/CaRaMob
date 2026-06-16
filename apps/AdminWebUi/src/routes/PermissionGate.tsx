import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePermissions } from "../auth/AuthContext";
import type { Permission } from "../auth/permissions";
import { DEFAULT_ROUTE } from "../config/navigation";

interface PermissionGateProps {
  requiredPermissions: readonly Permission[];
  requireAll?: boolean;
  children: ReactNode;
}

export function PermissionGate({
  requiredPermissions,
  requireAll = false,
  children,
}: PermissionGateProps) {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  const allowed = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!allowed) {
    return <Navigate to={DEFAULT_ROUTE} replace />;
  }

  return children;
}
