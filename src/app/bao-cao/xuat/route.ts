import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentStaff } from "@/lib/auth";
import { hasAny, REPORT_ROLES } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";

export const dynamic = "force-dynamic";
const M: Record<string, string> = { CASH: "Tiền mặt", TRANSFER: "Chuyển khoản", CARD: "Thẻ" };

export async function GET(req: NextRequest) {
  const staff = await getCurrentStaff();
  if (!staff || !hasAny(staff.roles, REPORT_ROLES)) return new Response("Không có quyền", { status: 403 });
  const sp = req.nextUrl.searchParams;
  const ok = (v: string | null) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
  const from = ok(sp.get("tu")) ?? new Date().toISOString().slice(0, 10);
  const to = ok(sp.get("den")) ?? from;
  const branches = await branchesFor(staff);
  const chosen = branches.find((b) => b.id === sp.get("cn"));
  const ids = chosen ? [chosen.id] : branches.map((b) => b.id);
  const start = new Date(`${from}T00:00:00+07:00`);
  const end = new Date(new Date(`${to}T00:00:00+07:00`).getTime() + 86400000);
  const inv = await prisma.invoice.findMany({
    where: { branchId: { in: ids }, status: "PAID", paidAt: { gte: start, lt: end } },
    orderBy: { paidAt: "asc" },
    include: { patient: { select: { fullName: true } }, branch: { select: { name: true } } },
  });
  const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [["Số hóa đơn", "Ngày giờ thu", "Chi nhánh", "Bệnh nhân", "Loại", "Tổng tiền", "Hình thức"].map(q).join(",")];
  for (const i of inv) {
    const t = new Date((i.paidAt as Date).getTime() + 7 * 3600000).toISOString().replace("T", " ").slice(0, 16);
    rows.push([`HD-${String(i.seq).padStart(6, "0")}`, t, i.branch.name, i.patient?.fullName ?? i.customerName ?? "Khách lẻ", i.kind === "RETAIL" ? "Bán lẻ" : "Khám", i.total, i.method ? M[i.method] : ""].map(q).join(","));
  }
  return new Response("﻿" + rows.join("\r\n"), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="bao-cao-${from}-${to}.csv"` },
  });
}
