const DEFAULT_API_BASE_URL = "http://localhost:5001";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export const TELEGRAM_WEB_LOGIN_URL = `${API_BASE_URL}/api/auth/web/login`;
export const ADMIN_DRIVERS_URL = `${API_BASE_URL}/api/admin/users`;
export const ADMIN_VEHICLES_URL = `${API_BASE_URL}/api/admin/vehicles`;
export const ADMIN_DRIVER_DETAILS_URL = (userId: string) =>
  `${API_BASE_URL}/api/admin/users/${userId}`;
export const ADMIN_DRIVER_VEHICLES_URL = (userId: string) =>
  `${API_BASE_URL}/api/admin/vehicles/${userId}/vehicles`;
export const ADMIN_VEHICLE_HISTORY_URL = (vehicleId: string) =>
  `${API_BASE_URL}/api/admin/vehicles/${vehicleId}/service-history`;
export const ADMIN_VEHICLE_DETAILS_URL = (vehicleId: string) =>
  `${API_BASE_URL}/api/admin/vehicles/${vehicleId}`;
export const ADMIN_SERVICE_HISTORY_RECORDS_URL = (serviceHistoryId: string) =>
  `${API_BASE_URL}/api/admin/service-history/${serviceHistoryId}/records`;
