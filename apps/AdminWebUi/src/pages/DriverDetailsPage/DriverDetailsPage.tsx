import { Link, useParams } from "react-router-dom";
import {
  DataTable,
  TableActionLink,
  type DataTableColumn,
} from "../../components/DataTable";
import { useDriverDetailsQuery, useDriverVehiclesQuery } from "../../queries";
import type { DriverVehicle } from "../../types/admin";
import styles from "./DriverDetailsPage.module.css";

const vehicleColumns: DataTableColumn<DriverVehicle>[] = [
  { key: "brand", header: "Марка", render: (vehicle) => vehicle.brand },
  { key: "model", header: "Модель", render: (vehicle) => vehicle.model },
  { key: "year", header: "Рік", render: (vehicle) => vehicle.year },
  { key: "licensePlate", header: "Номер", render: (vehicle) => vehicle.licensePlate },
  {
    key: "actions",
    header: "Дії",
    render: (vehicle) => (
      <TableActionLink to={`/vehicles/${vehicle.id}/service-history`}>
        Історія
      </TableActionLink>
    ),
  },
];

export function DriverDetailsPage() {
  const { driverId } = useParams<{ driverId: string }>();

  const driverQuery = useDriverDetailsQuery(driverId);
  const vehiclesQuery = useDriverVehiclesQuery(driverId);

  const isLoading = driverQuery.isLoading || vehiclesQuery.isLoading;
  const isError = driverQuery.isError || vehiclesQuery.isError;
  const driver = driverQuery.data;
  const vehicles = vehiclesQuery.data ?? [];

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumbs}>
        <Link to="/drivers">Водії</Link>
        <span>/</span>
        <span>{driver?.name ?? "Деталі"}</span>
      </nav>

      {isLoading ? <p className={styles.meta}>Завантаження...</p> : null}
      {isError ? <p className={styles.error}>Не вдалося завантажити дані водія.</p> : null}

      {!isLoading && !isError && driver ? (
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
            <DataTable
              columns={vehicleColumns}
              data={vehicles}
              getRowKey={(vehicle) => vehicle.id}
              emptyMessage="У цього водія поки немає авто."
            />
          </section>
        </>
      ) : null}
    </div>
  );
}
