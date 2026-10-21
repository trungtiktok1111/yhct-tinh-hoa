"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole, type CurrentStaff } from "@/lib/auth";
import { EXAM_ROLES } from "@/lib/permissions";
import { parseDate } from "@/lib/person";
import { parseAmount } from "@/lib/exam";
import { fold } from "@/lib/fold";
import { parseTuChanForm } from "@/lib/tuchan";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}
function num(fd: FormData, key: string): number | undefined {
  const t = str(fd, key);
  if (!t) return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
function to(visitId: string, anchor?: string, error?: string): never {
  const q = error ? `?loi=${encodeURIComponent(error)}` : "";
  redirect(`/kham/${visitId}${q}${anchor ? `#${anchor}` : ""}`);
}

// Lấy lượt khám + bệnh án, kiểm tra quyền chi nhánh và trạng thái chưa hoàn tất.
async function loadExam(staff: CurrentStaff, visitId: string | undefined, opts: { allowFinal?: boolean } = {}) {
  if (!visitId) redirect("/kham");
  const visit = await prisma.visit.findUnique({ where: { id: visitId }, include: { exam: true } });
  if (!visit) redirect("/kham");
  if (!staff.isOwner && !staff.branchIds.includes(visit.branchId)) redirect("/khong-co-quyen");
  if (!visit.exam) to(visit.id, undefined, "Chưa bắt đầu khám lượt này.");
  if (!opts.allowFinal && visit.exam.status === "FINAL") to(visit.id, undefined, "Bệnh án đã hoàn tất. Bấm “Mở lại để sửa” nếu cần chỉnh.");
  return { visit, exam: visit.exam };
}

export async function startExam(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const visitId = str(formData, "visitId");
  if (!visitId) redirect("/kham");
  const visit = await prisma.visit.findUnique({ where: { id: visitId }, include: { exam: true } });
  if (!visit) redirect("/kham");
  if (!staff.isOwner && !staff.branchIds.includes(visit.branchId)) redirect("/khong-co-quyen");
  if (visit.status === "CANCELLED") redirect("/kham?loi=" + encodeURIComponent("Lượt khám đã hủy."));
  if (!visit.exam) {
    await prisma.$transaction([
      prisma.exam.create({
        data: { visitId, doctorId: staff.id, doctorName: staff.fullName, chiefComplaint: visit.reason },
      }),
      prisma.visit.update({ where: { id: visitId }, data: { status: "IN_EXAM" } }),
    ]);
    await logAudit({
      staffId: staff.id, staffName: staff.fullName, branchId: visit.branchId, action: "START", entity: "Exam", entityId: visitId,
    });
  } else if (visit.status === "WAITING") {
    await prisma.visit.update({ where: { id: visitId }, data: { status: "IN_EXAM" } });
  }
  revalidatePath("/kham");
  revalidatePath("/tiep-don");
  redirect(`/kham/${visitId}`);
}

export async function saveFindings(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  await prisma.exam.update({
    where: { id: exam.id },
    data: {
      chiefComplaint: str(formData, "chiefComplaint") ?? null,
      presentHistory: str(formData, "presentHistory") ?? null,
      inspection: str(formData, "inspection") ?? null,
      listening: str(formData, "listening") ?? null,
      inquiry: str(formData, "inquiry") ?? null,
      palpation: str(formData, "palpation") ?? null,
      modernDiagnosis: str(formData, "modernDiagnosis") ?? null,
      tuChanData: parseTuChanForm(formData),
    },
  });
  to(visit.id, "tong-hop");
}

export async function saveDiagnosis(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const pick = (name: string, allowed: string[]) => {
    const v = str(formData, name);
    return v && allowed.includes(v) ? v : null;
  };
  const diseaseId = str(formData, "diseaseId") ?? null;
  const patternId = str(formData, "patternId") ?? null;
  const principleId = str(formData, "principleId") ?? null;
  const [d, p, t] = await Promise.all([
    diseaseId ? prisma.disease.findUnique({ where: { id: diseaseId }, select: { name: true } }) : null,
    patternId ? prisma.pattern.findUnique({ where: { id: patternId }, select: { name: true } }) : null,
    principleId ? prisma.treatmentPrinciple.findUnique({ where: { id: principleId }, select: { name: true } }) : null,
  ]);
  const methods = formData.getAll("eightMethods").map(String).filter((m) => ["Hãn", "Thổ", "Hạ", "Hòa", "Thanh", "Ôn", "Bổ", "Tiêu"].includes(m));
  await prisma.exam.update({
    where: { id: exam.id },
    data: {
      exteriorInterior: pick("exteriorInterior", ["BIEU", "LY"]),
      coldHeat: pick("coldHeat", ["HAN", "NHIET"]),
      deficiencyExcess: pick("deficiencyExcess", ["HU", "THUC"]),
      yinYang: pick("yinYang", ["AM", "DUONG"]),
      eightMethods: methods.length ? methods.join(",") : null,
      diseaseId: d ? diseaseId : null,
      diseaseText: str(formData, "diseaseText") ?? d?.name ?? null,
      patternId: p ? patternId : null,
      patternText: str(formData, "patternText") ?? p?.name ?? null,
      principleId: t ? principleId : null,
      principleText: str(formData, "principleText") ?? t?.name ?? null,
    },
  });
  to(visit.id, "bai-thuoc");
}

// Chọn nhanh từ phần gợi ý.
export async function chooseSuggestion(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const kind = str(formData, "kind");
  const id = str(formData, "id");
  if (!id) to(visit.id, "goi-y");
  if (kind === "pattern") {
    const p = await prisma.pattern.findUnique({ where: { id }, select: { name: true } });
    if (p) await prisma.exam.update({ where: { id: exam.id }, data: { patternId: id, patternText: p.name } });
  } else if (kind === "principle") {
    const t = await prisma.treatmentPrinciple.findUnique({ where: { id }, select: { name: true } });
    if (t) await prisma.exam.update({ where: { id: exam.id }, data: { principleId: id, principleText: t.name } });
  } else if (kind === "disease") {
    const d = await prisma.disease.findUnique({ where: { id }, select: { name: true } });
    if (d) await prisma.exam.update({ where: { id: exam.id }, data: { diseaseId: id, diseaseText: d.name } });
  }
  to(visit.id, "chan-doan");
}

// ---------- Đơn thuốc ----------

async function ensurePrescription(examId: string) {
  return prisma.prescription.upsert({ where: { examId }, update: {}, create: { examId } });
}

export async function addFormulaToPrescription(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const formulaId = str(formData, "formulaId");
  if (!formulaId) to(visit.id, "bai-thuoc");
  const formula = await prisma.formula.findUnique({
    where: { id: formulaId },
    include: { ingredients: { include: { herb: { select: { id: true, standardName: true } } } } },
  });
  if (!formula) to(visit.id, "bai-thuoc", "Không tìm thấy bài thuốc.");
  const items = await prisma.item.findMany({ where: { active: true, type: "HERB" } });
  const byHerb = new Map(items.filter((i) => i.herbId).map((i) => [i.herbId as string, i]));
  const byName = new Map(items.map((i) => [fold(i.name), i]));
  const rx = await ensurePrescription(exam.id);
  const existing = await prisma.prescriptionLine.findMany({ where: { prescriptionId: rx.id } });
  const have = new Set(existing.map((l) => l.itemId));
  let position = existing.length;
  const missing: string[] = [];
  const toCreate = [];
  for (const ing of formula.ingredients) {
    const item = byHerb.get(ing.herb.id) ?? byName.get(fold(ing.herb.standardName));
    if (!item) { missing.push(ing.herb.standardName); continue; }
    if (have.has(item.id)) continue;
    have.add(item.id);
    const { qty, unitNote } = parseAmount(ing.amount, ing.unit);
    toCreate.push({
      prescriptionId: rx.id, kind: "HERB", itemId: item.id, itemName: item.name, unit: item.unit,
      qty: qty ?? 0,
      note: [ing.preparation, ing.role && `(${ing.role})`, unitNote, qty === null ? "chưa có liều, bác sĩ nhập" : null]
        .filter(Boolean).join(" · ") || null,
      position: position++,
    });
  }
  if (toCreate.length) await prisma.prescriptionLine.createMany({ data: toCreate });
  if (rx.thangCount === 0) await prisma.prescription.update({ where: { id: rx.id }, data: { thangCount: 1 } });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId: visit.branchId, action: "RX_FROM_FORMULA", entity: "Exam", entityId: exam.id,
    detail: `${formula.name}: +${toCreate.length}${missing.length ? `, thiếu trong kho: ${missing.join(", ")}` : ""}`,
  });
  const msg = missing.length
    ? `Đã thêm ${toCreate.length} vị. Chưa có trong danh mục kho nên chưa thêm được: ${missing.join(", ")}. Nhờ quản lý thêm vào “Mặt hàng và giá”.`
    : undefined;
  to(visit.id, "don-thuoc", msg);
}

