import { useMemo } from "react";
import { Button } from "../../components/Button";
import {
  DataTable,
  TableActionLink,
  type DataTableColumn,
} from "../../components/DataTable";
import { Input } from "../../components/Input";
import { useDriversQuery } from "../../queries";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  applyDriverFilters,
  resetDriverFilters,
  setDraftDriverFilter,
  setDriverPage,
} from "../../store/slices/driversFiltersSlice";
import type { DriverListItem } from "../../types/admin";
import styles from "./DriversPage.module.css";

const PAGE_SIZE = 10;

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

const driverColumns: DataTableColumn<DriverListItem>[] = [
  { key: "name", header: "Ім'я", render: (driver) => driver.name },
  { key: "phone", header: "Телефон", render: (driver) => driver.phone ?? "-" },
  { key: "email", header: "Email", render: (driver) => driver.email ?? "-" },
  { key: "providerId", header: "Provider", render: (driver) => driver.providerId },
  {
    key: "createdAt",
    header: "Створено",
    render: (driver) => formatDate(driver.createdAt),
  },
  {
    key: "actions",
    header: "Дії",
    render: (driver) => (
      <TableActionLink to={`/drivers/${driver.id}`}>Деталі</TableActionLink>
    ),
  },
];

export function DriversPage() {
  const dispatch = useAppDispatch();
  const { draftFilters, appliedFilters, page } = useAppSelector(
    (state) => state.driversFilters,
  );

  const listParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      filters: appliedFilters,
    }),
    [appliedFilters, page],
  );

  const { data, isLoading, isError, isFetching } = useDriversQuery(listParams);

  const hasPendingFilters =
    JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);

  const hasPrev = page > 1;
  const hasNext = useMemo(
    () => (data?.totalPages ?? 0) > page,
    [data?.totalPages, page],
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Водії</h1>
        <p className={styles.subtitle}>
          Список усіх водіїв, які зареєструвалися через мобільний застосунок.
        </p>
      </header>

      <section className={styles.filters}>
        <Input
          label="Ім'я"
          value={draftFilters.name}
          onChange={(event) =>
            dispatch(setDraftDriverFilter({ key: "name", value: event.target.value }))
          }
        />
        <Input
          label="Телефон"
          value={draftFilters.phone}
          onChange={(event) =>
            dispatch(setDraftDriverFilter({ key: "phone", value: event.target.value }))
          }
        />
        <Input
          label="Email"
          value={draftFilters.email}
          onChange={(event) =>
            dispatch(setDraftDriverFilter({ key: "email", value: event.target.value }))
          }
        />
        <Input
          label="Provider"
          value={draftFilters.providerId}
          onChange={(event) =>
            dispatch(
              setDraftDriverFilter({ key: "providerId", value: event.target.value }),
            )
          }
        />
        <Input
          label="Створено від"
          type="date"
          value={draftFilters.createdFrom}
          onChange={(event) =>
            dispatch(
              setDraftDriverFilter({ key: "createdFrom", value: event.target.value }),
            )
          }
        />
        <Input
          label="Створено до"
          type="date"
          value={draftFilters.createdTo}
          onChange={(event) =>
            dispatch(setDraftDriverFilter({ key: "createdTo", value: event.target.value }))
          }
        />
        <Button
          onClick={() => dispatch(applyDriverFilters())}
          disabled={!hasPendingFilters}
        >
          Застосувати
        </Button>
        <Button variant="secondary" onClick={() => dispatch(resetDriverFilters())}>
          Скинути фільтри
        </Button>
      </section>

      <div className={styles.tableCard}>
        {isLoading ? <p className={styles.meta}>Завантаження...</p> : null}
        {isError ? <p className={styles.error}>Не вдалося завантажити список водіїв.</p> : null}

        {!isLoading && !isError ? (
          <>
            <DataTable
              columns={driverColumns}
              data={data?.items ?? []}
              getRowKey={(driver) => driver.id}
              emptyMessage="Водіїв поки що немає."
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
                  onClick={() => dispatch(setDriverPage(page - 1))}
                  disabled={!hasPrev || isFetching}
                >
                  Назад
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => dispatch(setDriverPage(page + 1))}
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
