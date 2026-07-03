const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;

export function normalizeVinInput(value: string): string {
  return value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/gi, "").slice(0, 17);
}

export function isValidVin(vin: string): boolean {
  return VIN_REGEX.test(vin.trim());
}

export const VIN_VALIDATION_MESSAGE =
  "VIN має містити 17 символів: латинські літери (без I, O, Q) та цифри";
