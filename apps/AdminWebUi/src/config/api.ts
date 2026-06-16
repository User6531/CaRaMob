const DEFAULT_API_BASE_URL = "http://localhost:5001";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export const TELEGRAM_WEB_LOGIN_URL = `${API_BASE_URL}/api/auth/web/login`;
