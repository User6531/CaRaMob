import { ActiveServiceSession } from "../../types/serviceStatus";

export const MOCK_ACTIVE_SESSION: ActiveServiceSession = {
  id: "session-1",
  serviceName: "АвтоМайстер",
  serviceAddress: "вул. Січових Стрільців, 21, Київ",
  servicePhone: "+380501234567",
  vehicleTitle: "BMW X5",
  licensePlate: "AA1234BB",
  acceptedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  currentStatus: "approval",
  currentWork: "Заміна гальмівних дисків",
  isApproved: false,
  estimateItems: [
    { id: "e1", title: "Заміна гальмівних дисків (передні)", price: 4200 },
    { id: "e2", title: "Заміна гальмівних колодок", price: 1800 },
    { id: "e3", title: "Діагностика ходової частини", price: 600 },
    { id: "e4", title: "Розвал-сходження", price: 900 },
  ],
  totalBill: 7500,
};
