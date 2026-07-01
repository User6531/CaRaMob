import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { BookingStatusBadge } from "../BookingStatusBadge";
import type { BookingRequest } from "../../types/bookingRequest";
import {
  formatBookingDateTime,
  formatPreferredSlot,
  fromDatetimeLocalValue,
  PARTS_OPTION_LABELS,
  suggestedAppointmentIso,
  toDatetimeLocalValue,
  VISIT_REASON_LABELS,
} from "../../utils/bookingLabels";
import { formatEventDateTime, formatStoVehicleTitle } from "../../utils/stoVehicleLabels";
import styles from "./BookingRequestDetailModal.module.css";

interface BookingRequestDetailModalProps {
  request: BookingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (requestId: string, appointmentAt: string, managerNote?: string) => void;
  onReject: (requestId: string, reason: string) => void;
}

export function BookingRequestDetailModal({
  request,
  isOpen,
  onClose,
  onConfirm,
  onReject,
}: BookingRequestDetailModalProps) {
  const [appointmentLocal, setAppointmentLocal] = useState("");
  const [managerNote, setManagerNote] = useState("");
  const [appointmentError, setAppointmentError] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!request) return;
    const suggested = suggestedAppointmentIso(request.preferredDate, request.preferredTimeSlot);
    setAppointmentLocal(toDatetimeLocalValue(suggested));
    setManagerNote("");
    setAppointmentError(null);
    setShowRejectForm(false);
    setRejectReason("");
    setSuccessMessage(null);
  }, [request?.id]);

  if (!request) return null;

  const vehicleTitle = formatStoVehicleTitle(request.brand, request.model, request.year);
  const preferredSlot = formatPreferredSlot(request.preferredDate, request.preferredTimeSlot);
  const isPending = request.status === "pending";

  const handleConfirm = () => {
    if (!appointmentLocal) {
      setAppointmentError("Вкажіть дату та час запису на СТО");
      return;
    }

    setAppointmentError(null);
    onConfirm(request.id, fromDatetimeLocalValue(appointmentLocal), managerNote);
    setSuccessMessage("Запис підтверджено. Авто додано до черги зі статусом «Записано».");
    setShowRejectForm(false);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(request.id, rejectReason.trim());
    setShowRejectForm(false);
  };

  return (
    <Modal isOpen={isOpen} title="" onClose={onClose} size="large" hideHeader>
      <div className={styles.modalContent}>
        <header className={styles.topBar}>
          <div className={styles.topBarMain}>
            <div className={styles.topBarIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14v11z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h2 className={styles.topBarTitle}>Онлайн-запис</h2>
              <div className={styles.topBarMeta}>
                <span className={styles.plateBadge}>{request.licensePlate}</span>
                <BookingStatusBadge status={request.status} />
                <span className={styles.sourcePill}>Додаток водія</span>
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
            <h3 className={styles.summaryLabel}>Автомобіль</h3>
            <dl className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <dt>Марка / модель</dt>
                <dd>{vehicleTitle}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Номер</dt>
                <dd>{request.licensePlate}</dd>
              </div>
              {request.vin ? (
                <div className={styles.summaryRow}>
                  <dt>VIN</dt>
                  <dd>{request.vin}</dd>
                </div>
              ) : null}
              <div className={styles.summaryRow}>
                <dt>Запчастини</dt>
                <dd>{PARTS_OPTION_LABELS[request.partsOption]}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.summaryCard}>
            <h3 className={styles.summaryLabel}>Водій</h3>
            <dl className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <dt>Ім'я</dt>
                <dd>{request.clientName}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Телефон</dt>
                <dd>{request.clientPhone ?? "—"}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Надіслано</dt>
                <dd>{formatEventDateTime(request.createdAt)}</dd>
              </div>
              {request.attachmentsCount ? (
                <div className={styles.summaryRow}>
                  <dt>Медіа</dt>
                  <dd>{request.attachmentsCount} фото/відео від водія</dd>
                </div>
              ) : null}
            </dl>
          </section>
        </div>

        <section className={styles.problemSection}>
          <h3 className={styles.sectionTitle}>Опис проблеми</h3>
          <div className={styles.problemCard}>
            <span className={styles.reasonBadge}>
              {VISIT_REASON_LABELS[request.visitReason]}
            </span>
            <p className={styles.problemText}>{request.problemDescription}</p>
          </div>
        </section>

        <section className={styles.schedulingSection}>
          <h3 className={styles.sectionTitle}>Планування візиту</h3>

          {request.attachmentsCount ? (
            <p className={styles.attachmentsNote}>
              Водій додав {request.attachmentsCount} медіафайл(ів) до запиту. Перегляд вкладень
              буде доступний після підключення API.
            </p>
          ) : null}

          <div className={styles.schedulingGrid}>
            <div className={styles.preferenceCard}>
              <h4 className={styles.cardTitle}>Зручний час для водія</h4>
              <p className={styles.preferenceValue}>{preferredSlot}</p>
              <p className={styles.preferenceHint}>
                Врахуйте побажання клієнта при підтвердженні запису
              </p>
            </div>

            <div className={styles.confirmCard}>
              <h4 className={styles.cardTitle}>Реальний час на СТО</h4>
              {isPending ? (
                <>
                  <input
                    type="datetime-local"
                    className={styles.datetimeInput}
                    value={appointmentLocal}
                    onChange={(event) => {
                      setAppointmentLocal(event.target.value);
                      setAppointmentError(null);
                    }}
                  />
                  {appointmentError ? (
                    <p className={styles.fieldError}>{appointmentError}</p>
                  ) : null}
                  <textarea
                    className={styles.noteTextarea}
                    placeholder="Коментар менеджера (необов'язково), напр.: підтвердив по телефону"
                    value={managerNote}
                    onChange={(event) => setManagerNote(event.target.value)}
                    rows={2}
                  />
                </>
              ) : request.managerAppointmentAt ? (
                <p className={styles.preferenceValue}>
                  {formatBookingDateTime(request.managerAppointmentAt)}
                </p>
              ) : (
                <p className={styles.preferenceHint}>Час запису не вказано</p>
              )}
            </div>
          </div>

          {isPending ? (
            <div className={styles.actions}>
              <Button onClick={handleConfirm}>Підтвердити та додати в чергу</Button>
              {!showRejectForm ? (
                <Button variant="secondary" onClick={() => setShowRejectForm(true)}>
                  Відхилити запит
                </Button>
              ) : (
                <div className={styles.rejectForm}>
                  <p className={styles.rejectHint}>
                    Вкажіть причину відхилення — водій побачить її в додатку
                  </p>
                  <textarea
                    className={styles.noteTextarea}
                    placeholder="Причина відхилення"
                    value={rejectReason}
                    onChange={(event) => setRejectReason(event.target.value)}
                    rows={2}
                  />
                  <div className={styles.actions}>
                    <Button
                      variant="secondary"
                      onClick={handleReject}
                      disabled={!rejectReason.trim()}
                    >
                      Підтвердити відхилення
                    </Button>
                    <Button variant="ghost" onClick={() => setShowRejectForm(false)}>
                      Скасувати
                    </Button>
                  </div>
                </div>
              )}
              {successMessage ? (
                <p className={styles.successMessage}>
                  {successMessage}{" "}
                  <Link to="/sto/queue">Перейти до черги СТО →</Link>
                </p>
              ) : null}
            </div>
          ) : (
            <div className={styles.resolvedBanner}>
              {request.status === "confirmed" ? (
                <>
                  <p className={styles.resolvedTitle}>Запис підтверджено</p>
                  <p className={styles.resolvedText}>
                    {request.managerAppointmentAt
                      ? `Прийом заплановано на ${formatBookingDateTime(request.managerAppointmentAt)}.`
                      : "Авто додано до черги СТО."}
                    {request.managerNote ? ` ${request.managerNote}` : ""}
                    {request.queueVehicleId ? (
                      <>
                        {" "}
                        <Link to="/sto/queue">Відкрити чергу СТО →</Link>
                      </>
                    ) : null}
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.resolvedTitle}>Запит відхилено</p>
                  <p className={styles.resolvedText}>
                    {request.rejectionReason ?? "Причину не вказано."}
                  </p>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}
