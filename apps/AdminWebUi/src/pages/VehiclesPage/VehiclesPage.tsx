import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { ADMIN_VEHICLES_URL } from "../../config/api";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import styles from "./VehiclesPage.module.css";

interface VehicleListItem {
  id: string;
  ownerUserId?: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  fuelType: string;
  transmissionType: string;
  wheelDriveType: string;
  color: string;
  mileage: number;
  createdAt: string;
}

const FUEL_TYPE_LABELS: Record<string, string> = {
  "0": "Бензин",
  "1": "Дизель",
  "2": "Електро",
  "3": "Гібрид",
  "4": "Плагін-гібрид",
  "5": "Водень",
  Gasoline: "Бензин",
  Diesel: "Дизель",
  Electric: "Електро",
  Hybrid: "Гібрид",
  PlugInHybrid: "Плагін-гібрид",
  Hydrogen: "Водень",
};

const TRANSMISSION_LABELS: Record<string, string> = {
  "0": "Механіка",
  "1": "Автомат",
  "2": "CVT",
  "3": "Робот",
  "4": "DCT",
  Manual: "Механіка",
  Automatic: "Автомат",
  CVT: "CVT",
  SemiAutomatic: "Робот",
  DualClutch: "DCT",
};

const WHEEL_DRIVE_LABELS: Record<string, string> = {
  "0": "Передній",
  "1": "Задній",
  "2": "Повний (AWD)",
  "3": "4x4",
  FWD: "Передній",
  RWD: "Задній",
  AWD: "Повний (AWD)",
  FourWD: "4x4",
};

interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface Filters {
  brand: string;
  model: string;
  vin: string;
  licensePlate: string;
  color: string;
  fuelType: string;
  transmissionType: string;
  wheelDriveType: string;
  yearFrom: string;
  yearTo: string;
}

