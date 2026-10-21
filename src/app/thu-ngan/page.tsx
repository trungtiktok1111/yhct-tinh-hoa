import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { CASHIER_ROLES } from "@/lib/permissions";
import { createExamInvoice, createRetailInvoice } from "@/actions/billing";
import { branchesFor, input } from "@/lib/stock";
import { patientCode, timeVN, vnDayStart, vnd } from "@/lib/format";
import { PageHead, Stat, Panel } from "@/components/ui";
import { Wallet, Banknote, Landmark, CreditCard, FileText, ShoppingCart, Receipt, Plus, CalendarDays, ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const ST: Record<string, string> = { UNPAID: "Chờ thu", PAID: "Đã thu", VOID: "Đã hủy" };
const METHOD: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };
const btnMain = "rounded-xl bg-brand-deep text-white px-4 py-2.5 font-semibold hover:bg-brand-deeper";

export default async function CashierPage({ searchParams }: { searchParams: { cn?: string; loi?: string; tab?: string; ngay?: string } }) {
  const staff = await requireRole(...CASHIER_ROLES);
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  if (!branch) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold font-display">Thu ngân</h1>
        <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>
      </div>
    );
  }
  const today = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
  const day = searchParams.ngay && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.ngay) ? searchParams.ngay : today;
  const since = new Date(`${day}T00:00:00+07:00`);
  const until = new Date(since.getTime() + 86400000);
  const shift = (n: number) => new Date(since.getTime() + n * 86400000 + 7 * 3600000).toISOString().slice(0, 10);
  const tab = ["cho", "da", "le"].includes(searchParams.tab ?? "") ? (searchParams.tab as string) : "cho";
  const [pending, invoices] = await Promise.all([
    prisma.visit.findMany({
      where: { branchId: branch.id, createdAt: { gte: vnDayStart() }, status: "DONE", invoice: null, exam: { status: "FINAL" } },
      orderBy: { queueNo: "asc" },
      include: { patient: true, exam: { select: { prescription: { select: { _count: { select: { lines: true } } } } } } },
    }),
    prisma.invoice.findMany({
      where: { branchId: branch.id, createdAt: { gte: since, lt: until } },
      orderBy: { createdAt: "desc" },
      include: { patient: { select: { fullName: true } }, lines: { select: { kind: true } } },
    }),
  ]);
  const paid = invoices.filter((i) => i.status === "PAID");
  const sum = (m?: string) => paid.filter((i) => !m || i.method === m).reduce((s, i) => s + i.total, 0);

  const n = (m: string) => paid.filter((i) => i.method === m).length;
  const chip: Record<string, string> = { UNPAID: "chip-amber", PAID: "chip-green", VOID: "chip-gray" };
  const unpaid = invoices.filter((i) => i.status === "UNPAID");
  const content = (i: (typeof invoices)[number]) => {
    const fee = i.lines.filter((l) => l.kind === "FEE").length;
    const drugs = i.lines.length - fee;
    return i.kind === "RETAIL" ? `Thuốc (${drugs} mặt hàng)` : `${fee ? "Khám" : ""}${fee && drugs ? " + " : ""}${drugs ? `Thuốc (${drugs} vị)` : ""}` || "—";
  };
  const href = (t: string) => `/thu-ngan?cn=${branch.id}&tab=${t}${day !== today ? `&ngay=${day}` : ""}`;
  const tabs = [["cho", `Hóa đơn chờ thanh toán (${unpaid.length + pending.length})`, FileText], ["da", "Hóa đơn đã thanh toán", Receipt], ["le", "Bán lẻ thuốc", ShoppingCart]] as const;
  const shown = invoices.filter((i) => (tab === "cho" ? i.status === "UNPAID" : tab === "da" ? i.status !== "UNPAID" : i.kind === "RETAIL"));
  return (
    <div className="space-y-4">
      <PageHead icon={Wallet} title="Thu ngân" sub="Thanh toán khám bệnh, thuốc và các dịch vụ y học cổ truyền" img="/images/art/scale.jpg">
        <form action={createRetailInvoice}>
          <input type="hidden" name="branchId" value={branch.id} />
          <button className="flex items-center gap-2 rounded-xl border border-brand-deep bg-white px-4 py-2.5 font-semibold text-brand-deep hover:bg-emerald-50"><Plus className="h-5 w-5" />Tạo hóa đơn mới</button>
        </form>
        {hasAny(staff.roles, ITEM_MANAGER_ROLES) && <Link href="/thu-ngan/dich-vu" className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold hover:bg-slate-50"><Stethoscope className="h-5 w-5" />Dịch vụ & giá</Link>}
      </PageHead>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_14rem]">
        <Stat icon={Wallet} label={day === today ? "Đã thu hôm nay" : "Đã thu"} value={vnd(sum())} unit={`${paid.length} hóa đơn`} tone="gold" />
        <Stat icon={Banknote} label="Tiền mặt" value={vnd(sum("CASH"))} unit={`${n("CASH")} hóa đơn`} tone="green" />
        <Stat icon={Landmark} label="Chuyển khoản" value={vnd(sum("TRANSFER"))} unit={`${n("TRANSFER")} hóa đơn`} tone="blue" />
        <Stat icon={CreditCard} label="Thẻ" value={vnd(sum("CARD"))} unit={`${n("CARD")} hóa đơn`} tone="purple" />
        <form className="card !p-2.5">
          <input type="hidden" name="cn" value={branch.id} /><input type="hidden" name="tab" value={tab} />
          <div className="flex items-center gap-1">
            <Link href={`${href(tab).replace(/&ngay=[^&]*/, "")}&ngay=${shift(-1)}`} className="rounded-lg border border-slate-300 p-1 hover:bg-slate-50"><ChevronLeft className="h-4 w-4" /></Link>
            <input type="date" name="ngay" defaultValue={day} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-1.5 py-1 text-sm" />
            <Link href={`${href(tab).replace(/&ngay=[^&]*/, "")}&ngay=${shift(1)}`} className="rounded-lg border border-slate-300 p-1 hover:bg-slate-50"><ChevronRight className="h-4 w-4" /></Link>
          </div>
          <button className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-deep py-1.5 text-sm font-semibold text-white"><CalendarDays className="h-4 w-4" />Xem ngày</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(([k, label, Icon]) => (
          <Link key={k} href={href(k)} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold ${tab === k ? "border-brand-deep bg-brand-deep text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}><Icon className="h-4 w-4" />{label}</Link>
        ))}
      </div>

      {tab === "cho" && (
        <Panel icon={FileText} title={`Khám xong, chờ lập hóa đơn (${pending.length})`} pad={false}>
          {pending.length === 0 && <p className="p-4 text-sm text-brand-ink/60">Không có.</p>}
          <div className="divide-y divide-slate-100">
            {pending.map((v) => (
              <form key={v.id} action={createExamInvoice} className="flex flex-wrap items-end gap-3 p-4">
                <input type="hidden" name="visitId" value={v.id} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{v.queueNo}. {v.patient.fullName}</div>
                  <div className="text-xs text-brand-ink/60">{patientCode(v.patient.seq)} · {v.exam?.prescription?._count.lines ?? 0} dòng thuốc</div>
                </div>
                <label className="text-xs">Công khám (để trống = giá dịch vụ đầu tiên)
                  <input name="fee" inputMode="numeric" placeholder="tự động" className={`${input} w-36`} />
                </label>
                <button className={btnMain}>Lập hóa đơn</button>
              </form>
            ))}
          </div>
        </Panel>
      )}

      {tab === "le" && (
        <Panel icon={ShoppingCart} title="Bán thuốc lẻ (không khám)">
          <form action={createRetailInvoice} className="flex flex-wrap items-end gap-2">
            <input type="hidden" name="branchId" value={branch.id} />
            <label className="text-sm flex-1 min-w-[12rem]">Tên khách (không bắt buộc)
              <input name="customerName" className={input} />
            </label>
            <button className={btnMain}>Tạo hóa đơn bán lẻ</button>
          </form>
        </Panel>
      )}

      <Panel icon={Receipt} title={tab === "cho" ? `Hóa đơn chờ thanh toán (${shown.length})` : tab === "da" ? `Hóa đơn đã thanh toán (${shown.length})` : `Hóa đơn bán lẻ (${shown.length})`} pad={false}>
        {shown.length === 0 ? <p className="p-4 text-sm text-brand-ink/60">Chưa có hóa đơn.</p> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-12">STT</th><th>Số hóa đơn</th><th>Thời gian</th><th>Bệnh nhân</th><th>Nội dung</th><th className="text-right">Tổng tiền</th><th>Phương thức</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {shown.map((i, k) => (
                  <tr key={i.id} className={i.status === "VOID" ? "opacity-50" : ""}>
                    <td className="text-brand-ink/60">{k + 1}</td>
                    <td><Link href={`/thu-ngan/${i.id}`} className="font-mono text-sky-700 hover:underline">HD-{String(i.seq).padStart(6, "0")}</Link></td>
                    <td>{timeVN(i.createdAt)}</td>
                    <td className="font-semibold">{i.patient?.fullName ?? i.customerName ?? "Khách lẻ"}</td>
                    <td className="text-sm">{content(i)}</td>
                    <td className="text-right font-semibold tabular-nums">{vnd(i.total)}</td>
                    <td>{i.method ? METHOD[i.method] : "—"}</td>
                    <td><span className={`chip ${chip[i.status] ?? "chip-gray"}`}>{ST[i.status]}</span></td>
                    <td><Link href={`/thu-ngan/${i.id}`} className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">{i.status === "UNPAID" ? "Thu tiền" : "Xem"}</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
