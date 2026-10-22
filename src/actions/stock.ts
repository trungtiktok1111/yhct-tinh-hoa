"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nextItemCode } from "@/lib/stock";
import { analyzeSheet, MAX_BYTES } from "@/lib/stockSheet";
import { randomUUID } from "crypto";
import { logAudit, requireRole, type CurrentStaff } from "@/lib/auth";
import { ITEM_MANAGER_ROLES, STOCK_WRITE_ROLES, hasAny } from "@/lib/permissions";

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
  // "120.5" hay "1,5" là số thập phân, không phải hàng nghìn: từ chối thay vì âm thầm hiểu thành 1205 / 15.
  if (/[.,]\d{1,2}$/.test(t)) return undefined;
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
      code: await nextItemCode(type), name, type, unit, minStock, herbId: herb?.id, note: str(formData, "note"),
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

  // Chặn nhầm số: giá/số lượng khác thường phải được tích xác nhận mới lưu.
  const [lastLot, curPrice] = await Promise.all([
    prisma.stockLot.findFirst({ where: { itemId }, orderBy: { receivedAt: "desc" }, select: { unitCost: true } }),
    prisma.itemPrice.findFirst({ where: { itemId }, orderBy: { effectiveFrom: "desc" }, select: { price: true } }),
  ]);
  const warn: string[] = [];
  if (unitCost === 0) warn.push("giá nhập bằng 0");
  if (lastLot && lastLot.unitCost > 0 && (unitCost > lastLot.unitCost * 3 || unitCost * 3 < lastLot.unitCost))
    warn.push(`giá nhập ${unitCost}đ lệch nhiều so với lần nhập trước (${lastLot.unitCost}đ)`);
  if (curPrice && unitCost > curPrice.price) warn.push(`giá nhập ${unitCost}đ cao hơn giá bán ${curPrice.price}đ (bán lỗ)`);
  if (item.type === "HERB" && (quantity < 10 || quantity > 200000))
    warn.push(`số lượng ${quantity}g bất thường (dược liệu tính bằng gam, 1 kg = 1000)`);
  if (warn.length && formData.get("confirmOdd") !== "1")
    back(P, `Kiểm tra lại: ${warn.join("; ")}. Nếu đúng, tích "Tôi đã kiểm tra" rồi lưu lại.`);

  const supplierId = str(formData, "supplierId");
  const sup = supplierId ? await prisma.supplier.findUnique({ where: { id: supplierId } }) : null;
  const supplierName = sup?.name ?? str(formData, "supplier");
  await prisma.$transaction(async (tx) => {
    const lot = await tx.stockLot.create({
      data: {
        itemId, branchId, unitCost, expiryDate, supplier: supplierName, supplierId: sup?.id,
        note: [receiptNo(), str(formData, "note")].filter(Boolean).join(" · "), qtyReceived: quantity, qtyRemaining: quantity, staffName: staff.fullName,
      },
    });
    await tx.stockMove.create({
      data: { itemId, branchId, lotId: lot.id, type: "RECEIPT", qty: quantity, reason: supplierName, staffName: staff.fullName },
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

// Sửa giá nhập của một lô (nhập sai / thiếu giá). Chỉ quản lý; giá phải > 0; ghi nhật ký giá cũ → mới.
export async function fixLotCost(formData: FormData) {
  const staff = await requireRole(...ITEM_MANAGER_ROLES);
  const P = "/kho/lo";
  const id = str(formData, "id");
  const cost = money(formData, "unitCost");
  if (!id) back(P);
  if (cost === undefined || cost <= 0) back(P, "Giá nhập phải là số nguyên lớn hơn 0 (đồng / đơn vị).");
  const lot = await prisma.stockLot.findUnique({ where: { id }, include: { item: true } });
  if (!lot) back(P);
  assertBranch(staff, lot.branchId, P);
  if (lot.unitCost === cost) back(P);
  await prisma.stockLot.update({ where: { id }, data: { unitCost: cost } });
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId: lot.branchId, action: "UPDATE", entity: "StockLot",
    entityId: id, detail: `Sửa giá nhập lô ${lot.item.name}: ${lot.unitCost} → ${cost} đ/${lot.item.unit}`,
  });
  revalidatePath("/kho");
  revalidatePath("/kho/lo");
  back(P);
}

// Số phiếu nhập: PN-yyyymmdd-XXXX (giờ Việt Nam), ghi trong ghi chú lô để truy vết trên thẻ kho.
function receiptNo() {
  const d = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10).replace(/-/g, "");
  return `PN-${d}-${randomUUID().slice(0, 4).toUpperCase()}`;
}

// ---------- Nhập kho hàng loạt từ Excel ----------
// Kiểm tra lại toàn bộ ở máy chủ; có lỗi thì không lưu dòng nào. Cảnh báo cần tích xác nhận.
export async function importStockExcel(formData: FormData) {
  const staff = await requireRole(...STOCK_WRITE_ROLES);
  const P = "/kho/nhap/excel";
  const branchId = assertBranch(staff, str(formData, "branchId"), P);
  const branch = await prisma.branch.findUnique({ where: { id: branchId }, select: { id: true, name: true } });
  if (!branch) back(P, "Không tìm thấy chi nhánh.");
  const f = formData.get("file");
  if (!(f instanceof File) || f.size === 0) back(P, "Chưa chọn file.");
  if (f.size > MAX_BYTES) back(P, "File quá lớn (tối đa 2MB).");
  const res = await analyzeSheet(Buffer.from(await f.arrayBuffer()), branch, { canCreate: hasAny(staff.roles, ITEM_MANAGER_ROLES) });
  if (res.fileErrors.length) back(P, res.fileErrors[0]);
  const bad = res.rows.filter((r) => r.errors.length);
  if (bad.length) back(P, `Còn ${bad.length} dòng lỗi (dòng ${bad.slice(0, 5).map((r) => r.row).join(", ")}...). Sửa file rồi tải lại.`);
  const warned = res.rows.filter((r) => r.warnings.length);
  if (warned.length && formData.get("confirmOdd") !== "1") back(P, "Có dòng cảnh báo, hãy tích xác nhận đã kiểm tra rồi nhập lại.");
  const dup = await prisma.auditLog.findFirst({
    where: { action: "IMPORT_RECEIPT", branchId, detail: { contains: `#${res.hash}` } }, select: { id: true },
  });
  if (dup) back(P, "Số phiếu này đã được nhập trước đó. Để tránh nhập trùng, hãy tải phiếu nhập kho mới.");

  const pn = res.hash; // số phiếu in trên file mẫu, mỗi số chỉ nhập được một lần
  const label = `${pn} · Excel ${f.name}`.slice(0, 80);
  // Mặt hàng mới: cấp mã liên tiếp theo loại, liên kết vị thuốc tri thức nếu trùng tên.
  const newRows = res.rows.filter((r) => r.newItem);
  const nextCode: Record<string, number> = {};
  for (const t of ["HERB", "PRODUCT"]) {
    if (!newRows.some((r) => r.newItem?.type === t)) continue;
    const prefix = t === "HERB" ? "VT" : "TP";
    const codes = await prisma.item.findMany({ where: { code: { startsWith: prefix } }, select: { code: true } });
    nextCode[t] = codes.reduce((m, c) => Math.max(m, parseInt((c.code ?? "").slice(prefix.length), 10) || 0), 0) + 1;
  }
  const newItems: { id: string; code: string; name: string; type: string; unit: string; herbId: string | null; price: number }[] = [];
  for (const r of newRows) {
    const n = r.newItem!;
    const herb = n.type === "HERB"
      ? await prisma.herb.findFirst({ where: { standardName: { equals: n.name, mode: "insensitive" } }, select: { id: true } })
      : null;
    const id = randomUUID();
    r.itemId = id;
    newItems.push({ id, code: `${n.type === "HERB" ? "VT" : "TP"}${String(nextCode[n.type]++).padStart(3, "0")}`, name: n.name, type: n.type, unit: n.unit, herbId: herb?.id ?? null, price: n.price });
  }
  const lots = res.rows.map((r) => ({
    id: randomUUID(), itemId: r.itemId as string, branchId, unitCost: r.unitCostBase,
    expiryDate: r.expiry ? new Date(r.expiry + "T00:00:00Z") : null, supplier: r.supplier,
    note: [label, r.note].filter(Boolean).join(" · "), qtyReceived: r.qtyBase, qtyRemaining: r.qtyBase, staffName: staff.fullName,
  }));
  try {
    await prisma.$transaction([
      prisma.item.createMany({ data: newItems.map(({ price, ...it }) => it) }),
      prisma.itemPrice.createMany({ data: [
        ...newItems.map((it) => ({ itemId: it.id, price: it.price, staffName: staff.fullName })),
        ...res.rows.filter((r) => r.priceChange && r.itemId).map((r) => ({ itemId: r.itemId as string, price: r.priceChange!.to, staffName: staff.fullName })),
      ] }),
      prisma.stockLot.createMany({ data: lots }),
      prisma.stockMove.createMany({
        data: lots.map((l) => ({ itemId: l.itemId, branchId, lotId: l.id, type: "RECEIPT", qty: l.qtyReceived, reason: l.supplier ?? label, staffName: staff.fullName })),
      }),
    ]);
  } catch {
    back(P, "Không lưu được (có thể mã hàng vừa bị trùng). Chưa có gì được ghi, hãy thử lại.");
  }
  for (const it of newItems) {
    await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "CREATE", entity: "Item", entityId: it.id, detail: `${it.name} · ${it.price}đ/${it.unit} (nhập Excel)` });
  }
  for (const r of res.rows.filter((x) => x.priceChange)) {
    await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "UPDATE", entity: "ItemPrice", entityId: r.itemId ?? undefined, detail: `${r.name}: giá bán ${r.priceChange!.from ?? "?"} → ${r.priceChange!.to}đ (nhập Excel)` });
  }
  await logAudit({
    staffId: staff.id, staffName: staff.fullName, branchId, action: "IMPORT_RECEIPT", entity: "StockLot",
    detail: `Nhập Excel ${lots.length} dòng (${newItems.length} mặt hàng mới), tổng ${res.total}đ #${res.hash}`,
  });
  revalidatePath("/kho");
  revalidatePath("/kho/nhap");
  back(`${P}?ok=${lots.length}`);
}
