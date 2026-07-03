export type ServiceStatusId =
  | "received"
  | "diagnostics"
  | "approval"
  | "waiting_parts"
  | "in_progress"
  | "quality_check"
  | "ready";

export interface ServiceEstimateItem {
  id: string;
  title: string;
  price: number;
}

export interface ActiveServiceSession {
  id: string;
  serviceName: string;
  serviceAddress: string;
  servicePhone: string;
  vehicleTitle: string;
  licensePlate: string;
  acceptedAt: string;
  currentStatus: ServiceStatusId;
  currentWork?: string;
  estimateItems?: ServiceEstimateItem[];
  totalBill?: number;
  isApproved?: boolean;
}
