"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole, type CurrentStaff } from "@/lib/auth";
import { CASHIER_ROLES } from "@/lib/permissions";

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t || undefined;
};
const money = (fd: FormData, k: string): number | undefined | null => {
  const t = str(fd, k);
  if (!t) return undefined;
  const n = Number(t.replace(/[.\s]/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 && n < 1e10 ? Math.round(n) : null;
};
const num = (fd: FormData, k: string) => {
  const t = str(fd, k);
  if (!t) return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
};
function go(id: string, error?: string): never {
  redirect(`/thu-ngan/${id}${error ? `?loi=${encodeURIComponent(error)}` : ""}`);
}

async function loadInvoice(staff: CurrentStaff, id: string | undefined) {
  if (!id) redirect("/thu-ngan");
  const inv = await prisma.invoice.findUnique({ where: { id }, include: { lines: true } });
  if (!inv) redirect("/thu-ngan");
  if (!staff.isOwner && !staff.branchIds.includes(inv.branchId)) redirect("/khong-co-quyen");
  return inv;
}

async function recalc(invoiceId: string) {
  const inv = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { lines: true } });
  if (!inv) return;
  const subtotal = inv.lines.reduce((s, l) => s + l.amount, 0);
  const discount = Math.min(inv.discount, subtotal);
  await prisma.invoice.update({ where: { id: invoiceId }, data: { subtotal, discount, total: subtotal - discount } });
}

async function currentPrices(itemIds: string[]) {
  const rows = await prisma.itemPrice.findMany({
    where: { itemId: { in: itemIds }, effectiveFrom: { lte: new Date() } },
    orderBy: { effectiveFrom: "desc" },
  });
  const m = new Map<string, number>();
  for (const r of rows) if (!m.has(r.itemId)) m.set(r.itemId, r.price);
  return m;
}

export async function createExamInvoice(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const visitId = str(formData, "visitId");
  if (!visitId) redirect("/thu-ngan");
  const visit = await prisma.visit.findUnique({
    where: { id: visitId },
    include: {
      invoice: true,
      exam: { include: { prescription: { include: { lines: { orderBy: { position: "asc" } } } } } },
    },
  });
  if (!visit) redirect("/thu-ngan");
  if (!staff.isOwner && !staff.branchIds.includes(visit.branchId)) redirect("/khong-co-quyen");
  if (visit.invoice) go(visit.invoice.id);
  if (visit.exam?.status !== "FINAL") redirect(`/thu-ngan?loi=${encodeURIComponent("Bác sĩ chưa hoàn tất khám lượt này.")}`);
  const fee = money(formData, "fee");
  if (fee === null) redirect(`/thu-ngan?loi=${encodeURIComponent("Tiền công khám phải là số.")}`);
  const rx = visit.exam.prescription;
  const lines = rx?.lines ?? [];
  const prices = await currentPrices(lines.map((l) => l.itemId));
  const noPrice = lines.filter((l) => !prices.has(l.itemId)).map((l) => l.itemName);
  if (noPrice.length)
    redirect(`/thu-ngan?loi=${encodeURIComponent(`Chưa có giá bán: ${noPrice.join(", ")}. Nhờ quản lý đặt giá ở “Kho và giá”.`)}`);
  const thang = Math.max(rx?.thangCount ?? 0, 1);
  const data = [];
  let pos = 0;
  if (fee) data.push({ kind: "FEE", itemId: null, name: "Công khám", unit: "lần", qty: 1, unitPrice: fee, amount: fee, position: pos++ });
  for (const l of lines) {
    const q = l.kind === "HERB" ? l.qty * thang : l.qty;
    const up = prices.get(l.itemId)!;
    data.push({
      kind: l.kind, itemId: l.itemId, name: l.kind === "HERB" ? `${l.itemName} (${l.qty} ${l.unit} × ${thang} thang)` : l.itemName,
      unit: l.unit, qty: q, unitPrice: up, amount: Math.round(q * up), position: pos++,
    });
  }
  const subtotal = data.reduce((s, d) => s + d.amount, 0);
  const inv = await prisma.invoice.create({
    data: {
      branchId: visit.branchId, visitId, patientId: visit.patientId, kind: "EXAM", subtotal, total: subtotal,
      staffId: staff.id, staffName: staff.fullName, lines: { create: data },
    },
  });
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: visit.branchId, action: "CREATE", entity: "Invoice", entityId: inv.id, detail: `HĐ khám, ${subtotal}đ` });
  revalidatePath("/thu-ngan");
  go(inv.id);
}

export async function createRetailInvoice(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const branchId = str(formData, "branchId");
  if (!branchId || (!staff.isOwner && !staff.branchIds.includes(branchId))) redirect("/khong-co-quyen");
  const inv = await prisma.invoice.create({
    data: {
      branchId, kind: "RETAIL", subtotal: 0, total: 0, customerName: str(formData, "customerName") ?? null,
      staffId: staff.id, staffName: staff.fullName,
    },
  });
  revalidatePath("/thu-ngan");
  go(inv.id);
}