const PAGE_SIZE = 10;
const EMPTY_FILTERS: Filters = {
  brand: "",
  model: "",
  vin: "",
  licensePlate: "",
  color: "",
  fuelType: "",
  transmissionType: "",
  wheelDriveType: "",
  yearFrom: "",
  yearTo: "",
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function toFuelLabel(value: string): string {
  return FUEL_TYPE_LABELS[value] ?? value;
}

function toTransmissionLabel(value: string): string {
  return TRANSMISSION_LABELS[value] ?? value;
}

function toWheelDriveLabel(value: string): string {
  return WHEEL_DRIVE_LABELS[value] ?? value;
}

export function VehiclesPage() {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const [data, setData] = useState<PagedResult<VehicleListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });

    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value.trim()) {
        params.set(key, value.trim());
      }
    });

    return params.toString();
  }, [page, appliedFilters]);

  const hasPendingFilters =
    JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);

  useEffect(() => {
    if (!session?.internalToken) return;
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${ADMIN_VEHICLES_URL}?${queryString}`, {
          headers: { Authorization: `Bearer ${session.internalToken}` },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as PagedResult<VehicleListItem>;
        setData(payload);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Не вдалося завантажити список авто.");
          setData(null);
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => controller.abort();
  }, [queryString, session?.internalToken]);

  const hasPrev = page > 1;
  const hasNext = (data?.totalPages ?? 0) > page;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Авто</h1>
        <p className={styles.subtitle}>Всі створені авто з фільтрами та пагінацією.</p>
      </header>

      <section className={styles.filters}>
        <Input
          label="Марка"
          value={draftFilters.brand}
          onChange={(e) => {
            setDraftFilters((f) => ({ ...f, brand: e.target.value }));
          }}
        />
        <Input
          label="Модель"
          value={draftFilters.model}
          onChange={(e) => {
            setDraftFilters((f) => ({ ...f, model: e.target.value }));
          }}
        />
        <Input
          label="VIN"
          value={draftFilters.vin}
          onChange={(e) => {
            setDraftFilters((f) => ({ ...f, vin: e.target.value }));
          }}
        />
        <Input
          label="Номер"
          value={draftFilters.licensePlate}
          onChange={(e) => {
            setDraftFilters((f) => ({ ...f, licensePlate: e.target.value }));
          }}
        />
        <Input
          label="Колір"
          value={draftFilters.color}
          onChange={(e) => {
            setDraftFilters((f) => ({ ...f, color: e.target.value }));
          }}
        />
        <Input
          label="Рік від"
          type="number"
          value={draftFilters.yearFrom}
          onChange={(e) => {
            setDraftFilters((f) => ({ ...f, yearFrom: e.target.value }));
          }}
        />
        <Input
          label="Рік до"
          type="number"
          value={draftFilters.yearTo}
          onChange={(e) => {
            setDraftFilters((f) => ({ ...f, yearTo: e.target.value }));
          }}
        />
        <div className={styles.selectField}>
          <label>Пальне</label>
          <select
            value={draftFilters.fuelType}
            onChange={(e) => {
              setDraftFilters((f) => ({ ...f, fuelType: e.target.value }));
            }}
          >
            <option value="">Усі</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="PlugInHybrid">PlugInHybrid</option>
            <option value="Hydrogen">Hydrogen</option>
          </select>
        </div>
        <div className={styles.selectField}>
          <label>КПП</label>
          <select
            value={draftFilters.transmissionType}
            onChange={(e) => {
              setDraftFilters((f) => ({ ...f, transmissionType: e.target.value }));
            }}
          >
            <option value="">Усі</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
            <option value="CVT">CVT</option>
            <option value="SemiAutomatic">SemiAutomatic</option>
            <option value="DualClutch">DualClutch</option>
          </select>
        </div>
        <div className={styles.selectField}>
          <label>Привід</label>
          <select
            value={draftFilters.wheelDriveType}
            onChange={(e) => {
              setDraftFilters((f) => ({ ...f, wheelDriveType: e.target.value }));
            }}
          >
            <option value="">Усі</option>
            <option value="FWD">FWD</option>
            <option value="RWD">RWD</option>
            <option value="AWD">AWD</option>
            <option value="FourWD">FourWD</option>
          </select>
        </div>
        <Button
          onClick={() => {
            setPage(1);
            setAppliedFilters(draftFilters);
          }}
          disabled={!hasPendingFilters}
        >
          Застосувати
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setPage(1);
            setDraftFilters(EMPTY_FILTERS);
            setAppliedFilters(EMPTY_FILTERS);
          }}
        >
          Скинути фільтри
        </Button>
      </section>

      <div className={styles.tableCard}>
        {isLoading ? <p className={styles.meta}>Завантаження...</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {!isLoading && !error ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Марка</th>
                  <th>Модель</th>
                  <th>Рік</th>
                  <th>Номер</th>
                  <th>VIN</th>
                  <th>Пальне</th>
                  <th>КПП</th>
                  <th>Привід</th>
                  <th>Колір</th>
                  <th>Пробіг</th>
                  <th>Створено</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.length ? (
                  data.items.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.brand}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.year}</td>
                      <td>{vehicle.licensePlate}</td>
                      <td>{vehicle.vin}</td>
                      <td>{toFuelLabel(vehicle.fuelType)}</td>
                      <td>{toTransmissionLabel(vehicle.transmissionType)}</td>
                      <td>{toWheelDriveLabel(vehicle.wheelDriveType)}</td>
                      <td>{vehicle.color}</td>
                      <td>{vehicle.mileage}</td>
                      <td>{formatDate(vehicle.createdAt)}</td>
                      <td>
                        {vehicle.ownerUserId ? (
                          <Link className={styles.linkButton} to={`/drivers/${vehicle.ownerUserId}`}>
                            Водій
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className={styles.empty} colSpan={12}>
                      Авто за обраними фільтрами не знайдено.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={styles.footer}>
              <p className={styles.meta}>
                Сторінка {data?.page ?? page} з {data?.totalPages ?? 0} | Всього:{" "}
                {data?.totalItems ?? 0}
              </p>
              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={!hasPrev || isLoading}
                >
                  Назад
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!hasNext || isLoading}
                >
                  Далі
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
