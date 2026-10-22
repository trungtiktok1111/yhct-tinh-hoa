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
  const discount = inv.discountPct > 0 ? Math.round((subtotal * inv.discountPct) / 100) : Math.min(inv.discount, subtotal);
  const vat = Math.round(((subtotal - discount) * inv.vatPct) / 100);
  await prisma.invoice.update({ where: { id: invoiceId }, data: { subtotal, discount, vat, total: subtotal - discount + vat } });
}

// Hóa đơn đã thu: mỗi buổi của dòng dịch vụ là thủ thuật → một phiếu thủ thuật chờ y sĩ làm.
// Số buổi = số lượng của dòng (liệu trình trả trước); buổi thứ mấy tính nối tiếp các buổi cũ của cùng bệnh nhân.
async function createProcedureOrders(inv: { id: string; branchId: string; visitId: string | null; patientId: string | null; lines: { serviceId: string | null; name: string; qty: number }[] }) {
  const ids = inv.lines.map((l) => l.serviceId).filter((x): x is string => !!x);
  if (!ids.length) return;
  const svcs = await prisma.serviceItem.findMany({ where: { id: { in: ids }, procedure: true }, select: { id: true } });
  const procIds = new Set(svcs.map((s) => s.id));
  for (const l of inv.lines) {
    if (!l.serviceId || !procIds.has(l.serviceId)) continue;
    const n = Math.min(30, Math.max(1, Math.round(l.qty)));
    const before = inv.patientId
      ? await prisma.procedureOrder.count({ where: { patientId: inv.patientId, serviceId: l.serviceId, status: { not: "CANCELLED" } } })
      : 0;
    await prisma.procedureOrder.createMany({
      data: Array.from({ length: n }, (_, i) => ({
        branchId: inv.branchId, visitId: inv.visitId, invoiceId: inv.id, patientId: inv.patientId, serviceId: l.serviceId,
        name: l.name, sessionNo: before + i + 1, sessionTotal: n > 1 ? n : null,
      })),
    });
  }
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
  let fee = money(formData, "fee");
  if (fee === null) redirect(`/thu-ngan?loi=${encodeURIComponent("Tiền công khám phải là số.")}`);
  let feeName = "Khám và tư vấn YHCT";
  if (fee === undefined) {
    const svc = await prisma.serviceItem.findFirst({ where: { active: true }, orderBy: { position: "asc" } });
    if (svc) { fee = svc.price; feeName = svc.name; }
  }
  const rx = visit.exam.prescription;
  const lines = rx?.lines ?? [];
  const prices = await currentPrices(lines.map((l) => l.itemId));
  const noPrice = lines.filter((l) => !prices.has(l.itemId)).map((l) => l.itemName);
  if (noPrice.length)
    redirect(`/thu-ngan?loi=${encodeURIComponent(`Chưa có giá bán: ${noPrice.join(", ")}. Nhờ quản lý đặt giá ở “Kho và giá”.`)}`);
  const thang = Math.max(rx?.thangCount ?? 0, 1);
  const data = [];
  let pos = 0;
  if (fee) data.push({ kind: "FEE", itemId: null, name: feeName, unit: "Lần", qty: 1, unitPrice: fee, amount: fee, position: pos++ });
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
  if (inv.status !== "UNPAID") go(inv.id, "Chỉ thêm hàng được vào hóa đơn chưa thanh toán.");
  const itemId = str(formData, "itemId");
  const q = num(formData, "qty");
  if (!itemId) go(inv.id, "Chọn mặt hàng.");
  if (q === undefined || Number.isNaN(q) || q <= 0) go(inv.id, "Số lượng phải lớn hơn 0.");
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || !item.active) go(inv.id, "Mặt hàng không còn bán.");
  if (item.type === "SUPPLY") go(inv.id, `“${item.name}” là vật tư y tế tiêu hao, không bán trên hóa đơn.`);
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

// Thêm dịch vụ khám chữa bệnh từ danh mục.
export async function addServiceLine(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await loadInvoice(staff, str(formData, "invoiceId"));
  if (inv.status !== "UNPAID") go(inv.id, "Hóa đơn đã chốt, không sửa được.");
  const svc = await prisma.serviceItem.findUnique({ where: { id: str(formData, "serviceId") ?? "" } });
  if (!svc || !svc.active) go(inv.id, "Chọn dịch vụ.");
  const q = num(formData, "qty") ?? 1;
  if (Number.isNaN(q) || q <= 0) go(inv.id, "Số lượng phải lớn hơn 0.");
  await prisma.invoiceLine.create({
    data: { invoiceId: inv.id, kind: "FEE", serviceId: svc.id, name: svc.name, unit: svc.unit, qty: q, unitPrice: svc.price, amount: Math.round(q * svc.price), position: inv.lines.length },
  });
  await recalc(inv.id);
  go(inv.id);
}

