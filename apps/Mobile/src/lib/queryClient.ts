import { QueryClient } from "@tanstack/react-query";
import { CACHE_GC_TIME_MS, CACHE_STALE_TIME_MS } from "../queries/cacheConfig";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_STALE_TIME_MS,
      gcTime: CACHE_GC_TIME_MS,
      retry: (failureCount, error) => {
        // Не повторювати запити для 4xx помилок
        if (error instanceof Error && "status" in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
