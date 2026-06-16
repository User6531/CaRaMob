import type { DriverFilters, VehicleFilters } from "../types/filters";

export function buildDriversQueryString(
  filters: DriverFilters,
  page: number,
  pageSize: number,
): string {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  (Object.entries(filters) as [keyof DriverFilters, string][]).forEach(
    ([key, value]) => {
      if (value.trim()) {
        params.set(key, value.trim());
      }
    },
  );

  return params.toString();
}

export function buildVehiclesQueryString(
  filters: VehicleFilters,
  page: number,
  pageSize: number,
): string {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  (Object.entries(filters) as [keyof VehicleFilters, string][]).forEach(
    ([key, value]) => {
      if (value.trim()) {
        params.set(key, value.trim());
      }
    },
  );

  return params.toString();
}
