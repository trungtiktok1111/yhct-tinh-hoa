import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DISPENSE_ROLES } from "@/lib/permissions";
import { dispenseInvoice } from "@/actions/dispense";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { PrintButton } from "@/components/PrintButton";
import { patientCode, qty as fq } from "@/lib/format";
import { itemTitle, herbTitle } from "@/lib/viName";

export const dynamic = "force-dynamic";

export default async function DispensePage({ params, searchParams }: { params: { id: string }; searchParams: { loi?: string } }) {
  const staff = await requireRole(...DISPENSE_ROLES);
  const inv = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      lines: { orderBy: { position: "asc" } },
      patient: true,
      branch: { select: { name: true } },
      visit: { include: { exam: { include: { prescription: { include: { lines: true } } } } } },
    },
  });
  if (!inv) notFound();
  if (!staff.isOwner && !staff.branchIds.includes(inv.branchId)) redirect("/khong-co-quyen");

  const drugLines = inv.lines.filter((l) => l.itemId);
  const stockRows = await prisma.stockLot.groupBy({
    by: ["itemId"],
    where: {
      branchId: inv.branchId, itemId: { in: drugLines.map((l) => l.itemId as string) }, qtyRemaining: { gt: 0 },
      OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
    },
    _sum: { qtyRemaining: true },
  });
  const stock = new Map(stockRows.map((r) => [r.itemId, r._sum.qtyRemaining ?? 0]));
  const lacking = drugLines.some((l) => (stock.get(l.itemId as string) ?? 0) + 1e-9 < l.qty);
  const rx = inv.visit?.exam?.prescription;
  const usageOf = (itemId: string | null) => rx?.lines.find((l) => l.itemId === itemId)?.usage;
  const canDispense = inv.status === "PAID" && !inv.dispensedAt;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="print:hidden"><BackLink href="/duoc" label="Phát thuốc" /></div>
      <div>
        <h1 className="text-2xl font-bold font-display">Phát thuốc · HD-{String(inv.seq).padStart(6, "0")}</h1>
        <div className="text-sm">
          Khách: <b>{inv.patient ? `${inv.patient.fullName} (${patientCode(inv.patient.seq)})` : inv.customerName || "Khách lẻ"}</b> · {inv.branch.name}
        </div>
        {inv.patient?.allergies && <div className="warn-box text-sm mt-2"><b>Dị ứng:</b> {inv.patient.allergies}</div>}
        {inv.dispensedAt && (
          <div className="card !bg-green-50 text-sm text-green-800 mt-2">
            Đã phát lúc {inv.dispensedAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} · {inv.dispensedBy}
          </div>
        )}
        {inv.status !== "PAID" && <div className="warn-box text-sm mt-2">Hóa đơn chưa thu tiền hoặc đã hủy, chưa phát được.</div>}
      </div>
      {searchParams.loi && <div className="warn-box text-sm print:hidden">{searchParams.loi}</div>}

      {rx && (rx.thangCount > 0 || rx.decoctionNote) && (
        <div className="card text-sm">
          {rx.thangCount > 0 && <div><b>{rx.thangCount} thang</b> thuốc sắc</div>}
          {rx.decoctionNote && <div>Cách sắc/dùng: {rx.decoctionNote}</div>}
          {inv.visit?.exam?.advice && <div>Dặn dò: {inv.visit.exam.advice}</div>}
        </div>
      )}

      <div className="card !p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr><th className="p-2">Thuốc</th><th className="p-2 text-right">Số lượng</th><th className="p-2 text-right print:hidden">Tồn</th><th className="p-2">Cách dùng</th></tr>
          </thead>
          <tbody>
            {drugLines.map((l) => {
              const have = stock.get(l.itemId as string) ?? 0;
              const short = have + 1e-9 < l.qty;
              return (
                <tr key={l.id} className="border-t border-brand-gold/20">
                  <td className="p-2">{itemTitle(l.name, l.kind)}</td>
                  <td className="p-2 text-right tabular-nums">{fq(l.qty)} {l.unit}</td>
                  <td className={`p-2 text-right tabular-nums print:hidden ${short ? "text-red-700 font-semibold" : ""}`}>{fq(have)}{short ? " (thiếu)" : ""}</td>
                  <td className="p-2">{usageOf(l.itemId) ?? ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {canDispense && lacking && <div className="warn-box text-sm print:hidden">Có mặt hàng không đủ tồn (không tính lô hết hạn). Nhập thêm kho trước khi phát.</div>}
      <div className="flex flex-wrap gap-2 print:hidden">
        {canDispense && (
          <form action={dispenseInvoice}>
            <input type="hidden" name="invoiceId" value={inv.id} />
            <ConfirmSubmit message="Xác nhận phát thuốc và trừ kho?" className="rounded-lg bg-brand-deep text-brand-cream px-4 py-2.5 font-semibold">
              Phát thuốc và trừ kho
            </ConfirmSubmit>
          </form>
        )}
        <PrintButton />
      </div>
    </div>
  );
}
