import { NextRequest } from "next/server";
import { getCurrentStaff, logAudit } from "@/lib/auth";
import { COST_VIEW_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { formById } from "@/lib/forms";
import { BUILDERS } from "@/lib/reports";
import { parseDay } from "@/lib/stockReport";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const staff = await getCurrentStaff();
  if (!staff) return new Response("Chưa đăng nhập", { status: 401 });
  const def = formById(params.id);
  const build = BUILDERS[params.id];
  if (!def || !build) return new Response("Không có biểu mẫu này", { status: 404 });
  if (!hasAny(staff.roles, def.roles)) return new Response("Không có quyền", { status: 403 });

  const sp = req.nextUrl.searchParams;
  const branches = await branchesFor(staff);
  const chosen = branches.find((b) => b.id === sp.get("cn"));
  const list = chosen ? [chosen] : branches;
  if (def.branch && !list.length) return new Response("Chưa có chi nhánh", { status: 400 });
  // Báo cáo kho luôn theo một chi nhánh; báo cáo doanh thu, khám có thể gộp mọi chi nhánh được phép.
  const single = def.group === "Kho" ? chosen ?? branches[0] ?? null : null;
  const ids = single ? [single.id] : list.map((b) => b.id);
  const label = single ? single.name : list.length === branches.length && !chosen ? (branches.length > 1 ? "Tất cả chi nhánh" : branches[0]?.name ?? "") : list.map((b) => b.name).join(", ");

  const today = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
  const from = parseDay(sp.get("tu")) ?? parseDay(today.slice(0, 8) + "01")!;
  const to = parseDay(sp.get("den")) ?? parseDay(today)!;
  if (def.period) {
    if (to < from) return new Response("Ngày kết thúc phải sau ngày bắt đầu.", { status: 400 });
    if (to.getTime() - from.getTime() > 400 * 86400_000) return new Response("Kỳ báo cáo tối đa 400 ngày.", { status: 400 });
  }
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const start = new Date(from.getTime() - 7 * 3600_000);
  const end = new Date(to.getTime() + 86400_000 - 7 * 3600_000);
  let out: { buf: Buffer; file: string };
  try {
    out = await build({
    branchIds: ids, branchLabel: label, singleBranch: single, from: iso(from), to: iso(to), start, end,
    cost: hasAny(staff.roles, COST_VIEW_ROLES), by: staff.fullName,
    });
  } catch (e) {
    console.error("Lỗi dựng báo cáo", params.id, e);
    return new Response(`Không tạo được báo cáo: ${e instanceof Error ? e.message : "lỗi không rõ"}`, { status: 500 });
  }
  const { buf, file } = out;
  if (params.id === "ds-benh-nhan") {
    await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "EXPORT", entity: "Patient", detail: "Tải danh sách bệnh nhân (Excel)" });
  }
  return new Response(new Uint8Array(buf), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${file}.xlsx"`,
    },
  });
}
