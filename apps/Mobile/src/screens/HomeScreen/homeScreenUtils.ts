import { FuelType, TransmissionType, WheelDriveType } from "../../types/api";

export const FUEL_LABELS: Record<FuelType, string> = {
  [FuelType.Gasoline]: "Бензин",
  [FuelType.Diesel]: "Дизель",
  [FuelType.Electric]: "Електро",
  [FuelType.Hybrid]: "Гібрид",
  [FuelType.PlugInHybrid]: "Плагін-гібрид",
  [FuelType.Hydrogen]: "Водень",
};

export const TRANSMISSION_LABELS: Record<TransmissionType, string> = {
  [TransmissionType.Manual]: "Механіка",
  [TransmissionType.Automatic]: "Автомат",
  [TransmissionType.CVT]: "CVT",
  [TransmissionType.SemiAutomatic]: "Робот",
  [TransmissionType.DualClutch]: "Преселективна",
};

export const WHEEL_DRIVE_LABELS: Record<WheelDriveType, string> = {
  [WheelDriveType.FWD]: "Передній 2Х4",
  [WheelDriveType.RWD]: "Задній (RWD)",
  [WheelDriveType.AWD]: "Повний (AWD)",
  [WheelDriveType.FourWD]: "4WD",
};

export function formatVinShort(vin: string) {
  if (vin.length <= 11) return vin;
  return `${vin.slice(0, 4)}...${vin.slice(-4)}`;
}

export function formatServiceDate(date: string) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function resolveColorHex(color: string | undefined | null): string {
  if (!color) return "#808080";
  return color.startsWith("#") ? color : `#${color}`;
}

export function formatVehicleCount(count: number): string {
  if (count === 1) return "1 автомобіль";
  if (count >= 2 && count <= 4) return `${count} автомобілі`;
  return `${count} автомобілів`;
}
