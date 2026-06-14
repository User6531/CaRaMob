export const queryKeys = {
  // User queries
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  me: ["users", "me"] as const,

  // Car queries
  cars: ["cars"] as const,
  car: (id: string) => ["cars", id] as const,
  userCars: (userId: string) => ["users", userId, "cars"] as const,

  // Vehicle queries (GET /api/vehicles)
  vehicles: ["vehicles"] as const,
  vehicle: (id: string) => ["vehicles", id] as const,
  serviceHistory: (vehicleId: string) =>
    ["vehicles", vehicleId, "service-history"] as const,
  serviceHistoryDetail: (vehicleId: string, serviceHistoryId: string) =>
    ["vehicles", vehicleId, "service-history", serviceHistoryId] as const,
} as const;
