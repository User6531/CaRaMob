import type { StoVehicleActivityEntry } from "./stoVehicle";

export type VisitStatus = "in_progress" | "completed" | "cancelled" | "waiting_payment";

export interface VisitRecord {
  id: string;
  title: string;
  description?: string;
  price: number;
}

export interface VisitListItem {
  id: string;
  stoId: string;
  stoName: string;
  vehicleId: string;
  brand: string;
  model: string;
  year?: number;
  licensePlate: string;
  clientName: string;
  clientPhone?: string;
  title: string;
  description: string;
  status: VisitStatus;
  mechanicName?: string;
  records: VisitRecord[];
  /** Журнал дій з API; якщо відсутній — будується на фронтенді */
  activityLog?: StoVehicleActivityEntry[];
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}
