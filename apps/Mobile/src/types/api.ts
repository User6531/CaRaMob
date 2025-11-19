export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// Додати новий тип для відповіді /api/user/me
export interface MeResponse {
  name: string;
  email?: string;
  updatedAt: string | null;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

// Додати новий тип для PUT /api/user/update
export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// Car types
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCarDto {
  make: string;
  model: string;
  year: number;
  color?: string;
}

export interface UpdateCarDto {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
}
