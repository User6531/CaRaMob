import React from "react";
import {
  MechanicSessionStatus,
  MechanicWorkItem,
  MechanicWorkSession,
  PartOrderItem,
} from "../types/mechanicWork";
import { MOCK_MECHANIC_VEHICLES } from "../screens/MechanicAssignedVehiclesScreen/mockMechanicVehicles";
import {
  createInitialMechanicSessions,
  DEFAULT_ACTIVE_VEHICLE_ID,
} from "../screens/MechanicActiveWorkScreen/mockMechanicWorkSessions";
import { createEmptyWorkItem } from "../screens/MechanicActiveWorkScreen/mechanicWorkUtils";
import { createEmptyPartOrder } from "../screens/MechanicActiveWorkScreen/mechanicPartsUtils";

interface MechanicWorkContextValue {
  activeVehicleId: string | null;
  activeVehicle: (typeof MOCK_MECHANIC_VEHICLES)[number] | null;
  session: MechanicWorkSession | null;
  sessions: Record<string, MechanicWorkSession>;
  setActiveVehicleId: (vehicleId: string) => void;
  acceptVehicle: () => void;
  startDiagnostics: () => void;
  approveDiagnostics: () => void;
  completeRepair: () => void;
  returnToRepair: () => void;
  startWaitingParts: () => void;
  proceedToEstimate: () => void;
  finishWork: () => void;
  addWorkItem: (
    kind?: MechanicWorkItem["kind"],
    awaitingApproval?: boolean
  ) => void;
  updateWorkItem: (id: string, patch: Partial<MechanicWorkItem>) => void;
  removeWorkItem: (id: string) => void;
  addWorkItemPhoto: (workItemId: string, uri: string) => void;
  removeWorkItemPhoto: (workItemId: string, uri: string) => void;
  addPartOrder: () => void;
  updatePartOrder: (id: string, patch: Partial<PartOrderItem>) => void;
  removePartOrder: (id: string) => void;
  setConclusion: (text: string) => void;
  addConclusionPhoto: (uri: string) => void;
  removeConclusionPhoto: (uri: string) => void;
}

const MechanicWorkContext = React.createContext<
  MechanicWorkContextValue | undefined
>(undefined);

