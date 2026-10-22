import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DISPENSE_ROLES } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { timeVN, vnDayStart, vnd, patientCode, SEX_LABEL, dateVN } from "@/lib/format";
import { ageOf } from "@/lib/person";
import { readChecks } from "@/lib/dispense";
import { saveDispenseDraft, confirmDispense } from "@/actions/dispense";
import { PageHead, Stat, Panel } from "@/components/ui";
import { qty as fq } from "@/lib/format";
import { ClipboardList, Pill, Hourglass, CheckCircle2, AlertTriangle, Package, ShoppingCart, CalendarClock, ScanLine, Printer, FileText, Save, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DispenseQueuePage({ searchParams }: { searchParams: { cn?: string; sel?: string; tab?: string; bs?: string; uu?: string; k?: string; ngay?: string; dt?: string; loi?: string } }) {
  const staff = await requireRole(...DISPENSE_ROLES);
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  if (!branch) {
    return <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>;
  }
  const today = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
  const day = searchParams.ngay && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.ngay) ? searchParams.ngay : today;
  const dStart = new Date(`${day}T00:00:00+07:00`);
  const dEnd = new Date(dStart.getTime() + 86400000);
  const tab = ["cho", "da", "le"].includes(searchParams.tab ?? "") ? (searchParams.tab as string) : "cho";
  const base = { branchId: branch.id, status: "PAID", lines: { some: { itemId: { not: null } } } };
  const inc = {
    patient: { select: { fullName: true, allergies: true, seq: true, phone: true, sex: true, birthDate: true, birthYear: true } },
    visit: { select: { priority: true, exam: { select: { doctorName: true, prescription: { select: { thangCount: true } } } } } },
    _count: { select: { lines: true } },
  };
  const [waitingAll, doneAll, retail] = await Promise.all([
    prisma.invoice.findMany({ where: { ...base, dispensedAt: null }, orderBy: { paidAt: "asc" }, include: inc }),
    prisma.invoice.findMany({ where: { ...base, dispensedAt: { gte: dStart, lt: dEnd } }, orderBy: { dispensedAt: "desc" }, include: inc }),
    prisma.invoice.findMany({ where: { ...base, kind: "RETAIL", createdAt: { gte: vnDayStart() } }, orderBy: { paidAt: "desc" }, include: inc }),
  ]);
  type Row = (typeof waitingAll)[number];
  const name = (i: Row) => i.patient?.fullName ?? i.customerName ?? "Khách lẻ";
  const doctorOf = (i: Row) => i.visit?.exam?.doctorName ?? "";
  const list = tab === "cho" ? waitingAll : tab === "da" ? doneAll : retail;
  const doctors = Array.from(new Set(list.map(doctorOf).filter(Boolean)));
  const kw = searchParams.k?.trim().toLowerCase();
  const shown = list
    .filter((i) => (!searchParams.bs || doctorOf(i) === searchParams.bs) && (!searchParams.uu || i.visit?.priority) && (!kw || name(i).toLowerCase().includes(kw) || `hd-${String(i.seq).padStart(6, "0")}`.includes(kw)))
    .sort((a, b) => Number(!!b.visit?.priority) - Number(!!a.visit?.priority));

  const selId = searchParams.sel ?? shown[0]?.id;
  const sel = selId ? await prisma.invoice.findUnique({
    where: { id: selId },
    include: {
      patient: { select: { fullName: true, allergies: true, phone: true, seq: true, sex: true, birthDate: true, birthYear: true } },
      lines: { orderBy: { position: "asc" } },
      visit: { select: { createdAt: true, exam: { select: { doctorName: true, advice: true, prescription: { select: { thangCount: true, decoctionNote: true, lines: { select: { itemId: true, qty: true, usage: true, note: true } } } } } } } },
    },
  }) : null;
  const itemIds = sel ? (sel.lines.map((l) => l.itemId).filter(Boolean) as string[]) : [];
  const lots = itemIds.length ? await prisma.stockLot.findMany({
    where: { branchId: branch.id, itemId: { in: itemIds }, qtyRemaining: { gt: 0 }, OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }] },
    orderBy: [{ expiryDate: { sort: "asc", nulls: "last" } }], select: { itemId: true, qtyRemaining: true, expiryDate: true },
  }) : [];
  const have = new Map<string, number>();
  const exp = new Map<string, Date | null>();
  for (const l of lots) {
    have.set(l.itemId, (have.get(l.itemId) ?? 0) + l.qtyRemaining);
    if (!exp.has(l.itemId)) exp.set(l.itemId, l.expiryDate);
  }
  const in30 = new Date(Date.now() + 30 * 86400000);
  const [lowItems, soonLots] = await Promise.all([
    prisma.item.findMany({ where: { active: true, minStock: { gt: 0 } }, select: { id: true, minStock: true, lots: { where: { branchId: branch.id }, select: { qtyRemaining: true } } } }),
    prisma.stockLot.count({ where: { branchId: branch.id, qtyRemaining: { gt: 0 }, expiryDate: { gt: new Date(), lte: in30 } } }),
  ]);
  const lowCount = lowItems.filter((it) => it.lots.reduce((s, l) => s + l.qtyRemaining, 0) < it.minStock).length;
  const checks = readChecks(sel?.dispenseChecks);
  const dayName = new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  const href = (extra: Record<string, string>) => `/duoc?${new URLSearchParams({ cn: branch.id, tab, ...(searchParams.bs ? { bs: searchParams.bs } : {}), ...(searchParams.ngay ? { ngay: searchParams.ngay } : {}), ...extra })}`;
  const tabs = [["cho", `Chờ phát thuốc (${waitingAll.length})`, Hourglass], ["da", `Đã phát (${doneAll.length})`, CheckCircle2], ["le", `Bán thuốc lẻ (${retail.length})`, ShoppingCart]] as const;
  const drugLines = sel?.lines.filter((l) => l.kind !== "FEE") ?? [];
  const weighedN = drugLines.filter((l) => l.itemId && checks.weighed.includes(l.itemId)).length;
  const step = sel?.dispensedAt ? 4 : checks.chk.dong || checks.chk.dan ? 3 : drugLines.length && weighedN > 0 ? 2 : 2;
  const rx = sel?.visit?.exam?.prescription;
  const dt = searchParams.dt ?? "ds";
  const code = (i: { seq: number }) => `HD-${String(i.seq).padStart(6, "0")}`;
  const hid = sel ? <input type="hidden" name="invoiceId" value={sel.id} /> : null;
  return (
    <div className="space-y-4">
      <PageHead icon={Pill} title="Phát thuốc" sub={`Hôm nay, ${dayName}`} img="/images/art/herbs-wide.jpg" />
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}

      <div className="flex flex-wrap gap-2">
        {tabs.map(([k, label, Icon]) => (
          <Link key={k} href={`/duoc?${new URLSearchParams({ cn: branch.id, tab: k })}`} className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 font-semibold ${tab === k ? "border-brand-deep bg-brand-deep text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}><Icon className="h-4 w-4" />{label}</Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Package} label="Đơn đã thanh toán chờ phát thuốc" value={waitingAll.length} unit="đơn" tone="amber" />
        <Stat icon={CheckCircle2} label="Đã phát hôm nay" value={doneAll.length} unit="đơn" tone="green" />
        <Stat icon={AlertTriangle} label="Thuốc sắp hết" value={lowCount} unit="vị thuốc dưới mức tối thiểu" tone="red" />
        <Stat icon={CalendarClock} label="Lô thuốc sắp hết hạn" value={soonLots} unit="lô, ≤ 30 ngày" tone="purple" />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="space-y-4">
          <Panel icon={Hourglass} title={`Danh sách đơn ${tab === "cho" ? "chờ phát thuốc" : tab === "da" ? "đã phát" : "bán lẻ"} (${shown.length})`} pad={false} tone="text-amber-600">
            <form className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2.5">
              <input type="hidden" name="cn" value={branch.id} /><input type="hidden" name="tab" value={tab} />
              <div className="relative min-w-[10rem] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input name="k" defaultValue={searchParams.k} placeholder="Tên bệnh nhân, số hóa đơn…" className="w-full rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-sm" />
              </div>
              <select name="bs" defaultValue={searchParams.bs ?? ""} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"><option value="">Tất cả bác sĩ</option>{doctors.map((d) => <option key={d} value={d}>{d}</option>)}</select>
              <select name="uu" defaultValue={searchParams.uu ?? ""} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"><option value="">Mọi mức ưu tiên</option><option value="1">Chỉ ưu tiên</option></select>
              {tab === "da" && <input type="date" name="ngay" defaultValue={day} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />}
              <button className="rounded-lg bg-brand-deep px-4 py-1.5 text-sm font-semibold text-white">Tìm kiếm</button>
            </form>
            {shown.length === 0 ? <p className="p-4 text-sm text-brand-ink/70">Không có đơn nào.</p> : (
              <div className="overflow-x-auto">
                <table>
                  <thead><tr><th className="w-10">STT</th><th>Bệnh nhân</th><th>Mã đơn</th><th className="hidden min-[1800px]:table-cell">Bác sĩ kê đơn</th><th className="text-right">Số thang</th><th>Thanh toán</th><th>Ưu tiên</th><th></th></tr></thead>
                  <tbody>
                    {shown.map((i, k) => (
                      <tr key={i.id} className={sel?.id === i.id ? "bg-amber-50" : ""}>
                        <td className="text-brand-ink/70">{k + 1}</td>
                        <td>
                          <Link href={href({ sel: i.id })} className="font-semibold hover:underline">{name(i)}</Link>
                          {i.patient && <div className="text-xs text-brand-ink/70">{patientCode(i.patient.seq)} · {ageOf(i.patient.birthDate, i.patient.birthYear)} tuổi · {i.patient.phone}</div>}
                          {i.patient?.allergies && <span className="chip chip-red mt-0.5">Dị ứng: {i.patient.allergies}</span>}
                        </td>
                        <td className="whitespace-nowrap font-mono text-xs">{code(i)}<div className="text-brand-ink/70">{i.paidAt ? timeVN(i.paidAt) : ""}</div></td>
                        <td className="hidden max-w-[9rem] truncate whitespace-nowrap text-sm min-[1800px]:table-cell" title={doctorOf(i) || ""}>{doctorOf(i) || (i.kind === "RETAIL" ? "Bán lẻ" : "—")}</td>
                        <td className="text-right">{i.visit?.exam?.prescription?.thangCount || "—"}</td>
                        <td className="whitespace-nowrap"><span className="chip chip-green">Đã thanh toán</span></td>
                        <td className="whitespace-nowrap">{i.visit?.priority ? <span className="chip chip-red">Ưu tiên</span> : <span className="chip chip-gray">Bình thường</span>}</td>
                        <td><Link href={href({ sel: i.id })} className="whitespace-nowrap rounded-lg bg-brand-deep px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-deeper">{i.dispensedAt ? "Xem" : "Soạn thuốc"}</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel icon={ClipboardList} title="Quy trình phát thuốc">
            <ol className="grid gap-3 sm:grid-cols-4">
              {[["Kiểm tra đơn", "(Đã thanh toán)"], ["Soạn - cân thuốc", drugLines.length ? `(${weighedN}/${drugLines.length} vị)` : ""], ["Đóng gói và dán nhãn", ""], ["Xác nhận phát thuốc", ""]].map(([t, sub], k) => {
                const n = k + 1;
                const state = sel?.dispensedAt || n < step ? "done" : n === step ? "cur" : "todo";
                return (
                  <li key={t} className="flex flex-col items-center gap-1 text-center">
                    <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white ${state === "done" ? "bg-emerald-600" : state === "cur" ? "bg-amber-500" : "bg-slate-300"}`}>{state === "done" ? "✓" : n}</span>
                    <span className="text-sm font-semibold">{t}</span><span className="text-xs text-brand-ink/70">{sub}</span>
                  </li>
                );
              })}
            </ol>
          </Panel>
        </div>

        {sel ? (
          <aside className="space-y-4">
            <section className="card space-y-3">
              <div className="flex items-center justify-between"><div className="font-bold">Chi tiết đơn thuốc</div><span className={`chip ${sel.dispensedAt ? "chip-green" : "chip-amber"}`}>{sel.dispensedAt ? "Đã phát" : "Đang xử lý"}</span></div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-100 text-amber-700"><Pill className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{sel.patient?.fullName ?? sel.customerName ?? "Khách lẻ"}</div>
                  <div className="text-xs text-brand-ink/70">{sel.patient ? `${patientCode(sel.patient.seq)} · ${ageOf(sel.patient.birthDate, sel.patient.birthYear)} tuổi · ${SEX_LABEL[sel.patient.sex] ?? ""} · ${sel.patient.phone}` : "Bán lẻ"}</div>
                </div>
                <div className="text-right text-xs text-brand-ink/70">{code(sel)}<br />{dateVN(sel.visit?.createdAt ?? sel.createdAt)}</div>
              </div>
              {sel.patient?.allergies && <div className="warn-box text-sm"><b>Dị ứng:</b> {sel.patient.allergies}</div>}
              <div className="flex flex-wrap gap-1 text-sm font-semibold">
                {[["ds", `Vị thuốc (${drugLines.length})`], ["tt", "Thông tin đơn"], ["gc", "Ghi chú"]].map(([k, l]) => (
                  <Link key={k} href={href({ sel: sel.id, dt: k })} className={`whitespace-nowrap rounded-full px-3 py-1.5 ${dt === k ? "bg-brand-deep text-white" : "border border-slate-200 hover:bg-slate-50"}`}>{l}</Link>
                ))}
              </div>
              {dt === "ds" && (
                <div className="overflow-x-auto">
                  <table>
                    <thead><tr><th>STT</th><th>Tên vị thuốc</th><th className="text-right">SL tổng</th><th className="text-right">Tồn kho</th><th>Hạn dùng</th><th></th></tr></thead>
                    <tbody>
                      {drugLines.map((l, k) => {
                        const h = l.itemId ? have.get(l.itemId) ?? 0 : 0;
                        const enough = h + 1e-9 >= l.qty;
                        const e = l.itemId ? exp.get(l.itemId) : null;
                        const w = l.itemId ? checks.weighed.includes(l.itemId) : false;
                        return (
                          <tr key={l.id} className={w ? "bg-emerald-50/60" : ""}>
                            <td>{k + 1}</td>
                            <td className="text-sm">{l.name}</td>
                            <td className="text-right text-sm">{fq(l.qty)} {l.unit}</td>
                            <td className="text-right text-sm">{fq(h)}</td>
                            <td className="text-sm">{e ? `${String(e.getUTCMonth() + 1).padStart(2, "0")}/${e.getUTCFullYear()}` : "—"}</td>
                            <td>{enough ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {dt === "tt" && (
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><dt className="text-brand-ink/70">Bác sĩ kê đơn</dt><dd className="font-medium">{sel.visit?.exam?.doctorName ?? "—"}</dd></div>
                  <div className="flex justify-between"><dt className="text-brand-ink/70">Số thang</dt><dd className="font-medium">{rx?.thangCount || "—"}</dd></div>
                  <div><dt className="text-brand-ink/70">Cách sắc, cách dùng</dt><dd className="font-medium">{rx?.decoctionNote || "—"}</dd></div>
                  <div><dt className="text-brand-ink/70">Dặn dò</dt><dd className="font-medium">{sel.visit?.exam?.advice || "—"}</dd></div>
                </dl>
              )}
              {dt === "gc" && <p className="text-sm">{sel.note?.replace("[DEMO]", "").trim() || "Không có ghi chú."}</p>}
              <div className="flex items-center justify-between border-t pt-3"><span className="text-brand-ink/70">Tổng tiền</span><b className="text-2xl text-amber-600">{vnd(sel.total)}</b></div>
              <Link href={`/duoc/${sel.id}`} className="block text-center text-sm font-semibold text-brand-deep underline">Mở trang đơn đầy đủ</Link>
            </section>

            {!sel.dispensedAt && (
              <form className="card space-y-3">
                {hid}
                <div className="font-bold">Thực hiện phát thuốc</div>
                <div className="flex items-center gap-2">
                  <ScanLine className="h-5 w-5 text-slate-500" />
                  <input name="scan" placeholder="Nhập hoặc quét mã vị thuốc (VT001…)" className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                  <button formAction={saveDispenseDraft} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50">Cân</button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[["can", "Đã cân đủ số lượng"], ["dan", "Đã dán nhãn"], ["dong", "Đã đóng gói"], ["kiem", "Kiểm tra lần cuối"]].map(([k, l]) => (
                    <label key={k} className="flex items-center gap-2"><input type="checkbox" name={`chk_${k}`} defaultChecked={!!checks.chk[k]} />{l}</label>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button formAction={saveDispenseDraft} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2 text-sm font-semibold hover:bg-slate-50"><Save className="h-4 w-4" />Lưu nháp</button>
                  <Link href={`/duoc/${sel.id}/in?kieu=nhan`} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2 text-sm font-semibold hover:bg-slate-50"><Printer className="h-4 w-4" />In nhãn</Link>
                  <Link href={`/duoc/${sel.id}/in?kieu=huongdan`} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2 text-sm font-semibold hover:bg-slate-50"><FileText className="h-4 w-4" />In hướng dẫn</Link>
                </div>
                <button formAction={confirmDispense} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-deep py-3 font-semibold text-white hover:bg-brand-deeper"><CheckCircle2 className="h-5 w-5" />Xác nhận phát thuốc</button>
                <p className="text-xs text-brand-ink/70">Xác nhận sẽ trừ kho theo lô hết hạn sớm nhất. Cần tick đủ 4 bước.</p>
              </form>
            )}
          </aside>
        ) : <div />}
      </div>
    </div>
  );
}
