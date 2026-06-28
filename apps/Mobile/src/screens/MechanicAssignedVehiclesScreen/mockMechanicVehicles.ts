import { MechanicAssignedVehicle } from "../../types/mechanicVehicle";

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_MECHANIC_VEHICLES: MechanicAssignedVehicle[] = [
  {
    id: "mv-1",
    vehicleTitle: "Volkswagen Golf",
    licensePlate: "KA4521AB",
    year: 2018,
    mileage: 142300,
    vin: "WVWZZZ1KZAW123456",
    problemSummary: "Заміна двигуна",
    currentStatus: "in_progress",
    acceptedAt: daysAgo(3),
    clientName: "Олег В.",
  },
  {
    id: "mv-2",
    vehicleTitle: "BMW X5",
    licensePlate: "AA1234BB",
    year: 2020,
    mileage: 68400,
    vin: "WBAFR9C50LC987654",
    problemSummary: "Стук у передній підвісці, веде вбік",
    currentStatus: "diagnostics",
    acceptedAt: hoursAgo(5),
    clientName: "Ірина М.",
  },
  {
    id: "mv-3",
    vehicleTitle: "Toyota Camry",
    licensePlate: "BI7788CT",
    year: 2019,
    mileage: 91000,
    vin: "4T1B11HK5KU112233",
    problemSummary: "Заміна ГРМ та помпи",
    currentStatus: "approval",
    acceptedAt: daysAgo(1),
    clientName: "Андрій С.",
  },
  {
    id: "mv-4",
    vehicleTitle: "Audi A4",
    licensePlate: "AE9900HX",
    year: 2017,
    mileage: 118500,
    vin: "WAUZZZ8K8HA445566",
    problemSummary: "Не заводиться, горить check engine",
    currentStatus: "received",
    acceptedAt: hoursAgo(2),
    clientName: "Марія К.",
  },
  {
    id: "mv-5",
    vehicleTitle: "Mercedes-Benz C 200",
    licensePlate: "HH2211OP",
    year: 2021,
    mileage: 45600,
    vin: "WDDWF4KB1MR778899",
    problemSummary: "Скрип гальм, заміна дисків",
    currentStatus: "in_progress",
    acceptedAt: daysAgo(2),
    clientName: "Віктор П.",
  },
  {
    id: "mv-6",
    vehicleTitle: "Hyundai Tucson",
    licensePlate: "CE3344IA",
    year: 2022,
    mileage: 38900,
    vin: "KM8J2CA42NU556677",
    problemSummary: "ТО 90 000 км",
    currentStatus: "quality_check",
    acceptedAt: daysAgo(4),
    clientName: "Наталія Л.",
  },
];
