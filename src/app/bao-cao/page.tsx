import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { REPORT_ROLES } from "@/lib/permissions";
import { branchesFor, input } from "@/lib/stock";
import { dateVN, qty as fq, vnd } from "@/lib/format";

export const dynamic = "force-dynamic";

const METHOD: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };
const DAY = 86400000;
const vnDate = (d: Date) => new Date(d.getTime() + 7 * 3600000).toISOString().slice(0, 10);
const okDate = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v)) ? v : undefined);

export default async function ReportPage({ searchParams }: { searchParams: { cn?: string; tu?: string; den?: string } }) {
  const staff = await requireRole(...REPORT_ROLES);
  const branches = await branchesFor(staff);
  const today = vnDate(new Date());
  const to = okDate(searchParams.den) ?? today;
  let from = okDate(searchParams.tu) ?? vnDate(new Date(Date.now() - 6 * DAY));
  if (from > to) from = to;
  const start = new Date(`${from}T00:00:00+07:00`);
  const end = new Date(new Date(`${to}T00:00:00+07:00`).getTime() + DAY);
  const chosen = branches.find((b) => b.id === searchParams.cn);
  const branchIds = chosen ? [chosen.id] : branches.map((b) => b.id);
  if (branchIds.length === 0) return <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào.</div>;

  const [paid, voided, visitGroups, lines, items, lots] = await Promise.all([
    prisma.invoice.findMany({
      where: { branchId: { in: branchIds }, status: "PAID", paidAt: { gte: start, lt: end } },
      select: { paidAt: true, total: true, method: true, kind: true, discount: true },
    }),
    prisma.invoice.count({ where: { branchId: { in: branchIds }, status: "VOID", createdAt: { gte: start, lt: end } } }),
    prisma.visit.groupBy({ by: ["status"], where: { branchId: { in: branchIds }, createdAt: { gte: start, lt: end } }, _count: true }),
    prisma.invoiceLine.findMany({
      where: { itemId: { not: null }, invoice: { branchId: { in: branchIds }, status: "PAID", paidAt: { gte: start, lt: end } } },
      select: { itemId: true, name: true, unit: true, qty: true, amount: true, kind: true },
    }),
    prisma.item.findMany({ where: { active: true, minStock: { gt: 0 } }, select: { id: true, name: true, unit: true, minStock: true } }),
    prisma.stockLot.findMany({
      where: { branchId: { in: branchIds }, qtyRemaining: { gt: 0 } },
      select: { itemId: true, branchId: true, qtyRemaining: true, expiryDate: true, item: { select: { name: true, unit: true } }, branch: { select: { name: true } } },
    }),
  ]);

  const total = paid.reduce((s, i) => s + i.total, 0);
  const byMethod = new Map<string, number>();
  const byKind = new Map<string, { n: number; sum: number }>();
  const byDay = new Map<string, { n: number; sum: number }>();
  for (const i of paid) {
    byMethod.set(i.method ?? "?", (byMethod.get(i.method ?? "?") ?? 0) + i.total);
    const k = byKind.get(i.kind) ?? { n: 0, sum: 0 }; k.n++; k.sum += i.total; byKind.set(i.kind, k);
    const d = vnDate(i.paidAt as Date); const e = byDay.get(d) ?? { n: 0, sum: 0 }; e.n++; e.sum += i.total; byDay.set(d, e);
  }
  const days: string[] = [];
  for (let t = start.getTime(); t < end.getTime() && days.length < 400; t += DAY) days.push(vnDate(new Date(t)));
  const maxDay = Math.max(1, ...days.map((d) => byDay.get(d)?.sum ?? 0));

  const top = new Map<string, { name: string; unit: string; qty: number; sum: number }>();
  for (const l of lines) {
    const e = top.get(l.itemId as string) ?? { name: l.name.replace(/ \(.*thang\)$/, ""), unit: l.unit, qty: 0, sum: 0 };
    e.qty += l.qty; e.sum += l.amount; top.set(l.itemId as string, e);
  }
  const topList = [...top.values()].sort((a, b) => b.sum - a.sum).slice(0, 15);

  const visitCount = (s: string) => visitGroups.find((g) => g.status === s)?._count ?? 0;
  const visitTotal = visitGroups.reduce((s, g) => s + g._count, 0);

  const stockByItem = new Map<string, number>();
  for (const l of lots) if (!l.expiryDate || l.expiryDate > new Date()) stockByItem.set(l.itemId, (stockByItem.get(l.itemId) ?? 0) + l.qtyRemaining);
  const low = items
    .map((i) => ({ ...i, have: (stockByItem.get(i.id) ?? 0) / 1 }))
    .filter((i) => i.have < i.minStock)
    .sort((a, b) => a.have / a.minStock - b.have / b.minStock)
    .slice(0, 30);
  const soon = new Date(Date.now() + 30 * DAY);
  const expiring = lots
    .filter((l) => l.expiryDate && l.expiryDate <= soon)
    .sort((a, b) => (a.expiryDate as Date).getTime() - (b.expiryDate as Date).getTime())
    .slice(0, 30);

  const card = "card !py-3";
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold font-display">Báo cáo</h1>
      <form method="get" className="flex flex-wrap items-end gap-2">
        <label className="text-sm">Chi nhánh
          <select name="cn" defaultValue={chosen?.id ?? ""} className={input}>
            <option value="">Tất cả ({branches.length})</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label className="text-sm">Từ ngày<input type="date" name="tu" defaultValue={from} className={input} /></label>
        <label className="text-sm">Đến ngày<input type="date" name="den" defaultValue={to} className={input} /></label>
        <button className="rounded-lg bg-brand-deep text-brand-cream px-4 py-2.5 font-semibold">Xem</button>
      </form>

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 text-sm">
        <div className={card}><div className="text-gray-600">Doanh thu đã thu</div><div className="text-xl font-bold">{vnd(total)}</div></div>
        <div className={card}><div className="text-gray-600">Số hóa đơn</div><div className="text-xl font-bold">{paid.length}</div></div>
        <div className={card}><div className="text-gray-600">Lượt khám</div><div className="text-xl font-bold">{visitTotal}</div><div className="text-xs text-gray-600">xong {visitCount("DONE")} · hủy {visitCount("CANCELLED")}</div></div>
        <div className={card}><div className="text-gray-600">Hóa đơn đã hủy</div><div className="text-xl font-bold">{voided}</div></div>
      </div>

      <section className="card space-y-1 text-sm">
        <h2 className="font-semibold text-brand-deep">Theo nguồn và hình thức</h2>
        <div>Khám: {byKind.get("EXAM")?.n ?? 0} HĐ · {vnd(byKind.get("EXAM")?.sum ?? 0)}</div>
        <div>Bán lẻ: {byKind.get("RETAIL")?.n ?? 0} HĐ · {vnd(byKind.get("RETAIL")?.sum ?? 0)}</div>
        {Object.entries(METHOD).map(([k, v]) => <div key={k}>{v}: {vnd(byMethod.get(k) ?? 0)}</div>)}
      </section>

      <section className="card space-y-1">
        <h2 className="font-semibold text-brand-deep">Doanh thu theo ngày</h2>
        {days.map((d) => {
          const e = byDay.get(d);
          return (
            <div key={d} className="flex items-center gap-2 text-sm">
              <span className="w-24 tabular-nums">{dateVN(new Date(`${d}T00:00:00+07:00`))}</span>
              <div className="flex-1 h-3 bg-brand-gold/10 rounded"><div className="h-3 rounded bg-brand-deep" style={{ width: `${((e?.sum ?? 0) / maxDay) * 100}%` }} /></div>
              <span className="w-32 text-right tabular-nums">{vnd(e?.sum ?? 0)}</span>
              <span className="w-12 text-right text-gray-600">{e?.n ?? 0} HĐ</span>
            </div>
          );
        })}
      </section>

      <section className="card space-y-1 text-sm">
        <h2 className="font-semibold text-brand-deep">Thuốc bán nhiều nhất (theo tiền)</h2>
        {topList.length === 0 && <p className="text-gray-600">Chưa có.</p>}
        {topList.map((t, i) => (
          <div key={t.name} className="flex gap-2"><span className="w-6">{i + 1}.</span><span className="flex-1">{t.name}</span><span className="tabular-nums">{fq(t.qty)} {t.unit}</span><span className="w-32 text-right tabular-nums">{vnd(t.sum)}</span></div>
        ))}
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <section className="card space-y-1 text-sm">
          <h2 className="font-semibold text-brand-deep">Sắp hết hàng (dưới mức tối thiểu)</h2>
          <p className="text-xs text-gray-600">Tính tồn của các chi nhánh đang chọn, không tính lô hết hạn.</p>
          {low.length === 0 && <p className="text-gray-600">Không có.</p>}
          {low.map((i) => <div key={i.id} className="flex justify-between gap-2"><span>{i.name}</span><span className="text-red-700 tabular-nums">{fq(i.have)}/{fq(i.minStock)} {i.unit}</span></div>)}
        </section>
        <section className="card space-y-1 text-sm">
          <h2 className="font-semibold text-brand-deep">Hết hạn trong 30 ngày</h2>
          {expiring.length === 0 && <p className="text-gray-600">Không có.</p>}
          {expiring.map((l, n) => (
            <div key={n} className="flex justify-between gap-2">
              <span>{l.item.name}{branchIds.length > 1 ? ` · ${l.branch.name}` : ""}</span>
              <span className={`tabular-nums ${(l.expiryDate as Date) < new Date() ? "text-red-700 font-semibold" : ""}`}>{fq(l.qtyRemaining)} {l.item.unit} · {dateVN(l.expiryDate as Date)}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
