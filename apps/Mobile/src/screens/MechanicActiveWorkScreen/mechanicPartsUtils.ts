import { PartOrderItem, PartOrderStatus } from "../../types/mechanicWork";

export const PART_ORDER_STATUS_LABELS: Record<PartOrderStatus, string> = {
  ordered: "Замовлено",
  in_transit: "В дорозі",
  received: "Отримано",
};

export const PART_ORDER_STATUS_ORDER: PartOrderStatus[] = [
  "ordered",
  "in_transit",
  "received",
];

export function getPartOrderStatusStyle(status: PartOrderStatus): {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
} {
  switch (status) {
    case "received":
      return {
        backgroundColor: "rgba(74, 222, 158, 0.12)",
        borderColor: "rgba(74, 222, 158, 0.25)",
        textColor: "#4ADE9E",
      };
    case "in_transit":
      return {
        backgroundColor: "rgba(163, 113, 247, 0.12)",
        borderColor: "rgba(163, 113, 247, 0.25)",
        textColor: "#A371F7",
      };
    case "ordered":
    default:
      return {
        backgroundColor: "rgba(255, 166, 87, 0.12)",
        borderColor: "rgba(255, 166, 87, 0.25)",
        textColor: "#FFA657",
      };
  }
}

export function createEmptyPartOrder(): PartOrderItem {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: "",
    quantity: "1",
    article: "",
    supplier: "",
    status: "ordered",
  };
}
