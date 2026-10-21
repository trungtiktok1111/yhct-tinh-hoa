import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { EXAM_ROLES } from "@/lib/permissions";
import { startExam } from "@/actions/exam";
import { createSampleCase } from "@/actions/sample";
import { SAMPLE_NAME } from "@/lib/sampleCase";
import { branchesFor } from "@/lib/stock";
import { SEX_LABEL, VISIT_STATUS, patientCode, timeVN, vnDayStart } from "@/lib/format";
import { ageOf } from "@/lib/person";
import { PageHead, Stat, Panel } from "@/components/ui";
import { HeartPulse, Users, Clock, Stethoscope, CheckCircle2, AlertTriangle, BookOpenCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExamQueuePage({ searchParams }: { searchParams: { cn?: string; loi?: string } }) {
  const staff = await requireRole(...EXAM_ROLES);
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  if (!branch) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold font-display">Khám bệnh</h1>
        <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>
      </div>
    );
  }
  const visits = await prisma.visit.findMany({
    where: { branchId: branch.id, createdAt: { gte: vnDayStart() }, status: { not: "CANCELLED" } },
    orderBy: { queueNo: "asc" },
    include: { patient: true, exam: { select: { doctorName: true, status: true } } },
  });
  const sample = await prisma.patient.findFirst({
    where: { fullName: SAMPLE_NAME },
    select: { visits: { orderBy: { createdAt: "desc" }, take: 1, select: { id: true } } },
  });
  const sampleVisitId = sample?.visits[0]?.id;
  const order = (s: string) => (s === "IN_EXAM" ? 0 : s === "WAITING" ? 1 : 2);
  visits.sort((a, b) => order(a.status) - order(b.status) || a.queueNo - b.queueNo);

  const count = (st: string) => visits.filter((v) => v.status === st).length;
  const chip: Record<string, [string, string]> = { WAITING: ["Chờ khám", "chip-amber"], IN_EXAM: ["Đang khám", "chip-blue"], DONE: ["Đã khám", "chip-green"] };
  return (
    <div className="space-y-4">
      <PageHead icon={HeartPulse} title="Khám bệnh hôm nay" sub="Danh sách bệnh nhân chờ khám và đang khám" img="/images/art/needles.jpg">
        {sampleVisitId ? (
          <Link href={`/kham/${sampleVisitId}`} className="flex items-center gap-2 rounded-xl border border-brand-deep px-4 py-2.5 font-semibold text-brand-deep hover:bg-emerald-50"><BookOpenCheck className="h-5 w-5" />Xem ca mẫu</Link>
        ) : (
          <form action={createSampleCase}>
            <button className="flex items-center gap-2 rounded-xl border border-brand-deep px-4 py-2.5 font-semibold text-brand-deep hover:bg-emerald-50"><BookOpenCheck className="h-5 w-5" />Tạo ca mẫu hướng dẫn</button>
          </form>
        )}
      </PageHead>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={Users} label="Tổng lượt khám" value={visits.length} unit="hôm nay" tone="green" />
        <Stat icon={Clock} label="Chờ khám" value={count("WAITING")} unit="bệnh nhân" tone="amber" />
        <Stat icon={Stethoscope} label="Đang khám" value={count("IN_EXAM")} unit="bệnh nhân" tone="blue" />
        <Stat icon={CheckCircle2} label="Đã khám" value={count("DONE")} unit="bệnh nhân" tone="green" />
      </div>
      <Panel pad={false} icon={Users} title={`Danh sách khám (${visits.length})`}>
        {visits.length === 0 ? <p className="p-5 text-brand-ink/60">Hôm nay chưa có lượt khám nào. Lễ tân cần tiếp đón bệnh nhân trước.</p> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-14">STT</th><th>Bệnh nhân</th><th>Mã BN</th><th>Giờ đến</th><th>Lý do khám</th><th>Bác sĩ</th><th>Trạng thái</th><th className="text-center">Thao tác</th></tr></thead>
              <tbody>
                {visits.map((v) => {
                  const [t, c] = chip[v.status] ?? [v.status, "chip-gray"];
                  return (
                    <tr key={v.id}>
                      <td className="font-bold text-brand-deep">{v.queueNo}</td>
                      <td>
                        <span className="font-semibold">{v.patient.fullName}</span>
                        {v.patient.allergies && <AlertTriangle className="inline h-4 w-4 ml-1 text-red-600" aria-label={`Dị ứng: ${v.patient.allergies}`} />}
                        <div className="text-xs text-brand-ink/55">{SEX_LABEL[v.patient.sex] ?? v.patient.sex} · {ageOf(v.patient.birthDate, v.patient.birthYear)} tuổi</div>
                      </td>
                      <td className="text-brand-ink/70">{patientCode(v.patient.seq)}</td>
                      <td>{timeVN(v.createdAt)}</td>
                      <td className="max-w-xs text-brand-ink/80">{v.reason ?? "—"}</td>
                      <td className="text-brand-ink/70">{v.exam?.doctorName ?? "—"}</td>
                      <td><span className={`chip ${c}`}>{t}</span></td>
                      <td className="text-center">
                        {v.status === "DONE" ? (
                          <Link href={`/kham/${v.id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">Xem bệnh án</Link>
                        ) : (
                          <form action={startExam}>
                            <input type="hidden" name="visitId" value={v.id} />
                            <button className="rounded-lg bg-brand-deep px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-deeper">{v.status === "IN_EXAM" ? "Tiếp tục khám" : "Bắt đầu khám"}</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
