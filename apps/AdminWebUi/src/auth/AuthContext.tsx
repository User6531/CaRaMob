import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Permission } from "./permissions";
import { permissionsForRole } from "./permissions";
import type { AdminUser, AuthSession } from "../types/auth";
import { clearAuthSession, readAuthSession, saveAuthSession } from "./sessionStorage";

interface AuthContextValue {
  user: AdminUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: readonly Permission[]) => boolean;
  hasAllPermissions: (permissions: readonly Permission[]) => boolean;
  loginFromRedirect: (search: URLSearchParams) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function parseJwtPayload(token: string): Record<string, unknown> | null {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    return null;
  }

  const payloadPart = tokenParts[1];
  if (!payloadPart) {
    return null;
  }

  try {
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function buildAdminUser(session: AuthSession): AdminUser {
  const payload = parseJwtPayload(session.internalToken);
  const userId = typeof payload?.userId === "string" ? payload.userId : "unknown-admin";

  return {
    id: userId,
    displayName: "Telegram Admin",
    email: "admin@telegram.local",
    role: "globalAdmin",
    permissions: permissionsForRole("globalAdmin"),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession());

  const user = useMemo(() => (session ? buildAdminUser(session) : null), [session]);

  const hasPermission = useCallback(
    (permission: Permission) => Boolean(user?.permissions.includes(permission)),
    [user],
  );

  const hasAnyPermission = useCallback(
    (permissions: readonly Permission[]) =>
      permissions.some((permission) => Boolean(user?.permissions.includes(permission))),
    [user],
  );

  const hasAllPermissions = useCallback(
    (permissions: readonly Permission[]) =>
      permissions.every((permission) => Boolean(user?.permissions.includes(permission))),
    [user],
  );

  const loginFromRedirect = useCallback((search: URLSearchParams) => {
    const internalToken = search.get("internalToken");
    const refreshToken = search.get("refreshToken");
    const isAdmin = search.get("isAdmin");

    if (
      !internalToken ||
      refreshToken === null ||
      !isAdmin ||
      isAdmin.toLowerCase() !== "true"
    ) {
      return;
    }

    const nextSession: AuthSession = {
      internalToken,
      refreshToken,
      isAdmin: true,
    };

    saveAuthSession(nextSession);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(session?.internalToken),
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      loginFromRedirect,
      logout,
    }),
    [
      user,
      session,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      loginFromRedirect,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();
  return { hasPermission, hasAnyPermission, hasAllPermissions };
}
