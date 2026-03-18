// Тип для одного запису історії обслуговування (поки API недоступне)
export interface ServiceHistoryItem {
  id: string;
  title: string;
  date: string; // DD.MM.YY
  description: string;
  avatarUrl?: string | null;
}

// Сухі дані для рендеру блоку "Історія обслуговування"
export const MOCK_SERVICE_HISTORY: ServiceHistoryItem[] = [
  {
    id: "1",
    title: "Автосервіс Львів",
    date: "15.06.25",
    description: "Заміна форсунок",
  },
  {
    id: "2",
    title: "Автосервіс Львів",
    date: "07.02.25",
    description: "Діагностика та ремонт гальмівної системи",
  },
  {
    id: "3",
    title: "Автосервіс Львів",
    date: "11.10.24",
    description: "Комп'ютерна діагностика двигуна",
  },
];
