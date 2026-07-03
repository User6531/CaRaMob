export type StoVehicleQueueStatus =
  | "scheduled"
  | "waiting"
  | "diagnostics"
  | "in_repair"
  | "waiting_parts"
  | "quality_check"
  | "ready";

export type StoVehicleApprovalType = "work_list" | "parts_list" | "extra_work";

export type StoVehicleApprovalStatus = "pending" | "approved" | "rejected";

export type StoVehicleApproverRole = "client" | "manager";

export interface StoVehicleApprovalLineItem {
  id: string;
  title: string;
  price: number;
  quantity?: number;
}

export interface StoVehicleApprovalRequest {
  id: string;
  type: StoVehicleApprovalType;
  status: StoVehicleApprovalStatus;
  title: string;
  description: string;
  requestedBy: string;
  createdAt: string;
  reviewedAt?: string;
  lineItems?: StoVehicleApprovalLineItem[];
  totalAmount?: number;
  /** Коли менеджер надіслав кошторис/список клієнту в додаток */
  sentToClientAt?: string;
  /** Останнє нагадування клієнту в додатку */
  clientNotifiedAt?: string;
  approverRole?: StoVehicleApproverRole;
  approvedByName?: string;
  managerOverrideReason?: string;
  rejectionReason?: string;
}

export interface StoMechanic {
  id: string;
  fullName: string;
}

export type StoVehicleActivityType =
  | "vehicle_created"
  | "appointment_scheduled"
  | "vehicle_arrived"
  | "status_changed"
  | "mechanic_assigned"
  | "approval_requested"
  | "approval_sent_to_client"
  | "approval_approved"
  | "approval_rejected";

export type StoVehicleActivityActorRole =
  | "system"
  | "operator"
  | "manager"
  | "mechanic"
  | "client";

export interface StoVehicleActivityEntry {
  id: string;
  type: StoVehicleActivityType;
  occurredAt: string;
  actorName: string;
  actorRole: StoVehicleActivityActorRole;
  title: string;
  description?: string;
}

export interface StoQueueVehicle {
  id: string;
  stoId: string;
  brand: string;
  model: string;
  year?: number;
  licensePlate: string;
  clientName: string;
  clientPhone?: string;
  problemSummary?: string;
  status: StoVehicleQueueStatus;
  appointmentAt?: string;
  arrivedAt?: string;
  mechanicId?: string;
  mechanicName?: string;
  progress?: number;
  approvalRequests?: StoVehicleApprovalRequest[];
  /** Журнал дій з API; якщо відсутній — будується на фронтенді з наявних полів */
  activityLog?: StoVehicleActivityEntry[];
  isManualEntry?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoQueueVehiclePayload {
  stoId: string;
  brand: string;
  model: string;
  year?: number;
  licensePlate: string;
  clientName: string;
  clientPhone?: string;
  problemSummary?: string;
  status: StoVehicleQueueStatus;
  appointmentAt?: string;
  isManualEntry?: boolean;
}
