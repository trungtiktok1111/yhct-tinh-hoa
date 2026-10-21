import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";
import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import { SEX_LABEL, patientCode, vnDayStart, dateVN } from "@/lib/format";
import { ageOf } from "@/lib/person";
import { PageHead, Stat, Panel } from "@/components/ui";
import { Users, UserPlus, AlertTriangle, Search, FolderOpen, ClipboardCheck } from "lucide-react";


export const dynamic = "force-dynamic";

export default async function PatientListPage({ searchParams }: { searchParams: { q?: string; trang?: string } }) {
  await requireRole(...PATIENT_ROLES);
  const q = searchParams.q?.trim();
  const page = pageOf(searchParams.trang);
  const digits = q?.replace(/\D/g, "");
  const seq = q && /^(bn-?)?0*\d+$/i.test(q) ? parseInt(q.replace(/\D/g, ""), 10) : undefined;
  const where = q
    ? {
        OR: [
          { fullName: { contains: q, mode: "insensitive" as const } },
          ...(digits && digits.length >= 3 ? [{ phone: { contains: digits } }, { nationalId: { contains: digits } }] : []),
          ...(seq !== undefined && Number.isSafeInteger(seq) && seq < 2147483647 ? [{ seq }] : []),
        ],
      }
    : undefined;
  const monthStart = new Date(vnDayStart().getTime() - 29 * 86400000);
  const [patients, total, all, newMonth, allergic] = await Promise.all([
    prisma.patient.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { visits: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true, reason: true } } } }),
    prisma.patient.count({ where }),
    prisma.patient.count(),
    prisma.patient.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.patient.count({ where: { allergies: { not: null }, NOT: { allergies: "" } } }),
  ]);

  return (
    <div className="space-y-4">
      <PageHead icon={Users} title="Danh sách bệnh nhân" sub="Quản lý thông tin bệnh nhân, theo dõi quá trình điều trị" img="/images/art/herbs-wide.jpg">
        <Link href="/benh-nhan/moi" className="flex items-center gap-2 rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white hover:bg-brand-deeper"><UserPlus className="h-5 w-5" />Thêm bệnh nhân</Link>
      </PageHead>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={Users} label="Tổng bệnh nhân" value={all.toLocaleString("vi-VN")} tone="green" />
        <Stat icon={UserPlus} label="Mới 30 ngày qua" value={newMonth} tone="blue" />
        <Stat icon={AlertTriangle} label="Có ghi dị ứng" value={allergic} tone="red" />
        <Stat icon={Search} label="Kết quả đang lọc" value={total} tone="amber" />
      </div>

      <form className="card !p-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={q} placeholder="Tìm theo họ tên, mã BN, số điện thoại, CCCD…" className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3" />
        </div>
        <button className="rounded-xl bg-brand-deep px-5 font-semibold text-white">Tìm</button>
      </form>

      <Panel pad={false}>
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th className="w-12">STT</th><th>Họ tên</th><th>Mã BN</th><th>GT / Tuổi</th><th>SĐT</th><th>Lần khám cuối</th><th>Lý do gần nhất</th><th>Dị ứng</th><th className="text-center">Thao tác</th></tr></thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p.id}>
                  <td className="text-brand-ink/60">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td><Link href={`/benh-nhan/${p.id}`} className="font-semibold hover:underline">{p.fullName}</Link></td>
                  <td className="text-brand-ink/70">{patientCode(p.seq)}</td>
                  <td>{SEX_LABEL[p.sex] ?? p.sex} · {ageOf(p.birthDate, p.birthYear)}</td>
                  <td>{p.phone}</td>
                  <td>{p.visits[0] ? dateVN(p.visits[0].createdAt) : "—"}</td>
                  <td className="max-w-[14rem] truncate text-brand-ink/75">{p.visits[0]?.reason ?? "—"}</td>
                  <td>{p.allergies ? <span className="chip chip-red">Có</span> : <span className="chip chip-green">Không</span>}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/benh-nhan/${p.id}`} title="Mở hồ sơ" className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-amber-600 hover:bg-slate-100"><FolderOpen className="h-4 w-4" /></Link>
                      <Link href={`/benh-nhan/${p.id}`} title="Tiếp đón" className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-brand-deep hover:bg-slate-100"><ClipboardCheck className="h-4 w-4" /></Link>
                    </div>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && <tr><td colSpan={9} className="p-6 text-center text-brand-ink/60">{q ? "Không tìm thấy bệnh nhân." : "Chưa có bệnh nhân nào."}</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
      <Pagination path="/benh-nhan" page={page} total={total} params={{ q }} />
    </div>
  );
}
