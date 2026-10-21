// Thông tin cá nhân dùng chung cho bệnh nhân và nhân viên. Không import gì của Node/Next.
import { vnYear } from "@/lib/format";

export type FormState = { error?: string };

export function s(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

// "YYYY-MM-DD" -> Date 00:00 UTC. Trả undefined nếu để trống, null nếu sai.
export function parseDate(v: string | undefined, opts: { allowFuture?: boolean } = {}): Date | undefined | null {
  if (!v) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const d = new Date(`${v}T00:00:00Z`);
  if (isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) return null;
  if (d.getUTCFullYear() < 1900) return null;
  if (!opts.allowFuture && d.getTime() > Date.now() + 86400000) return null;
  return d;
}

export const toDateInput = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");
export const dobText = (d: Date) => d.toLocaleDateString("vi-VN", { timeZone: "UTC" });

export function ageOf(birthDate: Date | null | undefined, birthYear?: number | null): number | null {
  const now = new Date(Date.now() + 7 * 3600 * 1000); // giờ VN
  if (birthDate) {
    let age = now.getUTCFullYear() - birthDate.getUTCFullYear();
    const m = now.getUTCMonth() - birthDate.getUTCMonth();
    if (m < 0 || (m === 0 && now.getUTCDate() < birthDate.getUTCDate())) age--;
    return Math.max(age, 0);
  }
  return birthYear ? vnYear() - birthYear : null;
}

export const SEXES = ["M", "F", "O"];

export type Common = {
  fullName: string; birthDate: Date; sex: string; nationalId?: string; phone?: string; email?: string;
  address?: string; ward?: string; district?: string; province?: string;
};

// Kiểm tra phần thông tin cá nhân chung. Trả { error } hoặc { data }.
export function parseCommon(fd: FormData, opts: { phoneRequired: boolean }): { error: string } | { data: Common } {
  const fullName = s(fd, "fullName");
  if (!fullName) return { error: "Nhập họ tên." };
  const bd = parseDate(s(fd, "birthDate"));
  if (bd === undefined) return { error: "Nhập ngày tháng năm sinh." };
  if (bd === null) return { error: "Ngày sinh không hợp lệ (từ năm 1900, không ở tương lai)." };
  const sex = s(fd, "sex");
  if (!sex || !SEXES.includes(sex)) return { error: "Chọn giới tính." };
  const nationalId = s(fd, "nationalId")?.replace(/\s/g, "");
  if (nationalId && !/^[A-Za-z0-9]{6,15}$/.test(nationalId)) return { error: "Số CCCD/CMND/hộ chiếu không hợp lệ (6–15 ký tự chữ và số)." };
  const phoneRaw = s(fd, "phone");
  const phone = phoneRaw?.replace(/[\s.\-]/g, "");
  if (!phone && opts.phoneRequired) return { error: "Nhập số điện thoại." };
  if (phone && !/^\+?\d{8,15}$/.test(phone)) return { error: "Số điện thoại không hợp lệ (8–15 chữ số)." };
  const email = s(fd, "email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Email không hợp lệ." };
  return {
    data: {
      fullName, birthDate: bd, sex, nationalId, phone, email,
      address: s(fd, "address"), ward: s(fd, "ward"), district: s(fd, "district"), province: s(fd, "province"),
    },
  };
}
