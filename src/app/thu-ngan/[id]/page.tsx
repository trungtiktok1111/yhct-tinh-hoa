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
import Image from "next/image";
import { PageHead, Panel } from "@/components/ui";
import { Receipt } from "lucide-react";

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

  const who = inv.patient?.fullName ?? inv.customerName ?? "Khách lẻ";
  const chipCls = inv.status === "PAID" ? "chip-green" : inv.status === "VOID" ? "chip-gray" : "chip-amber";
  const when = inv.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  return (
    <div className="space-y-4">
      <div className="print:hidden"><BackLink href="/thu-ngan" label="Thu ngân" /></div>
      <div className="print:hidden">
        <PageHead icon={Receipt} title={`Hóa đơn HD-${String(inv.seq).padStart(6, "0")}`} sub={`${inv.branch.name} · ${when}`} img="/images/art/scale.jpg">
          <span className={`chip ${chipCls}`}>{ST[inv.status]}{inv.method ? ` · ${METHOD[inv.method]}` : ""}</span>
        </PageHead>
      </div>
      {inv.status === "VOID" && <div className="warn-box text-sm print:hidden">Đã hủy: {inv.voidReason}</div>}
      {searchParams.loi && <div className="warn-box text-sm print:hidden">{searchParams.loi}</div>}

      <div className="grid items-start gap-4 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-4 print:hidden">
          <Panel title="1. Thông tin bệnh nhân">
            <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
              <div><span className="text-brand-ink/60">Khách: </span><b>{who}</b></div>
              {inv.patient && <div><span className="text-brand-ink/60">Mã BN: </span><b>{patientCode(inv.patient.seq)}</b></div>}
              {inv.patient && <div><span className="text-brand-ink/60">SĐT: </span><b>{inv.patient.phone}</b></div>}
              {inv.staffName && <div><span className="text-brand-ink/60">Thu ngân: </span><b>{inv.staffName}</b></div>}
            </div>
          </Panel>

          <Panel title="2. Dịch vụ và thuốc" pad={false}>
            <div className="overflow-x-auto">
              <table>
                <thead><tr><th className="w-10">STT</th><th>Nội dung</th><th className="text-right">Số lượng</th><th className="text-right">Đơn giá</th><th className="text-right">Thành tiền</th><th /></tr></thead>
                <tbody>
                  {inv.lines.length === 0 && <tr><td colSpan={6} className="p-3 text-brand-ink/60">Chưa có dòng nào.</td></tr>}
                  {inv.lines.map((l, k) => (
                    <tr key={l.id}>
                      <td className="text-brand-ink/60">{k + 1}</td>
                      <td>{l.name}</td>
                      <td className="text-right tabular-nums">{fq(l.qty)} {l.unit}</td>
                      <td className="text-right tabular-nums">{vnd(l.unitPrice)}</td>
                      <td className="text-right font-semibold tabular-nums">{vnd(l.amount)}</td>
                      <td>{open && l.kind !== "FEE" && <form action={removeInvoiceLine}>{hidden}<input type="hidden" name="lineId" value={l.id} /><ConfirmSubmit message="Bỏ dòng này?">Bỏ</ConfirmSubmit></form>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {open && inv.kind === "RETAIL" && (
              <form action={addRetailLine} className="flex flex-wrap items-end gap-2 border-t border-slate-100 p-4">
                {hidden}
                <label className="min-w-[12rem] flex-1 text-sm">Thêm hàng
                  <select name="itemId" defaultValue="" required className={input}>
                    <option value="" disabled>Chọn mặt hàng</option>
                    {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                  </select>
                </label>
                <label className="text-sm">Số lượng<input name="qty" type="number" step="any" min="0" required className={`${input} w-28`} /></label>
                <button className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold hover:bg-slate-50">Thêm</button>
              </form>
            )}
          </Panel>

          {open && (
            <div className="grid gap-4 md:grid-cols-2">
              <form action={adjustInvoice} className="card space-y-2">
                {hidden}
                <h2 className="font-bold">3. Điều chỉnh</h2>
                {inv.kind === "EXAM" && <label className="block text-sm">Công khám (đồng)<input name="fee" inputMode="numeric" defaultValue={feeLine?.amount ?? 0} className={input} /></label>}
                <label className="block text-sm">Giảm giá (đồng)<input name="discount" inputMode="numeric" defaultValue={inv.discount} className={input} /></label>
                <label className="block text-sm">Ghi chú<input name="note" defaultValue={inv.note ?? ""} className={input} /></label>
                <button className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold hover:bg-slate-50">Lưu điều chỉnh</button>
              </form>
              <form action={payInvoice} className="card space-y-3">
                {hidden}
                <h2 className="font-bold">4. Thanh toán</h2>
                <div className="rounded-xl bg-amber-50 p-3 text-center"><div className="text-sm text-brand-ink/70">Tổng thanh toán</div><div className="text-3xl font-bold text-amber-600">{vnd(inv.total)}</div></div>
                <label className="block text-sm">Hình thức
                  <select name="method" defaultValue="CASH" className={input}>{Object.entries(METHOD).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
                </label>
                <ConfirmSubmit message={`Xác nhận đã thu ${vnd(inv.total)}?`} className={`${btnMain} w-full`}>Xác nhận thanh toán</ConfirmSubmit>
              </form>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {inv.status !== "VOID" && <PrintButton label="In hóa đơn" />}
            {inv.status !== "VOID" && (
              <form action={voidInvoice} className="ml-auto flex flex-wrap items-center gap-2">
                {hidden}
                <input name="reason" placeholder="Lý do hủy" className={`${input} w-56`} />
                <ConfirmSubmit message="Hủy hóa đơn này?">Hủy hóa đơn</ConfirmSubmit>
              </form>
            )}
          </div>
        </div>

        {/* Xem trước hóa đơn (phần in) */}
        <section className="card space-y-3 text-sm xl:sticky xl:top-[4.5rem] print:border-0 print:shadow-none">
          <div className="print:hidden text-xs font-semibold uppercase tracking-wide text-brand-ink/50">Xem trước hóa đơn</div>
          <div className="text-center">
            <Image src="/images/logo-badge.png" alt="" width={56} height={56} className="mx-auto rounded-full" />
            <div className="brand-serif text-lg font-bold text-brand-deep">YHCT TINH HOA</div>
            <div className="text-xs text-brand-ink/70">{inv.branch.name}</div>
            {inv.branch.address && <div className="text-xs text-brand-ink/70">ĐC: {inv.branch.address}</div>}
            {inv.branch.phone && <div className="text-xs text-brand-ink/70">ĐT: {inv.branch.phone}</div>}
          </div>
          <div className="text-center font-bold">HÓA ĐƠN THANH TOÁN</div>
          <div className="text-xs text-brand-ink/70">
            <div>Số: HD-{String(inv.seq).padStart(6, "0")} · {when}</div>
            <div>Khách: <b className="text-brand-ink">{who}</b>{inv.patient ? ` · ${patientCode(inv.patient.seq)}` : ""}</div>
          </div>
          <table className="!text-xs">
            <thead><tr><th>Nội dung</th><th className="text-right">SL</th><th className="text-right">Thành tiền</th></tr></thead>
            <tbody>{inv.lines.map((l) => <tr key={l.id}><td>{l.name}</td><td className="text-right">{fq(l.qty)}</td><td className="text-right tabular-nums">{vnd(l.amount)}</td></tr>)}</tbody>
          </table>
          <div className="space-y-1 border-t pt-2 text-xs">
            <div className="flex justify-between"><span>Tạm tính</span><span>{vnd(inv.subtotal)}</span></div>
            {inv.discount > 0 && <div className="flex justify-between"><span>Giảm giá</span><span>-{vnd(inv.discount)}</span></div>}
            <div className="flex justify-between text-base font-bold"><span>Tổng thanh toán</span><span>{vnd(inv.total)}</span></div>
            {inv.method && <div className="flex justify-between"><span>Hình thức</span><span>{METHOD[inv.method]}</span></div>}
          </div>
          <div className="text-center text-xs italic text-brand-ink/60">Cảm ơn Quý khách! Chúc Quý khách luôn mạnh khỏe!</div>
        </section>
      </div>
    </div>
  );
}
