import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "../../components/DataTable";
import { Select, type SelectOption } from "../../components/Select";
import { VisitDetailModal } from "../../components/VisitDetailModal";
import { VisitStatusBadge } from "../../components/VisitStatusBadge";
import { useStos } from "../../context/StoContext";
import { MOCK_VISITS } from "../../data/mockVisits";
import type { VisitListItem, VisitStatus } from "../../types/visit";
import {
  calcVisitTotal,
  formatVisitDate,
  formatVisitPrice,
  formatVisitTitle,
  VISIT_STATUS_LABELS,
} from "../../utils/visitLabels";
import styles from "./VisitsPage.module.css";

const VISIT_COLUMNS: DataTableColumn<VisitListItem>[] = [
    {
      key: "createdAt",
      header: "Дата",
      render: (visit) => formatVisitDate(visit.createdAt),
    },
    {
      key: "vehicle",
      header: "Автомобіль",
      render: (visit) => (
        <>
          <div>{formatVisitTitle(visit.brand, visit.model, visit.year)}</div>
          <span className={styles.plateCell}>{visit.licensePlate}</span>
        </>
      ),
    },
    {
      key: "client",
      header: "Клієнт",
      render: (visit) => visit.clientName,
    },
    {
      key: "title",
      header: "Візит",
      render: (visit) => visit.title,
    },
    {
      key: "sto",
      header: "СТО",
      render: (visit) => visit.stoName,
    },
    {
      key: "mechanic",
      header: "Механік",
      render: (visit) => visit.mechanicName ?? "—",
    },
    {
      key: "status",
      header: "Статус",
      render: (visit) => <VisitStatusBadge status={visit.status} />,
    },
    {
      key: "total",
      header: "Сума",
      render: (visit) => (
        <span className={styles.amountCell}>{formatVisitPrice(calcVisitTotal(visit.records))}</span>
      ),
    },
  ];

function countByStatus(visits: VisitListItem[], status: VisitStatus): number {
  return visits.filter((visit) => visit.status === status).length;
}

export function VisitsPage() {
  const { stos } = useStos();
  const [selectedStoId, setSelectedStoId] = useState("all");
  const [selectedVisit, setSelectedVisit] = useState<VisitListItem | null>(null);

  const activeStos = useMemo(
    () => stos.filter((sto) => sto.status === "active"),
    [stos],
  );

  const stoOptions: SelectOption[] = useMemo(
    () => [
      { value: "all", label: "Усі СТО" },
      ...(activeStos.length > 0 ? activeStos : stos).map((sto) => ({
        value: sto.id,
        label: sto.name,
      })),
    ],
    [activeStos, stos],
  );

  const visits = useMemo(() => {
    const sorted = [...MOCK_VISITS].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
    if (selectedStoId === "all") return sorted;
    return sorted.filter((visit) => visit.stoId === selectedStoId);
  }, [selectedStoId]);

  const columns = VISIT_COLUMNS;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Візити</h1>
          <p className={styles.subtitle}>
            Усі візити клієнтів на СТО — перегляд деталей, робіт та сум
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
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Всього</span>
          <span className={styles.statValue}>{visits.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{VISIT_STATUS_LABELS.in_progress}</span>
          <span className={styles.statValue}>{countByStatus(visits, "in_progress")}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{VISIT_STATUS_LABELS.waiting_payment}</span>
          <span className={styles.statValue}>{countByStatus(visits, "waiting_payment")}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{VISIT_STATUS_LABELS.completed}</span>
          <span className={styles.statValue}>{countByStatus(visits, "completed")}</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <p className={styles.hint}>Натисніть на рядок, щоб відкрити деталі візиту</p>
        <DataTable
          columns={columns}
          data={visits}
          getRowKey={(visit) => visit.id}
          emptyMessage="Візитів за обраним СТО не знайдено."
          minWidth={980}
          onRowClick={setSelectedVisit}
        />
      </div>

      <VisitDetailModal
        visit={selectedVisit}
        isOpen={selectedVisit !== null}
        onClose={() => setSelectedVisit(null)}
      />
    </div>
  );
}
