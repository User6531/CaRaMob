import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_BOOKING_REQUESTS } from "../data/mockBookingRequests";
import { useStoVehicles } from "./StoVehicleContext";
import type { BookingRequest, BookingRequestStatus } from "../types/bookingRequest";
import { buildProblemSummary } from "../utils/bookingLabels";

interface BookingRequestContextValue {
  requests: BookingRequest[];
  getRequestsBySto: (stoId: string, status?: BookingRequestStatus) => BookingRequest[];
  confirmRequest: (
    requestId: string,
    appointmentAt: string,
    managerNote?: string,
  ) => BookingRequest | null;
  rejectRequest: (requestId: string, reason: string) => void;
}

const BookingRequestContext = createContext<BookingRequestContextValue | null>(null);

export function BookingRequestProvider({ children }: { children: ReactNode }) {
  const { addVehicle } = useStoVehicles();
  const [requests, setRequests] = useState<BookingRequest[]>(
    () => [...MOCK_BOOKING_REQUESTS],
  );

  const getRequestsBySto = useCallback(
    (stoId: string, status?: BookingRequestStatus) => {
      const filtered = requests.filter((request) => request.stoId === stoId);
      if (!status) return filtered;
      return filtered.filter((request) => request.status === status);
    },
    [requests],
  );

  const confirmRequest = useCallback(
    (requestId: string, appointmentAt: string, managerNote?: string) => {
      const request = requests.find((item) => item.id === requestId);
      if (!request || request.status !== "pending") return null;

      const vehicle = addVehicle({
        stoId: request.stoId,
        brand: request.brand,
        model: request.model,
        year: request.year,
        licensePlate: request.licensePlate,
        clientName: request.clientName,
        clientPhone: request.clientPhone,
        problemSummary: buildProblemSummary(request.visitReason, request.problemDescription),
        status: "scheduled",
        appointmentAt,
        isManualEntry: false,
      });

      const now = new Date().toISOString();
      const updated: BookingRequest = {
        ...request,
        status: "confirmed",
        managerAppointmentAt: appointmentAt,
        managerNote: managerNote?.trim() || undefined,
        queueVehicleId: vehicle.id,
        updatedAt: now,
      };

      setRequests((current) =>
        current.map((item) => (item.id === requestId ? updated : item)),
      );

      return updated;
    },
    [requests, addVehicle],
  );

  const rejectRequest = useCallback((requestId: string, reason: string) => {
    const now = new Date().toISOString();
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId && request.status === "pending"
          ? {
              ...request,
              status: "rejected",
              rejectionReason: reason.trim(),
              updatedAt: now,
            }
          : request,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      requests,
      getRequestsBySto,
      confirmRequest,
      rejectRequest,
    }),
    [requests, getRequestsBySto, confirmRequest, rejectRequest],
  );

  return (
    <BookingRequestContext.Provider value={value}>
      {children}
    </BookingRequestContext.Provider>
  );
}

export function useBookingRequests(): BookingRequestContextValue {
  const context = useContext(BookingRequestContext);
  if (!context) {
    throw new Error("useBookingRequests must be used within BookingRequestProvider");
  }
  return context;
}
