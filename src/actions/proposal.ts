"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { EXAM_ROLES } from "@/lib/permissions";
import { fold } from "@/lib/fold";
import { ruleByKey } from "@/lib/proposal";

const DAY = 86400000;

// Áp dụng đề xuất của hệ thống vào bệnh án nháp. Bác sĩ vẫn sửa tự do sau đó.
export async function applyProposal(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const visitId = String(formData.get("visitId") ?? "");
  const key = String(formData.get("key") ?? "");
  const rule = ruleByKey(key);
  const visit = visitId ? await prisma.visit.findUnique({ where: { id: visitId }, include: { exam: true } }) : null;
  if (!visit || !rule) redirect("/kham");
  if (!staff.isOwner && !staff.branchIds.includes(visit.branchId)) redirect("/khong-co-quyen");
  const exam = visit.exam;
  const back = (msg?: string): never => redirect(`/kham/${visit.id}${msg ? `?loi=${encodeURIComponent(msg)}` : ""}#chan-doan`);
  if (!exam) back("Chưa bắt đầu khám lượt này.");
  if (exam!.status === "FINAL") back("Bệnh án đã hoàn tất. Bấm “Mở lại để sửa” trước khi áp dụng đề xuất.");

  const [disease, pattern, principle] = await Promise.all([
    prisma.disease.findFirst({ where: { name: { contains: rule!.disease.split(" (")[0], mode: "insensitive" } }, select: { id: true, name: true } }),
    prisma.pattern.findFirst({ where: { name: { contains: rule!.pattern.split(" (")[0], mode: "insensitive" } }, select: { id: true, name: true } }),
    prisma.treatmentPrinciple.findFirst({ where: { name: { contains: rule!.principle.split(",")[0], mode: "insensitive" } }, select: { id: true, name: true } }),
  ]);
  const e = exam!;
  await prisma.exam.update({
    where: { id: e.id },
    data: {
      exteriorInterior: rule!.cuong.exteriorInterior ?? null, coldHeat: rule!.cuong.coldHeat ?? null,
      deficiencyExcess: rule!.cuong.deficiencyExcess ?? null, yinYang: rule!.cuong.yinYang ?? null,
      eightMethods: rule!.methods.join(","),
      diseaseId: disease?.id ?? null, diseaseText: disease?.name ?? rule!.disease,
      patternId: pattern?.id ?? null, patternText: pattern?.name ?? rule!.pattern,
      principleId: principle?.id ?? null, principleText: principle?.name ?? rule!.principle,
      advice: e.advice?.trim() ? e.advice : rule!.advice,
      followUpDate: e.followUpDate ?? new Date(Date.now() + rule!.followUpDays * DAY),
    },
  });

  // Đơn thuốc: chỉ thêm vị chưa có, vị nào chưa có trong kho thì báo.
  const items = await prisma.item.findMany({ where: { active: true, type: "HERB" } });
  const byName = new Map(items.map((i) => [fold(i.name), i]));
  const rx = await prisma.prescription.upsert({ where: { examId: e.id }, update: {}, create: { examId: e.id } });
  const existing = await prisma.prescriptionLine.findMany({ where: { prescriptionId: rx.id } });
  const have = new Set(existing.map((l) => l.itemId));
  let pos = existing.length;
  const missing: string[] = [];
  const create = [];
  for (const h of rule!.herbs) {
    const item = [h.n, ...(h.alt ?? [])].map((n) => byName.get(fold(n))).find(Boolean);
    if (!item) { missing.push(h.n); continue; }
    if (have.has(item.id)) continue;
    have.add(item.id);
    create.push({ prescriptionId: rx.id, kind: "HERB", itemId: item.id, itemName: item.name, unit: item.unit, qty: h.g, note: h.note ?? null, position: pos++ });
  }
  if (create.length) await prisma.prescriptionLine.createMany({ data: create });
  await prisma.prescription.update({
    where: { id: rx.id },
    data: {
      thangCount: rx.thangCount > 0 ? rx.thangCount : rule!.thang,
      decoctionNote: rx.decoctionNote?.trim() ? rx.decoctionNote : [rule!.decoction, rule!.modifications && `Gia giảm tham khảo: ${rule!.modifications}`].filter(Boolean).join(" "),
    },
  });

  // Huyệt và xoa bóp: bỏ qua mục đã có.
  const pts = await prisma.examPoint.findMany({ where: { examId: e.id } });
  const ths = await prisma.examTherapy.findMany({ where: { examId: e.id } });
  const ptHave = new Set(pts.map((x) => fold(x.label)));
  const thHave = new Set(ths.map((x) => fold(x.label)));
  for (const [label, note] of rule!.points) {
    if (ptHave.has(fold(label))) continue;
    const code = label.split(/\s*[—–-]\s*/)[0].trim();
    const point = /^[A-Z]{2}\d+$/.test(code) ? await prisma.acupuncturePoint.findFirst({ where: { code: { equals: code, mode: "insensitive" } } }) : null;
    await prisma.examPoint.create({ data: { examId: e.id, pointId: point?.id ?? null, label: point ? `${point.code} — ${point.standardName}` : label, note } });
  }
  for (const [label, note] of rule!.therapy) {
    if (thHave.has(fold(label))) continue;
    await prisma.examTherapy.create({ data: { examId: e.id, therapyId: null, label, note } });
  }
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId: visit.branchId, action: "APPLY_PROPOSAL", entity: "Exam", entityId: e.id,
    detail: `${rule!.pattern}: +${create.length} vị${missing.length ? `, thiếu kho: ${missing.join(", ")}` : ""}`,
  });
  back(
    missing.length
      ? `Đã áp dụng đề xuất “${rule!.pattern}”. Chưa có trong kho nên chưa thêm được: ${missing.join(", ")}. Nhờ quản lý thêm vào “Mặt hàng và giá”, hoặc bác sĩ chọn thuốc khác.`
      : undefined,
  );
}
