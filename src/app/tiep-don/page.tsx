import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";
import { cancelVisit } from "@/actions/patient";
import { branchesFor, input } from "@/lib/stock";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { SEX_LABEL, VISIT_STATUS, patientCode, timeVN, vnDayStart } from "@/lib/format";
import { ageOf } from "@/lib/person";

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold font-display">Tiếp đón hôm nay</h1>
        <Link href="/benh-nhan" className="rounded-lg bg-brand-deep text-brand-cream px-4 py-2.5 font-semibold">
          Tìm / thêm bệnh nhân để tiếp đón
        </Link>
      </div>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">Đã tiếp đón. Số thứ tự: <b>{searchParams.ok}</b></div>}

      <form method="get" className="flex items-end gap-2">
        <label className="text-sm flex-1">Chi nhánh
          <select name="cn" defaultValue={branch.id} className={input}>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <button className="rounded-lg border border-brand-gold/50 px-4 py-2.5">Xem</button>
      </form>

      <p className="text-sm text-gray-600">{visits.length} lượt hôm nay · {waiting} đang chờ</p>

      <div className="space-y-2">
        {visits.length === 0 && <p className="text-sm text-gray-600">Hôm nay chưa có lượt khám nào.</p>}
        {visits.map((v) => (
          <div key={v.id} className={`card !py-3 flex flex-wrap items-center gap-3 ${v.status === "CANCELLED" ? "opacity-50" : ""}`}>
            <div className="text-2xl font-bold tabular-nums w-10 text-center">{v.queueNo}</div>
            <div className="min-w-0 flex-1">
              <Link href={`/benh-nhan/${v.patient.id}`} className="font-semibold text-brand-deep underline">{v.patient.fullName}</Link>
              <div className="text-xs text-gray-600">
                {patientCode(v.patient.seq)} · {SEX_LABEL[v.patient.sex] ?? v.patient.sex} · {ageOf(v.patient.birthDate, v.patient.birthYear)} tuổi · {timeVN(v.createdAt)}
                {v.reason ? ` · ${v.reason}` : ""}
              </div>
              {v.patient.allergies && <div className="text-xs text-red-700 font-semibold">Dị ứng: {v.patient.allergies}</div>}
            </div>
            <span className="text-sm">{VISIT_STATUS[v.status] ?? v.status}</span>
            {v.status === "WAITING" && (
              <form action={cancelVisit}>
                <input type="hidden" name="id" value={v.id} />
                <ConfirmSubmit message="Hủy lượt khám này?">Hủy</ConfirmSubmit>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
