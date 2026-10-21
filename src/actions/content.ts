"use server";

import { prisma } from "@/lib/db";
import { requireKnowledgeEditor } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

async function resolveSourceId(fd: FormData): Promise<string | undefined> {
  const existing = str(fd, "sourceId");
  if (existing) return existing;
  const title = str(fd, "newSourceTitle");
  if (!title) return undefined;
  const source = await prisma.source.create({
    data: {
      title,
      sourceType: str(fd, "newSourceType") ?? "Khác",
      authorOrOrg: str(fd, "newSourceAuthor"),
      year: fd.get("newSourceYear") ? Number(fd.get("newSourceYear")) : undefined,
      version: str(fd, "newSourceVersion"),
      locator: str(fd, "newSourceLocator"),
    },
  });
  return source.id;
}

export async function createDisease(formData: FormData) {
  await requireKnowledgeEditor();
  const sourceId = await resolveSourceId(formData);
  const d = await prisma.disease.create({
    data: {
      name: str(formData, "name") ?? "Chưa đặt tên",
      aliases: str(formData, "aliases"),
      nameModern: str(formData, "nameModern"),
      definition: str(formData, "definition"),
      category: str(formData, "category"),
      cause: str(formData, "cause"),
      mechanism: str(formData, "mechanism"),
      symptoms: str(formData, "symptoms"),
      differential: str(formData, "differential"),
      warnings: str(formData, "warnings"),
      status: str(formData, "status") ?? "DRAFT",
      sourceId,
    },
  });
  revalidatePath("/benh-hoc");
  redirect(`/benh-hoc/${d.id}`);
}

export async function createPattern(formData: FormData) {
  await requireKnowledgeEditor();
  const sourceId = await resolveSourceId(formData);
  const p = await prisma.pattern.create({
    data: {
      name: str(formData, "name") ?? "Chưa đặt tên",
      description: str(formData, "description"),
      supportCriteria: str(formData, "supportCriteria"),
      againstCriteria: str(formData, "againstCriteria"),
      keySigns: str(formData, "keySigns"),
      missingDataPrompts: str(formData, "missingDataPrompts"),
      status: str(formData, "status") ?? "DRAFT",
      sourceId,
    },
  });
  revalidatePath("/chung-hau");
  redirect(`/chung-hau/${p.id}`);
}

export async function linkDiseasePattern(formData: FormData) {
  await requireKnowledgeEditor();
  const diseaseId = str(formData, "diseaseId");
  const patternId = str(formData, "patternId");
  const relation = str(formData, "relation") ?? "có thể gặp";
  if (!diseaseId || !patternId) return;
  await prisma.diseasePattern.upsert({
    where: { diseaseId_patternId_relation: { diseaseId, patternId, relation } },
    update: { rationale: str(formData, "rationale") },
    create: {
      diseaseId,
      patternId,
      relation,
      rationale: str(formData, "rationale"),
    },
  });
  revalidatePath(`/benh-hoc/${diseaseId}`);
  revalidatePath(`/chung-hau/${patternId}`);
}

export async function createPrinciple(formData: FormData) {
  await requireKnowledgeEditor();
  const sourceId = await resolveSourceId(formData);
  const t = await prisma.treatmentPrinciple.create({
    data: {
      name: str(formData, "name") ?? "Chưa đặt tên",
      aliases: str(formData, "aliases"),
      description: str(formData, "description"),
      goal: str(formData, "goal"),
      scope: str(formData, "scope"),
      limitations: str(formData, "limitations"),
      status: str(formData, "status") ?? "DRAFT",
      sourceId,
    },
  });
  revalidatePath("/phap-tri");
  redirect(`/phap-tri/${t.id}`);
}

export async function linkPatternPrinciple(formData: FormData) {
  await requireKnowledgeEditor();
  const patternId = str(formData, "patternId");
  const principleId = str(formData, "principleId");
  if (!patternId || !principleId) return;
  await prisma.patternPrinciple.upsert({
    where: { patternId_principleId: { patternId, principleId } },
    update: { rationale: str(formData, "rationale") },
    create: { patternId, principleId, rationale: str(formData, "rationale") },
  });
  revalidatePath(`/chung-hau/${patternId}`);
  revalidatePath(`/phap-tri/${principleId}`);
}

