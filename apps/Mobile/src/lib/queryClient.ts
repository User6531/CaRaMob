import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 хвилин
      gcTime: 10 * 60 * 1000, // 10 хвилин (раніше cacheTime)
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
