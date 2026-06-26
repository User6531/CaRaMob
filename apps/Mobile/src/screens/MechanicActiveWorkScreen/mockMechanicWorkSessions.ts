import {
  MechanicWorkItem,
  MechanicWorkSession,
  PartOrderItem,
} from "../../types/mechanicWork";
import { MOCK_MECHANIC_VEHICLES } from "../MechanicAssignedVehiclesScreen/mockMechanicVehicles";

const createWorkItem = (
  title: string,
  status: MechanicWorkItem["status"],
  price = "",
  kind: MechanicWorkItem["kind"] = "planned",
  awaitingApproval = false
): MechanicWorkItem => ({
  id: `${title}-${Math.random().toString(16).slice(2)}`,
  title,
  status,
  kind,
  price,
  photos: [],
  awaitingApproval,
});

const createPartOrder = (
  name: string,
  status: PartOrderItem["status"],
  quantity = "1",
  article = "",
  supplier = ""
): PartOrderItem => ({
  id: `${name}-${Math.random().toString(16).slice(2)}`,
  name,
  quantity,
  article,
  supplier,
  status,
});

const DEFAULT_SESSIONS: Record<string, Omit<MechanicWorkSession, "vehicleId">> = {
  "mv-1": {
    sessionStatus: "waiting_parts",
    workItems: [
      createWorkItem("Демонтаж старого двигуна", "completed", "3500"),
      createWorkItem("Підбір та перевірка контрактного двигуна", "completed", "1200"),
      createWorkItem("Монтаж двигуна", "pending", "8500"),
      createWorkItem("Заміна масла та фільтрів", "pending", "900"),
      createWorkItem("Заміна помпи ГРМ", "pending", "2200", "recommended", true),
    ],
    partOrders: [
      createPartOrder(
        "Комплект прокладок двигуна",
        "in_transit",
        "1",
        "VW-03H198149",
        "Autotechnics"
      ),
      createPartOrder(
        "Масляний фільтр",
        "ordered",
        "1",
        "MANN W712/95",
        "Склад СТО"
      ),
    ],
    conclusion: "",
    conclusionPhotos: [],
  },
  "mv-5": {
    sessionStatus: "diagnostics",
    workItems: [
      createWorkItem("Діагностика гальмівної системи", "pending", "600"),
      createWorkItem("Заміна гальмівних дисків (передні)", "pending", "4200"),
      createWorkItem("Заміна гальмівних колодок", "pending", "1800"),
    ],
    partOrders: [],
    conclusion: "",
    conclusionPhotos: [],
  },
  "mv-2": {
    sessionStatus: "waiting",
    workItems: [],
    partOrders: [],
    conclusion: "",
    conclusionPhotos: [],
  },
  "mv-6": {
    sessionStatus: "final_check",
    workItems: [
      createWorkItem("ТО 90 000 км", "completed", "3200"),
      createWorkItem("Заміна повітряного фільтра", "completed", "450"),
      createWorkItem("Заміна салонного фільтра", "completed", "380"),
    ],
    partOrders: [],
    conclusion: "",
    conclusionPhotos: [],
  },
};

function buildDefaultSession(vehicleId: string): MechanicWorkSession {
  const vehicle = MOCK_MECHANIC_VEHICLES.find((item) => item.id === vehicleId);
  const preset = DEFAULT_SESSIONS[vehicleId];

  if (preset) {
    return { vehicleId, ...preset };
  }

  return {
    vehicleId,
    sessionStatus: "waiting",
    workItems: vehicle
      ? [createWorkItem(vehicle.problemSummary, "pending")]
      : [],
    partOrders: [],
    conclusion: "",
    conclusionPhotos: [],
  };
}

export function createInitialMechanicSessions(): Record<string, MechanicWorkSession> {
  const sessions: Record<string, MechanicWorkSession> = {};

  MOCK_MECHANIC_VEHICLES.forEach((vehicle) => {
    sessions[vehicle.id] = buildDefaultSession(vehicle.id);
  });

  return sessions;
}

export const DEFAULT_ACTIVE_VEHICLE_ID = "mv-1";
