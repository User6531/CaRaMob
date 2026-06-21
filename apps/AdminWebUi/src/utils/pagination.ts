export function totalPages(totalItems: number, pageSize: number): number {
  if (totalItems === 0 || pageSize <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / pageSize);
}
