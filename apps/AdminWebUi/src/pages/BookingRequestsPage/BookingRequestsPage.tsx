import { useMemo, useState } from "react";
import { BookingRequestCard } from "../../components/BookingRequestCard";
import { BookingRequestDetailModal } from "../../components/BookingRequestDetailModal";
import { Select, type SelectOption } from "../../components/Select";
import { useBookingRequests } from "../../context/BookingRequestContext";
import { useStos } from "../../context/StoContext";
import type { BookingRequest, BookingRequestStatus } from "../../types/bookingRequest";
import { BOOKING_STATUS_LABELS } from "../../utils/bookingLabels";
import styles from "./BookingRequestsPage.module.css";

const COLUMN_ORDER: BookingRequestStatus[] = ["pending", "confirmed", "rejected"];

const COLUMN_DESCRIPTIONS: Record<BookingRequestStatus, string> = {
  pending: "Нові запити з мобільного додатку — потребують рішення менеджера",
  confirmed: "Підтверджені записи, авто додані до черги «Записано»",
  rejected: "Відхилені запити з поясненням для водія",
};

interface BookingColumnProps {
  status: BookingRequestStatus;
  requests: BookingRequest[];
  onOpen: (request: BookingRequest) => void;
}

function BookingColumn({ status, requests, onOpen }: BookingColumnProps) {
  const label = BOOKING_STATUS_LABELS[status];

  return (
    <section className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitleRow}>
          <h2 className={styles.columnTitle}>{label}</h2>
          <span className={styles.columnCount}>{requests.length}</span>
        </div>
        <p className={styles.columnDescription}>{COLUMN_DESCRIPTIONS[status]}</p>
      </div>

      <div className={styles.columnCards}>
        {requests.length === 0 ? (
          <div className={styles.emptyColumn}>Немає запитів</div>
        ) : (
          requests.map((request) => (
            <BookingRequestCard key={request.id} request={request} onOpen={onOpen} />
          ))
        )}
      </div>
    </section>
  );
}

export function BookingRequestsPage() {
  const { stos } = useStos();
  const { getRequestsBySto, confirmRequest, rejectRequest } = useBookingRequests();

  const activeStos = useMemo(
    () => stos.filter((sto) => sto.status === "active"),
    [stos],
  );

  const [selectedStoId, setSelectedStoId] = useState(
    () => activeStos[0]?.id ?? stos[0]?.id ?? "",
  );
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);

  const stoOptions: SelectOption[] = useMemo(
    () =>
      (activeStos.length > 0 ? activeStos : stos).map((sto) => ({
        value: sto.id,
        label: sto.name,
      })),
    [activeStos, stos],
  );

  const allRequests = useMemo(
    () => getRequestsBySto(selectedStoId),
    [getRequestsBySto, selectedStoId],
  );

  const requestsByStatus = useMemo(() => {
    const grouped = Object.fromEntries(
      COLUMN_ORDER.map((status) => [status, [] as BookingRequest[]]),
    ) as Record<BookingRequestStatus, BookingRequest[]>;

    for (const request of allRequests) {
      grouped[request.status].push(request);
    }

    for (const status of COLUMN_ORDER) {
      grouped[status].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );
    }

    return grouped;
  }, [allRequests]);

  const detailRequest = useMemo(() => {
    if (!selectedRequest) return null;
    return allRequests.find((request) => request.id === selectedRequest.id) ?? selectedRequest;
  }, [allRequests, selectedRequest]);

  const selectedSto = stos.find((sto) => sto.id === selectedStoId);
  const pendingCount = requestsByStatus.pending.length;

  const handleConfirm = (requestId: string, appointmentAt: string, managerNote?: string) => {
    const updated = confirmRequest(requestId, appointmentAt, managerNote);
    if (updated) {
      setSelectedRequest(updated);
    }
  };

  const handleReject = (requestId: string, reason: string) => {
    rejectRequest(requestId, reason);
    setSelectedRequest((current) =>
      current?.id === requestId
        ? { ...current, status: "rejected", rejectionReason: reason }
        : current,
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Онлайн-записи</h1>
          <p className={styles.subtitle}>
            Запити від водіїв через додаток — підтвердження, час прийому та додавання в чергу
            {selectedSto ? ` · ${selectedSto.name}` : ""}
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.stoSelect}>
            <Select
              label="СТО"
              value={selectedStoId}
              onChange={setSelectedStoId}
              options={stoOptions}
            />
          </div>
        </div>
      </header>

      <div className={styles.stats}>
        <div className={`${styles.statCard} ${pendingCount > 0 ? styles.statCardAttention : ""}`}>
          <span className={styles.statLabel}>Очікують обробки</span>
          <span className={styles.statValue}>{pendingCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Підтверджено</span>
          <span className={styles.statValue}>{requestsByStatus.confirmed.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Відхилено</span>
          <span className={styles.statValue}>{requestsByStatus.rejected.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Всього</span>
          <span className={styles.statValue}>{allRequests.length}</span>
        </div>
      </div>

      <p className={styles.hint}>Натисніть на картку запиту, щоб переглянути деталі та обробити</p>

      <div className={styles.board}>
        {COLUMN_ORDER.map((status) => (
          <BookingColumn
            key={status}
            status={status}
            requests={requestsByStatus[status]}
            onOpen={setSelectedRequest}
          />
        ))}
      </div>

      <BookingRequestDetailModal
        request={detailRequest}
        isOpen={selectedRequest !== null}
        onClose={() => setSelectedRequest(null)}
        onConfirm={handleConfirm}
        onReject={handleReject}
      />
    </div>
  );
}
