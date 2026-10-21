import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DISPENSE_ROLES } from "@/lib/permissions";
import { BackLink } from "@/components/BackLink";
import { PrintButton } from "@/components/PrintButton";
import { patientCode, qty as fq, dateVN } from "@/lib/format";

export const dynamic = "force-dynamic";

// Trang in nhãn thuốc và phiếu hướng dẫn dùng thuốc.
export default async function PrintPage({ params, searchParams }: { params: { id: string }; searchParams: { kieu?: string } }) {
  const staff = await requireRole(...DISPENSE_ROLES);
  const inv = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      lines: { orderBy: { position: "asc" } }, patient: true, branch: { select: { name: true, phone: true } },
      visit: { include: { exam: { include: { prescription: true } } } },
    },
  });
  if (!inv) notFound();
  if (!staff.isOwner && !staff.branchIds.includes(inv.branchId)) redirect("/khong-co-quyen");
  const rx = inv.visit?.exam?.prescription;
  const drugs = inv.lines.filter((l) => l.itemId);
  const who = inv.patient?.fullName ?? inv.customerName ?? "Khách lẻ";
  const huongdan = searchParams.kieu === "huongdan";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 print:hidden"><BackLink href={`/duoc?sel=${inv.id}`} label="Phát thuốc" /><PrintButton label={huongdan ? "In hướng dẫn" : "In nhãn"} /></div>
      {huongdan ? (
        <div className="card mx-auto max-w-2xl space-y-3 text-sm">
          <div className="text-center"><div className="brand-serif text-xl font-bold text-brand-deep">YHCT TINH HOA</div><div>{inv.branch.name}{inv.branch.phone ? ` · ĐT ${inv.branch.phone}` : ""}</div></div>
          <h1 className="text-center text-lg font-bold">HƯỚNG DẪN DÙNG THUỐC</h1>
          <div>Bệnh nhân: <b>{who}</b>{inv.patient ? ` · ${patientCode(inv.patient.seq)}` : ""} · Ngày {dateVN(inv.dispensedAt ?? inv.createdAt)}</div>
          {rx?.thangCount ? <div>Số thang: <b>{rx.thangCount}</b></div> : null}
          <div>Cách sắc, cách dùng: {rx?.decoctionNote || "Theo chỉ dẫn của bác sĩ."}</div>
          <div>Dặn dò: {inv.visit?.exam?.advice || "—"}</div>
          {inv.patient?.allergies && <div className="warn-box"><b>Dị ứng:</b> {inv.patient.allergies}</div>}
          {inv.visit?.exam?.followUpDate && <div>Hẹn tái khám: <b>{dateVN(inv.visit.exam.followUpDate)}</b></div>}
          <div className="text-center text-xs italic">Nếu có dấu hiệu bất thường, ngừng thuốc và liên hệ phòng khám.</div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {drugs.map((l) => (
            <div key={l.id} className="card space-y-1 border-2 border-dashed text-sm">
              <div className="text-center font-bold text-brand-deep">YHCT TINH HOA</div>
              <div className="text-base font-bold">{l.name}</div>
              <div>Số lượng: <b>{fq(l.qty)} {l.unit}</b></div>
              <div>BN: {who} · {dateVN(inv.dispensedAt ?? inv.createdAt)}</div>
              <div className="text-xs text-brand-ink/70">{rx?.decoctionNote || ""}</div>
            </div>
          ))}
          {drugs.length === 0 && <p className="text-sm">Đơn không có thuốc.</p>}
        </div>
      )}
    </div>
  );
}
