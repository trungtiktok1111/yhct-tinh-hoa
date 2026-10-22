import { NextRequest, NextResponse } from "next/server";
import { getCurrentStaff } from "@/lib/auth";
import { STOCK_WRITE_ROLES, ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { analyzeSheet, MAX_BYTES } from "@/lib/stockSheet";
import { checkVoucher } from "@/lib/voucher";

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
  const vErr = res.fileErrors.length ? null : await checkVoucher(res.hash, "PN", branch.id);
  if (vErr) return NextResponse.json({ ...res, fileErrors: [vErr], rows: [], total: 0, duplicateAt: null });
  return NextResponse.json({ ...res, duplicateAt: null });
}
