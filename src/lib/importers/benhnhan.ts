import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { emptyAnalysis, MAX_ROWS, type Analysis, type ImportRow, type Importer } from "@/lib/importKit";
import { FIRST_ROW, fmt, guideSheet, hashOf, makeSheet, openSheet, protect, styleRow, text, toDay, type ColSpec } from "@/lib/sheetKit";
import { parsePatient } from "@/lib/patientParse";
import { patientCode } from "@/lib/format";
import { VN_PROVINCES } from "@/lib/vn-provinces";

// Nhập hồ sơ bệnh nhân hàng loạt. Mỗi dòng đi qua đúng hàm kiểm tra của form "Bệnh nhân mới" (parsePatient),
// nên dữ liệu nhập bằng Excel và nhập tay luôn theo cùng một luật. Trùng hồ sơ (CCCD, hoặc họ tên + năm sinh + điện thoại) bị chặn.
export const SHEET = "Bệnh nhân";
export const MARKER = "YHCT-BENH-NHAN v1";
const BLOOD = ["A", "B", "AB", "O"].flatMap((g) => [`${g}+`, `${g}-`]);
const BLANK_ROWS = 200;
const SEXV: Record<string, string> = { nam: "M", "nữ": "F", nu: "F", "khác": "O", khac: "O" };

const COLS: ColSpec[] = [
  { header: "STT", width: 6 },
  { header: "Họ tên *", width: 26, input: true }, { header: "Giới tính *", width: 11, input: true }, { header: "Ngày sinh *\n(dd/mm/yyyy)", width: 14, input: true },
  { header: "Điện thoại *", width: 15, input: true }, { header: "CCCD / CMND", width: 15, input: true }, { header: "Email", width: 22, input: true },
  { header: "Số nhà, đường", width: 24, input: true }, { header: "Xã / phường / đặc khu", width: 20, input: true }, { header: "Tỉnh / thành phố", width: 22, input: true },
  { header: "Nghề nghiệp", width: 16, input: true }, { header: "Nhóm máu", width: 10, input: true }, { header: "Số thẻ BHYT", width: 16, input: true },
  { header: "Dị ứng", width: 22, input: true }, { header: "Bệnh mạn tính", width: 22, input: true }, { header: "Ghi chú", width: 24, input: true },
];
// Thứ tự cột -> tên trường của form bệnh nhân.
const FIELD = [null, "fullName", "sex", "birthDate", "phone", "nationalId", "email", "address", "ward", "province", "occupation", "bloodType", "insuranceNo", "allergies", "chronicConditions", "note"] as const;

