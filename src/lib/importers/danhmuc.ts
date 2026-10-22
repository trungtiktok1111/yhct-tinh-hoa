import ExcelJS from "exceljs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { ITEM_MANAGER_ROLES } from "@/lib/permissions";
import { UNITS } from "@/lib/constants";
import { emptyAnalysis, MAX_ROWS, type Analysis, type ImportRow, type Importer } from "@/lib/importKit";
import { FIRST_ROW, GREEN_IN, fmt, guideSheet, hashOf, makeSheet, openSheet, protect, styleRow, text, toNumber, type ColSpec } from "@/lib/sheetKit";

// Danh mục mặt hàng và bảng giá: sửa giá bán, tồn tối thiểu, trạng thái bán của mặt hàng có sẵn, thêm mặt hàng mới.
// Tên, loại, đơn vị của mặt hàng đã có không sửa được (tránh đổi nghĩa lịch sử kho).
export const SHEET = "Danh mục";
export const MARKER = "YHCT-DANH-MUC v1";
const NEW_ROWS = 40;
const NEW_CODE = "(mới)";
const ON = "Đang bán", OFF = "Ngừng bán";

const COLS: ColSpec[] = [
  { header: "Mã hàng", width: 10 }, { header: "Tên mặt hàng", width: 30, input: true }, { header: "Loại", width: 13, input: true }, { header: "ĐVT", width: 9, input: true },
  { header: "Giá bán\n(đ / ĐVT)", width: 15, input: true }, { header: "Tồn tối thiểu\n(theo ĐVT)", width: 15, input: true }, { header: "Trạng thái", width: 13, input: true },
];

type ItemRow = { id: string; code: string | null; name: string; type: string; unit: string; minStock: number; active: boolean; prices: { price: number }[] };
const q2 = (n: number) => Math.round(n * 100) / 100;

async function build(): Promise<Buffer> {
  const items = (await prisma.item.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }], include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 1 } } })) as unknown as ItemRow[];
  const wb = new ExcelJS.Workbook();
  wb.creator = "YHCT Tinh Hoa";
  const ws = makeSheet(wb, {
    name: SHEET, marker: MARKER, title: "DANH MỤC MẶT HÀNG VÀ BẢNG GIÁ", scope: "Toàn hệ thống",
    note: "Mặt hàng có sẵn: chỉ sửa Giá bán, Tồn tối thiểu, Trạng thái (ô vàng). Mặt hàng mới: điền ở các dòng xanh nhạt phía dưới.",
    cols: COLS, groups: [{ from: 1, to: 4, label: "THÔNG TIN (có sẵn không sửa; dòng mới điền được)" }, { from: 5, to: 7, label: "ĐIỀN / SỬA Ở ĐÂY", input: true }],
  });
  const editable = COLS.map((c, i) => ({ ...c, input: i >= 4 }));
  items.forEach((it, idx) => {
    const r = FIRST_ROW + idx;
    const row = ws.getRow(r);
    [it.code ?? "", it.name, it.type === "HERB" ? "Vị thuốc" : "Thành phẩm", it.unit, it.prices[0]?.price ?? null, q2(it.minStock), it.active ? ON : OFF].forEach((v, i) => (row.getCell(i + 1).value = v));
    styleRow(ws, r, editable);
    row.getCell(5).numFmt = "#,##0";
    row.getCell(6).numFmt = '#,##0.##;-#,##0.##;0';
    row.getCell(5).alignment = row.getCell(6).alignment = { horizontal: "right" };
    row.getCell(5).dataValidation = { type: "whole", operator: "greaterThanOrEqual", formulae: [0], allowBlank: false, showErrorMessage: true, errorTitle: "Giá bán", error: "Nhập số đồng nguyên, không âm." };
    row.getCell(6).dataValidation = { type: "decimal", operator: "greaterThanOrEqual", formulae: [0], allowBlank: false, showErrorMessage: true, errorTitle: "Tồn tối thiểu", error: "Nhập số không âm." };
    row.getCell(7).dataValidation = { type: "list", allowBlank: false, formulae: [`"${ON},${OFF}"`], showErrorMessage: true, errorTitle: "Trạng thái", error: `Chọn ${ON} hoặc ${OFF}.` };
  });
  const base = FIRST_ROW + items.length;
  for (let k = 0; k < NEW_ROWS; k++) {
    const r = base + k;
    const row = ws.getRow(r);
    row.getCell(1).value = NEW_CODE;
    styleRow(ws, r, COLS.map((c, i) => ({ ...c, input: i > 0 })), { inputFill: GREEN_IN });
    row.getCell(3).dataValidation = { type: "list", allowBlank: true, formulae: ['"Vị thuốc,Thành phẩm"'], showErrorMessage: true, errorTitle: "Loại", error: "Chọn Vị thuốc hoặc Thành phẩm." };
    row.getCell(4).dataValidation = { type: "list", allowBlank: true, formulae: [`"g,${UNITS.join(",")}"`], showErrorMessage: true, errorTitle: "Đơn vị", error: "Vị thuốc dùng g; thành phẩm chọn trong danh sách." };
    row.getCell(5).numFmt = "#,##0";
    row.getCell(5).dataValidation = { type: "whole", operator: "greaterThanOrEqual", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Giá bán", error: "Nhập số đồng nguyên, không âm." };
    row.getCell(7).value = ON;
    row.getCell(7).dataValidation = { type: "list", allowBlank: true, formulae: [`"${ON},${OFF}"`], showErrorMessage: true, errorTitle: "Trạng thái", error: `Chọn ${ON} hoặc ${OFF}.` };
    if (k === 0) for (let c = 1; c <= COLS.length; c++) row.getCell(c).border = { top: { style: "medium", color: { argb: "FF1B4332" } } };
  }
  await protect(ws);
  guideSheet(wb, [
    "HƯỚNG DẪN DANH MỤC MẶT HÀNG VÀ BẢNG GIÁ",
    "",
    "1. Mặt hàng có sẵn: chỉ sửa 3 cột vàng là Giá bán, Tồn tối thiểu, Trạng thái. Tên, loại, đơn vị bị khóa.",
    "2. Mặt hàng mới: dùng các dòng nền xanh nhạt ở cuối (Mã hàng ghi (mới)). Điền Tên, Loại, ĐVT (vị thuốc dùng g), Giá bán. App tự cấp mã hàng.",
    "3. Dược liệu tính giá theo gam. Giá bán là số đồng nguyên, không âm.",
    "4. Chỉ dòng nào bạn đổi mới được lưu. Đổi giá bán được ghi vào lịch sử giá, giá cũ vẫn xem được.",
    "5. Ngừng bán mặt hàng còn tồn là cảnh báo cần xác nhận. Mặt hàng ngừng bán không hiện khi lập đơn nhưng lịch sử vẫn giữ.",
    "6. Tải file lên ở Biểu mẫu, Danh mục mặt hàng. App hiện bảng xem trước và chỉ lưu khi bạn xác nhận. Chỉ chủ và quản lý được dùng.",
    "7. Mỗi file chỉ nhập một lần.",
  ]);
  return Buffer.from(await wb.xlsx.writeBuffer());
}

