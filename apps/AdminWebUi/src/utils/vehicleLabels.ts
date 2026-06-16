const FUEL_TYPE_LABELS: Record<string, string> = {
  "0": "Бензин",
  "1": "Дизель",
  "2": "Електро",
  "3": "Гібрид",
  "4": "Плагін-гібрид",
  "5": "Водень",
  Gasoline: "Бензин",
  Diesel: "Дизель",
  Electric: "Електро",
  Hybrid: "Гібрид",
  PlugInHybrid: "Плагін-гібрид",
  Hydrogen: "Водень",
};

const TRANSMISSION_LABELS: Record<string, string> = {
  "0": "Механіка",
  "1": "Автомат",
  "2": "CVT",
  "3": "Робот",
  "4": "DCT",
  Manual: "Механіка",
  Automatic: "Автомат",
  CVT: "CVT",
  SemiAutomatic: "Робот",
  DualClutch: "DCT",
};

const WHEEL_DRIVE_LABELS: Record<string, string> = {
  "0": "Передній",
  "1": "Задній",
  "2": "Повний (AWD)",
  "3": "4x4",
  FWD: "Передній",
  RWD: "Задній",
  AWD: "Повний (AWD)",
  FourWD: "4x4",
};

function normalizeKey(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  return String(value);
}

export function formatFuelType(value: string | number | undefined | null): string {
  const key = normalizeKey(value);
  return FUEL_TYPE_LABELS[key] ?? key;
}

export function formatTransmissionType(
  value: string | number | undefined | null,
): string {
  const key = normalizeKey(value);
  return TRANSMISSION_LABELS[key] ?? key;
}

export function formatWheelDriveType(
  value: string | number | undefined | null,
): string {
  const key = normalizeKey(value);
  return WHEEL_DRIVE_LABELS[key] ?? key;
}

const ALL_OPTION = { value: "", label: "Усі" } as const;

function buildFilterOptions(
  labels: Record<string, string>,
  enumKeys: string[],
) {
  return [
    ALL_OPTION,
    ...enumKeys.map((key) => ({ value: key, label: labels[key] })),
  ];
}

export const FUEL_TYPE_FILTER_OPTIONS = buildFilterOptions(FUEL_TYPE_LABELS, [
  "Gasoline",
  "Diesel",
  "Electric",
  "Hybrid",
  "PlugInHybrid",
  "Hydrogen",
]);

export const TRANSMISSION_FILTER_OPTIONS = buildFilterOptions(TRANSMISSION_LABELS, [
  "Manual",
  "Automatic",
  "CVT",
  "SemiAutomatic",
  "DualClutch",
]);

export const WHEEL_DRIVE_FILTER_OPTIONS = buildFilterOptions(WHEEL_DRIVE_LABELS, [
  "FWD",
  "RWD",
  "AWD",
  "FourWD",
]);
