import { prisma } from "@/lib/db";
import { canAccessPath, hasAny, ITEM_MANAGER_ROLES } from "@/lib/permissions";
import type { CurrentStaff } from "@/lib/auth";

export type Alert = { key: string; level: "red" | "amber"; text: string; href: string; n: number };

// Việc cần xử lý, suy ra từ dữ liệu thật. Đỏ = phải xử lý; vàng = sắp tới hạn / việc đang chờ.
export async function getAlerts(staff: CurrentStaff, branchIds: string[]): Promise<Alert[]> {
  const can = (p: string) => canAccessPath(staff.role, p);
  const out: Alert[] = [];
  const now = new Date();
  const inB = { in: branchIds };

  // phiếu đã cấp số nhưng chưa nhập: dễ bị quên, số vẫn treo
  if (hasAny(staff.roles, ITEM_MANAGER_ROLES) && can("/bieu-mau")) {
    const n = await prisma.voucher.count({ where: { status: "ISSUED" } }).catch(() => 0);
    if (n > 0) out.push({ key: "voucher", level: "red", n, text: `${n} phiếu đã cấp số nhưng chưa nhập. Nhập phiếu hoặc bấm “Hủy phiếu” nếu không dùng nữa`, href: "/bieu-mau#so-phieu" });
  }

  if (branchIds.length && can("/kho")) {
    const [lots, items] = await Promise.all([
      prisma.stockLot.findMany({ where: { branchId: inB, qtyRemaining: { gt: 0 }, expiryDate: { not: null } }, select: { branchId: true, itemId: true, expiryDate: true } }),
      prisma.item.findMany({ where: { active: true, minStock: { gt: 0 } }, select: { id: true, minStock: true } }),
    ]);
    const expired = lots.filter((l) => l.expiryDate && l.expiryDate < now);
    if (expired.length) out.push({ key: "expired", level: "red", n: expired.length, text: `${expired.length} lô thuốc đã hết hạn còn tồn kho. Cần xuất hủy hoặc kiểm tra`, href: `/kho/lo?cn=${expired[0].branchId}&han=het` });
    const soon = lots.filter((l) => l.expiryDate && l.expiryDate >= now && l.expiryDate.getTime() < now.getTime() + 30 * 86400000);
    if (soon.length) out.push({ key: "soon", level: "amber", n: soon.length, text: `${soon.length} lô sắp hết hạn trong 30 ngày`, href: `/kho/lo?cn=${soon[0].branchId}&han=30` });
    const all = await prisma.stockLot.findMany({ where: { branchId: inB, qtyRemaining: { gt: 0 } }, select: { itemId: true, qtyRemaining: true, expiryDate: true } });
    const have = new Map<string, number>();
    for (const l of all) if (!l.expiryDate || l.expiryDate >= now) have.set(l.itemId, (have.get(l.itemId) ?? 0) + l.qtyRemaining);
    const low = items.filter((i) => (have.get(i.id) ?? 0) < i.minStock).length;
    if (low) out.push({ key: "low", level: "red", n: low, text: `${low} mặt hàng dưới mức tồn tối thiểu. Cần nhập thêm`, href: "/kho?chi=thap" });
  }

  if (branchIds.length && can("/thu-ngan")) {
    const n = await prisma.invoice.count({ where: { branchId: inB, status: "UNPAID" } });
    if (n) out.push({ key: "unpaid", level: "amber", n, text: `${n} hóa đơn chờ thu tiền`, href: "/thu-ngan" });
  }
  if (branchIds.length && can("/duoc")) {
    const n = await prisma.invoice.count({ where: { branchId: inB, status: "PAID", dispensedAt: null, lines: { some: { itemId: { not: null } } } } });
    if (n) out.push({ key: "dispense", level: "amber", n, text: `${n} đơn đã thu tiền, chờ phát thuốc`, href: "/duoc" });
  }
  return out;
}
