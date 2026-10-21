import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";
import { cancelVisit } from "@/actions/patient";
import { branchesFor, input } from "@/lib/stock";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { SEX_LABEL, VISIT_STATUS, patientCode, timeVN, vnDayStart } from "@/lib/format";
import { ageOf } from "@/lib/person";
import { PageHead, Stat, Panel } from "@/components/ui";
import { ClipboardCheck, Users, Clock, Stethoscope, CheckCircle2, XCircle, UserPlus, Search, AlertTriangle, FolderOpen } from "lucide-react";
import { canAccessPath } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ReceptionPage({ searchParams }: { searchParams: { cn?: string; loi?: string; ok?: string } }) {
  const staff = await requireRole(...PATIENT_ROLES);
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  if (!branch) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold font-display">Tiếp đón</h1>
        <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>
      </div>
    );
  }
  const visits = await prisma.visit.findMany({
    where: { branchId: branch.id, createdAt: { gte: vnDayStart() } },
    orderBy: { queueNo: "asc" },
    include: { patient: true },
  });
  const waiting = visits.filter((v) => v.status === "WAITING").length;

  const count = (st: string) => visits.filter((v) => v.status === st).length;
  const chip: Record<string, [string, string]> = { WAITING: ["Đang chờ", "chip-amber"], IN_EXAM: ["Đang khám", "chip-blue"], DONE: ["Đã khám", "chip-green"], CANCELLED: ["Đã hủy", "chip-gray"] };
  const canExam = canAccessPath(staff.role, "/kham");
  return (
    <div className="space-y-4">
      <PageHead icon={ClipboardCheck} title="Tiếp đón hôm nay" sub="Quản lý bệnh nhân đến khám và tiếp nhận ban đầu" img="/images/art/mortar.jpg">
        <Link href="/benh-nhan/moi" className="flex items-center gap-2 rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white hover:bg-brand-deeper"><UserPlus className="h-5 w-5" />Thêm bệnh nhân mới</Link>
      </PageHead>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">Đã tiếp đón. Số thứ tự: <b>{searchParams.ok}</b></div>}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat icon={Users} label="Tổng bệnh nhân" value={visits.length} unit="hôm nay" tone="green" />
        <Stat icon={Clock} label="Đang chờ" value={waiting} unit="bệnh nhân" tone="amber" />
        <Stat icon={Stethoscope} label="Đang khám" value={count("IN_EXAM")} unit="bệnh nhân" tone="blue" />
        <Stat icon={CheckCircle2} label="Đã khám" value={count("DONE")} unit="bệnh nhân" tone="green" />
        <Stat icon={XCircle} label="Hủy" value={count("CANCELLED")} unit="bệnh nhân" tone="red" />
      </div>

      <div className="grid xl:grid-cols-[1fr_20rem] gap-4 items-start">
        <Panel pad={false} icon={Users} title={`Danh sách hôm nay (${visits.length})`}>
          {visits.length === 0 ? <p className="p-5 text-brand-ink/60">Hôm nay chưa có lượt khám nào.</p> : (
            <div className="overflow-x-auto">
              <table>
                <thead><tr><th className="w-14">STT</th><th>Bệnh nhân</th><th>Mã BN</th><th>Giờ đến</th><th>Lý do khám</th><th>Trạng thái</th><th className="text-center">Thao tác</th></tr></thead>
                <tbody>
                  {visits.map((v) => {
                    const [t, c] = chip[v.status] ?? [v.status, "chip-gray"];
                    return (
                      <tr key={v.id} className={v.status === "CANCELLED" ? "opacity-50" : ""}>
                        <td className="font-bold text-brand-deep">{v.queueNo}</td>
                        <td>
                          <Link href={`/benh-nhan/${v.patient.id}`} className="font-semibold hover:underline">{v.patient.fullName}</Link>
                          {v.patient.allergies && <AlertTriangle className="inline h-4 w-4 ml-1 text-red-600" aria-label="Có dị ứng" />}
                          <div className="text-xs text-brand-ink/55">{SEX_LABEL[v.patient.sex] ?? v.patient.sex} · {ageOf(v.patient.birthDate, v.patient.birthYear)} tuổi</div>
                        </td>
                        <td className="text-brand-ink/70">{patientCode(v.patient.seq)}</td>
                        <td>{timeVN(v.createdAt)}</td>
                        <td className="max-w-xs text-brand-ink/80">{v.reason ?? "—"}</td>
                        <td><span className={`chip ${c}`}>{t}</span></td>
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            {canExam && (v.status === "WAITING" || v.status === "IN_EXAM") && <Link href={`/kham/${v.id}`} className="rounded-lg bg-brand-deep px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-deeper">{v.status === "WAITING" ? "Bắt đầu khám" : "Tiếp tục"}</Link>}
                            <Link href={`/benh-nhan/${v.patient.id}`} className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"><FolderOpen className="h-4 w-4" />Hồ sơ</Link>
                            {v.status === "WAITING" && (
                              <form action={cancelVisit}>
                                <input type="hidden" name="id" value={v.id} />
                                <ConfirmSubmit message="Hủy lượt khám này?">Hủy</ConfirmSubmit>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <aside className="space-y-4">
          <Panel icon={Search} title="Tiếp đón nhanh">
            <form action="/benh-nhan" className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input name="q" placeholder="Nhập tên, SĐT hoặc mã BN…" className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3" />
              </div>
              <button className="w-full rounded-xl bg-brand-deep py-2.5 font-semibold text-white hover:bg-brand-deeper">Tìm bệnh nhân để tiếp đón</button>
            </form>
            <Link href="/benh-nhan/moi" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 font-semibold hover:bg-slate-50"><UserPlus className="h-4 w-4" />Bệnh nhân mới</Link>
          </Panel>
          <div className="relative h-40 overflow-hidden rounded-2xl">
            <img src="/images/art/needles.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deeper/80 to-transparent" />
            <div className="absolute bottom-3 left-4 brand-serif italic text-brand-goldLight text-lg">Thầy thuốc như từ mẫu</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
