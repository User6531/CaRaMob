import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import { StatusBadge } from "../../components/StatusBadge";
import { usePermissions } from "../../auth/AuthContext";
import { Permission } from "../../auth/permissions";
import { useStos } from "../../context/StoContext";
import type { CreateStoPayload } from "../../types/sto";
import styles from "./StoListPage.module.css";

const EMPTY_FORM: CreateStoPayload = {
  name: "",
  address: "",
  phone: "",
  email: "",
};

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function StoListPage() {
  const { stos, addSto } = useStos();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(Permission.StoCreate);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<CreateStoPayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateStoPayload, string>>>(
    {},
  );

  const sortedStos = useMemo(
    () =>
      [...stos].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [stos],
  );

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof CreateStoPayload, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Вкажіть назву СТО";
    }
    if (!form.address.trim()) {
      nextErrors.address = "Вкажіть адресу";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    addSto(form);
    closeModal();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Станції технічного обслуговування</h1>
          <p className={styles.subtitle}>
            Керування акаунтами клієнтів — створення та перегляд СТО
          </p>
        </div>

        {canCreate ? (
          <Button onClick={() => setIsModalOpen(true)}>+ Додати СТО</Button>
        ) : null}
      </header>

      {sortedStos.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>СТО ще немає</p>
          <p className={styles.emptyText}>
            Створіть перше СТО, щоб клієнт міг почати роботу в системі.
          </p>
          {canCreate ? (
            <Button onClick={() => setIsModalOpen(true)}>Додати перше СТО</Button>
          ) : null}
        </div>
      ) : (
        <div className={styles.grid}>
          {sortedStos.map((sto) => (
            <article key={sto.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{sto.name}</h2>
                <StatusBadge status={sto.status} />
              </div>

              <dl className={styles.details}>
                <div className={styles.detailRow}>
                  <dt>Адреса</dt>
                  <dd>{sto.address}</dd>
                </div>
                {sto.phone ? (
                  <div className={styles.detailRow}>
                    <dt>Телефон</dt>
                    <dd>{sto.phone}</dd>
                  </div>
                ) : null}
                {sto.email ? (
                  <div className={styles.detailRow}>
                    <dt>Email</dt>
                    <dd>{sto.email}</dd>
                  </div>
                ) : null}
                <div className={styles.detailRow}>
                  <dt>Створено</dt>
                  <dd>{formatDate(sto.createdAt)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} title="Нове СТО" onClose={closeModal}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Назва СТО *"
            placeholder="Наприклад, AutoService Kyiv"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            error={errors.name}
          />
          <Input
            label="Адреса *"
            placeholder="Місто, вулиця, будинок"
            value={form.address}
            onChange={(event) =>
              setForm((current) => ({ ...current, address: event.target.value }))
            }
            error={errors.address}
          />
          <Input
            label="Телефон"
            placeholder="+380 XX XXX XXXX"
            value={form.phone ?? ""}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
          />
          <Input
            label="Email"
            type="email"
            placeholder="contact@sto.ua"
            value={form.email ?? ""}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />

          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Скасувати
            </Button>
            <Button type="submit">Створити СТО</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
