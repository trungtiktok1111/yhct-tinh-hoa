import { NextRequest, NextResponse } from "next/server";
import { getCurrentStaff } from "@/lib/auth";
import { STOCK_WRITE_ROLES, ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { analyzeSheet, MAX_BYTES } from "@/lib/stockSheet";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Xem trước: đọc và kiểm tra file, không ghi gì vào kho.
export async function POST(req: NextRequest) {
  const staff = await getCurrentStaff();
  if (!staff || !hasAny(staff.roles, STOCK_WRITE_ROLES)) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  const fd = await req.formData();
  const f = fd.get("file");
  if (!(f instanceof File) || f.size === 0) return NextResponse.json({ error: "Chưa chọn file." }, { status: 400 });
  if (f.size > MAX_BYTES) return NextResponse.json({ error: "File quá lớn (tối đa 2MB)." }, { status: 400 });
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === fd.get("cn"));
  if (!branch) return NextResponse.json({ error: "Chọn chi nhánh hợp lệ." }, { status: 400 });
  const res = await analyzeSheet(Buffer.from(await f.arrayBuffer()), branch, { canCreate: hasAny(staff.roles, ITEM_MANAGER_ROLES) });
  const dup = await prisma.auditLog.findFirst({
    where: { action: "IMPORT_RECEIPT", branchId: branch.id, detail: { contains: `#${res.hash}` } },
    orderBy: { at: "desc" }, select: { at: true },
  });
  return NextResponse.json({ ...res, duplicateAt: dup?.at ?? null });
}
