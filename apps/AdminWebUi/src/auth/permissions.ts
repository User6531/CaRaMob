/**
 * Централізований реєстр пермішенів.
 * Нові можливості додаються сюди — UI і роутинг підхоплюють їх автоматично.
 */
export const Permission = {
  StoView: "sto.view",
  StoCreate: "sto.create",
  StoEdit: "sto.edit",
  StoDelete: "sto.delete",
  UsersView: "users.view",
  UsersManage: "users.manage",
  SettingsView: "settings.view",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export const ALL_PERMISSIONS: readonly Permission[] = Object.values(Permission);

/** Мапінг ролей → пермішени (тимчасово; пізніше прийде з бекенду) */
export const ROLE_PERMISSIONS = {
  globalAdmin: [
    Permission.StoView,
    Permission.StoCreate,
    Permission.StoEdit,
    Permission.StoDelete,
    Permission.UsersView,
    Permission.UsersManage,
    Permission.SettingsView,
  ],
  stoAdmin: [
    Permission.StoView,
    Permission.StoEdit,
    Permission.UsersView,
    Permission.SettingsView,
  ],
  stoOperator: [Permission.StoView],
} as const satisfies Record<string, readonly Permission[]>;

export function permissionsForRole(
  role: keyof typeof ROLE_PERMISSIONS,
): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}
