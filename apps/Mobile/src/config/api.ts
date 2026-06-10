// API Configuration
const NGROK_API_BASE = "https://scaling-sediment-automated.ngrok-free.dev/api";

export const API_CONFIG = {
  BASE_URL: __DEV__ ? NGROK_API_BASE : NGROK_API_BASE,
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

/** Headers required for ngrok free tier in development. */
export const getNgrokHeaders = (): Record<string, string> =>
  __DEV__ ? { "ngrok-skip-browser-warning": "true" } : {};

// Endpoints
export const ENDPOINTS = {
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,
  ME: "/users/me",
  CARS: "/cars",
  CAR_BY_ID: (id: string) => `/cars/${id}`,
  USER_CARS: (userId: string) => `/users/${userId}/cars`,
  VEHICLES: "/vehicles",
  VEHICLE_BY_ID: (id: string) => `/vehicles/${id}`,
  SERVICE_HISTORY_BY_VEHICLE: (vehicleId: string) =>
    `/service-history/${vehicleId}`,
} as const;
