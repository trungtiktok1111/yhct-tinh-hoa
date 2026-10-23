"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { ITEM_MANAGER_ROLES } from "@/lib/permissions";

// Hủy một số phiếu đã cấp mà chưa nhập. Số đó không bao giờ được cấp lại (giữ dãy số liên tục để đối chiếu);
// phiếu bị hủy không nhập được nữa. Phiếu đã nhập thì không hủy được (dùng Hủy cả phiếu ở trang Nhập kho).
export async function voidVoucher(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const code = String(formData.get("code") ?? "");
  const v = await prisma.voucher.findUnique({ where: { code } });
  const back = (m: string): never => redirect(`/bieu-mau?msg=${encodeURIComponent(m)}`);
  if (!v) back("Không tìm thấy số phiếu.");
  if (v!.status !== "ISSUED") back(`Phiếu ${code} đã ${v!.status === "USED" ? "nhập" : "hủy"} rồi.`);
  const r = await prisma.voucher.updateMany({ where: { code, status: "ISSUED" }, data: { status: "VOID", voidedAt: new Date(), voidedBy: staff.fullName } });
  if (r.count !== 1) back("Phiếu vừa được dùng, không hủy được.");
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: v!.branchId, action: "UPDATE", entity: "Voucher", entityId: code, detail: `Hủy số phiếu ${code} (chưa nhập)` });
  revalidatePath("/bieu-mau");
  back(`Đã hủy phiếu ${code}. Số này không cấp lại.`);
}

// Xóa phiếu khỏi sổ: chỉ phiếu chưa nhập hoặc đã hủy. Số vẫn được giữ trong cơ sở dữ liệu (không cấp lại,
// dãy số vẫn liên tục để đối chiếu), chỉ ẩn khỏi danh sách. Phiếu đã nhập thì không xóa được.
export async function deleteVoucher(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const code = String(formData.get("code") ?? "");
  const v = await prisma.voucher.findUnique({ where: { code } });
  const back = (m: string): never => redirect(`/bieu-mau?msg=${encodeURIComponent(m)}`);
  if (!v) back("Không tìm thấy số phiếu.");
  if (v!.status === "USED") back(`Phiếu ${code} đã nhập dữ liệu nên không xóa được.`);
  const r = await prisma.voucher.updateMany({
    where: { code, status: { in: ["ISSUED", "VOID"] } },
    data: { hidden: true, status: "VOID", voidedAt: v!.voidedAt ?? new Date(), voidedBy: v!.voidedBy ?? staff.fullName },
  });
  if (r.count !== 1) back("Phiếu vừa được dùng, không xóa được.");
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: v!.branchId, action: "DELETE", entity: "Voucher", entityId: code, detail: `Xóa số phiếu ${code} khỏi sổ (trạng thái trước: ${v!.status})` });
  revalidatePath("/bieu-mau");
  back(`Đã xóa phiếu ${code} khỏi sổ. Số này không cấp lại.`);
}
