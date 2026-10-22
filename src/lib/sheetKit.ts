import ExcelJS from "exceljs";
import { createHash } from "crypto";

// Khung chung cho mọi mẫu Excel điền rồi tải lên: cùng bố cục, cùng cách khóa ô, cùng cách đọc.
// Cấu trúc mỗi mẫu: A1 tiêu đề + mã nhận diện, B2 chi nhánh (hoặc "Toàn hệ thống"), hàng 4 nhãn nhóm,
// hàng 5 tên cột, từ hàng 6 là dữ liệu. Ô nền vàng là ô điền, ô xám là dữ liệu của hệ thống (khóa).
export const HEADER_ROW = 5;
export const FIRST_ROW = 6;
export const YELLOW = "FFFFF4C2";
export const GREEN_IN = "FFE4F1E8";
export const GREY = "FFF1F3F2";
export const DARK = "FF1B4332";
export const SLATE = "FF4B5B54";

export type ColSpec = { header: string; width: number; input?: boolean };
export type Group = { from: number; to: number; label: string; input?: boolean };

const fill = (argb: string) => ({ type: "pattern", pattern: "solid", fgColor: { argb } }) as ExcelJS.Fill;

// Số phiếu do app cấp (lib/voucher.ts), ghi ở ô F1 (khóa). Mỗi số phiếu chỉ nhập được một lần.
export function stampVoucher(ws: ExcelJS.Worksheet, code: string) {
  const c = ws.getCell(1, 6);
  c.value = `Số phiếu: ${code}`;
  c.font = { bold: true, size: 12, color: { argb: "FFB42318" } };
}
export function readVoucher(ws: ExcelJS.Worksheet): string | null {
  return text(ws.getCell(1, 6).value).match(/^Số phiếu:\s*([A-Z]{2}-\d{8}-\d{3,})$/)?.[1] ?? null;
}

export function makeSheet(wb: ExcelJS.Workbook, o: { voucher: string; name: string; marker: string; title: string; scope: string; note: string; cols: ColSpec[]; groups: Group[]; frozenCols?: number }): ExcelJS.Worksheet {
  const ws = wb.addWorksheet(o.name, { views: [{ state: "frozen", xSplit: o.frozenCols ?? 2, ySplit: HEADER_ROW }] });
  ws.getCell("A1").value = `${o.title} · ${o.marker}`;
  ws.getCell("A1").font = { bold: true, size: 14 };
  stampVoucher(ws, o.voucher);
  ws.getCell("A2").value = o.scope.startsWith("Toàn") ? "Phạm vi:" : "Chi nhánh:";
  ws.getCell("B2").value = o.scope;
  ws.getCell("A2").font = ws.getCell("B2").font = { bold: true };
  const stamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  ws.getCell(2, Math.min(6, o.cols.length)).value = `Xuất lúc ${stamp}`;
  ws.getCell(2, Math.min(6, o.cols.length)).font = { italic: true, color: { argb: "FF6B7280" } };
  ws.getCell("A3").value = o.note;
  ws.getCell("A3").font = { italic: true, color: { argb: "FF7A5B00" } };
  for (const g of o.groups) {
    if (g.to > g.from) ws.mergeCells(4, g.from, 4, g.to);
    const c = ws.getCell(4, g.from);
    c.value = g.label;
    c.font = { bold: true, size: 10, color: { argb: g.input ? DARK : "FF3F4A45" } };
    c.fill = fill(g.input ? "FFC9E4D2" : "FFD9DEDB");
    c.alignment = { horizontal: "center" };
  }
  const head = ws.getRow(HEADER_ROW);
  o.cols.forEach((c, i) => {
    const cell = head.getCell(i + 1);
    cell.value = c.header;
    cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
    cell.fill = fill(c.input ? DARK : SLATE);
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    ws.getColumn(i + 1).width = c.width;
  });
  head.height = 44;
  ws.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: `${HEADER_ROW}:${HEADER_ROW}` };
  return ws;
}

// Tô và khóa/mở khóa các ô của một dòng theo cột nhập.
export function styleRow(ws: ExcelJS.Worksheet, r: number, cols: ColSpec[], opts: { inputFill?: string } = {}) {
  const row = ws.getRow(r);
  cols.forEach((c, i) => {
    const cell = row.getCell(i + 1);
    cell.fill = fill(c.input ? opts.inputFill ?? YELLOW : GREY);
    cell.protection = { locked: !c.input };
    cell.border = { bottom: { style: "hair", color: { argb: "FFD1D5DB" } } };
  });
}

