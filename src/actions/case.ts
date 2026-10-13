"use server";

import { prisma } from "@/lib/db";
import { analyzePatterns } from "@/lib/reasoning";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export async function createCase(formData: FormData) {
  const c = await prisma.clinicalCase.create({
    data: {
      caseCode: str(formData, "caseCode") ?? `CA-${Date.now()}`,
      minimalIdentity: str(formData, "minimalIdentity"),
      history: str(formData, "history"),
    },
  });
  revalidatePath("/ca-lam-sang");
  redirect(`/ca-lam-sang/${c.id}`);
}

export async function saveObservations(formData: FormData) {
  const id = str(formData, "caseId");
  if (!id) return;
  const observations = {
    vong: str(formData, "vong") ?? "",
    van: str(formData, "van") ?? "",
    vanHoi: str(formData, "vanHoi") ?? "",
    thiet: str(formData, "thiet") ?? "",
    freeNote: str(formData, "freeNote") ?? "",
  };
  await prisma.clinicalCase.update({
    where: { id },
    data: { observations: JSON.stringify(observations), candidatePatterns: null, confirmedConclusion: null },
  });
  revalidatePath(`/ca-lam-sang/${id}`);
}

export async function runPatternAnalysis(formData: FormData) {
  const id = str(formData, "caseId");
  if (!id) return;
  const kase = await prisma.clinicalCase.findUnique({ where: { id } });
  if (!kase || !kase.observations) return;

  const obs = JSON.parse(kase.observations) as Record<string, string>;
  const fullText = Object.values(obs).join(" \n ");

  const patterns = await prisma.pattern.findMany({
    select: { id: true, name: true, supportCriteria: true, againstCriteria: true, keySigns: true, missingDataPrompts: true },
  });

  const results = analyzePatterns(fullText, patterns);

  await prisma.clinicalCase.update({
    where: { id },
    data: { candidatePatterns: JSON.stringify(results) },
  });
  revalidatePath(`/ca-lam-sang/${id}`);
}

export async function confirmConclusion(formData: FormData) {
  const id = str(formData, "caseId");
  if (!id) return;
  await prisma.clinicalCase.update({
    where: { id },
    data: {
      confirmedConclusion: str(formData, "confirmedConclusion"),
      plan: str(formData, "plan"),
    },
  });
  revalidatePath(`/ca-lam-sang/${id}`);
}

export async function recordOutcome(formData: FormData) {
  const id = str(formData, "caseId");
  if (!id) return;
  await prisma.clinicalCase.update({
    where: { id },
    data: {
      actualTreatment: str(formData, "actualTreatment"),
      outcome: str(formData, "outcome"),
    },
  });
  revalidatePath(`/ca-lam-sang/${id}`);
}
