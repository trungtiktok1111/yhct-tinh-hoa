"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { fold } from "@/lib/fold";
import { randomUUID } from "crypto";
import { vnDayStart } from "@/lib/format";

const DAY = 86400000;
const TAG = "[DEMO]";

// [tên, loại, đơn vị, giá bán, giá nhập, tối thiểu, tồn, số ngày tới hạn dùng, nhà cung cấp]
const ITEMS: [string, "HERB" | "PRODUCT", string, number, number, number, number, number, string][] = [
  ["Nhân sâm", "HERB", "g", 2500, 1800, 500, 2000, 700, "Cty Dược liệu Hà Giang"],
  ["Kỷ tử", "HERB", "g", 200, 120, 300, 1500, 400, "Dược liệu Ninh Bình"],
  ["Đương quy", "HERB", "g", 250, 150, 300, 800, 300, "Đông dược Sapa"],
  ["Hoàng kỳ", "HERB", "g", 180, 100, 300, 1200, 600, "Dược liệu Cao Bằng"],
  ["Táo nhân", "HERB", "g", 280, 180, 500, 400, 260, "Dược liệu Ninh Bình"],
  ["Bạch truật", "HERB", "g", 160, 90, 300, 300, 9, "Dược liệu Lào Cai"],
  ["Cam thảo", "HERB", "g", 150, 80, 500, 2500, 22, "Dược liệu Quảng Nam"],
  ["Bạch linh", "HERB", "g", 220, 120, 300, 600, 500, "Dược liệu Hòa Bình"],
  ["Xuyên khung", "HERB", "g", 200, 110, 300, 350, 14, "Dược liệu Lào Cai"],
  ["Thục địa", "HERB", "g", 240, 130, 300, 800, 420, "Dược liệu Hòa Bình"],
  ["Bạch thược", "HERB", "g", 210, 120, 300, 1200, 380, "Dược liệu Cao Bằng"],
  ["Ngưu tất", "HERB", "g", 170, 90, 300, 150, 300, "Dược liệu Hà Giang"],
  ["Thang bổ thận", "PRODUCT", "thang", 15000, 12000, 100, 180, 120, "PK Đông y Tinh Hoa"],
  ["Thang an thần", "PRODUCT", "thang", 13000, 10000, 100, 60, 90, "PK Đông y Tinh Hoa"],
];

// [họ tên, giới, năm sinh, SĐT, dị ứng, bệnh mạn tính, nghề]
const PATIENTS: [string, "M" | "F", number, string, string | null, string | null, string][] = [
  ["Nguyễn Văn An", "M", 1980, "0903456789", null, "Tăng huyết áp", "Kỹ sư"],
  ["Trần Thị Bích", "F", 2005, "0912363570", null, null, "Sinh viên"],
  ["Phạm Thị Hoa", "F", 1968, "0933221188", "Dị ứng penicillin", "Thoái hóa khớp", "Buôn bán"],
  ["Nguyễn Thị Lan", "F", 1992, "0987654321", null, "Viêm xoang", "Giáo viên"],
  ["Hoàng Văn Dũng", "M", 1964, "0911223344", null, "Đau thắt lưng", "Lái xe"],
  ["Trần Văn Minh", "M", 1976, "0908776655", "Dị ứng hải sản", "Tiểu đường", "Kế toán"],
  ["Đặng Thị Hương", "F", 1986, "0975332211", null, "Rối loạn tiêu hóa", "Nhân viên văn phòng"],
  ["Phạm Văn Lợi", "M", 1971, "0914889900", null, "Gout", "Công chức"],
  ["Ngô Thị Mai", "F", 1998, "0966123456", null, "Mất ngủ", "Nhà thiết kế"],
  ["Lê Quốc Tuấn", "M", 1959, "0902113355", null, "Tăng huyết áp", "Hưu trí"],
  ["Vũ Văn Tài", "M", 1986, "0909778811", null, null, "Kinh doanh"],
  ["Phan Thị Ngọc", "F", 1998, "0933445566", null, null, "Y tá"],
];

const COMPLAINTS: [string, string][] = [
  ["Đau vai gáy 2 tuần nay, tăng khi làm việc", "Thoái hóa cột sống cổ"],
  ["Đau lưng, mỏi gối", "Đau thần kinh tọa"],
  ["Nghẹt mũi, chảy dịch, đau đầu vùng trán", "Viêm xoang"],
  ["Đau thượng vị, ợ chua, ăn kém", "Viêm loét dạ dày"],
  ["Khó ngủ, hay tỉnh giấc, mệt mỏi", "Mất ngủ"],
  ["Sợ lạnh, hắt hơi, ho nhẹ", "Cảm mạo"],
  ["Đau khớp gối khi lên xuống cầu thang", "Thoái hóa khớp"],
  ["Đầy bụng, đại tiện lỏng, mệt", "Rối loạn tiêu hóa"],
];

