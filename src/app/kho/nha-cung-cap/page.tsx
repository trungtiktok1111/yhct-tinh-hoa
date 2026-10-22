import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { STOCK_WRITE_ROLES, hasAny } from "@/lib/permissions";
import { saveSupplier, toggleSupplier } from "@/actions/supplier";
import { KhoTabs } from "@/components/KhoTabs";
import { PageHead, Panel } from "@/components/ui";
import { input } from "@/lib/stock";
import { dateVN } from "@/lib/format";
import { Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuppliersPage({ searchParams }: { searchParams: { loi?: string } }) {
  const staff = await requireStaff();
  const canWrite = hasAny(staff.roles, STOCK_WRITE_ROLES);
  const [list, lots] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
    prisma.stockLot.groupBy({ by: ["supplierId"], where: { supplierId: { not: null } }, _count: { _all: true }, _max: { receivedAt: true } }),
  ]);
  const stat = new Map(lots.map((l) => [l.supplierId, l]));
  return (
    <div className="space-y-4">
      <PageHead icon={Truck} title="Nhà cung cấp" sub="Danh sách nhà cung cấp dược liệu, thành phẩm" img="/images/art/herbs-wide.jpg" />
      <KhoTabs active="ncc" />
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      <Panel pad={false} title={`Danh sách (${list.length})`}>
        {list.length === 0 ? <p className="p-4 text-sm text-brand-ink/70">Chưa có nhà cung cấp.</p> : (
          <table>
            <thead><tr><th>Tên</th><th>Điện thoại</th><th>Địa chỉ</th><th className="text-right">Số lô</th><th>Nhập gần nhất</th><th /></tr></thead>
            <tbody>
              {list.map((s) => {
                const st = stat.get(s.id);
                return (
                  <tr key={s.id} className={s.active ? "" : "opacity-50"}>
                    <td className="font-semibold">{s.name}{s.note && <div className="text-xs font-normal text-brand-ink/70">{s.note}</div>}</td>
                    <td>{s.phone ?? "—"}</td><td>{s.address ?? "—"}</td>
                    <td className="text-right">{st?._count._all ?? 0}</td>
                    <td>{st?._max.receivedAt ? dateVN(st._max.receivedAt) : "—"}</td>
                    <td>{canWrite && <form action={toggleSupplier}><input type="hidden" name="id" value={s.id} /><button className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">{s.active ? "Ngừng" : "Dùng lại"}</button></form>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Panel>
      {canWrite && (
        <Panel title="Thêm nhà cung cấp">
          <form action={saveSupplier} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm">Tên<input name="name" required className={input} /></label>
            <label className="text-sm">Điện thoại<input name="phone" className={input} /></label>
            <label className="text-sm">Địa chỉ<input name="address" className={input} /></label>
            <label className="text-sm">Ghi chú<input name="note" className={input} /></label>
            <button className="rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white sm:col-span-2 lg:col-span-4">Thêm nhà cung cấp</button>
          </form>
        </Panel>
      )}
    </div>
  );
}
