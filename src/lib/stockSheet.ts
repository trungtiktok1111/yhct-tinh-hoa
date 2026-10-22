import ExcelJS from "exceljs";
import { createHash } from "crypto";
import { readVoucher, stampVoucher } from "@/lib/sheetKit";
import { issueVoucher } from "@/lib/voucher";
import { prisma } from "@/lib/db";
import { UNITS } from "@/lib/constants";

// Phiếu nhập kho Excel: app xuất ra (có tồn kho và giá hiện tại), người dùng điền các cột vàng,
// tải lên để xem trước từng dòng rồi mới lưu. Mọi kiểm tra chạy ở máy chủ, file chỉ là dữ liệu đầu vào.

export const SHEET = "Nhập kho";
export const MARKER = "YHCT-NHAP-KHO v1";
export const HEADER_ROW = 5;
export const MAX_ROWS = 500;
export const MAX_BYTES = 2_000_000;
export const NEW_ROWS = 40;
export const NEW_CODE = "(mới)";

// Bố cục: thông tin hệ thống (A đến E), vùng điền (F đến K) nằm sát tên mặt hàng, tham khảo (L, M) ở cuối.
// Tổng bề rộng vừa một màn hình để không phải kéo ngang.
const COLS = [
  { key: "code", header: "Mã hàng", width: 10, ref: true },
  { key: "name", header: "Tên mặt hàng", width: 28, ref: true },
  { key: "type", header: "Loại", width: 12, ref: true },
  { key: "unit", header: "ĐV gốc", width: 8, ref: true },
  { key: "stock", header: "Tồn hiện tại", width: 11, ref: true },
  { key: "qty", header: "Số lượng nhập\n(theo ĐV gốc)", width: 14, ref: false },
  { key: "inUnit", header: "ĐV nhập", width: 9, ref: false },
  { key: "cost", header: "Giá nhập\n(đ / ĐV gốc)", width: 14, ref: false },
  { key: "expiry", header: "Hạn dùng\n(dd/mm/yyyy)", width: 13, ref: false },
  { key: "supplier", header: "Nhà cung cấp", width: 20, ref: false },
  { key: "note", header: "Số hóa đơn / ghi chú", width: 20, ref: false },
  { key: "lastCost", header: "Giá nhập gần nhất\n(đ / ĐV gốc)", width: 15, ref: true },
  { key: "price", header: "Giá bán\n(đ / ĐV gốc)", width: 13, ref: true },
] as const;

const nf = (v: number) => (Number.isInteger(v) ? "#,##0" : "#,##0.00");
const YELLOW = "FFFFF4C2";
const GREY = "FFF1F3F2";
const LAST_COL = 13;

