import { prisma } from "@/lib/db";
import Link from "next/link";
import { PageHead, Stat, Panel } from "@/components/ui";
import { DatabaseBackup, Download, Settings, ArrowRight, Search, ShieldCheck, FileText, Clock, CheckCircle2, FilePenLine, Building2, UserCog, ScrollText, BookOpen, Leaf, Stethoscope, Fingerprint, Compass, FlaskConical, Target, type LucideIcon } from "lucide-react";
import { timeVN, dateVN } from "@/lib/format";
import { getCurrentStaff } from "@/lib/auth";
import { parseRoles, ROLES } from "@/lib/permissions";
import { seedDemoData, clearDemoData } from "@/actions/demo";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: { ok?: string; loi?: string; q?: string } }) {
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
      // mỗi model đều có groupBy trên field status
      const grouped = await (e.model as any).groupBy({ by: ["status"], _count: { status: true } });
      const byStatus: Record<string, number> = {};
      for (const g of grouped as any[]) byStatus[g.status] = g._count.status;
      const last = (await (e.model as any).findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedBy: true, updatedAt: true } })) as { updatedBy: string | null; updatedAt: Date } | null;
      return { label: e.label, byStatus, last };
    })
  );

  const q = (searchParams.q ?? "").trim().toLowerCase();
  const shown = q ? rows.filter((r) => r.label.toLowerCase().includes(q)) : rows;
  const sum = (k: string) => rows.reduce((x, r) => x + (r.byStatus[k] ?? 0), 0);
  const other = rows.reduce((x, r) => x + Object.entries(r.byStatus).filter(([k]) => !["DRAFT", "PENDING_REVIEW", "APPROVED"].includes(k)).reduce((y, [, v]) => y + v, 0), 0);
  const [branches, staffRows, logs, lastBackup] = staff?.isOwner
    ? await Promise.all([
        prisma.branch.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true, address: true } }),
        prisma.staff.findMany({ where: { active: true }, select: { role: true } }),
        prisma.auditLog.findMany({ orderBy: { at: "desc" }, take: 6 }),
        prisma.backupLog.findFirst({ orderBy: { at: "desc" } }),
      ])
    : [[], [], [], null];
  const staffCount = staffRows.length;
  const admins = staffRows.filter((r) => parseRoles(r.role).includes("OWNER")).length;
  const doctors = staffRows.filter((r) => parseRoles(r.role).includes("DOCTOR")).length;
  const others = staffCount - admins - doctors;
  const dot = (a: string) => (a.startsWith("DELETE") || a.includes("FAIL") ? "bg-red-500" : a.startsWith("CREATE") || a === "LOGIN" ? "bg-emerald-500" : a === "BACKUP" ? "bg-sky-500" : "bg-amber-500");
  const LINK: Record<string, string> = { "Bệnh học": "/benh-hoc", "Chứng hậu": "/chung-hau", "Pháp trị": "/phap-tri", "Bài thuốc": "/bai-thuoc", "Vị thuốc": "/vi-thuoc", "Huyệt vị": "/cham-cuu" };
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
        <Stat icon={FilePenLine} label="Cần chỉnh sửa" value={sum("NEEDS_REVISION")} unit={other ? `+ ${other - sum("NEEDS_REVISION")} khác` : ""} tone="red" />
      </div>

      <div className="card flex flex-wrap items-center gap-2 text-sm font-semibold">
        <span className="mr-2 text-brand-ink/70">Quy trình thẩm định:</span>
        {[["Bản nháp", "chip-blue"], ["Chờ thẩm định", "chip-amber"], ["Đã duyệt", "chip-green"], ["Cần chỉnh sửa", "chip-red"]].map(([t, c], i) => (
          <span key={t} className="flex items-center gap-2">{i > 0 && <ArrowRight className="h-4 w-4 text-brand-ink/40" />}<span className={`chip ${c}`}>{i + 1}. {t}</span></span>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1fr_22rem] gap-4 items-start">
        <Panel pad={false} icon={BookOpen} title="Thống kê nội dung theo chuyên mục" right={
          <form className="flex items-center gap-1"><Search className="h-4 w-4 text-brand-ink/70" /><input name="q" defaultValue={searchParams.q ?? ""} placeholder="Tìm chuyên mục…" className="w-40 rounded-lg border border-slate-300 px-2 py-1 text-sm" /></form>
        }>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-12">#</th><th>Chuyên mục</th><th className="text-center">Bản nháp</th><th className="text-center">Chờ thẩm định</th><th className="text-center">Đã duyệt</th><th className="text-center">Cần chỉnh sửa</th><th>Người sửa cuối</th><th>Cập nhật cuối</th><th></th></tr></thead>
              <tbody>
                {shown.map((r, i) => {
                  const o = Object.entries(r.byStatus).filter(([k]) => !["DRAFT", "PENDING_REVIEW", "APPROVED"].includes(k)).reduce((x, [, v]) => x + v, 0);
                  const I = ICON[r.label] ?? BookOpen;
                  return (
                    <tr key={r.label}>
                      <td className="text-brand-ink/70">{i + 1}</td>
                      <td><span className="flex items-center gap-3 font-semibold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><I className="h-4 w-4" /></span>{r.label}</span></td>
                      <td className="text-center"><span className="chip chip-blue">{r.byStatus.DRAFT ?? 0}</span></td>
                      <td className="text-center"><span className="chip chip-amber">{r.byStatus.PENDING_REVIEW ?? 0}</span></td>
                      <td className="text-center"><span className="chip chip-green">{r.byStatus.APPROVED ?? 0}</span></td>
                      <td className="text-center"><span className="chip chip-red">{r.byStatus.NEEDS_REVISION ?? 0}</span>{o - (r.byStatus.NEEDS_REVISION ?? 0) > 0 && <span className="chip chip-gray ml-1">+{o - (r.byStatus.NEEDS_REVISION ?? 0)}</span>}</td>
                      <td className="text-sm">{r.last?.updatedBy ?? "—"}</td>
                      <td className="text-sm text-brand-ink/70">{r.last ? `${dateVN(r.last.updatedAt)} ${timeVN(r.last.updatedAt)}` : "—"}</td>
                      <td><Link href={LINK[r.label] ?? "/"} className="text-sky-700 hover:underline">Xem</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {staff?.isOwner && (
          <aside className="space-y-4">
            <Panel icon={Building2} title="Chi nhánh" right={<Link href="/quan-tri/chi-nhanh" className="text-sky-700 hover:underline">Quản lý</Link>}>
              <ul className="space-y-2 text-sm">
                {branches.map((b) => <li key={b.id}><b>{b.name}</b><div className="text-xs text-brand-ink/70">{b.address ?? "Chưa có địa chỉ"}</div></li>)}
              </ul>
            </Panel>
            <Panel icon={UserCog} title="Nhân viên & phân quyền" right={<Link href="/quan-tri/nhan-vien" className="text-sky-700 hover:underline">Quản lý</Link>}>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                {[["Tổng", staffCount], ["Quản lý", admins], ["Bác sĩ", doctors], ["Khác", others]].map(([t, n]) => (
                  <div key={t as string} className="rounded-lg bg-slate-50 py-2"><div className="text-lg font-bold">{n}</div><div className="text-xs text-brand-ink/70">{t}</div></div>
                ))}
              </div>
              <div className="mt-2 text-xs text-brand-ink/70">{Object.values(ROLES).length} vai trò trong hệ thống</div>
            </Panel>
            <Panel icon={ScrollText} title="Nhật ký thao tác" right={<Link href="/quan-tri/nhat-ky" className="text-sky-700 hover:underline">Xem tất cả</Link>}>
              <ul className="space-y-2.5 text-sm">
                {logs.length === 0 && <li className="text-brand-ink/70">Chưa có.</li>}
                {logs.map((l) => (
                  <li key={l.id} className="flex gap-2">
                    <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot(l.action)}`} />
                    <div>
                      <div><b>{l.staffName ?? "Hệ thống"}</b> <span className="text-brand-ink/70">{l.action} {l.entity}</span></div>
                      <div className="text-xs text-brand-ink/70">{dateVN(l.at)} {timeVN(l.at)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel icon={DatabaseBackup} title="Sao lưu dữ liệu" right={<Link href="/quan-tri/sao-luu" className="text-sky-700 hover:underline">Lịch sử</Link>}>
              <div className="text-sm">
                Lần cuối: <b>{lastBackup ? `${dateVN(lastBackup.at)} ${timeVN(lastBackup.at)}` : "chưa có"}</b>
                {lastBackup && <span className={`chip ml-2 ${lastBackup.status === "OK" ? "chip-green" : "chip-red"}`}>{lastBackup.status === "OK" ? "Thành công" : "Thất bại"}</span>}
              </div>
              <a href="/quan-tri/sao-luu/xuat" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-brand-deep py-2.5 font-semibold text-white hover:bg-brand-deeper"><Download className="h-4 w-4" /> Sao lưu ngay</a>
            </Panel>
          </aside>
        )}
      </div>
      {staff?.isOwner && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { href: "/quan-tri/chi-nhanh", icon: Building2, t: "Danh mục hệ thống", d: "Chi nhánh, nhân viên, dịch vụ" },
            { href: "/quan-tri/nhat-ky", icon: ScrollText, t: "Nhật ký thao tác", d: "Ai làm gì, lúc nào" },
            { href: "/quan-tri/cau-hinh", icon: Settings, t: "Cấu hình chung", d: "Thông số hệ thống" },
          ].map((x) => (
            <Link key={x.href} href={x.href} className="card flex items-center gap-3 hover:bg-emerald-50">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><x.icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><b>{x.t}</b><span className="block text-xs text-brand-ink/70">{x.d}</span></span>
              <ArrowRight className="h-4 w-4 text-brand-ink/40" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
