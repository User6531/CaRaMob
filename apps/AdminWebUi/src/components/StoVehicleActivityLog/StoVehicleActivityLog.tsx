import { useMemo } from "react";
import { ActivityLog } from "../ActivityLog";
import type { StoQueueVehicle } from "../../types/stoVehicle";
import { buildVehicleActivityLog } from "../../utils/stoVehicleActivityLog";

interface StoVehicleActivityLogProps {
  vehicle: StoQueueVehicle;
}

export function StoVehicleActivityLog({ vehicle }: StoVehicleActivityLogProps) {
  const entries = useMemo(() => buildVehicleActivityLog(vehicle), [vehicle]);

  return (
    <ActivityLog
      entries={entries}
      hint="Повний життєвий цикл: статуси, погодження, призначення механіка"
    />
  );
}
