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

// Đánh dấu dịch vụ là thủ thuật (do y sĩ / kỹ thuật viên thực hiện, có phiếu thủ thuật sau khi thu tiền).
export async function setProcedure(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const id = String(formData.get("id") ?? "");
  const on = formData.get("procedure") === "1";
  const s = id ? await prisma.serviceItem.findUnique({ where: { id } }) : null;
  if (!s) back("Không tìm thấy dịch vụ.");
  await prisma.serviceItem.update({ where: { id }, data: { procedure: on } });
  await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "UPDATE", entity: "ServiceItem", entityId: id, detail: `${s!.name}: ${on ? "là thủ thuật" : "không phải thủ thuật"}` });
  revalidatePath("/thu-ngan/dich-vu");
  back();
}

// Vật tư tiêu hao cho mỗi lần làm thủ thuật (tự trừ kho khi y sĩ hoàn thành).
export async function saveSupply(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const serviceId = String(formData.get("serviceId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const qty = Number(String(formData.get("qty") ?? "").replace(",", "."));
  if (!serviceId || !itemId) back("Chọn vật tư.");
  if (!Number.isFinite(qty) || qty <= 0 || qty > 100000) back("Số lượng vật tư phải lớn hơn 0.");
  const [svc, item] = await Promise.all([
    prisma.serviceItem.findUnique({ where: { id: serviceId } }),
    prisma.item.findUnique({ where: { id: itemId } }),
  ]);
  if (!svc || !item) back("Không tìm thấy dịch vụ hoặc vật tư.");
  if (item!.type !== "SUPPLY") back("Chỉ chọn vật tư y tế (kim, chỉ, găng, bông, cồn…). Thuốc và dược liệu không phải vật tư tiêu hao.");
  await prisma.serviceSupply.upsert({ where: { serviceId_itemId: { serviceId, itemId } }, create: { serviceId, itemId, qty }, update: { qty } });
  await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "UPDATE", entity: "ServiceItem", entityId: serviceId, detail: `${svc!.name}: vật tư ${item!.name} ${qty}${item!.unit}/lần` });
  revalidatePath("/thu-ngan/dich-vu");
  back();
}

export async function removeSupply(formData: FormData) {
  await requireRole(...ITEM_MANAGER_ROLES);
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.serviceSupply.deleteMany({ where: { id } });
  revalidatePath("/thu-ngan/dich-vu");
  back();
}
