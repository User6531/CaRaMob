import { useCallback, useMemo, useState, type FormEvent } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import { Select, type SelectOption } from "../../components/Select";
import { useStoVehicles } from "../../context/StoVehicleContext";
import { useStos } from "../../context/StoContext";
import { useDragToScroll } from "../../hooks/useDragToScroll";
import type {
  CreateStoQueueVehiclePayload,
  StoQueueVehicle,
  StoVehicleQueueStatus,
} from "../../types/stoVehicle";
import {
  STO_VEHICLE_STATUS_LABELS,
  STO_VEHICLE_STATUS_ORDER,
} from "../../utils/stoVehicleLabels";
import { StoQueueColumn, StoQueueStatCard } from "./StoQueueColumn";
import { StoVehicleDetailModal } from "../../components/StoVehicleDetailModal";
import styles from "./StoQueuePage.module.css";

const STATUS_OPTIONS: SelectOption[] = STO_VEHICLE_STATUS_ORDER.map((status) => ({
  value: status,
  label: STO_VEHICLE_STATUS_LABELS[status],
}));

const EMPTY_FORM: Omit<CreateStoQueueVehiclePayload, "stoId"> = {
  brand: "",
  model: "",
  licensePlate: "",
  clientName: "",
  clientPhone: "",
  problemSummary: "",
  status: "waiting",
  appointmentAt: "",
};

type FormState = Omit<CreateStoQueueVehiclePayload, "stoId">;

