import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_STO_MECHANICS } from "../data/mockStoMechanics";
import { MOCK_STO_VEHICLES } from "../data/mockStoVehicles";
import type {
  CreateStoQueueVehiclePayload,
  StoMechanic,
  StoVehicleApprovalLineItem,
  StoVehicleApprovalStatus,
  StoVehicleApproverRole,
  StoQueueVehicle,
  StoVehicleQueueStatus,
} from "../types/stoVehicle";

interface StoVehicleContextValue {
  vehicles: StoQueueVehicle[];
  mechanics: StoMechanic[];
  addVehicle: (payload: CreateStoQueueVehiclePayload) => StoQueueVehicle;
  updateVehicleStatus: (id: string, status: StoVehicleQueueStatus) => void;
  assignMechanic: (vehicleId: string, mechanicId: string) => void;
  resolveApprovalRequest: (
    vehicleId: string,
    approvalId: string,
    status: Exclude<StoVehicleApprovalStatus, "pending">,
    options?: {
      approverRole?: StoVehicleApproverRole;
      approvedByName?: string;
      managerOverrideReason?: string;
      rejectionReason?: string;
    },
  ) => void;
  updateApprovalLineItems: (
    vehicleId: string,
    approvalId: string,
    lineItems: StoVehicleApprovalLineItem[],
  ) => void;
  sendAllApprovalsToClient: (vehicleId: string) => void;
  approveAllApprovalsByManager: (vehicleId: string, reason?: string) => void;
  getVehiclesBySto: (stoId: string) => StoQueueVehicle[];
}

const StoVehicleContext = createContext<StoVehicleContextValue | null>(null);

function createId(): string {
  return `sv-${crypto.randomUUID().slice(0, 8)}`;
}

