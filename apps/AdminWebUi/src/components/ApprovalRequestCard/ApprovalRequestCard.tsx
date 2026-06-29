import { useState } from "react";
import { Button } from "../Button";
import type {
  StoVehicleApprovalLineItem,
  StoVehicleApprovalRequest,
} from "../../types/stoVehicle";
import {
  APPROVAL_TYPE_LABELS,
  calcApprovalTotal,
  formatPriceUah,
  isApprovalAwaitingClient,
  isApprovalInManagerReview,
} from "../../utils/stoVehicleApprovals";
import { formatEventDateTime } from "../../utils/stoVehicleLabels";
import styles from "./ApprovalRequestCard.module.css";

interface ApprovalRequestCardProps {
  request: StoVehicleApprovalRequest;
  clientName: string;
  managerName?: string;
  lineItems: StoVehicleApprovalLineItem[];
  editable: boolean;
  onLineItemsChange: (lineItems: StoVehicleApprovalLineItem[]) => void;
  onReject: (reason: string) => void;
}

function createLineItemId(): string {
  return `li-${crypto.randomUUID().slice(0, 8)}`;
}

function createEmptyLineItem(): StoVehicleApprovalLineItem {
  return { id: createLineItemId(), title: "", price: 0, quantity: 1 };
}

export function ApprovalRequestCard({
  request,
  clientName,
  managerName = "Менеджер СТО",
  lineItems,
  editable,
  onLineItemsChange,
  onReject,
}: ApprovalRequestCardProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const inReview = isApprovalInManagerReview(request);
  const awaitingClient = isApprovalAwaitingClient(request);
  const isResolved = request.status !== "pending";
  const total = calcApprovalTotal({ ...request, lineItems });

  const updateLineItem = (
    itemId: string,
    patch: Partial<StoVehicleApprovalLineItem>,
  ) => {
    onLineItemsChange(
      lineItems.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );
  };

  const removeLineItem = (itemId: string) => {
    onLineItemsChange(lineItems.filter((item) => item.id !== itemId));
  };

  const addLineItem = () => {
    onLineItemsChange([...lineItems, createEmptyLineItem()]);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(rejectReason.trim());
    setShowRejectForm(false);
    setRejectReason("");
  };

  if (isResolved) {
    return (
      <article
        className={[
          styles.card,
          request.status === "approved" ? styles.cardApproved : styles.cardRejected,
        ].join(" ")}
      >
        <div className={styles.cardHeader}>
          <span className={styles.typeLabel}>{APPROVAL_TYPE_LABELS[request.type]}</span>
          <span
            className={[
              styles.statusChip,
              request.status === "approved" ? styles.statusApproved : styles.statusRejected,
            ].join(" ")}
          >
            {request.status === "approved" ? "Погоджено" : "Відхилено"}
          </span>
        </div>
        <h4 className={styles.title}>{request.title}</h4>
        <p className={styles.meta}>
          {request.approverRole === "manager"
            ? `Погоджено менеджером (${request.approvedByName ?? managerName})`
            : request.approverRole === "client"
              ? `Погоджено клієнтом (${clientName})`
              : `Розглянуто ${request.reviewedAt ? formatEventDateTime(request.reviewedAt) : ""}`}
        </p>
        {request.managerOverrideReason ? (
          <p className={styles.note}>Коментар: {request.managerOverrideReason}</p>
        ) : null}
        {request.rejectionReason ? (
          <p className={styles.noteReject}>Причина відхилення: {request.rejectionReason}</p>
        ) : null}
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.typeLabel}>{APPROVAL_TYPE_LABELS[request.type]}</span>
        <span className={inReview ? styles.statusChipReview : styles.statusChipPending}>
          {inReview ? "На перевірці" : "Очікує клієнта"}
        </span>
      </div>

      <h4 className={styles.title}>{request.title}</h4>
      <p className={styles.description}>{request.description}</p>

      {lineItems.length > 0 ? (
        <div className={styles.itemsTable}>
          {lineItems.map((item) => (
            <div key={item.id} className={styles.itemRow}>
              {editable ? (
                <>
                  <input
                    className={styles.itemInput}
                    value={item.title}
                    placeholder="Назва позиції"
                    onChange={(event) =>
                      updateLineItem(item.id, { title: event.target.value })
                    }
                  />
                  <div className={styles.itemEditControls}>
                    <input
                      className={styles.qtyInput}
                      type="number"
                      min={1}
                      value={item.quantity ?? 1}
                      onChange={(event) =>
                        updateLineItem(item.id, {
                          quantity: Math.max(1, Number(event.target.value) || 1),
                        })
                      }
                      title="Кількість"
                    />
                    <input
                      className={styles.priceInput}
                      type="number"
                      min={0}
                      step={50}
                      value={item.price || ""}
                      placeholder="Ціна"
                      onChange={(event) =>
                        updateLineItem(item.id, {
                          price: Math.max(0, Number(event.target.value) || 0),
                        })
                      }
                    />
                    <button
                      type="button"
                      className={styles.removeItemButton}
                      onClick={() => removeLineItem(item.id)}
                      aria-label="Видалити позицію"
                    >
                      ×
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.itemTitle}>
                    {item.title}
                    {item.quantity && item.quantity > 1 ? ` × ${item.quantity}` : ""}
                  </span>
                  <span className={styles.itemPrice}>
                    {formatPriceUah(item.price * (item.quantity ?? 1))}
                  </span>
                </>
              )}
            </div>
          ))}
          <div className={styles.totalRow}>
            <span>Разом</span>
            <span>{formatPriceUah(total)}</span>
          </div>
        </div>
      ) : null}

      {editable ? (
        <button type="button" className={styles.addItemButton} onClick={addLineItem}>
          + Додати позицію
        </button>
      ) : null}

      <p className={styles.meta}>
        Запит від {request.requestedBy} · {formatEventDateTime(request.createdAt)}
        {awaitingClient && request.sentToClientAt
          ? ` · Надіслано ${formatEventDateTime(request.sentToClientAt)}`
          : ""}
      </p>

      {!showRejectForm ? (
        <Button variant="ghost" className={styles.rejectButton} onClick={() => setShowRejectForm(true)}>
          Відхилити список
        </Button>
      ) : (
        <div className={styles.rejectForm}>
          <p className={styles.rejectFormHint}>
            Список буде скасовано — наприклад, клієнт відмовився від цих робіт або деталей.
          </p>
          <textarea
            className={styles.rejectTextarea}
            placeholder="Причина відхилення *"
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            rows={2}
          />
          <div className={styles.rejectFormActions}>
            <Button variant="secondary" disabled={!rejectReason.trim()} onClick={handleReject}>
              Підтвердити відхилення
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowRejectForm(false);
                setRejectReason("");
              }}
            >
              Скасувати
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
