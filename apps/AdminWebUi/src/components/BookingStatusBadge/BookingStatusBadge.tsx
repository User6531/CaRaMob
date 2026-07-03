import type { BookingRequestStatus } from "../../types/bookingRequest";
import { BOOKING_STATUS_LABELS } from "../../utils/bookingLabels";
import styles from "./BookingStatusBadge.module.css";

const BADGE_STYLES: Record<
  BookingRequestStatus,
  { backgroundColor: string; borderColor: string; textColor: string; dotColor: string }
> = {
  pending: {
    backgroundColor: "rgba(255, 166, 87, 0.14)",
    borderColor: "rgba(255, 166, 87, 0.28)",
    textColor: "#ffa657",
    dotColor: "#ffa657",
  },
  confirmed: {
    backgroundColor: "rgba(74, 222, 158, 0.15)",
    borderColor: "rgba(74, 222, 158, 0.3)",
    textColor: "#4ade9e",
    dotColor: "#4ade9e",
  },
  rejected: {
    backgroundColor: "rgba(248, 81, 73, 0.12)",
    borderColor: "rgba(248, 81, 73, 0.28)",
    textColor: "#f85149",
    dotColor: "#f85149",
  },
};

interface BookingStatusBadgeProps {
  status: BookingRequestStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const style = BADGE_STYLES[status];

  return (
    <span
      className={styles.badge}
      style={{
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.textColor,
      }}
    >
      <span className={styles.dot} style={{ backgroundColor: style.dotColor }} />
      {BOOKING_STATUS_LABELS[status]}
    </span>
  );
}
