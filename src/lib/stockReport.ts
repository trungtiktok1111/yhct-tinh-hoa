import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";

// Báo cáo Nhập – Xuất – Tồn theo kỳ và Thẻ kho, dựng từ sổ biến động kho (StockMove).
// Giá trị mỗi biến động = số lượng × giá nhập của đúng lô đã nhập/xuất (khớp với cách app trừ kho theo lô, hạn gần trước).
// Nhập = nhập kho + điều chỉnh tăng (kiểm kê thừa). Xuất = phát thuốc + điều chỉnh giảm (kiểm kê thiếu, hủy).

const GREEN = "FF1B4332";
const nfQ = "#,##0.##";
const nfV = "#,##0";

type Mv = { at: Date; itemId: string; type: string; qty: number; reason: string | null; invoiceId: string | null; cost: number; note: string | null };

const thin = { style: "thin", color: { argb: "FF9CA3AF" } } as const;
const box = { top: thin, bottom: thin, left: thin, right: thin };

function fill(c: ExcelJS.Cell, argb: string) { c.fill = { type: "pattern", pattern: "solid", fgColor: { argb } }; }

export function parseDay(s: string | null | undefined): Date | null {
  const m = (s ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCMonth() === +m[2] - 1 ? d : null;
}
const VN = 7 * 3600_000; // kỳ tính theo giờ Việt Nam
const dmy = (d: Date) => `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
const dmyVN = (d: Date) => dmy(new Date(d.getTime() + VN));

export async function buildNxt(branch: { id: string; name: string }, fromDay: Date, toDay: Date, opts: { cost: boolean; by: string }): Promise<Buffer> {
  const start = new Date(fromDay.getTime() - VN); // 00:00 giờ VN của ngày bắt đầu
  const end = new Date(toDay.getTime() + 86400_000 - VN); // hết ngày kết thúc
  const [items, moves, lots] = await Promise.all([
    prisma.item.findMany({ where: { OR: [{ active: true }, { moves: { some: { branchId: branch.id } } }] }, orderBy: [{ type: "asc" }, { name: "asc" }], select: { id: true, code: true, name: true, unit: true, type: true } }),
    prisma.stockMove.findMany({
      where: { branchId: branch.id, at: { lt: end } }, orderBy: { at: "asc" },
      select: { at: true, itemId: true, lotId: true, type: true, qty: true, reason: true, invoiceId: true, lot: { select: { unitCost: true, note: true } } },
    }),
    prisma.stockLot.findMany({ where: { branchId: branch.id }, select: { id: true, itemId: true, qtyRemaining: true, qtyReceived: true, unitCost: true, receivedAt: true, note: true } }),
  ]);
  const byItem = new Map<string, Mv[]>();
  for (const m of moves) {
    const arr = byItem.get(m.itemId) ?? [];
    arr.push({ at: m.at, itemId: m.itemId, type: m.type, qty: m.qty, reason: m.reason, invoiceId: m.invoiceId, cost: m.lot?.unitCost ?? 0, note: m.lot?.note ?? null });
    byItem.set(m.itemId, arr);
  }
  // Lô có từ trước khi app ghi sổ (không có biến động nhập): coi như nhập đầu tại ngày nhận lô, để tồn đầu kỳ đủ.
  const hasReceipt = new Set(moves.filter((m) => m.type === "RECEIPT" && m.lotId).map((m) => m.lotId));
  for (const l of lots) {
    if (hasReceipt.has(l.id) || l.receivedAt >= end) continue;
    const arr = byItem.get(l.itemId) ?? [];
    arr.push({ at: l.receivedAt, itemId: l.itemId, type: "RECEIPT", qty: l.qtyReceived, reason: "Tồn ghi nhận từ trước", invoiceId: null, cost: l.unitCost, note: l.note });
    byItem.set(l.itemId, arr);
  }
  for (const arr of byItem.values()) arr.sort((a, b) => a.at.getTime() - b.at.getTime());
  const actual = new Map<string, { q: number; v: number }>();
  for (const l of lots) {
    const a = actual.get(l.itemId) ?? { q: 0, v: 0 };
    a.q += l.qtyRemaining; a.v += l.qtyRemaining * l.unitCost;
    actual.set(l.itemId, a);
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "YHCT Tinh Hoa";
  const cost = opts.cost;
  const ws = wb.addWorksheet("Nhập xuất tồn", { views: [{ state: "frozen", ySplit: 7 }] });
  const stamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  // Cột: STT, Mã, Tên, ĐVT, [Tồn đầu SL, GT], [Nhập SL, GT], [Xuất SL, GT], [Tồn cuối SL, GT], Tồn hệ thống, Chênh lệch
  const G = cost ? 2 : 1;
  const nCols = 4 + 4 * G + 2;
  ws.getCell("A1").value = "PHÒNG KHÁM ĐÔNG Y TINH HOA";
  ws.getCell("A1").font = { bold: true, size: 12 };
  ws.getCell("A2").value = `Chi nhánh: ${branch.name}`;
  ws.mergeCells(3, 1, 3, nCols);
  const t = ws.getCell("A3");
  t.value = "BÁO CÁO NHẬP – XUẤT – TỒN KHO";
  t.font = { bold: true, size: 16, color: { argb: GREEN } };
  t.alignment = { horizontal: "center" };
  ws.mergeCells(4, 1, 4, nCols);
  ws.getCell("A4").value = `Từ ngày ${dmy(fromDay)} đến ngày ${dmy(toDay)}`;
  ws.getCell("A4").alignment = { horizontal: "center" };
  ws.getCell("A4").font = { italic: true };
  ws.mergeCells(5, 1, 5, nCols);
  ws.getCell("A5").value = cost
    ? "Đơn vị tính: số lượng theo ĐVT của mặt hàng (dược liệu tính bằng gam), giá trị bằng đồng. Giá trị tính theo giá nhập của từng lô, xuất kho theo lô hết hạn sớm nhất trước."
    : "Đơn vị tính: số lượng theo ĐVT của mặt hàng (dược liệu tính bằng gam).";
  ws.getCell("A5").font = { italic: true, size: 9, color: { argb: "FF6B7280" } };
  ws.getCell("A5").alignment = { wrapText: true, vertical: "top" };
  ws.getRow(5).height = cost ? 26 : 14;

  // Hai hàng tiêu đề: nhóm (hàng 6) và cột (hàng 7)
  const heads: [string, number][] = [["STT", 6], ["Mã hàng", 10], ["Tên mặt hàng", 28], ["ĐVT", 8]];
  const groups = ["Tồn đầu kỳ", "Nhập trong kỳ", "Xuất trong kỳ", "Tồn cuối kỳ"];
  const r6 = ws.getRow(6), r7 = ws.getRow(7);
  heads.forEach(([h, w], i) => {
    ws.mergeCells(6, i + 1, 7, i + 1);
    r6.getCell(i + 1).value = h;
    ws.getColumn(i + 1).width = w;
  });
  let col = 5;
  groups.forEach((g) => {
    if (cost) ws.mergeCells(6, col, 6, col + 1);
    r6.getCell(col).value = g;
    r7.getCell(col).value = "Số lượng";
    ws.getColumn(col).width = 13;
    if (cost) { r7.getCell(col + 1).value = "Giá trị (đ)"; ws.getColumn(col + 1).width = 15; }
    col += G;
  });
  ws.mergeCells(6, col, 6, col + 1);
  r6.getCell(col).value = "Đối chiếu kho";
  r7.getCell(col).value = "Tồn thực tế";
  r7.getCell(col + 1).value = "Chênh lệch";
  ws.getColumn(col).width = 13;
  ws.getColumn(col + 1).width = 12;
  for (let c = 1; c <= nCols; c++) for (const r of [r6, r7]) {
    const cell = r.getCell(c);
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    fill(cell, GREEN);
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = box;
  }
  r6.height = 20; r7.height = 20;

  const sum = new Array(nCols + 1).fill(0);
  let row = 8, stt = 0, anyDiff = 0;
  const first = row;
  for (const it of items) {
    const mv = byItem.get(it.id) ?? [];
    let oq = 0, ov = 0, iq = 0, iv = 0, xq = 0, xv = 0;
    for (const m of mv) {
      const v = m.qty * m.cost;
      if (m.at < start) { oq += m.qty; ov += v; }
      else if (m.qty >= 0) { iq += m.qty; iv += v; }
      else { xq += -m.qty; xv += -v; }
    }
    const a = actual.get(it.id) ?? { q: 0, v: 0 };
    if (!mv.length && a.q === 0) continue;
    if (!oq && !iq && !xq && !a.q && !ov && !iv && !xv) continue;
    stt++;
    const r = ws.getRow(row);
    const R = row;
    r.getCell(1).value = stt;
    r.getCell(2).value = it.code ?? "";
    r.getCell(3).value = it.name;
    r.getCell(4).value = it.unit;
    let c = 5;
    r.getCell(c).value = round(oq); if (cost) r.getCell(c + 1).value = Math.round(ov);
    const cOpen = c; c += G;
    r.getCell(c).value = round(iq); if (cost) r.getCell(c + 1).value = Math.round(iv);
    const cIn = c; c += G;
    r.getCell(c).value = round(xq); if (cost) r.getCell(c + 1).value = Math.round(xv);
    const cOut = c; c += G;
    // Tồn cuối = đầu + nhập − xuất, là công thức Excel để kế toán kiểm tra được
    const L = (n: number) => ws.getColumn(n).letter;
    r.getCell(c).value = { formula: `${L(cOpen)}${R}+${L(cIn)}${R}-${L(cOut)}${R}`, result: round(oq + iq - xq) };
    if (cost) r.getCell(c + 1).value = { formula: `${L(cOpen + 1)}${R}+${L(cIn + 1)}${R}-${L(cOut + 1)}${R}`, result: Math.round(ov + iv - xv) };
    const cClose = c; c += G;
    // Đối chiếu với tồn thực tế của hệ thống tại thời điểm xuất file (chỉ có nghĩa khi kỳ kết thúc là hôm nay hoặc sau)
    r.getCell(c).value = round(a.q);
    const diff = round(oq + iq - xq - a.q);
    r.getCell(c + 1).value = { formula: `${L(cClose)}${R}-${L(c)}${R}`, result: diff };
    for (let k = 1; k <= nCols; k++) {
      const cell = r.getCell(k);
      cell.border = box;
      if (k >= 5) { cell.alignment = { horizontal: "right" }; cell.numFmt = cost && (k - 5) % 2 === 1 && k < 5 + 4 * G ? nfV : nfQ; }
      if (stt % 2 === 0) fill(cell, "FFF7F9F8");
    }
    if (cost) for (const k of [6, 8, 10, 12]) r.getCell(k).numFmt = nfV;
    r.getCell(1).alignment = { horizontal: "center" };
    if (Math.abs(diff) > 0.005) { anyDiff++; const dc = r.getCell(c + 1); dc.font = { bold: true, color: { argb: "FF991B1B" } }; fill(dc, "FFFEE2E2"); }
    sum[cOpen] += oq; sum[cIn] += iq; sum[cOut] += xq;
    if (cost) { sum[cOpen + 1] += ov; sum[cIn + 1] += iv; sum[cOut + 1] += xv; }
    row++;
  }
  const last = row - 1;
  const tr = ws.getRow(row);
  ws.mergeCells(row, 1, row, 4);
  tr.getCell(1).value = "TỔNG CỘNG";
  tr.getCell(1).alignment = { horizontal: "center" };
  for (let k = 5; k <= nCols - 2; k++) {
    // Số lượng cộng chung chỉ có nghĩa khi cùng đơn vị, nên chỉ cộng cột giá trị
    const isVal = cost && (k - 5) % 2 === 1;
    if (isVal) {
      const colSum = k < 5 + 3 * G ? sum[k] : sum[5 + G + 1] + 0; // cột tồn cuối tính từ đầu + nhập − xuất
      tr.getCell(k).value = { formula: `SUM(${ws.getColumn(k).letter}${first}:${ws.getColumn(k).letter}${last})`, result: k < 5 + 3 * G ? colSum : sum[6] + sum[8] - sum[10] };
    }
  }
  for (let k = 1; k <= nCols; k++) {
    const cell = tr.getCell(k);
    cell.font = { bold: true };
    cell.border = box;
    cell.numFmt = nfV;
    fill(cell, "FFE4F1E8");
  }
  row += 2;
  const note = (txt: string, color = "FF6B7280", bold = false) => { ws.mergeCells(row, 1, row, nCols); const c = ws.getCell(row, 1); c.value = txt; c.font = { italic: !bold, bold, size: 9, color: { argb: color } }; c.alignment = { wrapText: true, vertical: "top" }; row++; };
  if (stt === 0) note("Không có phát sinh trong kỳ.");
  note(`Cột “Tồn thực tế” là số tồn trên hệ thống lúc xuất file (${stamp}). “Chênh lệch” khác 0 nghĩa là sổ biến động chưa khớp tồn thực tế (thường do tồn nhập trước khi có sổ, hoặc xuất kỳ không kết thúc hôm nay).`);
  if (anyDiff) note(`Có ${anyDiff} mặt hàng chênh lệch (tô đỏ), cần kiểm tra lại trước khi dùng số liệu.`, "FF991B1B", true);
  if (cost) note("Giá trị chỉ cộng ở cột tiền. Số lượng không cộng chung vì khác đơn vị tính.");
  row += 1;
  const sig = row;
  const pos = [[2, "Người lập biểu"], [Math.round(nCols / 2), "Thủ kho"], [nCols - 3, "Kế toán trưởng"]] as const;
  ws.getCell(sig, nCols - 4).value = `Ngày ${new Date(Date.now() + VN).getUTCDate()} tháng ${new Date(Date.now() + VN).getUTCMonth() + 1} năm ${new Date(Date.now() + VN).getUTCFullYear()}`;
  ws.getCell(sig, nCols - 4).font = { italic: true };
  for (const [c, label] of pos) { ws.getCell(sig + 1, c).value = label; ws.getCell(sig + 1, c).font = { bold: true }; ws.getCell(sig + 2, c).value = "(Ký, ghi rõ họ tên)"; ws.getCell(sig + 2, c).font = { italic: true, size: 9 }; }
  ws.getCell(sig + 1, 2).alignment = { horizontal: "left" };
  ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: "6:7", margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 } };
  ws.headerFooter.oddFooter = `&LLập bởi ${opts.by}, ${stamp}&RTrang &P/&N`;

  // ---- Thẻ kho: mỗi mặt hàng một khối, có tồn lũy kế sau từng giao dịch ----
  const wc = wb.addWorksheet("Thẻ kho", { views: [{ state: "frozen", ySplit: 5 }] });
  wc.getCell("A1").value = "THẺ KHO";
  wc.getCell("A1").font = { bold: true, size: 16, color: { argb: GREEN } };
  wc.getCell("A2").value = `Chi nhánh: ${branch.name} · Từ ngày ${dmy(fromDay)} đến ngày ${dmy(toDay)}`;
  wc.getCell("A3").value = "Mỗi mặt hàng một khối: tồn đầu kỳ, các giao dịch trong kỳ theo thời gian, tồn cuối kỳ. Chứng từ là số phiếu nhập (PN-…) hoặc mã hóa đơn phát thuốc.";
  wc.getCell("A3").font = { italic: true, size: 9, color: { argb: "FF6B7280" } };
  const wcols: [string, number][] = [["Ngày", 12], ["Chứng từ", 22], ["Diễn giải", 38], ["Nhập", 13], ["Xuất", 13], ["Tồn", 13], ...(cost ? ([["Giá / ĐVT", 12], ["Giá trị giao dịch", 16]] as [string, number][]) : [])];
  wcols.forEach(([h, w], i) => {
    const c = wc.getRow(5).getCell(i + 1);
    c.value = h; c.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 }; fill(c, GREEN); c.alignment = { horizontal: "center", vertical: "middle" }; c.border = box;
    wc.getColumn(i + 1).width = w;
  });
  wc.getRow(5).height = 22;
  let cr = 6;
  const lbl = (t: string, ty: string) => ty === "RECEIPT" ? "Nhập kho" : ty === "DISPENSE" ? "Phát thuốc" : t;
  for (const it of items) {
    const mv = byItem.get(it.id) ?? [];
    const inPeriod = mv.filter((m) => m.at >= start);
    const open = mv.filter((m) => m.at < start).reduce((s, m) => s + m.qty, 0);
    if (!mv.length) continue;
    if (!inPeriod.length && Math.abs(open) < 1e-9) continue;
    wc.mergeCells(cr, 1, cr, wcols.length);
    const h = wc.getCell(cr, 1);
    h.value = `${it.code ?? ""}  ${it.name}  (ĐVT: ${it.unit})`;
    h.font = { bold: true, color: { argb: GREEN } };
    fill(h, "FFE4F1E8");
    cr++;
    const put = (vals: (string | number | null)[], bold = false, italic = false) => {
      vals.forEach((v, i) => {
        const c = wc.getCell(cr, i + 1);
        c.value = v; c.border = box; c.font = { bold, italic };
        if (i >= 3) { c.alignment = { horizontal: "right" }; c.numFmt = cost && i >= 6 ? nfV : nfQ; }
      });
      cr++;
    };
    let run = open;
    put([dmyVN(start), "", "Tồn đầu kỳ", null, null, round(open), ...(cost ? [null, null] : [])], true);
    for (const m of inPeriod) {
      run += m.qty;
      const pn = m.note?.match(/PN-[0-9]{8}-[0-9A-F]{4}/)?.[0] ?? "";
      const doc = m.type === "DISPENSE" ? (m.reason?.replace("Phát thuốc ", "") ?? "") : pn;
      put([dmyVN(m.at), doc, lbl(m.reason ?? "Điều chỉnh", m.type) + (m.type === "ADJUST" ? " (điều chỉnh)" : ""), m.qty > 0 ? round(m.qty) : null, m.qty < 0 ? round(-m.qty) : null, round(run), ...(cost ? [m.cost, Math.round(Math.abs(m.qty) * m.cost)] : [])]);
    }
    put([dmyVN(new Date(end.getTime() - 1)), "", "Tồn cuối kỳ", null, null, round(run), ...(cost ? [null, null] : [])], true);
    cr++;
  }
  wc.pageSetup = { orientation: "portrait", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: "5:5" };
  return Buffer.from(await wb.xlsx.writeBuffer());
}

const round = (n: number) => Math.round(n * 100) / 100;
