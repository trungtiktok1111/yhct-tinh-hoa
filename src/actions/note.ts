"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";

export async function saveQuickNote(formData: FormData) {
  const staff = await requireRole(...PATIENT_ROLES);
  const branchId = String(formData.get("branchId") ?? "");
  const text = String(formData.get("text") ?? "").trim().slice(0, 1000);
  if (text) {
    await prisma.quickNote.create({ data: { branchId: branchId || null, text, staffName: staff.fullName } });
  }
  revalidatePath("/tiep-don");
  redirect(`/tiep-don${branchId ? `?cn=${branchId}` : ""}`);
}

export async function deleteQuickNote(formData: FormData) {
  await requireRole(...PATIENT_ROLES);
  const id = String(formData.get("id") ?? "");
  const branchId = String(formData.get("branchId") ?? "");
  if (id) await prisma.quickNote.deleteMany({ where: { id } });
  revalidatePath("/tiep-don");
  redirect(`/tiep-don${branchId ? `?cn=${branchId}` : ""}`);
}

export async function togglePriority(formData: FormData) {
  await requireRole(...PATIENT_ROLES);
  const id = String(formData.get("id") ?? "");
  const v = id ? await prisma.visit.findUnique({ where: { id }, select: { priority: true, branchId: true, status: true } }) : null;
  if (v && v.status === "WAITING") await prisma.visit.update({ where: { id }, data: { priority: !v.priority } });
  revalidatePath("/tiep-don");
  revalidatePath("/kham");
  redirect(`/tiep-don${v ? `?cn=${v.branchId}` : ""}`);
}
