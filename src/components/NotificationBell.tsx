import Link from "next/link";
import { Bell, Clock, FileText, Pill, AlertTriangle, CalendarClock } from "lucide-react";
import { prisma } from "@/lib/db";
import { canAccessPath } from "@/lib/permissions";
import { vnDayStart } from "@/lib/format";
import type { CurrentStaff } from "@/lib/auth";

// Thông báo suy ra từ dữ liệu thật: hàng chờ, hóa đơn chưa thu, thuốc chờ phát, tồn thấp, lô sắp hết hạn.
export async function NotificationBell({ staff, branchIds }: { staff: CurrentStaff; branchIds: string[] }) {
  if (branchIds.length === 0) return null;
  const can = (p: string) => canAccessPath(staff.role, p);
  const since = vnDayStart();
  const inB = { in: branchIds };
  const [waiting, unpaid, toDispense, lots, items] = await Promise.all([
    can("/kham") ? prisma.visit.count({ where: { branchId: inB, createdAt: { gte: since }, status: "WAITING" } }) : 0,
    can("/thu-ngan") ? prisma.invoice.count({ where: { branchId: inB, status: "UNPAID" } }) : 0,
    can("/duoc") ? prisma.invoice.count({ where: { branchId: inB, status: "PAID", dispensedAt: null, lines: { some: { itemId: { not: null } } } } }) : 0,
    can("/kho") ? prisma.stockLot.findMany({ where: { branchId: inB, qtyRemaining: { gt: 0 } }, select: { itemId: true, qtyRemaining: true, expiryDate: true } }) : [],
    can("/kho") ? prisma.item.findMany({ where: { active: true, minStock: { gt: 0 } }, select: { id: true, minStock: true } }) : [],
  ]);
  const now = Date.now();
  const have = new Map<string, number>();
  let expiring = 0;
  for (const l of lots) {
    if (!l.expiryDate || l.expiryDate.getTime() > now) have.set(l.itemId, (have.get(l.itemId) ?? 0) + l.qtyRemaining);
    if (l.expiryDate && l.expiryDate.getTime() < now + 30 * 86400000) expiring++;
  }
  const low = items.filter((i) => (have.get(i.id) ?? 0) < i.minStock).length;
  const rows = [
    { n: waiting, Icon: Clock, tx: "bệnh nhân đang chờ khám", href: "/kham", c: "text-amber-600 bg-amber-100" },
    { n: unpaid, Icon: FileText, tx: "hóa đơn chờ thu tiền", href: "/thu-ngan", c: "text-rose-600 bg-rose-100" },
    { n: toDispense, Icon: Pill, tx: "đơn chờ phát thuốc", href: "/duoc", c: "text-violet-700 bg-violet-100" },
    { n: low, Icon: AlertTriangle, tx: "mặt hàng dưới mức tối thiểu", href: "/kho?chi=thap", c: "text-red-600 bg-red-100" },
    { n: expiring, Icon: CalendarClock, tx: "lô sắp hoặc đã hết hạn (30 ngày)", href: "/bao-cao", c: "text-amber-700 bg-amber-100" },
  ].filter((r) => r.n > 0);
  const total = rows.reduce((s, r) => s + r.n, 0);
  return (
    <details className="relative">
      <summary className="relative grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full hover:bg-slate-100" title="Thông báo">
        <Bell className="h-5 w-5 text-slate-600" />
        {total > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">{total > 99 ? "99+" : total}</span>}
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
        <div className="px-3 py-2 text-sm font-bold">Thông báo</div>
        {rows.length === 0 && <p className="px-3 pb-3 text-sm text-brand-ink/70">Không có thông báo mới.</p>}
        {rows.map((r) => (
          <Link key={r.href} href={r.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${r.c}`}><r.Icon className="h-4 w-4" /></span>
            <span><b>{r.n}</b> {r.tx}</span>
          </Link>
        ))}
      </div>
    </details>
  );
}
