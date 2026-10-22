"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireStaff } from "@/lib/auth";
import { COST_VIEW_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { IMPORTERS } from "@/lib/importers";
import { MAX_BYTES } from "@/lib/importKit";

// Nhập một mẫu Excel: chạy lại toàn bộ kiểm tra ở máy chủ, có lỗi thì không lưu gì,
// có cảnh báo thì cần tích xác nhận, và cùng một file không nhập hai lần.
export async function runImport(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const imp = IMPORTERS[id];
  const P = `/bieu-mau/nhap/${id}`;
  const back = (msg: string): never => redirect(`${P}?loi=${encodeURIComponent(msg)}`);
  if (!imp) redirect("/bieu-mau");
  const staff = await requireStaff();
  if (!hasAny(staff.roles, imp.roles)) redirect("/khong-co-quyen");
  let branch: { id: string; name: string } | null = null;
  if (imp.needsBranch) {
    const bs = await branchesFor(staff);
    branch = bs.find((b) => b.id === String(formData.get("branchId") ?? "")) ?? null;
    if (!branch) back("Chọn chi nhánh.");
  }
  const f = formData.get("file");
  if (!(f instanceof File) || f.size === 0) back("Chưa chọn file.");
  if ((f as File).size > MAX_BYTES) back("File quá lớn (tối đa 2MB).");
  const file = f as File;
  const ctx = { branch, staff, cost: hasAny(staff.roles, COST_VIEW_ROLES) };
  const a = await imp.analyze(Buffer.from(await file.arrayBuffer()), ctx);
  if (a.fileErrors.length) back(a.fileErrors[0]);
  const bad = a.rows.filter((r) => r.errors.length);
  if (bad.length) back(`Còn ${bad.length} dòng lỗi (dòng ${bad.slice(0, 5).map((r) => r.row).join(", ")}${bad.length > 5 ? "..." : ""}). Sửa file rồi tải lại. Chưa có gì được lưu.`);
  if (a.rows.some((r) => r.warnings.length) && formData.get("confirmOdd") !== "1") back("Có dòng cảnh báo, hãy tích xác nhận đã kiểm tra rồi nhập lại.");
  const tag = `#${id}:${a.hash}`;
  const dup = await prisma.auditLog.findFirst({ where: { action: "IMPORT", detail: { contains: tag }, ...(branch ? { branchId: branch.id } : {}) }, select: { id: true } });
  if (dup) back("Số phiếu này đã được nhập trước đó. Để tránh nhập trùng, hãy tải mẫu mới.");
  let msg: string;
  try {
    msg = await imp.commit(a, { ...ctx, fileName: file.name });
  } catch (e) {
    back(e instanceof Error ? e.message : "Không lưu được, chưa có gì được ghi.");
    return;
  }
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: branch?.id ?? null, action: "IMPORT", entity: imp.name, detail: `${imp.name}: ${a.summary} ${tag}` });
  for (const p of ["/kho", "/kho/nhap", "/kho/mat-hang", "/benh-nhan", "/bieu-mau"]) revalidatePath(p);
  redirect(`${P}?ok=${encodeURIComponent(msg)}`);
}
