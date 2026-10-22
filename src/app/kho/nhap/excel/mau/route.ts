import { NextRequest } from "next/server";
import { getCurrentStaff } from "@/lib/auth";
import { COST_VIEW_ROLES, STOCK_WRITE_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { buildTemplate } from "@/lib/stockSheet";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const staff = await getCurrentStaff();
  if (!staff || !hasAny(staff.roles, STOCK_WRITE_ROLES)) return new Response("Không có quyền", { status: 403 });
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === req.nextUrl.searchParams.get("cn")) ?? branches[0];
  if (!branch) return new Response("Chưa có chi nhánh", { status: 400 });
  const buf = await buildTemplate(branch, { cost: hasAny(staff.roles, COST_VIEW_ROLES) });
  return new Response(new Uint8Array(buf), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="kho-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
