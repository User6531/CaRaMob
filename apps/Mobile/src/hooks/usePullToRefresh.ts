import React from "react";

const DEFAULT_MIN_REFRESH_DURATION_MS = 700;

export function usePullToRefresh(
  refresh: () => Promise<unknown>,
  minDurationMs = DEFAULT_MIN_REFRESH_DURATION_MS
) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const isRefreshingRef = React.useRef(false);

  const onRefresh = React.useCallback(async () => {
    if (isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    setIsRefreshing(true);

    const startedAt = Date.now();

    try {
      await refresh();
    } finally {
      const elapsed = Date.now() - startedAt;
      const delay = Math.max(0, minDurationMs - elapsed);

      const finish = () => {
        isRefreshingRef.current = false;
        setIsRefreshing(false);
      };

      if (delay === 0) {
        finish();
      } else {
        setTimeout(finish, delay);
      }
    }
  }, [refresh, minDurationMs]);

  return { isRefreshing, onRefresh };
}
