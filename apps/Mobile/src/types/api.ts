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

// Vehicle list item (GET /api/vehicles) - matches backend VehicleListItemDto
export interface VehicleListItem {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  photoUrl: string | null;
}

// Full vehicle (GET /api/vehicles/{id}) - matches backend VehicleDto
export interface VehicleDto {
  id: string;
  licensePlate: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  boughtAt: string | null;
  wheelDriveType: WheelDriveType;
  engineCapacity: number;
  fuelType: FuelType;
  enginePower: number;
  color: string;
  transmissionType: TransmissionType;
  mileage: number;
  createdAt: string;
  updatedAt: string | null;
  photoUrl: string | null;
}

// Vehicle API (POST /api/vehicles) - matches backend CreateVehicleDto
export enum WheelDriveType {
  FWD = 0,
  RWD = 1,
  AWD = 2,
  FourWD = 3,
}

export enum FuelType {
  Gasoline = 0,
  Diesel = 1,
  Electric = 2,
  Hybrid = 3,
  PlugInHybrid = 4,
  Hydrogen = 5,
}

export enum TransmissionType {
  Manual = 0,
  Automatic = 1,
  CVT = 2,
  SemiAutomatic = 3,
  DualClutch = 4,
}

export interface CreateVehicleDto {
  licensePlate: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  boughtAt: string | null;
  wheelDriveType: WheelDriveType;
  engineCapacity: number;
  fuelType: FuelType;
  enginePower: number;
  color: string;
  transmissionType: TransmissionType;
  mileage: number;
  photoUrl?: string | null;
}

// PUT /api/vehicles/{id} - matches backend UpdateVehicleDto
export interface UpdateVehicleDto {
  licensePlate?: string | null;
  boughtAt?: string | null;
  color?: string | null;
  mileage?: number | null;
  photoUrl?: string | null;
}

export interface ServiceWorkItemDto {
  id: string;
  title: string;
  price?: number | null;
}

export interface ServiceHistoryVisitDto {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  records?: ServiceWorkItemDto[];
}

export interface CreateServiceWorkItemDto {
  title: string;
  price: number;
}

export interface CreateServiceHistoryDto {
  title: string;
  description?: string;
  records: CreateServiceWorkItemDto[];
}
