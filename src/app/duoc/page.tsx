import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DISPENSE_ROLES } from "@/lib/permissions";
import { branchesFor, input } from "@/lib/stock";
import { timeVN, vnDayStart } from "@/lib/format";

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
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold font-display">Phát thuốc</h1>
      <form method="get" className="flex items-end gap-2">
        <label className="text-sm flex-1">Chi nhánh
          <select name="cn" defaultValue={branch.id} className={input}>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <button className="rounded-lg border border-brand-gold/50 px-4 py-2.5">Xem</button>
      </form>
      <section className="space-y-2">
        <h2 className="font-semibold text-brand-deep">Đã thu tiền, chờ phát ({waiting.length})</h2>
        {waiting.length === 0 && <p className="text-sm text-gray-600">Không có.</p>}
        {waiting.map((i) => (
          <Link key={i.id} href={`/duoc/${i.id}`} className="card !py-3 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm">HD-{String(i.seq).padStart(6, "0")}</span>
            <span className="flex-1 min-w-0">
              {name(i)} · {i.kind === "RETAIL" ? "Bán lẻ" : "Theo đơn"} · thu lúc {i.paidAt ? timeVN(i.paidAt) : ""}
              {i.patient?.allergies && <span className="text-red-700 font-semibold"> · Dị ứng: {i.patient.allergies}</span>}
            </span>
            <span className="text-sm font-semibold text-brand-deep">Phát thuốc →</span>
          </Link>
        ))}
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold text-brand-deep">Đã phát hôm nay ({done.length})</h2>
        {done.map((i) => (
          <Link key={i.id} href={`/duoc/${i.id}`} className="card !py-3 flex flex-wrap items-center gap-3 opacity-80">
            <span className="font-mono text-sm">HD-{String(i.seq).padStart(6, "0")}</span>
            <span className="flex-1">{name(i)}</span>
            <span className="text-sm">{i.dispensedAt ? timeVN(i.dispensedAt) : ""} · {i.dispensedBy}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