export function MechanicWorkProvider({ children }: { children: React.ReactNode }) {
  const [activeVehicleId, setActiveVehicleId] = React.useState<string | null>(
    DEFAULT_ACTIVE_VEHICLE_ID
  );
  const [sessions, setSessions] = React.useState<Record<string, MechanicWorkSession>>(
    () => createInitialMechanicSessions()
  );

  const activeVehicle =
    MOCK_MECHANIC_VEHICLES.find((vehicle) => vehicle.id === activeVehicleId) ??
    null;

  const session = activeVehicleId ? sessions[activeVehicleId] ?? null : null;

  const updateSession = React.useCallback(
    (
      vehicleId: string,
      updater: (prev: MechanicWorkSession) => MechanicWorkSession
    ) => {
      setSessions((prev) => {
        const current = prev[vehicleId];
        if (!current) return prev;
        return { ...prev, [vehicleId]: updater(current) };
      });
    },
    []
  );

  const setSessionStatus = React.useCallback(
    (status: MechanicSessionStatus) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        sessionStatus: status,
      }));
    },
    [activeVehicleId, updateSession]
  );

  const acceptVehicle = React.useCallback(() => {
    setSessionStatus("accepted");
  }, [setSessionStatus]);

  const startDiagnostics = React.useCallback(() => {
    setSessionStatus("diagnostics");
  }, [setSessionStatus]);

  const approveDiagnostics = React.useCallback(() => {
    if (!activeVehicleId) return;
    updateSession(activeVehicleId, (prev) => ({
      ...prev,
      sessionStatus: "repair",
      workItems: prev.workItems.map((item) =>
        item.kind === "planned" ? { ...item, awaitingApproval: false } : item
      ),
    }));
  }, [activeVehicleId, updateSession]);

  const completeRepair = React.useCallback(() => {
    setSessionStatus("final_check");
  }, [setSessionStatus]);

  const returnToRepair = React.useCallback(() => {
    setSessionStatus("repair");
  }, [setSessionStatus]);

  const startWaitingParts = React.useCallback(() => {
    setSessionStatus("waiting_parts");
  }, [setSessionStatus]);

  const proceedToEstimate = React.useCallback(() => {
    setSessionStatus("estimate");
  }, [setSessionStatus]);

  const finishWork = React.useCallback(() => {
    setSessionStatus("completed");
  }, [setSessionStatus]);

  const addWorkItem = React.useCallback(
    (
      kind: MechanicWorkItem["kind"] = "planned",
      awaitingApproval = kind === "recommended"
    ) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        workItems: [
          ...prev.workItems,
          createEmptyWorkItem(kind, awaitingApproval),
        ],
      }));
    },
    [activeVehicleId, updateSession]
  );

  const updateWorkItem = React.useCallback(
    (id: string, patch: Partial<MechanicWorkItem>) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        workItems: prev.workItems.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ),
      }));
    },
    [activeVehicleId, updateSession]
  );

  const removeWorkItem = React.useCallback(
    (id: string) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        workItems: prev.workItems.filter((item) => item.id !== id),
      }));
    },
    [activeVehicleId, updateSession]
  );

  const addWorkItemPhoto = React.useCallback(
    (workItemId: string, uri: string) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        workItems: prev.workItems.map((item) =>
          item.id === workItemId
            ? { ...item, photos: [...item.photos, uri] }
            : item
        ),
      }));
    },
    [activeVehicleId, updateSession]
  );

  const removeWorkItemPhoto = React.useCallback(
    (workItemId: string, uri: string) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        workItems: prev.workItems.map((item) =>
          item.id === workItemId
            ? { ...item, photos: item.photos.filter((photo) => photo !== uri) }
            : item
        ),
      }));
    },
    [activeVehicleId, updateSession]
  );

  const addPartOrder = React.useCallback(() => {
    if (!activeVehicleId) return;
    updateSession(activeVehicleId, (prev) => ({
      ...prev,
      partOrders: [...prev.partOrders, createEmptyPartOrder()],
    }));
  }, [activeVehicleId, updateSession]);

  const updatePartOrder = React.useCallback(
    (id: string, patch: Partial<PartOrderItem>) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        partOrders: prev.partOrders.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ),
      }));
    },
    [activeVehicleId, updateSession]
  );

  const removePartOrder = React.useCallback(
    (id: string) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        partOrders: prev.partOrders.filter((item) => item.id !== id),
      }));
    },
    [activeVehicleId, updateSession]
  );

  const setConclusion = React.useCallback(
    (text: string) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        conclusion: text,
      }));
    },
    [activeVehicleId, updateSession]
  );

  const addConclusionPhoto = React.useCallback(
    (uri: string) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        conclusionPhotos: [...prev.conclusionPhotos, uri],
      }));
    },
    [activeVehicleId, updateSession]
  );

  const removeConclusionPhoto = React.useCallback(
    (uri: string) => {
      if (!activeVehicleId) return;
      updateSession(activeVehicleId, (prev) => ({
        ...prev,
        conclusionPhotos: prev.conclusionPhotos.filter((item) => item !== uri),
      }));
    },
    [activeVehicleId, updateSession]
  );

  const value = React.useMemo(
    () => ({
      activeVehicleId,
      activeVehicle,
      session,
      sessions,
      setActiveVehicleId,
      acceptVehicle,
      startDiagnostics,
      approveDiagnostics,
      completeRepair,
      returnToRepair,
      startWaitingParts,
      proceedToEstimate,
      finishWork,
      addWorkItem,
      updateWorkItem,
      removeWorkItem,
      addWorkItemPhoto,
      removeWorkItemPhoto,
      addPartOrder,
      updatePartOrder,
      removePartOrder,
      setConclusion,
      addConclusionPhoto,
      removeConclusionPhoto,
    }),
    [
      activeVehicleId,
      activeVehicle,
      session,
      sessions,
      acceptVehicle,
      startDiagnostics,
      approveDiagnostics,
      completeRepair,
      returnToRepair,
      startWaitingParts,
      proceedToEstimate,
      finishWork,
      addWorkItem,
      updateWorkItem,
      removeWorkItem,
      addWorkItemPhoto,
      removeWorkItemPhoto,
      addPartOrder,
      updatePartOrder,
      removePartOrder,
      setConclusion,
      addConclusionPhoto,
      removeConclusionPhoto,
    ]
  );

  return (
    <MechanicWorkContext.Provider value={value}>
      {children}
    </MechanicWorkContext.Provider>
  );
}

export function useMechanicWork() {
  const context = React.useContext(MechanicWorkContext);
  if (!context) {
    throw new Error("useMechanicWork must be used within MechanicWorkProvider");
  }
  return context;
}