const rnd = (seed: number) => { let x = seed; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };

export async function seedDemoData() {
  const staff = await requireRole("OWNER");
  const branch = await prisma.branch.findFirst({ where: { active: true }, orderBy: { createdAt: "asc" } });
  if (!branch) redirect("/quan-tri?loi=" + encodeURIComponent("Chưa có chi nhánh."));
  const exists = await prisma.patient.count({ where: { note: { startsWith: TAG } } });
  if (exists > 0) redirect("/quan-tri?loi=" + encodeURIComponent("Dữ liệu demo đã có. Xóa trước nếu muốn tạo lại."));
  const R = rnd(7);
  const day0 = vnDayStart();
  const at = (daysAgo: number, hour: number, min = 0) => {
    const t = new Date(day0.getTime() - daysAgo * DAY + (hour * 60 + min) * 60000);
    return t.getTime() > Date.now() ? new Date(Date.now() - 60000 * (5 + Math.floor(R() * 50))) : t;
  };

  // --- Mặt hàng, giá, lô, nhập xuất
  const existing = await prisma.item.findMany();
  const herbs = await prisma.herb.findMany({ select: { id: true, standardName: true } });
  const moves: Parameters<typeof prisma.stockMove.createMany>[0]["data"] & unknown[] = [];
  const itemOf = new Map<string, { id: string; name: string; unit: string; type: string; price: number }>();
  for (const [name, type, unit, price, cost, min, stock, expDays, supplier] of ITEMS) {
    let it = existing.find((x) => fold(x.name) === fold(name));
    if (!it) {
      const h = herbs.find((x) => fold(x.standardName) === fold(name));
      it = await prisma.item.create({ data: { name, type, unit, herbId: h?.id ?? null, minStock: min, note: TAG } });
    }
    const hasPrice = await prisma.itemPrice.findFirst({ where: { itemId: it.id }, orderBy: { effectiveFrom: "desc" } });
    if (!hasPrice) await prisma.itemPrice.create({ data: { itemId: it.id, price, staffName: staff.fullName } });
    const lot = await prisma.stockLot.create({
      data: { itemId: it.id, branchId: branch.id, supplier, receivedAt: new Date(Date.now() - 40 * DAY), expiryDate: new Date(Date.now() + expDays * DAY), unitCost: cost, qtyReceived: stock * 1.6, qtyRemaining: stock, note: TAG, staffName: staff.fullName },
    });
    moves.push({ itemId: it.id, branchId: branch.id, lotId: lot.id, type: "RECEIPT", qty: stock * 1.6, at: new Date(Date.now() - 40 * DAY), reason: `${TAG} Nhập kho`, staffName: staff.fullName });
    // xuất dùng rải 30 ngày để vẽ biểu đồ
    if (type === "HERB") {
      for (let d = 29; d >= 1; d -= 2) {
        const q = Math.round((stock * 0.6) / 15 * (0.4 + R()));
        moves.push({ itemId: it.id, branchId: branch.id, lotId: lot.id, type: "DISPENSE", qty: -q, at: at(d, 10 + Math.floor(R() * 6)), reason: `${TAG} Phát thuốc`, staffName: staff.fullName });
      }
    }
    const pr = hasPrice?.price ?? price;
    itemOf.set(name, { id: it.id, name: it.name, unit: it.unit, type: it.type, price: pr });
  }
  await prisma.stockMove.createMany({ data: moves });
  const herbNames = ITEMS.filter((i) => i[1] === "HERB").map((i) => i[0]);

  // --- Bệnh nhân
  const pats = PATIENTS.map(([name]) => ({ id: randomUUID(), name }));
  await prisma.patient.createMany({
    data: PATIENTS.map(([name, sex, y, phone, allergy, chronic, job], i) => ({
      id: pats[i].id, fullName: name, sex, birthYear: y, birthDate: new Date(Date.UTC(y, Math.floor(R() * 12), 1 + Math.floor(R() * 27))), phone,
      address: "Số " + (10 + Math.floor(R() * 200)) + " Đường Lê Lợi", ward: "P. Phước Trung", district: "TP. Bà Rịa", province: "Bà Rịa - Vũng Tàu",
      occupation: job, allergies: allergy, chronicConditions: chronic, pastHistory: chronic ? `Có ${chronic.toLowerCase()} nhiều năm` : null,
      weightKg: 50 + Math.floor(R() * 30), heightCm: 150 + Math.floor(R() * 28), note: `${TAG} Bệnh nhân demo, sẽ xóa khi chạy thật`, createdBy: staff.fullName,
      createdAt: new Date(Date.now() - Math.floor(R() * 25) * DAY),
    })),
  });

  const feeLine = (fee: number) => ({ kind: "FEE", itemId: null as string | null, name: "Khám và tư vấn YHCT", unit: "lần", qty: 1, unitPrice: fee, amount: fee, position: 0 });
  const herbLines = (thang: number, pick: string[]) => pick.map((n, i) => {
    const it = itemOf.get(n)!; const g = 6 + Math.floor(R() * 8); const q = g * thang;
    return { kind: "HERB", itemId: it.id, name: `${it.name} (${g} g × ${thang} thang)`, unit: it.unit, qty: q, unitPrice: it.price, amount: Math.round(q * it.price), position: i + 1 };
  });
  const methods = ["CASH", "CASH", "TRANSFER", "CASH", "CARD", "TRANSFER"];

  type VisitRow = Parameters<typeof prisma.visit.createMany>[0]["data"] extends infer T ? (T extends unknown[] ? T[number] : T) : never;
  const V: VisitRow[] = []; const E: Record<string, unknown>[] = []; const I: Record<string, unknown>[] = []; const L: Record<string, unknown>[] = [];
  const perDay = new Map<string, number>();
  const nextQ = (d: Date) => { const k = new Date(d.getTime() + 7 * 3600000).toISOString().slice(0, 10); const n = (perDay.get(k) ?? 0) + 1; perDay.set(k, n); return n; };
  const addInvoice = (vid: string, pid: string, o: { status: string; method: string | null; paidAt: Date | null; dispensedAt: Date | null; created: Date; lines: ReturnType<typeof feeLine>[] }) => {
    const id = randomUUID(); const sub = o.lines.reduce((s, l) => s + l.amount, 0);
    I.push({ id, branchId: branch.id, visitId: vid, patientId: pid, kind: "EXAM", status: o.status, subtotal: sub, total: sub, method: o.method, paidAt: o.paidAt, dispensedAt: o.dispensedAt, dispensedBy: o.dispensedAt ? staff.fullName : null, note: TAG, staffId: staff.id, staffName: staff.fullName, createdAt: o.created });
    for (const l of o.lines) L.push({ ...l, invoiceId: id });
  };

  // --- Lượt khám quá khứ (đã thu, đã phát) — dùng cho báo cáo
  for (let d = 20; d >= 1; d--) {
    const n = 2 + Math.floor(R() * 3);
    for (let k = 0; k < n; k++) {
      const pt = pats[Math.floor(R() * pats.length)];
      const [cc, dis] = COMPLAINTS[Math.floor(R() * COMPLAINTS.length)];
      const when = at(d, 8 + k * 2, Math.floor(R() * 50));
      const vid = randomUUID();
      V.push({ id: vid, patientId: pt.id, branchId: branch.id, queueNo: nextQ(when), status: "DONE", reason: cc, pulse: 70 + Math.floor(R() * 14), bloodPressure: "120/80", temperature: 36.6, createdBy: staff.fullName, createdAt: when });
      E.push({ visitId: vid, doctorId: staff.id, doctorName: staff.fullName, status: "FINAL", chiefComplaint: cc, diseaseText: dis, finalAt: when, followUpDate: R() > 0.6 ? new Date(Date.now() + Math.floor(1 + R() * 14) * DAY) : null, createdAt: when });
      const thang = [3, 5, 7, 10, 14][Math.floor(R() * 5)];
      const hasHerb = R() > 0.25;
      const lines = [feeLine(150000 + (R() > 0.7 ? 50000 : 0)), ...(hasHerb ? herbLines(thang, [...herbNames].sort(() => R() - 0.5).slice(0, 4 + Math.floor(R() * 3))) : [])];
      addInvoice(vid, pt.id, { status: "PAID", method: methods[Math.floor(R() * methods.length)], paidAt: new Date(when.getTime() + 40 * 60000), dispensedAt: hasHerb ? new Date(when.getTime() + 70 * 60000) : null, created: new Date(when.getTime() + 30 * 60000), lines });
    }
  }

  // --- Hôm nay: đủ các trạng thái
  const todayPlan: [number, string, string, string][] = [
    [0, "7:45", "DONE", "done"], [1, "8:10", "DONE", "paid_wait"], [2, "8:25", "DONE", "unpaid"], [3, "9:15", "DONE", "noinv"],
    [4, "9:30", "IN_EXAM", "draft"], [5, "10:05", "IN_EXAM", "draft"], [6, "10:20", "WAITING", "none"], [7, "10:45", "WAITING", "none"], [8, "11:10", "WAITING", "none"], [9, "11:25", "WAITING", "none"],
  ];
  const existingToday = await prisma.visit.count({ where: { branchId: branch.id, createdAt: { gte: day0 } } });
  perDay.set(new Date(day0.getTime() + 7 * 3600000 + 1000).toISOString().slice(0, 10), existingToday);
  for (const [pi, hm, status, stage] of todayPlan) {
    const [h, m] = hm.split(":").map(Number);
    const when = at(0, h, m);
    const pt = pats[pi % pats.length];
    const [cc, dis] = COMPLAINTS[pi % COMPLAINTS.length];
    const vid = randomUUID();
    V.push({ id: vid, patientId: pt.id, branchId: branch.id, queueNo: nextQ(when), status, reason: cc, pulse: 72, bloodPressure: "125/80", temperature: 36.8, createdBy: staff.fullName, createdAt: when });
    if (stage === "none") continue;
    const final = stage !== "draft";
    E.push({ visitId: vid, doctorId: staff.id, doctorName: staff.fullName, status: final ? "FINAL" : "DRAFT", chiefComplaint: cc, diseaseText: final ? dis : null, finalAt: final ? when : null, followUpDate: final ? new Date(Date.now() + 7 * DAY) : null, createdAt: when });
    if (stage === "noinv" || stage === "draft") continue;
    const paid = stage !== "unpaid";
    addInvoice(vid, pt.id, { status: paid ? "PAID" : "UNPAID", method: paid ? "CASH" : null, paidAt: paid ? new Date(when.getTime() + 35 * 60000) : null, dispensedAt: stage === "done" ? new Date(when.getTime() + 60 * 60000) : null, created: new Date(when.getTime() + 25 * 60000), lines: [feeLine(150000), ...herbLines(7, ["Đương quy", "Hoàng kỳ", "Cam thảo", "Bạch thược"])] });
  }
  await prisma.visit.createMany({ data: V });
  await prisma.exam.createMany({ data: E as never });
  await prisma.invoice.createMany({ data: I as never });
  await prisma.invoiceLine.createMany({ data: L as never });

  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: branch.id, action: "CREATE", entity: "DemoData", detail: "Tạo dữ liệu demo" });
  for (const p of ["/", "/kham", "/tiep-don", "/benh-nhan", "/thu-ngan", "/duoc", "/kho", "/bao-cao", "/quan-tri"]) revalidatePath(p);
  redirect("/quan-tri?ok=" + encodeURIComponent("Đã tạo dữ liệu demo."));
}

