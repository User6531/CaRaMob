import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminFetch } from "../api/adminFetch";
import { useAuth } from "../auth/AuthContext";
import {
  ADMIN_VEHICLE_DETAILS_URL,
  ADMIN_VEHICLE_HISTORY_URL,
  ADMIN_VEHICLES_URL,
} from "../config/api";
import type {
  PagedResult,
  ServiceVisit,
  VehicleDetails,
  VehicleListItem,
} from "../types/admin";
import type { VehiclesListParams } from "../types/filters";
import { buildVehiclesQueryString } from "../utils/listQueryParams";
import { queryKeys } from "./queryKeys";

function useAdminToken(): string | undefined {
  const { session } = useAuth();
  return session?.internalToken;
}

export function useVehiclesQuery(params: VehiclesListParams) {
  const token = useAdminToken();
  const queryString = buildVehiclesQueryString(
    params.filters,
    params.page,
    params.pageSize,
  );

  return useQuery({
    queryKey: queryKeys.vehicles.list(params),
    queryFn: () =>
      adminFetch<PagedResult<VehicleListItem>>(
        `${ADMIN_VEHICLES_URL}?${queryString}`,
        token!,
      ),
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
  });
}

export function useVehicleDetailsQuery(vehicleId: string | undefined) {
  const token = useAdminToken();

  return useQuery({
    queryKey: queryKeys.vehicles.detail(vehicleId ?? ""),
    queryFn: () =>
      adminFetch<VehicleDetails>(ADMIN_VEHICLE_DETAILS_URL(vehicleId!), token!),
    enabled: Boolean(token && vehicleId),
  });
}

export function useVehicleServiceHistoryQuery(vehicleId: string | undefined) {
  const token = useAdminToken();

  return useQuery({
    queryKey: queryKeys.vehicles.serviceHistory(vehicleId ?? ""),
    queryFn: () =>
      adminFetch<ServiceVisit[]>(ADMIN_VEHICLE_HISTORY_URL(vehicleId!), token!),
    enabled: Boolean(token && vehicleId),
  });
}
