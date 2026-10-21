"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole, type CurrentStaff } from "@/lib/auth";
import { ITEM_MANAGER_ROLES, STOCK_WRITE_ROLES } from "@/lib/permissions";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}
// Chấp nhận "1,5" hoặc "1.5".
function num(fd: FormData, key: string): number | undefined {
  const t = str(fd, key);
  if (!t) return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}
// Tiền: bỏ dấu chấm/phẩy/khoảng trắng phân cách hàng nghìn.
function money(fd: FormData, key: string): number | undefined {
  const t = str(fd, key);
  if (!t) return undefined;
  const n = Number(t.replace(/[.,\s]/g, ""));
  return Number.isInteger(n) && n >= 0 ? n : undefined;
}
function back(path: string, error?: string): never {
  redirect(error ? `${path}?loi=${encodeURIComponent(error)}` : path);
}
function assertBranch(staff: CurrentStaff, branchId: string | undefined, path: string): string {
  if (!branchId) back(path, "Chọn chi nhánh.");
  if (!staff.isOwner && !staff.branchIds.includes(branchId)) back(path, "Bạn không thuộc chi nhánh này.");
  return branchId;
}

// ---------- Mặt hàng và giá ----------

export async function createItem(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const P = "/kho/mat-hang";
  const name = str(formData, "name");
  const type = str(formData, "type");
  if (!name) back(P, "Nhập tên mặt hàng.");
  if (type !== "HERB" && type !== "PRODUCT") back(P, "Chọn loại mặt hàng.");
  const unit = type === "HERB" ? "g" : str(formData, "unit");
  if (!unit) back(P, "Chọn đơn vị.");
  const price = money(formData, "price");
  if (price === undefined) back(P, "Nhập giá bán (số, đồng).");
  const minStock = num(formData, "minStock") ?? 0;
  if (minStock < 0) back(P, "Mức tối thiểu không được âm.");
  if (await prisma.item.findFirst({ where: { name: { equals: name, mode: "insensitive" }, unit } }))
    back(P, "Mặt hàng này đã có.");

  const herb = type === "HERB"
    ? await prisma.herb.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } }, select: { id: true } })
    : null;
  const item = await prisma.item.create({
    data: {
      name, type, unit, minStock, herbId: herb?.id, note: str(formData, "note"),
      prices: { create: { price, staffName: staff.fullName } },
    },
  });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, action: "CREATE", entity: "Item", entityId: item.id,
    detail: `${name} · ${price}đ/${unit}`,
  });
  revalidatePath("/kho/mat-hang");
  back(P);
}

export async function updateItem(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const P = "/kho/mat-hang";
  const id = str(formData, "id");
  if (!id) back(P);
  const item = await prisma.item.findUnique({
    where: { id },
    include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 1 } },
  });
  if (!item) back(P, "Không tìm thấy mặt hàng.");
  const price = money(formData, "price");
  if (price === undefined) back(P, "Giá bán phải là số (đồng).");
  const minStock = num(formData, "minStock") ?? 0;
  if (minStock < 0) back(P, "Mức tối thiểu không được âm.");

  const name = str(formData, "name") ?? item.name;
  const oldPrice = item.prices[0]?.price;
  await prisma.$transaction(async (tx) => {
    if (oldPrice !== price) await tx.itemPrice.create({ data: { itemId: id, price, staffName: staff.fullName } });
    await tx.item.update({ where: { id }, data: { name, minStock, note: str(formData, "note") ?? null } });
  });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, action: "UPDATE", entity: "Item", entityId: id,
    detail: `${item.name} · giá ${oldPrice ?? "-"} → ${price} · tối thiểu ${item.minStock} → ${minStock}`,
  });
  revalidatePath("/kho/mat-hang");
  back(P);
}

export async function setItemActive(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const id = str(formData, "id");
  if (!id) back("/kho/mat-hang");
  const active = formData.get("active") === "1";
  await prisma.item.update({ where: { id }, data: { active } });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, action: active ? "ACTIVATE" : "DEACTIVATE",
    entity: "Item", entityId: id,
  });
  revalidatePath("/kho/mat-hang");
  back("/kho/mat-hang");
}

// ---------- Nhập kho ----------

export async function receiveStock(formData: FormData) {
  const staff = await requireRole(...STOCK_WRITE_ROLES);
  const P = "/kho/nhap";
  const branchId = assertBranch(staff, str(formData, "branchId"), P);
  const itemId = str(formData, "itemId");
  const quantity = num(formData, "qty");
  const unitCost = money(formData, "unitCost");
  const expiryRaw = str(formData, "expiryDate");
  if (!itemId) back(P, "Chọn mặt hàng.");
  if (!quantity || quantity <= 0) back(P, "Số lượng phải lớn hơn 0.");
  if (unitCost === undefined) back(P, "Nhập giá nhập (số, đồng / đơn vị).");
  const expiryDate = expiryRaw ? new Date(expiryRaw) : undefined;
  if (expiryDate && isNaN(expiryDate.getTime())) back(P, "Hạn dùng không hợp lệ.");
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || !item.active) back(P, "Mặt hàng không tồn tại hoặc đã ngừng.");

  await prisma.$transaction(async (tx) => {
    const lot = await tx.stockLot.create({
      data: {
        itemId, branchId, unitCost, expiryDate, supplier: str(formData, "supplier"),
        note: str(formData, "note"), qtyReceived: quantity, qtyRemaining: quantity, staffName: staff.fullName,
      },
    });
    await tx.stockMove.create({
      data: { itemId, branchId, lotId: lot.id, type: "RECEIPT", qty: quantity, reason: str(formData, "supplier"), staffName: staff.fullName },
    });
  });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId, action: "RECEIPT", entity: "StockLot",
    detail: `${item.name} +${quantity}${item.unit} · giá nhập ${unitCost}`,
  });
  revalidatePath("/kho");
  revalidatePath("/kho/nhap");
  back(P + "?ok=1");
}