export async function buildTemplate(branch: { id: string; name: string }, opts: { cost: boolean; by?: string | null; voucher?: string } = { cost: false }): Promise<Buffer> {
  const items = await prisma.item.findMany({
    where: { active: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: {
      prices: { orderBy: { effectiveFrom: "desc" }, take: 1 },
      lots: { where: { branchId: branch.id }, orderBy: { receivedAt: "desc" } },
    },
  });
  const wb = new ExcelJS.Workbook();
  wb.creator = "YHCT Tinh Hoa";
  const ws = wb.addWorksheet(SHEET, { views: [{ state: "frozen", xSplit: 2, ySplit: HEADER_ROW }] });

  stampVoucher(ws, opts.voucher ?? (await issueVoucher("PN", branch.id, opts.by ?? null)));
  ws.getCell("A1").value = `PHIẾU NHẬP KHO · ${MARKER}`;
  ws.getCell("A1").font = { bold: true, size: 14 };
  ws.getCell("A2").value = "Chi nhánh:";
  ws.getCell("B2").value = branch.name;
  ws.getCell("A2").font = ws.getCell("B2").font = { bold: true };
  ws.getCell("F2").value = `Xuất lúc ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`;
  ws.getCell("F2").font = { italic: true, color: { argb: "FF6B7280" } };
  ws.getCell("A3").value = "Chỉ điền các ô nền vàng (cột F đến K). Dòng để trống Số lượng sẽ bị bỏ qua.";
  ws.getCell("A3").font = { italic: true, color: { argb: "FF7A5B00" } };

  const head = ws.getRow(HEADER_ROW);
  COLS.forEach((c, i) => {
    const cell = head.getCell(i + 1);
    cell.value = c.header;
    cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.ref ? "FF4B5B54" : "FF1B4332" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    ws.getColumn(i + 1).width = c.width;
  });
  head.height = 44;

  // Nhãn nhóm cột, để biết chỗ nào điền.
  ws.mergeCells("A4:E4");
  ws.mergeCells("F4:K4");
  ws.mergeCells("L4:M4");
  const g1 = ws.getCell("A4"), g2 = ws.getCell("F4"), g3 = ws.getCell("L4");
  g1.value = "HỆ THỐNG (không sửa)";
  g2.value = "ĐIỀN VÀO ĐÂY";
  g3.value = "THAM KHẢO";
  for (const [c, bg, fg] of [[g1, "FFD9DEDB", "FF3F4A45"], [g2, "FFC9E4D2", "FF1B4332"], [g3, "FFD9DEDB", "FF3F4A45"]] as const) {
    c.font = { bold: true, size: 10, color: { argb: fg } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
    c.alignment = { horizontal: "center" };
  }

  const inputStyle = (r: ExcelJS.Row, bg: string) => {
    for (let c = 6; c <= 11; c++) {
      const cell = r.getCell(c);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      cell.protection = { locked: false };
    }
    r.getCell(6).numFmt = "#,##0.##";
    r.getCell(8).numFmt = "#,##0.##";
    r.getCell(9).numFmt = "dd/mm/yyyy";
    r.getCell(6).dataValidation = { type: "decimal", operator: "greaterThan", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Số lượng", error: "Nhập số lớn hơn 0." };
    r.getCell(8).dataValidation = { type: "decimal", operator: "greaterThanOrEqual", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Giá nhập", error: "Nhập số đồng, không âm." };
    r.getCell(9).dataValidation = { type: "date", operator: "greaterThan", formulae: [new Date(Date.UTC(2000, 0, 1))], allowBlank: true, showErrorMessage: true, errorTitle: "Hạn dùng", error: "Nhập ngày theo dd/mm/yyyy." };
  };

  items.forEach((it, idx) => {
    const r = ws.getRow(HEADER_ROW + 1 + idx);
    const stock = Math.round(it.lots.reduce((s, l) => s + l.qtyRemaining, 0) * 100) / 100;
    const herb = it.type === "HERB";
    const ref: [number, string | number | null][] = [
      [1, it.code ?? ""], [2, it.name], [3, herb ? "Vị thuốc" : "Thành phẩm"], [4, it.unit], [5, stock],
      [12, opts.cost ? it.lots[0]?.unitCost ?? null : null],
    ];
    for (const [c, v] of ref) {
      const cell = r.getCell(c);
      cell.value = v;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREY } };
      cell.protection = { locked: true };
    }
    const pc = r.getCell(13);
    pc.value = it.prices[0]?.price ?? null;
    pc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: YELLOW } };
    pc.protection = { locked: false };
    pc.dataValidation = { type: "whole", operator: "greaterThanOrEqual", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Giá bán", error: "Nhập số đồng nguyên, không âm." };
    r.getCell(5).numFmt = nf(stock);
    r.getCell(12).numFmt = r.getCell(13).numFmt = "#,##0";
    r.getCell(5).alignment = r.getCell(12).alignment = r.getCell(13).alignment = { horizontal: "right" };
    inputStyle(r, YELLOW);
    r.getCell(7).dataValidation = { type: "list", allowBlank: true, formulae: [`"${it.unit}"`], showErrorMessage: true, errorTitle: "Đơn vị", error: `Chỉ nhập theo ${it.unit}.` };
    r.getCell(7).value = it.unit;
    r.getCell(10).alignment = { wrapText: false };
  });

  // Dòng trống để thêm mặt hàng mới: điền Tên, Loại, ĐV gốc, Giá bán và các cột nhập. Mã hàng do app tự cấp.
  const base = HEADER_ROW + 1 + items.length;
  for (let k = 0; k < NEW_ROWS; k++) {
    const r = ws.getRow(base + k);
    for (let c = 1; c <= LAST_COL; c++) {
      const cell = r.getCell(c);
      const input = c === 2 || c === 3 || c === 4 || c === 13 || (c >= 6 && c <= 11);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: input ? "FFE4F1E8" : GREY } };
      cell.protection = { locked: !input };
    }
    r.getCell(1).value = NEW_CODE;
    r.getCell(3).dataValidation = { type: "list", allowBlank: true, formulae: ['"Vị thuốc,Thành phẩm"'], showErrorMessage: true, errorTitle: "Loại", error: "Chọn Vị thuốc hoặc Thành phẩm." };
    r.getCell(4).dataValidation = { type: "list", allowBlank: true, formulae: [`"g,${UNITS.join(",")}"`], showErrorMessage: true, errorTitle: "Đơn vị", error: "Chọn trong danh sách (vị thuốc dùng g)." };
    r.getCell(13).numFmt = "#,##0";
    r.getCell(13).dataValidation = { type: "whole", operator: "greaterThanOrEqual", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Giá bán", error: "Nhập số đồng nguyên, không âm." };
    inputStyle(r, "FFE4F1E8");
    r.getCell(7).dataValidation = { type: "list", allowBlank: true, formulae: [`"g,${UNITS.join(",")}"`], showErrorMessage: true, errorTitle: "Đơn vị", error: "Chọn trong danh sách." };
    if (k === 0) for (let c = 1; c <= LAST_COL; c++) r.getCell(c).border = { top: { style: "medium", color: { argb: "FF1B4332" } } };
  }

  ws.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: `${HEADER_ROW}:${HEADER_ROW}` };
  await ws.protect("", { selectLockedCells: true, selectUnlockedCells: true, autoFilter: true, formatColumns: true, formatRows: true });

  addReportSheet(wb, branch, items, opts.cost);

  const g = wb.addWorksheet("Hướng dẫn");
  g.getColumn(1).width = 110;
  [
    "HƯỚNG DẪN NHẬP KHO BẰNG EXCEL (file này cũng là báo cáo tồn kho: xem trang Tồn kho)",
    "",
    "1. Một file dùng cho cả hai việc: trang Tồn kho để xem báo cáo, trang Nhập kho để nhập hàng. Chỉ điền các ô nền vàng (cột F đến K). Các ô xám là thông tin của hệ thống, không sửa được.",
    "2. Dòng nào có Số lượng nhập thì được nhập; dòng để trống bị bỏ qua. Một mặt hàng nhập nhiều lô thì dùng một file khác hoặc lần sau.",
    "3. Dược liệu chỉ dùng MỘT đơn vị là gam (g) ở mọi cột: tồn, số lượng nhập, giá nhập, giá bán. Nhập 5 kg giá 120.000 đ/kg thì ghi 5.000 g, giá nhập 120 đ/g.",
    "4. Thành phẩm: ĐV nhập là đơn vị của mặt hàng (viên, hộp...).",
    "5. Hạn dùng: nên ghi theo dd/mm/yyyy. Dược liệu thiếu hạn dùng sẽ bị cảnh báo.",
    "6. Mặt hàng mới: dùng các dòng nền xanh nhạt ở cuối bảng (Mã hàng ghi (mới)). Điền Tên, Loại, ĐV gốc (g cho vị thuốc), Giá bán, rồi Số lượng, ĐV nhập, Giá nhập. App tự cấp mã hàng. Chỉ quản lý mới được tạo mặt hàng mới.",
    "7. Tải file lên ở Kho và giá, Nhập kho, Nhập từ Excel. App hiện bảng xem trước từng dòng (hợp lệ, cảnh báo, lỗi) và chỉ lưu khi bạn xác nhận.",
    "8. Có lỗi ở bất kỳ dòng nào thì không dòng nào được lưu. Sửa file rồi tải lại.",
    "9. File chỉ dùng cho đúng chi nhánh ghi ở ô B2. Không đổi tên mặt hàng hay mã hàng.",
    "10. Cùng một file đã nhập rồi sẽ bị chặn, tránh nhập trùng.",
  ].forEach((t, i) => {
    const c = g.getCell(i + 1, 1);
    c.value = t;
    c.alignment = { wrapText: true, vertical: "top" };
    if (i === 0) c.font = { bold: true, size: 13 };
  });
  return Buffer.from(await wb.xlsx.writeBuffer());
}

