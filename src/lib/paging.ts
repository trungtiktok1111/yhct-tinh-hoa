export const PAGE_SIZE = 40;
export function pageOf(v?: string): number {
  const n = parseInt(v ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
