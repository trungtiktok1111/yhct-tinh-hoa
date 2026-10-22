import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { STOCK_WRITE_ROLES } from "@/lib/permissions";
import { emptyAnalysis, MAX_ROWS, type Analysis, type ImportRow, type Importer } from "@/lib/importKit";
import { FIRST_ROW, YELLOW, fmt, guideSheet, hashOf, makeSheet, openSheet, protect, styleRow, text, toNumber, type ColSpec } from "@/lib/sheetKit";

// Phiếu kiểm kê kho: file ghi tồn trên sổ lúc xuất; người kiểm điền số đếm thực tế.
// Khi nhập, app lập điều chỉnh đúng phần chênh lệch (thừa thì thêm lô, thiếu thì trừ lô hết hạn sớm trước).
// Tồn trên sổ đổi từ lúc xuất file (có phát thuốc, nhập thêm) thì chặn, vì chênh lệch tính trên số cũ sẽ sai.
export const SHEET = "Kiểm kê";
export const MARKER = "YHCT-KIEM-KE v1";
const REASONS = ["Kiểm kê định kỳ", "Hao hụt", "Hư hỏng, ẩm mốc", "Nhầm lẫn khi nhập, xuất", "Khác"];

const COLS: ColSpec[] = [
  { header: "Mã hàng", width: 10 }, { header: "Tên mặt hàng", width: 30 }, { header: "Loại", width: 12 }, { header: "ĐVT", width: 8 },
  { header: "Tồn trên sổ", width: 13 },
  { header: "Số đếm thực tế", width: 15, input: true }, { header: "Chênh lệch", width: 12 }, { header: "Lý do (bắt buộc khi lệch)", width: 28, input: true },
];

type ItemRow = { id: string; code: string | null; name: string; type: string; unit: string; lots: { qtyRemaining: number; unitCost: number }[] };
const stockOf = (lots: { qtyRemaining: number }[]) => Math.round(lots.reduce((s, l) => s + l.qtyRemaining, 0) * 100) / 100;

async function build(branch: { id: string; name: string }): Promise<Buffer> {
  const items = (await prisma.item.findMany({ where: { active: true }, orderBy: [{ type: "asc" }, { name: "asc" }], include: { lots: { where: { branchId: branch.id, qtyRemaining: { gt: 0 } }, select: { qtyRemaining: true, unitCost: true } } } })) as unknown as ItemRow[];
  const wb = new ExcelJS.Workbook();
  wb.creator = "YHCT Tinh Hoa";
  const ws = makeSheet(wb, {
    prefix: "KK",
    name: SHEET, marker: MARKER, title: "PHIẾU KIỂM KÊ KHO", scope: branch.name,
    note: "Đếm thực tế rồi điền vào cột Số đếm thực tế (nền vàng). Mặt hàng không đếm thì để trống. Dược liệu tính bằng gam.",
    cols: COLS, groups: [{ from: 1, to: 5, label: "HỆ THỐNG (không sửa)" }, { from: 6, to: 8, label: "ĐIỀN VÀO ĐÂY (Chênh lệch tự tính)", input: true }],
  });
  items.forEach((it, idx) => {
    const r = FIRST_ROW + idx;
    const row = ws.getRow(r);
    const st = stockOf(it.lots);
    [it.code ?? "", it.name, it.type === "HERB" ? "Vị thuốc" : "Thành phẩm", it.unit, st].forEach((v, i) => (row.getCell(i + 1).value = v));
    row.getCell(7).value = { formula: `IF(F${r}="","",F${r}-E${r})`, result: "" };
    styleRow(ws, r, COLS);
    row.getCell(5).numFmt = row.getCell(6).numFmt = row.getCell(7).numFmt = '#,##0.##;-#,##0.##;0';
    row.getCell(5).alignment = row.getCell(6).alignment = row.getCell(7).alignment = { horizontal: "right" };
    row.getCell(6).dataValidation = { type: "decimal", operator: "greaterThanOrEqual", formulae: [0], allowBlank: true, showErrorMessage: true, errorTitle: "Số đếm", error: "Nhập số không âm." };
    row.getCell(8).dataValidation = { type: "list", allowBlank: true, formulae: [`"${REASONS.join(",")}"`], showErrorMessage: false };
  });
  ws.addConditionalFormatting({ ref: `G${FIRST_ROW}:G${FIRST_ROW + items.length}`, rules: [{ type: "expression", formulae: [`AND(G${FIRST_ROW}<>"",G${FIRST_ROW}<>0)`], priority: 1, style: { font: { bold: true, color: { argb: "FF991B1B" } }, fill: { type: "pattern", pattern: "solid", bgColor: { argb: "FFFEE2E2" } } } }] });
  await protect(ws);
  guideSheet(wb, [
    "HƯỚNG DẪN PHIẾU KIỂM KÊ KHO",
    "",
    "1. Phiếu ghi sẵn tồn trên sổ lúc xuất file. Đếm hàng thực tế rồi điền vào cột Số đếm thực tế (ô vàng).",
    "2. Chỉ điền mặt hàng đã đếm. Dòng để trống bị bỏ qua, không bị coi là bằng 0.",
    "3. Cột Chênh lệch tự tính (đếm trừ sổ). Dòng lệch phải ghi lý do.",
    "4. Dược liệu đếm bằng gam. 5 kg thì ghi 5000.",
    "5. Tải phiếu lên ở Biểu mẫu, Phiếu kiểm kê. App hiện bảng xem trước và chỉ lưu khi bạn xác nhận.",
    "6. Nếu trong lúc đếm có phát thuốc hoặc nhập thêm làm tồn trên sổ đổi, app sẽ chặn dòng đó. Hãy xuất phiếu mới.",
    "7. Thừa thì app thêm một lô điều chỉnh (giá theo lần nhập gần nhất). Thiếu thì trừ lô hết hạn sớm nhất trước.",
    "8. Phiếu chỉ dùng cho chi nhánh ghi ở ô B2, và mỗi file chỉ nhập một lần.",
  ]);
  return Buffer.from(await wb.xlsx.writeBuffer());
}

