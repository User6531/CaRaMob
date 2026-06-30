import { AutoServiceShop } from "../../types/serviceShop";

export const MOCK_MY_SERVICES: AutoServiceShop[] = [
  {
    id: "svc-1",
    name: "АвтоМайстер",
    logoUrl:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1625047509248-ec889cbff12f?w=800&h=400&fit=crop",
    address: "вул. Січових Стрільців, 21",
    city: "Київ",
    phone: "+380501234567",
    isOpen: true,
    workingHours: {
      weekdays: "09:00–19:00",
      saturday: "10:00–16:00",
      sunday: "Вихідний",
    },
    tags: ["maintenance", "diagnostics", "suspension", "engine"],
    socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      telegram: "https://t.me",
    },
    visitCount: 7,
    isSubscribed: true,
    rating: 4.8,
    description:
      "Сучасний автосервіс повного циклу. Діагностика, ТО, ремонт ходової та двигунів. Працюємо з 2012 року, гарантія на всі види робіт.",
  },
  {
    id: "svc-2",
    name: "ProDrive СТО",
    logoUrl:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=200&h=200&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&h=400&fit=crop",
    address: "просп. Перемоги, 67",
    city: "Київ",
    phone: "+380672345678",
    isOpen: false,
    workingHours: {
      weekdays: "08:30–20:00",
      saturday: "09:00–18:00",
      sunday: "Вихідний",
    },
    tags: ["tires", "suspension", "electrical", "wash"],
    socialLinks: {
      instagram: "https://instagram.com",
      website: "https://example.com",
    },
    visitCount: 3,
    isSubscribed: true,
    rating: 4.5,
    description:
      "Спеціалізуємось на шиномонтажі та ходовій частині. Сучасне обладнання для балансування та розвал-сходження.",
  },
  {
    id: "svc-3",
    name: "МоторЛюкс",
    logoUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=400&fit=crop",
    address: "вул. Борщагівська, 154",
    city: "Київ",
    phone: "+380933456789",
    isOpen: true,
    workingHours: {
      weekdays: "09:00–18:00",
      saturday: "10:00–15:00",
      sunday: "Вихідний",
    },
    tags: ["engine", "diagnostics", "maintenance"],
    socialLinks: {
      telegram: "https://t.me",
      facebook: "https://facebook.com",
    },
    visitCount: 1,
    isSubscribed: false,
    rating: 4.2,
    description:
      "Ремонт двигунів будь-якої складності. Капітальний та поточний ремонт, заміна ГРМ, діагностика комп'ютером.",
  },
];

export const MOCK_NEARBY_SERVICES: AutoServiceShop[] = [
  {
    id: "nearby-1",
    name: "Швидкий Сервіс",
    logoUrl:
      "https://images.unsplash.com/photo-1615904657976-1e2e0b0b0e0e?w=200&h=200&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=400&fit=crop",
    address: "вул. Дегтярівська, 5",
    city: "Київ",
    phone: "+380441112233",
    isOpen: true,
    workingHours: {
      weekdays: "08:00–21:00",
      saturday: "09:00–19:00",
      sunday: "10:00–17:00",
    },
    tags: ["maintenance", "wash", "tires"],
    socialLinks: {
      instagram: "https://instagram.com",
    },
    distanceKm: 0.8,
    rating: 4.3,
    description: "Експрес-ТО, мийка, шиномонтаж. Без запису, швидке обслуговування.",
  },
  {
    id: "nearby-2",
    name: "AutoExpert",
    logoUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&h=400&fit=crop",
    address: "вул. Володимирська, 45",
    city: "Київ",
    phone: "+380504445566",
    isOpen: true,
    workingHours: {
      weekdays: "09:00–19:00",
      saturday: "10:00–16:00",
      sunday: "Вихідний",
    },
    tags: ["diagnostics", "electrical", "engine", "bodywork"],
    socialLinks: {
      website: "https://example.com",
      telegram: "https://t.me",
    },
    distanceKm: 1.4,
    rating: 4.6,
    description:
      "Повний спектр послуг: від діагностики до кузовного ремонту. Сертифіковані майстри.",
  },
  {
    id: "nearby-3",
    name: "Колесо+",
    logoUrl:
      "https://images.unsplash.com/photo-1597868165956-03a6827955f1?w=200&h=200&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=400&fit=crop",
    address: "вул. Салютна, 2Б",
    city: "Київ",
    phone: "+380677778899",
    isOpen: false,
    workingHours: {
      weekdays: "08:00–20:00",
      saturday: "08:00–20:00",
      sunday: "09:00–15:00",
    },
    tags: ["tires", "suspension"],
    socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    distanceKm: 2.1,
    rating: 4.1,
    description: "Шиномонтаж, балансування, розвал-сходження. Зберігання шин.",
  },
  {
    id: "nearby-4",
    name: "ЕлектроАвто",
    logoUrl:
      "https://images.unsplash.com/photo-1599305445779-7760e21d5c97?w=200&h=200&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=400&fit=crop",
    address: "вул. Мечникова, 14",
    city: "Київ",
    phone: "+380631234567",
    isOpen: true,
    workingHours: {
      weekdays: "10:00–19:00",
      saturday: "10:00–17:00",
      sunday: "Вихідний",
    },
    tags: ["electrical", "diagnostics"],
    socialLinks: {
      telegram: "https://t.me",
    },
    distanceKm: 3.5,
    rating: 4.7,
    description:
      "Спеціалізація на електрообладнанні та діагностиці. Ремонт генераторів, стартерів, проводки.",
  },
  {
    id: "nearby-5",
    name: "КузовПро",
    logoUrl:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=200&h=200&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1615904657976-1e2e0b0b0e0e?w=800&h=400&fit=crop",
    address: "вул. Новокостянтинівська, 15",
    city: "Київ",
    phone: "+380509876543",
    isOpen: true,
    workingHours: {
      weekdays: "09:00–18:00",
      saturday: "10:00–15:00",
      sunday: "Вихідний",
    },
    tags: ["bodywork", "wash"],
    socialLinks: {
      instagram: "https://instagram.com",
      website: "https://example.com",
    },
    distanceKm: 4.2,
    rating: 4.4,
    description: "Кузовний ремонт, фарбування, полірування. Підбір фарби за VIN-кодом.",
  },
];

export const ALL_MOCK_SERVICES: AutoServiceShop[] = [
  ...MOCK_MY_SERVICES,
  ...MOCK_NEARBY_SERVICES,
];

export function getServiceById(id: string): AutoServiceShop | undefined {
  return ALL_MOCK_SERVICES.find((service) => service.id === id);
}
