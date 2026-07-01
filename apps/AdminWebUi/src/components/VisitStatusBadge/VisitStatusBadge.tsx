import type { VisitStatus } from "../../types/visit";
import { getVisitStatusBadgeStyle, VISIT_STATUS_LABELS } from "../../utils/visitLabels";
import styles from "./VisitStatusBadge.module.css";

interface VisitStatusBadgeProps {
  status: VisitStatus;
  showDot?: boolean;
}

export function VisitStatusBadge({ status, showDot = true }: VisitStatusBadgeProps) {
  const badgeStyle = getVisitStatusBadgeStyle(status);

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
        <span className={styles.dot} style={{ backgroundColor: badgeStyle.dotColor }} />
      ) : null}
      {VISIT_STATUS_LABELS[status]}
    </span>
  );
}
