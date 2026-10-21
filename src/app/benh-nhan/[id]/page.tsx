import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PATIENT_DELETE_ROLES, PATIENT_ROLES, hasAny } from "@/lib/permissions";
import { createVisit, deletePatient } from "@/actions/patient";
import { branchesFor, input } from "@/lib/stock";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { SEX_LABEL, VISIT_STATUS, dateVN, patientCode, bmiClass } from "@/lib/format";
import { ageOf, dobText } from "@/lib/person";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="whitespace-pre-wrap">{value}</div>
    </div>
  );
}

export default async function PatientDetailPage({ params, searchParams }: { params: { id: string }; searchParams: { loi?: string } }) {
  const staff = await requireRole(...PATIENT_ROLES);
  const [patient, branches] = await Promise.all([
    prisma.patient.findUnique({
      where: { id: params.id },
      include: { visits: { orderBy: { createdAt: "desc" }, take: 20, include: { branch: { select: { name: true } } } } },
    }),
    branchesFor(staff),
  ]);
  if (!patient) notFound();
  const canDelete = hasAny(staff.roles, PATIENT_DELETE_ROLES);
  const bmi = patient.weightKg && patient.heightCm ? patient.weightKg / Math.pow(patient.heightCm / 100, 2) : null;

  return (
    <div className="space-y-5">
      <BackLink href="/benh-nhan" label="Danh sách bệnh nhân" />
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display">{patient.fullName}</h1>
          <p className="text-sm text-gray-600">
            {patientCode(patient.seq)} · {SEX_LABEL[patient.sex] ?? patient.sex} · {ageOf(patient.birthDate, patient.birthYear)} tuổi (sinh {patient.birthDate ? dobText(patient.birthDate) : patient.birthYear}) · {patient.phone}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/benh-nhan/${patient.id}/sua`} className="rounded-lg bg-brand-deep text-brand-cream px-4 py-1.5 text-sm font-semibold">Sửa</Link>
          {canDelete && (
            <form action={deletePatient}>
              <input type="hidden" name="id" value={patient.id} />
              <ConfirmSubmit message={`Xóa hồ sơ "${patient.fullName}"? Chỉ xóa được khi chưa có lượt khám.`}>Xóa</ConfirmSubmit>
            </form>
          )}
        </div>
      </div>

      {patient.allergies && (
        <div className="warn-box text-sm"><b>Dị ứng:</b> {patient.allergies}</div>
      )}

      <div className="card grid gap-3 sm:grid-cols-2">
        <Field label="Số CCCD / CMND" value={patient.nationalId} />
        <Field label="Email" value={patient.email} />
        <div className="sm:col-span-2">
          <Field label="Địa chỉ" value={[patient.address, patient.ward, patient.district, patient.province].filter(Boolean).join(", ")} />
        </div>
        <Field label="Dân tộc / quốc tịch" value={[patient.ethnicity, patient.nationality].filter(Boolean).join(" · ")} />
        <Field label="Nghề nghiệp" value={patient.occupation} />
        <Field label="Số thẻ BHYT" value={patient.insuranceNo} />
        <Field label="Nhóm máu" value={patient.bloodType} />
        <Field label="Người liên hệ" value={[patient.emergencyName, patient.emergencyRelation && `(${patient.emergencyRelation})`, patient.emergencyPhone].filter(Boolean).join(" ")} />
        <Field label="Cân nặng" value={patient.weightKg ? `${patient.weightKg} kg` : null} />
        <Field label="Chiều cao" value={patient.heightCm ? `${patient.heightCm} cm` : null} />
        <Field label="BMI (chuẩn WHO châu Á)" value={bmi ? `${bmi.toFixed(1)} · ${bmiClass(bmi)}` : null} />
        <div className="sm:col-span-2 grid gap-3">
          <Field label="Tiền căn bản thân" value={patient.pastHistory} />
          <Field label="Tiền căn gia đình" value={patient.familyHistory} />
          <Field label="Bệnh mạn tính đang có" value={patient.chronicConditions} />
          <Field label="Ghi chú" value={patient.note} />
        </div>
        <div className="sm:col-span-2 text-xs text-gray-500 border-t pt-2">
          Tạo ngày {dateVN(patient.createdAt)}{patient.createdBy ? ` bởi ${patient.createdBy}` : ""}
        </div>
      </div>

      <form action={createVisit} className="card grid gap-3 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">Tiếp đón lượt khám mới</h2>
        <input type="hidden" name="patientId" value={patient.id} />
        <label className="text-sm">Chi nhánh
          <select name="branchId" required className={input}>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label className="text-sm">Lý do khám
          <input name="reason" placeholder="vd: đau lưng 2 tuần" className={input} />
        </label>
        <label className="text-sm">Cân nặng (kg)
          <input name="weightKg" defaultValue={patient.weightKg ?? ""} inputMode="decimal" className={input} />
        </label>
        <label className="text-sm">Chiều cao (cm)
          <input name="heightCm" defaultValue={patient.heightCm ?? ""} inputMode="decimal" className={input} />
        </label>
        <label className="text-sm">Mạch (lần/phút)
          <input name="pulse" inputMode="numeric" className={input} />
        </label>
        <label className="text-sm">Huyết áp
          <input name="bloodPressure" placeholder="vd: 120/80" className={input} />
        </label>
        <label className="text-sm">Nhiệt độ (°C)
          <input name="temperature" inputMode="decimal" className={input} />
        </label>
        <button type="submit" className="sm:col-span-2 bg-brand-deep hover:bg-brand-deeper text-brand-cream rounded-lg px-4 py-2.5 font-semibold">
          Tiếp đón, lấy số thứ tự
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="font-semibold">Lịch sử khám ({patient.visits.length})</h2>
        {patient.visits.length === 0 && <p className="text-sm text-gray-600">Chưa có lượt khám nào.</p>}
        {patient.visits.map((v) => (
          <div key={v.id} className="card !py-2.5 text-sm flex flex-wrap gap-x-4 gap-y-1">
            <span className="tabular-nums text-gray-600">{dateVN(v.createdAt)}</span>
            <span className="font-semibold">{v.branch.name} · số {v.queueNo}</span>
            <span>{VISIT_STATUS[v.status] ?? v.status}</span>
            {v.reason && <span>{v.reason}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
