import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";
import { PatientForm } from "@/components/PatientForm";
import { BackLink } from "@/components/BackLink";

export const dynamic = "force-dynamic";

export default async function EditPatientPage({ params, searchParams }: { params: { id: string }; searchParams: { loi?: string } }) {
  await requireRole(...PATIENT_ROLES);
  const patient = await prisma.patient.findUnique({ where: { id: params.id } });
  if (!patient) notFound();
  return (
    <div className="space-y-4 max-w-2xl">
      <BackLink href={`/benh-nhan/${patient.id}`} label="Quay lại, không lưu" />
      <h1 className="text-2xl font-bold font-display">Sửa hồ sơ: {patient.fullName}</h1>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      <PatientForm patient={patient} />
    </div>
  );
}
