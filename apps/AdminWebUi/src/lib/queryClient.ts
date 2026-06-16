import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "../api/adminFetch";
import { CACHE_GC_TIME_MS, CACHE_STALE_TIME_MS } from "../queries/cacheConfig";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_STALE_TIME_MS,
      gcTime: CACHE_GC_TIME_MS,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
