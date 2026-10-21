"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { ITEM_MANAGER_ROLES } from "@/lib/permissions";

function back(err?: string): never {
  redirect(`/thu-ngan/dich-vu${err ? `?loi=${encodeURIComponent(err)}` : ""}`);
}
const price = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").replace(/[.\s]/g, ""));
  return Number.isFinite(n) && n >= 0 && n < 1e9 ? Math.round(n) : null;
};

export async function saveService(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim() || "Lần";
  const p = price(formData.get("price"));
  if (!name) back("Nhập tên dịch vụ.");
  if (p === null) back("Giá phải là số không âm.");
  if (id) await prisma.serviceItem.update({ where: { id }, data: { name, unit, price: p } });
  else {
    const n = await prisma.serviceItem.count();
    await prisma.serviceItem.create({ data: { name, unit, price: p, position: n } });
  }
  await logAudit({ staffId: staff.id, staffName: staff.fullName, action: id ? "UPDATE" : "CREATE", entity: "ServiceItem", entityId: id || undefined, detail: `${name} · ${p}đ` });
  revalidatePath("/thu-ngan/dich-vu");
  back();
}

export async function toggleService(formData: FormData) {
  await requireRole(...ITEM_MANAGER_ROLES);
  const id = String(formData.get("id") ?? "");
  const s = id ? await prisma.serviceItem.findUnique({ where: { id } }) : null;
  if (s) await prisma.serviceItem.update({ where: { id }, data: { active: !s.active } });
  revalidatePath("/thu-ngan/dich-vu");
  back();
}
