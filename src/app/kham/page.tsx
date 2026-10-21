import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { EXAM_ROLES } from "@/lib/permissions";
import { startExam } from "@/actions/exam";
import { createSampleCase } from "@/actions/sample";
import { SAMPLE_NAME } from "@/lib/sampleCase";
import { branchesFor, input } from "@/lib/stock";
import { SEX_LABEL, VISIT_STATUS, patientCode, timeVN, vnDayStart } from "@/lib/format";
import { ageOf } from "@/lib/person";

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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold font-display">Khám bệnh hôm nay</h1>
      <div className="card !py-3 flex flex-wrap items-center gap-3 border-brand-gold/60">
        <div className="min-w-0 flex-1 text-sm">
          <b className="text-brand-deep">Ca mẫu hướng dẫn</b>
          <div className="text-xs text-gray-600">Một bệnh án khám hoàn chỉnh (tứ chẩn, chẩn đoán, đơn thuốc, châm cứu, hóa đơn) để xem và làm theo.</div>
        </div>
        {sampleVisitId ? (
          <Link href={`/kham/${sampleVisitId}`} className="rounded-lg bg-brand-deep text-brand-cream px-4 py-2 font-semibold">Xem ca mẫu</Link>
        ) : (
          <form action={createSampleCase}>
            <button className="rounded-lg bg-brand-deep text-brand-cream px-4 py-2 font-semibold">Tạo ca mẫu</button>
          </form>
        )}
      </div>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      <form method="get" className="flex items-end gap-2">
        <label className="text-sm flex-1">Chi nhánh
          <select name="cn" defaultValue={branch.id} className={input}>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <button className="rounded-lg border border-brand-gold/50 px-4 py-2.5">Xem</button>
      </form>
      <div className="space-y-2">
        {visits.length === 0 && <p className="text-sm text-gray-600">Hôm nay chưa có lượt khám nào. Lễ tân cần tiếp đón bệnh nhân trước.</p>}
        {visits.map((v) => (
          <div key={v.id} className="card !py-3 flex flex-wrap items-center gap-3">
            <div className="text-2xl font-bold tabular-nums w-10 text-center">{v.queueNo}</div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-brand-deep">{v.patient.fullName}</div>
              <div className="text-xs text-gray-600">
                {patientCode(v.patient.seq)} · {SEX_LABEL[v.patient.sex] ?? v.patient.sex} · {ageOf(v.patient.birthDate, v.patient.birthYear)} tuổi · {timeVN(v.createdAt)}
                {v.reason ? ` · ${v.reason}` : ""}
              </div>
              {v.patient.allergies && <div className="text-xs text-red-700 font-semibold">Dị ứng: {v.patient.allergies}</div>}
              {v.exam?.doctorName && <div className="text-xs text-gray-500">Bác sĩ: {v.exam.doctorName}</div>}
            </div>
            <span className="text-sm">{VISIT_STATUS[v.status] ?? v.status}</span>
            {v.status === "DONE" ? (
              <Link href={`/kham/${v.id}`} className="rounded-lg border border-brand-gold/50 px-4 py-2">Xem bệnh án</Link>
            ) : (
              <form action={startExam}>
                <input type="hidden" name="visitId" value={v.id} />
                <button className="rounded-lg bg-brand-deep text-brand-cream px-4 py-2 font-semibold">
                  {v.status === "IN_EXAM" ? "Tiếp tục khám" : "Bắt đầu khám"}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
