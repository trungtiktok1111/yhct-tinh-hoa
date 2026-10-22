import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { getCurrentStaff } from "@/lib/auth";
import { COST_VIEW_ROLES, STOCK_VIEW_ROLES, hasAny } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Xuất tồn kho ra Excel (.xlsx) có định dạng, dùng để kiểm kê hoặc lưu sổ.
export async function GET(req: NextRequest) {
  const staff = await getCurrentStaff();
  if (!staff || !hasAny(staff.roles, STOCK_VIEW_ROLES)) return new Response("Không có quyền", { status: 403 });
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === req.nextUrl.searchParams.get("cn")) ?? branches[0];
  if (!branch) return new Response("Chưa có chi nhánh", { status: 400 });
  const cost = hasAny(staff.roles, COST_VIEW_ROLES);
  const items = await prisma.item.findMany({
    where: { active: true }, orderBy: [{ type: "asc" }, { name: "asc" }],
    include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 1 }, lots: { where: { branchId: branch.id, qtyRemaining: { gt: 0 } } } },
  });

  const wb = new ExcelJS.Workbook();
  wb.creator = "YHCT Tinh Hoa";
  const ws = wb.addWorksheet("Tồn kho", { views: [{ state: "frozen", ySplit: 4 }] });
  const cols: [string, number, string?][] = [
    ["STT", 6], ["Mã hàng", 11], ["Tên mặt hàng", 30], ["Loại", 12], ["Đơn vị", 9], ["Tồn kho", 12, "#,##0.##"],
    ["Tối thiểu", 11, "#,##0.##"], ["Hạn gần nhất", 14, "dd/mm/yyyy"],
    ...(cost ? ([["Giá nhập TB", 14, "#,##0.##"], ["Giá trị tồn", 15, "#,##0"]] as [string, number, string][]) : []),
    ["Giá bán", 12, "#,##0"], ["Trạng thái", 16],
  ];
  ws.getCell("A1").value = `TỒN KHO · ${branch.name}`;
  ws.getCell("A1").font = { bold: true, size: 14 };
  ws.getCell("A2").value = `Xuất lúc ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`;
  ws.getCell("A2").font = { italic: true, color: { argb: "FF6B7280" } };
  const head = ws.getRow(4);
  cols.forEach(([h, w], i) => {
    const c = head.getCell(i + 1);
    c.value = h;
    c.font = { bold: true, color: { argb: "FFFFFFFF" } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1B4332" } };
    c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    ws.getColumn(i + 1).width = w;
  });
  head.height = 26;

  const now = Date.now();
  let totalValue = 0;
  items.forEach((it, idx) => {
    const total = it.lots.reduce((s, l) => s + l.qtyRemaining, 0);
    const value = it.lots.reduce((s, l) => s + l.qtyRemaining * l.unitCost, 0);
    totalValue += value;
    const exps = it.lots.map((l) => l.expiryDate).filter(Boolean) as Date[];
    const nearest = exps.length ? new Date(Math.min(...exps.map((d) => d.getTime()))) : null;
    const status = total <= 0 ? "Hết hàng" : it.minStock > 0 && total < it.minStock ? "Dưới tối thiểu"
      : nearest && nearest.getTime() < now ? "Có lô hết hạn" : nearest && nearest.getTime() < now + 90 * 86400000 ? "Gần hết hạn" : "Còn hàng";
    const vals: (string | number | Date | null)[] = [
      idx + 1, it.code ?? "", it.name, it.type === "HERB" ? "Vị thuốc" : "Thành phẩm", it.unit, Math.round(total * 100) / 100, it.minStock, nearest,
      ...(cost ? [total ? Math.round((value / total) * 100) / 100 : 0, Math.round(value)] : []), it.prices[0]?.price ?? null, status,
    ];
    const row = ws.getRow(5 + idx);
    vals.forEach((v, i) => {
      const c = row.getCell(i + 1);
      c.value = v;
      if (cols[i][2]) c.numFmt = cols[i][2] as string;
      c.border = { bottom: { style: "thin", color: { argb: "FFE5E7EB" } } };
    });
    const st = row.getCell(cols.length);
    if (status !== "Còn hàng") st.font = { bold: true, color: { argb: status === "Gần hết hạn" ? "FFB45309" : "FFB91C1C" } };
  });
  if (cost) {
    const r = ws.getRow(5 + items.length + 1);
    r.getCell(3).value = "Tổng giá trị tồn (theo giá nhập)";
    r.getCell(3).font = { bold: true };
    r.getCell(10).value = Math.round(totalValue);
    r.getCell(10).numFmt = "#,##0";
    r.getCell(10).font = { bold: true };
  }
  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4 + Math.max(items.length, 1), column: cols.length } };
  const buf = Buffer.from(await wb.xlsx.writeBuffer());
  return new Response(new Uint8Array(buf), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="ton-kho-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
