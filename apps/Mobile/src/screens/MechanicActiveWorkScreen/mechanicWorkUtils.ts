import {
  MechanicWorkItem,
  MechanicWorkItemStatus,
} from "../../types/mechanicWork";

export const WORK_ITEM_STATUS_LABELS: Record<MechanicWorkItemStatus, string> = {
  pending: "Не розпочато",
  in_progress: "В роботі",
  completed: "Виконано",
};

export const WORK_ITEM_STATUS_ORDER: MechanicWorkItemStatus[] = [
  "pending",
  "in_progress",
  "completed",
];

export function getWorkItemStatusStyle(status: MechanicWorkItemStatus): {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
} {
  switch (status) {
    case "completed":
      return {
        backgroundColor: "rgba(74, 222, 158, 0.12)",
        borderColor: "rgba(74, 222, 158, 0.25)",
        textColor: "#4ADE9E",
      };
    case "in_progress":
      return {
        backgroundColor: "rgba(210, 153, 34, 0.12)",
        borderColor: "rgba(210, 153, 34, 0.25)",
        textColor: "#D29922",
      };
    case "pending":
    default:
      return {
        backgroundColor: "rgba(110, 118, 129, 0.15)",
        borderColor: "rgba(110, 118, 129, 0.25)",
        textColor: "#B0B0B0",
      };
  }
}

export function createEmptyWorkItem(
  kind: MechanicWorkItem["kind"] = "planned",
  awaitingApproval = false
): MechanicWorkItem {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: "",
    status: "pending",
    kind,
    price: "",
    photos: [],
    awaitingApproval,
  };
}

export function splitWorkItems(items: MechanicWorkItem[]) {
  const planned = items.filter((item) => item.kind === "planned");
  const recommended = items.filter((item) => item.kind === "recommended");
  return { planned, recommended };
}

export function parseWorkPrice(price: string): number {
  const parsed = Number(price.replace(",", ".").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatWorkPrice(price: string | number): string {
  const value = typeof price === "number" ? price : parseWorkPrice(price);
  if (value <= 0) return "0 грн";
  return `${value.toLocaleString("uk-UA")} грн`;
}

export function calculateWorksTotal(items: MechanicWorkItem[]): number {
  return items.reduce((sum, item) => sum + parseWorkPrice(item.price), 0);
}