export async function clearDemoData() {
  const staff = await requireRole("OWNER");
  const demoPatients = await prisma.patient.findMany({ where: { note: { startsWith: TAG } }, select: { id: true } });
  const pids = demoPatients.map((p) => p.id);
  await prisma.invoice.deleteMany({ where: { OR: [{ note: { startsWith: TAG } }, { patientId: { in: pids } }] } });
  const visits = await prisma.visit.findMany({ where: { patientId: { in: pids } }, select: { id: true } });
  const vids = visits.map((v) => v.id);
  await prisma.exam.deleteMany({ where: { visitId: { in: vids } } });
  await prisma.visit.deleteMany({ where: { id: { in: vids } } });
  await prisma.patient.deleteMany({ where: { id: { in: pids } } });
  await prisma.stockMove.deleteMany({ where: { reason: { startsWith: TAG } } });
  await prisma.stockLot.deleteMany({ where: { note: TAG } });
  const items = await prisma.item.findMany({ where: { note: TAG }, select: { id: true } });
  for (const it of items) {
    try { await prisma.item.delete({ where: { id: it.id } }); } catch { /* còn dữ liệu thật tham chiếu: giữ lại */ }
  }
  await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "DELETE", entity: "DemoData", detail: "Xóa dữ liệu demo" });
  for (const p of ["/", "/kham", "/tiep-don", "/benh-nhan", "/thu-ngan", "/duoc", "/kho", "/bao-cao", "/quan-tri"]) revalidatePath(p);
  redirect("/quan-tri?ok=" + encodeURIComponent("Đã xóa dữ liệu demo."));
}
