import type { StoVehicleActivityEntry } from "../types/stoVehicle";
import type { VisitListItem, VisitStatus } from "../types/visit";
import { formatVisitPrice, VISIT_STATUS_LABELS } from "./visitLabels";

function interpolateIsoTime(startIso: string, endIso: string, ratio: number): string {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return endIso;
  }
  return new Date(start + (end - start) * ratio).toISOString();
}

const VISIT_STATUS_ORDER: VisitStatus[] = [
  "in_progress",
  "waiting_payment",
  "completed",
];

function getVisitStatusIndex(status: VisitStatus): number {
  if (status === "cancelled") return -1;
  return VISIT_STATUS_ORDER.indexOf(status);
}

function buildDerivedVisitActivityLog(visit: VisitListItem): StoVehicleActivityEntry[] {
  const entries: StoVehicleActivityEntry[] = [];
  const endTime = visit.completedAt ?? visit.updatedAt ?? visit.createdAt;

  entries.push({
    id: `${visit.id}-created`,
    type: "vehicle_created",
    occurredAt: visit.createdAt,
    actorName: "Оператор СТО",
    actorRole: "operator",
    title: "Візит відкрито",
    description: visit.description || visit.title,
  });

  if (visit.mechanicName) {
    entries.push({
      id: `${visit.id}-mechanic`,
      type: "mechanic_assigned",
      occurredAt: interpolateIsoTime(visit.createdAt, endTime, 0.15),
      actorName: "Менеджер СТО",
      actorRole: "manager",
      title: "Призначено механіка",
      description: visit.mechanicName,
    });
  }

  const currentIndex = getVisitStatusIndex(visit.status);
  if (currentIndex >= 0) {
    const statusesToLog = VISIT_STATUS_ORDER.slice(0, currentIndex + 1);
    statusesToLog.forEach((status, index) => {
      const ratio =
        statusesToLog.length === 1 ? 0.25 : 0.2 + index / Math.max(statusesToLog.length, 1) * 0.35;

      entries.push({
        id: `${visit.id}-status-${status}`,
        type: "status_changed",
        occurredAt: interpolateIsoTime(visit.createdAt, endTime, ratio),
        actorName: "Оператор СТО",
        actorRole: "operator",
        title: `Статус: ${VISIT_STATUS_LABELS[status]}`,
      });
    });
  }

  visit.records.forEach((record, index) => {
    const ratio = 0.35 + (index / Math.max(visit.records.length, 1)) * 0.4;
    entries.push({
      id: `${visit.id}-record-${record.id}`,
      type: "approval_requested",
      occurredAt: interpolateIsoTime(visit.createdAt, endTime, ratio),
      actorName: visit.mechanicName ?? "Механік",
      actorRole: "mechanic",
      title: `Додано до кошторису: ${record.title}`,
      description: formatVisitPrice(record.price),
    });
  });

  if (visit.status === "waiting_payment") {
    entries.push({
      id: `${visit.id}-payment`,
      type: "approval_sent_to_client",
      occurredAt: visit.updatedAt ?? endTime,
      actorName: "Менеджер СТО",
      actorRole: "manager",
      title: "Надіслано клієнту на оплату",
      description: `Очікує оплати від ${visit.clientName}`,
    });
  }

  if (visit.status === "completed" && visit.completedAt) {
    entries.push({
      id: `${visit.id}-completed`,
      type: "approval_approved",
      occurredAt: visit.completedAt,
      actorName: visit.clientName,
      actorRole: "client",
      title: "Візит завершено",
      description: `Загальна сума: ${formatVisitPrice(
        visit.records.reduce((sum, record) => sum + record.price, 0),
      )}`,
    });
  }

  if (visit.status === "cancelled") {
    entries.push({
      id: `${visit.id}-cancelled`,
      type: "approval_rejected",
      occurredAt: visit.updatedAt ?? endTime,
      actorName: "Менеджер СТО",
      actorRole: "manager",
      title: "Візит скасовано",
    });
  }

  return entries;
}

export function buildVisitActivityLog(visit: VisitListItem): StoVehicleActivityEntry[] {
  const entries =
    visit.activityLog && visit.activityLog.length > 0
      ? [...visit.activityLog]
      : buildDerivedVisitActivityLog(visit);

  return entries.sort(
    (left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
  );
}
