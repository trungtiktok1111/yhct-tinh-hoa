import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";
import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import { SEX_LABEL, patientCode, vnDayStart, dateVN } from "@/lib/format";
import { ageOf } from "@/lib/person";
import { PageHead, Stat, Panel } from "@/components/ui";
import { X, Phone, MapPin, CalendarDays, Briefcase, Stethoscope, Users, UserPlus, AlertTriangle, Search, FolderOpen, ClipboardCheck } from "lucide-react";


export const dynamic = "force-dynamic";

export default async function PatientListPage({ searchParams }: { searchParams: { q?: string; trang?: string; gt?: string; tuoi?: string; sel?: string } }) {
  await requireRole(...PATIENT_ROLES);
  const q = searchParams.q?.trim();
  const page = pageOf(searchParams.trang);
  const digits = q?.replace(/\D/g, "");
  const seq = q && /^(bn-?)?0*\d+$/i.test(q) ? parseInt(q.replace(/\D/g, ""), 10) : undefined;
  const yr = new Date().getFullYear();
  const ageR: Record<string, [number, number]> = { "0": [0, 17], "1": [18, 39], "2": [40, 59], "3": [60, 200] };
  const ar = ageR[searchParams.tuoi ?? ""];
  const filt = {
    ...(["M", "F"].includes(searchParams.gt ?? "") ? { sex: searchParams.gt } : {}),
    ...(ar ? { birthYear: { gte: yr - ar[1], lte: yr - ar[0] } } : {}),
  };
  const where = q || Object.keys(filt).length
    ? { ...filt, ...(q ? {
        OR: [
          { fullName: { contains: q, mode: "insensitive" as const } },
          ...(digits && digits.length >= 3 ? [{ phone: { contains: digits } }, { nationalId: { contains: digits } }] : []),
          ...(seq !== undefined && Number.isSafeInteger(seq) && seq < 2147483647 ? [{ seq }] : []),
        ],
      } : {}) }
    : undefined;
  const monthStart = new Date(vnDayStart().getTime() - 29 * 86400000);
  const [patients, total, all, newMonth, allergic, treating, followUps, selP] = await Promise.all([
    prisma.patient.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { visits: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true, reason: true } } } }),
    prisma.patient.count({ where }),
    prisma.patient.count(),
    prisma.patient.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.patient.count({ where: { allergies: { not: null }, NOT: { allergies: "" } } }),
    prisma.patient.count({ where: { visits: { some: { createdAt: { gte: monthStart } } } } }),
    prisma.exam.count({ where: { followUpDate: { gte: vnDayStart() } } }),
    searchParams.sel ? prisma.patient.findUnique({ where: { id: searchParams.sel }, include: { visits: { orderBy: { createdAt: "desc" }, take: 1, include: { exam: { select: { doctorName: true, diseaseText: true, followUpDate: true, chiefComplaint: true } } } } } }) : Promise.resolve(null),
  ]);
  const sp = (extra: Record<string, string>) => `/benh-nhan?${new URLSearchParams({ ...(q ? { q } : {}), ...(searchParams.gt ? { gt: searchParams.gt } : {}), ...(searchParams.tuoi ? { tuoi: searchParams.tuoi } : {}), ...extra })}`;

  return (
    <div className="space-y-4">
      <PageHead icon={Users} title="Danh sách bệnh nhân" sub="Quản lý thông tin bệnh nhân, theo dõi quá trình điều trị" img="/images/art/herbs-wide.jpg">
        <Link href="/benh-nhan/moi" className="flex items-center gap-2 rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white hover:bg-brand-deeper"><UserPlus className="h-5 w-5" />Thêm bệnh nhân</Link>
      </PageHead>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat icon={Users} label="Tổng bệnh nhân" value={all.toLocaleString("vi-VN")} tone="green" />
        <Stat icon={UserPlus} label="Mới 30 ngày qua" value={newMonth} tone="blue" />
        <Stat icon={AlertTriangle} label="Có ghi dị ứng" value={allergic} tone="red" />
        <Stat icon={Stethoscope} label="Đang điều trị" value={treating} unit="khám trong 30 ngày" tone="amber" />
        <Stat icon={CalendarDays} label="Hẹn tái khám" value={followUps} unit="từ hôm nay" tone="purple" />
      </div>

      <form className="card !p-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={q} placeholder="Tìm theo họ tên, mã BN, số điện thoại, CCCD…" className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3" />
        </div>
        <select name="gt" defaultValue={searchParams.gt ?? ""} className="rounded-xl border border-slate-300 bg-white px-3"><option value="">Giới tính: tất cả</option><option value="M">Nam</option><option value="F">Nữ</option></select>
        <select name="tuoi" defaultValue={searchParams.tuoi ?? ""} className="rounded-xl border border-slate-300 bg-white px-3"><option value="">Nhóm tuổi: tất cả</option><option value="0">Dưới 18</option><option value="1">18–39</option><option value="2">40–59</option><option value="3">60 trở lên</option></select>
        <button className="rounded-xl bg-brand-deep px-5 font-semibold text-white">Tìm</button>
      </form>

      <div className={selP ? "grid xl:grid-cols-[1fr_21rem] gap-4 items-start" : ""}>
      <Panel pad={false}>
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th className="w-12">STT</th><th>Họ tên</th><th>Mã BN</th><th>GT / Tuổi</th><th>SĐT</th><th>Lần khám cuối</th><th>Lý do gần nhất</th><th>Dị ứng</th><th className="text-center">Thao tác</th></tr></thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p.id} className={selP?.id === p.id ? "bg-emerald-50" : ""}>
                  <td className="text-brand-ink/60">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td><Link href={sp({ sel: p.id })} className="font-semibold hover:underline">{p.fullName}</Link></td>
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
      {selP && (
        <aside className="card space-y-3">
          <div className="flex items-start gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">{selP.fullName.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()}</span>
            <div className="min-w-0 flex-1"><div className="text-lg font-bold">{selP.fullName}</div><div className="text-sm text-brand-ink/60">{patientCode(selP.seq)} · {SEX_LABEL[selP.sex] ?? selP.sex} · {ageOf(selP.birthDate, selP.birthYear)} tuổi</div></div>
            <Link href={sp({})} className="rounded-full p-1.5 hover:bg-slate-100"><X className="h-5 w-5" /></Link>
          </div>
          <ul className="space-y-1.5 text-sm">
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 text-brand-ink/50" />{selP.phone}</li>
            {selP.birthDate && <li className="flex gap-2"><CalendarDays className="mt-0.5 h-4 w-4 text-brand-ink/50" />{dateVN(selP.birthDate)}</li>}
            {(selP.address || selP.province) && <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 text-brand-ink/50" />{[selP.address, selP.ward, selP.district, selP.province].filter(Boolean).join(", ")}</li>}
            {selP.occupation && <li className="flex gap-2"><Briefcase className="mt-0.5 h-4 w-4 text-brand-ink/50" />{selP.occupation}</li>}
          </ul>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <div className="mb-1 flex items-center gap-1.5 font-bold"><AlertTriangle className="h-4 w-4 text-red-600" />Cảnh báo y tế</div>
            {selP.allergies ? <span className="chip chip-red">Dị ứng: {selP.allergies}</span> : <span className="chip chip-green">Không có dị ứng thuốc</span>}
          </div>
          {selP.chronicConditions && <div className="rounded-xl border border-slate-200 p-3 text-sm"><div className="mb-1 font-bold">Bệnh lý chính</div>{selP.chronicConditions}</div>}
          {selP.visits[0] && (
            <div className="rounded-xl border border-slate-200 p-3 text-sm">
              <div className="mb-1 font-bold">Lần khám gần nhất</div>
              <div className="text-base font-bold">{dateVN(selP.visits[0].createdAt)}</div>
              <div className="text-brand-ink/70">{selP.visits[0].exam?.doctorName ?? ""}</div>
              <div className="text-brand-ink/70">{selP.visits[0].exam?.diseaseText ?? selP.visits[0].reason ?? ""}</div>
            </div>
          )}
          {selP.visits[0]?.exam?.followUpDate && (
            <div className="rounded-xl border border-slate-200 p-3 text-sm"><div className="mb-1 font-bold">Hẹn tái khám</div><div className="text-base font-bold">{dateVN(selP.visits[0].exam.followUpDate)}</div></div>
          )}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link href={`/benh-nhan/${selP.id}`} className="rounded-xl bg-brand-deep py-2.5 text-center font-semibold text-white hover:bg-brand-deeper">Mở hồ sơ bệnh án</Link>
            <Link href={`/benh-nhan/${selP.id}`} className="rounded-xl border border-slate-300 py-2.5 text-center font-semibold hover:bg-slate-50">Tiếp đón</Link>
          </div>
        </aside>
      )}
      </div>
      <Pagination path="/benh-nhan" page={page} total={total} params={{ q, gt: searchParams.gt, tuoi: searchParams.tuoi }} />
    </div>
  );
}
