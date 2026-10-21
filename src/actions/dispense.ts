"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { DISPENSE_ROLES } from "@/lib/permissions";
import { readChecks } from "@/lib/dispense";

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

const KEYS = ["can", "dong", "dan", "kiem"] as const;

function back(id: string, msg?: string): never {
  redirect(`/duoc?sel=${id}${msg ? `&loi=${encodeURIComponent(msg)}` : ""}`);
}

// Lưu nháp: các ô xác nhận + quét/nhập mã để đánh dấu vị đã cân.
export async function saveDispenseDraft(formData: FormData) {
  const staff = await requireRole(...DISPENSE_ROLES);
  const id = String(formData.get("invoiceId") ?? "");
  const inv = await prisma.invoice.findUnique({ where: { id }, include: { lines: true } });
  if (!inv) redirect("/duoc");
  if (!staff.isOwner && !staff.branchIds.includes(inv.branchId)) redirect("/khong-co-quyen");
  if (inv.dispensedAt) back(id, "Đơn đã phát, không sửa được.");
  const cur = readChecks(inv.dispenseChecks);
  const chk: Record<string, boolean> = {};
  for (const k of KEYS) chk[k] = formData.get(`chk_${k}`) === "on";
  let weighed = cur.weighed;
  const scan = String(formData.get("scan") ?? "").trim();
  let msg: string | undefined;
  if (scan) {
    const ids = inv.lines.map((l) => l.itemId).filter(Boolean) as string[];
    const item = await prisma.item.findFirst({
      where: { id: { in: ids }, OR: [{ code: { equals: scan, mode: "insensitive" } }, { name: { contains: scan, mode: "insensitive" } }] },
      select: { id: true, name: true },
    });
    if (!item) msg = `Không thấy “${scan}” trong đơn này.`;
    else if (!weighed.includes(item.id)) weighed = [...weighed, item.id];
  }
  await prisma.invoice.update({ where: { id }, data: { dispenseChecks: JSON.stringify({ chk, weighed }) } });
  revalidatePath("/duoc");
  back(id, msg);
}

// Xác nhận phát: bắt buộc tick đủ 4 bước kiểm tra, rồi trừ kho như dispenseInvoice.
export async function confirmDispense(formData: FormData) {
  for (const k of KEYS) {
    if (formData.get(`chk_${k}`) !== "on") back(String(formData.get("invoiceId") ?? ""), "Cần tick đủ 4 bước: cân đủ số lượng, đóng gói, dán nhãn, kiểm tra lần cuối.");
  }
  await dispenseInvoice(formData);
}
