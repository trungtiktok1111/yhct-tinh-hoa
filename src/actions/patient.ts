"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole, type CurrentStaff } from "@/lib/auth";
import { PATIENT_DELETE_ROLES, PATIENT_ROLES } from "@/lib/permissions";
import { vnDayStart, vnYear } from "@/lib/format";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}
function num(fd: FormData, key: string): number | undefined {
  const t = str(fd, key);
  if (!t) return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
function go(path: string, error?: string): never {
  redirect(error ? `${path}?loi=${encodeURIComponent(error)}` : path);
}

type Parsed = {
  fullName: string; birthYear: number; sex: string; phone: string;
  address?: string; occupation?: string; weightKg?: number; heightCm?: number;
  pastHistory?: string; familyHistory?: string; allergies?: string; chronicConditions?: string; note?: string;
};

function parsePatient(fd: FormData, path: string): Parsed {
  const fullName = str(fd, "fullName");
  const birthYear = num(fd, "birthYear");
  const sex = str(fd, "sex");
  const phoneRaw = str(fd, "phone");
  if (!fullName) go(path, "Nhập họ tên.");
  if (birthYear === undefined || !Number.isInteger(birthYear) || birthYear < 1900 || birthYear > vnYear())
    go(path, `Năm sinh phải từ 1900 đến ${vnYear()}.`);
  if (sex !== "M" && sex !== "F" && sex !== "O") go(path, "Chọn giới tính.");
  const phone = phoneRaw?.replace(/[\s.\-]/g, "");
  if (!phone || !/^\+?\d{8,15}$/.test(phone)) go(path, "Số điện thoại không hợp lệ (8–15 chữ số).");
  const weightKg = num(fd, "weightKg");
  const heightCm = num(fd, "heightCm");
  if (weightKg !== undefined && (Number.isNaN(weightKg) || weightKg <= 0 || weightKg > 400)) go(path, "Cân nặng không hợp lệ (kg).");
  if (heightCm !== undefined && (Number.isNaN(heightCm) || heightCm <= 0 || heightCm > 260)) go(path, "Chiều cao không hợp lệ (cm).");
  return {
    fullName, birthYear, sex, phone, weightKg, heightCm,
    address: str(fd, "address"), occupation: str(fd, "occupation"),
    pastHistory: str(fd, "pastHistory"), familyHistory: str(fd, "familyHistory"),
    allergies: str(fd, "allergies"), chronicConditions: str(fd, "chronicConditions"), note: str(fd, "note"),
  };
}

export async function createPatient(formData: FormData) {
  const staff = await requireRole(...PATIENT_ROLES);
  const P = "/benh-nhan/moi";
  const d = parsePatient(formData, P);
  const dup = await prisma.patient.findFirst({
    where: { fullName: { equals: d.fullName, mode: "insensitive" }, birthYear: d.birthYear, phone: d.phone },
  });
  if (dup) go(`/benh-nhan/${dup.id}`, "Bệnh nhân này đã có hồ sơ (trùng họ tên, năm sinh, điện thoại).");
  const p = await prisma.patient.create({ data: { ...d, createdBy: staff.fullName } });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, action: "CREATE", entity: "Patient", entityId: p.id, detail: d.fullName,
  });
  revalidatePath("/benh-nhan");
  redirect(`/benh-nhan/${p.id}`);
}

export async function updatePatient(formData: FormData) {
  const staff = await requireRole(...PATIENT_ROLES);
  const id = str(formData, "id");
  if (!id) go("/benh-nhan");
  const P = `/benh-nhan/${id}/sua`;
  const d = parsePatient(formData, P);
  const before = await prisma.patient.findUnique({ where: { id } });
  if (!before) go("/benh-nhan", "Không tìm thấy hồ sơ.");
  await prisma.patient.update({
    where: { id },
    data: {
      ...d,
      address: d.address ?? null, occupation: d.occupation ?? null, weightKg: d.weightKg ?? null,
      heightCm: d.heightCm ?? null, pastHistory: d.pastHistory ?? null, familyHistory: d.familyHistory ?? null,
      allergies: d.allergies ?? null, chronicConditions: d.chronicConditions ?? null, note: d.note ?? null,
    },
  });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, action: "UPDATE", entity: "Patient", entityId: id, detail: d.fullName,
  });
  revalidatePath("/benh-nhan");
  revalidatePath(`/benh-nhan/${id}`);
  redirect(`/benh-nhan/${id}`);
}

