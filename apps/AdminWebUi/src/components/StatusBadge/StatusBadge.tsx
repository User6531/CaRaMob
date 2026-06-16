import type { StoStatus } from "../../types/sto";
import styles from "./StatusBadge.module.css";

const LABELS: Record<StoStatus, string> = {
  active: "Активне",
  inactive: "Неактивне",
  pending: "Очікує",
};

interface StatusBadgeProps {
  status: StoStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>{LABELS[status]}</span>
  );
}
