export const formatVisitDate = (isoDate: string) => {
  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return isoDate;
  }

  return parsedDate.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatPrice = (price: number | null | undefined) => {
  if (typeof price !== "number") return null;
  return `${price.toLocaleString("uk-UA")} грн`;
};

export const getRecordsTotalPrice = (
  records: { price?: number | null }[]
): number =>
  records.reduce(
    (sum, record) =>
      typeof record.price === "number" ? sum + record.price : sum,
    0
  );

export function formatVisitCount(count: number): string {
  if (count === 1) return "1 візит";
  if (count >= 2 && count <= 4) return `${count} візити`;
  return `${count} візитів`;
}
