export const queryKeys = {
  // User queries
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  me: ["users", "me"] as const,

  // Car queries
  cars: ["cars"] as const,
  car: (id: string) => ["cars", id] as const,
  userCars: (userId: string) => ["users", userId, "cars"] as const,
} as const;