export type SheetRow = {
  row: number;
  code: string;
  name: string;
  itemId: string | null;
  qtyBase: number; // theo đơn vị gốc (g với dược liệu)
  unitCostBase: number; // đồng / đơn vị gốc
  baseUnit: string;
  inText: string; // "5 kg × 120.000 đ"
  total: number;
  expiry: string | null; // yyyy-mm-dd
  supplier: string | null;
  note: string | null;
  newItem: { name: string; type: "HERB" | "PRODUCT"; unit: string; price: number } | null;
  priceChange: { from: number | null; to: number } | null; // sửa giá bán mặt hàng có sẵn (chỉ quản lý)
  errors: string[];
  warnings: string[];
};

export type SheetResult = {
  hash: string;
  branchName: string | null;
  fileErrors: string[];
  rows: SheetRow[];
  total: number;
};

function text(v: ExcelJS.CellValue): string {
  if (v == null) return "";
  if (typeof v === "object") {
    if ("richText" in v) return v.richText.map((t) => t.text).join("").trim();
    if ("text" in v && typeof v.text === "string") return v.text.trim();
    if ("result" in v && v.result != null) return String(v.result).trim();
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    return "";
  }
  return String(v).trim();
}

function toNumber(v: ExcelJS.CellValue): number | null | "bad" {
  if (v == null || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : "bad";
  if (typeof v === "object" && "result" in v && typeof v.result === "number") return v.result;
  let t = text(v).replace(/\s/g, "");
  if (!t) return null;
  if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, ""); // 1.200 = một nghìn hai trăm
  t = t.replace(",", ".");
  const n = Number(t);
  return Number.isFinite(n) ? n : "bad";
}