// Sửa số lượng và giảm giá % của một dòng.
export async function updateInvoiceLine(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await loadInvoice(staff, str(formData, "invoiceId"));
  if (inv.status !== "UNPAID") go(inv.id, "Hóa đơn đã chốt, không sửa được.");
  const line = inv.lines.find((l) => l.id === str(formData, "lineId"));
  if (!line) go(inv.id);
  const q = num(formData, "qty");
  const d = num(formData, "discountPct") ?? 0;
  if (q === undefined || Number.isNaN(q) || q <= 0) go(inv.id, "Số lượng phải lớn hơn 0.");
  if (Number.isNaN(d) || d < 0 || d > 100) go(inv.id, "Giảm giá phải từ 0 đến 100%.");
  if (line.itemId) {
    const stock = await prisma.stockLot.aggregate({
      where: { itemId: line.itemId, branchId: inv.branchId, qtyRemaining: { gt: 0 }, OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }] },
      _sum: { qtyRemaining: true },
    });
    const have = stock._sum.qtyRemaining ?? 0;
    if (q > have) go(inv.id, `Không đủ tồn: “${line.name}” còn ${have} ${line.unit}.`);
  }
  const pct = Math.round(d);
  await prisma.invoiceLine.update({
    where: { id: line.id },
    data: { qty: q, discountPct: pct, amount: Math.round(q * line.unitPrice * (1 - pct / 100)) },
  });
  await recalc(inv.id);
  go(inv.id);
}

// Giảm giá chung (%), VAT (%) và ghi chú trước khi thu tiền.
export async function adjustInvoice(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await loadInvoice(staff, str(formData, "invoiceId"));
  if (inv.status !== "UNPAID") go(inv.id, "Hóa đơn đã chốt, không sửa được.");
  const dp = num(formData, "discountPct") ?? 0;
  const vp = num(formData, "vatPct") ?? 0;
  if (Number.isNaN(dp) || dp < 0 || dp > 100) go(inv.id, "Giảm giá chung phải từ 0 đến 100%.");
  if (Number.isNaN(vp) || ![0, 5, 8, 10].includes(vp)) go(inv.id, "VAT chỉ nhận 0, 5, 8 hoặc 10%.");
  await prisma.invoice.update({ where: { id: inv.id }, data: { discountPct: Math.round(dp), vatPct: vp, note: str(formData, "note") ?? inv.note } });
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
  const given = money(formData, "cashGiven");
  if (given === null) go(inv.id, "Tiền khách đưa phải là số.");
  if (method === "CASH" && given !== undefined && given < inv.total) go(inv.id, "Tiền khách đưa chưa đủ.");
  const res = await prisma.invoice.updateMany({
    where: { id: inv.id, status: "UNPAID" },
    data: { status: "PAID", method, paidAt: new Date(), cashGiven: method === "CASH" ? given ?? null : null },
  });
  if (res.count === 0) go(inv.id, "Hóa đơn vừa được xử lý ở nơi khác.");
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: inv.branchId, action: "PAY", entity: "Invoice", entityId: inv.id, detail: `${inv.total}đ · ${method}` });
  await createProcedureOrders(inv);
  revalidatePath("/thu-ngan");
  go(inv.id);
}

export async function voidInvoice(formData: FormData) {
  const staff = await requireRole(...CASHIER_ROLES);
  const inv = await loadInvoice(staff, str(formData, "invoiceId"));
  if (inv.status === "VOID") go(inv.id);
  if (inv.dispensedAt) go(inv.id, "Thuốc đã phát, không hủy được hóa đơn. Cần hoàn kho thì nhờ dược sĩ điều chỉnh tăng kho.");
  const reason = str(formData, "reason");
  if (!reason) go(inv.id, "Nhập lý do hủy hóa đơn.");
  const doneProc = await prisma.procedureOrder.count({ where: { invoiceId: inv.id, status: { in: ["IN_PROGRESS", "DONE"] } } });
  if (doneProc > 0) go(inv.id, "Đã có thủ thuật được thực hiện theo hóa đơn này, không hủy được hóa đơn.");
  await prisma.invoice.update({ where: { id: inv.id }, data: { status: "VOID", voidReason: reason } });
  await prisma.procedureOrder.updateMany({ where: { invoiceId: inv.id, status: "PENDING" }, data: { status: "CANCELLED", cancelReason: `Hủy hóa đơn: ${reason}` } });
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: inv.branchId, action: "VOID", entity: "Invoice", entityId: inv.id, detail: reason });
  revalidatePath("/thu-ngan");
  go(inv.id);
}
