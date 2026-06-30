import type { ComponentProps } from "react";
import { Feather } from "@expo/vector-icons";
import { PartsOption, TimeSlotId, VisitReasonId } from "../../types/serviceBooking";

export interface VisitReasonOption {
  id: VisitReasonId;
  icon: ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
}

export const VISIT_REASON_OPTIONS: VisitReasonOption[] = [
  {
    id: "maintenance",
    icon: "settings",
    title: "Регулярне ТО",
    subtitle: "Мастило, фільтри, колодки · 30–40 хв",
  },
  {
    id: "suspension",
    icon: "activity",
    title: "Ходова та підвіска",
    subtitle: "Стук, веде вбік, розвал-сходження",
  },
  {
    id: "diagnostics",
    icon: "cpu",
    title: "Діагностика / Електрика",
    subtitle: "Чек, не вмикається, троїть двигун",
  },
  {
    id: "other",
    icon: "alert-circle",
    title: "Інше / Складна поломка",
    subtitle: "Нестандартний ремонт або кілька систем",
  },
];

export interface TimeSlotOption {
  id: TimeSlotId;
  label: string;
  range: string;
}

export const TIME_SLOT_OPTIONS: TimeSlotOption[] = [
  { id: "morning", label: "Ранок", range: "09:00 – 13:00" },
  { id: "day", label: "День", range: "13:00 – 17:00" },
  { id: "evening", label: "Вечір", range: "17:00 – 19:00" },
];

export interface PartsOptionConfig {
  id: PartsOption;
  title: string;
  subtitle: string;
}

export const PARTS_OPTIONS: PartsOptionConfig[] = [
  {
    id: "shop",
    title: "Запчастини потрібні від СТО",
    subtitle: "Менеджер перевірить наявність за VIN до дзвінка",
  },
  {
    id: "own",
    title: "Приїду зі своїми запчастинами",
    subtitle: "Ви надаєте деталі самостійно",
  },
];

export const BOOKING_DAYS_AHEAD = 14;
