import type {
  BookingRequestStatus,
  PartsOption,
  TimeSlotId,
  VisitReasonId,
} from "../types/bookingRequest";

export const VISIT_REASON_LABELS: Record<VisitReasonId, string> = {
  maintenance: "Регулярне ТО",
  suspension: "Ходова та підвіска",
  diagnostics: "Діагностика / Електрика",
  other: "Інше / Складна поломка",
};

export const TIME_SLOT_LABELS: Record<TimeSlotId, string> = {
  morning: "Ранок",
  day: "День",
  evening: "Вечір",
};

export const TIME_SLOT_RANGES: Record<TimeSlotId, string> = {
  morning: "09:00 – 13:00",
  day: "13:00 – 17:00",
  evening: "17:00 – 19:00",
};

export const PARTS_OPTION_LABELS: Record<PartsOption, string> = {
  shop: "Запчастини від СТО",
  own: "Свої запчастини",
};

export const BOOKING_STATUS_LABELS: Record<BookingRequestStatus, string> = {
  pending: "Очікує обробки",
  confirmed: "Підтверджено",
  rejected: "Відхилено",
};

export function formatPreferredSlot(date: string, slot: TimeSlotId): string {
  const formattedDate = new Intl.DateTimeFormat("uk-UA", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));

  return `${formattedDate}, ${TIME_SLOT_LABELS[slot]} (${TIME_SLOT_RANGES[slot]})`;
}

export function buildProblemSummary(
  visitReason: VisitReasonId,
  problemDescription: string,
): string {
  return `${VISIT_REASON_LABELS[visitReason]}: ${problemDescription}`;
}

export function suggestedAppointmentIso(date: string, slot: TimeSlotId): string {
  const hour = slot === "morning" ? 11 : slot === "day" ? 15 : 18;
  const local = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`);
  return local.toISOString();
}

export function toDatetimeLocalValue(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

export function formatBookingDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}
