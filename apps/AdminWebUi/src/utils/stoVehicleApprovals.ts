import type {
  StoQueueVehicle,
  StoVehicleApprovalLineItem,
  StoVehicleApprovalRequest,
  StoVehicleApprovalType,
} from "../types/stoVehicle";
import type { StoVehicleQueueStatus } from "../types/stoVehicle";

export function getVehicleApprovals(vehicle: StoQueueVehicle): StoVehicleApprovalRequest[] {
  return vehicle.approvalRequests ?? [];
}

export function getPendingApprovals(vehicle: StoQueueVehicle): StoVehicleApprovalRequest[] {
  return getVehicleApprovals(vehicle).filter((request) => request.status === "pending");
}

export function getApprovalsInReview(vehicle: StoQueueVehicle): StoVehicleApprovalRequest[] {
  return getPendingApprovals(vehicle).filter(isApprovalInManagerReview);
}

export function getApprovalsAwaitingClient(vehicle: StoQueueVehicle): StoVehicleApprovalRequest[] {
  return getPendingApprovals(vehicle).filter(isApprovalAwaitingClient);
}

export function areLineItemsValid(lineItems: StoVehicleApprovalLineItem[]): boolean {
  return (
    lineItems.length > 0 &&
    lineItems.every((item) => item.title.trim().length > 0 && item.price > 0)
  );
}

export function getInitialStepForVehicle(vehicle: StoQueueVehicle): StoVehicleQueueStatus {
  return vehicle.status;
}

export function formatPriceUah(amount: number): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isApprovalInManagerReview(request: StoVehicleApprovalRequest): boolean {
  return request.status === "pending" && !request.sentToClientAt;
}

export function isApprovalAwaitingClient(request: StoVehicleApprovalRequest): boolean {
  return request.status === "pending" && !!request.sentToClientAt;
}

export function calcApprovalTotal(request: StoVehicleApprovalRequest): number {
  if (request.totalAmount !== undefined) return request.totalAmount;
  return (request.lineItems ?? []).reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0,
  );
}

export const APPROVAL_TYPE_LABELS: Record<StoVehicleApprovalType, string> = {
  work_list: "Список робіт",
  parts_list: "Список деталей",
  extra_work: "Додаткові роботи",
};
