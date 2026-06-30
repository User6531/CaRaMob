import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApprovalRequestCard } from "../ApprovalRequestCard";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { StoVehicleStatusBadge } from "../StoVehicleStatusBadge";
import type {
  StoQueueVehicle,
  StoVehicleApprovalLineItem,
  StoVehicleQueueStatus,
} from "../../types/stoVehicle";
import {
  areLineItemsValid,
  getApprovalsAwaitingClient,
  getApprovalsInReview,
  getInitialStepForVehicle,
  getPendingApprovals,
  getVehicleApprovals,
  isApprovalInManagerReview,
} from "../../utils/stoVehicleApprovals";
import { getStoVehicleStepContent } from "../../utils/stoVehicleStepContent";
import {
  formatStoVehicleTitle,
  getStoVehicleStatusBadgeStyle,
  getVehicleStepPhase,
  STO_VEHICLE_STATUS_LABELS,
  STO_VEHICLE_STATUS_ORDER,
} from "../../utils/stoVehicleLabels";
import styles from "./StoVehicleDetailModal.module.css";

interface StoVehicleDetailModalProps {
  vehicle: StoQueueVehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLineItems: (
    vehicleId: string,
    approvalId: string,
    lineItems: StoVehicleApprovalLineItem[],
  ) => void;
  onSendAllToClient: (vehicleId: string) => void;
  onApproveAllByManager: (vehicleId: string, reason?: string) => void;
  onRejectApproval: (vehicleId: string, approvalId: string, reason: string) => void;
}

function buildDraftsFromVehicle(vehicle: StoQueueVehicle): Record<string, StoVehicleApprovalLineItem[]> {
  return Object.fromEntries(
    getApprovalsInReview(vehicle).map((request) => [
      request.id,
      (request.lineItems ?? []).map((item) => ({ ...item })),
    ]),
  );
}

function areDraftsEqual(
  left: Record<string, StoVehicleApprovalLineItem[]>,
  right: Record<string, StoVehicleApprovalLineItem[]>,
): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;

  return leftKeys.every((key) => JSON.stringify(left[key]) === JSON.stringify(right[key]));
}

