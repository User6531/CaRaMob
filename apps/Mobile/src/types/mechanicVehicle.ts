import { MechanicSessionStatus } from "./mechanicWork";
import { ServiceStatusId } from "./serviceStatus";

export interface MechanicAssignedVehicle {
  id: string;
  vehicleTitle: string;
  licensePlate: string;
  year: number;
  mileage: number;
  vin: string;
  problemSummary: string;
  currentStatus: ServiceStatusId;
  sessionStatus?: MechanicSessionStatus;
  acceptedAt: string;
  clientName?: string;
}
