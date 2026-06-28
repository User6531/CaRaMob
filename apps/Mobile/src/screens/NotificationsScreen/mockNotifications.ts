import { AppNotification } from "../../types/notification";

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const daysAgo = (days: number, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 30, 0, 0);
  return date.toISOString();
};

const monthsAgo = (months: number, day = 12) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  date.setDate(day);
  date.setHours(9, 15, 0, 0);
  return date.toISOString();
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "service_status",
    title: "Ремонт оновлено",
    body: "СТО «AutoPro» перевело ваше авто на етап «Діагностика».",
    receivedAt: hoursAgo(1),
    isRead: false,
  },
  {
    id: "n2",
    type: "service_reminder",
    title: "Нагадування про ТО",
    body: "Через 500 км рекомендовано замінити мастило для Toyota Camry.",
    receivedAt: hoursAgo(4),
    isRead: false,
  },
  {
    id: "n3",
    type: "history",
    title: "Новий запис в історії",
    body: "Додано візит «Bosch Service» на суму 4 200 грн.",
    receivedAt: hoursAgo(9),
    isRead: false,
  },
  {
    id: "n4",
    type: "promo",
    title: "Знижка 15% на діагностику",
    body: "СТО «Майстер+» пропонує знижку до кінця тижня.",
    receivedAt: daysAgo(1, 18),
    isRead: true,
  },
  {
    id: "n5",
    type: "system",
    title: "Профіль оновлено",
    body: "Ваші контактні дані успішно збережено.",
    receivedAt: daysAgo(2, 11),
    isRead: true,
  },
  {
    id: "n6",
    type: "service_status",
    title: "Кошторис готовий",
    body: "Перегляньте та підтвердіть кошторис ремонту в розділі «Статус».",
    receivedAt: daysAgo(4, 14),
    isRead: true,
  },
  {
    id: "n7",
    type: "service_reminder",
    title: "Страховка закінчується",
    body: "ОСЦПВ для Volkswagen Golf діє ще 14 днів.",
    receivedAt: daysAgo(8, 9),
    isRead: true,
  },
  {
    id: "n8",
    type: "history",
    title: "Запис відредаговано",
    body: "Оновлено візит «ТО 90 000 км» у вашій історії обслуговування.",
    receivedAt: daysAgo(12, 16),
    isRead: true,
  },
  {
    id: "n9",
    type: "promo",
    title: "Новий сервіс поруч",
    body: "Відкрився автосервіс «DriveFix» за 1,2 км від вас.",
    receivedAt: monthsAgo(1, 20),
    isRead: true,
  },
  {
    id: "n10",
    type: "system",
    title: "Ласкаво просимо до CARa",
    body: "Додайте автомобіль у гараж, щоб почати відстежувати обслуговування.",
    receivedAt: monthsAgo(2, 5),
    isRead: true,
  },
];