function toDate(v: ExcelJS.CellValue): { iso: string | null; bad: boolean } {
  if (v == null || v === "") return { iso: null, bad: false };
  if (v instanceof Date) {
    if (isNaN(v.getTime())) return { iso: null, bad: true };
    return { iso: v.toISOString().slice(0, 10), bad: false };
  }
  const t = text(v);
  const m = t.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/) ?? null;
  if (m) {
    const d = new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));
    if (d.getUTCDate() === +m[1] && d.getUTCMonth() === +m[2] - 1) return { iso: d.toISOString().slice(0, 10), bad: false };
  }
  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return { iso: t, bad: false };
  return { iso: null, bad: true };
}

const fmt = (n: number) => n.toLocaleString("vi-VN", { maximumFractionDigits: 2 });

export async function analyzeSheet(buf: Buffer, branch: { id: string; name: string }, opts: { canCreate: boolean } = { canCreate: false }): Promise<SheetResult> {
  let hash = createHash("sha256").update(buf).digest("hex").slice(0, 16);
  const out: SheetResult = { hash, branchName: null, fileErrors: [], rows: [], total: 0 };
  const wb = new ExcelJS.Workbook();
  try {
    await wb.xlsx.load(buf as unknown as ArrayBuffer);
  } catch {
    out.fileErrors.push("Không đọc được file. Hãy dùng đúng file .xlsx do app xuất ra.");
    return out;
  }
  const ws = wb.getWorksheet(SHEET);
  if (!ws || !text(ws.getCell("A1").value).includes(MARKER)) {
    out.fileErrors.push("File này không phải phiếu nhập kho (thiếu trang “Nhập kho”). File xuất cũ chỉ là báo cáo. Hãy bấm “Tải phiếu nhập kho (Excel)” hoặc “Xuất Excel” ở trang Tồn kho để lấy file mới.");
    return out;
  }
  const voucher = readVoucher(ws);
  if (!voucher) {
    out.fileErrors.push("File không có Số phiếu (ô F1). Đây là file cũ hoặc đã bị sửa. Hãy tải phiếu nhập kho mới từ trang Biểu mẫu để có số phiếu riêng.");
    return out;
  }
  hash = voucher;
  out.hash = voucher;
  out.branchName = text(ws.getCell("B2").value);
  if (out.branchName !== branch.name) {
    out.fileErrors.push(`File này của chi nhánh “${out.branchName}”, nhưng bạn đang chọn “${branch.name}”.`);
    return out;
  }
  const hdr = ws.getRow(HEADER_ROW);
  COLS.forEach((c, i) => {
    if (text(hdr.getCell(i + 1).value) !== c.header) out.fileErrors.push(`Cột ${i + 1} phải là “${c.header}”. File đã bị đổi cấu trúc, hãy xuất lại.`);
  });
  if (out.fileErrors.length) return out;

  const [items, suppliers] = await Promise.all([
    prisma.item.findMany({
      include: {
        prices: { orderBy: { effectiveFrom: "desc" }, take: 1 },
        lots: { where: { branchId: branch.id }, orderBy: { receivedAt: "desc" }, take: 1, select: { unitCost: true } },
      },
    }),
    prisma.supplier.findMany({ where: { active: true }, select: { name: true } }),
  ]);
  const byCode = new Map(items.filter((i) => i.code && i.active).map((i) => [i.code as string, i]));
  const existing = new Set(items.map((i) => `${i.name.toLowerCase()}|${i.unit}`));
  const seenNew = new Set<string>();
  const supSet = new Set(suppliers.map((s) => s.name.toLowerCase()));
  const today = Date.now();

  for (let r = HEADER_ROW + 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const code = text(row.getCell(1).value);
    const isNew = code === NEW_CODE || code === "";
    const inputCols = isNew ? [2, 3, 4, 13, 6, 7, 8, 9, 10, 11] : [6, 7, 8, 9, 10, 11];
    if (!inputCols.some((c) => text(row.getCell(c).value) !== "")) continue;
    if (out.rows.length >= MAX_ROWS) { out.fileErrors.push(`Tối đa ${MAX_ROWS} dòng mỗi lần nhập.`); break; }

    const fileName = text(row.getCell(2).value);
    const errors: string[] = [];
    const warnings: string[] = [];
    let it = isNew ? undefined : byCode.get(code);
    let newItem: SheetRow["newItem"] = null;
    let priceChange: SheetRow["priceChange"] = null;
    let itType: "HERB" | "PRODUCT" | undefined = it?.type as "HERB" | "PRODUCT" | undefined;
    let itUnit = it?.unit ?? "";
    let sell: number | undefined = it?.prices[0]?.price;

    if (isNew) {
      // Mặt hàng mới: tạo kèm lô nhập đầu tiên.
      const typeText = text(row.getCell(3).value).toLowerCase();
      itType = typeText === "vị thuốc" ? "HERB" : typeText === "thành phẩm" ? "PRODUCT" : undefined;
      if (!opts.canCreate) errors.push("Chỉ quản lý được tạo mặt hàng mới.");
      if (!fileName) errors.push("Mặt hàng mới thiếu tên.");
      else if (fileName.length > 120) errors.push("Tên mặt hàng quá dài (tối đa 120 ký tự).");
      if (!itType) errors.push("Loại phải là Vị thuốc hoặc Thành phẩm.");
      const u = text(row.getCell(4).value);
      if (itType === "HERB") itUnit = "g";
      else if (itType === "PRODUCT") {
        if (!UNITS.includes(u)) errors.push(`ĐV gốc của thành phẩm phải là: ${UNITS.join(", ")}.`);
        else itUnit = u;
      }
      const sp = toNumber(row.getCell(13).value);
      if (sp === null) errors.push("Mặt hàng mới thiếu giá bán.");
      else if (sp === "bad" || sp < 0 || !Number.isInteger(sp)) errors.push("Giá bán phải là số đồng nguyên, không âm.");
      else sell = sp;
      if (fileName && itType && itUnit) {
        const key = `${fileName.toLowerCase()}|${itUnit}`;
        if (existing.has(key)) errors.push("Mặt hàng này đã có trong hệ thống, hãy dùng dòng có sẵn (có mã hàng).");
        else if (seenNew.has(key)) errors.push("Mặt hàng mới bị lặp trong file.");
        seenNew.add(key);
        if (!errors.length && typeof sell === "number") newItem = { name: fileName, type: itType, unit: itUnit, price: sell };
      }
    } else if (!it) errors.push(`Mã hàng “${code}” không có trong hệ thống.`);
    else if (it.name !== fileName) errors.push(`Tên không khớp mã (file: ${fileName}, hệ thống: ${it.name}). Xuất lại file.`);
    else {
      const sp = toNumber(row.getCell(13).value);
      if (sp === "bad" || (typeof sp === "number" && (sp < 0 || !Number.isInteger(sp)))) errors.push("Giá bán phải là số đồng nguyên, không âm.");
      else if (typeof sp === "number" && sp !== it.prices[0]?.price) {
        if (!opts.canCreate) errors.push("Chỉ quản lý được đổi giá bán.");
        else {
          priceChange = { from: it.prices[0]?.price ?? null, to: sp };
          sell = sp;
          warnings.push(`Đổi giá bán ${fmt(priceChange.from ?? 0)} → ${fmt(sp)} đ/${itUnit}.`);
        }
      }
    }

    const q = toNumber(row.getCell(6).value);
    if (q === null) errors.push("Thiếu số lượng nhập.");
    else if (q === "bad" || q <= 0) errors.push("Số lượng phải là số lớn hơn 0.");
    const c = toNumber(row.getCell(8).value);
    if (c === null) errors.push("Thiếu giá nhập.");
    else if (c === "bad" || c < 0) errors.push("Giá nhập phải là số đồng không âm.");

    let inUnit = text(row.getCell(7).value);
    let factor = 1;
    const herb = itType === "HERB";
    if (itType && itUnit) {
      if (herb) {
        if (!inUnit) inUnit = "g";
        if (inUnit.toLowerCase() !== "g") errors.push("Dược liệu chỉ nhập theo gam (g). Số lượng và giá nhập đều tính theo g.");
        else inUnit = "g";
      } else if (inUnit && inUnit !== itUnit) errors.push(`ĐV nhập phải là ${itUnit}.`);
      else inUnit = itUnit;
    }
    const d = toDate(row.getCell(9).value);
    if (d.bad) errors.push("Hạn dùng không hợp lệ (dùng dd/mm/yyyy).");
    if (d.iso) {
      const t = new Date(d.iso + "T00:00:00Z").getTime();
      if (t < today - 86400000) errors.push("Hạn dùng đã qua.");
      else if (t < today + 30 * 86400000) warnings.push("Hạn dùng dưới 30 ngày.");
    } else if (herb && !d.bad) warnings.push("Dược liệu chưa có hạn dùng.");

    const supplier = text(row.getCell(10).value) || null;
    if (supplier && !supSet.has(supplier.toLowerCase())) warnings.push(`Nhà cung cấp “${supplier}” chưa có trong danh sách.`);

    let qtyBase = 0, unitCostBase = 0;
    if (typeof q === "number" && typeof c === "number" && itType && itUnit && !errors.length) {
      qtyBase = q * factor;
      const rawCost = c / factor;
      unitCostBase = Math.round(rawCost * 10000) / 10000; // giữ đơn giá lẻ (đ / ĐV gốc)
      if (unitCostBase === 0) warnings.push("Giá nhập bằng 0.");
      const last = it?.lots[0]?.unitCost;
      if (last && last > 0 && (unitCostBase > last * 3 || unitCostBase * 3 < last)) warnings.push(`Giá nhập lệch nhiều so với lần trước (${fmt(last)} đ).`);
      if (sell && unitCostBase > sell) warnings.push(`Giá nhập cao hơn giá bán (${fmt(sell)} đ), bán sẽ lỗ.`);
      if (herb && (qtyBase < 10 || qtyBase > 200000)) warnings.push(`Số lượng ${fmt(qtyBase)} g bất thường.`);
    }
    const total = qtyBase * unitCostBase;
    out.rows.push({
      row: r, code: isNew ? NEW_CODE : code, name: it?.name ?? fileName, itemId: it?.id ?? null, qtyBase, unitCostBase, baseUnit: itUnit,
      inText: typeof q === "number" && typeof c === "number" ? `${fmt(q)} ${inUnit} × ${fmt(c)} đ` : "",
      total, expiry: d.iso, supplier, note: text(row.getCell(11).value) || null, newItem, priceChange, errors, warnings,
    });
    out.total += total;
  }
  if (!out.rows.length && !out.fileErrors.length) out.fileErrors.push("Không có dòng nào được điền Số lượng nhập.");
  return out;
}

