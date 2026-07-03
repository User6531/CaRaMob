import type { VisitStatus } from "../types/visit";

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  in_progress: "В роботі",
  completed: "Завершено",
  cancelled: "Скасовано",
  waiting_payment: "Очікує оплати",
};

export interface VisitStatusBadgeStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  dotColor: string;
}

export function getVisitStatusBadgeStyle(status: VisitStatus): VisitStatusBadgeStyle {
  switch (status) {
    case "in_progress":
      return {
        backgroundColor: "rgba(88, 166, 255, 0.15)",
        borderColor: "rgba(88, 166, 255, 0.3)",
        textColor: "#58a6ff",
        dotColor: "#58a6ff",
      };
    case "completed":
      return {
        backgroundColor: "rgba(74, 222, 158, 0.15)",
        borderColor: "rgba(74, 222, 158, 0.3)",
        textColor: "#4ade9e",
        dotColor: "#4ade9e",
      };
    case "waiting_payment":
      return {
        backgroundColor: "rgba(255, 166, 87, 0.14)",
        borderColor: "rgba(255, 166, 87, 0.28)",
        textColor: "#ffa657",
        dotColor: "#ffa657",
      };
    case "cancelled":
      return {
        backgroundColor: "rgba(248, 81, 73, 0.12)",
        borderColor: "rgba(248, 81, 73, 0.28)",
        textColor: "#f85149",
        dotColor: "#f85149",
      };
  }
}

export function formatVisitTitle(brand: string, model: string, year?: number): string {
  return year ? `${brand} ${model} · ${year}` : `${brand} ${model}`;
}

export function formatVisitPrice(amount: number): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calcVisitTotal(records: { price: number }[]): number {
  return records.reduce((sum, record) => sum + record.price, 0);
}

export function formatVisitDate(isoDate: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function formatVisitDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}
