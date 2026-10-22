import { parseCommon, type Common } from "@/lib/person";

// Kiểm tra và dựng dữ liệu hồ sơ bệnh nhân. Dùng chung cho form nhập tay và nhập Excel,
// nên hai đường nhập luôn theo cùng một luật.
export function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}
export function num(fd: FormData, key: string): number | undefined {
  const t = str(fd, key);
  if (!t) return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
export type PatientData = ReturnType<typeof buildData>;

export function buildData(c: Common, fd: FormData, weightKg?: number, heightCm?: number) {
  return {
    fullName: c.fullName, birthDate: c.birthDate, birthYear: c.birthDate.getUTCFullYear(), sex: c.sex,
    phone: c.phone ?? "", nationalId: c.nationalId ?? null, email: c.email ?? null,
    address: c.address ?? null, ward: c.ward ?? null, district: c.district ?? null, province: c.province ?? null,
    ethnicity: str(fd, "ethnicity") ?? null, nationality: str(fd, "nationality") ?? null,
    occupation: str(fd, "occupation") ?? null, bloodType: str(fd, "bloodType") ?? null,
    insuranceNo: str(fd, "insuranceNo") ?? null,
    emergencyName: str(fd, "emergencyName") ?? null, emergencyRelation: str(fd, "emergencyRelation") ?? null,
    emergencyPhone: str(fd, "emergencyPhone")?.replace(/[\s.\-]/g, "") ?? null,
    weightKg: weightKg ?? null, heightCm: heightCm ?? null,
    pastHistory: str(fd, "pastHistory") ?? null, familyHistory: str(fd, "familyHistory") ?? null,
    allergies: str(fd, "allergies") ?? null, chronicConditions: str(fd, "chronicConditions") ?? null,
    note: str(fd, "note") ?? null,
  };
}

export function parsePatient(fd: FormData): { error: string } | { data: PatientData } {
  const c = parseCommon(fd, { phoneRequired: true });
  if ("error" in c) return c;
  const weightKg = num(fd, "weightKg");
  const heightCm = num(fd, "heightCm");
  if (weightKg !== undefined && (Number.isNaN(weightKg) || weightKg <= 0 || weightKg > 400)) return { error: "Cân nặng không hợp lệ (kg)." };
  if (heightCm !== undefined && (Number.isNaN(heightCm) || heightCm <= 0 || heightCm > 260)) return { error: "Chiều cao không hợp lệ (cm)." };
  const ep = str(fd, "emergencyPhone")?.replace(/[\s.\-]/g, "");
  if (ep && !/^\+?\d{8,15}$/.test(ep)) return { error: "Số điện thoại người liên hệ khẩn cấp không hợp lệ." };
  return { data: buildData(c.data, fd, weightKg, heightCm) };
}

