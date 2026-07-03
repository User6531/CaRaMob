import { SelectOption } from "../components/Select";
import { FuelType, TransmissionType } from "../types/api";

export function normalizeFuelType(
  fuelType?: string | number | null
): number | undefined {
  if (fuelType === undefined || fuelType === null || fuelType === "") {
    return undefined;
  }

  if (typeof fuelType === "number") {
    return fuelType;
  }

  const parsed = Number(fuelType);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function normalizeTransmissionType(
  transmission?: string | number | null
): number | undefined {
  if (transmission === undefined || transmission === null || transmission === "") {
    return undefined;
  }

  if (typeof transmission === "number") {
    return transmission;
  }

  const parsed = Number(transmission);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function requiresEngineDisplacement(
  fuelType?: string | number | null
): boolean {
  const normalizedFuelType = normalizeFuelType(fuelType);

  if (normalizedFuelType === undefined) {
    return false;
  }

  return (
    normalizedFuelType !== FuelType.Electric &&
    normalizedFuelType !== FuelType.Hydrogen
  );
}

export function getEnginePowerLabel(fuelType?: string | number | null): string {
  const normalizedFuelType = normalizeFuelType(fuelType);

  if (normalizedFuelType === FuelType.Electric) {
    return "Потужність електромотора (к.с.) *";
  }

  if (normalizedFuelType === FuelType.Hydrogen) {
    return "Потужність силової установки (к.с.) *";
  }

  return "Потужність двигуна (к.с.) *";
}

export function getTransmissionOptionsForFuel(
  fuelType: string | number | undefined,
  allOptions: SelectOption[]
): SelectOption[] {
  if (normalizeFuelType(fuelType) === FuelType.Electric) {
    return allOptions.filter(
      (option) =>
        normalizeTransmissionType(option.value) === TransmissionType.Automatic ||
        normalizeTransmissionType(option.value) === TransmissionType.CVT
    );
  }

  return allOptions;
}

export function isTransmissionAllowedForFuel(
  fuelType: string | number | undefined,
  transmission: string | number | undefined
): boolean {
  if (normalizeFuelType(fuelType) !== FuelType.Electric) {
    return true;
  }

  const normalizedTransmission = normalizeTransmissionType(transmission);
  if (normalizedTransmission === undefined) {
    return true;
  }

  return (
    normalizedTransmission === TransmissionType.Automatic ||
    normalizedTransmission === TransmissionType.CVT
  );
}

export function resolveEngineCapacityCc(
  fuelType: string | number,
  displacement: string
): number | null {
  if (!requiresEngineDisplacement(fuelType)) {
    return 0;
  }

  const displacementNum = displacement.trim()
    ? parseFloat(displacement.replace(",", "."))
    : NaN;

  if (!displacement.trim() || isNaN(displacementNum) || displacementNum <= 0) {
    return null;
  }

  const engineCapacityCc = Math.round(displacementNum * 1000);

  if (engineCapacityCc <= 0 || engineCapacityCc > 10000) {
    return null;
  }

  return engineCapacityCc;
}

export function formatEngineDisplay(
  engineCapacity: number,
  enginePower: number,
  fuelType: FuelType
): string {
  const power = `${enginePower} к.с.`;

  if (!requiresEngineDisplacement(fuelType) || engineCapacity <= 0) {
    return power;
  }

  return `${(engineCapacity / 1000).toFixed(1)} л, ${power}`;
}
