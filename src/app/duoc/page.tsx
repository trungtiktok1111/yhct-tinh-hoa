import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DISPENSE_ROLES } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { timeVN, vnDayStart, vnd } from "@/lib/format";
import { PageHead, Stat, Panel } from "@/components/ui";
import { Pill, Hourglass, CheckCircle2, AlertTriangle, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DispenseQueuePage({ searchParams }: { searchParams: { cn?: string } }) {
  const staff = await requireRole(...DISPENSE_ROLES);
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  if (!branch) {
    return <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>;
  }
  const base = { branchId: branch.id, status: "PAID", lines: { some: { itemId: { not: null } } } };
  const [waiting, done] = await Promise.all([
    prisma.invoice.findMany({
      where: { ...base, dispensedAt: null }, orderBy: { paidAt: "asc" },
      include: { patient: { select: { fullName: true, allergies: true } }, _count: { select: { lines: true } } },
    }),
    prisma.invoice.findMany({
      where: { ...base, dispensedAt: { gte: vnDayStart() } }, orderBy: { dispensedAt: "desc" },
      include: { patient: { select: { fullName: true } } },
    }),
  ]);
  const name = (i: { patient: { fullName: string } | null; customerName: string | null }) => i.patient?.fullName ?? i.customerName ?? "Khách lẻ";
  const dayName = new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <div className="space-y-4">
      <PageHead icon={Pill} title="Phát thuốc" sub={`Hôm nay, ${dayName}`} img="/images/art/herbs-wide.jpg" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Stat icon={Package} label="Đơn đã thanh toán, chờ phát" value={waiting.length} unit="đơn" tone="amber" />
        <Stat icon={CheckCircle2} label="Đã phát hôm nay" value={done.length} unit="đơn" tone="green" />
        <Stat icon={AlertTriangle} label="Đơn có bệnh nhân dị ứng" value={waiting.filter((i) => i.patient?.allergies).length} unit="đơn chờ phát" tone="red" />
      </div>

      <Panel icon={Hourglass} title={`Danh sách đơn chờ phát thuốc (${waiting.length})`} pad={false} tone="text-amber-600">
        {waiting.length === 0 ? <p className="p-4 text-sm text-brand-ink/60">Không có đơn nào chờ phát.</p> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-12">STT</th><th>Bệnh nhân</th><th>Mã đơn</th><th>Loại</th><th>Thu lúc</th><th className="text-right">Số dòng</th><th>Lưu ý</th><th></th></tr></thead>
              <tbody>
                {waiting.map((i, k) => (
                  <tr key={i.id}>
                    <td className="text-brand-ink/60">{k + 1}</td>
                    <td className="font-semibold">{name(i)}</td>
                    <td className="font-mono text-sm">HD-{String(i.seq).padStart(6, "0")}</td>
                    <td>{i.kind === "RETAIL" ? "Bán lẻ" : "Theo đơn"}</td>
                    <td>{i.paidAt ? timeVN(i.paidAt) : ""}</td>
                    <td className="text-right">{i._count.lines}</td>
                    <td>{i.patient?.allergies ? <span className="chip chip-red">Dị ứng: {i.patient.allergies}</span> : <span className="chip chip-green">Đã thanh toán</span>}</td>
                    <td><Link href={`/duoc/${i.id}`} className="rounded-lg bg-brand-deep px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-deeper">Soạn thuốc</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel icon={CheckCircle2} title={`Đã phát hôm nay (${done.length})`} pad={false}>
        {done.length === 0 ? <p className="p-4 text-sm text-brand-ink/60">Chưa phát đơn nào.</p> : (
          <table>
            <thead><tr><th>Mã đơn</th><th>Bệnh nhân</th><th>Phát lúc</th><th>Người phát</th><th></th></tr></thead>
            <tbody>
              {done.map((i) => (
                <tr key={i.id}>
                  <td className="font-mono text-sm">HD-{String(i.seq).padStart(6, "0")}</td>
                  <td className="font-semibold">{name(i)}</td>
                  <td>{i.dispensedAt ? timeVN(i.dispensedAt) : ""}</td>
                  <td>{i.dispensedBy}</td>
                  <td><Link href={`/duoc/${i.id}`} className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">Xem</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
