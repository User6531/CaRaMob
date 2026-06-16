import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_STOS } from "../data/mockStos";
import type { CreateStoPayload, ServiceStation } from "../types/sto";

interface StoContextValue {
  stos: ServiceStation[];
  addSto: (payload: CreateStoPayload) => ServiceStation;
  isLoading: boolean;
}

const StoContext = createContext<StoContextValue | null>(null);

function createId(): string {
  return `sto-${crypto.randomUUID().slice(0, 8)}`;
}

export function StoProvider({ children }: { children: ReactNode }) {
  const [stos, setStos] = useState<ServiceStation[]>(() => [...MOCK_STOS]);

  const addSto = useCallback((payload: CreateStoPayload) => {
    const newSto: ServiceStation = {
      id: createId(),
      name: payload.name.trim(),
      address: payload.address.trim(),
      phone: payload.phone?.trim() || undefined,
      email: payload.email?.trim() || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setStos((current) => [newSto, ...current]);
    return newSto;
  }, []);

  const value = useMemo(
    () => ({
      stos,
      addSto,
      isLoading: false,
    }),
    [stos, addSto],
  );

  return <StoContext.Provider value={value}>{children}</StoContext.Provider>;
}

export function useStos(): StoContextValue {
  const context = useContext(StoContext);
  if (!context) {
    throw new Error("useStos must be used within StoProvider");
  }
  return context;
}
