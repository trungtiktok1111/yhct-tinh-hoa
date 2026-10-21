import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { CASHIER_ROLES, ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";
import { addRetailLine, addServiceLine, adjustInvoice, removeInvoiceLine, updateInvoiceLine, voidInvoice } from "@/actions/billing";
import { input } from "@/lib/stock";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { PrintButton } from "@/components/PrintButton";
import { PayBox } from "@/components/PayBox";
import { patientCode, qty as fq, vnd } from "@/lib/format";
import { ageOf } from "@/lib/person";
import { PageHead } from "@/components/ui";
import { Receipt, User, Stethoscope, Pill, Trash2, Plus, Save, Calculator, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

const ST: Record<string, string> = { UNPAID: "Chờ thu", PAID: "Đã thu", VOID: "Đã hủy" };
const METHOD: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };
const num = "w-16 rounded-lg border border-slate-300 px-2 py-1 text-right text-sm";

function Sec({ n, icon: Icon, title, children }: { n: number; icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <section className="card !p-0 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 font-bold">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-deep text-xs text-white">{n}</span>
        <Icon className="h-4 w-4 text-emerald-700" />{title}
      </div>
      {children}
    </section>
  );
}

export default async function InvoicePage({ params, searchParams }: { params: { id: string }; searchParams: { loi?: string } }) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { lines: { orderBy: { position: "asc" } }, patient: true, branch: { select: { name: true, address: true, phone: true } } },
  });
  if (!inv) notFound();
  if (!staff.isOwner && !staff.branchIds.includes(inv.branchId)) redirect("/khong-co-quyen");
  const open = inv.status === "UNPAID";
  const [items, services] = open
    ? await Promise.all([
        prisma.item.findMany({ where: { active: true, prices: { some: {} } }, select: { id: true, name: true, unit: true }, orderBy: { name: "asc" }, take: 1500 }),
        prisma.serviceItem.findMany({ where: { active: true }, orderBy: { position: "asc" } }),
      ])
    : [[], []];
  const hidden = <input type="hidden" name="invoiceId" value={inv.id} />;
  const who = inv.patient?.fullName ?? inv.customerName ?? "Khách lẻ";
  const chipCls = inv.status === "PAID" ? "chip-green" : inv.status === "VOID" ? "chip-gray" : "chip-amber";
  const when = inv.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const svcLines = inv.lines.filter((l) => l.kind === "FEE");
  const drugLines = inv.lines.filter((l) => l.kind !== "FEE");
  const svcTotal = svcLines.reduce((s, l) => s + l.amount, 0);
  const drugTotal = drugLines.reduce((s, l) => s + l.amount, 0);
  const canManage = hasAny(staff.roles, ITEM_MANAGER_ROLES);

  const lineRow = (l: (typeof inv.lines)[number], k: number) => (
    <tr key={l.id}>
      <td className="text-brand-ink/60">{k + 1}</td>
      <td className="text-sm">{l.name}</td>
      <td className="text-sm">{l.unit}</td>
      {open ? (
        <td colSpan={2}>
          <form action={updateInvoiceLine} className="flex items-center justify-end gap-1.5">
            {hidden}<input type="hidden" name="lineId" value={l.id} />
            <input name="qty" defaultValue={l.qty} inputMode="decimal" title="Số lượng" className={num} />
            <input name="discountPct" defaultValue={l.discountPct} inputMode="numeric" title="Giảm giá %" className={`${num} w-12`} /><span className="text-xs">%</span>
            <button title="Lưu dòng" className="rounded-lg border border-slate-300 p-1.5 hover:bg-slate-50"><Save className="h-4 w-4" /></button>
          </form>
        </td>
      ) : (<><td className="text-right text-sm">{fq(l.qty)}</td><td className="text-right text-sm">{l.discountPct}%</td></>)}
      <td className="text-right text-sm tabular-nums">{vnd(l.unitPrice)}</td>
      <td className="text-right text-sm font-semibold tabular-nums">{vnd(l.amount)}</td>
      <td>{open && <form action={removeInvoiceLine}>{hidden}<input type="hidden" name="lineId" value={l.id} /><button title="Bỏ dòng" className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></form>}</td>
    </tr>
  );
  const head = <thead><tr><th className="w-10">STT</th><th>Nội dung</th><th>ĐVT</th><th className="text-right" colSpan={2}>SL · Giảm giá</th><th className="text-right">Đơn giá</th><th className="text-right">Thành tiền</th><th /></tr></thead>;

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

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_21rem_21rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4 print:hidden xl:col-span-1">
          <Sec n={1} icon={User} title="Thông tin bệnh nhân">
            <div className="grid gap-x-6 gap-y-2 p-4 text-sm sm:grid-cols-4">
              <div><div className="text-xs text-brand-ink/55">Khách</div><b>{who}</b></div>
              <div><div className="text-xs text-brand-ink/55">Mã BN</div><b>{inv.patient ? patientCode(inv.patient.seq) : "—"}</b></div>
              <div><div className="text-xs text-brand-ink/55">Tuổi</div><b>{inv.patient ? ageOf(inv.patient.birthDate, inv.patient.birthYear) : "—"}</b></div>
              <div><div className="text-xs text-brand-ink/55">Số điện thoại</div><b>{inv.patient?.phone ?? "—"}</b></div>
              <div className="sm:col-span-4"><div className="text-xs text-brand-ink/55">Địa chỉ</div><b>{inv.patient ? [inv.patient.address, inv.patient.ward, inv.patient.district, inv.patient.province].filter(Boolean).join(", ") || "—" : "—"}</b></div>
            </div>
          </Sec>

          <Sec n={2} icon={Stethoscope} title="Danh sách dịch vụ">
            <div className="overflow-x-auto">
              <table>
                {head}
                <tbody>
                  {svcLines.length === 0 && <tr><td colSpan={8} className="p-3 text-sm text-brand-ink/60">Chưa có dịch vụ.</td></tr>}
                  {svcLines.map((l, k) => lineRow(l, k))}
                </tbody>
              </table>
            </div>
            {open && (
              <form action={addServiceLine} className="flex flex-wrap items-end gap-2 border-t border-slate-100 p-3">
                {hidden}
                <select name="serviceId" required defaultValue="" className={`${input} min-w-[14rem] flex-1`}>
                  <option value="" disabled>Chọn dịch vụ…</option>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.name} — {vnd(s.price)}</option>)}
                </select>
                <input name="qty" defaultValue={1} inputMode="decimal" className={`${input} w-20`} />
                <button className="flex items-center gap-1.5 rounded-xl border border-brand-deep px-4 py-2.5 font-semibold text-brand-deep hover:bg-emerald-50"><Plus className="h-4 w-4" />Thêm dịch vụ</button>
                {canManage && <Link href="/thu-ngan/dich-vu" className="text-xs text-brand-deep underline">Quản lý danh mục dịch vụ</Link>}
              </form>
            )}
          </Sec>

          <Sec n={3} icon={Pill} title="Danh sách thuốc">
            <div className="overflow-x-auto">
              <table>
                {head}
                <tbody>
                  {drugLines.length === 0 && <tr><td colSpan={8} className="p-3 text-sm text-brand-ink/60">Chưa có thuốc.</td></tr>}
                  {drugLines.map((l, k) => lineRow(l, k))}
                </tbody>
              </table>
            </div>
            {open && (
              <form action={addRetailLine} className="flex flex-wrap items-end gap-2 border-t border-slate-100 p-3">
                {hidden}
                <select name="itemId" defaultValue="" required className={`${input} min-w-[14rem] flex-1`}>
                  <option value="" disabled>Chọn thuốc / mặt hàng…</option>
                  {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                </select>
                <input name="qty" required placeholder="SL" inputMode="decimal" className={`${input} w-24`} />
                <button className="flex items-center gap-1.5 rounded-xl border border-brand-deep px-4 py-2.5 font-semibold text-brand-deep hover:bg-emerald-50"><Plus className="h-4 w-4" />Thêm thuốc</button>
              </form>
            )}
          </Sec>
        </div>

        <div className="space-y-4 print:hidden">
          <Sec n={4} icon={Calculator} title="Tóm tắt thanh toán">
            <div className="space-y-2 p-4 text-sm">
              <div className="flex justify-between"><span>Tổng tiền dịch vụ</span><b className="tabular-nums">{vnd(svcTotal)}</b></div>
              <div className="flex justify-between"><span>Tổng tiền thuốc</span><b className="tabular-nums">{vnd(drugTotal)}</b></div>
              {open ? (
                <form action={adjustInvoice} className="space-y-2 border-t border-slate-100 pt-2">
                  {hidden}
                  <label className="flex items-center justify-between gap-2">Giảm giá chung (%)
                    <input name="discountPct" defaultValue={inv.discountPct} inputMode="numeric" className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-right" />
                  </label>
                  <label className="flex items-center justify-between gap-2">VAT
                    <select name="vatPct" defaultValue={inv.vatPct} className="rounded-lg border border-slate-300 px-2 py-1"><option value={0}>0%</option><option value={5}>5%</option><option value={8}>8%</option><option value={10}>10%</option></select>
                  </label>
                  <label className="block">Ghi chú<input name="note" defaultValue={inv.note ?? ""} className={`${input} !py-1.5`} /></label>
                  <button className="w-full rounded-lg border border-slate-300 py-1.5 text-sm font-semibold hover:bg-slate-50">Cập nhật</button>
                </form>
              ) : (
                <>
                  {inv.discount > 0 && <div className="flex justify-between"><span>Giảm giá chung ({inv.discountPct}%)</span><b>-{vnd(inv.discount)}</b></div>}
                  {inv.vat > 0 && <div className="flex justify-between"><span>VAT ({inv.vatPct}%)</span><b>{vnd(inv.vat)}</b></div>}
                </>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-2"><span>Tạm tính</span><b className="tabular-nums">{vnd(inv.subtotal)}</b></div>
              {open && (inv.discount > 0 || inv.vat > 0) && <div className="flex justify-between text-xs text-brand-ink/60"><span>Giảm {vnd(inv.discount)} · VAT {vnd(inv.vat)}</span></div>}
              <div className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2.5"><span className="font-bold">Tổng thanh toán</span><b className="text-2xl text-amber-600 tabular-nums">{vnd(inv.total)}</b></div>
            </div>
          </Sec>

          <Sec n={5} icon={CreditCard} title="Phương thức thanh toán">
            <div className="space-y-3 p-4">
              {open ? <PayBox invoiceId={inv.id} total={inv.total} /> : (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Hình thức</span><b>{inv.method ? METHOD[inv.method] : "—"}</b></div>
                  {inv.cashGiven != null && <><div className="flex justify-between"><span>Khách đưa</span><b>{vnd(inv.cashGiven)}</b></div><div className="flex justify-between"><span>Tiền thừa</span><b>{vnd(inv.cashGiven - inv.total)}</b></div></>}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {inv.status !== "VOID" && <PrintButton label="In hóa đơn" />}
                {inv.status === "PAID" && <PrintButton label="In phiếu thu" />}
                <Link href="/thu-ngan" className="rounded-xl border border-slate-300 py-2 text-center text-sm font-semibold hover:bg-slate-50">Quay lại</Link>
              </div>
              {inv.status !== "VOID" && (
                <form action={voidInvoice} className="flex items-center gap-2 border-t border-slate-100 pt-3">
                  {hidden}
                  <input name="reason" placeholder="Lý do hủy" className={`${input} !py-1.5`} />
                  <ConfirmSubmit message="Hủy hóa đơn này?">Hủy</ConfirmSubmit>
                </form>
              )}
            </div>
          </Sec>
        </div>

        <section className="card space-y-3 text-sm xl:sticky xl:top-[4.5rem] 2xl:col-start-3 xl:col-start-2 print:border-0 print:shadow-none">
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
            <div>Họ tên: <b className="text-brand-ink">{who}</b>{inv.patient ? ` · ${patientCode(inv.patient.seq)} · ${ageOf(inv.patient.birthDate, inv.patient.birthYear)} tuổi` : ""}</div>
          </div>
          <table className="!text-xs">
            <thead><tr><th>Nội dung</th><th className="text-right">SL</th><th className="text-right">Đơn giá</th><th className="text-right">Thành tiền</th></tr></thead>
            <tbody>{inv.lines.map((l) => <tr key={l.id}><td>{l.name}{l.discountPct > 0 ? ` (-${l.discountPct}%)` : ""}</td><td className="text-right">{fq(l.qty)}</td><td className="text-right tabular-nums">{vnd(l.unitPrice)}</td><td className="text-right tabular-nums">{vnd(l.amount)}</td></tr>)}</tbody>
          </table>
          <div className="space-y-1 border-t pt-2 text-xs">
            <div className="flex justify-between"><span>Tổng tiền dịch vụ</span><span>{vnd(svcTotal)}</span></div>
            <div className="flex justify-between"><span>Tổng tiền thuốc</span><span>{vnd(drugTotal)}</span></div>
            {inv.discount > 0 && <div className="flex justify-between"><span>Giảm giá</span><span>-{vnd(inv.discount)}</span></div>}
            {inv.vat > 0 && <div className="flex justify-between"><span>VAT ({inv.vatPct}%)</span><span>{vnd(inv.vat)}</span></div>}
            <div className="flex justify-between text-base font-bold"><span>Tổng thanh toán</span><span>{vnd(inv.total)}</span></div>
            {inv.method && <div className="flex justify-between"><span>Hình thức</span><span>{METHOD[inv.method]}</span></div>}
            {inv.cashGiven != null && <div className="flex justify-between"><span>Khách đưa / Tiền thừa</span><span>{vnd(inv.cashGiven)} / {vnd(inv.cashGiven - inv.total)}</span></div>}
          </div>
          <div className="text-center text-xs italic text-brand-ink/60">Cảm ơn Quý khách! Chúc Quý khách luôn mạnh khỏe!</div>
        </section>
      </div>
    </div>
  );
}
