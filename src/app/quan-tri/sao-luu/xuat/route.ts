import { prisma } from "@/lib/db";
import { getCurrentStaff, logAudit } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Sao lưu: tải file JSON các bảng chính (không gồm mật khẩu) và ghi BackupLog.
export async function GET() {
  const staff = await getCurrentStaff();
  if (!staff || !staff.isOwner) return new Response("Chỉ chủ phòng khám được sao lưu", { status: 403 });
  try {
    const [branches, staffs, patients, visits, exams, invoices, invoiceLines, items, lots, moves, suppliers, services] = await Promise.all([
      prisma.branch.findMany(),
      prisma.staff.findMany({ select: { id: true, username: true, fullName: true, role: true, active: true, phone: true, email: true, jobTitle: true } }),
      prisma.patient.findMany(),
      prisma.visit.findMany(),
      prisma.exam.findMany(),
      prisma.invoice.findMany(),
      prisma.invoiceLine.findMany(),
      prisma.item.findMany(),
      prisma.stockLot.findMany(),
      prisma.stockMove.findMany(),
      prisma.supplier.findMany(),
      prisma.serviceItem.findMany(),
    ]);
    const body = JSON.stringify(
      { exportedAt: new Date().toISOString(), by: staff.fullName, branches, staff: staffs, patients, visits, exams, invoices, invoiceLines, items, stockLots: lots, stockMoves: moves, suppliers, services },
      null, 1
    );
    const bytes = Buffer.byteLength(body, "utf8");
    await prisma.backupLog.create({ data: { status: "OK", staffName: staff.fullName, bytes, note: `${patients.length} bệnh nhân, ${visits.length} lượt khám, ${invoices.length} hóa đơn` } });
    await logAudit({ staffId: staff.id, staffName: staff.fullName, action: "BACKUP", entity: "System", detail: `${bytes} bytes` });
    const d = new Date().toISOString().slice(0, 10);
    return new Response(body, { headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="yhct-sao-luu-${d}.json"` } });
  } catch (e) {
    await prisma.backupLog.create({ data: { status: "FAIL", staffName: staff.fullName, note: e instanceof Error ? e.message.slice(0, 200) : "Lỗi" } }).catch(() => null);
    return new Response("Sao lưu thất bại", { status: 500 });
  }
}
