export type VisitReasonId = "maintenance" | "suspension" | "diagnostics" | "other";

export type TimeSlotId = "morning" | "day" | "evening";

export type PartsOption = "shop" | "own";

export type BookingRequestStatus = "pending" | "confirmed" | "rejected";

export interface BookingRequest {
  id: string;
  stoId: string;
  vehicleId?: string;
  driverId?: string;
  brand: string;
  model: string;
  year?: number;
  licensePlate: string;
  vin?: string;
  clientName: string;
  clientPhone?: string;
  visitReason: VisitReasonId;
  problemDescription: string;
  preferredDate: string;
  preferredTimeSlot: TimeSlotId;
  partsOption: PartsOption;
  attachmentsCount?: number;
  status: BookingRequestStatus;
  managerAppointmentAt?: string;
  managerNote?: string;
  rejectionReason?: string;
  queueVehicleId?: string;
  createdAt: string;
  updatedAt: string;
}