export function StoQueuePage() {
  const { stos } = useStos();
  const {
    getVehiclesBySto,
    addVehicle,
    updateVehicleStatus,
    mechanics,
    assignMechanic,
    resolveApprovalRequest,
    updateApprovalLineItems,
    sendAllApprovalsToClient,
    approveAllApprovalsByManager,
  } = useStoVehicles();

  const activeStos = useMemo(
    () => stos.filter((sto) => sto.status === "active"),
    [stos],
  );

  const [selectedStoId, setSelectedStoId] = useState(
    () => activeStos[0]?.id ?? stos[0]?.id ?? "",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [collapsedColumns, setCollapsedColumns] = useState<Set<StoVehicleQueueStatus>>(
    () => new Set(),
  );
  const [selectedVehicle, setSelectedVehicle] = useState<StoQueueVehicle | null>(null);

  const queueScrollRef = useDragToScroll<HTMLDivElement>(styles.queueScrollDragging);

  const toggleColumnCollapsed = useCallback((status: StoVehicleQueueStatus) => {
    setCollapsedColumns((current) => {
      const next = new Set(current);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  const stoOptions: SelectOption[] = useMemo(
    () =>
      (activeStos.length > 0 ? activeStos : stos).map((sto) => ({
        value: sto.id,
        label: sto.name,
      })),
    [activeStos, stos],
  );

  const vehicles = useMemo(
    () => getVehiclesBySto(selectedStoId),
    [getVehiclesBySto, selectedStoId],
  );

  const detailVehicle = useMemo(() => {
    if (!selectedVehicle) return null;
    return vehicles.find((vehicle) => vehicle.id === selectedVehicle.id) ?? selectedVehicle;
  }, [vehicles, selectedVehicle]);

  const vehiclesByStatus = useMemo(() => {
    const grouped = Object.fromEntries(
      STO_VEHICLE_STATUS_ORDER.map((status) => [status, [] as typeof vehicles]),
    ) as Record<StoVehicleQueueStatus, typeof vehicles>;

    for (const vehicle of vehicles) {
      grouped[vehicle.status].push(vehicle);
    }

    for (const status of STO_VEHICLE_STATUS_ORDER) {
      grouped[status].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }

    return grouped;
  }, [vehicles]);

  const selectedSto = stos.find((sto) => sto.id === selectedStoId);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.brand.trim()) nextErrors.brand = "Вкажіть марку";
    if (!form.model.trim()) nextErrors.model = "Вкажіть модель";
    if (!form.licensePlate.trim()) nextErrors.licensePlate = "Вкажіть номер";
    if (!form.clientName.trim()) nextErrors.clientName = "Вкажіть ім'я клієнта";
    if (form.status === "scheduled" && !form.appointmentAt) {
      nextErrors.appointmentAt = "Вкажіть дату та час запису";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate() || !selectedStoId) return;

    addVehicle({
      stoId: selectedStoId,
      brand: form.brand,
      model: form.model,
      year: form.year,
      licensePlate: form.licensePlate,
      clientName: form.clientName,
      clientPhone: form.clientPhone,
      problemSummary: form.problemSummary,
      status: form.status,
      appointmentAt:
        form.status === "scheduled" && form.appointmentAt
          ? new Date(form.appointmentAt).toISOString()
          : undefined,
    });

    closeModal();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Черга СТО</h1>
          <p className={styles.subtitle}>
            Автомобілі клієнтів на стоянці — від запису до видачі
            {selectedSto ? ` · ${selectedSto.name}` : ""}
          </p>
        </div>

        <div className={styles.headerActions}>
          {stoOptions.length > 1 ? (
            <div className={styles.stoSelect}>
              <Select
                label="СТО"
                value={selectedStoId}
                onChange={setSelectedStoId}
                options={stoOptions}
              />
            </div>
          ) : null}
          <Button onClick={() => setIsModalOpen(true)}>+ Додати авто</Button>
        </div>
      </header>

      <p className={styles.dragHint}>Перетягніть борд мишею для горизонтальної прокрутки</p>

      <div ref={queueScrollRef} className={styles.queueScroll}>
        <div className={styles.queueInner}>
          <div className={styles.stats}>
            {STO_VEHICLE_STATUS_ORDER.map((status) => (
              <StoQueueStatCard
                key={status}
                status={status}
                count={vehiclesByStatus[status].length}
                isCollapsed={collapsedColumns.has(status)}
                onToggleCollapse={() => toggleColumnCollapsed(status)}
              />
            ))}
          </div>

          <div className={styles.board}>
            {STO_VEHICLE_STATUS_ORDER.map((status) => (
              <StoQueueColumn
                key={status}
                status={status}
                vehicles={vehiclesByStatus[status]}
                isCollapsed={collapsedColumns.has(status)}
                onToggleCollapse={() => toggleColumnCollapsed(status)}
                onStatusChange={updateVehicleStatus}
                mechanics={mechanics}
                onAssignMechanic={assignMechanic}
                onVehicleOpen={setSelectedVehicle}
              />
            ))}
          </div>
        </div>
      </div>

      <StoVehicleDetailModal
        vehicle={detailVehicle}
        isOpen={selectedVehicle !== null}
        onClose={() => setSelectedVehicle(null)}
        onUpdateLineItems={updateApprovalLineItems}
        onSendAllToClient={sendAllApprovalsToClient}
        onApproveAllByManager={approveAllApprovalsByManager}
        onRejectApproval={(vehicleId, approvalId, reason) =>
          resolveApprovalRequest(vehicleId, approvalId, "rejected", {
            rejectionReason: reason,
          })
        }
      />

      <Modal isOpen={isModalOpen} title="Додати автомобіль" onClose={closeModal}>
        <p className={styles.modalHint}>
          Додайте авто, якого ще немає в базі продукту — наприклад, клієнт приїхав без
          попереднього запису через додаток.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <Input
              label="Марка *"
              placeholder="Toyota"
              value={form.brand}
              onChange={(event) =>
                setForm((current) => ({ ...current, brand: event.target.value }))
              }
              error={errors.brand}
            />
            <Input
              label="Модель *"
              placeholder="Camry"
              value={form.model}
              onChange={(event) =>
                setForm((current) => ({ ...current, model: event.target.value }))
              }
              error={errors.model}
            />
          </div>

          <div className={styles.formRow}>
            <Input
              label="Рік"
              type="number"
              placeholder="2019"
              min={1980}
              max={new Date().getFullYear() + 1}
              value={form.year ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  year: event.target.value ? Number(event.target.value) : undefined,
                }))
              }
            />
            <Input
              label="Номерний знак *"
              placeholder="AA 1234 BC"
              value={form.licensePlate}
              onChange={(event) =>
                setForm((current) => ({ ...current, licensePlate: event.target.value }))
              }
              error={errors.licensePlate}
            />
          </div>

          <div className={styles.formRow}>
            <Input
              label="Ім'я клієнта *"
              placeholder="Олександр Коваленко"
              value={form.clientName}
              onChange={(event) =>
                setForm((current) => ({ ...current, clientName: event.target.value }))
              }
              error={errors.clientName}
            />
            <Input
              label="Телефон"
              placeholder="+380 XX XXX XXXX"
              value={form.clientPhone ?? ""}
              onChange={(event) =>
                setForm((current) => ({ ...current, clientPhone: event.target.value }))
              }
            />
          </div>

          <Input
            label="Опис проблеми"
            placeholder="Стук у підвісці, заміна масла..."
            value={form.problemSummary ?? ""}
            onChange={(event) =>
              setForm((current) => ({ ...current, problemSummary: event.target.value }))
            }
          />

          <div className={styles.formRow}>
            <Select
              label="Статус *"
              value={form.status}
              onChange={(status) =>
                setForm((current) => ({
                  ...current,
                  status: status as StoVehicleQueueStatus,
                }))
              }
              options={STATUS_OPTIONS}
            />
            {form.status === "scheduled" ? (
              <Input
                label="Дата та час запису *"
                type="datetime-local"
                value={form.appointmentAt ?? ""}
                onChange={(event) =>
                  setForm((current) => ({ ...current, appointmentAt: event.target.value }))
                }
                error={errors.appointmentAt}
              />
            ) : null}
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Скасувати
            </Button>
            <Button type="submit">Додати</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
