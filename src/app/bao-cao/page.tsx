import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { REPORT_ROLES } from "@/lib/permissions";
import { branchesFor, input } from "@/lib/stock";
import { dateVN, qty as fq, vnd } from "@/lib/format";
import { PageHead, Stat, Panel } from "@/components/ui";
import Link from "next/link";
import { Download, Stethoscope, ReceiptText, BarChart3, Banknote, FileText, Users, FileX, Leaf, AlertTriangle, CalendarClock, PieChart, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const METHOD: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };
const DAY = 86400000;
const vnDate = (d: Date) => new Date(d.getTime() + 7 * 3600000).toISOString().slice(0, 10);
const okDate = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v)) ? v : undefined);

export default async function ReportPage({ searchParams }: { searchParams: { cn?: string; tu?: string; den?: string; tab?: string } }) {
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

  const span = end.getTime() - start.getTime();
  const pStart = new Date(start.getTime() - span);
  const [paid, voided, visitGroups, lines, items, lots, prevPaid, prevVisits, dis, recent] = await Promise.all([
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
    prisma.invoice.aggregate({ _sum: { total: true }, _count: true, where: { branchId: { in: branchIds }, status: "PAID", paidAt: { gte: pStart, lt: start } } }),
    prisma.visit.count({ where: { branchId: { in: branchIds }, createdAt: { gte: pStart, lt: start } } }),
    prisma.exam.groupBy({ by: ["diseaseText"], where: { status: "FINAL", diseaseText: { not: null }, visit: { branchId: { in: branchIds }, createdAt: { gte: start, lt: end } } }, _count: { _all: true }, orderBy: { _count: { diseaseText: "desc" } }, take: 6 }),
    prisma.invoice.findMany({ where: { branchId: { in: branchIds }, status: "PAID", paidAt: { gte: start, lt: end } }, orderBy: { paidAt: "desc" }, take: 8, include: { patient: { select: { fullName: true } }, lines: { select: { kind: true } } } }),
  ]);
  const tab = ["doanh-thu", "kham-benh", "thuoc-kho"].includes(searchParams.tab ?? "") ? (searchParams.tab as string) : "tong-quan";
  const show = (...t: string[]) => tab === "tong-quan" || t.includes(tab);
  const pct = (cur: number, prev: number) => (prev > 0 ? ((cur - prev) / prev) * 100 : null);
  const trend = (cur: number, prev: number) => { const v = pct(cur, prev); return v === null ? "chưa có kỳ trước" : `${v >= 0 ? "▲ +" : "▼ "}${v.toFixed(1).replace(".", ",")}% so với kỳ trước`; };
  const qs = (t: string) => `?${new URLSearchParams({ ...(chosen ? { cn: chosen.id } : {}), tu: from, den: to, tab: t })}`;

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

  const COL: Record<string, string> = { CASH: "#15803d", TRANSFER: "#d4a017", CARD: "#2563eb" };
  const mTotal = Object.keys(METHOD).reduce((x, k) => x + (byMethod.get(k) ?? 0), 0) || 1;
  let acc = 0;
  const stops = Object.keys(METHOD).map((k) => { const from = (acc / mTotal) * 100; acc += byMethod.get(k) ?? 0; return `${COL[k]} ${from}% ${(acc / mTotal) * 100}%`; }).join(", ");
  const rxInv = recent.length; void rxInv;
  const maxDis = Math.max(1, ...dis.map((d) => d._count._all));
  const maxTop = Math.max(1, ...topList.map((t) => t.sum));
  return (
    <div className="space-y-4">
      <PageHead icon={BarChart3} title="Báo cáo & phân tích" sub="Doanh thu, khám bệnh, thuốc và kho của phòng khám" img="/images/art/herbs-wide.jpg" />
      <nav className="flex flex-wrap gap-2">
        {([["tong-quan", "Tổng quan", BarChart3], ["doanh-thu", "Doanh thu", Banknote], ["kham-benh", "Khám bệnh", Stethoscope], ["thuoc-kho", "Thuốc & kho", Leaf]] as const).map(([k, l, I]) => (
          <Link key={k} href={qs(k)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold ${tab === k ? "bg-brand-deep text-white" : "border border-slate-200 bg-white hover:border-brand-deep"}`}><I className="h-4 w-4" />{l}</Link>
        ))}
        <a href={`/bao-cao/xuat?${new URLSearchParams({ ...(chosen ? { cn: chosen.id } : {}), tu: from, den: to })}`} className="ml-auto flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold hover:border-brand-deep"><Download className="h-4 w-4" />Xuất báo cáo (CSV)</a>
      </nav>
      <form method="get" className="card !p-3 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">Chi nhánh
          <select name="cn" defaultValue={chosen?.id ?? ""} className={`${input} min-w-[14rem]`}>
            <option value="">Tất cả ({branches.length})</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Từ ngày<input type="hidden" name="tab" value={tab} /><input type="date" name="tu" defaultValue={from} className={input} /></label>
        <label className="text-sm font-medium">Đến ngày<input type="date" name="den" defaultValue={to} className={input} /></label>
        <button className="rounded-xl bg-brand-deep px-6 py-2.5 font-semibold text-white hover:bg-brand-deeper">Xem báo cáo</button>
      </form>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={Banknote} label="Doanh thu đã thu" value={vnd(total)} unit={trend(total, prevPaid._sum.total ?? 0)} tone="gold" />
        <Stat icon={FileText} label="Số hóa đơn" value={paid.length} unit={trend(paid.length, prevPaid._count)} tone="blue" />
        <Stat icon={Users} label="Lượt khám" value={visitTotal} unit={trend(visitTotal, prevVisits)} tone="green" />
        <Stat icon={FileX} label="Hóa đơn đã hủy" value={voided} tone="red" />
      </div>

      {show("doanh-thu") && <div className="grid xl:grid-cols-[1fr_22rem] gap-4 items-start">
        <Panel icon={TrendingUp} title="Doanh thu theo ngày">
          {days.length <= 31 ? (
            <>
              <div className="flex h-44 items-end gap-1.5">
                {days.map((d) => { const e = byDay.get(d); return (
                  <div key={d} className="flex h-full flex-1 flex-col justify-end" title={`${dateVN(new Date(`${d}T00:00:00+07:00`))}: ${vnd(e?.sum ?? 0)} · ${e?.n ?? 0} HĐ`}>
                    <div className="rounded-t bg-emerald-600/85 hover:bg-emerald-700" style={{ height: `${Math.max(((e?.sum ?? 0) / maxDay) * 100, 2)}%` }} />
                  </div>); })}
              </div>
              <div className="mt-1 flex gap-1.5 text-[10px] text-brand-ink/55">{days.map((d, i) => <div key={d} className="flex-1 text-center">{days.length <= 10 || i % Math.ceil(days.length / 10) === 0 ? d.slice(8) + "/" + d.slice(5, 7) : ""}</div>)}</div>
            </>
          ) : (
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {days.map((d) => { const e = byDay.get(d); return (
                <div key={d} className="flex items-center gap-2 text-sm"><span className="w-24 tabular-nums">{dateVN(new Date(`${d}T00:00:00+07:00`))}</span><div className="h-3 flex-1 rounded bg-slate-100"><div className="h-3 rounded bg-emerald-600" style={{ width: `${((e?.sum ?? 0) / maxDay) * 100}%` }} /></div><span className="w-28 text-right tabular-nums">{vnd(e?.sum ?? 0)}</span></div>); })}
            </div>
          )}
        </Panel>

        <Panel icon={PieChart} title="Cơ cấu theo hình thức thanh toán">
          <div className="flex items-center gap-4">
            <div className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: total > 0 ? `conic-gradient(${stops})` : "#e5e7eb" }}>
              <div className="absolute inset-[22%] grid place-items-center rounded-full bg-white text-center text-xs font-bold leading-tight">{vnd(total)}</div>
            </div>
            <ul className="space-y-1.5 text-sm">
              {Object.entries(METHOD).map(([k, v]) => (
                <li key={k} className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: COL[k] }} />{v}<b className="ml-auto pl-3 tabular-nums">{vnd(byMethod.get(k) ?? 0)}</b></li>
              ))}
              <li className="border-t pt-1.5 text-brand-ink/70">Khám: {byKind.get("EXAM")?.n ?? 0} HĐ · {vnd(byKind.get("EXAM")?.sum ?? 0)}</li>
              <li className="text-brand-ink/70">Bán lẻ: {byKind.get("RETAIL")?.n ?? 0} HĐ · {vnd(byKind.get("RETAIL")?.sum ?? 0)}</li>
            </ul>
          </div>
        </Panel>
      </div>}

      {show("kham-benh") && (
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          <Panel icon={Stethoscope} title="Top bệnh lý khám nhiều nhất">
            {dis.length === 0 && <p className="text-sm text-brand-ink/60">Chưa có bệnh án hoàn tất trong kỳ.</p>}
            <ul className="space-y-2.5">
              {dis.map((d) => (
                <li key={d.diseaseText} className="text-sm">
                  <div className="flex justify-between"><span>{d.diseaseText}</span><b>{d._count._all}</b></div>
                  <div className="mt-1 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-amber-500" style={{ width: `${(d._count._all / maxDis) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel icon={Users} title="Lượt khám theo trạng thái">
            <ul className="space-y-2 text-sm">
              {[["Đã khám", "DONE", "chip-green"], ["Đang khám", "IN_EXAM", "chip-blue"], ["Chờ khám", "WAITING", "chip-amber"], ["Đã hủy", "CANCELLED", "chip-gray"]].map(([l, k, c]) => (
                <li key={k} className="flex items-center justify-between"><span className={`chip ${c}`}>{l}</span><b className="text-lg">{visitCount(k)}</b></li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {show("doanh-thu") && (
        <Panel icon={ReceiptText} title="Giao dịch gần đây" pad={false}>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Ngày giờ</th><th>Loại giao dịch</th><th>Bệnh nhân</th><th className="text-right">Số tiền</th><th>Hình thức</th></tr></thead>
              <tbody>
                {recent.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-brand-ink/60">Chưa có giao dịch.</td></tr>}
                {recent.map((i) => (
                  <tr key={i.id}>
                    <td>{dateVN(i.paidAt as Date)} {new Date((i.paidAt as Date).getTime() + 7 * 3600000).toISOString().slice(11, 16)}</td>
                    <td>{i.kind === "RETAIL" ? "Bán thuốc" : i.lines.some((l) => l.kind !== "FEE") ? "Khám bệnh + Thuốc" : "Khám bệnh"}</td>
                    <td className="font-semibold">{i.patient?.fullName ?? i.customerName ?? "Khách lẻ"}</td>
                    <td className="text-right font-semibold tabular-nums">{vnd(i.total)}</td>
                    <td>{i.method ? METHOD[i.method] : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {show("thuoc-kho") && <div className="grid lg:grid-cols-3 gap-4 items-start">
        <Panel icon={Leaf} title="Thuốc bán nhiều nhất (theo tiền)">
          {topList.length === 0 && <p className="text-sm text-brand-ink/60">Chưa có.</p>}
          <ul className="space-y-2.5">
            {topList.slice(0, 8).map((t, i) => (
              <li key={t.name} className="text-sm">
                <div className="flex justify-between"><span><b className="mr-1.5 text-brand-ink/50">{i + 1}.</b>{t.name}</span><span className="tabular-nums text-brand-ink/70">{fq(t.qty)} {t.unit} · <b className="text-brand-ink">{vnd(t.sum)}</b></span></div>
                <div className="mt-1 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-brand-deep" style={{ width: `${(t.sum / maxTop) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel icon={AlertTriangle} title="Sắp hết hàng (dưới tối thiểu)" tone="text-red-600">
          <p className="mb-2 text-xs text-brand-ink/60">Tính tồn của chi nhánh đang chọn, không tính lô hết hạn.</p>
          {low.length === 0 && <p className="text-sm text-brand-ink/60">Không có.</p>}
          <ul className="space-y-1.5 text-sm">
            {low.map((i) => <li key={i.id} className="flex justify-between gap-2"><span>{i.name}</span><span className="chip chip-red tabular-nums">{fq(i.have)}/{fq(i.minStock)} {i.unit}</span></li>)}
          </ul>
        </Panel>
        <Panel icon={CalendarClock} title="Hết hạn trong 30 ngày" tone="text-amber-600">
          {expiring.length === 0 && <p className="text-sm text-brand-ink/60">Không có.</p>}
          <ul className="space-y-1.5 text-sm">
            {expiring.map((l, n) => (
              <li key={n} className="flex justify-between gap-2">
                <span>{l.item.name}{branchIds.length > 1 ? ` · ${l.branch.name}` : ""}</span>
                <span className={`tabular-nums ${(l.expiryDate as Date) < new Date() ? "font-semibold text-red-700" : ""}`}>{fq(l.qtyRemaining)} {l.item.unit} · {dateVN(l.expiryDate as Date)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>}
    </div>
  );
}
