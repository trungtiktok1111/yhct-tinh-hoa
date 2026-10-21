import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { CASHIER_ROLES } from "@/lib/permissions";
import { createExamInvoice, createRetailInvoice } from "@/actions/billing";
import { branchesFor, input } from "@/lib/stock";
import { patientCode, timeVN, vnDayStart, vnd } from "@/lib/format";
import { PageHead, Stat, Panel } from "@/components/ui";
import { Wallet, Banknote, Landmark, CreditCard, FileText, ShoppingCart, Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

const ST: Record<string, string> = { UNPAID: "Chờ thu", PAID: "Đã thu", VOID: "Đã hủy" };
const METHOD: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };
const btnMain = "rounded-xl bg-brand-deep text-white px-4 py-2.5 font-semibold hover:bg-brand-deeper";

export default async function CashierPage({ searchParams }: { searchParams: { cn?: string; loi?: string } }) {
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
  const since = vnDayStart();
  const [pending, invoices] = await Promise.all([
    prisma.visit.findMany({
      where: { branchId: branch.id, createdAt: { gte: since }, status: "DONE", invoice: null, exam: { status: "FINAL" } },
      orderBy: { queueNo: "asc" },
      include: { patient: true, exam: { select: { prescription: { select: { _count: { select: { lines: true } } } } } } },
    }),
    prisma.invoice.findMany({
      where: { branchId: branch.id, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      include: { patient: { select: { fullName: true } } },
    }),
  ]);
  const paid = invoices.filter((i) => i.status === "PAID");
  const sum = (m?: string) => paid.filter((i) => !m || i.method === m).reduce((s, i) => s + i.total, 0);

  const n = (m: string) => paid.filter((i) => i.method === m).length;
  const chip: Record<string, string> = { UNPAID: "chip-amber", PAID: "chip-green", VOID: "chip-gray" };
  return (
    <div className="space-y-4">
      <PageHead icon={Wallet} title="Thu ngân" sub="Thanh toán khám bệnh, thuốc và các dịch vụ y học cổ truyền" img="/images/art/scale.jpg" />
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={Wallet} label="Đã thu hôm nay" value={vnd(sum())} unit={`${paid.length} hóa đơn`} tone="gold" />
        <Stat icon={Banknote} label="Tiền mặt" value={vnd(sum("CASH"))} unit={`${n("CASH")} hóa đơn`} tone="green" />
        <Stat icon={Landmark} label="Chuyển khoản" value={vnd(sum("TRANSFER"))} unit={`${n("TRANSFER")} hóa đơn`} tone="blue" />
        <Stat icon={CreditCard} label="Thẻ" value={vnd(sum("CARD"))} unit={`${n("CARD")} hóa đơn`} tone="purple" />
      </div>

      <div className="grid xl:grid-cols-2 gap-4 items-start">
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
                <label className="text-xs">Công khám (đồng)
                  <input name="fee" inputMode="numeric" placeholder="0" className={`${input} w-36`} />
                </label>
                <button className={btnMain}>Lập hóa đơn</button>
              </form>
            ))}
          </div>
        </Panel>

        <Panel icon={ShoppingCart} title="Bán thuốc lẻ (không khám)">
          <form action={createRetailInvoice} className="flex flex-wrap items-end gap-2">
            <input type="hidden" name="branchId" value={branch.id} />
            <label className="text-sm flex-1 min-w-[12rem]">Tên khách (không bắt buộc)
              <input name="customerName" className={input} />
            </label>
            <button className={btnMain}>Tạo hóa đơn bán lẻ</button>
          </form>
        </Panel>
      </div>

      <Panel icon={Receipt} title={`Hóa đơn hôm nay (${invoices.length})`} pad={false}>
        {invoices.length === 0 ? <p className="p-4 text-sm text-brand-ink/60">Chưa có hóa đơn.</p> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Số hóa đơn</th><th>Thời gian</th><th>Bệnh nhân</th><th>Nội dung</th><th className="text-right">Tổng tiền</th><th>Phương thức</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className={i.status === "VOID" ? "opacity-50" : ""}>
                    <td><Link href={`/thu-ngan/${i.id}`} className="font-mono text-sky-700 hover:underline">HD-{String(i.seq).padStart(6, "0")}</Link></td>
                    <td>{timeVN(i.createdAt)}</td>
                    <td className="font-semibold">{i.patient?.fullName ?? i.customerName ?? "Khách lẻ"}</td>
                    <td>{i.kind === "RETAIL" ? "Bán lẻ" : "Khám"}</td>
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
