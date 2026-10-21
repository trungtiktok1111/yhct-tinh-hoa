import { requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";
import { PatientForm } from "@/components/PatientForm";
import { BackLink } from "@/components/BackLink";

export default async function NewPatientPage({ searchParams }: { searchParams: { loi?: string } }) {
  await requireRole(...PATIENT_ROLES);
  return (
    <div className="space-y-4 max-w-2xl">
      <BackLink href="/benh-nhan" label="Quay lại danh sách bệnh nhân" />
      <h1 className="text-2xl font-bold font-display">Thêm bệnh nhân</h1>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      <PatientForm />
    </div>
  );
}
