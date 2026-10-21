import { prisma } from "@/lib/db";
import { branchFilter, type CurrentStaff } from "@/lib/auth";

export async function branchesFor(staff: CurrentStaff) {
  return prisma.branch.findMany({
    where: { active: true, ...branchFilter(staff) },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });
}

export const UNITS = ["viên", "hộp", "chai", "lọ", "gói", "túi", "tuýp"];
export const input = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";
export const btn = "bg-brand-deep hover:bg-brand-deeper text-brand-cream rounded-lg px-4 py-2.5 font-semibold";

// Mã hàng tự tăng: VT001 (vị thuốc), TP001 (thành phẩm).
export async function nextItemCode(type: string) {
  const prefix = type === "HERB" ? "VT" : "TP";
  const rows = await prisma.item.findMany({ where: { code: { startsWith: prefix } }, select: { code: true } });
  let max = 0;
  for (const r of rows) {
    const n = parseInt((r.code ?? "").slice(prefix.length), 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}
