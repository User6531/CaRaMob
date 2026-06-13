import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "../api/client";
import { ENDPOINTS } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { CACHE_STALE_TIME_MS } from "./cacheConfig";
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

const readString = (
  raw: Record<string, unknown>,
  ...keys: string[]
): string | null => {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return null;
};

const readNumber = (
  raw: Record<string, unknown>,
  ...keys: string[]
): number | null => {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
};

const readDateString = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }

  if (isObject(value) && typeof value.$date === "string") {
    return value.$date;
  }

  return null;
};

const normalizeRecord = (raw: unknown): ServiceWorkItemDto | null => {
  if (!isObject(raw)) return null;

  const id = readString(raw, "id", "_id", "Id");
  const title = readString(raw, "title", "Title");
  if (!id || !title) return null;

  return {
    id,
    title,
    price: readNumber(raw, "price", "Price"),
    description: readString(raw, "description", "Description"),
  };
};

const normalizeVisit = (raw: unknown): ServiceHistoryVisitDto | null => {
  if (!isObject(raw)) return null;

  const id = readString(raw, "id", "_id", "Id");
  const title = readString(raw, "title", "Title");
  const createdAt = readDateString(raw.createdAt ?? raw.CreatedAt);

  if (!id || !title || !createdAt) return null;

  const records = Array.isArray(raw.records)
    ? raw.records
        .map(normalizeRecord)
        .filter((item): item is ServiceWorkItemDto => !!item)
    : Array.isArray(raw.Records)
      ? raw.Records.map(normalizeRecord).filter(
          (item): item is ServiceWorkItemDto => !!item
        )
      : [];

  const firstRecordDescription = records[0]?.description ?? null;

  return {
    id,
    title,
    createdAt,
    description:
      readString(raw, "description", "Description") ?? firstRecordDescription,
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
      : isObject(raw) && Array.isArray(raw.Items)
        ? raw.Items
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
    staleTime: CACHE_STALE_TIME_MS,
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

export const useUpdateServiceHistory = () => {
  const { getAccessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      serviceHistoryId,
      data,
    }: {
      vehicleId: string;
      serviceHistoryId: string;
      data: CreateServiceHistoryDto;
    }) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.put<unknown>(
        ENDPOINTS.SERVICE_HISTORY_BY_ID(vehicleId, serviceHistoryId),
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

export const useDeleteServiceHistory = () => {
  const { getAccessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      serviceHistoryId,
    }: {
      vehicleId: string;
      serviceHistoryId: string;
    }) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.delete<void>(
        ENDPOINTS.SERVICE_HISTORY_BY_ID(vehicleId, serviceHistoryId)
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.serviceHistory(variables.vehicleId),
      });
    },
  });
};
