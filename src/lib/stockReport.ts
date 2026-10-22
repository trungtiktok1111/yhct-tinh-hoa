import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";

// Báo cáo Nhập – Xuất – Tồn theo kỳ và Thẻ kho, dựng từ sổ biến động kho (StockMove).
// Giá trị mỗi biến động = số lượng × giá nhập của đúng lô đã nhập/xuất (khớp với cách app trừ kho theo lô, hạn gần trước).
// Nhập = nhập kho + điều chỉnh tăng (kiểm kê thừa). Xuất = phát thuốc + điều chỉnh giảm (kiểm kê thiếu, hủy).

const GREEN = "FF1B4332";
// Số 0 hiện "-" theo thông lệ kế toán; số lẻ chỉ hiện khi có phần lẻ (tránh "600." hay "600,00").
const nfV = '#,##0;-#,##0;"-"';
const nfQ = (v: number) => (Number.isInteger(v) ? '#,##0;-#,##0;"-"' : '#,##0.00;-#,##0.00;"-"');

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
    prisma.item.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }], select: { id: true, code: true, name: true, unit: true, type: true, active: true } }),
    prisma.stockMove.findMany({
      where: { branchId: branch.id, at: { gte: start } }, orderBy: { at: "asc" },
      select: { at: true, itemId: true, lotId: true, type: true, qty: true, reason: true, invoiceId: true, lot: { select: { unitCost: true, note: true } } },
    }),
    prisma.stockLot.findMany({ where: { branchId: branch.id }, select: { id: true, itemId: true, qtyRemaining: true, qtyReceived: true, unitCost: true } }),
  ]);
  // Tồn cuối kỳ lấy từ tồn thực của các lô, lùi lại theo các biến động sau ngày kết thúc.
  // Tồn đầu kỳ = tồn cuối − nhập + xuất. Nhờ vậy báo cáo luôn khớp tồn thực tế, kể cả khi sổ cũ thiếu chứng từ.
  const cur = new Map<string, { q: number; v: number }>();
  for (const l of lots) {
    const a = cur.get(l.itemId) ?? { q: 0, v: 0 };
    a.q += l.qtyRemaining; a.v += l.qtyRemaining * l.unitCost;
    cur.set(l.itemId, a);
  }
  const byItem = new Map<string, Mv[]>();
  const after = new Map<string, { q: number; v: number }>();
  for (const m of moves) {
    const cost = m.lot?.unitCost ?? 0;
    if (m.at >= end) {
      const a = after.get(m.itemId) ?? { q: 0, v: 0 };
      a.q += m.qty; a.v += m.qty * cost;
      after.set(m.itemId, a);
      continue;
    }
    const arr = byItem.get(m.itemId) ?? [];
    arr.push({ at: m.at, itemId: m.itemId, type: m.type, qty: m.qty, reason: m.reason, invoiceId: m.invoiceId, cost, note: m.lot?.note ?? null });
    byItem.set(m.itemId, arr);
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "YHCT Tinh Hoa";
  const cost = opts.cost;
  const ws = wb.addWorksheet("Nhập xuất tồn", { views: [{ state: "frozen", ySplit: 7 }] });
  const stamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const G = cost ? 2 : 1;
  const nCols = 4 + 4 * G;
  ws.getCell("A1").value = "PHÒNG KHÁM ĐÔNG Y TINH HOA";
  ws.getCell("A1").font = { bold: true, size: 12 };
  ws.getCell("A2").value = `Chi nhánh / kho: ${branch.name}`;
  ws.mergeCells(3, 1, 3, nCols);
  const t = ws.getCell("A3");
  t.value = "BÁO CÁO TỔNG HỢP NHẬP – XUẤT – TỒN KHO";
  t.font = { bold: true, size: 16, color: { argb: GREEN } };
  t.alignment = { horizontal: "center" };
  ws.mergeCells(4, 1, 4, nCols);
  ws.getCell("A4").value = `Từ ngày ${dmy(fromDay)} đến ngày ${dmy(toDay)}`;
  ws.getCell("A4").alignment = { horizontal: "center" };
  ws.getCell("A4").font = { italic: true };
  ws.mergeCells(5, 1, 5, nCols);
  ws.getCell("A5").value = cost
    ? "Đơn vị tính tiền: đồng. Số lượng theo đơn vị tính (ĐVT) của từng mặt hàng; dược liệu tính bằng gam. Giá trị theo giá nhập của từng lô; xuất kho theo lô hết hạn sớm nhất trước."
    : "Số lượng theo đơn vị tính (ĐVT) của từng mặt hàng; dược liệu tính bằng gam.";
  ws.getCell("A5").font = { italic: true, size: 9, color: { argb: "FF6B7280" } };
  ws.getCell("A5").alignment = { wrapText: true, vertical: "top" };
  ws.getRow(5).height = cost ? 26 : 14;

  const heads: [string, number][] = [["STT", 6], ["Mã hàng", 10], ["Tên mặt hàng", 30], ["ĐVT", 8]];
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
    ws.getColumn(col).width = 14;
    if (cost) { r7.getCell(col + 1).value = "Thành tiền"; ws.getColumn(col + 1).width = 16; }
    col += G;
  });
  for (let c = 1; c <= nCols; c++) for (const r of [r6, r7]) {
    const cell = r.getCell(c);
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    fill(cell, GREEN);
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = box;
  }
  r6.height = 20; r7.height = 20;

  // Hàng cột số thứ tự cột (A, B, 1, 2, ...) như mẫu sổ kế toán
  const L = (n: number) => ws.getColumn(n).letter;
  let row = 8, stt = 0;
  const first = row;
  const tot = { ov: 0, iv: 0, xv: 0 };
  for (const it of items) {
    const mv = byItem.get(it.id) ?? [];
    const c0 = cur.get(it.id) ?? { q: 0, v: 0 };
    const af = after.get(it.id) ?? { q: 0, v: 0 };
    const cq = c0.q - af.q, cv = c0.v - af.v; // tồn cuối kỳ
    let iq = 0, iv = 0, xq = 0, xv = 0;
    for (const m of mv) {
      if (m.qty >= 0) { iq += m.qty; iv += m.qty * m.cost; } else { xq += -m.qty; xv += -m.qty * m.cost; }
    }
    const oq = cq - iq + xq, ov = cv - iv + xv; // tồn đầu kỳ
    const E = (n: number) => Math.abs(n) < 0.005;
    if (E(oq) && E(iq) && E(xq) && E(cq)) continue;
    if (!it.active && E(cq) && E(iq) && E(xq)) continue;
    stt++;
    const r = ws.getRow(row);
    const R = row;
    r.getCell(1).value = stt;
    r.getCell(2).value = it.code ?? "";
    r.getCell(3).value = it.name;
    r.getCell(4).value = it.unit;
    const vals = [[oq, ov], [iq, iv], [xq, xv]];
    vals.forEach(([q, v], gi) => {
      const c = 5 + gi * G;
      r.getCell(c).value = round(q);
      if (cost) r.getCell(c + 1).value = Math.round(v);
    });
    // Tồn cuối = đầu + nhập − xuất (công thức Excel để kế toán kiểm tra)
    const cc = 5 + 3 * G;
    r.getCell(cc).value = { formula: `${L(5)}${R}+${L(5 + G)}${R}-${L(5 + 2 * G)}${R}`, result: round(cq) };
    if (cost) r.getCell(cc + 1).value = { formula: `${L(6)}${R}+${L(6 + G)}${R}-${L(6 + 2 * G)}${R}`, result: Math.round(cv) };
    for (let k = 1; k <= nCols; k++) {
      const cell = r.getCell(k);
      cell.border = box;
      if (k >= 5) {
        const isMoney = cost && (k - 5) % 2 === 1;
        const val = typeof cell.value === "object" && cell.value && "result" in cell.value ? Number(cell.value.result) : Number(cell.value);
        cell.numFmt = isMoney ? nfV : nfQ(val);
        cell.alignment = { horizontal: "right" };
      }
      if (stt % 2 === 0) fill(cell, "FFF7F9F8");
    }
    r.getCell(1).alignment = { horizontal: "center" };
    r.getCell(4).alignment = { horizontal: "center" };
    tot.ov += ov; tot.iv += iv; tot.xv += xv;
    row++;
  }
  const last = row - 1;
  const tr = ws.getRow(row);
  ws.mergeCells(row, 1, row, 4);
  tr.getCell(1).value = "TỔNG CỘNG";
  tr.getCell(1).alignment = { horizontal: "center" };
  if (cost) {
    const tv = [tot.ov, tot.iv, tot.xv, tot.ov + tot.iv - tot.xv];
    tv.forEach((v, gi) => {
      const c = 6 + gi * G;
      tr.getCell(c).value = { formula: `SUM(${L(c)}${first}:${L(c)}${last})`, result: Math.round(v) };
    });
  }
  for (let k = 1; k <= nCols; k++) {
    const cell = tr.getCell(k);
    cell.font = { bold: true };
    cell.border = box;
    cell.numFmt = nfV;
    fill(cell, "FFE4F1E8");
  }
  row += 2;
  const note = (txt: string) => { ws.mergeCells(row, 1, row, nCols); const c = ws.getCell(row, 1); c.value = txt; c.font = { italic: true, size: 9, color: { argb: "FF6B7280" } }; c.alignment = { wrapText: true, vertical: "top" }; row++; };
  if (stt === 0) note("Không có phát sinh trong kỳ.");
  note(cost ? "Số lượng không cộng chung vì khác đơn vị tính; chỉ cộng cột thành tiền." : "Số lượng không cộng chung vì khác đơn vị tính.");
  row += 1;
  const now = new Date(Date.now() + VN);
  ws.mergeCells(row, nCols - 3, row, nCols);
  ws.getCell(row, nCols - 3).value = `Ngày ${now.getUTCDate()} tháng ${now.getUTCMonth() + 1} năm ${now.getUTCFullYear()}`;
  ws.getCell(row, nCols - 3).font = { italic: true };
  ws.getCell(row, nCols - 3).alignment = { horizontal: "center" };
  row++;
  const third = Math.floor(nCols / 3);
  const pos: [number, number, string][] = [[1, third, "Người lập biểu"], [third + 1, 2 * third, "Thủ kho"], [2 * third + 1, nCols, "Kế toán trưởng"]];
  for (const [a, b, label] of pos) {
    ws.mergeCells(row, a, row, b); ws.mergeCells(row + 1, a, row + 1, b);
    const c1 = ws.getCell(row, a), c2 = ws.getCell(row + 1, a);
    c1.value = label; c1.font = { bold: true }; c1.alignment = { horizontal: "center" };
    c2.value = "(Ký, ghi rõ họ tên)"; c2.font = { italic: true, size: 9 }; c2.alignment = { horizontal: "center" };
  }
  ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: "6:7", margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 } };
  ws.headerFooter.oddFooter = `&LLập bởi ${opts.by}, ${stamp}&RTrang &P/&N`;

  // ---- Thẻ kho (theo mẫu S12-DN, TT 99/2025/TT-BTC): mỗi mặt hàng một thẻ, chỉ số lượng ----
  const wc = wb.addWorksheet("Thẻ kho");
  const W = [6, 12, 18, 18, 40, 13, 13, 13, 16];
  W.forEach((w, i) => (wc.getColumn(i + 1).width = w));
  wc.getCell("A1").value = "PHÒNG KHÁM ĐÔNG Y TINH HOA";
  wc.getCell("A1").font = { bold: true, size: 12 };
  wc.getCell("A2").value = `Chi nhánh / kho: ${branch.name}`;
  wc.mergeCells("A3:I3");
  wc.getCell("A3").value = "THẺ KHO";
  wc.getCell("A3").font = { bold: true, size: 16, color: { argb: GREEN } };
  wc.getCell("A3").alignment = { horizontal: "center" };
  wc.mergeCells("A4:I4");
  wc.getCell("A4").value = `Từ ngày ${dmy(fromDay)} đến ngày ${dmy(toDay)}`;
  wc.getCell("A4").font = { italic: true };
  wc.getCell("A4").alignment = { horizontal: "center" };
  let cr = 6;
  const lbl = (m: Mv) => m.type === "RECEIPT" ? "Nhập kho" : m.type === "DISPENSE" ? "Xuất phát thuốc" : m.qty >= 0 ? `${m.reason ?? "Điều chỉnh"} (kiểm kê thừa)` : `${m.reason ?? "Điều chỉnh"} (kiểm kê thiếu / hủy)`;
  for (const it of items) {
    const mv = byItem.get(it.id) ?? [];
    const c0 = cur.get(it.id) ?? { q: 0, v: 0 };
    const af = after.get(it.id) ?? { q: 0, v: 0 };
    const cq = c0.q - af.q;
    if (!mv.length && Math.abs(cq) < 0.005) continue;
    const net = mv.reduce((s, m) => s + m.qty, 0);
    const open = cq - net;
    for (const [k, v] of [["Tên vật tư, hàng hóa", it.name], ["Mã số", it.code ?? ""], ["Đơn vị tính", it.unit]] as const) {
      wc.mergeCells(cr, 1, cr, 3);
      wc.getCell(cr, 1).value = `${k}:`;
      wc.mergeCells(cr, 4, cr, 9);
      wc.getCell(cr, 4).value = v;
      wc.getCell(cr, 1).font = { bold: true };
      wc.getCell(cr, 4).font = { bold: k === "Tên vật tư, hàng hóa" };
      cr++;
    }
    const h1 = wc.getRow(cr), h2 = wc.getRow(cr + 1);
    const spans: [number, number, string][] = [[1, 1, "STT"], [2, 2, "Ngày chứng từ"], [3, 4, "Số hiệu chứng từ"], [5, 5, "Diễn giải"], [6, 8, "Số lượng"], [9, 9, "Xác nhận của kế toán"]];
    for (const [a, b, label] of spans) {
      if (a === b) wc.mergeCells(cr, a, cr + 1, a); else wc.mergeCells(cr, a, cr, b);
      h1.getCell(a).value = label;
    }
    h2.getCell(3).value = "Nhập"; h2.getCell(4).value = "Xuất"; h2.getCell(6).value = "Nhập"; h2.getCell(7).value = "Xuất"; h2.getCell(8).value = "Tồn";
    for (let c = 1; c <= 9; c++) for (const r of [h1, h2]) {
      const cell = r.getCell(c);
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
      fill(cell, GREEN); cell.border = box;
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    }
    cr += 2;
    const put = (vals: (string | number | null)[], bold = false) => {
      vals.forEach((v, i) => {
        const c = wc.getCell(cr, i + 1);
        c.value = v; c.border = box; c.font = { bold };
        if (i >= 5 && i <= 7) { c.alignment = { horizontal: "right" }; c.numFmt = nfQ(Number(v ?? 0)); }
        else if (i === 0 || i === 1) c.alignment = { horizontal: "center" };
      });
      cr++;
    };
    let run = open, n = 0;
    put(["", "", "", "", "Số dư đầu kỳ", null, null, round(open), ""], true);
    for (const m of mv) {
      run += m.qty;
      const pn = m.note?.match(/PN-[0-9]{8}-[0-9A-F]{4}/)?.[0] ?? "";
      const code = m.type === "DISPENSE" ? (m.reason?.replace("Phát thuốc ", "") ?? "") : pn;
      put([++n, dmyVN(m.at), m.qty > 0 ? code : "", m.qty < 0 ? code : "", lbl(m), m.qty > 0 ? round(m.qty) : null, m.qty < 0 ? round(-m.qty) : null, round(run), ""]);
    }
    const iq = mv.filter((m) => m.qty > 0).reduce((s, m) => s + m.qty, 0), xq = mv.filter((m) => m.qty < 0).reduce((s, m) => s - m.qty, 0);
    put(["", "", "", "", "Cộng phát sinh trong kỳ", round(iq), round(xq), null, ""], true);
    put(["", "", "", "", "Số dư cuối kỳ", null, null, round(run), ""], true);
    cr += 2;
  }
  wc.pageSetup = { orientation: "portrait", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
  wc.headerFooter.oddFooter = `&LLập bởi ${opts.by}, ${stamp}&RTrang &P/&N`;
  return Buffer.from(await wb.xlsx.writeBuffer());
}

const round = (n: number) => Math.round(n * 100) / 100;
