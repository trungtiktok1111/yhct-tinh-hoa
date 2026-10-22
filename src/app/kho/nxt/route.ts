import { NextRequest } from "next/server";
import { getCurrentStaff } from "@/lib/auth";
import { COST_VIEW_ROLES, STOCK_VIEW_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { buildNxt, parseDay } from "@/lib/stockReport";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Báo cáo Nhập – Xuất – Tồn và Thẻ kho theo kỳ.
export async function GET(req: NextRequest) {
  const staff = await getCurrentStaff();
  if (!staff || !hasAny(staff.roles, STOCK_VIEW_ROLES)) return new Response("Không có quyền", { status: 403 });
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === req.nextUrl.searchParams.get("cn")) ?? branches[0];
  if (!branch) return new Response("Chưa có chi nhánh", { status: 400 });
  const from = parseDay(req.nextUrl.searchParams.get("tu"));
  const to = parseDay(req.nextUrl.searchParams.get("den"));
  if (!from || !to) return new Response("Chọn kỳ báo cáo (từ ngày, đến ngày).", { status: 400 });
  if (to < from) return new Response("Ngày kết thúc phải sau ngày bắt đầu.", { status: 400 });
  if (to.getTime() - from.getTime() > 400 * 86400_000) return new Response("Kỳ báo cáo tối đa 400 ngày.", { status: 400 });
  const buf = await buildNxt(branch, from, to, { cost: hasAny(staff.roles, COST_VIEW_ROLES), by: staff.fullName });
  return new Response(new Uint8Array(buf), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="nhap-xuat-ton-${from.toISOString().slice(0, 10)}_${to.toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
