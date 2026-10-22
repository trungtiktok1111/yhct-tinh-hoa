import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { STOCK_WRITE_ROLES } from "@/lib/permissions";
import { emptyAnalysis, MAX_ROWS, type Analysis, type ImportRow, type Importer } from "@/lib/importKit";
import { FIRST_ROW, fmt, guideSheet, hashOf, makeSheet, openSheet, protect, styleRow, text, toNumber, type ColSpec } from "@/lib/sheetKit";

// Phiếu xuất hủy: liệt kê từng lô đã hết hạn hoặc sắp hết hạn trong 30 ngày. Điền số lượng hủy và lý do.
// Mỗi dòng gắn với đúng một lô (mã lô ở cột A), nên số bị trừ đúng lô, đúng giá vốn.
export const SHEET = "Xuất hủy";
export const MARKER = "YHCT-XUAT-HUY v1";
const REASONS = ["Hết hạn", "Hư hỏng, ẩm mốc", "Mối mọt, côn trùng", "Khác"];
const DAY = 86400_000;

const COLS: ColSpec[] = [
  { header: "Mã lô", width: 14 }, { header: "Mã hàng", width: 10 }, { header: "Tên mặt hàng", width: 28 }, { header: "ĐVT", width: 7 },
  { header: "Số phiếu nhập", width: 19 }, { header: "Hạn dùng", width: 12 }, { header: "Còn trên sổ", width: 13 }, { header: "Tình trạng", width: 14 },
  { header: "Số lượng hủy", width: 14, input: true }, { header: "Lý do hủy", width: 24, input: true },
];

type LotRow = { id: string; branchId: string; qtyRemaining: number; unitCost: number; expiryDate: Date | null; note: string | null; item: { id: string; code: string | null; name: string; unit: string } };
const dmy = (d: Date) => d.toISOString().slice(0, 10).split("-").reverse().join("/");
const q2 = (n: number) => Math.round(n * 100) / 100;

