import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "../api/client";
import { queryKeys } from "./queryKeys";
import { VehicleListItem, VehicleDto, UpdateVehicleDto } from "../types/api";
import { useAuth } from "../context/AuthContext";
import { ENDPOINTS } from "../config/api";
import { CACHE_STALE_TIME_MS } from "./cacheConfig";

export const useVehicles = () => {
  const { getAccessToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.vehicles,
    queryFn: async () => {
      const apiClient = createApiClient(getAccessToken);
      const result = await apiClient.get<VehicleListItem[]>(ENDPOINTS.VEHICLES);
      return Array.isArray(result) ? result : [];
    },
    staleTime: CACHE_STALE_TIME_MS,
  });
};

export const useVehicle = (vehicleId: string | undefined) => {
  const { getAccessToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.vehicle(vehicleId ?? ""),
    queryFn: () => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.get<VehicleDto>(ENDPOINTS.VEHICLE_BY_ID(vehicleId!));
    },
    enabled: !!vehicleId,
    staleTime: CACHE_STALE_TIME_MS,
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: ({
      vehicleId,
      data,
    }: {
      vehicleId: string;
      data: UpdateVehicleDto;
    }) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.put<void>(ENDPOINTS.VEHICLE_BY_ID(vehicleId), data);
    },
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicle(vehicleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: (vehicleId: string) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.delete<void>(ENDPOINTS.VEHICLE_BY_ID(vehicleId));
    },
    onSuccess: (_, vehicleId) => {
      queryClient.removeQueries({ queryKey: queryKeys.vehicle(vehicleId) });
      queryClient.removeQueries({ queryKey: queryKeys.serviceHistory(vehicleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
};