export async function savePrescriptionMeta(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const thang = num(formData, "thangCount");
  if (thang !== undefined && (!Number.isInteger(thang) || thang < 0 || thang > 60)) to(visit.id, "don-thuoc", "Số thang phải là số nguyên từ 0 đến 60.");
  const rx = await ensurePrescription(exam.id);
  await prisma.prescription.update({
    where: { id: rx.id },
    data: { thangCount: thang ?? 0, decoctionNote: str(formData, "decoctionNote") ?? null },
  });
  to(visit.id, "don-thuoc");
}

export async function addPrescriptionLine(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const itemId = str(formData, "itemId");
  const qty = num(formData, "qty");
  if (!itemId) to(visit.id, "don-thuoc", "Chọn thuốc.");
  if (qty === undefined || Number.isNaN(qty) || qty <= 0) to(visit.id, "don-thuoc", "Số lượng phải lớn hơn 0.");
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || !item.active) to(visit.id, "don-thuoc", "Thuốc không có trong danh mục hoặc đã ngừng.");
  const rx = await ensurePrescription(exam.id);
  const dup = await prisma.prescriptionLine.findFirst({ where: { prescriptionId: rx.id, itemId } });
  if (dup) to(visit.id, "don-thuoc", `“${item.name}” đã có trong đơn. Sửa số lượng ở dòng đó.`);
  const count = await prisma.prescriptionLine.count({ where: { prescriptionId: rx.id } });
  await prisma.prescriptionLine.create({
    data: {
      prescriptionId: rx.id, kind: item.type === "HERB" ? "HERB" : "PRODUCT", itemId, itemName: item.name,
      unit: item.unit, qty, usage: str(formData, "usage") ?? null, note: str(formData, "note") ?? null, position: count,
    },
  });
  if (item.type === "HERB" && rx.thangCount === 0) await prisma.prescription.update({ where: { id: rx.id }, data: { thangCount: 1 } });
  to(visit.id, "don-thuoc");
}