export function StoVehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<StoQueueVehicle[]>(
    () => [...MOCK_STO_VEHICLES],
  );
  const mechanics = useMemo(() => [...MOCK_STO_MECHANICS], []);

  const addVehicle = useCallback((payload: CreateStoQueueVehiclePayload) => {
    const now = new Date().toISOString();
    const newVehicle: StoQueueVehicle = {
      id: createId(),
      stoId: payload.stoId,
      brand: payload.brand.trim(),
      model: payload.model.trim(),
      year: payload.year,
      licensePlate: payload.licensePlate.trim().toUpperCase(),
      clientName: payload.clientName.trim(),
      clientPhone: payload.clientPhone?.trim() || undefined,
      problemSummary: payload.problemSummary?.trim() || undefined,
      status: payload.status,
      appointmentAt: payload.appointmentAt,
      arrivedAt:
        payload.status !== "scheduled" ? now : undefined,
      mechanicId: undefined,
      mechanicName: undefined,
      progress:
        payload.status === "in_repair"
          ? 0
          : payload.status === "waiting_parts"
            ? 40
            : payload.status === "quality_check"
              ? 95
            : payload.status === "ready"
              ? 100
              : undefined,
      approvalRequests: [],
      isManualEntry: true,
      createdAt: now,
      updatedAt: now,
    };

    setVehicles((current) => [newVehicle, ...current]);
    return newVehicle;
  }, []);

  const updateVehicleStatus = useCallback((id: string, status: StoVehicleQueueStatus) => {
    setVehicles((current) =>
      current.map((vehicle) => {
        if (vehicle.id !== id) return vehicle;
        if (vehicle.status === status) return vehicle;

        const now = new Date().toISOString();

        return {
          ...vehicle,
          status,
          arrivedAt:
            vehicle.arrivedAt ?? (status !== "scheduled" ? now : undefined),
          progress:
            status === "in_repair"
              ? (vehicle.progress ?? 0)
              : status === "waiting_parts"
                ? (vehicle.progress ?? 40)
              : status === "quality_check"
                ? (vehicle.progress ?? 95)
              : status === "ready"
                ? 100
                : undefined,
          updatedAt: now,
        };
      }),
    );
  }, []);

  const assignMechanic = useCallback((vehicleId: string, mechanicId: string) => {
    setVehicles((current) =>
      current.map((vehicle) => {
        if (vehicle.id !== vehicleId) return vehicle;
        if (!mechanicId) {
          return {
            ...vehicle,
            mechanicId: undefined,
            mechanicName: undefined,
            updatedAt: new Date().toISOString(),
          };
        }

        const mechanic = MOCK_STO_MECHANICS.find((item) => item.id === mechanicId);
        if (!mechanic) return vehicle;

        return {
          ...vehicle,
          mechanicId: mechanic.id,
          mechanicName: mechanic.fullName,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  const resolveApprovalRequest = useCallback(
    (
      vehicleId: string,
      approvalId: string,
      status: Exclude<StoVehicleApprovalStatus, "pending">,
      options?: {
        approverRole?: StoVehicleApproverRole;
        approvedByName?: string;
        managerOverrideReason?: string;
        rejectionReason?: string;
      },
    ) => {
      setVehicles((current) =>
        current.map((vehicle) => {
          if (vehicle.id !== vehicleId) return vehicle;

          const now = new Date().toISOString();
          const updatedApprovals = (vehicle.approvalRequests ?? []).map((request) =>
            request.id === approvalId
              ? {
                  ...request,
                  status,
                  reviewedAt: now,
                  approverRole: options?.approverRole,
                  approvedByName: options?.approvedByName,
                  managerOverrideReason: options?.managerOverrideReason,
                  rejectionReason: options?.rejectionReason,
                }
              : request,
          );

          return {
            ...vehicle,
            approvalRequests: updatedApprovals,
            updatedAt: now,
          };
        }),
      );
    },
    [],
  );

  const updateApprovalLineItems = useCallback(
    (vehicleId: string, approvalId: string, lineItems: StoVehicleApprovalLineItem[]) => {
      const totalAmount = lineItems.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 1),
        0,
      );

      setVehicles((current) =>
        current.map((vehicle) => {
          if (vehicle.id !== vehicleId) return vehicle;

          const updatedApprovals = (vehicle.approvalRequests ?? []).map((request) =>
            request.id === approvalId
              ? { ...request, lineItems, totalAmount }
              : request,
          );

          return {
            ...vehicle,
            approvalRequests: updatedApprovals,
            updatedAt: new Date().toISOString(),
          };
        }),
      );
    },
    [],
  );

  const sendAllApprovalsToClient = useCallback((vehicleId: string) => {
    setVehicles((current) =>
      current.map((vehicle) => {
        if (vehicle.id !== vehicleId) return vehicle;

        const now = new Date().toISOString();
        const updatedApprovals = (vehicle.approvalRequests ?? []).map((request) =>
          request.status === "pending" && !request.sentToClientAt
            ? { ...request, sentToClientAt: now }
            : request,
        );

        return {
          ...vehicle,
          approvalRequests: updatedApprovals,
          updatedAt: now,
        };
      }),
    );
  }, []);

  const approveAllApprovalsByManager = useCallback((vehicleId: string, reason?: string) => {
    setVehicles((current) =>
      current.map((vehicle) => {
        if (vehicle.id !== vehicleId) return vehicle;

        const now = new Date().toISOString();
        const updatedApprovals = (vehicle.approvalRequests ?? []).map((request) =>
          request.status === "pending"
            ? {
                ...request,
                status: "approved" as const,
                reviewedAt: now,
                approverRole: "manager" as const,
                approvedByName: "Менеджер СТО",
                managerOverrideReason: reason || undefined,
              }
            : request,
        );

        return {
          ...vehicle,
          approvalRequests: updatedApprovals,
          updatedAt: now,
        };
      }),
    );
  }, []);

  const getVehiclesBySto = useCallback(
    (stoId: string) => vehicles.filter((vehicle) => vehicle.stoId === stoId),
    [vehicles],
  );

  const value = useMemo(
    () => ({
      vehicles,
      mechanics,
      addVehicle,
      updateVehicleStatus,
      assignMechanic,
      resolveApprovalRequest,
      updateApprovalLineItems,
      sendAllApprovalsToClient,
      approveAllApprovalsByManager,
      getVehiclesBySto,
    }),
    [
      vehicles,
      mechanics,
      addVehicle,
      updateVehicleStatus,
      assignMechanic,
      resolveApprovalRequest,
      updateApprovalLineItems,
      sendAllApprovalsToClient,
      approveAllApprovalsByManager,
      getVehiclesBySto,
    ],
  );

  return (
    <StoVehicleContext.Provider value={value}>{children}</StoVehicleContext.Provider>
  );
}

export function useStoVehicles(): StoVehicleContextValue {
  const context = useContext(StoVehicleContext);
  if (!context) {
    throw new Error("useStoVehicles must be used within StoVehicleProvider");
  }
  return context;
}
