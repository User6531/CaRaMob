export interface DriverFilters {
  name: string;
  phone: string;
  email: string;
  providerId: string;
  createdFrom: string;
  createdTo: string;
}

export interface VehicleFilters {
  brand: string;
  model: string;
  vin: string;
  licensePlate: string;
  color: string;
  fuelType: string;
  transmissionType: string;
  wheelDriveType: string;
  yearFrom: string;
  yearTo: string;
}

export interface DriversListParams {
  page: number;
  pageSize: number;
  filters: DriverFilters;
}

export interface VehiclesListParams {
  page: number;
  pageSize: number;
  filters: VehicleFilters;
}

export const EMPTY_DRIVER_FILTERS: DriverFilters = {
  name: "",
  phone: "",
  email: "",
  providerId: "",
  createdFrom: "",
  createdTo: "",
};

export const EMPTY_VEHICLE_FILTERS: VehicleFilters = {
  brand: "",
  model: "",
  vin: "",
  licensePlate: "",
  color: "",
  fuelType: "",
  transmissionType: "",
  wheelDriveType: "",
  yearFrom: "",
  yearTo: "",
};
