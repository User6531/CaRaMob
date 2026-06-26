import { AppNotification, NotificationType } from "../../types/notification";

export interface NotificationSection {
  key: string;
  label: string;
  items: AppNotification[];
  sortOrder: number;
}

const GROUP_SORT_ORDER: Record<string, number> = {
  today: 0,
  yesterday: 1,
  this_week: 2,
  this_month: 3,
  last_month: 4,
};

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function capitalizeFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getNotificationGroupKey(receivedAt: string, now = new Date()): string {
  const date = startOfDay(new Date(receivedAt));
  const today = startOfDay(now);
  const diffMs = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return "this_week";
  if (isSameMonth(date, now)) return "this_month";

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  if (isSameMonth(date, lastMonth)) return "last_month";

  return `month:${date.getFullYear()}-${date.getMonth()}`;
}

export function getNotificationGroupLabel(key: string): string {
  switch (key) {
    case "today":
      return "Сьогодні";
    case "yesterday":
      return "Вчора";
    case "this_week":
      return "Цей тиждень";
    case "this_month":
      return "Цей місяць";
    case "last_month":
      return "Місяць тому";
    default: {
      const match = key.match(/^month:(\d+)-(\d+)$/);
      if (!match) return key;

      const year = Number(match[1]);
      const month = Number(match[2]);
      const label = new Date(year, month, 1).toLocaleDateString("uk-UA", {
        month: "long",
        year: "numeric",
      });
      return capitalizeFirst(label);
    }
  }
}

function getGroupSortOrder(key: string, items: AppNotification[]): number {
  if (key in GROUP_SORT_ORDER) {
    return GROUP_SORT_ORDER[key];
  }

  const latest = Math.max(
    ...items.map((item) => new Date(item.receivedAt).getTime())
  );
  return 100 + (Date.now() - latest) / 1_000_000;
}

export function groupNotificationsByDate(
  notifications: AppNotification[]
): NotificationSection[] {
  const groups = new Map<string, AppNotification[]>();

  const sorted = [...notifications].sort(
    (a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );

  sorted.forEach((notification) => {
    const key = getNotificationGroupKey(notification.receivedAt);
    const bucket = groups.get(key) ?? [];
    bucket.push(notification);
    groups.set(key, bucket);
  });

  return Array.from(groups.entries())
    .map(([key, items]) => ({
      key,
      label: getNotificationGroupLabel(key),
      items,
      sortOrder: getGroupSortOrder(key, items),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function formatNotificationTime(receivedAt: string, now = new Date()): string {
  const date = new Date(receivedAt);
  if (Number.isNaN(date.getTime())) return "";

  const groupKey = getNotificationGroupKey(receivedAt, now);
  const time = date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (groupKey === "today") return time;
  if (groupKey === "yesterday") return `Вчора, ${time}`;

  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getNotificationIcon(
  type: NotificationType
): "tool" | "bell" | "clipboard" | "info" | "tag" {
  switch (type) {
    case "service_status":
      return "tool";
    case "service_reminder":
      return "bell";
    case "history":
      return "clipboard";
    case "promo":
      return "tag";
    case "system":
    default:
      return "info";
  }
}
