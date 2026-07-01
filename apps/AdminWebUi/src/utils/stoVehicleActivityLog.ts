import type {
  StoQueueVehicle,
  StoVehicleActivityEntry,
  StoVehicleApprovalRequest,
} from "../types/stoVehicle";
import { APPROVAL_TYPE_LABELS, formatPriceUah } from "./stoVehicleApprovals";
import {
  formatEventDateTime,
  getVehicleStepIndex,
  STO_VEHICLE_STATUS_LABELS,
  STO_VEHICLE_STATUS_ORDER,
} from "./stoVehicleLabels";

function interpolateIsoTime(startIso: string, endIso: string, ratio: number): string {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return endIso;
  }
  return new Date(start + (end - start) * ratio).toISOString();
}

function formatApprovalItemsSummary(request: StoVehicleApprovalRequest): string | undefined {
  const items = request.lineItems ?? [];
  if (items.length === 0) return undefined;

  const preview = items
    .slice(0, 3)
    .map((item) => {
      const qty = item.quantity && item.quantity > 1 ? ` ×${item.quantity}` : "";
      return `${item.title}${qty}`;
    })
    .join(", ");

  const suffix = items.length > 3 ? ` та ще ${items.length - 3}` : "";
  const total = request.totalAmount;
  const totalPart = total != null ? ` · ${formatPriceUah(total)}` : "";

  return `${preview}${suffix}${totalPart}`;
}

function buildApprovalEntries(
  vehicle: StoQueueVehicle,
  request: StoVehicleApprovalRequest,
): StoVehicleActivityEntry[] {
  const entries: StoVehicleActivityEntry[] = [];
  const typeLabel = APPROVAL_TYPE_LABELS[request.type];
  const itemsSummary = formatApprovalItemsSummary(request);

  entries.push({
    id: `${request.id}-requested`,
    type: "approval_requested",
    occurredAt: request.createdAt,
    actorName: request.requestedBy,
    actorRole: "mechanic",
    title: `Створено запит: ${typeLabel}`,
    description: itemsSummary ?? request.description,
  });

  if (request.sentToClientAt) {
    entries.push({
      id: `${request.id}-sent`,
      type: "approval_sent_to_client",
      occurredAt: request.sentToClientAt,
      actorName: "Менеджер СТО",
      actorRole: "manager",
      title: `Надіслано клієнту на погодження: ${typeLabel}`,
      description: `Очікує відповіді від ${vehicle.clientName}`,
    });
  }

  if (request.clientNotifiedAt) {
    entries.push({
      id: `${request.id}-notified`,
      type: "approval_sent_to_client",
      occurredAt: request.clientNotifiedAt,
      actorName: "Система",
      actorRole: "system",
      title: `Нагадування клієнту: ${typeLabel}`,
      description: `Повторне сповіщення для ${vehicle.clientName}`,
    });
  }

  if (request.status === "approved" && request.reviewedAt) {
    const byManager = request.approverRole === "manager";
    entries.push({
      id: `${request.id}-approved`,
      type: "approval_approved",
      occurredAt: request.reviewedAt,
      actorName: request.approvedByName ?? (byManager ? "Менеджер СТО" : vehicle.clientName),
      actorRole: byManager ? "manager" : "client",
      title: `Погоджено: ${typeLabel}`,
      description: request.managerOverrideReason ?? itemsSummary,
    });
  }

  if (request.status === "rejected" && request.reviewedAt) {
    entries.push({
      id: `${request.id}-rejected`,
      type: "approval_rejected",
      occurredAt: request.reviewedAt,
      actorName: request.approvedByName ?? vehicle.clientName,
      actorRole: request.approverRole === "manager" ? "manager" : "client",
      title: `Відхилено: ${typeLabel}`,
      description: request.rejectionReason,
    });
  }

  return entries;
}

function buildDerivedActivityLog(vehicle: StoQueueVehicle): StoVehicleActivityEntry[] {
  const entries: StoVehicleActivityEntry[] = [];

  entries.push({
    id: `${vehicle.id}-created`,
    type: "vehicle_created",
    occurredAt: vehicle.createdAt,
    actorName: vehicle.isManualEntry ? "Оператор СТО" : "Система",
    actorRole: vehicle.isManualEntry ? "operator" : "system",
    title: vehicle.isManualEntry ? "Автомобіль додано вручну" : "Автомобіль зареєстровано в черзі",
    description: vehicle.problemSummary,
  });

  if (vehicle.appointmentAt) {
    entries.push({
      id: `${vehicle.id}-appointment`,
      type: "appointment_scheduled",
      occurredAt: vehicle.appointmentAt,
      actorName: vehicle.clientName,
      actorRole: "client",
      title: "Запис на прийом",
      description: formatEventDateTime(vehicle.appointmentAt),
    });
  }

  if (vehicle.arrivedAt) {
    entries.push({
      id: `${vehicle.id}-arrived`,
      type: "vehicle_arrived",
      occurredAt: vehicle.arrivedAt,
      actorName: "Оператор СТО",
      actorRole: "operator",
      title: "Автомобіль прибув на СТО",
    });
  }

  const currentIndex = getVehicleStepIndex(vehicle.status);
  const statusesToLog = STO_VEHICLE_STATUS_ORDER.slice(0, currentIndex + 1);
  const statusTimelineEnd = vehicle.updatedAt;

  statusesToLog.forEach((status, index) => {
    const ratio =
      statusesToLog.length === 1 ? 0 : index / Math.max(statusesToLog.length - 1, 1);
    const occurredAt = interpolateIsoTime(vehicle.createdAt, statusTimelineEnd, ratio);
    const label = STO_VEHICLE_STATUS_LABELS[status];

    entries.push({
      id: `${vehicle.id}-status-${status}`,
      type: "status_changed",
      occurredAt,
      actorName: "Оператор СТО",
      actorRole: "operator",
      title:
        index === 0
          ? `Початковий етап: ${label}`
          : `Етап змінено на «${label}»`,
    });
  });

  if (vehicle.mechanicName) {
    const mechanicTime = vehicle.arrivedAt
      ? interpolateIsoTime(vehicle.arrivedAt, vehicle.updatedAt, 0.35)
      : interpolateIsoTime(vehicle.createdAt, vehicle.updatedAt, 0.4);

    entries.push({
      id: `${vehicle.id}-mechanic`,
      type: "mechanic_assigned",
      occurredAt: mechanicTime,
      actorName: "Менеджер СТО",
      actorRole: "manager",
      title: "Призначено механіка",
      description: vehicle.mechanicName,
    });
  }

  for (const request of vehicle.approvalRequests ?? []) {
    entries.push(...buildApprovalEntries(vehicle, request));
  }

  return entries;
}

export function buildVehicleActivityLog(vehicle: StoQueueVehicle): StoVehicleActivityEntry[] {
  const entries =
    vehicle.activityLog && vehicle.activityLog.length > 0
      ? [...vehicle.activityLog]
      : buildDerivedActivityLog(vehicle);

  return entries.sort(
    (left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
  );
}

export const ACTIVITY_ACTOR_ROLE_LABELS: Record<
  StoVehicleActivityEntry["actorRole"],
  string
> = {
  system: "Система",
  operator: "Оператор",
  manager: "Менеджер",
  mechanic: "Механік",
  client: "Клієнт",
};