export async function updatePrescriptionLine(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit } = await loadExam(staff, str(formData, "visitId"));
  const id = str(formData, "lineId");
  const qty = num(formData, "qty");
  if (!id) to(visit.id, "don-thuoc");
  if (qty === undefined || Number.isNaN(qty) || qty <= 0) to(visit.id, "don-thuoc", "Số lượng phải lớn hơn 0.");
  await prisma.prescriptionLine.updateMany({
    where: { id, prescription: { exam: { visitId: visit.id } } },
    data: { qty, usage: str(formData, "usage") ?? null, note: str(formData, "note") ?? null },
  });
  to(visit.id, "don-thuoc");
}

export async function removePrescriptionLine(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit } = await loadExam(staff, str(formData, "visitId"));
  const id = str(formData, "lineId");
  if (id) await prisma.prescriptionLine.deleteMany({ where: { id, prescription: { exam: { visitId: visit.id } } } });
  to(visit.id, "don-thuoc");
}

// ---------- Châm cứu / xoa bóp ----------

export async function addExamPoint(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const text = str(formData, "point");
  if (!text) to(visit.id, "cham-cuu");
  const code = text.split(/\s*[—–-]\s*/)[0].trim();
  const point = await prisma.acupuncturePoint.findFirst({
    where: { OR: [{ code: { equals: code, mode: "insensitive" } }, { standardName: { equals: text, mode: "insensitive" } }] },
  });
  await prisma.examPoint.create({
    data: {
      examId: exam.id, pointId: point?.id ?? null,
      label: point ? `${point.code} — ${point.standardName}` : text, note: str(formData, "note") ?? null,
    },
  });
  to(visit.id, "cham-cuu");
}

