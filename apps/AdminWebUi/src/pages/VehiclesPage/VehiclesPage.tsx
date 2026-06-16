import { useMemo } from "react";
import { Button } from "../../components/Button";
import {
  DataTable,
  TableActionLink,
  TableActions,
  type DataTableColumn,
} from "../../components/DataTable";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { useVehiclesQuery } from "../../queries";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  applyVehicleFilters,
  resetVehicleFilters,
  setDraftVehicleFilter,
  setVehiclePage,
} from "../../store/slices/vehiclesFiltersSlice";
import type { VehicleListItem } from "../../types/admin";
import type { VehicleFilters } from "../../types/filters";
import {
  formatFuelType,
  formatTransmissionType,
  formatWheelDriveType,
  FUEL_TYPE_FILTER_OPTIONS,
  TRANSMISSION_FILTER_OPTIONS,
  WHEEL_DRIVE_FILTER_OPTIONS,
} from "../../utils/vehicleLabels";
import styles from "./VehiclesPage.module.css";

const PAGE_SIZE = 10;

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

const vehicleColumns: DataTableColumn<VehicleListItem>[] = [
  { key: "brand", header: "Марка", render: (vehicle) => vehicle.brand },
  { key: "model", header: "Модель", render: (vehicle) => vehicle.model },
  { key: "year", header: "Рік", render: (vehicle) => vehicle.year },
  { key: "licensePlate", header: "Номер", render: (vehicle) => vehicle.licensePlate },
  { key: "vin", header: "VIN", render: (vehicle) => vehicle.vin },
  {
    key: "fuelType",
    header: "Пальне",
    render: (vehicle) => formatFuelType(vehicle.fuelType),
  },
  {
    key: "transmissionType",
    header: "КПП",
    render: (vehicle) => formatTransmissionType(vehicle.transmissionType),
  },
  {
    key: "wheelDriveType",
    header: "Привід",
    render: (vehicle) => formatWheelDriveType(vehicle.wheelDriveType),
  },
  { key: "color", header: "Колір", render: (vehicle) => vehicle.color },
  { key: "mileage", header: "Пробіг", render: (vehicle) => vehicle.mileage },
  {
    key: "createdAt",
    header: "Створено",
    render: (vehicle) => formatDate(vehicle.createdAt),
  },
  {
    key: "actions",
    header: "Дії",
    render: (vehicle) =>
      vehicle.ownerUserId ? (
        <TableActions>
          <TableActionLink to={`/drivers/${vehicle.ownerUserId}`}>Водій</TableActionLink>
          <TableActionLink to={`/vehicles/${vehicle.id}/service-history`}>
            Історія
          </TableActionLink>
        </TableActions>
      ) : (
        <TableActionLink to={`/vehicles/${vehicle.id}/service-history`}>
          Історія
        </TableActionLink>
      ),
  },
];

export function VehiclesPage() {
  const dispatch = useAppDispatch();
  const { draftFilters, appliedFilters, page } = useAppSelector(
    (state) => state.vehiclesFilters,
  );

  const listParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      filters: appliedFilters,
    }),
    [appliedFilters, page],
  );

  const { data, isLoading, isError, isFetching } = useVehiclesQuery(listParams);

  const hasPendingFilters =
    JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);

  const hasPrev = page > 1;
  const hasNext = (data?.totalPages ?? 0) > page;

  const setDraftFilter = (key: keyof VehicleFilters, value: string) => {
    dispatch(setDraftVehicleFilter({ key, value }));
  };

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
          onChange={(e) => setDraftFilter("brand", e.target.value)}
        />
        <Input
          label="Модель"
          value={draftFilters.model}
          onChange={(e) => setDraftFilter("model", e.target.value)}
        />
        <Input
          label="VIN"
          value={draftFilters.vin}
          onChange={(e) => setDraftFilter("vin", e.target.value)}
        />
        <Input
          label="Номер"
          value={draftFilters.licensePlate}
          onChange={(e) => setDraftFilter("licensePlate", e.target.value)}
        />
        <Input
          label="Колір"
          value={draftFilters.color}
          onChange={(e) => setDraftFilter("color", e.target.value)}
        />
        <Input
          label="Рік від"
          type="number"
          value={draftFilters.yearFrom}
          onChange={(e) => setDraftFilter("yearFrom", e.target.value)}
        />
        <Input
          label="Рік до"
          type="number"
          value={draftFilters.yearTo}
          onChange={(e) => setDraftFilter("yearTo", e.target.value)}
        />
        <Select
          label="Пальне"
          value={draftFilters.fuelType}
          onChange={(value) => setDraftFilter("fuelType", value)}
          options={FUEL_TYPE_FILTER_OPTIONS}
          placeholder="Усі"
        />
        <Select
          label="КПП"
          value={draftFilters.transmissionType}
          onChange={(value) => setDraftFilter("transmissionType", value)}
          options={TRANSMISSION_FILTER_OPTIONS}
          placeholder="Усі"
        />
        <Select
          label="Привід"
          value={draftFilters.wheelDriveType}
          onChange={(value) => setDraftFilter("wheelDriveType", value)}
          options={WHEEL_DRIVE_FILTER_OPTIONS}
          placeholder="Усі"
        />
        <Button
          onClick={() => dispatch(applyVehicleFilters())}
          disabled={!hasPendingFilters}
        >
          Застосувати
        </Button>
        <Button variant="secondary" onClick={() => dispatch(resetVehicleFilters())}>
          Скинути фільтри
        </Button>
      </section>

      <div className={styles.tableCard}>
        {isLoading ? <p className={styles.meta}>Завантаження...</p> : null}
        {isError ? <p className={styles.error}>Не вдалося завантажити список авто.</p> : null}

        {!isLoading && !isError ? (
          <>
            <DataTable
              columns={vehicleColumns}
              data={data?.items ?? []}
              getRowKey={(vehicle) => vehicle.id}
              emptyMessage="Авто за обраними фільтрами не знайдено."
              minWidth={1020}
            />

            <div className={styles.footer}>
              <p className={styles.meta}>
                Сторінка {data?.page ?? page} з {data?.totalPages ?? 0} | Всього:{" "}
                {data?.totalItems ?? 0}
                {isFetching && !isLoading ? " • Оновлення..." : ""}
              </p>
              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  onClick={() => dispatch(setVehiclePage(page - 1))}
                  disabled={!hasPrev || isFetching}
                >
                  Назад
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => dispatch(setVehiclePage(page + 1))}
                  disabled={!hasNext || isFetching}
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
