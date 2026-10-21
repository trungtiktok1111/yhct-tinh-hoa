export const vnd = (n: number) => n.toLocaleString("vi-VN") + " đ";
export const qty = (n: number) => (Math.round(n * 100) / 100).toLocaleString("vi-VN");
export const dateVN = (d: Date) => d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

export const SEX_LABEL: Record<string, string> = { M: "Nam", F: "Nữ", O: "Khác" };
export const VISIT_STATUS: Record<string, string> = {
  WAITING: "Đang chờ",
  IN_EXAM: "Đang khám",
  DONE: "Đã khám",
  CANCELLED: "Đã hủy",
};
export const patientCode = (seq: number) => "BN-" + String(seq).padStart(6, "0");
// Giờ Việt Nam cố định UTC+7.
const VN_OFFSET_MS = 7 * 3600 * 1000;
export const vnYear = () => new Date(Date.now() + VN_OFFSET_MS).getUTCFullYear();
export const vnDayStart = () => {
  const t = Date.now() + VN_OFFSET_MS;
  return new Date(t - (t % 86400000) - VN_OFFSET_MS);
};
export const timeVN = (d: Date) => d.toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" });

// BMI và phân loại theo chuẩn WHO khu vực châu Á - Thái Bình Dương (áp dụng cho người Việt Nam).
export function bmiOf(weightKg?: number | null, heightCm?: number | null): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  return weightKg / Math.pow(heightCm / 100, 2);
}
export function bmiClass(bmi: number): string {
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi < 23) return "Bình thường";
  if (bmi < 25) return "Thừa cân";
  if (bmi < 30) return "Béo phì độ I";
  return "Béo phì độ II";
}
export const bmiText = (w?: number | null, h?: number | null): string | null => {
  const b = bmiOf(w, h);
  return b === null ? null : `${b.toFixed(1)} · ${bmiClass(b)}`;
};
