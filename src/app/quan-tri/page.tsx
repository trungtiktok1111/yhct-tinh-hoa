import { prisma } from "@/lib/db";
import Link from "next/link";
import { PageHead, Stat, Panel } from "@/components/ui";
import { ShieldCheck, FileText, Clock, CheckCircle2, FilePenLine, Building2, UserCog, ScrollText, BookOpen, Leaf, Stethoscope, Fingerprint, Compass, FlaskConical, Target, type LucideIcon } from "lucide-react";
import { timeVN, dateVN } from "@/lib/format";
import { getCurrentStaff } from "@/lib/auth";
import { seedDemoData, clearDemoData } from "@/actions/demo";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: { ok?: string; loi?: string } }) {
  const staff = await getCurrentStaff();
  const entities = [
    { label: "Bệnh học", model: prisma.disease },
    { label: "Chứng hậu", model: prisma.pattern },
    { label: "Pháp trị", model: prisma.treatmentPrinciple },
    { label: "Bài thuốc", model: prisma.formula },
    { label: "Vị thuốc", model: prisma.herb },
    { label: "Huyệt vị", model: prisma.acupuncturePoint },
  ] as const;

  const rows = await Promise.all(
    entities.map(async (e) => {
      // @ts-expect-error — mỗi model đều có groupBy trên field status
      const grouped = await e.model.groupBy({ by: ["status"], _count: { status: true } });
      const byStatus: Record<string, number> = {};
      for (const g of grouped as any[]) byStatus[g.status] = g._count.status;
      return { label: e.label, byStatus };
    })
  );

  const sum = (k: string) => rows.reduce((x, r) => x + (r.byStatus[k] ?? 0), 0);
  const other = rows.reduce((x, r) => x + Object.entries(r.byStatus).filter(([k]) => !["DRAFT", "PENDING_REVIEW", "APPROVED"].includes(k)).reduce((y, [, v]) => y + v, 0), 0);
  const [branchCount, staffCount, logs] = staff?.isOwner
    ? await Promise.all([
        prisma.branch.count({ where: { active: true } }),
        prisma.staff.count({ where: { active: true } }),
        prisma.auditLog.findMany({ orderBy: { at: "desc" }, take: 6 }),
      ])
    : [0, 0, []];
  const ICON: Record<string, LucideIcon> = { "Bệnh học": Stethoscope, "Chứng hậu": Fingerprint, "Pháp trị": Compass, "Bài thuốc": FlaskConical, "Vị thuốc": Leaf, "Huyệt vị": Target };
  return (
    <div className="space-y-4">
      <PageHead icon={ShieldCheck} title="Quản trị & Thẩm định nội dung" sub="Tài khoản, phân quyền, quy trình thẩm định nội dung và trạng thái hệ thống" img="/images/art/pharmacy.jpg" />

      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">{searchParams.ok}</div>}
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {staff?.isOwner && (
        <div className="card flex flex-wrap items-center gap-3 !border-amber-300 !bg-amber-50">
          <div className="min-w-0 flex-1 text-sm"><b>Dữ liệu demo</b><div className="text-xs text-brand-ink/70">Tạo bệnh nhân, lượt khám, hóa đơn, kho mẫu để xem đủ giao diện. Đánh dấu [DEMO] và xóa được hết khi chạy thật.</div></div>
          <form action={seedDemoData}><button className="rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white hover:bg-brand-deeper">Tạo dữ liệu demo</button></form>
          <form action={clearDemoData}><ConfirmSubmit message="Xóa toàn bộ dữ liệu demo (bệnh nhân, lượt khám, hóa đơn, lô kho đánh dấu [DEMO])?">Xóa dữ liệu demo</ConfirmSubmit></form>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={FileText} label="Bản nháp" value={sum("DRAFT")} tone="amber" />
        <Stat icon={Clock} label="Chờ thẩm định" value={sum("PENDING_REVIEW")} tone="blue" />
        <Stat icon={CheckCircle2} label="Đã duyệt" value={sum("APPROVED")} tone="green" />
        <Stat icon={FilePenLine} label="Khác" value={other} unit="cần chỉnh sửa, ngừng…" tone="red" />
      </div>

      <div className="grid xl:grid-cols-[1fr_22rem] gap-4 items-start">
        <Panel pad={false} icon={BookOpen} title="Thống kê nội dung theo chuyên mục">
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-12">#</th><th>Chuyên mục</th><th className="text-center">Bản nháp</th><th className="text-center">Chờ thẩm định</th><th className="text-center">Đã duyệt</th><th className="text-center">Khác</th></tr></thead>
              <tbody>
                {rows.map((r, i) => {
                  const o = Object.entries(r.byStatus).filter(([k]) => !["DRAFT", "PENDING_REVIEW", "APPROVED"].includes(k)).reduce((x, [, v]) => x + v, 0);
                  const I = ICON[r.label] ?? BookOpen;
                  return (
                    <tr key={r.label}>
                      <td className="text-brand-ink/60">{i + 1}</td>
                      <td><span className="flex items-center gap-3 font-semibold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><I className="h-4 w-4" /></span>{r.label}</span></td>
                      <td className="text-center"><span className="chip chip-blue">{r.byStatus.DRAFT ?? 0}</span></td>
                      <td className="text-center"><span className="chip chip-amber">{r.byStatus.PENDING_REVIEW ?? 0}</span></td>
                      <td className="text-center"><span className="chip chip-green">{r.byStatus.APPROVED ?? 0}</span></td>
                      <td className="text-center"><span className="chip chip-gray">{o}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {staff?.isOwner && (
          <aside className="space-y-4">
            <Panel icon={Building2} title="Chi nhánh">
              <div className="text-sm text-brand-ink/70">{branchCount} chi nhánh đang hoạt động</div>
              <Link href="/quan-tri/chi-nhanh" className="mt-3 block rounded-xl bg-brand-deep py-2.5 text-center font-semibold text-white hover:bg-brand-deeper">Quản lý chi nhánh →</Link>
            </Panel>
            <Panel icon={UserCog} title="Nhân viên & phân quyền">
              <div className="text-sm text-brand-ink/70">{staffCount} tài khoản đang hoạt động</div>
              <Link href="/quan-tri/nhan-vien" className="mt-3 block rounded-xl bg-brand-deep py-2.5 text-center font-semibold text-white hover:bg-brand-deeper">Quản lý nhân viên →</Link>
            </Panel>
            <Panel icon={ScrollText} title="Nhật ký thao tác" right={<Link href="/quan-tri/nhat-ky" className="text-sky-700 hover:underline">Xem tất cả</Link>}>
              <ul className="space-y-2.5 text-sm">
                {logs.length === 0 && <li className="text-brand-ink/60">Chưa có.</li>}
                {logs.map((l) => (
                  <li key={l.id}>
                    <div><b>{l.staffName ?? "Hệ thống"}</b> <span className="text-brand-ink/70">{l.action} {l.entity}</span></div>
                    <div className="text-xs text-brand-ink/50">{dateVN(l.at)} {timeVN(l.at)}</div>
                  </li>
                ))}
              </ul>
            </Panel>
          </aside>
        )}
      </div>
    </div>
  );
}
