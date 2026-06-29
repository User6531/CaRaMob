import type { StoVehicleQueueStatus } from "../../types/stoVehicle";
import {
  getStoVehicleStatusBadgeStyle,
  STO_VEHICLE_STATUS_LABELS,
} from "../../utils/stoVehicleLabels";
import styles from "./StoVehicleStatusBadge.module.css";

interface StoVehicleStatusBadgeProps {
  status: StoVehicleQueueStatus;
  showDot?: boolean;
}

export function StoVehicleStatusBadge({
  status,
  showDot = true,
}: StoVehicleStatusBadgeProps) {
  const badgeStyle = getStoVehicleStatusBadgeStyle(status);

  return (
    <span
      className={styles.badge}
      style={{
        backgroundColor: badgeStyle.backgroundColor,
        borderColor: badgeStyle.borderColor,
        color: badgeStyle.textColor,
      }}
    >
      {showDot ? (
        <span
          className={styles.dot}
          style={{ backgroundColor: badgeStyle.dotColor }}
        />
      ) : null}
      {STO_VEHICLE_STATUS_LABELS[status]}
    </span>
  );
}
