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
