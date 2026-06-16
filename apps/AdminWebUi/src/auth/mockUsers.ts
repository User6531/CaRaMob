import type { AdminRole, AdminUser } from "../types/auth";
import { permissionsForRole } from "./permissions";

const MOCK_USERS: Record<AdminRole, AdminUser> = {
  globalAdmin: {
    id: "mock-global-admin",
    displayName: "Глобальний адмін",
    email: "admin@caramob.local",
    role: "globalAdmin",
    permissions: permissionsForRole("globalAdmin"),
  },
  stoAdmin: {
    id: "mock-sto-admin",
    displayName: "Адмін СТО",
    email: "sto-admin@caramob.local",
    role: "stoAdmin",
    permissions: permissionsForRole("stoAdmin"),
    stoId: "sto-001",
  },
  stoOperator: {
    id: "mock-sto-operator",
    displayName: "Оператор СТО",
    email: "operator@caramob.local",
    role: "stoOperator",
    permissions: permissionsForRole("stoOperator"),
    stoId: "sto-001",
  },
};

export function getMockUser(role: AdminRole = "globalAdmin"): AdminUser {
  return MOCK_USERS[role];
}

export const MOCK_ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: "globalAdmin", label: "Глобальний адмін" },
  { value: "stoAdmin", label: "Адмін СТО" },
  { value: "stoOperator", label: "Оператор СТО" },
];
