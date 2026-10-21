import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { branchesFor } from "@/lib/stock";
import { COST_VIEW_ROLES, hasAny } from "@/lib/permissions";
import { dateVN, qty, vnd } from "@/lib/format";
import { KhoTabs } from "@/components/KhoTabs";
import { PageHead, Panel } from "@/components/ui";
import { CalendarClock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LotsPage({ searchParams }: { searchParams: { cn?: string; han?: string } }) {
  const staff = await requireStaff();
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  if (!branch) return <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào.</div>;
  const canCost = hasAny(staff.roles, COST_VIEW_ROLES);
  const now = new Date();
  const lim = searchParams.han === "30" ? 30 : searchParams.han === "90" ? 90 : null;
  const where = {
    branchId: branch.id, qtyRemaining: { gt: 0 },
    ...(searchParams.han === "het" ? { expiryDate: { lt: now } } : lim ? { expiryDate: { gte: now, lte: new Date(now.getTime() + lim * 86400000) } } : {}),
  };
  const lots = await prisma.stockLot.findMany({
    where, orderBy: [{ expiryDate: { sort: "asc", nulls: "last" } }], take: 300,
    include: { item: { select: { name: true, unit: true, code: true } } },
  });
  const tab = (k: string, l: string) => <Link key={k} href={`/kho/lo?cn=${branch.id}${k ? `&han=${k}` : ""}`} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${(searchParams.han ?? "") === k ? "bg-brand-deep text-white" : "border border-slate-200 bg-white hover:bg-slate-50"}`}>{l}</Link>;
  return (
    <div className="space-y-4">
      <PageHead icon={CalendarClock} title="Lô và hạn dùng" sub={`Các lô đang còn hàng · ${branch.name}`} img="/images/art/mortar.jpg" />
      <KhoTabs active="lo" />
      <div className="flex flex-wrap gap-2">{tab("", "Tất cả")}{tab("30", "≤ 30 ngày")}{tab("90", "≤ 90 ngày")}{tab("het", "Đã hết hạn")}</div>
      <Panel pad={false} title={`Lô (${lots.length})`}>
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th>Mã hàng</th><th>Tên mặt hàng</th><th>Ngày nhập</th><th>Hạn dùng</th><th>Còn (ngày)</th><th>Nhà cung cấp</th><th className="text-right">Tồn lô</th>{canCost && <th className="text-right">Giá nhập</th>}</tr></thead>
            <tbody>
              {lots.map((l) => {
                const days = l.expiryDate ? Math.ceil((l.expiryDate.getTime() - now.getTime()) / 86400000) : null;
                return (
                  <tr key={l.id}>
                    <td className="font-mono text-sm">{l.item.code ?? "—"}</td>
                    <td className="font-semibold">{l.item.name}</td>
                    <td>{dateVN(l.receivedAt)}</td>
                    <td>{l.expiryDate ? dateVN(l.expiryDate) : "—"}</td>
                    <td>{days === null ? "—" : days < 0 ? <span className="chip chip-red">Hết hạn</span> : <span className={`chip ${days <= 30 ? "chip-red" : days <= 90 ? "chip-amber" : "chip-green"}`}>{days} ngày</span>}</td>
                    <td>{l.supplier ?? "—"}</td>
                    <td className="text-right tabular-nums">{qty(l.qtyRemaining)} {l.item.unit}</td>
                    {canCost && <td className="text-right tabular-nums">{vnd(l.unitCost)}</td>}
                  </tr>
                );
              })}
              {lots.length === 0 && <tr><td colSpan={8} className="p-4 text-center text-brand-ink/60">Không có lô nào.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
