import ExcelJS from "exceljs";
import { createHash } from "crypto";
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

const COLS = [
  { key: "code", header: "Mã hàng", width: 11, ref: true },
  { key: "name", header: "Tên mặt hàng", width: 30, ref: true },
  { key: "type", header: "Loại", width: 12, ref: true },
  { key: "unit", header: "ĐV gốc", width: 9, ref: true },
  { key: "stock", header: "Tồn hiện tại", width: 13, ref: true },
  { key: "lastCost", header: "Giá nhập gần nhất (đ/ĐV gốc)", width: 17, ref: true },
  { key: "price", header: "Giá bán (đ/ĐV gốc)", width: 15, ref: true },
  { key: "qty", header: "Số lượng nhập", width: 14, ref: false },
  { key: "inUnit", header: "ĐV nhập", width: 10, ref: false },
  { key: "cost", header: "Giá nhập (đ / ĐV nhập)", width: 17, ref: false },
  { key: "expiry", header: "Hạn dùng (dd/mm/yyyy)", width: 16, ref: false },
  { key: "supplier", header: "Nhà cung cấp", width: 22, ref: false },
  { key: "note", header: "Số hóa đơn / ghi chú", width: 24, ref: false },
] as const;

const YELLOW = "FFFFF4C2";
const GREY = "FFF1F3F2";

