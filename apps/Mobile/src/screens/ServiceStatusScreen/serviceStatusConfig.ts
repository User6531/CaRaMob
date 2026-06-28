import { ServiceStatusId } from "../../types/serviceStatus";

export interface ServiceStatusStepConfig {
  id: ServiceStatusId;
  emoji: string;
  title: string;
  shortTitle: string;
}

export const SERVICE_STATUS_STEPS: ServiceStatusStepConfig[] = [
  {
    id: "received",
    emoji: "📥",
    title: "Прийнято на сервіс",
    shortTitle: "Прийнято",
  },
  {
    id: "diagnostics",
    emoji: "🔍",
    title: "Діагностика",
    shortTitle: "Діагностика",
  },
  {
    id: "approval",
    emoji: "📝",
    title: "Погодження",
    shortTitle: "Кошторис",
  },
  {
    id: "in_progress",
    emoji: "🔧",
    title: "У роботі",
    shortTitle: "Ремонт",
  },
  {
    id: "quality_check",
    emoji: "🧼",
    title: "Фінальна перевірка",
    shortTitle: "Контроль",
  },
  {
    id: "ready",
    emoji: "🏁",
    title: "Готово до видачі",
    shortTitle: "Готово",
  },
];

export function getStatusIndex(status: ServiceStatusId): number {
  return SERVICE_STATUS_STEPS.findIndex((step) => step.id === status);
}

export function getStatusProgress(status: ServiceStatusId): number {
  const index = getStatusIndex(status);
  if (index < 0) return 0;
  return Math.round((index / (SERVICE_STATUS_STEPS.length - 1)) * 100);
}

export function getStatusContextMessage(
  status: ServiceStatusId,
  currentWork?: string
): string {
  switch (status) {
    case "received":
      return "Машину прийнято на СТО. Авто на парковці сервісу й чекає на початок робіт.";
    case "diagnostics":
      return "Майстер проводить огляд. Очікуйте на результати та кошторис.";
    case "approval":
      return "Діагностику завершено. Перегляньте перелік робіт і затвердіть кошторис.";
    case "in_progress":
      return currentWork
        ? `Зараз виконується: ${currentWork}`
        : "Механіки виконують погоджені роботи.";
    case "quality_check":
      return "Ремонт завершено. Проводиться тестовий виїзд, перевірка та підготовка авто.";
    case "ready":
      return "Ваш автомобіль готовий! Можна забирати.";
    default:
      return "";
  }
}
