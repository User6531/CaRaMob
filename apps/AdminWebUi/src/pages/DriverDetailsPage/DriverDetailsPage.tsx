import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  ADMIN_DRIVER_DETAILS_URL,
  ADMIN_DRIVER_VEHICLES_URL,
} from "../../config/api";
import styles from "./DriverDetailsPage.module.css";

interface DriverDetails {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  pictureUrl?: string;
  providerId: string;
  createdAt: string;
}

interface DriverVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  photoUrl?: string;
}

export function DriverDetailsPage() {
  const { driverId } = useParams<{ driverId: string }>();
  const { session } = useAuth();

  const [driver, setDriver] = useState<DriverDetails | null>(null);
  const [vehicles, setVehicles] = useState<DriverVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!driverId || !session?.internalToken) return;

    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [driverRes, vehiclesRes] = await Promise.all([
          fetch(ADMIN_DRIVER_DETAILS_URL(driverId), {
            headers: { Authorization: `Bearer ${session.internalToken}` },
            signal: controller.signal,
          }),
          fetch(ADMIN_DRIVER_VEHICLES_URL(driverId), {
            headers: { Authorization: `Bearer ${session.internalToken}` },
            signal: controller.signal,
          }),
        ]);

        if (!driverRes.ok || !vehiclesRes.ok) {
          throw new Error(`Driver details load failed (${driverRes.status}, ${vehiclesRes.status})`);
        }

        const driverPayload = (await driverRes.json()) as DriverDetails;
        const vehiclesPayload = (await vehiclesRes.json()) as DriverVehicle[];

        setDriver(driverPayload);
        setVehicles(vehiclesPayload);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Не вдалося завантажити дані водія.");
          setDriver(null);
          setVehicles([]);
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
  }, [driverId, session?.internalToken]);

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumbs}>
        <Link to="/drivers">Водії</Link>
        <span>/</span>
        <span>{driver?.name ?? "Деталі"}</span>
      </nav>

      {isLoading ? <p className={styles.meta}>Завантаження...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      {!isLoading && !error && driver ? (
        <>
          <section className={styles.card}>
            <h1 className={styles.title}>{driver.name}</h1>
            <dl className={styles.details}>
              <div>
                <dt>Email</dt>
                <dd>{driver.email ?? "-"}</dd>
              </div>
              <div>
                <dt>Телефон</dt>
                <dd>{driver.phone ?? "-"}</dd>
              </div>
              <div>
                <dt>Provider</dt>
                <dd>{driver.providerId}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.card}>
            <h2 className={styles.subtitle}>Автомобілі водія</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Марка</th>
                  <th>Модель</th>
                  <th>Рік</th>
                  <th>Номер</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.brand}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.year}</td>
                      <td>{vehicle.licensePlate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className={styles.empty} colSpan={4}>
                      У цього водія поки немає авто.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      ) : null}
    </div>
  );
}
