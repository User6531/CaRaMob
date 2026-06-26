export type MechanicSessionStatus =
  | "waiting"
  | "accepted"
  | "diagnostics"
  | "repair"
  | "waiting_parts"
  | "final_check"
  | "estimate"
  | "completed";

export type MechanicWorkItemStatus = "pending" | "in_progress" | "completed";

export type MechanicWorkItemKind = "planned" | "recommended";

export type PartOrderStatus = "ordered" | "in_transit" | "received";

export interface PartOrderItem {
  id: string;
  name: string;
  quantity: string;
  article: string;
  supplier: string;
  status: PartOrderStatus;
}

export interface MechanicWorkItem {
  id: string;
  title: string;
  status: MechanicWorkItemStatus;
  kind: MechanicWorkItemKind;
  price: string;
  photos: string[];
  awaitingApproval?: boolean;
}

export interface MechanicWorkSession {
  vehicleId: string;
  sessionStatus: MechanicSessionStatus;
  workItems: MechanicWorkItem[];
  partOrders: PartOrderItem[];
  conclusion: string;
  conclusionPhotos: string[];
}
