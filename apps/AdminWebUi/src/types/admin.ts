export interface PagedResult<T> {
  items: T[];
  totalItems: number;
}

export interface DriverListItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  providerId: string;
  createdAt: string;
}

export interface DriverDetails {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  pictureUrl?: string;
  providerId: string;
  createdAt: string;
}

export interface DriverVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  photoUrl?: string;
}

export interface VehicleListItem {
  id: string;
  ownerUserId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  fuelType: string;
  transmissionType: string;
  wheelDriveType: string;
  color: string;
  mileage: number;
  createdAt: string;
}

export interface VehicleDetails {
  id: string;
  ownerUserId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  fuelType: string;
  transmissionType: string;
  wheelDriveType: string;
  color: string;
  mileage: number;
}

export interface ServiceVisit {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceRecord {
  id: string;
  title: string;
  description: string;
  price: number;
}