export async function buildTemplate(branch: { id: string; name: string }): Promise<Buffer> {
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

  ws.getCell("A1").value = `PHIẾU NHẬP KHO · ${MARKER}`;
  ws.getCell("A1").font = { bold: true, size: 14 };
  ws.getCell("A2").value = "Chi nhánh:";
  ws.getCell("B2").value = branch.name;
  ws.getCell("A2").font = ws.getCell("B2").font = { bold: true };
  ws.getCell("D2").value = `Xuất lúc ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`;
  ws.getCell("A3").value = "Chỉ điền các cột nền vàng (H đến M) ở dòng cần nhập. Dòng để trống Số lượng sẽ bị bỏ qua. Xem trang Hướng dẫn.";
  ws.getCell("A3").font = { italic: true, color: { argb: "FF7A5B00" } };

  const head = ws.getRow(HEADER_ROW);
  COLS.forEach((c, i) => {
    const cell = head.getCell(i + 1);
    cell.value = c.header;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.ref ? "FF4B5B54" : "FF1B4332" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    ws.getColumn(i + 1).width = c.width;
  });
  head.height = 34;

  items.forEach((it, idx) => {
    const r = ws.getRow(HEADER_ROW + 1 + idx);
    const stock = it.lots.reduce((s, l) => s + l.qtyRemaining, 0);
    const herb = it.type === "HERB";
    const vals: (string | number | null)[] = [
      it.code ?? "", it.name, herb ? "Vị thuốc" : "Thành phẩm", it.unit, Math.round(stock * 100) / 100,
      it.lots[0]?.unitCost ?? null, it.prices[0]?.price ?? null,
    ];
    vals.forEach((v, i) => {
      const cell = r.getCell(i + 1);
      cell.value = v;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREY } };
      cell.protection = { locked: true };
    });
    r.getCell(5).numFmt = "#,##0.##";
    r.getCell(6).numFmt = r.getCell(7).numFmt = "#,##0";
    for (let c = 8; c <= 13; c++) {
      const cell = r.getCell(c);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: YELLOW } };
      cell.protection = { locked: false };
    }
    r.getCell(8).numFmt = "#,##0.##";
    r.getCell(10).numFmt = "#,##0";
    r.getCell(11).numFmt = "dd/mm/yyyy";
    r.getCell(8).dataValidation = { type: "decimal", operator: "greaterThan", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Số lượng", error: "Nhập số lớn hơn 0." };
    r.getCell(9).dataValidation = { type: "list", allowBlank: true, formulae: [herb ? '"g,kg"' : `"${it.unit}"`], showErrorMessage: true, errorTitle: "Đơn vị", error: herb ? "Chọn g hoặc kg." : `Chỉ nhập theo ${it.unit}.` };
    r.getCell(10).dataValidation = { type: "decimal", operator: "greaterThanOrEqual", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Giá nhập", error: "Nhập số đồng, không âm." };
    r.getCell(11).dataValidation = { type: "date", operator: "greaterThan", formulae: [new Date(Date.UTC(2000, 0, 1))], allowBlank: true, showErrorMessage: true, errorTitle: "Hạn dùng", error: "Nhập ngày theo dd/mm/yyyy." };
  });

  // Dòng trống để thêm mặt hàng mới: điền Tên, Loại, ĐV gốc, Giá bán và các cột nhập. Mã hàng do app tự cấp.
  const base = HEADER_ROW + 1 + items.length;
  for (let k = 0; k < NEW_ROWS; k++) {
    const r = ws.getRow(base + k);
    for (let c = 1; c <= 13; c++) {
      const cell = r.getCell(c);
      const input = c >= 2 && c <= 4 || c >= 7;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: input ? "FFE4F1E8" : GREY } };
      cell.protection = { locked: !input };
    }
    r.getCell(1).value = NEW_CODE;
    r.getCell(3).dataValidation = { type: "list", allowBlank: true, formulae: ['"Vị thuốc,Thành phẩm"'], showErrorMessage: true, errorTitle: "Loại", error: "Chọn Vị thuốc hoặc Thành phẩm." };
    r.getCell(4).dataValidation = { type: "list", allowBlank: true, formulae: [`"g,${UNITS.join(",")}"`], showErrorMessage: true, errorTitle: "Đơn vị", error: "Chọn trong danh sách (vị thuốc dùng g)." };
    r.getCell(7).numFmt = "#,##0";
    r.getCell(7).dataValidation = { type: "whole", operator: "greaterThanOrEqual", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Giá bán", error: "Nhập số đồng nguyên, không âm." };
    r.getCell(8).numFmt = "#,##0.##";
    r.getCell(10).numFmt = "#,##0";
    r.getCell(11).numFmt = "dd/mm/yyyy";
    r.getCell(9).dataValidation = { type: "list", allowBlank: true, formulae: [`"g,kg,${UNITS.join(",")}"`], showErrorMessage: true, errorTitle: "Đơn vị", error: "Chọn trong danh sách." };
  }

  ws.autoFilter = { from: { row: HEADER_ROW, column: 1 }, to: { row: HEADER_ROW + Math.max(items.length, 1) + NEW_ROWS, column: COLS.length } };
  await ws.protect("", { selectLockedCells: true, selectUnlockedCells: true, autoFilter: true, formatColumns: true, formatRows: true });

  const g = wb.addWorksheet("Hướng dẫn");
  g.getColumn(1).width = 110;
  [
    "HƯỚNG DẪN NHẬP KHO BẰNG EXCEL",
    "",
    "1. Chỉ điền các cột nền vàng (H đến M). Các cột xám là thông tin của hệ thống, không sửa được.",
    "2. Dòng nào có Số lượng nhập thì được nhập; dòng để trống bị bỏ qua. Một mặt hàng nhập nhiều lô thì dùng một file khác hoặc lần sau.",
    "3. Dược liệu: chọn ĐV nhập là g hoặc kg. Giá nhập tính theo ĐV nhập đã chọn (5 kg giá 120.000 đ/kg thì ghi 5, kg, 120000). Hệ thống tự đổi sang gam.",
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
  const hash = createHash("sha256").update(buf).digest("hex").slice(0, 16);
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
    out.fileErrors.push("Đây không phải phiếu nhập kho do app xuất ra. Hãy tải file mẫu mới ở nút “Tải phiếu nhập kho (Excel)”.");
    return out;
  }
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
    const inputCols = isNew ? [2, 3, 4, 7, 8, 9, 10, 11, 12, 13] : [8, 9, 10, 11, 12, 13];
    if (!inputCols.some((c) => text(row.getCell(c).value) !== "")) continue;
    if (out.rows.length >= MAX_ROWS) { out.fileErrors.push(`Tối đa ${MAX_ROWS} dòng mỗi lần nhập.`); break; }

    const fileName = text(row.getCell(2).value);
    const errors: string[] = [];
    const warnings: string[] = [];
    let it = isNew ? undefined : byCode.get(code);
    let newItem: SheetRow["newItem"] = null;
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
      const sp = toNumber(row.getCell(7).value);
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

    const q = toNumber(row.getCell(8).value);
    if (q === null) errors.push("Thiếu số lượng nhập.");
    else if (q === "bad" || q <= 0) errors.push("Số lượng phải là số lớn hơn 0.");
    const c = toNumber(row.getCell(10).value);
    if (c === null) errors.push("Thiếu giá nhập.");
    else if (c === "bad" || c < 0) errors.push("Giá nhập phải là số đồng không âm.");

    let inUnit = text(row.getCell(9).value);
    let factor = 1;
    const herb = itType === "HERB";
    if (itType && itUnit) {
      if (herb) {
        if (!inUnit) inUnit = "g";
        if (inUnit.toLowerCase() === "kg") factor = 1000;
        else if (inUnit.toLowerCase() !== "g") errors.push("ĐV nhập của dược liệu chỉ là g hoặc kg.");
        else inUnit = "g";
      } else if (inUnit && inUnit !== itUnit) errors.push(`ĐV nhập phải là ${itUnit}.`);
      else inUnit = itUnit;
    }
    const d = toDate(row.getCell(11).value);
    if (d.bad) errors.push("Hạn dùng không hợp lệ (dùng dd/mm/yyyy).");
    if (d.iso) {
      const t = new Date(d.iso + "T00:00:00Z").getTime();
      if (t < today - 86400000) errors.push("Hạn dùng đã qua.");
      else if (t < today + 30 * 86400000) warnings.push("Hạn dùng dưới 30 ngày.");
    } else if (herb && !d.bad) warnings.push("Dược liệu chưa có hạn dùng.");

    const supplier = text(row.getCell(12).value) || null;
    if (supplier && !supSet.has(supplier.toLowerCase())) warnings.push(`Nhà cung cấp “${supplier}” chưa có trong danh sách.`);

    let qtyBase = 0, unitCostBase = 0;
    if (typeof q === "number" && typeof c === "number" && itType && itUnit && !errors.length) {
      qtyBase = q * factor;
      const rawCost = c / factor;
      unitCostBase = Math.round(rawCost);
      if (Math.abs(rawCost - unitCostBase) > 1e-9) warnings.push(`Giá/${itUnit} lẻ (${fmt(rawCost)} đ) được làm tròn thành ${fmt(unitCostBase)} đ.`);
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
      total, expiry: d.iso, supplier, note: text(row.getCell(13).value) || null, newItem, errors, warnings,
    });
    out.total += total;
  }
  if (!out.rows.length && !out.fileErrors.length) out.fileErrors.push("Không có dòng nào được điền Số lượng nhập.");
  return out;
}
