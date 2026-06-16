import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminFetch } from "../api/adminFetch";
import { useAuth } from "../auth/AuthContext";
import {
  ADMIN_DRIVER_DETAILS_URL,
  ADMIN_DRIVER_VEHICLES_URL,
  ADMIN_DRIVERS_URL,
} from "../config/api";
import type {
  DriverDetails,
  DriverListItem,
  DriverVehicle,
  PagedResult,
} from "../types/admin";
import type { DriversListParams } from "../types/filters";
import { buildDriversQueryString } from "../utils/listQueryParams";
import { queryKeys } from "./queryKeys";

function useAdminToken(): string | undefined {
  const { session } = useAuth();
  return session?.internalToken;
}

export function useDriversQuery(params: DriversListParams) {
  const token = useAdminToken();
  const queryString = buildDriversQueryString(
    params.filters,
    params.page,
    params.pageSize,
  );

  return useQuery({
    queryKey: queryKeys.drivers.list(params),
    queryFn: () =>
      adminFetch<PagedResult<DriverListItem>>(
        `${ADMIN_DRIVERS_URL}?${queryString}`,
        token!,
      ),
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
  });
}

export function useDriverDetailsQuery(driverId: string | undefined) {
  const token = useAdminToken();

  return useQuery({
    queryKey: queryKeys.drivers.detail(driverId ?? ""),
    queryFn: () =>
      adminFetch<DriverDetails>(ADMIN_DRIVER_DETAILS_URL(driverId!), token!),
    enabled: Boolean(token && driverId),
  });
}

export function useDriverVehiclesQuery(driverId: string | undefined) {
  const token = useAdminToken();

  return useQuery({
    queryKey: queryKeys.drivers.vehicles(driverId ?? ""),
    queryFn: () =>
      adminFetch<DriverVehicle[]>(ADMIN_DRIVER_VEHICLES_URL(driverId!), token!),
    enabled: Boolean(token && driverId),
  });
}