type ReportItem = {
  code: string | null; name: string; type: string; unit: string; minStock: number;
  prices: { price: number }[]; lots: { qtyRemaining: number; unitCost: number; expiryDate: Date | null }[];
};

// Trang "Tồn kho": báo cáo tồn, hạn dùng, giá trị. Cùng một file với phiếu nhập nên xuất một lần dùng cho cả hai việc.
function addReportSheet(wb: ExcelJS.Workbook, branch: { name: string }, items: ReportItem[], cost: boolean) {
  const ws = wb.addWorksheet("Tồn kho", { views: [{ state: "frozen", ySplit: 4 }] });
  const cols: [string, number, string?][] = [
    ["STT", 9], ["Mã hàng", 14], ["Tên mặt hàng", 32], ["Loại", 15], ["Đơn vị", 11], ["Tồn kho", 14],
    ["Tối thiểu", 14], ["Hạn gần nhất", 18, "dd/mm/yyyy"],
    ...(cost ? ([["Giá nhập TB", 17], ["Giá trị tồn", 16, "#,##0"]] as [string, number, string][]) : []),
    ["Giá bán", 13, "#,##0"], ["Trạng thái", 18],
  ];
  ws.getCell("A1").value = `TỒN KHO · ${branch.name}`;
  ws.getCell("A1").font = { bold: true, size: 14 };
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
    const lots = it.lots.filter((l) => l.qtyRemaining > 0);
    const total = lots.reduce((a, l) => a + l.qtyRemaining, 0);
    const value = lots.reduce((a, l) => a + l.qtyRemaining * l.unitCost, 0);
    totalValue += value;
    const exps = lots.map((l) => l.expiryDate).filter(Boolean) as Date[];
    const nearest = exps.length ? new Date(Math.min(...exps.map((d) => d.getTime()))) : null;
    const status = statusOf(it, now);
    const vals: (string | number | Date | null)[] = [
      idx + 1, it.code ?? "", it.name, it.type === "HERB" ? "Vị thuốc" : "Thành phẩm", it.unit, Math.round(total * 100) / 100, it.minStock, nearest,
      ...(cost ? [total ? Math.round((value / total) * 100) / 100 : 0, Math.round(value)] : []), it.prices[0]?.price ?? null, status,
    ];
    const row = ws.getRow(5 + idx);
    vals.forEach((v, i) => {
      const c = row.getCell(i + 1);
      c.value = v;
      if (cols[i][2]) c.numFmt = cols[i][2] as string;
      else if (typeof v === "number" && i >= 5) c.numFmt = nf(v);
      if (i >= 5 && i !== 7) c.alignment = { horizontal: "right" };
      if (i === 0) c.alignment = { horizontal: "center" };
      c.border = { bottom: { style: "thin", color: { argb: "FFE5E7EB" } } };
      if (idx % 2 === 1) c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7F9F8" } };
    });
    if (status !== "Còn hàng") {
      const warn = status === "Gần hết hạn";
      const st = row.getCell(cols.length);
      st.font = { bold: true, color: { argb: warn ? "FF92400E" : "FF991B1B" } };
      st.fill = { type: "pattern", pattern: "solid", fgColor: { argb: warn ? "FFFEF3C7" : "FFFEE2E2" } };
      st.alignment = { horizontal: "center" };
    } else row.getCell(cols.length).alignment = { horizontal: "center" };
    if (status === "Hết hàng" || status === "Dưới tối thiểu") row.getCell(6).font = { bold: true, color: { argb: "FF991B1B" } };
  });
  if (cost) {
    const r = ws.getRow(5 + items.length + 1);
    r.getCell(3).value = "Tổng giá trị tồn (theo giá nhập)";
    r.getCell(3).font = { bold: true };
    r.getCell(10).value = Math.round(totalValue);
    r.getCell(10).numFmt = "#,##0";
    r.getCell(10).font = { bold: true };
  }
  const cnt = (f: (st: string) => boolean) => items.filter((it) => f(statusOf(it, now))).length;
  ws.getCell("A2").value = `${items.length} mặt hàng · ${cnt((x) => x === "Dưới tối thiểu" || x === "Hết hàng")} dưới mức tối thiểu · ${cnt((x) => x === "Gần hết hạn" || x === "Có lô hết hạn")} gần hoặc đã hết hạn${cost ? ` · tổng giá trị tồn ${Math.round(totalValue).toLocaleString("vi-VN")} đ` : ""}  (xuất lúc ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })})`;
  ws.getCell("A2").font = { bold: true, color: { argb: "FF1B4332" } };
  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4 + Math.max(items.length, 1), column: cols.length } };
  ws.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: "4:4" };
  ws.headerFooter = { oddFooter: "&L&8YHCT Tinh Hoa&R&8Trang &P/&N" };
}

function statusOf(it: ReportItem, now: number): string {
  const lots = it.lots.filter((l) => l.qtyRemaining > 0);
  const total = lots.reduce((a, l) => a + l.qtyRemaining, 0);
  const exps = lots.map((l) => l.expiryDate).filter(Boolean) as Date[];
  const nearest = exps.length ? Math.min(...exps.map((d) => d.getTime())) : null;
  if (total <= 0) return "Hết hàng";
  if (it.minStock > 0 && total < it.minStock) return "Dưới tối thiểu";
  if (nearest !== null && nearest < now) return "Có lô hết hạn";
  if (nearest !== null && nearest < now + 90 * 86400000) return "Gần hết hạn";
  return "Còn hàng";
}
