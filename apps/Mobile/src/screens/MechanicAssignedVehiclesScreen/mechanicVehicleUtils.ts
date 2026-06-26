import { MechanicSessionStatus } from "../../types/mechanicWork";
import { MechanicAssignedVehicle } from "../../types/mechanicVehicle";
import {
  getSessionBadgeStyle,
  getSessionProgress,
  getSessionStatusLabel,
  mapSessionToDriverStatus,
  StatusBadgeStyle,
} from "../MechanicActiveWorkScreen/mechanicSessionConfig";
import { formatVinShort } from "../HomeScreen/homeScreenUtils";

export type { StatusBadgeStyle };

export function getMechanicVehicleStatusLabel(
  vehicle: MechanicAssignedVehicle
): string {
  if (vehicle.sessionStatus) {
    return getSessionStatusLabel(vehicle.sessionStatus);
  }

  return "";
}

export function getMechanicVehicleStatusBadgeStyle(
  vehicle: MechanicAssignedVehicle
): StatusBadgeStyle {
  const status: MechanicSessionStatus = vehicle.sessionStatus ?? "waiting";
  return getSessionBadgeStyle(status);
}

export function getMechanicVehicleProgress(
  vehicle: MechanicAssignedVehicle
): number {
  if (vehicle.sessionStatus) {
    return getSessionProgress(vehicle.sessionStatus);
  }

  return 0;
}

export function mergeVehicleWithSession(
  vehicle: MechanicAssignedVehicle,
  sessionStatus: MechanicSessionStatus
): MechanicAssignedVehicle {
  return {
    ...vehicle,
    sessionStatus,
    currentStatus: mapSessionToDriverStatus(sessionStatus),
  };
}

export function formatMechanicAcceptedAt(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  const time = date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Сьогодні, ${time}`;
  if (diffDays === 1) return `Вчора, ${time}`;

  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMechanicMileage(mileage: number): string {
  return `${mileage.toLocaleString("uk-UA")} км`;
}

export function formatMechanicVehicleCount(count: number): string {
  if (count === 1) return "1 автомобіль";
  if (count >= 2 && count <= 4) return `${count} автомобілі`;
  return `${count} автомобілів`;
}

export function formatMechanicVehicleMeta(vehicle: MechanicAssignedVehicle): string {
  return `${vehicle.year} · ${formatMechanicMileage(vehicle.mileage)} · VIN ${formatVinShort(vehicle.vin)}`;
}
