import type { AuthSession } from "../types/auth";

const SESSION_STORAGE_KEY = "admin_auth_session";

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function readAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (
      typeof parsed.internalToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.isAdmin !== "boolean"
    ) {
      return null;
    }

    return {
      internalToken: parsed.internalToken,
      refreshToken: parsed.refreshToken,
      isAdmin: parsed.isAdmin,
    };
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
