import { requireStaff } from "@/lib/auth";
import { branchesFor } from "@/lib/stock";
import { hasAny, ITEM_MANAGER_ROLES } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { voidVoucher } from "@/actions/voucher";
import { KIND_NAME } from "@/lib/voucher";
import { FORMS, GROUPS, type FormDef } from "@/lib/forms";
import { PageHead } from "@/components/ui";
import { FileSpreadsheet, Download, Upload } from "lucide-react";
import { DateInput } from "@/components/DateInput";

export const dynamic = "force-dynamic";

const okDay = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v)) ? v : undefined);
const nowVN = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);

export default async function FormsPage({ searchParams }: { searchParams: { cn?: string; tu?: string; den?: string; msg?: string } }) {
  const staff = await requireStaff();
  const branches = await branchesFor(staff);
  const today = nowVN();
  const tu = okDay(searchParams.tu) ?? today.slice(0, 8) + "01";
  const den = okDay(searchParams.den) ?? today;
  const cn = branches.find((b) => b.id === searchParams.cn)?.id ?? (branches.length === 1 ? branches[0].id : "");
  const canVoid = hasAny(staff.roles, ITEM_MANAGER_ROLES);
  const vouchers = canVoid
    ? ((await prisma.voucher.findMany({ orderBy: [{ issuedAt: "desc" }], take: 40 })) as unknown as { code: string; kind: string; status: string; issuedAt: Date; issuedBy: string | null; usedAt: Date | null; usedBy: string | null; voidedAt: Date | null }[])
    : [];
  const when = (d: Date | null) => (d ? d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "");
  const mine = FORMS.filter((f) => hasAny(staff.roles, f.roles));

  const link = (f: FormDef) => {
    const q = new URLSearchParams();
    if (f.branch && (cn || branches[0])) q.set("cn", cn || (f.group === "Kho" ? branches[0].id : ""));
    if (f.period) { q.set("tu", tu); q.set("den", den); }
    for (const [k, v] of [...q]) if (!v) q.delete(k);
    return `${f.href}${q.toString() ? `?${q}` : ""}`;
  };
  const cls = "mt-0.5 block rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-brand-ink";

  return (
    <div className="space-y-4">
      <PageHead icon={FileSpreadsheet} title="Biểu mẫu và báo cáo" sub="Mọi file Excel của app nằm ở đây. Chỉ tải từ đây để file luôn đúng mẫu chuẩn, không tự tạo file riêng." />

      {searchParams.msg && <div className="card !bg-green-50 text-sm text-green-800">{searchParams.msg}</div>}
      <form method="get" className="card !p-3 flex flex-wrap items-end gap-3">
        <label className="text-xs text-brand-ink/65">Chi nhánh
          <select name="cn" defaultValue={cn} className={cls}>
            {branches.length > 1 && <option value="">Tất cả (báo cáo doanh thu, khám)</option>}
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label className="text-xs text-brand-ink/65">Từ ngày<DateInput name="tu" defaultValue={tu} className={cls} /></label>
        <label className="text-xs text-brand-ink/65">Đến ngày<DateInput name="den" defaultValue={den} className={cls} /></label>
        <button type="submit" className="rounded-xl bg-brand-deep px-5 py-2.5 text-sm font-semibold text-white">Áp dụng</button>
        <p className="ml-auto max-w-sm text-xs text-brand-ink/60">Chi nhánh và kỳ áp dụng cho các file có chọn kỳ hoặc chi nhánh. Báo cáo kho luôn theo một chi nhánh.</p>
      </form>

      {GROUPS.map((g) => {
        const list = mine.filter((f) => f.group === g);
        if (!list.length) return null;
        return (
          <section key={g} className="space-y-2">
            <h2 className="px-1 text-sm font-semibold text-brand-ink/75">{g}</h2>
            <div className="grid gap-3 lg:grid-cols-2">
              {list.map((f) => (
                <article key={f.id} className="card flex flex-col gap-2 !p-4">
                  <div className="flex items-start gap-2">
                    <h3 className="font-semibold leading-snug">{f.name}</h3>
                    <span className={`ml-auto shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${f.kind === "mau" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{f.kind === "mau" ? "Mẫu điền" : "Báo cáo"}</span>
                  </div>
                  <p className="text-sm text-brand-ink/75">{f.desc}</p>
                  <p className="text-xs text-brand-ink/60"><span className="font-medium">Cột chính:</span> {f.cols}</p>
                  <p className="text-xs text-brand-ink/60">
                    {f.period ? "Theo kỳ" : "Tại thời điểm tải"}{f.branch ? " · theo chi nhánh" : ""}{f.extra ? ` · ${f.extra}` : ""}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    <a href={link(f)} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-deep px-4 py-2 text-sm font-semibold text-white"><Download className="h-4 w-4" />Tải {f.kind === "mau" ? "mẫu" : "báo cáo"}</a>
                    {f.upload && <a href={f.upload.href} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:border-brand-deep"><Upload className="h-4 w-4" />{f.upload.label}</a>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}


      {canVoid && (
        <section id="so-phieu" className="scroll-mt-20 space-y-2">
          <h2 className="px-1 text-sm font-semibold text-brand-ink/75">Sổ số phiếu (40 phiếu gần nhất)</h2>
          <p className="px-1 text-xs text-brand-ink/60">Mỗi lần tải mẫu điền, app cấp một số phiếu liên tục trong ngày (vd PN-20261022-001, -002). Số chỉ dùng một lần. Phiếu tải về mà không nhập thì vẫn “Đã cấp”; hủy nếu không dùng nữa. Số đã hủy không cấp lại để dãy số luôn liên tục, dễ đối chiếu.</p>
          <div className="card overflow-x-auto !p-0">
            <table>
              <thead><tr><th>Số phiếu</th><th>Loại</th><th>Cấp lúc</th><th>Người cấp</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {vouchers.map((v) => (
                  <tr key={v.code} className={v.status === "ISSUED" ? "bg-red-50" : undefined}>
                    <td className="font-mono font-semibold">{v.code}</td>
                    <td>{KIND_NAME[v.kind] ?? v.kind}</td>
                    <td className="tabular-nums">{when(v.issuedAt)}</td>
                    <td>{v.issuedBy ?? ""}</td>
                    <td>
                      {v.status === "ISSUED" && <span className="chip chip-amber">Đã cấp, chưa nhập</span>}
                      {v.status === "USED" && <span className="chip chip-green">Đã nhập {when(v.usedAt)}{v.usedBy ? ` · ${v.usedBy}` : ""}</span>}
                      {v.status === "VOID" && <span className="chip chip-red">Đã hủy {when(v.voidedAt)}</span>}
                    </td>
                    <td>
                      {v.status === "ISSUED" && (
                        <form action={voidVoucher}>
                          <input type="hidden" name="code" value={v.code} />
                          <button className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-800">Hủy phiếu</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {vouchers.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-brand-ink/70">Chưa cấp số phiếu nào.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