type Op = { itemId: string; name: string; unit: string; delta: number; reason: string; expect: number };

async function analyze(buf: Buffer, branch: { id: string; name: string }): Promise<Analysis> {
  const o = await openSheet(buf, { name: SHEET, marker: MARKER, scope: branch.name, cols: COLS, what: "Phiếu kiểm kê kho" });
  if (!o.ws) return emptyAnalysis(hashOf(buf), o.error);
  const hash = o.voucher ?? hashOf(buf);
  const ws = o.ws;
  const items = (await prisma.item.findMany({ where: { active: true }, include: { lots: { where: { branchId: branch.id, qtyRemaining: { gt: 0 } }, orderBy: { receivedAt: "desc" }, select: { qtyRemaining: true, unitCost: true } } } })) as unknown as ItemRow[];
  const byCode = new Map(items.filter((i) => i.code).map((i) => [i.code as string, i]));
  const seen = new Set<string>();
  const rows: ImportRow[] = [];
  const ops: Op[] = [];
  let diffs = 0;
  for (let r = FIRST_ROW; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const code = text(row.getCell(1).value);
    const counted = toNumber(row.getCell(6).value);
    if (!code && counted === null) continue;
    if (counted === null) continue;
    if (rows.length >= MAX_ROWS) return { ...emptyAnalysis(hash, `Tối đa ${MAX_ROWS} dòng mỗi lần.`) };
    const errors: string[] = [], warnings: string[] = [];
    const it = byCode.get(code);
    if (!it) errors.push(`Mã hàng “${code}” không có hoặc đã ngừng bán.`);
    else if (it.name !== text(row.getCell(2).value)) errors.push(`Tên không khớp mã (file: ${text(row.getCell(2).value)}, hệ thống: ${it.name}). Tải phiếu mới.`);
    if (seen.has(code)) errors.push("Mã hàng bị lặp trong file.");
    seen.add(code);
    if (counted === "bad" || counted < 0) errors.push("Số đếm phải là số không âm.");
    const sheetStock = toNumber(row.getCell(5).value);
    let delta = 0, st = 0;
    if (it && typeof counted === "number" && counted >= 0) {
      st = stockOf(it.lots);
      if (typeof sheetStock !== "number" || Math.abs(sheetStock - st) > 0.005) errors.push(`Tồn trên sổ đã đổi từ lúc xuất phiếu (phiếu: ${fmt(Number(sheetStock) || 0)}, hiện tại: ${fmt(st)}). Tải phiếu mới.`);
      delta = Math.round((counted - st) * 100) / 100;
      if (!errors.length && delta !== 0) {
        const reason = text(row.getCell(8).value);
        if (!reason) errors.push("Dòng lệch phải ghi lý do.");
        else if (reason.length > 120) errors.push("Lý do quá dài (tối đa 120 ký tự).");
        if (delta > 0 && !it.lots[0]) warnings.push("Chưa có giá nhập trước đó, lô điều chỉnh sẽ ghi giá 0.");
        if (st > 0 && Math.abs(delta) / st > 0.2) warnings.push(`Lệch ${Math.round((Math.abs(delta) / st) * 100)}% so với sổ, kiểm tra lại số đếm.`);
        if (!errors.length) { ops.push({ itemId: it.id, name: it.name, unit: it.unit, delta, reason, expect: st }); diffs++; }
      }
    }
    rows.push({ row: r, label: `${code} ${it?.name ?? text(row.getCell(2).value)}`, detail: it && typeof counted === "number" ? (delta === 0 ? `Khớp ${fmt(st)} ${it.unit}` : `Sổ ${fmt(st)} → đếm ${fmt(counted)} ${it.unit} (${delta > 0 ? "+" : ""}${fmt(delta)})`) : "", errors, warnings });
  }
  const out: Analysis = { hash, fileErrors: [], rows, summary: `${rows.length} mặt hàng đã đếm, ${diffs} lệch, ${rows.length - diffs - rows.filter((x) => x.errors.length).length} khớp`, payload: ops };
  if (!rows.length) out.fileErrors.push("Chưa điền Số đếm thực tế ở dòng nào.");
  return out;
}

