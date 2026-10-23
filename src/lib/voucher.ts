import { prisma } from "@/lib/db";

// Số phiếu: <loại>-<yyyymmdd>-<số thứ tự trong ngày>, vd PN-20261022-003. Cấp số trống nhỏ nhất trong ngày; số của phiếu đã hủy/xóa (chưa nhập) được cấp lại.
export const KIND_OF: Record<string, string> = { "kiem-ke": "KK", "xuat-huy": "XH", "danh-muc": "DM", "benh-nhan": "BN", "phieu-nhap": "PN" };
export const KIND_NAME: Record<string, string> = { PN: "Nhập kho", KK: "Kiểm kê", XH: "Xuất hủy", DM: "Danh mục & giá", BN: "Hồ sơ bệnh nhân" };
export const VOUCHER_RE = /^[A-Z]{2}-\d{8}-\d{3,}$/;
const vnDay = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10).replace(/-/g, "");

export async function issueVoucher(kind: string, branchId: string | null, by: string | null): Promise<string> {
  const day = vnDay();
  for (let i = 0; i < 8; i++) {
    // Số nhỏ nhất đang trống trong ngày: số của phiếu đã hủy/xóa (chưa nhập) được cấp lại,
    // nên số thứ tự trong ngày luôn khớp số lô nhập thực tế.
    const rows = await prisma.voucher.findMany({ where: { kind, day }, select: { seq: true, status: true } });
    const active = new Set(rows.filter((r) => r.status !== "VOID").map((r) => r.seq));
    let seq = 1;
    while (active.has(seq)) seq++;
    const code = `${kind}-${day}-${String(seq).padStart(3, "0")}`;
    if (rows.some((r) => r.seq === seq)) {
      // tái sử dụng số đã hủy: chuyển lại thành "đã cấp" (nguyên tử, tránh hai người cùng lấy)
      const r = await prisma.voucher.updateMany({
        where: { code, status: "VOID" },
        data: { status: "ISSUED", issuedAt: new Date(), issuedBy: by, branchId, usedAt: null, usedBy: null, voidedAt: null, voidedBy: null, hidden: false, note: null },
      });
      if (r.count === 1) return code;
      continue;
    }
    try {
      await prisma.voucher.create({ data: { code, kind, day, seq, branchId, issuedBy: by } });
      return code;
    } catch {
      /* hai người cùng lấy một số: thử lại */
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