export async function removeExamPoint(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const id = str(formData, "id");
  if (id) await prisma.examPoint.deleteMany({ where: { id, examId: exam.id } });
  to(visit.id, "cham-cuu");
}

export async function addExamTherapy(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const text = str(formData, "therapy");
  if (!text) to(visit.id, "cham-cuu");
  const th = await prisma.manualTherapy.findFirst({ where: { name: { equals: text, mode: "insensitive" } } });
  await prisma.examTherapy.create({
    data: { examId: exam.id, therapyId: th?.id ?? null, label: th?.name ?? text, note: str(formData, "note") ?? null },
  });
  to(visit.id, "cham-cuu");
}

export async function removeExamTherapy(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const id = str(formData, "id");
  if (id) await prisma.examTherapy.deleteMany({ where: { id, examId: exam.id } });
  to(visit.id, "cham-cuu");
}

// ---------- Hoàn tất ----------

export async function finishExam(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"));
  const fu = parseDate(str(formData, "followUpDate"), { allowFuture: true });
  if (fu === null) to(visit.id, "hoan-tat", "Ngày tái khám không hợp lệ.");
  const advice = str(formData, "advice") ?? null;
  const fresh = await prisma.exam.findUnique({ where: { id: exam.id }, include: { prescription: { include: { lines: true } } } });
  if (!fresh) to(visit.id, undefined, "Không tìm thấy bệnh án.");
  if (!fresh.modernDiagnosis && !fresh.diseaseText && !fresh.patternText)
    to(visit.id, "chan-doan", "Cần ghi chẩn đoán (bệnh danh, chứng hậu hoặc chẩn đoán YHHĐ) trước khi hoàn tất.");
  const rx = fresh.prescription;
  if (rx && rx.lines.some((l) => l.kind === "HERB") && rx.thangCount < 1)
    to(visit.id, "don-thuoc", "Đơn có thuốc sắc thì số thang phải từ 1 trở lên.");
  if (rx && rx.lines.some((l) => l.qty <= 0)) to(visit.id, "don-thuoc", "Còn dòng thuốc chưa có số lượng. Hãy nhập liều.");
  await prisma.$transaction([
    prisma.exam.update({
      where: { id: exam.id },
      data: { status: "FINAL", finalAt: new Date(), advice, followUpDate: fu ?? null },
    }),
    prisma.visit.update({ where: { id: visit.id }, data: { status: "DONE" } }),
  ]);
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId: visit.branchId, action: "FINISH", entity: "Exam", entityId: exam.id,
  });
  revalidatePath("/kham");
  revalidatePath("/tiep-don");
  to(visit.id);
}

export async function reopenExam(formData: FormData) {
  const staff = await requireRole(...EXAM_ROLES);
  const { visit, exam } = await loadExam(staff, str(formData, "visitId"), { allowFinal: true });
  await prisma.$transaction([
    prisma.exam.update({ where: { id: exam.id }, data: { status: "DRAFT", finalAt: null } }),
    prisma.visit.update({ where: { id: visit.id }, data: { status: "IN_EXAM" } }),
  ]);
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId: visit.branchId, action: "REOPEN", entity: "Exam", entityId: exam.id,
  });
  revalidatePath("/kham");
  to(visit.id);
}
