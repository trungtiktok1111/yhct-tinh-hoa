import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { CASHIER_ROLES } from "@/lib/permissions";
import { createExamInvoice, createRetailInvoice } from "@/actions/billing";
import { branchesFor, input } from "@/lib/stock";
import { patientCode, timeVN, vnDayStart, vnd } from "@/lib/format";

export const dynamic = "force-dynamic";

const ST: Record<string, string> = { UNPAID: "Chờ thu", PAID: "Đã thu", VOID: "Đã hủy" };
const METHOD: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };
const btnMain = "rounded-lg bg-brand-deep text-brand-cream px-4 py-2.5 font-semibold";

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

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold font-display">Thu ngân hôm nay</h1>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      <form method="get" className="flex items-end gap-2">
        <label className="text-sm flex-1">Chi nhánh
          <select name="cn" defaultValue={branch.id} className={input}>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <button className="rounded-lg border border-brand-gold/50 px-4 py-2.5">Xem</button>
      </form>

      <div className="grid gap-2 sm:grid-cols-4 text-sm">
        <div className="card !py-3"><div className="text-gray-600">Đã thu</div><div className="text-xl font-bold">{vnd(sum())}</div></div>
        <div className="card !py-3"><div className="text-gray-600">Tiền mặt</div><div className="font-semibold">{vnd(sum("CASH"))}</div></div>
        <div className="card !py-3"><div className="text-gray-600">Chuyển khoản</div><div className="font-semibold">{vnd(sum("TRANSFER"))}</div></div>
        <div className="card !py-3"><div className="text-gray-600">Thẻ</div><div className="font-semibold">{vnd(sum("CARD"))}</div></div>
      </div>

      <section className="space-y-2">
        <h2 className="font-semibold text-brand-deep">Khám xong, chờ lập hóa đơn ({pending.length})</h2>
        {pending.length === 0 && <p className="text-sm text-gray-600">Không có.</p>}
        {pending.map((v) => (
          <form key={v.id} action={createExamInvoice} className="card !py-3 flex flex-wrap items-end gap-3">
            <input type="hidden" name="visitId" value={v.id} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-brand-deep">{v.queueNo}. {v.patient.fullName}</div>
              <div className="text-xs text-gray-600">{patientCode(v.patient.seq)} · {v.exam?.prescription?._count.lines ?? 0} dòng thuốc</div>
            </div>
            <label className="text-xs">Công khám (đồng)
              <input name="fee" inputMode="numeric" placeholder="0" className={`${input} w-36`} />
            </label>
            <button className={btnMain}>Lập hóa đơn</button>
          </form>
        ))}
      </section>

      <section className="card space-y-2">
        <h2 className="font-semibold text-brand-deep">Bán thuốc lẻ (không khám)</h2>
        <form action={createRetailInvoice} className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="branchId" value={branch.id} />
          <label className="text-sm flex-1 min-w-[12rem]">Tên khách (không bắt buộc)
            <input name="customerName" className={input} />
          </label>
          <button className={btnMain}>Tạo hóa đơn bán lẻ</button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-brand-deep">Hóa đơn hôm nay ({invoices.length})</h2>
        {invoices.length === 0 && <p className="text-sm text-gray-600">Chưa có hóa đơn.</p>}
        {invoices.map((i) => (
          <Link key={i.id} href={`/thu-ngan/${i.id}`} className={`card !py-3 flex flex-wrap items-center gap-3 ${i.status === "VOID" ? "opacity-50" : ""}`}>
            <span className="font-mono text-sm">HD-{String(i.seq).padStart(6, "0")}</span>
            <span className="flex-1 min-w-0 truncate">{i.patient?.fullName ?? i.customerName ?? "Khách lẻ"} · {i.kind === "RETAIL" ? "Bán lẻ" : "Khám"} · {timeVN(i.createdAt)}</span>
            <span className="font-semibold tabular-nums">{vnd(i.total)}</span>
            <span className="text-sm">{ST[i.status]}{i.method ? ` · ${METHOD[i.method]}` : ""}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
