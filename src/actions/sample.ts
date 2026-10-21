"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nextItemCode } from "@/lib/stock";
import { logAudit, requireRole } from "@/lib/auth";
import { EXAM_ROLES } from "@/lib/permissions";
import { fold } from "@/lib/fold";
import { vnDayStart } from "@/lib/format";
import { SAMPLE_NAME, SAMPLE_TEXT, buildSampleTuChan } from "@/lib/sampleCase";

const DAY = 86400000;

// [tên cần tìm (có thể nhiều cách gọi), tên tạo mới, gam mỗi thang, giá đồng/gam, ghi chú trong đơn]
const HERBS: [string[], string, number, number, string][] = [
  [["Ma hoàng"], "Ma hoàng", 9, 600, "Quân. Sắc trước, vớt bọt"],
  [["Quế chi"], "Quế chi", 6, 300, "Thần"],
  [["Hạnh nhân"], "Hạnh nhân", 9, 700, "Tá. Đập dập"],
  [["Cam thảo (chích)", "Cam thảo", "Chích cam thảo"], "Cam thảo (chích)", 3, 400, "Sứ"],
];

export async function createSampleCase() {
  const staff = await requireRole(...EXAM_ROLES);
  const branches = staff.isOwner
    ? await prisma.branch.findMany({ where: { active: true }, orderBy: { createdAt: "asc" } })
    : await prisma.branch.findMany({ where: { id: { in: staff.branchIds }, active: true }, orderBy: { createdAt: "asc" } });
  const branch = branches[0];
  if (!branch) redirect("/kham?loi=" + encodeURIComponent("Chưa có chi nhánh để tạo ca mẫu."));

  const old = await prisma.patient.findFirst({ where: { fullName: SAMPLE_NAME }, include: { visits: { orderBy: { createdAt: "desc" }, take: 1 } } });
  if (old?.visits[0]) redirect(`/kham/${old.visits[0].id}`);

  const tuChanData = buildSampleTuChan();
  const now = new Date();

  // Mặt hàng, giá, tồn kho cho 4 vị (chỉ tạo phần còn thiếu).
  const items = await prisma.item.findMany({ where: { type: "HERB" } });
  const herbs = await prisma.herb.findMany({ select: { id: true, standardName: true } });
  const lines: { itemId: string; name: string; unit: string; qty: number; note: string }[] = [];
  for (const [names, createName, qty, price, note] of HERBS) {
    const keys = names.map(fold);
    let item = items.find((i) => keys.includes(fold(i.name)));
    if (!item) {
      const h = herbs.find((x) => keys.includes(fold(x.standardName)));
      item = await prisma.item.create({
        data: { code: await nextItemCode("HERB"), name: createName, type: "HERB", unit: "g", herbId: h?.id ?? null, minStock: 200, note: "Tạo cùng ca mẫu" },
      });
    }
    const hasPrice = await prisma.itemPrice.findFirst({ where: { itemId: item.id } });
    if (!hasPrice) await prisma.itemPrice.create({ data: { itemId: item.id, price, staffName: staff.fullName } });
    const lot = await prisma.stockLot.findFirst({ where: { itemId: item.id, branchId: branch.id, qtyRemaining: { gt: 0 } } });
    if (!lot) {
      const l = await prisma.stockLot.create({
        data: {
          itemId: item.id, branchId: branch.id, supplier: "Nhập mẫu", expiryDate: new Date(now.getTime() + 365 * DAY),
          unitCost: Math.round(price * 0.6), qtyReceived: 2000, qtyRemaining: 2000, note: "Tạo cùng ca mẫu", staffName: staff.fullName,
        },
      });
      await prisma.stockMove.create({
        data: { itemId: item.id, branchId: branch.id, lotId: l.id, type: "RECEIPT", qty: 2000, reason: "Nhập mẫu cho ca mẫu", staffName: staff.fullName },
      });
    }
    lines.push({ itemId: item.id, name: item.name, unit: item.unit, qty, note });
  }

  // Tri thức liên kết (nếu có trong dữ liệu).
  const [disease, pattern, principle] = await Promise.all([
    prisma.disease.findFirst({ where: { name: { contains: "Cảm mạo", mode: "insensitive" } }, select: { id: true, name: true } }),
    prisma.pattern.findFirst({ where: { name: { contains: "thương hàn", mode: "insensitive" } }, select: { id: true, name: true } }),
    prisma.treatmentPrinciple.findFirst({ where: { name: { contains: "Tân ôn giải biểu", mode: "insensitive" } }, select: { id: true, name: true } }),
  ]);
  const pts = await prisma.acupuncturePoint.findMany({ where: { code: { in: ["GB20", "LI4"] } } });
  const pt = (code: string, fallback: string) => {
    const p = pts.find((x) => x.code === code);
    return { pointId: p?.id ?? null, label: p ? `${p.code} — ${p.standardName}` : fallback };
  };

  const dayStart = vnDayStart();
  const count = await prisma.visit.count({ where: { branchId: branch.id, createdAt: { gte: dayStart } } });
  const patient = await prisma.patient.create({
    data: {
      fullName: SAMPLE_NAME, birthDate: new Date(Date.UTC(1980, 4, 12)), birthYear: 1980, sex: "M", phone: "0900000000",
      ethnicity: "Kinh", nationality: "Việt Nam", occupation: "Nhân viên văn phòng", bloodType: "O",
      address: "12 Đường Mẫu", ward: "Phường Mẫu", district: "Quận Mẫu", province: "TP. Hồ Chí Minh",
      emergencyName: "Lê Thị Mẫu", emergencyRelation: "Vợ", emergencyPhone: "0900000001",
      weightKg: 68, heightCm: 168,
      pastHistory: "Viêm mũi dị ứng theo mùa. Chưa phẫu thuật.", familyHistory: "Cha tăng huyết áp.",
      allergies: "Chưa ghi nhận dị ứng thuốc", chronicConditions: "Không",
      note: "ĐÂY LÀ CA MẪU để hướng dẫn nhân viên. Không phải bệnh nhân thật.", createdBy: staff.fullName,
    },
  });
  const visit = await prisma.visit.create({
    data: {
      patientId: patient.id, branchId: branch.id, queueNo: count + 1, status: "DONE", reason: SAMPLE_TEXT.chiefComplaint,
      weightKg: 68, heightCm: 168, pulse: 78, bloodPressure: "120/80", temperature: 37.6, createdBy: staff.fullName,
    },
  });
  const exam = await prisma.exam.create({
    data: {
      visitId: visit.id, doctorId: staff.id, doctorName: staff.fullName, status: "FINAL", finalAt: now,
      chiefComplaint: SAMPLE_TEXT.chiefComplaint, presentHistory: SAMPLE_TEXT.presentHistory,
      inspection: SAMPLE_TEXT.inspection, listening: SAMPLE_TEXT.listening, inquiry: SAMPLE_TEXT.inquiry, palpation: SAMPLE_TEXT.palpation,
      modernDiagnosis: SAMPLE_TEXT.modernDiagnosis, tuChanData,
      exteriorInterior: "BIEU", coldHeat: "HAN", deficiencyExcess: "THUC", eightMethods: "Hãn",
      diseaseId: disease?.id ?? null, diseaseText: disease?.name ?? "Cảm mạo",
      patternId: pattern?.id ?? null, patternText: pattern?.name ?? "Thái dương thương hàn (biểu thực)",
      principleId: principle?.id ?? null, principleText: principle?.name ?? "Tân ôn giải biểu",
      advice: SAMPLE_TEXT.advice, followUpDate: new Date(now.getTime() + 3 * DAY),
      points: {
        create: [
          { ...pt("GB20", "GB20 — Phong trì"), note: "Châm tả, giải biểu, trị đau gáy" },
          { ...pt("LI4", "LI4 — Hợp cốc"), note: "Châm tả, phối hợp giải biểu" },
          { pointId: null, label: "Kiên tỉnh (GB21) và điểm A thị cơ thang", note: "Ấn, day giải cơ" },
        ],
      },
      therapies: { create: [{ label: "Xoa bóp vùng cổ vai gáy", note: "10 phút, tay thủ pháp ấn, day, bóp; làm ấm trước khi xoa" }] },
      prescription: {
        create: {
          thangCount: 3,
          decoctionNote: "Sắc Ma hoàng trước 10 phút, vớt bọt, cho các vị còn lại vào sắc. Uống ấm, ngày 1 thang chia 2 lần. Ra mồ hôi thì ngưng.",
          lines: {
            create: lines.map((l, i) => ({ kind: "HERB", itemId: l.itemId, itemName: l.name, unit: l.unit, qty: l.qty, note: l.note, position: i })),
          },
        },
      },
    },
  });

  // Hóa đơn chưa thanh toán để thu ngân và dược tập làm theo.
  const prices = await prisma.itemPrice.findMany({ where: { itemId: { in: lines.map((l) => l.itemId) } }, orderBy: { effectiveFrom: "desc" } });
  const price = (id: string) => prices.find((p) => p.itemId === id)?.price ?? 0;
  const FEE = 150000;
  const data = [{ kind: "FEE", itemId: null as string | null, name: "Công khám", unit: "lần", qty: 1, unitPrice: FEE, amount: FEE, position: 0 }];
  lines.forEach((l, i) => {
    const q = l.qty * 3;
    data.push({ kind: "HERB", itemId: l.itemId, name: `${l.name} (${l.qty} ${l.unit} × 3 thang)`, unit: l.unit, qty: q, unitPrice: price(l.itemId), amount: Math.round(q * price(l.itemId)), position: i + 1 });
  });
  const subtotal = data.reduce((s, d) => s + d.amount, 0);
  await prisma.invoice.create({
    data: {
      branchId: branch.id, visitId: visit.id, patientId: patient.id, kind: "EXAM", subtotal, total: subtotal,
      note: "Hóa đơn ca mẫu: để thu ngân và dược thực hành", staffId: staff.id, staffName: staff.fullName, lines: { create: data },
    },
  });
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: branch.id, action: "CREATE", entity: "SampleCase", entityId: exam.id, detail: "Tạo ca mẫu" });
  revalidatePath("/kham");
  revalidatePath("/benh-nhan");
  revalidatePath("/thu-ngan");
  redirect(`/kham/${visit.id}`);
}
