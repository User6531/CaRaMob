export type NotificationType =
  | "service_status"
  | "service_reminder"
  | "history"
  | "system"
  | "promo";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  receivedAt: string;
  isRead: boolean;
}