export const kiemKe: Importer = {
  id: "kiem-ke", name: "Phiếu kiểm kê kho", roles: STOCK_WRITE_ROLES, needsBranch: true,
  columns: ["Mặt hàng", "Kết quả kiểm kê"], allowedHint: "Dòng khớp sổ không tạo điều chỉnh. Dòng lệch lập điều chỉnh tăng hoặc giảm.",
  build: (c) => build(c.branch!), fileName: () => "phieu-kiem-ke",
  analyze: (b, c) => analyze(b, c.branch!),
  async commit(a, c) {
    const ops = a.payload as Op[];
    const branchId = c.branch!.id;
    const label = `Kiểm kê ${new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10)}`;
    await prisma.$transaction(async (tx) => {
      for (const op of ops) {
        const lots = await tx.stockLot.findMany({ where: { itemId: op.itemId, branchId, qtyRemaining: { gt: 0 } }, orderBy: [{ expiryDate: { sort: "asc", nulls: "last" } }, { receivedAt: "asc" }] });
        const have = Math.round(lots.reduce((s, l) => s + l.qtyRemaining, 0) * 100) / 100;
        if (Math.abs(have - op.expect) > 0.005) throw new Error(`Tồn của ${op.name} vừa thay đổi, chưa lưu gì. Hãy thử lại.`);
        const reason = `${label}: ${op.reason}`;
        if (op.delta > 0) {
          const last = await tx.stockLot.findFirst({ where: { itemId: op.itemId, branchId }, orderBy: { receivedAt: "desc" }, select: { unitCost: true } });
          const lot = await tx.stockLot.create({ data: { itemId: op.itemId, branchId, unitCost: last?.unitCost ?? 0, qtyReceived: op.delta, qtyRemaining: op.delta, note: `Điều chỉnh tăng: ${reason}`, staffName: c.staff.fullName } });
          await tx.stockMove.create({ data: { itemId: op.itemId, branchId, lotId: lot.id, type: "ADJUST", qty: op.delta, reason, staffName: c.staff.fullName } });
        } else {
          let need = -op.delta;
          for (const l of lots) {
            if (need <= 1e-9) break;
            const take = Math.min(l.qtyRemaining, need);
            await tx.stockLot.update({ where: { id: l.id }, data: { qtyRemaining: l.qtyRemaining - take } });
            await tx.stockMove.create({ data: { itemId: op.itemId, branchId, lotId: l.id, type: "ADJUST", qty: -take, reason, staffName: c.staff.fullName } });
            need -= take;
          }
        }
      }
    }, { timeout: 60_000 }).catch((e: unknown) => { throw new Error(e instanceof Error && e.message.startsWith("Tồn của") ? e.message : "Không lưu được, chưa có gì được ghi. Hãy thử lại."); });
    for (const op of ops) await logAudit({ staffId: c.staff.id, staffName: c.staff.fullName, branchId, action: "ADJUST", entity: "Stock", entityId: op.itemId, detail: `${op.name} ${op.delta > 0 ? "+" : ""}${op.delta}${op.unit} · ${op.reason} (kiểm kê Excel)` });
    return `Đã ghi ${ops.length} điều chỉnh từ phiếu kiểm kê.`;
  },
};
