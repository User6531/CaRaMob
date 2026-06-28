import { ServiceTag } from "../../types/serviceShop";

export const SERVICE_TAG_LABELS: Record<ServiceTag, string> = {
  suspension: "Ремонт ходової",
  engine: "Ремонт двигунів",
  tires: "Шиномонтаж",
  diagnostics: "Діагностика",
  electrical: "Електрика",
  bodywork: "Кузовний ремонт",
  maintenance: "ТО",
  wash: "Мийка",
};

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} м`;
  }
  return `${km.toFixed(1)} км`;
}

export function formatPhoneForDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("380")) {
    return `+38 (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`;
  }
  return phone;
}

export function getServiceInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
