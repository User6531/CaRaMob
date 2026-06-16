import type { ServiceStation } from "../types/sto";

export const MOCK_STOS: ServiceStation[] = [
  {
    id: "sto-001",
    name: "AutoService Kyiv",
    address: "вул. Хрещатик, 12, Київ",
    phone: "+380 44 123 4567",
    email: "kyiv@autoservice.ua",
    status: "active",
    createdAt: "2025-11-10T10:00:00.000Z",
  },
  {
    id: "sto-002",
    name: "ProMotors Lviv",
    address: "вул. Городоцька, 45, Львів",
    phone: "+380 32 987 6543",
    email: "lviv@promotors.ua",
    status: "active",
    createdAt: "2025-12-01T14:30:00.000Z",
  },
  {
    id: "sto-003",
    name: "DriveFix Odesa",
    address: "вул. Дерибасівська, 8, Одеса",
    status: "pending",
    createdAt: "2026-01-15T09:15:00.000Z",
  },
];