type Op = { itemId: string; name: string; price?: number; oldPrice?: number | null; min?: number; active?: boolean };
type Newi = { id: string; name: string; type: "HERB" | "PRODUCT"; unit: string; price: number; min: number; active: boolean };
type Payload = { ops: Op[]; news: Newi[] };

async function analyze(buf: Buffer): Promise<Analysis> {
  const hash = hashOf(buf);
  const o = await openSheet(buf, { name: SHEET, marker: MARKER, scope: "Toàn hệ thống", cols: COLS, what: "Danh mục mặt hàng và bảng giá" });
  if (!o.ws) return emptyAnalysis(hash, o.error);
  const ws = o.ws;
  const items = (await prisma.item.findMany({ include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 1 } } })) as unknown as ItemRow[];
  const stockRows = (await prisma.stockLot.groupBy({ by: ["itemId"], where: { qtyRemaining: { gt: 0 } }, _sum: { qtyRemaining: true } })) as unknown as { itemId: string; _sum: { qtyRemaining: number | null } }[];
  const stock = new Map(stockRows.map((s) => [s.itemId, s._sum.qtyRemaining ?? 0]));
  const byCode = new Map(items.filter((i) => i.code).map((i) => [i.code as string, i]));
  const existing = new Set(items.map((i) => `${i.name.toLowerCase()}|${i.unit}`));
  const seenNew = new Set<string>();
  const rows: ImportRow[] = [];
  const p: Payload = { ops: [], news: [] };
  const price = (v: ExcelJS.CellValue, errors: string[], required: boolean) => {
    const n = toNumber(v);
    if (n === null) { if (required) errors.push("Thiếu giá bán."); return undefined; }
    if (n === "bad" || n < 0 || !Number.isInteger(n)) { errors.push("Giá bán phải là số đồng nguyên, không âm."); return undefined; }
    return n;
  };
  for (let r = FIRST_ROW; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const code = text(row.getCell(1).value);
    const isNew = code === NEW_CODE || code === "";
    if (isNew) {
      const name = text(row.getCell(2).value), typeT = text(row.getCell(3).value).toLowerCase(), u = text(row.getCell(4).value);
      if (!name && !typeT && !u && toNumber(row.getCell(5).value) === null) continue;
      if (rows.length >= MAX_ROWS) return emptyAnalysis(hash, `Tối đa ${MAX_ROWS} dòng mỗi lần.`);
      const errors: string[] = [], warnings: string[] = [];
      if (!name) errors.push("Mặt hàng mới thiếu tên.");
      else if (name.length > 120) errors.push("Tên quá dài (tối đa 120 ký tự).");
      const type = typeT === "vị thuốc" ? "HERB" : typeT === "thành phẩm" ? "PRODUCT" : undefined;
      if (!type) errors.push("Loại phải là Vị thuốc hoặc Thành phẩm.");
      let unit = "";
      if (type === "HERB") unit = "g";
      else if (type === "PRODUCT") { if (!UNITS.includes(u)) errors.push(`ĐVT của thành phẩm phải là: ${UNITS.join(", ")}.`); else unit = u; }
      const pr = price(row.getCell(5).value, errors, true);
      const mn = toNumber(row.getCell(6).value);
      if (mn === "bad" || (typeof mn === "number" && mn < 0)) errors.push("Tồn tối thiểu phải là số không âm.");
      const st = text(row.getCell(7).value) || ON;
      if (st !== ON && st !== OFF) errors.push(`Trạng thái phải là ${ON} hoặc ${OFF}.`);
      if (name && unit) {
        const key = `${name.toLowerCase()}|${unit}`;
        if (existing.has(key)) errors.push("Mặt hàng này đã có trong hệ thống (kể cả đã ngừng bán). Sửa ở dòng có mã hàng.");
        else if (seenNew.has(key)) errors.push("Mặt hàng mới bị lặp trong file.");
        seenNew.add(key);
      }
      if (!errors.length && type && typeof pr === "number") p.news.push({ id: randomUUID(), name, type, unit, price: pr, min: typeof mn === "number" ? mn : 0, active: st === ON });
      rows.push({ row: r, label: `(mới) ${name}`, detail: type && typeof pr === "number" ? `${type === "HERB" ? "Vị thuốc" : "Thành phẩm"} · ${fmt(pr)} đ/${unit || "?"}` : "", errors, warnings });
      continue;
    }
    // Mặt hàng có sẵn: chỉ ghi nhận phần đã đổi.
    const it = byCode.get(code);
    const errors: string[] = [], warnings: string[] = [];
    if (!it) { rows.push({ row: r, label: code, detail: "", errors: [`Mã hàng “${code}” không có trong hệ thống.`], warnings }); continue; }
    if (it.name !== text(row.getCell(2).value)) errors.push(`Không sửa tên mặt hàng có sẵn (file: ${text(row.getCell(2).value)}, hệ thống: ${it.name}).`);
    if ((it.type === "HERB" ? "vị thuốc" : "thành phẩm") !== text(row.getCell(3).value).toLowerCase()) errors.push("Không sửa loại mặt hàng có sẵn.");
    if (it.unit !== text(row.getCell(4).value)) errors.push("Không sửa đơn vị của mặt hàng có sẵn.");
    const pr = price(row.getCell(5).value, errors, true);
    const mn = toNumber(row.getCell(6).value);
    if (mn === null || mn === "bad" || mn < 0) errors.push("Tồn tối thiểu phải là số không âm.");
    const stT = text(row.getCell(7).value);
    if (stT !== ON && stT !== OFF) errors.push(`Trạng thái phải là ${ON} hoặc ${OFF}.`);
    const op: Op = { itemId: it.id, name: it.name };
    const parts: string[] = [];
    const cur = it.prices[0]?.price ?? null;
    if (typeof pr === "number" && pr !== cur) {
      op.price = pr; op.oldPrice = cur; parts.push(`Giá ${cur == null ? "?" : fmt(cur)} → ${fmt(pr)}`);
      if (cur && (pr > cur * 1.5 || pr < cur * 0.5)) warnings.push("Giá đổi hơn 50%, kiểm tra lại.");
      if (pr === 0) warnings.push("Giá bán bằng 0.");
    }
    if (typeof mn === "number" && Math.abs(mn - it.minStock) > 1e-9) { op.min = mn; parts.push(`Tối thiểu ${fmt(it.minStock)} → ${fmt(mn)}`); }
    const wantActive = stT === ON;
    if ((stT === ON || stT === OFF) && wantActive !== it.active) {
      op.active = wantActive; parts.push(wantActive ? "Mở bán lại" : "Ngừng bán");
      if (!wantActive && (stock.get(it.id) ?? 0) > 0) warnings.push(`Còn tồn ${fmt(stock.get(it.id) ?? 0)} ${it.unit} nhưng ngừng bán.`);
    }
    if (!parts.length && !errors.length) continue; // không đổi gì
    if (rows.length >= MAX_ROWS) return emptyAnalysis(hash, `Tối đa ${MAX_ROWS} dòng mỗi lần.`);
    if (!errors.length) p.ops.push(op);
    rows.push({ row: r, label: `${code} ${it.name}`, detail: parts.join(" · "), errors, warnings });
  }
  const out: Analysis = { hash, fileErrors: [], rows, summary: `${p.ops.length} mặt hàng đổi, ${p.news.length} mặt hàng mới`, payload: p };
  if (!rows.length) out.fileErrors.push("Không có thay đổi nào trong file.");
  return out;
}