// ---------- Điều chỉnh (kiểm kê, hao hụt, hỏng, hết hạn) ----------

export async function adjustStock(formData: FormData) {
  const staff = await requireRole(...STOCK_WRITE_ROLES);
  const P = "/kho/dieu-chinh";
  const branchId = assertBranch(staff, str(formData, "branchId"), P);
  const itemId = str(formData, "itemId");
  const delta = num(formData, "delta");
  const reason = str(formData, "reason");
  if (!itemId) back(P, "Chọn mặt hàng.");
  if (!delta || delta === 0) back(P, "Nhập số lượng thay đổi (khác 0; âm là giảm).");
  if (!reason) back(P, "Bắt buộc ghi lý do.");
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) back(P, "Không tìm thấy mặt hàng.");

  const err = await prisma.$transaction(async (tx) => {
    if (delta > 0) {
      const last = await tx.stockLot.findFirst({ where: { itemId, branchId }, orderBy: { receivedAt: "desc" } });
      const lot = await tx.stockLot.create({
        data: {
          itemId, branchId, unitCost: last?.unitCost ?? 0, qtyReceived: delta, qtyRemaining: delta,
          note: `Điều chỉnh tăng: ${reason}`, staffName: staff.fullName,
        },
      });
      await tx.stockMove.create({
        data: { itemId, branchId, lotId: lot.id, type: "ADJUST", qty: delta, reason, staffName: staff.fullName },
      });
      return null;
    }
    // Giảm: lấy từ lô hết hạn sớm nhất trước.
    let need = -delta;
    const lots = await tx.stockLot.findMany({
      where: { itemId, branchId, qtyRemaining: { gt: 0 } },
      orderBy: [{ expiryDate: { sort: "asc", nulls: "last" } }, { receivedAt: "asc" }],
    });
    const have = lots.reduce((s, l) => s + l.qtyRemaining, 0);
    if (have + 1e-9 < need) return `Tồn kho chỉ còn ${have}${item.unit}, không giảm được ${need}${item.unit}.`;
    for (const l of lots) {
      if (need <= 1e-9) break;
      const take = Math.min(l.qtyRemaining, need);
      await tx.stockLot.update({ where: { id: l.id }, data: { qtyRemaining: l.qtyRemaining - take } });
      await tx.stockMove.create({
        data: { itemId, branchId, lotId: l.id, type: "ADJUST", qty: -take, reason, staffName: staff.fullName },
      });
      need -= take;
    }
    return null;
  });
  if (err) back(P, err);
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId, action: "ADJUST", entity: "Stock",
    entityId: itemId, detail: `${item.name} ${delta > 0 ? "+" : ""}${delta}${item.unit} · ${reason}`,
  });
  revalidatePath("/kho");
  revalidatePath("/kho/dieu-chinh");
  back(P + "?ok=1");
}

// Chỉ xóa được mặt hàng chưa có giao dịch kho; còn lại dùng "Ngừng bán".
export async function deleteItem(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const P = "/kho/mat-hang";
  const id = str(formData, "id");
  if (!id) back(P);
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) back(P);
  const used = (await prisma.stockLot.count({ where: { itemId: id } })) + (await prisma.stockMove.count({ where: { itemId: id } }));
  if (used > 0) back(P, `"${item.name}" đã có giao dịch kho nên không xóa được. Hãy chọn "Ngừng bán".`);
  await prisma.item.delete({ where: { id } });
  await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "DELETE", entity: "Item", entityId: id, detail: item.name });
  revalidatePath("/kho/mat-hang");
  back(P);
}

// Hủy một lần nhập nhầm: chỉ khi lô chưa bị xuất/điều chỉnh gì.
export async function cancelLot(formData: FormData) {
  const staff = await requireRole(...STOCK_WRITE_ROLES);
  const P = "/kho/nhap";
  const id = str(formData, "id");
  if (!id) back(P);
  const lot = await prisma.stockLot.findUnique({ where: { id }, include: { item: true } });
  if (!lot) back(P);
  assertBranch(staff, lot.branchId, P);
  if (lot.qtyRemaining !== lot.qtyReceived)
    back(P, "Lô này đã được xuất hoặc điều chỉnh nên không hủy được. Dùng Điều chỉnh để giảm tồn.");
  await prisma.$transaction([
    prisma.stockMove.deleteMany({ where: { lotId: id } }),
    prisma.stockLot.delete({ where: { id } }),
  ]);
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId: lot.branchId, action: "CANCEL_RECEIPT", entity: "StockLot",
    entityId: id, detail: `${lot.item.name} -${lot.qtyReceived}${lot.item.unit}`,
  });
  revalidatePath("/kho");
  revalidatePath("/kho/nhap");
  back(P);
}
