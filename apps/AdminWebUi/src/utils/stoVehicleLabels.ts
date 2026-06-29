import type { StoVehicleQueueStatus } from "../types/stoVehicle";

export const STO_VEHICLE_STATUS_LABELS: Record<StoVehicleQueueStatus, string> = {
  scheduled: "Записано",
  waiting: "Очікує черги",
  diagnostics: "Діагностика",
  in_repair: "В ремонті",
  waiting_parts: "Очікує деталей",
  quality_check: "Перевірка робіт",
  ready: "Готово до видачі",
};

export const STO_VEHICLE_STATUS_ORDER: StoVehicleQueueStatus[] = [
  "scheduled",
  "waiting",
  "diagnostics",
  "in_repair",
  "waiting_parts",
  "quality_check",
  "ready",
];

export const STO_VEHICLE_COLUMN_DESCRIPTIONS: Record<StoVehicleQueueStatus, string> = {
  scheduled: "Записані на прийом, ще не приїхали",
  waiting: "Прибули на СТО, очікують початку робіт",
  diagnostics: "Проводиться діагностика та оцінка робіт",
  in_repair: "Зараз у процесі обслуговування",
  waiting_parts: "Роботи призупинені до постачання деталей",
  quality_check: "Перевірка виконаних робіт перед видачею",
  ready: "Перевірка пройдена, чекають на клієнта",
};

export interface StatusBadgeStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  dotColor: string;
}

export function getStoVehicleStatusBadgeStyle(
  status: StoVehicleQueueStatus,
): StatusBadgeStyle {
  switch (status) {
    case "scheduled":
      return {
        backgroundColor: "rgba(110, 118, 129, 0.2)",
        borderColor: "rgba(110, 118, 129, 0.3)",
        textColor: "#8b949e",
        dotColor: "#6e7681",
      };
    case "waiting":
      return {
        backgroundColor: "rgba(210, 153, 34, 0.12)",
        borderColor: "rgba(210, 153, 34, 0.25)",
        textColor: "#d29922",
        dotColor: "#d29922",
      };
    case "diagnostics":
      return {
        backgroundColor: "rgba(88, 166, 255, 0.12)",
        borderColor: "rgba(88, 166, 255, 0.28)",
        textColor: "#58a6ff",
        dotColor: "#58a6ff",
      };
    case "in_repair":
      return {
        backgroundColor: "rgba(74, 222, 158, 0.12)",
        borderColor: "rgba(74, 222, 158, 0.25)",
        textColor: "#4ade9e",
        dotColor: "#4ade9e",
      };
    case "waiting_parts":
      return {
        backgroundColor: "rgba(255, 166, 87, 0.14)",
        borderColor: "rgba(255, 166, 87, 0.32)",
        textColor: "#ffa657",
        dotColor: "#ffa657",
      };
    case "quality_check":
      return {
        backgroundColor: "rgba(163, 113, 247, 0.12)",
        borderColor: "rgba(163, 113, 247, 0.28)",
        textColor: "#a371f7",
        dotColor: "#a371f7",
      };
    case "ready":
      return {
        backgroundColor: "rgba(74, 222, 158, 0.15)",
        borderColor: "rgba(74, 222, 158, 0.3)",
        textColor: "#4ade9e",
        dotColor: "#4ade9e",
      };
  }
}

export function getVehicleStepPhase(
  step: StoVehicleQueueStatus,
  currentStatus: StoVehicleQueueStatus,
): "completed" | "current" | "upcoming" {
  const stepIndex = STO_VEHICLE_STATUS_ORDER.indexOf(step);
  const currentIndex = STO_VEHICLE_STATUS_ORDER.indexOf(currentStatus);
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "upcoming";
}

export function getVehicleStepIndex(status: StoVehicleQueueStatus): number {
  return STO_VEHICLE_STATUS_ORDER.indexOf(status);
}

export function formatStoVehicleTitle(brand: string, model: string, year?: number): string {
  const base = `${brand} ${model}`;
  return year ? `${base}, ${year}` : base;
}

export function formatAppointmentDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (startOfDate.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000),
  );

  const time = date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Сьогодні о ${time}`;
  if (diffDays === 1) return `Завтра о ${time}`;

  const datePart = date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
  });

  return `${datePart} о ${time}`;
}

export function formatArrivedAt(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / (24 * 60 * 60 * 1000),
  );

  const time = date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Прибув сьогодні о ${time}`;
  if (diffDays === 1) return `Прибув вчора о ${time}`;

  return `Прибув ${date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function formatEventDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / (24 * 60 * 60 * 1000),
  );

  const time = date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Сьогодні, ${time}`;
  if (diffDays === 1) return `Вчора, ${time}`;

  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