export async function createHerb(formData: FormData) {
  await requireKnowledgeEditor();
  const sourceId = await resolveSourceId(formData);
  const h = await prisma.herb.create({
    data: {
      standardName: str(formData, "standardName") ?? "Chưa đặt tên",
      aliases: str(formData, "aliases"),
      latinName: str(formData, "latinName"),
      family: str(formData, "family"),
      partUsed: str(formData, "partUsed"),
      origin: str(formData, "origin"),
      botanicalDescription: str(formData, "botanicalDescription"),
      distribution: str(formData, "distribution"),
      harvestProcessing: str(formData, "harvestProcessing"),
      storage: str(formData, "storage"),
      chemicalComposition: str(formData, "chemicalComposition"),
      natureFlavor: str(formData, "natureFlavor"),
      meridians: str(formData, "meridians"),
      actions: str(formData, "actions"),
      indications: str(formData, "indications"),
      modernPharmacology: str(formData, "modernPharmacology"),
      dosage: str(formData, "dosage"),
      safetyNotes: str(formData, "safetyNotes"),
      status: str(formData, "status") ?? "DRAFT",
      sourceId,
    },
  });
  revalidatePath("/vi-thuoc");
  redirect(`/vi-thuoc/${h.id}`);
}

export async function createFormula(formData: FormData) {
  await requireKnowledgeEditor();
  const sourceId = await resolveSourceId(formData);
  const principleId = str(formData, "principleId");
  const f = await prisma.formula.create({
    data: {
      name: str(formData, "name") ?? "Chưa đặt tên",
      aliases: str(formData, "aliases"),
      origin: str(formData, "origin"),
      indications: str(formData, "indications"),
      preparation: str(formData, "preparation"),
      modifications: str(formData, "modifications"),
      safetyNotes: str(formData, "safetyNotes"),
      status: str(formData, "status") ?? "DRAFT",
      sourceId,
      principleId,
    },
  });
  revalidatePath("/bai-thuoc");
  redirect(`/bai-thuoc/${f.id}`);
}

export async function addFormulaIngredient(formData: FormData) {
  await requireKnowledgeEditor();
  const formulaId = str(formData, "formulaId");
  const herbId = str(formData, "herbId");
  if (!formulaId || !herbId) return;
  await prisma.formulaIngredient.create({
    data: {
      formulaId,
      herbId,
      amount: str(formData, "amount"),
      unit: str(formData, "unit"),
      preparation: str(formData, "preparation"),
      role: str(formData, "role"),
      note: str(formData, "note"),
    },
  });
  revalidatePath(`/bai-thuoc/${formulaId}`);
}

export async function createPoint(formData: FormData) {
  await requireKnowledgeEditor();
  const sourceId = await resolveSourceId(formData);
  const p = await prisma.acupuncturePoint.create({
    data: {
      code: str(formData, "code") ?? "",
      standardName: str(formData, "standardName") ?? "Chưa đặt tên",
      aliases: str(formData, "aliases"),
      meridian: str(formData, "meridian"),
      location: str(formData, "location"),
      anatomyNotes: str(formData, "anatomyNotes"),
      actions: str(formData, "actions"),
      technique: str(formData, "technique"),
      contraindications: str(formData, "contraindications"),
      riskNotes: str(formData, "riskNotes"),
      status: str(formData, "status") ?? "DRAFT",
      sourceId,
    },
  });
  revalidatePath("/cham-cuu");
  redirect(`/cham-cuu/${p.id}`);
}

export async function createManualTherapy(formData: FormData) {
  await requireKnowledgeEditor();
  const sourceId = await resolveSourceId(formData);
  await prisma.manualTherapy.create({
    data: {
      name: str(formData, "name") ?? "Chưa đặt tên",
      techniqueType: str(formData, "techniqueType"),
      targetArea: str(formData, "targetArea"),
      sequence: str(formData, "sequence"),
      indications: str(formData, "indications"),
      contraindications: str(formData, "contraindications"),
      durationForce: str(formData, "durationForce"),
      status: str(formData, "status") ?? "DRAFT",
      sourceId,
    },
  });
  revalidatePath("/xoa-bop");
  redirect("/xoa-bop");
}

export async function createTheoryTopic(formData: FormData) {
  await requireKnowledgeEditor();
  const sourceId = await resolveSourceId(formData);
  const t = await prisma.theoryTopic.create({
    data: {
      name: str(formData, "name") ?? "Chưa đặt tên",
      category: str(formData, "category"),
      summary: str(formData, "summary"),
      content: str(formData, "content"),
      keyPoints: str(formData, "keyPoints"),
      status: str(formData, "status") ?? "DRAFT",
      sourceId,
    },
  });
  revalidatePath("/ly-luan");
  redirect(`/ly-luan/${t.id}`);
}

export async function createSource(formData: FormData) {
  await requireKnowledgeEditor();
  const s = await prisma.source.create({
    data: {
      title: str(formData, "title") ?? "Chưa đặt tên",
      sourceType: str(formData, "sourceType") ?? "Khác",
      authorOrOrg: str(formData, "authorOrOrg"),
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
      version: str(formData, "version"),
      publisherOrUrl: str(formData, "publisherOrUrl"),
      locator: str(formData, "locator"),
      usageRights: str(formData, "usageRights"),
    },
  });
  revalidatePath("/thu-vien");
  redirect(`/thu-vien/${s.id}`);
}
