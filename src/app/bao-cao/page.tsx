import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { REPORT_ROLES } from "@/lib/permissions";
import { branchesFor, input } from "@/lib/stock";
import { dateVN, qty as fq, vnd } from "@/lib/format";
import { PageHead, Stat, Panel } from "@/components/ui";
import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { Download, Stethoscope, ReceiptText, BarChart3, Banknote, FileText, Users, FileX, Leaf, AlertTriangle, CalendarClock, PieChart, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const METHOD: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };
const DAY = 86400000;
const vnDate = (d: Date) => new Date(d.getTime() + 7 * 3600000).toISOString().slice(0, 10);
const okDate = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v)) ? v : undefined);

export default async function ReportPage({ searchParams }: { searchParams: { cn?: string; tu?: string; den?: string; tab?: string; kt?: string } }) {
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
  const [paid, voided, visitGroups, lines, items, lots, prevPaid, prevVisits, dis, recent, prevInv, rxSums] = await Promise.all([
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
    prisma.invoice.findMany({ where: { branchId: { in: branchIds }, paidAt: { gte: start, lt: end }, status: { in: ["PAID", "VOID"] } }, orderBy: { paidAt: "desc" }, take: 8, include: { patient: { select: { fullName: true } }, lines: { select: { kind: true, name: true } } } }),
    prisma.invoice.findMany({ where: { branchId: { in: branchIds }, status: "PAID", paidAt: { gte: pStart, lt: start } }, select: { paidAt: true, total: true } }),
    prisma.invoiceLine.groupBy({ by: ["invoiceId"], where: { itemId: { not: null }, invoice: { branchId: { in: branchIds }, status: "PAID", paidAt: { gte: start, lt: end } } }, _sum: { amount: true } }),
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

  const topQty = [...top.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  const maxQty = Math.max(1, ...topQty.map((t) => t.qty));
  const rxAvg = rxSums.length ? Math.round(rxSums.reduce((s2, r) => s2 + (r._sum.amount ?? 0), 0) / rxSums.length) : 0;
  const prevByDay = new Map<string, number>();
  for (const i of prevInv) { const d = vnDate(i.paidAt as Date); prevByDay.set(d, (prevByDay.get(d) ?? 0) + i.total); }
  const prevDays = days.map((_, k) => vnDate(new Date(pStart.getTime() + k * DAY)));
  const cur = days.map((d) => byDay.get(d)?.sum ?? 0);
  const prv = prevDays.map((d) => prevByDay.get(d) ?? 0);
  const yMax = Math.max(1, ...cur, ...prv);
  const niceMax = (() => { const e = Math.pow(10, Math.floor(Math.log10(yMax))); return Math.ceil(yMax / e) * e; })();
  const W = 800, H = 230, L = 62, R = 30, T = 12, B = 28;
  const X = (k: number) => L + (days.length <= 1 ? 0 : (k / (days.length - 1)) * (W - L - R));
  const Y = (v: number) => T + (1 - v / niceMax) * (H - T - B);
  const pts = (a: number[]) => a.map((v, k) => `${X(k).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  const kt = searchParams.kt === "thap" ? "thap" : "sap";
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
        <PrintButton label="In báo cáo" />
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
        <Stat icon={FileX} label="Giá trị đơn thuốc (TB)" value={vnd(rxAvg)} unit={`${rxSums.length} đơn có thuốc${voided ? ` · ${voided} HĐ hủy` : ""}`} tone="red" />
      </div>

      {show("doanh-thu") && <div className="grid xl:grid-cols-[1fr_22rem] gap-4 items-start">
        <Panel icon={TrendingUp} title="Doanh thu theo ngày">
          <div className="mb-1 flex flex-wrap items-center gap-4 text-xs text-brand-ink/70">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 bg-emerald-700" />Kỳ này ({from.split("-").reverse().join("/")} - {to.split("-").reverse().join("/")})</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 border-t-2 border-dashed border-slate-400" />Kỳ trước</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <g key={f}><line x1={L} x2={W - R} y1={Y(niceMax * f)} y2={Y(niceMax * f)} stroke="#e2e8f0" /><text x={L - 6} y={Y(niceMax * f) + 4} textAnchor="end" fontSize="11" fill="#64748b">{Math.round(niceMax * f).toLocaleString("vi-VN")}</text></g>
            ))}
            {cur.length > 1 && <polygon points={`${X(0)},${Y(0)} ${pts(cur)} ${X(cur.length - 1)},${Y(0)}`} fill="#16a34a" opacity="0.10" />}
            {prv.length > 1 && <polyline points={pts(prv)} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />}
            {cur.length > 1 && <polyline points={pts(cur)} fill="none" stroke="#15803d" strokeWidth="2.5" />}
            {cur.map((v, k) => (
              <circle key={k} cx={X(k)} cy={Y(v)} r={days.length > 31 ? 2 : 4} fill="#15803d"><title>{`${days[k].split("-").reverse().join("/")}: ${vnd(v)} · ${byDay.get(days[k])?.n ?? 0} HĐ`}</title></circle>
            ))}
            {days.map((d, k) => (days.length <= 12 || k % Math.ceil(days.length / 12) === 0) && <text key={d} x={X(k)} y={H - 8} textAnchor="middle" fontSize="11" fill="#64748b">{d.slice(8)}/{d.slice(5, 7)}</text>)}
          </svg>
        </Panel>

        <Panel icon={PieChart} title="Cơ cấu theo hình thức thanh toán">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: total > 0 ? `conic-gradient(${stops})` : "#e5e7eb" }}>
              <div className="absolute inset-[22%] grid place-items-center rounded-full bg-white text-center text-xs font-bold leading-tight">{(total / 1e6).toFixed(2).replace(".", ",")}<br />triệu đồng</div>
            </div>
            <ul className="w-full space-y-1.5 text-sm">
              {Object.entries(METHOD).map(([k, v]) => (
                <li key={k} className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: COL[k] }} />{v}<b className="ml-auto whitespace-nowrap pl-3 tabular-nums">{vnd(byMethod.get(k) ?? 0)}</b><span className="w-12 text-right text-xs text-brand-ink/60">{(((byMethod.get(k) ?? 0) / mTotal) * 100).toFixed(1).replace(".", ",")}%</span></li>
              ))}
              <li className="border-t pt-1.5 text-brand-ink/70">Khám: {byKind.get("EXAM")?.n ?? 0} HĐ · {vnd(byKind.get("EXAM")?.sum ?? 0)}</li>
              <li className="text-brand-ink/70">Bán lẻ: {byKind.get("RETAIL")?.n ?? 0} HĐ · {vnd(byKind.get("RETAIL")?.sum ?? 0)}</li>
            </ul>
          </div>
        </Panel>
      </div>}

      {tab === "kham-benh" && (
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

      {tab === "tong-quan" && (
        <div className="grid items-start gap-4 lg:grid-cols-3">
          <Panel icon={Leaf} title="Top 5 vị thuốc sử dụng nhiều nhất">
            {topQty.length === 0 && <p className="text-sm text-brand-ink/60">Chưa có.</p>}
            <ul className="space-y-2.5">
              {topQty.map((t) => (
                <li key={t.name} className="text-sm"><div className="flex justify-between"><span>{t.name}</span><b className="tabular-nums">{fq(t.qty)} {t.unit}</b></div><div className="mt-1 h-2.5 rounded bg-slate-100"><div className="h-2.5 rounded bg-brand-deep" style={{ width: `${(t.qty / maxQty) * 100}%` }} /></div></li>
              ))}
            </ul>
          </Panel>
          <Panel icon={Stethoscope} title="Top 5 bệnh lý khám nhiều nhất">
            {dis.length === 0 && <p className="text-sm text-brand-ink/60">Chưa có bệnh án hoàn tất trong kỳ.</p>}
            <ul className="space-y-2.5">
              {dis.slice(0, 5).map((d) => (
                <li key={d.diseaseText} className="text-sm"><div className="flex justify-between"><span>{d.diseaseText}</span><b>{d._count._all}</b></div><div className="mt-1 h-2.5 rounded bg-slate-100"><div className="h-2.5 rounded bg-amber-500" style={{ width: `${(d._count._all / maxDis) * 100}%` }} /></div></li>
              ))}
            </ul>
          </Panel>
          <Panel icon={AlertTriangle} title="Thuốc sắp hết hạn / Dưới mức tối thiểu" tone="text-amber-600">
            <div className="mb-2 flex gap-1 text-sm font-semibold">
              <Link href={`${qs("tong-quan")}&kt=sap`} className={`rounded-lg px-3 py-1 ${kt === "sap" ? "bg-amber-100 text-amber-800" : "border border-slate-200"}`}>Sắp hết hạn ({expiring.length})</Link>
              <Link href={`${qs("tong-quan")}&kt=thap`} className={`rounded-lg px-3 py-1 ${kt === "thap" ? "bg-amber-100 text-amber-800" : "border border-slate-200"}`}>Dưới mức tối thiểu ({low.length})</Link>
            </div>
            {kt === "sap" ? (
              <ul className="space-y-1.5 text-sm">
                {expiring.length === 0 && <li className="text-brand-ink/60">Không có.</li>}
                {expiring.slice(0, 6).map((l, n) => { const dd = Math.ceil(((l.expiryDate as Date).getTime() - Date.now()) / DAY); return (
                  <li key={n} className="flex justify-between gap-2"><span>{l.item.name}</span><span className={`chip ${dd < 0 ? "chip-red" : dd <= 30 ? "chip-amber" : "chip-blue"} tabular-nums`}>{fq(l.qtyRemaining)} {l.item.unit} · {dd < 0 ? "hết hạn" : `${dd} ngày`}</span></li>); })}
              </ul>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {low.length === 0 && <li className="text-brand-ink/60">Không có.</li>}
                {low.slice(0, 6).map((i) => <li key={i.id} className="flex justify-between gap-2"><span>{i.name}</span><span className="chip chip-red tabular-nums">{fq(i.have)}/{fq(i.minStock)} {i.unit}</span></li>)}
              </ul>
            )}
          </Panel>
        </div>
      )}

      {show("doanh-thu") && (
        <Panel icon={ReceiptText} title="Giao dịch gần đây" pad={false}>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-10">STT</th><th>Ngày giờ</th><th>Loại giao dịch</th><th>Mã hóa đơn</th><th>Bệnh nhân</th><th>Nội dung</th><th className="text-right">Số tiền</th><th>Hình thức</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {recent.length === 0 && <tr><td colSpan={9} className="p-4 text-center text-brand-ink/60">Chưa có giao dịch.</td></tr>}
                {recent.map((i, k) => {
                  const fee = i.lines.filter((l) => l.kind === "FEE");
                  const drugs = i.lines.length - fee.length;
                  return (
                    <tr key={i.id}>
                      <td className="text-brand-ink/60">{k + 1}</td>
                      <td>{dateVN(i.paidAt as Date)} {new Date((i.paidAt as Date).getTime() + 7 * 3600000).toISOString().slice(11, 16)}</td>
                      <td>{i.kind === "RETAIL" ? "Thuốc" : drugs ? "Khám bệnh + Thuốc" : "Khám bệnh"}</td>
                      <td><Link href={`/thu-ngan/${i.id}`} className="font-mono text-sky-700 hover:underline">HD-{String(i.seq).padStart(6, "0")}</Link></td>
                      <td className="font-semibold">{i.patient?.fullName ?? i.customerName ?? "Khách lẻ"}</td>
                      <td className="text-sm text-brand-ink/75">{[fee[0]?.name, drugs ? `${drugs} vị thuốc` : ""].filter(Boolean).join(" · ") || "—"}</td>
                      <td className="text-right font-semibold tabular-nums">{vnd(i.total)}</td>
                      <td>{i.method ? METHOD[i.method] : "—"}</td>
                      <td><span className={`chip ${i.status === "PAID" ? "chip-green" : "chip-gray"}`}>{i.status === "PAID" ? "Hoàn thành" : "Đã hủy"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {tab === "thuoc-kho" && <div className="grid lg:grid-cols-3 gap-4 items-start">
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
