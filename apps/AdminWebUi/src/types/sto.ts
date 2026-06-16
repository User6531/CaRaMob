export type StoStatus = "active" | "inactive" | "pending";

export interface ServiceStation {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status: StoStatus;
  createdAt: string;
}

export interface CreateStoPayload {
  name: string;
  address: string;
  phone?: string;
  email?: string;
}
