import { Permission, type Permission as PermissionType } from "../auth/permissions";

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  /** SVG path d="" або символ для іконки */
  icon: string;
  /** Користувач має мати хоча б один з пермішенів */
  requiredPermissions: readonly PermissionType[];
  /** Якщо true — пункт видимий лише для global admin (shortcut) */
  globalAdminOnly?: boolean;
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "sto",
    label: "СТО",
    path: "/sto",
    icon: "M4 6h16v12H4V6zm2 2v8h12V8H6zm2 2h8v4H8v-4z",
    requiredPermissions: [Permission.StoView],
  },
  {
    id: "users",
    label: "Користувачі",
    path: "/users",
    icon: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 8a8 8 0 0 1 16 0H4z",
    requiredPermissions: [Permission.UsersView],
  },
  {
    id: "settings",
    label: "Налаштування",
    path: "/settings",
    icon: "M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm8.94 3.05a1 1 0 0 0-.26-1.09l-1.14-1.14a1 1 0 0 0-1.09-.26 7.07 7.07 0 0 0-1.07-.62 1 1 0 0 0-1.15.29l-.8.8a1 1 0 0 0-.29 1.15 7.07 7.07 0 0 0-.62 1.07 1 1 0 0 0-.26 1.09l1.14 1.14a1 1 0 0 0 1.09.26 7.07 7.07 0 0 0 1.07.62 1 1 0 0 0 1.15-.29l.8-.8a1 1 0 0 0 .29-1.15 7.07 7.07 0 0 0 .62-1.07 1 1 0 0 0 .26-1.09z",
    requiredPermissions: [Permission.SettingsView],
  },
];

export const DEFAULT_ROUTE = "/sto";
