import { Navigate, Route, Routes } from "react-router-dom";
import { Permission } from "../auth/permissions";
import { DEFAULT_ROUTE } from "../config/navigation";
import { AdminLayout } from "../layout/AdminLayout";
import { DriverDetailsPage } from "../pages/DriverDetailsPage";
import { DriversPage } from "../pages/DriversPage";
import { LoginPage } from "../pages/LoginPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { StoListPage } from "../pages/StoListPage";
import { StoQueuePage } from "../pages/StoQueuePage";
import { VehicleServiceHistoryPage } from "../pages/VehicleServiceHistoryPage";
import { VehiclesPage } from "../pages/VehiclesPage";
import { PermissionGate } from "./PermissionGate";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={DEFAULT_ROUTE} replace />} />

        <Route
          path="/sto"
          element={
            <PermissionGate requiredPermissions={[Permission.StoView]}>
              <StoListPage />
            </PermissionGate>
          }
        />

        <Route
          path="/sto/queue"
          element={
            <PermissionGate requiredPermissions={[Permission.StoView]}>
              <StoQueuePage />
            </PermissionGate>
          }
        />

        <Route
          path="/users"
          element={
            <PermissionGate requiredPermissions={[Permission.UsersView]}>
              <PlaceholderPage
                title="Клієнти"
                description="Керування клієнтськими акаунтами та доступами"
              />
            </PermissionGate>
          }
        />

        <Route
          path="/drivers"
          element={
            <PermissionGate requiredPermissions={[Permission.DriversView]}>
              <DriversPage />
            </PermissionGate>
          }
        />

        <Route
          path="/drivers/:driverId"
          element={
            <PermissionGate requiredPermissions={[Permission.DriversView]}>
              <DriverDetailsPage />
            </PermissionGate>
          }
        />

        <Route
          path="/vehicles"
          element={
            <PermissionGate requiredPermissions={[Permission.VehiclesView]}>
              <VehiclesPage />
            </PermissionGate>
          }
        />

        <Route
          path="/vehicles/:vehicleId/service-history"
          element={
            <PermissionGate requiredPermissions={[Permission.VehiclesView]}>
              <VehicleServiceHistoryPage />
            </PermissionGate>
          }
        />

        <Route
          path="/settings"
          element={
            <PermissionGate requiredPermissions={[Permission.SettingsView]}>
              <PlaceholderPage
                title="Налаштування"
                description="Загальні налаштування адмін-панелі"
              />
            </PermissionGate>
          }
        />

        <Route path="*" element={<Navigate to={DEFAULT_ROUTE} replace />} />
      </Route>
    </Routes>
  );
}
