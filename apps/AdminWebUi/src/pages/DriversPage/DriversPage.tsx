import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { ADMIN_DRIVERS_URL } from "../../config/api";
import { Button } from "../../components/Button";
import styles from "./DriversPage.module.css";

interface DriverListItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  providerId: string;
  createdAt: string;
}

interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

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

export function DriversPage() {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PagedResult<DriverListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.internalToken) return;

    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${ADMIN_DRIVERS_URL}?page=${page}&pageSize=${PAGE_SIZE}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.internalToken}`,
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as PagedResult<DriverListItem>;
        setData(payload);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError("Не вдалося завантажити список водіїв.");
        setData(null);
        console.error(err);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => controller.abort();
  }, [page, session?.internalToken]);

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

      <div className={styles.tableCard}>
        {isLoading ? <p className={styles.meta}>Завантаження...</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {!isLoading && !error ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ім'я</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Provider</th>
                  <th>Створено</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.length ? (
                  data.items.map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.name}</td>
                      <td>{driver.phone ?? "-"}</td>
                      <td>{driver.email ?? "-"}</td>
                      <td>{driver.providerId}</td>
                      <td>{formatDate(driver.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      Водіїв поки що немає.
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
                  onClick={() => setPage((current) => current - 1)}
                  disabled={!hasPrev || isLoading}
                >
                  Назад
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setPage((current) => current + 1)}
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
