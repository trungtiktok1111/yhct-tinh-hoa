"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireKnowledgeEditor } from "@/lib/auth";
import { getEntity } from "@/lib/entities";
import { REVIEW_STATUS_LABEL } from "@/lib/constants";
import { herbTitle } from "@/lib/viName";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}
function go(path: string, error?: string): never {
  redirect(error ? `${path}?loi=${encodeURIComponent(error)}` : path);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const model = (name: string) => (prisma as any)[name];

export async function updateEntity(formData: FormData) {
  const staff = await requireKnowledgeEditor();
  const key = str(formData, "entity") ?? "";
  const id = str(formData, "id");
  const def = getEntity(key);
  if (!def || !id) go("/");
  const editPath = `/${def.path}/${id}/sua`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};
  for (const f of def.fields) {
    const v = str(formData, f.name);
    if (f.required && !v) go(editPath, `Nhập: ${f.label}.`);
    if (f.int) {
      if (v === undefined) data[f.name] = null;
      else {
        const n = Number(v);
        if (!Number.isInteger(n)) go(editPath, `${f.label} phải là số nguyên.`);
        data[f.name] = n;
      }
    } else {
      data[f.name] = v && key === "vi-thuoc" && f.name === "standardName" ? herbTitle(v) : (v ?? null);
    }
  }
  if (def.status) {
    const st = str(formData, "status");
    if (st && st in REVIEW_STATUS_LABEL) data.status = st;
  }
  if (def.model === "formula") data.principleId = str(formData, "principleId") ?? null;
  if (def.source) data.sourceId = str(formData, "sourceId") ?? null;
  if (def.meta) {
    data.updatedBy = staff.fullName;
    data.version = { increment: 1 };
  }

  const before = await model(def.model).findUnique({ where: { id } });
  if (!before) go(`/${def.path}`, "Mục này không còn tồn tại.");
  await model(def.model).update({ where: { id }, data });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, action: "UPDATE", entity: def.model, entityId: id,
    detail: String(data[def.titleField] ?? before[def.titleField]),
  });
  revalidatePath(`/${def.path}`);
  revalidatePath(`/${def.path}/${id}`);
  redirect(def.model === "manualTherapy" ? `/${def.path}` : `/${def.path}/${id}`);
}

export async function deleteEntity(formData: FormData) {
  const staff = await requireKnowledgeEditor();
  const key = str(formData, "entity") ?? "";
  const id = str(formData, "id");
  const def = getEntity(key);
  if (!def || !id) go("/");
  const detail = def.model === "manualTherapy" ? `/${def.path}` : `/${def.path}/${id}`;
  const m = model(def.model);
  const row = await m.findUnique({ where: { id } });
  if (!row) go(`/${def.path}`);
  const title = String(row[def.titleField]);

  try {
    await prisma.$transaction(async (tx) => {
      switch (def.model) {
        case "disease":
          await tx.diseasePattern.deleteMany({ where: { diseaseId: id } });
          break;
        case "pattern":
          await tx.diseasePattern.deleteMany({ where: { patternId: id } });
          await tx.patternPrinciple.deleteMany({ where: { patternId: id } });
          break;
        case "treatmentPrinciple":
          await tx.patternPrinciple.deleteMany({ where: { principleId: id } });
          await tx.formula.updateMany({ where: { principleId: id }, data: { principleId: null } });
          await tx.pointProtocol.updateMany({ where: { principleId: id }, data: { principleId: null } });
          break;
        case "herb": {
          const n = await tx.formulaIngredient.count({ where: { herbId: id } });
          if (n > 0) throw new Error(`Vị thuốc đang nằm trong ${n} dòng thành phần của bài thuốc. Gỡ khỏi các bài thuốc trước.`);
          break;
        }
        case "formula":
          await tx.formulaIngredient.deleteMany({ where: { formulaId: id } });
          break;
        case "acupuncturePoint":
          await tx.pointProtocolItem.deleteMany({ where: { pointId: id } });
          break;
        case "source": {
          const refs =
            (await tx.disease.count({ where: { sourceId: id } })) +
            (await tx.pattern.count({ where: { sourceId: id } })) +
            (await tx.treatmentPrinciple.count({ where: { sourceId: id } })) +
            (await tx.formula.count({ where: { sourceId: id } })) +
            (await tx.herb.count({ where: { sourceId: id } })) +
            (await tx.acupuncturePoint.count({ where: { sourceId: id } })) +
            (await tx.manualTherapy.count({ where: { sourceId: id } })) +
            (await tx.theoryTopic.count({ where: { sourceId: id } })) +
            (await tx.pointProtocol.count({ where: { sourceId: id } })) +
            (await tx.claim.count({ where: { sourceId: id } }));
          if (refs > 0) throw new Error(`Tài liệu này đang được ${refs} mục tri thức dùng làm nguồn. Gỡ nguồn ở các mục đó trước.`);
          break;
        }
        default:
          break;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (tx as any)[def.model].delete({ where: { id } });
    });
  } catch (e) {
    go(detail, e instanceof Error ? e.message : "Không xóa được.");
  }
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, action: "DELETE", entity: def.model, entityId: id, detail: title,
  });
  revalidatePath(`/${def.path}`);
  redirect(`/${def.path}`);
}

// ---------- Gỡ liên kết / sửa thành phần ----------

export async function unlinkDiseasePattern(formData: FormData) {
  const staff = await requireKnowledgeEditor();
  const id = str(formData, "linkId");
  if (!id) return;
  const l = await prisma.diseasePattern.delete({ where: { id } }).catch(() => null);
  if (l) {
    await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "UNLINK", entity: "DiseasePattern", entityId: id });
    revalidatePath(`/benh-hoc/${l.diseaseId}`);
    revalidatePath(`/chung-hau/${l.patternId}`);
  }
}

export async function unlinkPatternPrinciple(formData: FormData) {
  const staff = await requireKnowledgeEditor();
  const id = str(formData, "linkId");
  if (!id) return;
  const l = await prisma.patternPrinciple.delete({ where: { id } }).catch(() => null);
  if (l) {
    await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "UNLINK", entity: "PatternPrinciple", entityId: id });
    revalidatePath(`/chung-hau/${l.patternId}`);
    revalidatePath(`/phap-tri/${l.principleId}`);
  }
}

export async function removeFormulaIngredient(formData: FormData) {
  const staff = await requireKnowledgeEditor();
  const id = str(formData, "ingredientId");
  if (!id) return;
  const l = await prisma.formulaIngredient.delete({ where: { id } }).catch(() => null);
  if (l) {
    await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "DELETE", entity: "FormulaIngredient", entityId: id });
    revalidatePath(`/bai-thuoc/${l.formulaId}`);
    revalidatePath(`/vi-thuoc/${l.herbId}`);
  }
}

export async function updateFormulaIngredient(formData: FormData) {
  const staff = await requireKnowledgeEditor();
  const id = str(formData, "ingredientId");
  if (!id) return;
  const l = await prisma.formulaIngredient.update({
    where: { id },
    data: {
      amount: str(formData, "amount") ?? null,
      unit: str(formData, "unit") ?? null,
      role: str(formData, "role") ?? null,
      preparation: str(formData, "preparation") ?? null,
      note: str(formData, "note") ?? null,
    },
  }).catch(() => null);
  if (l) {
    await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "UPDATE", entity: "FormulaIngredient", entityId: id });
    revalidatePath(`/bai-thuoc/${l.formulaId}`);
  }
}
