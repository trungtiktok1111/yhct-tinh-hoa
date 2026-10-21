import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { CASHIER_ROLES } from "@/lib/permissions";
import { addRetailLine, adjustInvoice, payInvoice, removeInvoiceLine, voidInvoice } from "@/actions/billing";
import { input } from "@/lib/stock";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { PrintButton } from "@/components/PrintButton";
import { patientCode, qty as fq, vnd } from "@/lib/format";

export const dynamic = "force-dynamic";

const ST: Record<string, string> = { UNPAID: "Chờ thu", PAID: "Đã thu", VOID: "Đã hủy" };
const METHOD: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };
const btnMain = "rounded-lg bg-brand-deep text-brand-cream px-4 py-2.5 font-semibold";

export default async function InvoicePage({ params, searchParams }: { params: { id: string }; searchParams: { loi?: string } }) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { lines: { orderBy: { position: "asc" } }, patient: true, branch: { select: { name: true, address: true, phone: true } } },
  });
  if (!inv) notFound();
  if (!staff.isOwner && !staff.branchIds.includes(inv.branchId)) redirect("/khong-co-quyen");
  const open = inv.status === "UNPAID";
  const feeLine = inv.lines.find((l) => l.kind === "FEE");

  const items = open && inv.kind === "RETAIL"
    ? await prisma.item.findMany({ where: { active: true, prices: { some: {} } }, select: { id: true, name: true, unit: true }, orderBy: { name: "asc" }, take: 1500 })
    : [];
  const hidden = <input type="hidden" name="invoiceId" value={inv.id} />;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="print:hidden"><BackLink href="/thu-ngan" label="Thu ngân" /></div>
      <div>
        <h1 className="text-2xl font-bold font-display">Hóa đơn HD-{String(inv.seq).padStart(6, "0")}</h1>
        <div className="text-sm text-gray-700">
          {inv.branch.name} · {inv.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} · {ST[inv.status]}
          {inv.method ? ` · ${METHOD[inv.method]}` : ""}
        </div>
        <div className="text-sm">
          Khách: <b>{inv.patient ? `${inv.patient.fullName} (${patientCode(inv.patient.seq)})` : inv.customerName || "Khách lẻ"}</b>
          {inv.staffName ? ` · Thu ngân: ${inv.staffName}` : ""}
        </div>
        {inv.status === "VOID" && <div className="warn-box text-sm mt-2">Đã hủy: {inv.voidReason}</div>}
      </div>
      {searchParams.loi && <div className="warn-box text-sm print:hidden">{searchParams.loi}</div>}

      <div className="card !p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr><th className="p-2">Mặt hàng</th><th className="p-2 text-right">SL</th><th className="p-2 text-right">Đơn giá</th><th className="p-2 text-right">Thành tiền</th><th className="p-2 print:hidden" /></tr>
          </thead>
          <tbody>
            {inv.lines.length === 0 && <tr><td colSpan={5} className="p-3 text-gray-600">Chưa có dòng nào.</td></tr>}
            {inv.lines.map((l) => (
              <tr key={l.id} className="border-t border-brand-gold/20">
                <td className="p-2">{l.name}</td>
                <td className="p-2 text-right tabular-nums">{fq(l.qty)} {l.unit}</td>
                <td className="p-2 text-right tabular-nums">{vnd(l.unitPrice)}</td>
                <td className="p-2 text-right tabular-nums">{vnd(l.amount)}</td>
                <td className="p-2 print:hidden">
                  {open && l.kind !== "FEE" && (
                    <form action={removeInvoiceLine}>{hidden}<input type="hidden" name="lineId" value={l.id} /><ConfirmSubmit message="Bỏ dòng này?">Bỏ</ConfirmSubmit></form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-brand-gold/40">
            <tr><td colSpan={3} className="p-2 text-right">Tạm tính</td><td className="p-2 text-right tabular-nums">{vnd(inv.subtotal)}</td><td /></tr>
            {inv.discount > 0 && <tr><td colSpan={3} className="p-2 text-right">Giảm giá</td><td className="p-2 text-right tabular-nums">-{vnd(inv.discount)}</td><td /></tr>}
            <tr className="font-bold text-base"><td colSpan={3} className="p-2 text-right">Cần thu</td><td className="p-2 text-right tabular-nums">{vnd(inv.total)}</td><td /></tr>
          </tfoot>
        </table>
      </div>
      {inv.note && <p className="text-sm">Ghi chú: {inv.note}</p>}

      {open && inv.kind === "RETAIL" && (
        <form action={addRetailLine} className="card flex flex-wrap items-end gap-2 print:hidden">
          {hidden}
          <label className="text-sm flex-1 min-w-[12rem]">Thêm hàng
            <select name="itemId" defaultValue="" required className={input}>
              <option value="" disabled>Chọn mặt hàng</option>
              {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
            </select>
          </label>
          <label className="text-sm">Số lượng
            <input name="qty" type="number" step="any" min="0" required className={`${input} w-28`} />
          </label>
          <button className="rounded-lg border border-brand-gold/50 px-4 py-2.5">Thêm</button>
        </form>
      )}

      {open && (
        <div className="grid gap-3 sm:grid-cols-2 print:hidden">
          <form action={adjustInvoice} className="card space-y-2">
            {hidden}
            <h2 className="font-semibold text-brand-deep">Điều chỉnh</h2>
            {inv.kind === "EXAM" && (
              <label className="block text-sm">Công khám (đồng)
                <input name="fee" inputMode="numeric" defaultValue={feeLine?.amount ?? 0} className={input} />
              </label>
            )}
            <label className="block text-sm">Giảm giá (đồng)
              <input name="discount" inputMode="numeric" defaultValue={inv.discount} className={input} />
            </label>
            <label className="block text-sm">Ghi chú
              <input name="note" defaultValue={inv.note ?? ""} className={input} />
            </label>
            <button className="rounded-lg border border-brand-gold/50 px-4 py-2">Lưu điều chỉnh</button>
          </form>
          <form action={payInvoice} className="card space-y-2">
            {hidden}
            <h2 className="font-semibold text-brand-deep">Thu tiền: {vnd(inv.total)}</h2>
            <label className="block text-sm">Hình thức
              <select name="method" defaultValue="CASH" className={input}>
                {Object.entries(METHOD).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <ConfirmSubmit message={`Xác nhận đã thu ${vnd(inv.total)}?`} className={btnMain}>Xác nhận đã thu</ConfirmSubmit>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-2 print:hidden">
        {inv.status !== "VOID" && <PrintButton />}
        {inv.status !== "VOID" && (
          <form action={voidInvoice} className="flex flex-wrap items-center gap-2">
            {hidden}
            <input name="reason" placeholder="Lý do hủy" className={`${input} w-56`} />
            <ConfirmSubmit message="Hủy hóa đơn này?">Hủy hóa đơn</ConfirmSubmit>
          </form>
        )}
      </div>
    </div>
  );
}
