import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentStaff } from "@/lib/auth";
import { COST_VIEW_ROLES, STOCK_VIEW_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const staff = await getCurrentStaff();
  if (!staff || !hasAny(staff.roles, STOCK_VIEW_ROLES)) return new Response("Không có quyền", { status: 403 });
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === req.nextUrl.searchParams.get("cn")) ?? branches[0];
  if (!branch) return new Response("Chưa có chi nhánh", { status: 400 });
  const cost = hasAny(staff.roles, COST_VIEW_ROLES);
  const items = await prisma.item.findMany({
    where: { active: true }, orderBy: { name: "asc" },
    include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 1 }, lots: { where: { branchId: branch.id, qtyRemaining: { gt: 0 } } } },
  });
  const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const head = ["Mã hàng", "Tên mặt hàng", "Loại", "Đơn vị", "Tồn kho", "Tối thiểu", "Hạn gần nhất", ...(cost ? ["Giá nhập TB"] : []), "Giá bán"];
  const rows = [head.map(q).join(",")];
  for (const it of items) {
    const total = it.lots.reduce((s, l) => s + l.qtyRemaining, 0);
    const exps = it.lots.map((l) => l.expiryDate).filter(Boolean) as Date[];
    const nearest = exps.length ? new Date(Math.min(...exps.map((d) => d.getTime()))).toISOString().slice(0, 10) : "";
    const avg = total ? Math.round(it.lots.reduce((s, l) => s + l.qtyRemaining * l.unitCost, 0) / total) : 0;
    rows.push([it.code ?? "", it.name, it.type === "HERB" ? "Vị thuốc" : "Thành phẩm", it.unit, total, it.minStock, nearest, ...(cost ? [avg] : []), it.prices[0]?.price ?? ""].map(q).join(","));
  }
  return new Response("﻿" + rows.join("\r\n"), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="ton-kho-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