async function build(voucher: string): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "YHCT Tinh Hoa";
  const ws = makeSheet(wb, {
    voucher,
    name: SHEET, marker: MARKER, title: "NHẬP HỒ SƠ BỆNH NHÂN", scope: "Toàn hệ thống",
    note: "Mỗi dòng một bệnh nhân. Cột có dấu * là bắt buộc. Họ tên + năm sinh + điện thoại, hoặc CCCD đã có thì app chặn để tránh trùng hồ sơ.",
    cols: COLS, groups: [{ from: 1, to: 1, label: "" }, { from: 2, to: 5, label: "BẮT BUỘC", input: true }, { from: 6, to: 16, label: "TÙY CHỌN", input: true }], frozenCols: 2,
  });
  for (let k = 0; k < BLANK_ROWS; k++) {
    const r = FIRST_ROW + k;
    const row = ws.getRow(r);
    row.getCell(1).value = k + 1;
    styleRow(ws, r, COLS);
    row.getCell(1).alignment = { horizontal: "center" };
    row.getCell(3).dataValidation = { type: "list", allowBlank: true, formulae: ['"Nam,Nữ,Khác"'], showErrorMessage: true, errorTitle: "Giới tính", error: "Chọn Nam, Nữ hoặc Khác." };
    row.getCell(4).numFmt = "dd/mm/yyyy";
    row.getCell(4).dataValidation = { type: "date", operator: "between", formulae: [new Date(Date.UTC(1900, 0, 1)), new Date(Date.UTC(2100, 0, 1))], allowBlank: true, showErrorMessage: true, errorTitle: "Ngày sinh", error: "Nhập ngày dd/mm/yyyy, từ năm 1900, không ở tương lai." };
    for (const c of [5, 6, 13]) row.getCell(c).numFmt = "@"; // điện thoại, CCCD, BHYT là chữ để không mất số 0 đầu
    row.getCell(10).dataValidation = { type: "list", allowBlank: true, formulae: [`'Danh sách'!$A$1:$A$${VN_PROVINCES.length}`], showErrorMessage: true, errorTitle: "Tỉnh / thành phố", error: "Chọn trong danh sách." };
    row.getCell(12).dataValidation = { type: "list", allowBlank: true, formulae: [`"${BLOOD.join(",")}"`], showErrorMessage: true, errorTitle: "Nhóm máu", error: "Chọn trong danh sách." };
  }
  const lst = wb.addWorksheet("Danh sách", { state: "hidden" });
  VN_PROVINCES.forEach((p, i) => (lst.getCell(i + 1, 1).value = p.name));
  await protect(ws);
  guideSheet(wb, [
    "HƯỚNG DẪN NHẬP HỒ SƠ BỆNH NHÂN",
    "",
    "1. Mỗi dòng một bệnh nhân. Bắt buộc: Họ tên, Giới tính, Ngày sinh (dd/mm/yyyy), Điện thoại. Các cột khác tùy chọn.",
    "2. Điện thoại và CCCD là chữ, giữ số 0 đầu. Số điện thoại 8 đến 15 chữ số. CCCD 6 đến 15 ký tự chữ và số.",
    "3. Ngày sinh từ năm 1900, không ở tương lai. Nhóm máu chọn trong danh sách.",
    "4. Trùng CCCD, hoặc trùng cả họ tên, năm sinh, điện thoại với hồ sơ đã có hoặc dòng khác trong file thì app chặn dòng đó.",
    "5. Tải file lên ở Biểu mẫu, Nhập hồ sơ bệnh nhân. App hiện bảng xem trước, có lỗi ở dòng nào thì không dòng nào được lưu.",
    "6. Mỗi lần nhập tối đa 500 bệnh nhân. Mỗi file chỉ nhập một lần.",
    "7. File chứa thông tin cá nhân của bệnh nhân. Chỉ dùng nội bộ, nhập xong nên xóa file.",
  ]);
  return Buffer.from(await wb.xlsx.writeBuffer());
}

type Payload = { data: Record<string, unknown>[] };