export async function protect(ws: ExcelJS.Worksheet) {
  await ws.protect("", { selectLockedCells: true, selectUnlockedCells: true, autoFilter: true, formatColumns: true, formatRows: true });
}

export function guideSheet(wb: ExcelJS.Workbook, lines: string[]) {
  const g = wb.addWorksheet("Hướng dẫn");
  g.getColumn(1).width = 110;
  lines.forEach((t, i) => {
    const c = g.getCell(i + 1, 1);
    c.value = t;
    c.alignment = { wrapText: true, vertical: "top" };
    if (i === 0) c.font = { bold: true, size: 13 };
  });
}

// ---------- Đọc ----------
export function text(v: ExcelJS.CellValue): string {
  if (v == null) return "";
  if (typeof v === "object") {
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    if ("richText" in v) return v.richText.map((t) => t.text).join("").trim();
    if ("text" in v && typeof v.text === "string") return v.text.trim();
    if ("result" in v && v.result != null) return String(v.result).trim();
    return "";
  }
  return String(v).trim();
}

export function toNumber(v: ExcelJS.CellValue): number | null | "bad" {
  if (v == null || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : "bad";
  if (typeof v === "object" && "result" in v && typeof v.result === "number") return v.result;
  let t = text(v).replace(/\s/g, "");
  if (!t) return null;
  if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
  t = t.replace(",", ".");
  const n = Number(t);
  return Number.isFinite(n) ? n : "bad";
}

// Ngày: ô ngày của Excel hoặc chữ dd/mm/yyyy. Trả "yyyy-mm-dd".
export function toDay(v: ExcelJS.CellValue): { iso: string | null; bad: boolean } {
  if (v == null || v === "") return { iso: null, bad: false };
  if (v instanceof Date) return isNaN(v.getTime()) ? { iso: null, bad: true } : { iso: v.toISOString().slice(0, 10), bad: false };
  const t = text(v);
  const m = t.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (m) {
    const d = new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));
    if (d.getUTCDate() === +m[1] && d.getUTCMonth() === +m[2] - 1) return { iso: d.toISOString().slice(0, 10), bad: false };
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(t) && !isNaN(Date.parse(t))) return { iso: t, bad: false };
  return { iso: null, bad: true };
}

export const hashOf = (buf: Buffer) => createHash("sha256").update(buf).digest("hex").slice(0, 16);
export const fmt = (n: number) => n.toLocaleString("vi-VN", { maximumFractionDigits: 2 });

// Mở file đã tải lên và kiểm tra đúng mẫu: tên trang, mã nhận diện, phạm vi (B2), tên các cột.
export async function openSheet(buf: Buffer, o: { name: string; marker: string; scope: string; cols: ColSpec[]; what: string }): Promise<{ ws?: ExcelJS.Worksheet; error?: string; voucher?: string }> {
  const wb = new ExcelJS.Workbook();
  try {
    await wb.xlsx.load(buf as unknown as ArrayBuffer);
  } catch {
    return { error: "Không đọc được file. Hãy dùng đúng file .xlsx tải từ trang Biểu mẫu." };
  }
  const ws = wb.getWorksheet(o.name);
  if (!ws || !text(ws.getCell("A1").value).includes(o.marker)) {
    return { error: `File này không phải ${o.what}. Hãy vào trang Biểu mẫu, tải mẫu “${o.what}” rồi điền vào mẫu đó.` };
  }
  if (text(ws.getCell("B2").value) !== o.scope) return { error: `File này của “${text(ws.getCell("B2").value)}”, nhưng bạn đang chọn “${o.scope}”. Tải lại mẫu đúng chi nhánh.` };
  for (let i = 0; i < o.cols.length; i++) {
    if (text(ws.getRow(HEADER_ROW).getCell(i + 1).value) !== o.cols[i].header) return { error: `Cột ${i + 1} phải là “${o.cols[i].header.replace(/\n/g, " ")}”. Mẫu đã bị đổi cấu trúc, hãy tải mẫu mới.` };
  }
  const voucher = readVoucher(ws);
  if (!voucher) return { error: "File không có Số phiếu (ô F1). Đây là file cũ hoặc đã bị sửa. Hãy tải mẫu mới từ trang Biểu mẫu để có số phiếu riêng." };
  return { ws, voucher };
}
