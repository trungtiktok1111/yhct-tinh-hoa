import ExcelJS from "exceljs";

// Khung chung cho mọi báo cáo dạng bảng: cùng tiêu đề, cùng kiểu cột, cùng chỗ ký, cùng cách in.
// Mọi báo cáo mới dùng khung này để nhân viên luôn nhận file đúng một kiểu.
export const GREEN = "FF1B4332";
const thin = { style: "thin", color: { argb: "FF9CA3AF" } } as const;
const box = { top: thin, bottom: thin, left: thin, right: thin };
export const VN = 7 * 3600_000;

export type KitCol = {
  h: string; w: number; key: string;
  kind?: "text" | "int" | "money" | "num" | "center";
  total?: boolean; // cộng cột này ở dòng tổng
};
export type KitCell = string | number | null;

const FMT = { int: '#,##0;-#,##0;"-"', money: '#,##0;-#,##0;"-"', num: '#,##0.##;-#,##0.##;"-"' };
const numFmt = (v: unknown, kind: KitCol["kind"]) => {
  if (kind === "num") return typeof v === "number" && !Number.isInteger(v) ? '#,##0.00;-#,##0.00;"-"' : FMT.int;
  return kind === "int" || kind === "money" ? FMT[kind] : undefined;
};

export const fmtDay = (d: Date) => new Date(d.getTime() + VN).toISOString().slice(0, 10).split("-").reverse().join("/");
export const fmtTime = (d: Date) => { const t = new Date(d.getTime() + VN).toISOString(); return `${t.slice(8, 10)}/${t.slice(5, 7)}/${t.slice(0, 4)} ${t.slice(11, 16)}`; };

export async function tableBook(o: {
  sheet: string; title: string; branch?: string; period?: { from: string; to: string }; note?: string; by: string;
  cols: KitCol[]; rows: Record<string, KitCell>[]; signatures?: boolean; landscape?: boolean;
}): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "YHCT Tinh Hoa";
  const ws = wb.addWorksheet(o.sheet.slice(0, 31), { views: [{ state: "frozen", ySplit: 6 }] });
  const n = o.cols.length;
  const stamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  ws.getCell("A1").value = "PHÒNG KHÁM ĐÔNG Y TINH HOA";
  ws.getCell("A1").font = { bold: true, size: 12 };
  ws.getCell("A2").value = o.branch ? `Chi nhánh: ${o.branch}` : "";
  ws.mergeCells(3, 1, 3, n);
  const t = ws.getCell("A3");
  t.value = o.title.toUpperCase();
  t.font = { bold: true, size: 16, color: { argb: GREEN } };
  t.alignment = { horizontal: "center" };
  ws.mergeCells(4, 1, 4, n);
  const p = ws.getCell("A4");
  p.value = o.period ? `Từ ngày ${o.period.from.split("-").reverse().join("/")} đến ngày ${o.period.to.split("-").reverse().join("/")}` : `Tại thời điểm ${stamp}`;
  p.font = { italic: true };
  p.alignment = { horizontal: "center" };
  ws.mergeCells(5, 1, 5, n);
  ws.getCell("A5").value = o.note ?? "";
  ws.getCell("A5").font = { italic: true, size: 9, color: { argb: "FF6B7280" } };
  ws.getCell("A5").alignment = { wrapText: true, vertical: "top" };
  ws.getRow(5).height = o.note && o.note.length > 120 ? 26 : 14;

  const head = ws.getRow(6);
  o.cols.forEach((c, i) => {
    const cell = head.getCell(i + 1);
    cell.value = c.h;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREEN } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = box;
    ws.getColumn(i + 1).width = c.w;
  });
  head.height = 30;

  const first = 7;
  o.rows.forEach((r, ri) => {
    const row = ws.getRow(first + ri);
    o.cols.forEach((c, i) => {
      const cell = row.getCell(i + 1);
      const v = r[c.key] ?? null;
      cell.value = v;
      cell.border = box;
      const f = numFmt(v, c.kind);
      if (f) cell.numFmt = f;
      cell.alignment = { horizontal: c.kind === "center" ? "center" : c.kind && c.kind !== "text" ? "right" : "left", vertical: "top", wrapText: c.kind === "text" || !c.kind };
      if (ri % 2 === 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7F9F8" } };
    });
  });
  const last = first + o.rows.length - 1;
  let row = last + 1;
  if (o.cols.some((c) => c.total) && o.rows.length) {
    const tr = ws.getRow(row);
    o.cols.forEach((c, i) => {
      const cell = tr.getCell(i + 1);
      cell.font = { bold: true };
      cell.border = box;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE4F1E8" } };
      if (c.total) {
        const L = ws.getColumn(i + 1).letter;
        const sum = o.rows.reduce((s, r) => s + (typeof r[c.key] === "number" ? (r[c.key] as number) : 0), 0);
        cell.value = { formula: `SUM(${L}${first}:${L}${last})`, result: sum };
        cell.numFmt = FMT.int;
        cell.alignment = { horizontal: "right" };
      }
    });
    tr.getCell(1).value = "TỔNG CỘNG";
    row++;
  }
  if (!o.rows.length) { ws.mergeCells(row, 1, row, n); ws.getCell(row, 1).value = "Không có dữ liệu trong kỳ."; ws.getCell(row, 1).font = { italic: true }; row++; }
  row++;
  if (o.signatures !== false) {
    const now = new Date(Date.now() + VN);
    ws.mergeCells(row, Math.max(1, n - 2), row, n);
    ws.getCell(row, Math.max(1, n - 2)).value = `Ngày ${now.getUTCDate()} tháng ${now.getUTCMonth() + 1} năm ${now.getUTCFullYear()}`;
    ws.getCell(row, Math.max(1, n - 2)).font = { italic: true };
    ws.getCell(row, Math.max(1, n - 2)).alignment = { horizontal: "center" };
    row++;
    const third = Math.max(1, Math.floor(n / 3));
    const spans: [number, number, string][] = [[1, third, "Người lập biểu"], [third + 1, Math.max(third + 1, 2 * third), "Quản lý"], [Math.max(third + 2, 2 * third + 1), n, "Chủ phòng khám"]];
    for (const [a, b, label] of spans) {
      if (b > a) { ws.mergeCells(row, a, row, b); ws.mergeCells(row + 1, a, row + 1, b); }
      ws.getCell(row, a).value = label; ws.getCell(row, a).font = { bold: true }; ws.getCell(row, a).alignment = { horizontal: "center" };
      ws.getCell(row + 1, a).value = "(Ký, ghi rõ họ tên)"; ws.getCell(row + 1, a).font = { italic: true, size: 9 }; ws.getCell(row + 1, a).alignment = { horizontal: "center" };
    }
  }
  ws.pageSetup = { orientation: o.landscape === false ? "portrait" : "landscape", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: "6:6", margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 } };
  ws.headerFooter.oddFooter = `&LLập bởi ${o.by}, ${stamp}&RTrang &P/&N`;
  return Buffer.from(await wb.xlsx.writeBuffer());
}
