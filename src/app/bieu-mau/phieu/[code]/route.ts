import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentStaff } from "@/lib/auth";
import { COST_VIEW_ROLES, ITEM_MANAGER_ROLES, STOCK_WRITE_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { IMPORTERS } from "@/lib/importers";
import { KIND_OF, VOUCHER_RE } from "@/lib/voucher";
import { buildTemplate } from "@/lib/stockSheet";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Tải lại phiếu đã cấp số nhưng chưa nhập: cùng số phiếu, không cấp số mới (dùng khi tải ở máy này, làm ở máy khác).
export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const staff = await getCurrentStaff();
  if (!staff) return new Response("Chưa đăng nhập", { status: 401 });
  if (!hasAny(staff.roles, ITEM_MANAGER_ROLES)) return new Response("Không có quyền", { status: 403 });
  const code = params.code;
  if (!VOUCHER_RE.test(code)) return new Response("Số phiếu không hợp lệ", { status: 400 });
  const v = await prisma.voucher.findUnique({ where: { code } });
  if (!v || v.hidden) return new Response("Không tìm thấy số phiếu", { status: 404 });
  if (v.status !== "ISSUED") return new Response(`Phiếu ${code} đã ${v.status === "USED" ? "nhập" : "hủy"}, không tải lại được.`, { status: 409 });

  const branches = await branchesFor(staff);
  const branch = v.branchId ? branches.find((b) => b.id === v.branchId) ?? null : null;
  if (v.branchId && !branch) return new Response("Phiếu thuộc chi nhánh bạn không có quyền", { status: 403 });
  const cost = hasAny(staff.roles, COST_VIEW_ROLES);
  const xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  try {
    if (v.kind === "PN") {
      if (!hasAny(staff.roles, STOCK_WRITE_ROLES) || !branch) return new Response("Không có quyền", { status: 403 });
      const buf = await buildTemplate(branch, { cost, by: staff.fullName, voucher: code });
      return new Response(new Uint8Array(buf), { headers: { "content-type": xlsx, "content-disposition": `attachment; filename="Phieu-nhap-kho-${code}.xlsx"` } });
    }
    const id = Object.keys(KIND_OF).find((k) => KIND_OF[k] === v.kind);
    const imp = id ? IMPORTERS[id] : undefined;
    if (!imp || !hasAny(staff.roles, imp.roles)) return new Response("Không có quyền hoặc không có mẫu", { status: 403 });
    const ctx = { branch, staff, cost };
    const buf = await imp.build({ ...ctx, voucher: code });
    const base = imp.fileName(ctx).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").replace(/[^a-zA-Z0-9-]/g, "-");
    return new Response(new Uint8Array(buf), { headers: { "content-type": xlsx, "content-disposition": `attachment; filename="${base}-${code}.xlsx"` } });
  } catch (e) {
    console.error("Lỗi tải lại phiếu", code, e);
    return new Response(`Không tạo được phiếu: ${e instanceof Error ? e.message : "lỗi không rõ"}`, { status: 500 });
  }
}