// Chỉ xóa được hồ sơ chưa có lượt khám.
export async function deletePatient(formData: FormData) {
  const staff = await requireRole(...PATIENT_DELETE_ROLES);
  const id = str(formData, "id");
  if (!id) go("/benh-nhan");
  const p = await prisma.patient.findUnique({ where: { id } });
  if (!p) go("/benh-nhan");
  if ((await prisma.visit.count({ where: { patientId: id } })) > 0)
    go(`/benh-nhan/${id}`, "Hồ sơ đã có lượt khám nên không xóa được (cần giữ bệnh án).");
  await prisma.patient.delete({ where: { id } });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, action: "DELETE", entity: "Patient", entityId: id, detail: p.fullName,
  });
  revalidatePath("/benh-nhan");
  redirect("/benh-nhan");
}

function assertBranch(staff: CurrentStaff, branchId: string | undefined, path: string): string {
  if (!branchId) go(path, "Chọn chi nhánh.");
  if (!staff.isOwner && !staff.branchIds.includes(branchId)) go(path, "Bạn không thuộc chi nhánh này.");
  return branchId;
}

// ---------- Tiếp đón: tạo lượt khám ----------

export async function createVisit(formData: FormData) {
  const staff = await requireRole(...PATIENT_ROLES);
  const patientId = str(formData, "patientId");
  if (!patientId) go("/benh-nhan");
  const P = `/benh-nhan/${patientId}`;
  const branchId = assertBranch(staff, str(formData, "branchId"), P);
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) go("/benh-nhan", "Không tìm thấy hồ sơ.");
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch || !branch.active) go(P, "Chi nhánh không hoạt động.");

  const weightKg = num(formData, "weightKg");
  const heightCm = num(formData, "heightCm");
  const temperature = num(formData, "temperature");
  const pulse = num(formData, "pulse");
  for (const [v, label, max] of [[weightKg, "Cân nặng", 400], [heightCm, "Chiều cao", 260], [temperature, "Nhiệt độ", 45], [pulse, "Mạch", 300]] as const) {
    if (v !== undefined && (Number.isNaN(v) || v <= 0 || v > max)) go(P, `${label} không hợp lệ.`);
  }

  const dayStart = vnDayStart();
  const open = await prisma.visit.findFirst({
    where: { patientId, branchId, createdAt: { gte: dayStart }, status: { in: ["WAITING", "IN_EXAM"] } },
  });
  if (open) go(P, "Bệnh nhân đang có lượt khám chưa xong hôm nay tại chi nhánh này.");

  const count = await prisma.visit.count({ where: { branchId, createdAt: { gte: dayStart } } });
  const v = await prisma.visit.create({
    data: {
      patientId, branchId, queueNo: count + 1, reason: str(formData, "reason"),
      weightKg, heightCm, temperature, pulse: pulse === undefined ? undefined : Math.round(pulse),
      bloodPressure: str(formData, "bloodPressure"), createdBy: staff.fullName,
    },
  });
  if (weightKg !== undefined || heightCm !== undefined) {
    await prisma.patient.update({
      where: { id: patientId },
      data: { ...(weightKg !== undefined ? { weightKg } : {}), ...(heightCm !== undefined ? { heightCm } : {}) },
    });
  }
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId, action: "CREATE", entity: "Visit", entityId: v.id,
    detail: `${patient.fullName} · số ${v.queueNo}`,
  });
  revalidatePath("/tiep-don");
  revalidatePath(P);
  redirect(`/tiep-don?cn=${branchId}&ok=${v.queueNo}`);
}

export async function cancelVisit(formData: FormData) {
  const staff = await requireRole(...PATIENT_ROLES);
  const id = str(formData, "id");
  if (!id) go("/tiep-don");
  const v = await prisma.visit.findUnique({ where: { id }, include: { patient: true } });
  if (!v) go("/tiep-don");
  assertBranch(staff, v.branchId, "/tiep-don");
  if (v.status !== "WAITING") go(`/tiep-don?cn=${v.branchId}`, "Chỉ hủy được lượt đang chờ.");
  await prisma.visit.update({ where: { id }, data: { status: "CANCELLED" } });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId: v.branchId, action: "CANCEL", entity: "Visit", entityId: id,
    detail: v.patient.fullName,
  });
  revalidatePath("/tiep-don");
  redirect(`/tiep-don?cn=${v.branchId}`);
}
