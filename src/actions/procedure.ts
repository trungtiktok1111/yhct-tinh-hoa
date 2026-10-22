"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { ITEM_MANAGER_ROLES, PROCEDURE_ROLES, hasAny } from "@/lib/permissions";

const back = (cn: string | undefined, msg?: string, ok = false): never =>
  redirect(`/thu-thuat?${cn ? `cn=${cn}&` : ""}${msg ? `${ok ? "ok" : "loi"}=${encodeURIComponent(msg)}` : ""}`);
const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
};

async function load(formData: FormData) {
  const staff = await requireRole(...PROCEDURE_ROLES);
  const o = await prisma.procedureOrder.findUnique({ where: { id: str(formData, "id") ?? "" } });
  if (!o) back(undefined, "Không tìm thấy phiếu thủ thuật.");
  if (!staff.isOwner && !staff.branchIds.includes(o!.branchId)) redirect("/khong-co-quyen");
  return { staff, o: o! };
}

// Bắt đầu: người bấm là người thực hiện, ghi giờ bắt đầu.
export async function startProcedure(formData: FormData) {
  const { staff, o } = await load(formData);
  const r = await prisma.procedureOrder.updateMany({
    where: { id: o.id, status: "PENDING" },
    data: { status: "IN_PROGRESS", performerId: staff.id, performerName: staff.fullName, startedAt: new Date() },
  });
  if (r.count !== 1) back(o.branchId, "Phiếu này đã được người khác bắt đầu hoặc đã hủy.");
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: o.branchId, action: "UPDATE", entity: "ProcedureOrder", entityId: o.id, detail: `Bắt đầu ${o.name} (buổi ${o.sessionNo})` });
  revalidatePath("/thu-thuat");
  back(o.branchId, `Đã bắt đầu ${o.name}.`, true);
}

// Hoàn thành: ghi giờ kết thúc, nhận xét; tự trừ vật tư tiêu hao theo định mức của thủ thuật, theo lô hết hạn sớm nhất.
export async function completeProcedure(formData: FormData) {
  const { staff, o } = await load(formData);
  if (o.status !== "IN_PROGRESS") back(o.branchId, "Phiếu này chưa bắt đầu hoặc đã xong.");
  const mine = o.performerId === staff.id;
  if (!mine && !hasAny(staff.roles, ITEM_MANAGER_ROLES)) back(o.branchId, `Thủ thuật này do ${o.performerName ?? "người khác"} đang làm, chỉ người đó hoặc quản lý mới hoàn thành được.`);
  const note = str(formData, "note") ?? null;
  const totalRaw = str(formData, "sessionTotal");
  const sessionTotal = totalRaw ? Math.round(Number(totalRaw)) : o.sessionTotal;
  if (totalRaw && (!Number.isFinite(sessionTotal) || (sessionTotal as number) < o.sessionNo || (sessionTotal as number) > 60)) back(o.branchId, `Tổng số buổi phải từ ${o.sessionNo} đến 60.`);
  const supplies = o.serviceId ? await prisma.serviceSupply.findMany({ where: { serviceId: o.serviceId } }) : [];
  const names = await prisma.patient.findUnique({ where: { id: o.patientId ?? "" }, select: { fullName: true } });
  try {
    await prisma.$transaction(async (tx) => {
      const claim = await tx.procedureOrder.updateMany({
        where: { id: o.id, status: "IN_PROGRESS" },
        data: { status: "DONE", endedAt: new Date(), note, sessionTotal: sessionTotal ?? null },
      });
      if (claim.count !== 1) throw new Error("Phiếu vừa được xử lý ở nơi khác.");
      for (const s of supplies) {
        const lots = await tx.stockLot.findMany({
          where: { itemId: s.itemId, branchId: o.branchId, qtyRemaining: { gt: 0 }, OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }] },
          orderBy: [{ expiryDate: { sort: "asc", nulls: "last" } }, { receivedAt: "asc" }],
        });
        let need = s.qty;
        for (const l of lots) {
          if (need <= 1e-9) break;
          const take = Math.min(l.qtyRemaining, need);
          await tx.stockLot.update({ where: { id: l.id }, data: { qtyRemaining: l.qtyRemaining - take } });
          await tx.stockMove.create({ data: { itemId: s.itemId, branchId: o.branchId, lotId: l.id, type: "DISPENSE", qty: -take, reason: `Thủ thuật: ${o.name}${names ? ` · ${names.fullName}` : ""}`, staffName: staff.fullName } });
          need -= take;
        }
        if (need > 1e-9) {
          const it = await tx.item.findUnique({ where: { id: s.itemId }, select: { name: true, unit: true } });
          throw new Error(`Không đủ vật tư “${it?.name ?? s.itemId}” trong kho (thiếu ${Math.round(need * 100) / 100} ${it?.unit ?? ""}). Nhập thêm kho rồi hoàn thành lại, chưa ghi gì.`);
        }
      }
    }, { timeout: 30_000 });
  } catch (e) {
    back(o.branchId, e instanceof Error ? e.message : "Không lưu được, chưa ghi gì.");
  }
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: o.branchId, action: "UPDATE", entity: "ProcedureOrder", entityId: o.id, detail: `Xong ${o.name} (buổi ${o.sessionNo}${sessionTotal ? `/${sessionTotal}` : ""})${supplies.length ? `, trừ ${supplies.length} loại vật tư` : ""}` });
  revalidatePath("/thu-thuat");
  revalidatePath("/kho");
  back(o.branchId, `Đã hoàn thành ${o.name}.`, true);
}

// Hủy phiếu (bệnh nhân không làm nữa). Chỉ phiếu chưa làm; cần lý do.
export async function cancelProcedure(formData: FormData) {
  const { staff, o } = await load(formData);
  if (!hasAny(staff.roles, ITEM_MANAGER_ROLES) && !hasAny(staff.roles, ["DOCTOR", "TECHNICIAN"])) redirect("/khong-co-quyen");
  const reason = str(formData, "reason");
  if (!reason) back(o.branchId, "Nhập lý do hủy thủ thuật.");
  const r = await prisma.procedureOrder.updateMany({ where: { id: o.id, status: { in: ["PENDING", "IN_PROGRESS"] } }, data: { status: "CANCELLED", cancelReason: reason } });
  if (r.count !== 1) back(o.branchId, "Phiếu này đã xong hoặc đã hủy.");
  await logAudit({ staffId: staff.id, staffName: staff.fullName, branchId: o.branchId, action: "UPDATE", entity: "ProcedureOrder", entityId: o.id, detail: `Hủy ${o.name}: ${reason}` });
  revalidatePath("/thu-thuat");
  back(o.branchId, `Đã hủy ${o.name}.`, true);
}
