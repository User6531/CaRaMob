import { useMemo } from "react";
import { Modal } from "../Modal";
import { ActivityLog } from "../ActivityLog";
import { VisitStatusBadge } from "../VisitStatusBadge";
import type { VisitListItem } from "../../types/visit";
import { buildVisitActivityLog } from "../../utils/visitActivityLog";
import {
  calcVisitTotal,
  formatVisitDateTime,
  formatVisitPrice,
  formatVisitTitle,
} from "../../utils/visitLabels";
import styles from "./VisitDetailModal.module.css";

interface VisitDetailModalProps {
  visit: VisitListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VisitDetailModal({ visit, isOpen, onClose }: VisitDetailModalProps) {
  const activityEntries = useMemo(
    () => (visit ? buildVisitActivityLog(visit) : []),
    [visit],
  );

  if (!visit) return null;

  const vehicleTitle = formatVisitTitle(visit.brand, visit.model, visit.year);
  const total = calcVisitTotal(visit.records);

  return (
    <Modal isOpen={isOpen} title="" onClose={onClose} size="large" hideHeader>
      <div className={styles.modalContent}>
        <header className={styles.topBar}>
          <div className={styles.topBarMain}>
            <div className={styles.topBarIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M14 6h4v4h-4V6zm-8 4h4v8H6v-8zm8 0h4v8h-4v-8zM4 4h6v2H4V4zm10 0h6v2h-6V4z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h2 className={styles.topBarTitle}>{visit.title}</h2>
              <div className={styles.topBarMeta}>
                <span className={styles.plateBadge}>{visit.licensePlate}</span>
                <VisitStatusBadge status={visit.status} />
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрити"
          >
            ×
          </button>
        </header>

        <div className={styles.summaryGrid}>
          <section className={styles.summaryCard}>
            <h3 className={styles.summaryLabel}>Візит</h3>
            <dl className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <dt>СТО</dt>
                <dd>{visit.stoName}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Механік</dt>
                <dd>{visit.mechanicName ?? "Не призначено"}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Початок</dt>
                <dd>{formatVisitDateTime(visit.createdAt)}</dd>
              </div>
              {visit.completedAt ? (
                <div className={styles.summaryRow}>
                  <dt>Завершено</dt>
                  <dd>{formatVisitDateTime(visit.completedAt)}</dd>
                </div>
              ) : visit.updatedAt ? (
                <div className={styles.summaryRow}>
                  <dt>Оновлено</dt>
                  <dd>{formatVisitDateTime(visit.updatedAt)}</dd>
                </div>
              ) : null}
              {visit.description ? (
                <div className={styles.summaryRow}>
                  <dt>Опис</dt>
                  <dd>{visit.description}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className={styles.summaryCard}>
            <h3 className={styles.summaryLabel}>Авто та клієнт</h3>
            <dl className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <dt>Автомобіль</dt>
                <dd>{vehicleTitle}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Номер</dt>
                <dd>{visit.licensePlate}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Клієнт</dt>
                <dd>{visit.clientName}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Телефон</dt>
                <dd>{visit.clientPhone ?? "—"}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className={styles.recordsSection}>
          <h3 className={styles.sectionTitle}>
            Роботи та деталі ({visit.records.length})
          </h3>
          <div className={styles.recordsPanel}>
            <div className={styles.recordsPanelAccent} />
            {visit.records.length > 0 ? (
              <>
                <div className={styles.recordsList}>
                  {visit.records.map((record) => (
                    <div key={record.id} className={styles.recordRow}>
                      <div>
                        <p className={styles.recordTitle}>{record.title}</p>
                        {record.description ? (
                          <p className={styles.recordDescription}>{record.description}</p>
                        ) : null}
                      </div>
                      <p className={styles.recordPrice}>{formatVisitPrice(record.price)}</p>
                    </div>
                  ))}
                </div>
                <div className={styles.totalRow}>
                  <p className={styles.totalLabel}>Загальна сума</p>
                  <p className={styles.totalValue}>{formatVisitPrice(total)}</p>
                </div>
              </>
            ) : (
              <p className={styles.emptyRecords}>Список робіт порожній.</p>
            )}
          </div>
        </section>

        <ActivityLog
          entries={activityEntries}
          hint="Повний життєвий цикл візиту: статуси, кошторис, оплата та завершення"
        />
      </div>
    </Modal>
  );
}
