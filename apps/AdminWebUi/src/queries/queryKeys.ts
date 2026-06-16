import type { DriversListParams, VehiclesListParams } from "../types/filters";

export const queryKeys = {
  drivers: {
    all: ["admin", "drivers"] as const,
    list: (params: DriversListParams) =>
      [...queryKeys.drivers.all, "list", params] as const,
    detail: (driverId: string) =>
      [...queryKeys.drivers.all, "detail", driverId] as const,
    vehicles: (driverId: string) =>
      [...queryKeys.drivers.all, driverId, "vehicles"] as const,
  },
  vehicles: {
    all: ["admin", "vehicles"] as const,
    list: (params: VehiclesListParams) =>
      [...queryKeys.vehicles.all, "list", params] as const,
    detail: (vehicleId: string) =>
      [...queryKeys.vehicles.all, "detail", vehicleId] as const,
    serviceHistory: (vehicleId: string) =>
      [...queryKeys.vehicles.all, vehicleId, "service-history"] as const,
  },
  serviceHistory: {
    records: (visitId: string) =>
      ["admin", "service-history", visitId, "records"] as const,
  },
};
