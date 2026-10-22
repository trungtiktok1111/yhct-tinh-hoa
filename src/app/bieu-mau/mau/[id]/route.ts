import { NextRequest } from "next/server";
import { getCurrentStaff } from "@/lib/auth";
import { COST_VIEW_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { IMPORTERS } from "@/lib/importers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Tải mẫu điền (kiểm kê, xuất hủy, danh mục, bệnh nhân). Phiếu nhập kho có đường riêng đã có.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const staff = await getCurrentStaff();
  if (!staff) return new Response("Chưa đăng nhập", { status: 401 });
  const imp = IMPORTERS[params.id];
  if (!imp) return new Response("Không có mẫu này", { status: 404 });
  if (!hasAny(staff.roles, imp.roles)) return new Response("Không có quyền", { status: 403 });
  const branches = await branchesFor(staff);
  const branch = imp.needsBranch ? branches.find((b) => b.id === req.nextUrl.searchParams.get("cn")) ?? branches[0] ?? null : null;
  if (imp.needsBranch && !branch) return new Response("Chưa có chi nhánh", { status: 400 });
  const ctx = { branch, staff, cost: hasAny(staff.roles, COST_VIEW_ROLES) };
  const buf = await imp.build(ctx);
  return new Response(new Uint8Array(buf), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${imp.fileName(ctx)}-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
