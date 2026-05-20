import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "../api/client";
import { ENDPOINTS } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { queryKeys } from "./queryKeys";
import {
  CreateServiceHistoryDto,
  ServiceHistoryVisitDto,
  ServiceWorkItemDto,
} from "../types/api";

type ServiceHistoryApiResponse =
  | ServiceHistoryVisitDto[]
  | { items?: unknown[] }
  | unknown[];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeRecord = (raw: unknown): ServiceWorkItemDto | null => {
  if (!isObject(raw)) return null;
  const id = typeof raw.id === "string" ? raw.id : null;
  const title = typeof raw.title === "string" ? raw.title : null;
  if (!id || !title) return null;

  return {
    id,
    title,
    price: typeof raw.price === "number" ? raw.price : null,
  };
};

const normalizeVisit = (raw: unknown): ServiceHistoryVisitDto | null => {
  if (!isObject(raw)) return null;

  const id = typeof raw.id === "string" ? raw.id : null;
  const title = typeof raw.title === "string" ? raw.title : null;
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : null;

  if (!id || !title || !createdAt) return null;

  const records = Array.isArray(raw.records)
    ? raw.records.map(normalizeRecord).filter((item): item is ServiceWorkItemDto => !!item)
    : [];

  return {
    id,
    title,
    createdAt,
    description: typeof raw.description === "string" ? raw.description : null,
    records,
  };
};

const normalizeServiceHistory = (
  raw: ServiceHistoryApiResponse
): ServiceHistoryVisitDto[] => {
  const source = Array.isArray(raw)
    ? raw
    : isObject(raw) && Array.isArray(raw.items)
      ? raw.items
      : [];

  return source
    .flatMap((entry) => {
      if (isObject(entry) && Array.isArray(entry.items)) {
        return entry.items;
      }
      return entry;
    })
    .map(normalizeVisit)
    .filter((visit): visit is ServiceHistoryVisitDto => !!visit)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const useServiceHistory = (vehicleId: string | undefined) => {
  const { getAccessToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.serviceHistory(vehicleId ?? ""),
    queryFn: async () => {
      const apiClient = createApiClient(getAccessToken);
      const response = await apiClient.get<ServiceHistoryApiResponse>(
        ENDPOINTS.SERVICE_HISTORY_BY_VEHICLE(vehicleId!)
      );

      return normalizeServiceHistory(response);
    },
    enabled: !!vehicleId,
  });
};

export const useCreateServiceHistory = () => {
  const { getAccessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      data,
    }: {
      vehicleId: string;
      data: CreateServiceHistoryDto;
    }) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.post<unknown>(
        ENDPOINTS.SERVICE_HISTORY_BY_VEHICLE(vehicleId),
        data
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.serviceHistory(variables.vehicleId),
      });
    },
  });
};
