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
    id: "sto-queue",
    label: "Черга СТО",
    path: "/sto/queue",
    icon: "M4 6h16v2h2v10H6V8H4V6zm4 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z",
    requiredPermissions: [Permission.StoView],
  },
  {
    id: "booking-requests",
    label: "Онлайн-записи",
    path: "/sto/bookings",
    icon: "M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14v11zM7 11h5v2H7v-2zm7 0h5v2h-5v-2z",
    requiredPermissions: [Permission.StoView],
  },
  {
    id: "visits",
    label: "Візити",
    path: "/visits",
    icon: "M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h14v2H4v-2zm0 4h8v2H4v-2z",
    requiredPermissions: [Permission.StoView],
  },
  {
    id: "users",
    label: "Клієнти",
    path: "/users",
    icon: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 8a8 8 0 0 1 16 0H4z",
    requiredPermissions: [Permission.UsersView],
  },
  {
    id: "drivers",
    label: "Водії",
    path: "/drivers",
    icon: "M3 13h2l1-3h12l1 3h2v5h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3v-5zm4 0h10l-.5-1.5h-9L7 13z",
    requiredPermissions: [Permission.DriversView],
  },
  {
    id: "vehicles",
    label: "Авто",
    path: "/vehicles",
    icon: "M4 14l1-3h14l1 3v4h-2a2 2 0 1 1-4 0H10a2 2 0 1 1-4 0H4v-4zm2-.5h12l-.4-1.2H6.4L6 13.5z",
    requiredPermissions: [Permission.VehiclesView],
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
