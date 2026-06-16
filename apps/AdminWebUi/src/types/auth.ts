import type { Permission } from "../auth/permissions";

export type AdminRole = "globalAdmin" | "stoAdmin" | "stoOperator";

export interface AdminUser {
  id: string;
  displayName: string;
  email: string;
  role: AdminRole;
  permissions: readonly Permission[];
  /** Прив'язка до конкретного СТО (для ролей нижче global admin) */
  stoId?: string;
}

export interface AuthSession {
  internalToken: string;
  refreshToken: string;
  isAdmin: boolean;
}