export async function addRetailLine(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await loadInvoice(staff, str(formData, "invoiceId"));
  if (inv.kind !== "RETAIL" || inv.status !== "UNPAID") go(inv.id, "Chỉ thêm hàng được vào hóa đơn bán lẻ chưa thanh toán.");
  const itemId = str(formData, "itemId");
  const q = num(formData, "qty");
  if (!itemId) go(inv.id, "Chọn mặt hàng.");
  if (q === undefined || Number.isNaN(q) || q <= 0) go(inv.id, "Số lượng phải lớn hơn 0.");
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || !item.active) go(inv.id, "Mặt hàng không còn bán.");
  const price = (await currentPrices([itemId])).get(itemId);
  if (price === undefined) go(inv.id, `“${item.name}” chưa có giá bán.`);
  const stock = await prisma.stockLot.aggregate({
    where: { itemId, branchId: inv.branchId, qtyRemaining: { gt: 0 }, OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }] },
    _sum: { qtyRemaining: true },
  });
  const have = stock._sum.qtyRemaining ?? 0;
  const already = inv.lines.filter((l) => l.itemId === itemId).reduce((s, l) => s + l.qty, 0);
  if (already + q > have) go(inv.id, `Không đủ tồn: “${item.name}” còn ${have} ${item.unit} tại chi nhánh.`);
  await prisma.invoiceLine.create({
    data: {
      invoiceId: inv.id, kind: item.type === "HERB" ? "HERB" : "PRODUCT", itemId, name: item.name, unit: item.unit,
      qty: q, unitPrice: price, amount: Math.round(q * price), position: inv.lines.length,
    },
  });
  await recalc(inv.id);
  go(inv.id);
}

export async function removeInvoiceLine(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await loadInvoice(staff, str(formData, "invoiceId"));
  if (inv.status !== "UNPAID") go(inv.id, "Hóa đơn đã chốt, không sửa được.");
  const lineId = str(formData, "lineId");
  if (lineId) await prisma.invoiceLine.deleteMany({ where: { id: lineId, invoiceId: inv.id } });
  await recalc(inv.id);
  go(inv.id);
}

// Giảm giá và sửa công khám trước khi thu tiền.
export async function adjustInvoice(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await loadInvoice(staff, str(formData, "invoiceId"));
  if (inv.status !== "UNPAID") go(inv.id, "Hóa đơn đã chốt, không sửa được.");
  const discount = money(formData, "discount");
  const fee = money(formData, "fee");
  if (discount === null || fee === null) go(inv.id, "Tiền phải là số không âm.");
  const feeLine = inv.lines.find((l) => l.kind === "FEE");
  if (fee !== undefined) {
    if (feeLine && fee === 0) await prisma.invoiceLine.delete({ where: { id: feeLine.id } });
    else if (feeLine) await prisma.invoiceLine.update({ where: { id: feeLine.id }, data: { unitPrice: fee, amount: fee } });
    else if (fee > 0 && inv.kind === "EXAM")
      await prisma.invoiceLine.create({ data: { invoiceId: inv.id, kind: "FEE", name: "Công khám", unit: "lần", qty: 1, unitPrice: fee, amount: fee, position: -1 } });
  }
  await prisma.invoice.update({ where: { id: inv.id }, data: { discount: discount ?? 0, note: str(formData, "note") ?? null } });
  await recalc(inv.id);
  go(inv.id);
}

export async function payInvoice(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await loadInvoice(staff, str(formData, "invoiceId"));
  if (inv.status !== "UNPAID") go(inv.id, "Hóa đơn này không ở trạng thái chờ thu.");
  if (inv.lines.length === 0) go(inv.id, "Hóa đơn chưa có dòng nào.");
  const method = str(formData, "method");
  if (!method || !["CASH", "TRANSFER", "CARD"].includes(method)) go(inv.id, "Chọn hình thức thanh toán.");
  const res = await prisma.invoice.updateMany({
    where: { id: inv.id, status: "UNPAID" },
    data: { status: "PAID", method, paidAt: new Date() },
  });
  if (res.count === 0) go(inv.id, "Hóa đơn vừa được xử lý ở nơi khác.");
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: inv.branchId, action: "PAY", entity: "Invoice", entityId: inv.id, detail: `${inv.total}đ · ${method}` });
  revalidatePath("/thu-ngan");
  go(inv.id);
}

export async function voidInvoice(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await loadInvoice(staff, str(formData, "invoiceId"));
  if (inv.status === "VOID") go(inv.id);
  const reason = str(formData, "reason");
  if (!reason) go(inv.id, "Nhập lý do hủy hóa đơn.");
  await prisma.invoice.update({ where: { id: inv.id }, data: { status: "VOID", voidReason: reason } });
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: inv.branchId, action: "VOID", entity: "Invoice", entityId: inv.id, detail: reason });
  revalidatePath("/thu-ngan");
  go(inv.id);
}