async function build(branch: { id: string; name: string }, voucher: string): Promise<Buffer> {
  const lots = (await prisma.stockLot.findMany({
    where: { branchId: branch.id, qtyRemaining: { gt: 0 }, expiryDate: { lt: new Date(Date.now() + 30 * DAY) } },
    include: { item: { select: { id: true, code: true, name: true, unit: true } } }, orderBy: { expiryDate: "asc" },
  })) as unknown as LotRow[];
  const wb = new ExcelJS.Workbook();
  wb.creator = "YHCT Tinh Hoa";
  const ws = makeSheet(wb, {
    voucher,
    name: SHEET, marker: MARKER, title: "PHIẾU XUẤT HỦY HÀNG", scope: branch.name,
    note: "Liệt kê lô đã hết hạn hoặc hết hạn trong 30 ngày. Điền Số lượng hủy và Lý do cho lô cần hủy. Lô không điền được bỏ qua.",
    cols: COLS, groups: [{ from: 1, to: 8, label: "HỆ THỐNG (không sửa)" }, { from: 9, to: 10, label: "ĐIỀN VÀO ĐÂY", input: true }], frozenCols: 3,
  });
  const now = Date.now();
  lots.forEach((l, idx) => {
    const r = FIRST_ROW + idx;
    const row = ws.getRow(r);
    const e = l.expiryDate as Date;
    [l.id, l.item.code ?? "", l.item.name, l.item.unit, l.note?.match(/PN-[0-9]{8}-[0-9A-F]{3,6}/)?.[0] ?? "", dmy(e), q2(l.qtyRemaining), e.getTime() < now ? "Đã hết hạn" : "Sắp hết hạn"].forEach((v, i) => (row.getCell(i + 1).value = v));
    styleRow(ws, r, COLS);
    row.getCell(1).font = { size: 7, color: { argb: "FF9CA3AF" } };
    row.getCell(1).alignment = { shrinkToFit: true };
    row.getCell(7).numFmt = row.getCell(9).numFmt = '#,##0.##;-#,##0.##;"-"';
    row.getCell(7).alignment = row.getCell(9).alignment = { horizontal: "right" };
    row.getCell(6).alignment = { horizontal: "center" };
    if (e.getTime() < now) row.getCell(8).font = { bold: true, color: { argb: "FF991B1B" } };
    row.getCell(9).dataValidation = { type: "decimal", operator: "greaterThan", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Số lượng hủy", error: "Nhập số lớn hơn 0, không quá số còn trên sổ." };
    row.getCell(10).dataValidation = { type: "list", allowBlank: true, formulae: [`"${REASONS.join(",")}"`], showErrorMessage: false };
  });
  if (!lots.length) { ws.getCell(FIRST_ROW, 1).value = "Hiện không có lô nào hết hạn hoặc sắp hết hạn trong 30 ngày."; ws.getCell(FIRST_ROW, 1).font = { italic: true }; }
  await protect(ws);
  guideSheet(wb, [
    "HƯỚNG DẪN PHIẾU XUẤT HỦY HÀNG",
    "",
    "1. Phiếu chỉ liệt kê các lô đã hết hạn hoặc sẽ hết hạn trong 30 ngày tại chi nhánh ghi ở ô B2.",
    "2. Điền Số lượng hủy và Lý do vào các ô vàng của lô cần hủy. Có thể hủy một phần lô. Dược liệu tính bằng gam.",
    "3. Không sửa cột Mã lô. App dùng mã này để trừ đúng lô.",
    "4. Tải phiếu lên ở Biểu mẫu, Phiếu xuất hủy. App hiện bảng xem trước và chỉ lưu khi bạn xác nhận.",
    "5. Nếu số còn của lô đã đổi từ lúc xuất phiếu (có phát thuốc), app chặn dòng đó, hãy xuất phiếu mới.",
    "6. Hủy lô còn hạn là cảnh báo, cần tích xác nhận. Mỗi lần hủy được ghi vào thẻ kho và nhật ký.",
    "7. Mỗi file chỉ nhập một lần.",
  ]);
  return Buffer.from(await wb.xlsx.writeBuffer());
}

type Op = { lotId: string; itemId: string; name: string; unit: string; qty: number; reason: string; expect: number; value: number };

async function analyze(buf: Buffer, branch: { id: string; name: string }): Promise<Analysis> {
  const o = await openSheet(buf, { name: SHEET, marker: MARKER, scope: branch.name, cols: COLS, what: "Phiếu xuất hủy hàng" });
  if (!o.ws) return emptyAnalysis(hashOf(buf), o.error);
  const hash = o.voucher ?? hashOf(buf);
  const ws = o.ws;
  const lots = (await prisma.stockLot.findMany({ where: { branchId: branch.id }, include: { item: { select: { id: true, code: true, name: true, unit: true } } } })) as unknown as LotRow[];
  const byId = new Map(lots.map((l) => [l.id, l]));
  const seen = new Set<string>();
  const rows: ImportRow[] = [];
  const ops: Op[] = [];
  let total = 0;
  for (let r = FIRST_ROW; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const id = text(row.getCell(1).value);
    const qty = toNumber(row.getCell(9).value);
    if (!id || qty === null) continue;
    if (rows.length >= MAX_ROWS) return emptyAnalysis(hash, `Tối đa ${MAX_ROWS} dòng mỗi lần.`);
    const errors: string[] = [], warnings: string[] = [];
    const l = byId.get(id);
    if (!l) errors.push("Mã lô không có ở chi nhánh này. Không sửa cột Mã lô.");
    else if (l.item.name !== text(row.getCell(3).value)) errors.push(`Tên không khớp lô (file: ${text(row.getCell(3).value)}, hệ thống: ${l.item.name}). Tải phiếu mới.`);
    if (seen.has(id)) errors.push("Lô bị lặp trong file.");
    seen.add(id);
    if (qty === "bad" || qty <= 0) errors.push("Số lượng hủy phải lớn hơn 0.");
    const reason = text(row.getCell(10).value);
    if (!reason) errors.push("Phải ghi lý do hủy.");
    else if (reason.length > 120) errors.push("Lý do quá dài (tối đa 120 ký tự).");
    let value = 0;
    if (l && typeof qty === "number" && qty > 0) {
      const sheetLeft = toNumber(row.getCell(7).value);
      if (typeof sheetLeft !== "number" || Math.abs(sheetLeft - l.qtyRemaining) > 0.005) errors.push(`Số còn của lô đã đổi từ lúc xuất phiếu (phiếu: ${fmt(Number(sheetLeft) || 0)}, hiện tại: ${fmt(l.qtyRemaining)}). Tải phiếu mới.`);
      else if (qty > l.qtyRemaining + 1e-9) errors.push(`Hủy ${fmt(qty)} nhiều hơn số còn ${fmt(l.qtyRemaining)} ${l.item.unit}.`);
      if (l.expiryDate && l.expiryDate.getTime() >= Date.now()) warnings.push("Lô này còn hạn, xác nhận là cần hủy.");
      if (l.qtyRemaining > 0 && qty < l.qtyRemaining && l.expiryDate && l.expiryDate.getTime() < Date.now()) warnings.push(`Lô đã hết hạn nhưng chỉ hủy một phần (còn ${fmt(l.qtyRemaining - qty)} ${l.item.unit}).`);
      value = Math.round(qty * l.unitCost);
      if (!errors.length) { ops.push({ lotId: l.id, itemId: l.item.id, name: l.item.name, unit: l.item.unit, qty, reason, expect: l.qtyRemaining, value }); total += value; }
    }
    rows.push({ row: r, label: `${l?.item.code ?? ""} ${l?.item.name ?? text(row.getCell(3).value)}`, detail: typeof qty === "number" && l ? `Hủy ${fmt(qty)}/${fmt(l.qtyRemaining)} ${l.item.unit} · ${reason}` : "", errors, warnings });
  }
  const out: Analysis = { hash, fileErrors: [], rows, summary: `${rows.length} lô hủy, giá trị vốn ${fmt(total)} đ`, payload: ops };
  if (!rows.length) out.fileErrors.push("Chưa điền Số lượng hủy ở dòng nào.");
  return out;
}

export const huyHang: Importer = {
  id: "xuat-huy", name: "Phiếu xuất hủy hàng", roles: STOCK_WRITE_ROLES, needsBranch: true,
  columns: ["Lô hàng", "Số lượng hủy và lý do"], allowedHint: "Mỗi dòng trừ đúng một lô và ghi vào thẻ kho.",
  build: (c) => build(c.branch!, c.voucher), fileName: () => "phieu-xuat-huy",
  analyze: (b, c) => analyze(b, c.branch!),
  async commit(a, c) {
    const ops = a.payload as Op[];
    const branchId = c.branch!.id;
    await prisma.$transaction(async (tx) => {
      for (const op of ops) {
        const lot = await tx.stockLot.findUnique({ where: { id: op.lotId } });
        if (!lot || Math.abs(lot.qtyRemaining - op.expect) > 0.005) throw new Error(`Lô của ${op.name} vừa thay đổi, chưa lưu gì. Hãy thử lại.`);
        await tx.stockLot.update({ where: { id: op.lotId }, data: { qtyRemaining: lot.qtyRemaining - op.qty } });
        await tx.stockMove.create({ data: { itemId: op.itemId, branchId, lotId: op.lotId, type: "ADJUST", qty: -op.qty, reason: `Hủy hàng: ${op.reason}`, staffName: c.staff.fullName } });
      }
    }, { timeout: 60_000 }).catch((e: unknown) => { throw new Error(e instanceof Error && e.message.startsWith("Lô của") ? e.message : "Không lưu được, chưa có gì được ghi. Hãy thử lại."); });
    for (const op of ops) await logAudit({ staffId: c.staff.id, staffName: c.staff.fullName, branchId, action: "ADJUST", entity: "Stock", entityId: op.itemId, detail: `${op.name} -${op.qty}${op.unit} · Hủy hàng: ${op.reason} (giá vốn ${op.value}đ)` });
    return `Đã hủy ${ops.length} lô, giá trị vốn ${fmt(ops.reduce((s, o) => s + o.value, 0))} đ.`;
  },
};
