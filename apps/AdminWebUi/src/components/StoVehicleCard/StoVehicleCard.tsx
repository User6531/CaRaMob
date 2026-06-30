import type { MouseEvent } from "react";
import { Select, type SelectOption } from "../Select";
import type {
  StoMechanic,
  StoQueueVehicle,
  StoVehicleQueueStatus,
} from "../../types/stoVehicle";
import {
  formatAppointmentDate,
  formatArrivedAt,
  formatStoVehicleTitle,
  STO_VEHICLE_STATUS_LABELS,
  STO_VEHICLE_STATUS_ORDER,
} from "../../utils/stoVehicleLabels";
import { StoVehicleStatusBadge } from "../StoVehicleStatusBadge";
import styles from "./StoVehicleCard.module.css";

const STATUS_OPTIONS: SelectOption[] = STO_VEHICLE_STATUS_ORDER.map((status) => ({
  value: status,
  label: STO_VEHICLE_STATUS_LABELS[status],
}));

interface StoVehicleCardProps {
  vehicle: StoQueueVehicle;
  onStatusChange: (id: string, status: StoVehicleQueueStatus) => void;
  mechanics: StoMechanic[];
  onAssignMechanic: (vehicleId: string, mechanicId: string) => void;
  onOpen?: (vehicle: StoQueueVehicle) => void;
}

function VehicleIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.vehicleIconSvg} aria-hidden="true">
      <path
        d="M4 14l1-3h14l1 3v4h-2a2 2 0 1 1-4 0H10a2 2 0 1 1-4 0H4v-4zm2-.5h12l-.4-1.2H6.4L6 13.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function StoVehicleCard({
  vehicle,
  onStatusChange,
  mechanics,
  onAssignMechanic,
  onOpen,
}: StoVehicleCardProps) {
  const title = formatStoVehicleTitle(vehicle.brand, vehicle.model, vehicle.year);
  const progress = vehicle.progress ?? 0;
  const pendingApprovals = (vehicle.approvalRequests ?? []).filter(
    (request) => request.status === "pending",
  );
  const showProgress =
    vehicle.status === "in_repair" ||
    vehicle.status === "waiting_parts" ||
    vehicle.status === "quality_check" ||
    vehicle.status === "ready";
  const mechanicOptions: SelectOption[] = [
    { value: "", label: "Не призначено" },
    ...mechanics.map((mechanic) => ({
      value: mechanic.id,
      label: mechanic.fullName,
    })),
  ];

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    if (!onOpen) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, [role='listbox'], [role='option']")) return;
    onOpen(vehicle);
  };

  return (
    <article
      className={[styles.card, onOpen ? styles.cardClickable : ""].filter(Boolean).join(" ")}
      onClick={handleCardClick}
    >
      <div className={styles.cardHeader}>
        <div className={styles.vehicleIcon}>
          <VehicleIcon />
        </div>

        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <h3 className={styles.vehicleTitle}>{title}</h3>
            <span className={styles.plateBadge}>{vehicle.licensePlate}</span>
          </div>
          <p className={styles.clientName}>Власник: {vehicle.clientName}</p>
          {vehicle.clientPhone ? (
            <p className={styles.clientPhone}>{vehicle.clientPhone}</p>
          ) : null}
        </div>
      </div>

      {vehicle.problemSummary ? (
        <div className={styles.problemRow}>
          <svg viewBox="0 0 24 24" className={styles.problemIcon} aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className={styles.problemContent}>
            <span className={styles.problemLabel}>Проблема</span>
            <p className={styles.problemText}>{vehicle.problemSummary}</p>
          </div>
        </div>
      ) : null}

      <div className={styles.mechanicSection}>
        <div className={styles.mechanicHeader}>
          <span className={styles.mechanicLabel}>Механік</span>
          <span className={styles.mechanicName}>
            {vehicle.mechanicName ?? "Не призначено"}
          </span>
        </div>
        <Select
          value={vehicle.mechanicId ?? ""}
          onChange={(mechanicId) => onAssignMechanic(vehicle.id, mechanicId)}
          options={mechanicOptions}
          placeholder="Призначити механіка"
        />
      </div>

      {pendingApprovals.length > 0 ? (
        <div className={styles.approvalBanner}>
          <span className={styles.approvalBannerDot} />
          Потрібне погодження: {pendingApprovals.length}
        </div>
      ) : null}

      {showProgress ? (
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Прогрес ремонту</span>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className={styles.metaRow}>
        {vehicle.status === "scheduled" && vehicle.appointmentAt ? (
          <span className={styles.metaText}>
            {formatAppointmentDate(vehicle.appointmentAt)}
          </span>
        ) : null}
        {vehicle.arrivedAt && vehicle.status !== "scheduled" ? (
          <span className={styles.metaText}>{formatArrivedAt(vehicle.arrivedAt)}</span>
        ) : null}
        {vehicle.mechanicName ? (
          <span className={styles.metaText}>Механік: {vehicle.mechanicName}</span>
        ) : null}
        {vehicle.isManualEntry ? (
          <span className={styles.manualBadge}>Додано вручну</span>
        ) : null}
      </div>

      <div className={styles.footer}>
        <StoVehicleStatusBadge status={vehicle.status} />
        <div className={styles.statusSelect}>
          <Select
            value={vehicle.status}
            onChange={(status) =>
              onStatusChange(vehicle.id, status as StoVehicleQueueStatus)
            }
            options={STATUS_OPTIONS}
          />
        </div>
      </div>
    </article>
  );
}
