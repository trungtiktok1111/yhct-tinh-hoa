"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { STOCK_WRITE_ROLES } from "@/lib/permissions";

function back(err?: string): never {
  redirect(`/kho/nha-cung-cap${err ? `?loi=${encodeURIComponent(err)}` : ""}`);
}
const s = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" && v.trim() ? v.trim() : null;
};

export async function saveSupplier(formData: FormData) {
  const staff = await requireRole(...STOCK_WRITE_ROLES);
  const id = s(formData, "id");
  const name = s(formData, "name");
  if (!name) back("Nhập tên nhà cung cấp.");
  const data = { name, phone: s(formData, "phone"), address: s(formData, "address"), note: s(formData, "note") };
  if (id) await prisma.supplier.update({ where: { id }, data });
  else await prisma.supplier.create({ data });
  await logAudit({ staffId: staff.id, staffName: staff.fullName, action: id ? "UPDATE" : "CREATE", entity: "Supplier", entityId: id ?? undefined, detail: name });
  revalidatePath("/kho/nha-cung-cap");
  back();
}

export async function toggleSupplier(formData: FormData) {
  await requireRole(...STOCK_WRITE_ROLES);
  const id = s(formData, "id");
  const sp = id ? await prisma.supplier.findUnique({ where: { id } }) : null;
  if (sp) await prisma.supplier.update({ where: { id: sp.id }, data: { active: !sp.active } });
  revalidatePath("/kho/nha-cung-cap");
  back();
}
