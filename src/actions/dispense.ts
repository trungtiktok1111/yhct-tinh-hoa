"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { DISPENSE_ROLES } from "@/lib/permissions";

function go(id: string, error?: string): never {
  redirect(`/duoc/${id}${error ? `?loi=${encodeURIComponent(error)}` : ""}`);
}

// Phát thuốc: trừ kho theo lô hết hạn sớm nhất trước (bỏ lô đã hết hạn).
export async function dispenseInvoice(formData: FormData) {
  const staff = await requireRole(...DISPENSE_ROLES);
  const id = String(formData.get("invoiceId") ?? "");
  const inv = await prisma.invoice.findUnique({ where: { id }, include: { lines: true } });
  if (!inv) redirect("/duoc");
  if (!staff.isOwner && !staff.branchIds.includes(inv.branchId)) redirect("/khong-co-quyen");
  if (inv.status !== "PAID") go(id, "Chỉ phát thuốc khi hóa đơn đã thu tiền.");
  if (inv.dispensedAt) go(id, "Hóa đơn này đã phát thuốc.");
  const code = `HD-${String(inv.seq).padStart(6, "0")}`;

  const err = await prisma.$transaction(async (tx) => {
    // Giữ chỗ trước để hai người bấm cùng lúc không trừ kho hai lần.
    const claim = await tx.invoice.updateMany({
      where: { id, status: "PAID", dispensedAt: null },
      data: { dispensedAt: new Date(), dispensedBy: staff.fullName },
    });
    if (claim.count === 0) return "Hóa đơn vừa được xử lý ở nơi khác.";
    const need = new Map<string, { name: string; unit: string; qty: number }>();
    for (const l of inv.lines) {
      if (!l.itemId) continue;
      const e = need.get(l.itemId) ?? { name: l.name, unit: l.unit, qty: 0 };
      e.qty += l.qty;
      need.set(l.itemId, e);
    }
    for (const [itemId, n] of need) {
      let left = n.qty;
      const lots = await tx.stockLot.findMany({
        where: { itemId, branchId: inv.branchId, qtyRemaining: { gt: 0 }, OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }] },
        orderBy: [{ expiryDate: { sort: "asc", nulls: "last" } }, { receivedAt: "asc" }],
      });
      const have = lots.reduce((s, l) => s + l.qtyRemaining, 0);
      if (have + 1e-9 < left) throw new Error(`Không đủ tồn: ${n.name} cần ${n.qty} ${n.unit}, còn ${have} ${n.unit} (chưa tính lô hết hạn).`);
      for (const l of lots) {
        if (left <= 1e-9) break;
        const take = Math.min(l.qtyRemaining, left);
        await tx.stockLot.update({ where: { id: l.id }, data: { qtyRemaining: l.qtyRemaining - take } });
        await tx.stockMove.create({
          data: { itemId, branchId: inv.branchId, lotId: l.id, type: "DISPENSE", qty: -take, reason: `Phát thuốc ${code}`, invoiceId: id, staffName: staff.fullName },
        });
        left -= take;
      }
    }
    return null;
  }).catch((e: unknown) => (e instanceof Error ? e.message : "Không phát được thuốc."));

  if (err) go(id, err);
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: inv.branchId, action: "DISPENSE", entity: "Invoice", entityId: id, detail: code });
  revalidatePath("/duoc");
  revalidatePath("/kho");
  go(id);
}
