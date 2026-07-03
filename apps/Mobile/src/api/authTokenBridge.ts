type RefreshAccessTokenFn = () => Promise<string | null>;

let refreshAccessTokenFn: RefreshAccessTokenFn | null = null;

export function registerRefreshAccessToken(fn: RefreshAccessTokenFn): void {
  refreshAccessTokenFn = fn;
}

export async function tryRefreshAccessToken(): Promise<string | null> {
  if (!refreshAccessTokenFn) {
    return null;
  }

  return refreshAccessTokenFn();
}
