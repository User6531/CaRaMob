import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useServiceHistoryRecordsQuery,
  useVehicleDetailsQuery,
  useVehicleServiceHistoryQuery,
} from "../../queries";
import type { ServiceVisit } from "../../types/admin";
import {
  formatFuelType,
  formatTransmissionType,
  formatWheelDriveType,
} from "../../utils/vehicleLabels";
import styles from "./VehicleServiceHistoryPage.module.css";

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(price);
}

function ExpandArrowIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`${styles.expandArrowIcon} ${expanded ? styles.expandArrowIconExpanded : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <g transform="translate(4, 7.5)" fill="currentColor">
        <path d="M0.469669914,0.469669914 C0.735936477,0.203403352 1.15260016,0.1791973 1.44621165,0.397051761 L1.53033009,0.469669914 L8,6.939 L14.4696699,0.469669914 C14.7359365,0.203403352 15.1526002,0.1791973 15.4462117,0.397051761 L15.5303301,0.469669914 C15.7965966,0.735936477 15.8208027,1.15260016 15.6029482,1.44621165 L15.5303301,1.53033009 L8.53033009,8.53033009 C8.26406352,8.79659665 7.84739984,8.8208027 7.55378835,8.60294824 L7.46966991,8.53033009 L0.469669914,1.53033009 C0.176776695,1.23743687 0.176776695,0.762563133 0.469669914,0.469669914 Z" />
      </g>
    </svg>
  );
}

function ServiceVisitCard({ visit }: { visit: ServiceVisit }) {
  const [expanded, setExpanded] = useState(false);
  const recordsQuery = useServiceHistoryRecordsQuery(visit.id, expanded);
  const records = recordsQuery.data ?? [];

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>{visit.title}</h2>
          <p className={styles.cardMeta}>
            Створено: {formatDate(visit.createdAt)}
            {visit.updatedAt ? ` • Оновлено: ${formatDate(visit.updatedAt)}` : ""}
          </p>
        </div>
      </div>

      <p className={styles.description}>{visit.description || "Без опису"}</p>

      <div
        className={`${styles.recordsWrapper} ${expanded ? styles.recordsWrapperOpen : ""}`}
      >
        <div className={styles.records}>
          {expanded && recordsQuery.isLoading ? (
            <p className={styles.meta}>Завантаження робіт...</p>
          ) : records.length > 0 ? (
            records.map((record) => (
              <div key={record.id} className={styles.recordRow}>
                <div>
                  <p className={styles.recordTitle}>{record.title}</p>
                  <p className={styles.recordDescription}>
                    {record.description || "Без опису"}
                  </p>
                </div>
                <p className={styles.recordPrice}>{formatPrice(record.price)}</p>
              </div>
            ))
          ) : expanded ? (
            <p className={styles.meta}>Список робіт порожній.</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        className={styles.expandArrow}
        onClick={() => setExpanded((current) => !current)}
        disabled={recordsQuery.isFetching && expanded}
        aria-label={expanded ? "Згорнути роботи" : "Розгорнути роботи"}
        aria-expanded={expanded}
      >
        <ExpandArrowIcon expanded={expanded} />
      </button>
    </article>
  );
}

export function VehicleServiceHistoryPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();

  const vehicleQuery = useVehicleDetailsQuery(vehicleId);
  const visitsQuery = useVehicleServiceHistoryQuery(vehicleId);

  const isLoading = vehicleQuery.isLoading || visitsQuery.isLoading;
  const isError = vehicleQuery.isError || visitsQuery.isError;
  const vehicle = vehicleQuery.data;
  const visits = visitsQuery.data ?? [];

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumbs}>
        <Link to="/vehicles">Авто</Link>
        <span>/</span>
        <span>Історія обслуговування</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>Історія обслуговування авто</h1>
        <p className={styles.subtitle}>Vehicle ID: {vehicleId}</p>
      </header>

      {vehicle ? (
        <section className={styles.vehicleCard}>
          <h2 className={styles.vehicleTitle}>
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </h2>
          <dl className={styles.vehicleGrid}>
            <div>
              <dt>Номер</dt>
              <dd>{vehicle.licensePlate}</dd>
            </div>
            <div>
              <dt>VIN</dt>
              <dd>{vehicle.vin}</dd>
            </div>
            <div>
              <dt>Пальне</dt>
              <dd>{formatFuelType(vehicle.fuelType)}</dd>
            </div>
            <div>
              <dt>КПП</dt>
              <dd>{formatTransmissionType(vehicle.transmissionType)}</dd>
            </div>
            <div>
              <dt>Привід</dt>
              <dd>{formatWheelDriveType(vehicle.wheelDriveType)}</dd>
            </div>
            <div>
              <dt>Колір</dt>
              <dd>{vehicle.color}</dd>
            </div>
            <div>
              <dt>Пробіг</dt>
              <dd>{vehicle.mileage.toLocaleString("uk-UA")} км</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {isLoading ? <p className={styles.meta}>Завантаження...</p> : null}
      {isError ? (
        <p className={styles.error}>Не вдалося завантажити історію обслуговування.</p>
      ) : null}

      {!isLoading && !isError ? (
        <div className={styles.list}>
          {visits.length > 0 ? (
            visits.map((visit) => <ServiceVisitCard key={visit.id} visit={visit} />)
          ) : (
            <div className={styles.empty}>Історія обслуговування поки відсутня.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