export const danhMuc: Importer = {
  id: "danh-muc", name: "Danh mục mặt hàng và bảng giá", roles: ITEM_MANAGER_ROLES, needsBranch: false,
  columns: ["Mặt hàng", "Thay đổi"], allowedHint: "Chỉ các dòng có thay đổi được lưu. Đổi giá được ghi vào lịch sử giá.",
  build: () => build(), fileName: () => "danh-muc-mat-hang",
  analyze: (b) => analyze(b),
  async commit(a, c) {
    const p = a.payload as Payload;
    const nextCode: Record<string, number> = {};
    for (const t of ["HERB", "PRODUCT"] as const) {
      if (!p.news.some((n) => n.type === t)) continue;
      const prefix = t === "HERB" ? "VT" : "TP";
      const codes = (await prisma.item.findMany({ where: { code: { startsWith: prefix } }, select: { code: true } })) as unknown as { code: string | null }[];
      nextCode[t] = codes.reduce((m, x) => Math.max(m, parseInt((x.code ?? "").slice(prefix.length), 10) || 0), 0) + 1;
    }
    const created = [] as (Newi & { code: string; herbId: string | null })[];
    for (const n of p.news) {
      const herb = n.type === "HERB" ? ((await prisma.herb.findFirst({ where: { standardName: { equals: n.name, mode: "insensitive" } }, select: { id: true } })) as { id: string } | null) : null;
      created.push({ ...n, code: `${n.type === "HERB" ? "VT" : "TP"}${String(nextCode[n.type]++).padStart(3, "0")}`, herbId: herb?.id ?? null });
    }
    try {
      await prisma.$transaction([
        prisma.item.createMany({ data: created.map((n) => ({ id: n.id, code: n.code, name: n.name, type: n.type, unit: n.unit, minStock: n.min, active: n.active, herbId: n.herbId })) }),
        prisma.itemPrice.createMany({ data: [...created.map((n) => ({ itemId: n.id, price: n.price, staffName: c.staff.fullName })), ...p.ops.filter((o) => o.price !== undefined).map((o) => ({ itemId: o.itemId, price: o.price as number, staffName: c.staff.fullName }))] }),
        ...p.ops.filter((o) => o.min !== undefined || o.active !== undefined).map((o) => prisma.item.update({ where: { id: o.itemId }, data: { ...(o.min !== undefined ? { minStock: o.min } : {}), ...(o.active !== undefined ? { active: o.active } : {}) } })),
      ]);
    } catch {
      throw new Error("Không lưu được (có thể mã hàng vừa bị trùng). Chưa có gì được ghi, hãy thử lại.");
    }
    for (const n of created) await logAudit({ staffId: c.staff.id, staffName: c.staff.fullName, action: "CREATE", entity: "Item", entityId: n.id, detail: `${n.name} · ${n.price}đ/${n.unit} (nhập Excel)` });
    for (const o of p.ops) await logAudit({ staffId: c.staff.id, staffName: c.staff.fullName, action: "UPDATE", entity: "Item", entityId: o.itemId, detail: `${o.name}:${o.price !== undefined ? ` giá ${o.oldPrice ?? "?"}→${o.price}` : ""}${o.min !== undefined ? ` tối thiểu→${o.min}` : ""}${o.active !== undefined ? (o.active ? " mở bán" : " ngừng bán") : ""} (nhập Excel)` });
    return `Đã cập nhật ${p.ops.length} mặt hàng, thêm ${created.length} mặt hàng mới.`;
  },
};