async function analyze(buf: Buffer): Promise<Analysis> {
  const o = await openSheet(buf, { name: SHEET, marker: MARKER, scope: "Toàn hệ thống", cols: COLS, what: "Nhập hồ sơ bệnh nhân" });
  if (!o.ws) return emptyAnalysis(hashOf(buf), o.error);
  const hash = o.voucher ?? hashOf(buf);
  const ws = o.ws;
  const existing = (await prisma.patient.findMany({ select: { seq: true, fullName: true, birthYear: true, phone: true, nationalId: true } })) as unknown as { seq: number; fullName: string; birthYear: number; phone: string; nationalId: string | null }[];
  const idMap = new Map(existing.filter((p) => p.nationalId).map((p) => [p.nationalId as string, p]));
  const keyMap = new Map(existing.map((p) => [`${p.fullName.toLowerCase()}|${p.birthYear}|${p.phone}`, p]));
  const seenId = new Set<string>(), seenKey = new Set<string>();
  const rows: ImportRow[] = [];
  const data: Record<string, unknown>[] = [];
  for (let r = FIRST_ROW; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const vals = FIELD.map((f, i) => (f ? text(row.getCell(i + 1).value) : ""));
    if (!vals.some((v) => v)) continue;
    if (rows.length >= MAX_ROWS) return emptyAnalysis(hash, `Tối đa ${MAX_ROWS} bệnh nhân mỗi lần.`);
    const errors: string[] = [], warnings: string[] = [];
    const fd = new FormData();
    FIELD.forEach((f, i) => {
      if (!f) return;
      let v = vals[i];
      if (f === "sex") { const m = SEXV[v.toLowerCase()]; if (v && !m) errors.push("Giới tính phải là Nam, Nữ hoặc Khác."); v = m ?? ""; }
      if (f === "birthDate") { const d = toDay(row.getCell(i + 1).value); if (d.bad) errors.push("Ngày sinh không hợp lệ (dd/mm/yyyy)."); v = d.iso ?? ""; }
      if (f === "bloodType" && v && !BLOOD.includes(v.toUpperCase())) errors.push("Nhóm máu phải là A+, A-, B+, B-, AB+, AB-, O+ hoặc O-.");
      if (f === "bloodType") v = v.toUpperCase();
      if (f === "province" && v) { const m = VN_PROVINCES.find((x) => x.name.toLowerCase() === v.toLowerCase()); if (!m) errors.push("Tỉnh / thành phố phải chọn trong danh sách của mẫu."); else v = m.name; }
      if (v) fd.set(f, v);
    });
    if (typeof row.getCell(5).value === "number") warnings.push("Số điện thoại nhập dạng số nên có thể mất số 0 đầu. Kiểm tra lại.");
    let parsed: ReturnType<typeof parsePatient> | null = null;
    if (!errors.length) {
      parsed = parsePatient(fd);
      if ("error" in parsed) errors.push(parsed.error);
    }
    if (parsed && "data" in parsed) {
      const d = parsed.data;
      const idDup = d.nationalId ? idMap.get(d.nationalId) : undefined;
      if (idDup) errors.push(`CCCD đã có hồ sơ ${idDup.fullName} (${patientCode(idDup.seq)}).`);
      const k = `${d.fullName.toLowerCase()}|${d.birthYear}|${d.phone}`;
      const dup = keyMap.get(k);
      if (dup) errors.push(`Đã có hồ sơ ${patientCode(dup.seq)} cùng họ tên, năm sinh, điện thoại.`);
      if (d.nationalId) { if (seenId.has(d.nationalId)) errors.push("CCCD bị lặp trong file."); seenId.add(d.nationalId); }
      if (seenKey.has(k)) errors.push("Bệnh nhân bị lặp trong file (cùng họ tên, năm sinh, điện thoại)."); seenKey.add(k);
      if (!errors.length) data.push(d as unknown as Record<string, unknown>);
    }
    const dob = parsed && "data" in parsed ? parsed.data.birthDate.toISOString().slice(0, 10).split("-").reverse().join("/") : vals[3];
    rows.push({ row: r, label: vals[1] || "(thiếu tên)", detail: [dob, vals[2], vals[4]].filter(Boolean).join(" · "), errors, warnings });
  }
  const out: Analysis = { hash, fileErrors: [], rows, summary: `${rows.length} bệnh nhân mới`, payload: { data } as Payload };
  if (!rows.length) out.fileErrors.push("Chưa điền bệnh nhân nào.");
  return out;
}

export const benhNhan: Importer = {
  id: "benh-nhan", name: "Nhập hồ sơ bệnh nhân", roles: ["OWNER", "BRANCH_MANAGER", "RECEPTION"], needsBranch: false,
  columns: ["Bệnh nhân", "Ngày sinh · giới · điện thoại"], allowedHint: "Dùng chung luật kiểm tra với form Bệnh nhân mới. Có lỗi ở dòng nào thì không lưu dòng nào.",
  build: (c) => build(c.voucher), fileName: () => "nhap-ho-so-benh-nhan",
  analyze: (b) => analyze(b),
  async commit(a, c) {
    const p = a.payload as Payload;
    try {
      await prisma.patient.createMany({ data: p.data.map((d) => ({ ...(d as object), createdBy: c.staff.fullName })) as never });
    } catch {
      throw new Error("Không lưu được (có thể CCCD vừa bị trùng). Chưa có gì được ghi, hãy thử lại.");
    }
    await logAudit({ staffId: c.staff.id, staffName: c.staff.fullName, action: "CREATE", entity: "Patient", detail: `Nhập Excel ${p.data.length} bệnh nhân (${c.fileName})` });
    return `Đã thêm ${fmt(p.data.length)} hồ sơ bệnh nhân.`;
  },
};
