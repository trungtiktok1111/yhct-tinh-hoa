import { NextRequest } from "next/server";
import { getCurrentStaff } from "@/lib/auth";
import { COST_VIEW_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { IMPORTERS } from "@/lib/importers";
import { MAX_BYTES } from "@/lib/importKit";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Xem trước: đọc và kiểm tra file, trả về từng dòng. Không ghi gì.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const staff = await getCurrentStaff();
  if (!staff) return Response.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const imp = IMPORTERS[params.id];
  if (!imp) return Response.json({ error: "Không có mẫu này" }, { status: 404 });
  if (!hasAny(staff.roles, imp.roles)) return Response.json({ error: "Không có quyền" }, { status: 403 });
  const fd = await req.formData();
  const f = fd.get("file");
  if (!(f instanceof File) || f.size === 0) return Response.json({ error: "Chưa chọn file." }, { status: 400 });
  if (f.size > MAX_BYTES) return Response.json({ error: "File quá lớn (tối đa 2MB)." }, { status: 400 });
  let branch: { id: string; name: string } | null = null;
  if (imp.needsBranch) {
    branch = (await branchesFor(staff)).find((b) => b.id === String(fd.get("branchId") ?? "")) ?? null;
    if (!branch) return Response.json({ error: "Chọn chi nhánh." }, { status: 400 });
  }
  const a = await imp.analyze(Buffer.from(await f.arrayBuffer()), { branch, staff, cost: hasAny(staff.roles, COST_VIEW_ROLES) });
  const dup = a.fileErrors.length ? null : await prisma.auditLog.findFirst({ where: { action: "IMPORT", detail: { contains: `#${imp.id}:${a.hash}` }, ...(branch ? { branchId: branch.id } : {}) }, select: { at: true } });
  return Response.json({ fileErrors: a.fileErrors, rows: a.rows, summary: a.summary, duplicate: !!dup });
}
