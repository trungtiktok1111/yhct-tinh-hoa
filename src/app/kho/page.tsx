import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { branchesFor, input } from "@/lib/stock";
import { STOCK_WRITE_ROLES, ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";
import { dateVN, qty } from "@/lib/format";

export const dynamic = "force-dynamic";

const SOON_DAYS = 90;

export default async function StockPage({ searchParams }: { searchParams: { cn?: string; q?: string; chi?: string } }) {
  const staff = await requireStaff();
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  const q = searchParams.q?.trim();
  const onlyLow = searchParams.chi === "thap";

  const canWrite = hasAny(staff.roles, STOCK_WRITE_ROLES);
  const canManage = hasAny(staff.roles, ITEM_MANAGER_ROLES);

  if (!branch) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold font-display">Kho và giá</h1>
        <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>
      </div>
    );
  }

  const [items, lots] = await Promise.all([
    prisma.item.findMany({
      where: { active: true, ...(q ? { name: { contains: q, mode: "insensitive" } } : {}) },
      orderBy: { name: "asc" },
      include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 1 } },
    }),
    prisma.stockLot.findMany({
      where: { branchId: branch.id, qtyRemaining: { gt: 0 } },
      select: { itemId: true, qtyRemaining: true, expiryDate: true },
    }),
  ]);

  const now = Date.now();
  const soon = now + SOON_DAYS * 86400000;
  const agg = new Map<string, { total: number; expired: number; soon: number; nearest?: Date }>();
  for (const l of lots) {
    const a = agg.get(l.itemId) ?? { total: 0, expired: 0, soon: 0 };
    a.total += l.qtyRemaining;
    if (l.expiryDate) {
      const t = l.expiryDate.getTime();
      if (t < now) a.expired += l.qtyRemaining;
      else if (t < soon) a.soon += l.qtyRemaining;
      if (!a.nearest || l.expiryDate < a.nearest) a.nearest = l.expiryDate;
    }
    agg.set(l.itemId, a);
  }

  const rows = items
    .map((it) => {
      const a = agg.get(it.id) ?? { total: 0, expired: 0, soon: 0 };
      return { it, a, low: it.minStock > 0 && a.total < it.minStock };
    })
    .filter((r) => !onlyLow || r.low);
  const lowCount = items.filter((it) => it.minStock > 0 && (agg.get(it.id)?.total ?? 0) < it.minStock).length;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold font-display">Kho và giá</h1>

      <div className="flex flex-wrap gap-2">
        {canWrite && <Link href="/kho/nhap" className="rounded-lg bg-brand-deep text-brand-cream px-4 py-2.5 font-semibold">Nhập kho</Link>}
        {canWrite && <Link href="/kho/dieu-chinh" className="rounded-lg border border-brand-gold/50 px-4 py-2.5">Điều chỉnh / kiểm kê</Link>}
        <Link href="/kho/mat-hang" className="rounded-lg border border-brand-gold/50 px-4 py-2.5">
          {canManage ? "Mặt hàng và giá" : "Bảng giá"}
        </Link>
      </div>

      <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end" method="get">
        <label className="text-sm">
          Chi nhánh
          <select name="cn" defaultValue={branch.id} className={input}>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label className="text-sm">
          Tìm mặt hàng
          <input name="q" defaultValue={q} placeholder="Tên..." className={input} />
        </label>
        <div className="flex items-center gap-3">
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" name="chi" value="thap" defaultChecked={onlyLow} className="h-5 w-5" /> Chỉ sắp hết
          </label>
          <button type="submit" className="rounded-lg border border-brand-gold/50 px-4 py-2.5">Lọc</button>
        </div>
      </form>

      {lowCount > 0 && !onlyLow && (
        <div className="warn-box text-sm">{lowCount} mặt hàng dưới mức tồn tối thiểu tại {branch.name}.</div>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-gray-600">
            Chưa có mặt hàng nào. {canManage ? "Vào “Mặt hàng và giá” để thêm." : "Nhờ quản lý thêm mặt hàng."}
          </p>
        )}
        {rows.map(({ it, a, low }) => (
          <div key={it.id} className="card !py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-semibold">
                {it.name}{" "}
                <span className="text-xs text-gray-500">({it.type === "HERB" ? "dược liệu" : "thành phẩm"})</span>
              </div>
              <div className="text-xs text-gray-600 space-x-2">
                {a.expired > 0 && <span className="text-red-700 font-semibold">Hết hạn: {qty(a.expired)}{it.unit}</span>}
                {a.soon > 0 && <span className="text-amber-700">Sắp hết hạn (≤{SOON_DAYS} ngày): {qty(a.soon)}{it.unit}</span>}
                {a.nearest && <span>Hạn gần nhất: {dateVN(a.nearest)}</span>}
                {it.minStock > 0 && <span>Tối thiểu: {qty(it.minStock)}{it.unit}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold tabular-nums ${low ? "text-red-700" : ""}`}>
                {qty(a.total)} {it.unit}
              </div>
              {low && <div className="text-xs text-red-700 font-semibold">Sắp hết</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
