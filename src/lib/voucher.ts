import { prisma } from "@/lib/db";

// Số phiếu: <loại>-<yyyymmdd>-<số thứ tự trong ngày>, vd PN-20261022-003. Cấp liên tục, không bao giờ cấp lại.
export const KIND_OF: Record<string, string> = { "kiem-ke": "KK", "xuat-huy": "XH", "danh-muc": "DM", "benh-nhan": "BN", "phieu-nhap": "PN" };
export const KIND_NAME: Record<string, string> = { PN: "Nhập kho", KK: "Kiểm kê", XH: "Xuất hủy", DM: "Danh mục & giá", BN: "Hồ sơ bệnh nhân" };
export const VOUCHER_RE = /^[A-Z]{2}-\d{8}-\d{3,}$/;
const vnDay = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10).replace(/-/g, "");

export async function issueVoucher(kind: string, branchId: string | null, by: string | null): Promise<string> {
  const day = vnDay();
  for (let i = 0; i < 6; i++) {
    const last = await prisma.voucher.findFirst({ where: { kind, day }, orderBy: { seq: "desc" }, select: { seq: true } });
    const seq = (last?.seq ?? 0) + 1;
    const code = `${kind}-${day}-${String(seq).padStart(3, "0")}`;
    try {
      await prisma.voucher.create({ data: { code, kind, day, seq, branchId, issuedBy: by } });
      return code;
    } catch {
      /* hai người cùng lấy một số: thử lại với số kế tiếp */
    }
  }
  throw new Error("Không cấp được số phiếu, hãy thử lại.");
}

const dt = (d: Date) => d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

// Số phiếu có dùng được không? Trả lỗi bằng tiếng Việt, hoặc null nếu dùng được.
export async function checkVoucher(code: string, kind: string, branchId: string | null): Promise<string | null> {
  const v = await prisma.voucher.findUnique({ where: { code } });
  if (!v) return `Số phiếu ${code} không do app cấp. Hãy tải mẫu mới từ trang Biểu mẫu.`;
  if (v.kind !== kind) return `Số phiếu ${code} không phải phiếu loại này.`;
  if ((v.branchId ?? null) !== (branchId ?? null)) return `Số phiếu ${code} được cấp cho chi nhánh khác.`;
  if (v.status === "USED") return `Số phiếu ${code} đã được nhập${v.usedAt ? ` lúc ${dt(v.usedAt)}` : ""}${v.usedBy ? ` (${v.usedBy})` : ""}. Mỗi số phiếu chỉ nhập một lần, hãy tải phiếu mới.`;
  if (v.status === "VOID") return `Số phiếu ${code} đã bị hủy${v.voidedAt ? ` lúc ${dt(v.voidedAt)}` : ""}. Hãy tải phiếu mới.`;
  return null;
}

// Đánh dấu đã dùng, nguyên tử: hai người cùng nhập một phiếu thì chỉ một người được.
export async function claimVoucher(code: string, by: string): Promise<boolean> {
  const r = await prisma.voucher.updateMany({ where: { code, status: "ISSUED" }, data: { status: "USED", usedAt: new Date(), usedBy: by } });
  return r.count === 1;
}
// Lưu lỗi thì trả phiếu về trạng thái chưa dùng.
export async function releaseVoucher(code: string) {
  await prisma.voucher.updateMany({ where: { code, status: "USED" }, data: { status: "ISSUED", usedAt: null, usedBy: null } });
}
