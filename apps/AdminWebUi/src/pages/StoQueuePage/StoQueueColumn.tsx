import { StoVehicleCard } from "../../components/StoVehicleCard";
import { StoVehicleStatusBadge } from "../../components/StoVehicleStatusBadge";
import type { StoMechanic, StoQueueVehicle, StoVehicleQueueStatus } from "../../types/stoVehicle";
import {
  STO_VEHICLE_COLUMN_DESCRIPTIONS,
  STO_VEHICLE_STATUS_LABELS,
} from "../../utils/stoVehicleLabels";
import styles from "./StoQueuePage.module.css";

interface StoQueueColumnProps {
  status: StoVehicleQueueStatus;
  vehicles: StoQueueVehicle[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onStatusChange: (id: string, status: StoVehicleQueueStatus) => void;
  mechanics: StoMechanic[];
  onAssignMechanic: (vehicleId: string, mechanicId: string) => void;
  onVehicleOpen: (vehicle: StoQueueVehicle) => void;
}

function countPendingApprovals(vehicles: StoQueueVehicle[]): number {
  return vehicles.filter((vehicle) =>
    (vehicle.approvalRequests ?? []).some((request) => request.status === "pending"),
  ).length;
}

export function StoQueueColumn({
  status,
  vehicles,
  isCollapsed,
  onToggleCollapse,
  onStatusChange,
  mechanics,
  onAssignMechanic,
  onVehicleOpen,
}: StoQueueColumnProps) {
  const pendingCount = countPendingApprovals(vehicles);
  const label = STO_VEHICLE_STATUS_LABELS[status];

  if (isCollapsed) {
    return (
      <section className={`${styles.column} ${styles.columnCollapsed}`}>
        <button
          type="button"
          className={styles.collapsedColumnButton}
          onClick={onToggleCollapse}
          title={`Розгорнути: ${label}`}
          aria-label={`Розгорнути колонку ${label}`}
        >
          <span className={styles.collapsedCount}>{vehicles.length}</span>
          {pendingCount > 0 ? <span className={styles.collapsedAttentionDot} /> : null}
          <span className={styles.collapsedTitle}>{label}</span>
        </button>
      </section>
    );
  }

  return (
    <section className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitleRow}>
          <div className={styles.columnTitleGroup}>
            <h2 className={styles.columnTitle}>{label}</h2>
            <span className={styles.columnCount}>{vehicles.length}</span>
            {pendingCount > 0 ? (
              <span className={styles.columnAttentionBadge} title="Потребує уваги">
                {pendingCount}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            className={styles.collapseButton}
            onClick={onToggleCollapse}
            aria-label={`Згорнути колонку ${label}`}
            title="Згорнути колонку"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M10 4L6 8l4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <p className={styles.columnDescription}>
          {STO_VEHICLE_COLUMN_DESCRIPTIONS[status]}
        </p>
      </div>

      <div className={styles.columnCards}>
        {vehicles.length === 0 ? (
          <div className={styles.emptyColumn}>
            <p>Немає автомобілів</p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <StoVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onStatusChange={onStatusChange}
              mechanics={mechanics}
              onAssignMechanic={onAssignMechanic}
              onOpen={onVehicleOpen}
            />
          ))
        )}
      </div>
    </section>
  );
}

interface StoQueueStatCardProps {
  status: StoVehicleQueueStatus;
  count: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function StoQueueStatCard({
  status,
  count,
  isCollapsed,
  onToggleCollapse,
}: StoQueueStatCardProps) {
  const label = STO_VEHICLE_STATUS_LABELS[status];

  if (isCollapsed) {
    return (
      <button
        type="button"
        className={`${styles.statCard} ${styles.statCardCollapsed}`}
        onClick={onToggleCollapse}
        title={`Розгорнути: ${label}`}
        aria-label={`Розгорнути ${label}`}
      >
        <span className={styles.statCount}>{count}</span>
      </button>
    );
  }

  return (
    <div className={styles.statCard}>
      <StoVehicleStatusBadge status={status} showDot={false} />
      <span className={styles.statCount}>{count}</span>
    </div>
  );
}
