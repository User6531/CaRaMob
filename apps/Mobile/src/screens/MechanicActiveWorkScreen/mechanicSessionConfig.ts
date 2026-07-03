import { MechanicSessionStatus } from "../../types/mechanicWork";
import { ServiceStatusId } from "../../types/serviceStatus";

export interface MechanicSessionStepConfig {
  id: MechanicSessionStatus;
  title: string;
  shortTitle: string;
}

export const MECHANIC_SESSION_STEPS: MechanicSessionStepConfig[] = [
  { id: "waiting", title: "Очікує", shortTitle: "Очікує" },
  { id: "accepted", title: "Прийнято", shortTitle: "Прийнято" },
  { id: "diagnostics", title: "Діагностика", shortTitle: "Діагностика" },
  { id: "repair", title: "Ремонт", shortTitle: "Ремонт" },
  { id: "final_check", title: "Фінальна перевірка", shortTitle: "Перевірка" },
  { id: "estimate", title: "Кошторис", shortTitle: "Кошторис" },
  { id: "completed", title: "Завершено", shortTitle: "Завершено" },
];

const VISIBLE_STEPS: MechanicSessionStatus[] = [
  "waiting",
  "accepted",
  "diagnostics",
  "repair",
  "final_check",
  "estimate",
];

export function getSessionStepIndex(status: MechanicSessionStatus): number {
  const timelineStatus = status === "waiting_parts" ? "repair" : status;
  return MECHANIC_SESSION_STEPS.findIndex((step) => step.id === timelineStatus);
}

export function getSessionStatusLabel(status: MechanicSessionStatus): string {
  if (status === "waiting_parts") return "Очікує деталей";

  return (
    MECHANIC_SESSION_STEPS.find((step) => step.id === status)?.shortTitle ?? status
  );
}

export function getSessionProgress(status: MechanicSessionStatus): number {
  const index = getSessionStepIndex(status);
  if (index <= 0) return 0;
  const lastIndex = getSessionStepIndex("estimate");
  return Math.round((index / lastIndex) * 100);
}

export function getVisibleSessionSteps(): MechanicSessionStepConfig[] {
  return MECHANIC_SESSION_STEPS.filter((step) =>
    VISIBLE_STEPS.includes(step.id)
  );
}

export function mapSessionToDriverStatus(
  status: MechanicSessionStatus
): ServiceStatusId {
  switch (status) {
    case "waiting":
      return "received";
    case "accepted":
      return "received";
    case "diagnostics":
      return "diagnostics";
    case "repair":
      return "in_progress";
    case "waiting_parts":
      return "waiting_parts";
    case "final_check":
      return "quality_check";
    case "estimate":
    case "completed":
      return "ready";
    default:
      return "received";
  }
}

export interface StatusBadgeStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  dotColor: string;
}

const SESSION_BADGE_STYLES: Record<MechanicSessionStatus, StatusBadgeStyle> = {
  waiting: {
    backgroundColor: "rgba(110, 118, 129, 0.15)",
    borderColor: "rgba(110, 118, 129, 0.25)",
    textColor: "#B0B0B0",
    dotColor: "#8E8E93",
  },
  accepted: {
    backgroundColor: "rgba(110, 118, 129, 0.15)",
    borderColor: "rgba(110, 118, 129, 0.25)",
    textColor: "#B0B0B0",
    dotColor: "#8E8E93",
  },
  diagnostics: {
    backgroundColor: "rgba(210, 153, 34, 0.12)",
    borderColor: "rgba(210, 153, 34, 0.25)",
    textColor: "#D29922",
    dotColor: "#D29922",
  },
  repair: {
    backgroundColor: "rgba(74, 222, 158, 0.1)",
    borderColor: "rgba(74, 222, 158, 0.2)",
    textColor: "#4ADE9E",
    dotColor: "#4ADE9E",
  },
  waiting_parts: {
    backgroundColor: "rgba(255, 166, 87, 0.12)",
    borderColor: "rgba(255, 166, 87, 0.25)",
    textColor: "#FFA657",
    dotColor: "#FFA657",
  },
  final_check: {
    backgroundColor: "rgba(163, 113, 247, 0.12)",
    borderColor: "rgba(163, 113, 247, 0.25)",
    textColor: "#A371F7",
    dotColor: "#A371F7",
  },
  estimate: {
    backgroundColor: "rgba(255, 166, 87, 0.12)",
    borderColor: "rgba(255, 166, 87, 0.25)",
    textColor: "#FFA657",
    dotColor: "#FFA657",
  },
  completed: {
    backgroundColor: "rgba(74, 222, 158, 0.15)",
    borderColor: "rgba(74, 222, 158, 0.35)",
    textColor: "#4ADE9E",
    dotColor: "#4ADE9E",
  },
};

export function getSessionBadgeStyle(
  status: MechanicSessionStatus
): StatusBadgeStyle {
  return SESSION_BADGE_STYLES[status];
}
