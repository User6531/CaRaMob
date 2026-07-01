import type { BookingRequest } from "../../types/bookingRequest";
import {
  formatPreferredSlot,
  PARTS_OPTION_LABELS,
  VISIT_REASON_LABELS,
} from "../../utils/bookingLabels";
import { formatEventDateTime, formatStoVehicleTitle } from "../../utils/stoVehicleLabels";
import { BookingStatusBadge } from "../BookingStatusBadge";
import styles from "./BookingRequestCard.module.css";

interface BookingRequestCardProps {
  request: BookingRequest;
  onOpen: (request: BookingRequest) => void;
}

export function BookingRequestCard({ request, onOpen }: BookingRequestCardProps) {
  const title = formatStoVehicleTitle(request.brand, request.model, request.year);
  const preferredSlot = formatPreferredSlot(request.preferredDate, request.preferredTimeSlot);

  return (
    <article
      className={[
        styles.card,
        request.status === "pending" ? styles.cardPending : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onOpen(request)}
    >
      <div className={styles.cardHeader}>
        <div className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14v11zM7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <h3 className={styles.vehicleTitle}>{title}</h3>
            <span className={styles.plateBadge}>{request.licensePlate}</span>
          </div>
          <p className={styles.clientName}>{request.clientName}</p>
        </div>
      </div>

      <p className={styles.reason}>
        {VISIT_REASON_LABELS[request.visitReason]} — {request.problemDescription}
      </p>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Зручно водію</span>
          <span className={styles.metaValue}>{preferredSlot}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Запчастини</span>
          <span className={styles.metaValue}>{PARTS_OPTION_LABELS[request.partsOption]}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <BookingStatusBadge status={request.status} />
        <div className={styles.footerMeta}>
          {request.attachmentsCount ? (
            <span className={styles.attachments}>📎 {request.attachmentsCount}</span>
          ) : null}
          <span className={styles.createdAt}>{formatEventDateTime(request.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
