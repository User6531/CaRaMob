import type { StoQueueVehicle, StoVehicleQueueStatus } from "../types/stoVehicle";
import { getPendingApprovals } from "./stoVehicleApprovals";
import {
  formatAppointmentDate,
  formatArrivedAt,
  formatEventDateTime,
  STO_VEHICLE_COLUMN_DESCRIPTIONS,
  STO_VEHICLE_STATUS_LABELS,
} from "./stoVehicleLabels";

type StepPhase = "completed" | "current" | "upcoming";

export interface StepDetailItem {
  label: string;
  value: string;
}

export interface StoVehicleStepContent {
  title: string;
  description: string;
  items: StepDetailItem[];
  note?: string;
}

function buildDetailItems(items: Array<StepDetailItem | null>): StepDetailItem[] {
  return items.filter((item): item is StepDetailItem => item !== null);
}

function buildPendingApprovalsNote(vehicle: StoQueueVehicle): string | undefined {
  const pending = getPendingApprovals(vehicle);
  if (pending.length === 0) return undefined;

  return `Є активні запити на погодження (${pending.length}). Перегляньте блок «Погодження» нижче.`;
}

export function getStoVehicleStepContent(
  vehicle: StoQueueVehicle,
  step: StoVehicleQueueStatus,
  phase: StepPhase,
): StoVehicleStepContent {
  const isPast = phase === "completed";
  const isFuture = phase === "upcoming";
  const stepLabel = STO_VEHICLE_STATUS_LABELS[step];
  const pendingNote = buildPendingApprovalsNote(vehicle);

  if (isFuture) {
    return {
      title: stepLabel,
      description: STO_VEHICLE_COLUMN_DESCRIPTIONS[step],
      items: [],
      note: pendingNote ?? "Цей етап ще не розпочато.",
    };
  }

  switch (step) {
    case "scheduled":
      return {
        title: "Запис на прийом",
        description: STO_VEHICLE_COLUMN_DESCRIPTIONS.scheduled,
        items: buildDetailItems([
          vehicle.appointmentAt
            ? { label: "Дата та час", value: formatAppointmentDate(vehicle.appointmentAt) }
            : { label: "Дата та час", value: "Не вказано" },
          { label: "Джерело", value: vehicle.isManualEntry ? "Додано вручну" : "Додаток CaRaMob" },
          { label: "Створено", value: formatEventDateTime(vehicle.createdAt) },
        ]),
        note: pendingNote,
      };

    case "waiting":
      return {
        title: "Очікування черги",
        description: STO_VEHICLE_COLUMN_DESCRIPTIONS.waiting,
        items: buildDetailItems([
          vehicle.arrivedAt
            ? { label: "Час прибуття", value: formatArrivedAt(vehicle.arrivedAt) }
            : null,
          { label: "Проблема", value: vehicle.problemSummary ?? "Не вказано" },
          vehicle.mechanicName
            ? { label: "Призначений механік", value: vehicle.mechanicName }
            : { label: "Механік", value: "Ще не призначено" },
        ]),
        note: pendingNote,
      };

    case "diagnostics":
      return {
        title: "Діагностика",
        description: STO_VEHICLE_COLUMN_DESCRIPTIONS.diagnostics,
        items: buildDetailItems([
          { label: "Скарга клієнта", value: vehicle.problemSummary ?? "Не вказано" },
          vehicle.mechanicName ? { label: "Діагност", value: vehicle.mechanicName } : null,
        ]),
        note:
          pendingNote ??
          (isPast ? "Діагностику завершено, кошторис погоджено." : undefined),
      };

    case "in_repair":
      return {
        title: "Ремонт",
        description: STO_VEHICLE_COLUMN_DESCRIPTIONS.in_repair,
        items: buildDetailItems([
          vehicle.mechanicName
            ? { label: "Механік", value: vehicle.mechanicName }
            : { label: "Механік", value: "Не призначено" },
          {
            label: "Прогрес",
            value: vehicle.progress !== undefined ? `${vehicle.progress}%` : "—",
          },
          { label: "Оновлено", value: formatEventDateTime(vehicle.updatedAt) },
        ]),
        note: pendingNote,
      };

    case "waiting_parts":
      return {
        title: "Очікування деталей",
        description: STO_VEHICLE_COLUMN_DESCRIPTIONS.waiting_parts,
        items: buildDetailItems([
          vehicle.mechanicName ? { label: "Механік", value: vehicle.mechanicName } : null,
          {
            label: "Статус робіт",
            value: isPast ? "Деталі отримано, роботи відновлено" : "Роботи призупинено",
          },
        ]),
        note: pendingNote,
      };

    case "quality_check":
      return {
        title: "Перевірка виконаних робіт",
        description: STO_VEHICLE_COLUMN_DESCRIPTIONS.quality_check,
        items: buildDetailItems([
          {
            label: "Прогрес",
            value: vehicle.progress !== undefined ? `${vehicle.progress}%` : "—",
          },
          { label: "Контролер", value: vehicle.mechanicName ?? "Не призначено" },
          { label: "Перевірка", value: isPast ? "Пройдено успішно" : "В процесі" },
        ]),
        note: pendingNote,
      };

    case "ready":
      return {
        title: "Готово до видачі",
        description: STO_VEHICLE_COLUMN_DESCRIPTIONS.ready,
        items: buildDetailItems([
          { label: "Власник", value: vehicle.clientName },
          vehicle.clientPhone ? { label: "Телефон", value: vehicle.clientPhone } : null,
          {
            label: "Статус оплати",
            value: phase === "current" ? "Очікує розрахунку" : "Готово до видачі",
          },
        ]),
        note: pendingNote ?? (phase === "current" ? "Клієнта можна запрошувати на видачу авто." : undefined),
      };
  }
}