export function StoVehicleDetailModal({
  vehicle,
  isOpen,
  onClose,
  onUpdateLineItems,
  onSendAllToClient,
  onApproveAllByManager,
  onRejectApproval,
}: StoVehicleDetailModalProps) {
  const [selectedStep, setSelectedStep] = useState<StoVehicleQueueStatus>("waiting");
  const [drafts, setDrafts] = useState<Record<string, StoVehicleApprovalLineItem[]>>({});
  const [savedDrafts, setSavedDrafts] = useState<Record<string, StoVehicleApprovalLineItem[]>>({});
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [approveReason, setApproveReason] = useState("");
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const stepRefs = useRef<Partial<Record<StoVehicleQueueStatus, HTMLButtonElement | null>>>({});
  const approvalsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!vehicle) return;
    const nextDrafts = buildDraftsFromVehicle(vehicle);
    setDrafts(nextDrafts);
    setSavedDrafts(nextDrafts);
    setSelectedStep(getInitialStepForVehicle(vehicle));
    setShowApproveForm(false);
    setApproveReason("");
    setConfirmApprove(false);
    setSaveMessage(null);
  }, [vehicle?.id]);

  useEffect(() => {
    if (!isOpen || !vehicle) return;
    const initialStep = getInitialStepForVehicle(vehicle);
    const timer = window.setTimeout(() => {
      stepRefs.current[initialStep]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [isOpen, vehicle]);

  const inReviewApprovals = useMemo(
    () => (vehicle ? getApprovalsInReview(vehicle) : []),
    [vehicle],
  );

  const awaitingClientApprovals = useMemo(
    () => (vehicle ? getApprovalsAwaitingClient(vehicle) : []),
    [vehicle],
  );

  const hasUnsavedChanges = useMemo(
    () => !areDraftsEqual(drafts, savedDrafts),
    [drafts, savedDrafts],
  );

  const allDraftsValid = useMemo(
    () => inReviewApprovals.every((request) => areLineItemsValid(drafts[request.id] ?? [])),
    [drafts, inReviewApprovals],
  );

  const handleDraftChange = useCallback((approvalId: string, lineItems: StoVehicleApprovalLineItem[]) => {
    setDrafts((current) => ({ ...current, [approvalId]: lineItems }));
    setSaveMessage(null);
  }, []);

  const handleSave = useCallback(() => {
    if (!vehicle) return;

    for (const request of inReviewApprovals) {
      const lineItems = drafts[request.id];
      if (lineItems) {
        onUpdateLineItems(vehicle.id, request.id, lineItems);
      }
    }

    setSavedDrafts(drafts);
    setSaveMessage("Зміни збережено");
  }, [vehicle, inReviewApprovals, drafts, onUpdateLineItems]);

  const persistDrafts = useCallback(() => {
    if (!vehicle || !hasUnsavedChanges) return;
    for (const request of inReviewApprovals) {
      const lineItems = drafts[request.id];
      if (lineItems) {
        onUpdateLineItems(vehicle.id, request.id, lineItems);
      }
    }
    setSavedDrafts(drafts);
  }, [vehicle, hasUnsavedChanges, inReviewApprovals, drafts, onUpdateLineItems]);

  const handleSendAllToClient = useCallback(() => {
    if (!vehicle || !allDraftsValid) return;
    persistDrafts();
    onSendAllToClient(vehicle.id);
    setSaveMessage(null);
  }, [vehicle, allDraftsValid, persistDrafts, onSendAllToClient]);

  const handleApproveAll = useCallback(() => {
    if (!vehicle || !confirmApprove) return;
    persistDrafts();
    onApproveAllByManager(vehicle.id, approveReason.trim() || undefined);
    setShowApproveForm(false);
    setApproveReason("");
    setConfirmApprove(false);
    setSaveMessage(null);
  }, [vehicle, confirmApprove, approveReason, persistDrafts, onApproveAllByManager]);

  if (!vehicle) return null;

  const vehicleTitle = formatStoVehicleTitle(vehicle.brand, vehicle.model, vehicle.year);
  const selectedPhase = getVehicleStepPhase(selectedStep, vehicle.status);
  const selectedStyle = getStoVehicleStatusBadgeStyle(selectedStep);
  const stepContent = getStoVehicleStepContent(vehicle, selectedStep, selectedPhase);
  const vehicleApprovals = getVehicleApprovals(vehicle);
  const pendingCount = getPendingApprovals(vehicle).length;
  const hasPendingApprovals = pendingCount > 0;

  return (
    <Modal isOpen={isOpen} title="" onClose={onClose} size="large" hideHeader>
      <div className={styles.modalContent}>
        <header className={styles.topBar}>
          <div className={styles.topBarMain}>
            <div className={styles.topBarIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M4 14l1-3h14l1 3v4h-2a2 2 0 1 1-4 0H10a2 2 0 1 1-4 0H4v-4zm2-.5h12l-.4-1.2H6.4L6 13.5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h2 className={styles.topBarTitle}>{vehicleTitle}</h2>
              <div className={styles.topBarMeta}>
                <span className={styles.plateBadge}>{vehicle.licensePlate}</span>
                <StoVehicleStatusBadge status={vehicle.status} />
                {pendingCount > 0 ? (
                  <span className={styles.attentionPill}>
                    Потребує уваги: {pendingCount}
                  </span>
                ) : null}
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
                <dd>
                  {vehicle.brand} {vehicle.model}
                </dd>
              </div>
              {vehicle.year ? (
                <div className={styles.summaryRow}>
                  <dt>Рік</dt>
                  <dd>{vehicle.year}</dd>
                </div>
              ) : null}
              <div className={styles.summaryRow}>
                <dt>Номер</dt>
                <dd>{vehicle.licensePlate}</dd>
              </div>
              {vehicle.problemSummary ? (
                <div className={styles.summaryRow}>
                  <dt>Проблема</dt>
                  <dd>{vehicle.problemSummary}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className={styles.summaryCard}>
            <h3 className={styles.summaryLabel}>Власник</h3>
            <dl className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <dt>Ім'я</dt>
                <dd>{vehicle.clientName}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Телефон</dt>
                <dd>{vehicle.clientPhone ?? "—"}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Механік</dt>
                <dd>{vehicle.mechanicName ?? "Не призначено"}</dd>
              </div>
              {vehicle.isManualEntry ? (
                <div className={styles.summaryRow}>
                  <dt>Джерело</dt>
                  <dd>Додано вручну</dd>
                </div>
              ) : null}
            </dl>
          </section>
        </div>

        <section className={styles.timelineSection}>
          <h3 className={styles.sectionTitle}>Етапи обслуговування</h3>
          <div className={styles.timelineScroll}>
            <div className={styles.timelineTrack}>
              {STO_VEHICLE_STATUS_ORDER.map((step, index) => {
                const phase = getVehicleStepPhase(step, vehicle.status);
                const style = getStoVehicleStatusBadgeStyle(step);
                const isSelected = selectedStep === step;

                return (
                  <div key={step} className={styles.timelineItem}>
                    {index > 0 ? (
                      <div
                        className={[
                          styles.timelineConnector,
                          phase === "upcoming" ? styles.timelineConnectorUpcoming : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={
                          phase !== "upcoming"
                            ? { backgroundColor: style.dotColor }
                            : undefined
                        }
                      />
                    ) : null}
                    <button
                      ref={(node) => {
                        stepRefs.current[step] = node;
                      }}
                      type="button"
                      className={[
                        styles.stepButton,
                        isSelected ? styles.stepButtonSelected : "",
                        phase === "current" ? styles.stepButtonCurrent : "",
                        phase === "completed" ? styles.stepButtonCompleted : "",
                        phase === "upcoming" ? styles.stepButtonUpcoming : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={
                        isSelected || phase === "current"
                          ? {
                              borderColor: style.borderColor,
                              backgroundColor: style.backgroundColor,
                              color: style.textColor,
                            }
                          : phase === "completed"
                            ? {
                                borderColor: style.borderColor,
                                color: style.textColor,
                              }
                            : undefined
                      }
                      onClick={() => setSelectedStep(step)}
                    >
                      <span
                        className={styles.stepDot}
                        style={{ backgroundColor: style.dotColor }}
                      />
                      <span className={styles.stepLabel}>
                        {STO_VEHICLE_STATUS_LABELS[step]}
                      </span>
                      {phase === "completed" ? (
                        <span className={styles.stepCheck} aria-hidden="true">
                          ✓
                        </span>
                      ) : null}
                      {phase === "current" ? (
                        <span className={styles.stepCurrentMark}>зараз</span>
                      ) : null}
                      {pendingCount > 0 ? (
                        <span className={styles.stepApprovalMark} title="Потрібне погодження">
                          !
                        </span>
                      ) : null}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className={styles.stepPanel}
          style={{
            borderColor: selectedStyle.borderColor,
            backgroundColor: `color-mix(in srgb, ${selectedStyle.textColor} 6%, #1a1c1e)`,
          }}
        >
          <div
            className={styles.stepPanelAccent}
            style={{ backgroundColor: selectedStyle.dotColor }}
          />
          <div className={styles.stepPanelBody}>
            <div className={styles.stepPanelHeader}>
              <h3 className={styles.stepPanelTitle} style={{ color: selectedStyle.textColor }}>
                {stepContent.title}
              </h3>
              <span
                className={styles.stepPanelPhase}
                style={{
                  color: selectedStyle.textColor,
                  backgroundColor: selectedStyle.backgroundColor,
                  borderColor: selectedStyle.borderColor,
                }}
              >
                {selectedPhase === "completed"
                  ? "Пройдено"
                  : selectedPhase === "current"
                    ? "Поточний етап"
                    : "Майбутній етап"}
              </span>
            </div>
            <p className={styles.stepPanelDescription}>{stepContent.description}</p>

            {stepContent.items.length > 0 ? (
              <dl className={styles.stepPanelDetails}>
                {stepContent.items.map((item) => (
                  <div key={item.label} className={styles.stepPanelDetailRow}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {stepContent.note ? (
              <p className={styles.stepPanelNote}>{stepContent.note}</p>
            ) : null}

            {vehicleApprovals.length > 0 ? (
              <div ref={approvalsRef} className={styles.approvalsSection}>
                <div className={styles.approvalsHeader}>
                  <h4 className={styles.approvalsTitle}>
                    Погодження
                    {pendingCount > 0 ? (
                      <span className={styles.approvalsPendingCount}>
                        {pendingCount} очікує
                      </span>
                    ) : null}
                  </h4>
                </div>

                {inReviewApprovals.length > 0 ? (
                  <p className={styles.approvalsHint}>
                    Перевірте всі списки, відредагуйте за потреби та збережіть зміни.
                    Після цього надішліть усі запити клієнту або погодьте під свою
                    відповідальність.
                  </p>
                ) : null}

                {awaitingClientApprovals.length > 0 ? (
                  <div className={styles.awaitingBanner}>
                    <p className={styles.awaitingBannerTitle}>
                      {awaitingClientApprovals.length} запит(и) очікують відповіді клієнта
                    </p>
                    <p className={styles.awaitingBannerText}>
                      Надіслано в додаток для {vehicle.clientName}. Якщо клієнт не відповідає —
                      зателефонуйте
                      {vehicle.clientPhone ? ` (${vehicle.clientPhone})` : ""} та узгодьте усно,
                      або відхиліть непотрібні списки.
                    </p>
                  </div>
                ) : null}

                <div className={styles.approvalsList}>
                  {vehicleApprovals.map((request) => {
                    const editable = isApprovalInManagerReview(request);
                    const lineItems = editable
                      ? (drafts[request.id] ?? request.lineItems ?? [])
                      : (request.lineItems ?? []);

                    return (
                      <ApprovalRequestCard
                        key={request.id}
                        request={request}
                        clientName={vehicle.clientName}
                        lineItems={lineItems}
                        editable={editable}
                        onLineItemsChange={(nextItems) => handleDraftChange(request.id, nextItems)}
                        onReject={(reason) => onRejectApproval(vehicle.id, request.id, reason)}
                      />
                    );
                  })}
                </div>

                {hasPendingApprovals ? (
                  <div className={styles.approvalsActions}>
                    {inReviewApprovals.length > 0 ? (
                      <>
                        <Button
                          variant="secondary"
                          onClick={handleSave}
                          disabled={!hasUnsavedChanges}
                        >
                          Зберегти
                        </Button>
                        <Button
                          onClick={handleSendAllToClient}
                          disabled={!allDraftsValid || hasUnsavedChanges}
                        >
                          Надіслати клієнту на погодження
                        </Button>
                      </>
                    ) : null}

                    {!showApproveForm ? (
                      <Button variant="secondary" onClick={() => setShowApproveForm(true)}>
                        Погодити під свою відповідальність
                      </Button>
                    ) : (
                      <div className={styles.approveAllForm}>
                        <p className={styles.approveAllHint}>
                          Усі активні запити будуть погоджені від імені СТО. Використовуйте
                          після усної домовленості з клієнтом або якщо клієнт недоступний.
                        </p>
                        <textarea
                          className={styles.approveAllTextarea}
                          placeholder="Коментар (необов'язково), напр.: погодив по телефону"
                          value={approveReason}
                          onChange={(event) => setApproveReason(event.target.value)}
                          rows={2}
                        />
                        <label className={styles.approveAllConfirm}>
                          <input
                            type="checkbox"
                            checked={confirmApprove}
                            onChange={(event) => setConfirmApprove(event.target.checked)}
                          />
                          <span>Я підтверджую рішення під свою відповідальність</span>
                        </label>
                        <div className={styles.approveAllButtons}>
                          <Button disabled={!confirmApprove} onClick={handleApproveAll}>
                            Підтвердити погодження
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setShowApproveForm(false);
                              setApproveReason("");
                              setConfirmApprove(false);
                            }}
                          >
                            Скасувати
                          </Button>
                        </div>
                      </div>
                    )}

                    {saveMessage ? (
                      <p className={styles.saveMessage}>{saveMessage}</p>
                    ) : null}

                    {inReviewApprovals.length > 0 && hasUnsavedChanges ? (
                      <p className={styles.approvalsActionsNote}>
                        Збережіть зміни перед надсиланням клієнту.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </Modal>
  );
}
