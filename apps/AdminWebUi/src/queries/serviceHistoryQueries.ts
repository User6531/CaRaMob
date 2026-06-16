import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "../api/adminFetch";
import { useAuth } from "../auth/AuthContext";
import { ADMIN_SERVICE_HISTORY_RECORDS_URL } from "../config/api";
import type { ServiceRecord } from "../types/admin";
import { queryKeys } from "./queryKeys";

export function useServiceHistoryRecordsQuery(
  visitId: string,
  enabled: boolean,
) {
  const { session } = useAuth();
  const token = session?.internalToken;

  return useQuery({
    queryKey: queryKeys.serviceHistory.records(visitId),
    queryFn: () =>
      adminFetch<ServiceRecord[]>(
        ADMIN_SERVICE_HISTORY_RECORDS_URL(visitId),
        token!,
      ),
    enabled: Boolean(token && enabled),
  });
}
