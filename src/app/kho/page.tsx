import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { branchesFor } from "@/lib/stock";
import { STOCK_WRITE_ROLES, ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";
import { dateVN, qty, vnd } from "@/lib/format";
import Image from "next/image";
import { PageHead, Stat, Panel } from "@/components/ui";
import { Package, Boxes, AlertTriangle, CalendarClock, PackageX, PackagePlus, ClipboardCheck, Tag, Leaf } from "lucide-react";

export const dynamic = "force-dynamic";

const SOON_DAYS = 90;

export default async function StockPage({ searchParams }: { searchParams: { cn?: string; q?: string; chi?: string } }) {
  const staff = await requireStaff();
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  const q = searchParams.q?.trim();
  const onlyLow = searchParams.chi === "thap";

  const canWrite = hasAny(staff.roles, STOCK_WRITE_ROLES);
  const canManage = hasAny(staff.roles, ITEM_MANAGER_ROLES);

  if (!branch) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold font-display">Kho và giá</h1>
        <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>
      </div>
    );
  }

  const [items, lots] = await Promise.all([
    prisma.item.findMany({
      where: { active: true, ...(q ? { name: { contains: q, mode: "insensitive" } } : {}) },
      orderBy: { name: "asc" },
      include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 1 }, herb: { select: { imageUrl: true } } },
    }),
    prisma.stockLot.findMany({
      where: { branchId: branch.id, qtyRemaining: { gt: 0 } },
      select: { itemId: true, qtyRemaining: true, expiryDate: true },
    }),
  ]);

  const now = Date.now();
  const soon = now + SOON_DAYS * 86400000;
  const agg = new Map<string, { total: number; expired: number; soon: number; nearest?: Date }>();
  for (const l of lots) {
    const a = agg.get(l.itemId) ?? { total: 0, expired: 0, soon: 0 };
    a.total += l.qtyRemaining;
    if (l.expiryDate) {
      const t = l.expiryDate.getTime();
      if (t < now) a.expired += l.qtyRemaining;
      else if (t < soon) a.soon += l.qtyRemaining;
      if (!a.nearest || l.expiryDate < a.nearest) a.nearest = l.expiryDate;
    }
    agg.set(l.itemId, a);
  }

  const rows = items
    .map((it) => {
      const a = agg.get(it.id) ?? { total: 0, expired: 0, soon: 0 };
      return { it, a, low: it.minStock > 0 && a.total < it.minStock };
    })
    .filter((r) => !onlyLow || r.low);
  const names = items.filter((i) => !i.herb?.imageUrl).map((i) => i.name);
  const herbPics = names.length ? await prisma.herb.findMany({ where: { standardName: { in: names }, imageUrl: { not: null } }, select: { standardName: true, imageUrl: true } }) : [];
  const picOf = new Map(herbPics.map((h) => [h.standardName, h.imageUrl as string]));
  const soonCount = items.filter((it) => (agg.get(it.id)?.soon ?? 0) > 0).length;
  const expiredCount = items.filter((it) => (agg.get(it.id)?.expired ?? 0) > 0).length;
  const lowCount = items.filter((it) => it.minStock > 0 && (agg.get(it.id)?.total ?? 0) < it.minStock).length;

  const btn = "flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold hover:border-brand-deep";
  return (
    <div className="space-y-4">
      <PageHead icon={Package} title="Kho và giá" sub={`Quản lý vị thuốc, dược liệu, giá bán và tồn kho · ${branch.name}`} img="/images/art/mortar.jpg">
        {canWrite && <Link href="/kho/nhap" className="flex items-center gap-2 rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white hover:bg-brand-deeper"><PackagePlus className="h-5 w-5" />Nhập kho</Link>}
        {canWrite && <Link href="/kho/dieu-chinh" className={btn}><ClipboardCheck className="h-5 w-5" />Điều chỉnh / Kiểm kê</Link>}
        <Link href="/kho/mat-hang" className={btn}><Tag className="h-5 w-5" />{canManage ? "Mặt hàng và giá" : "Bảng giá"}</Link>
      </PageHead>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={Boxes} label="Tổng số mặt hàng" value={items.length} unit="vị thuốc, thành phẩm" tone="green" />
        <Stat icon={AlertTriangle} label="Dưới mức tối thiểu" value={lowCount} unit="mặt hàng cần nhập" tone="red" href={`/kho?cn=${branch.id}&chi=thap`} />
        <Stat icon={CalendarClock} label="Gần hết hạn" value={soonCount} unit={`mặt hàng (≤ ${SOON_DAYS} ngày)`} tone="amber" />
        <Stat icon={PackageX} label="Đã hết hạn" value={expiredCount} unit="mặt hàng" tone="purple" />
      </div>

      <form className="card !p-3 flex flex-wrap items-center gap-3" method="get">
        <input type="hidden" name="cn" value={branch.id} />
        <input name="q" defaultValue={q} placeholder="Tìm theo tên thuốc…" className="min-w-[14rem] flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5" />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="chi" value="thap" defaultChecked={onlyLow} className="h-5 w-5" /> Chỉ sắp hết
        </label>
        <button type="submit" className="rounded-xl bg-brand-deep px-6 py-2.5 font-semibold text-white">Tìm</button>
      </form>

      <Panel pad={false} icon={Leaf} title={`Tồn kho (${rows.length} mặt hàng)`}>
        {items.length === 0 ? (
          <p className="p-4 text-sm text-brand-ink/60">Chưa có mặt hàng nào. {canManage ? "Vào “Mặt hàng và giá” để thêm." : "Nhờ quản lý thêm mặt hàng."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-12">STT</th><th>Tên mặt hàng</th><th>Loại</th><th>Hạn gần nhất</th><th className="text-right">Tồn kho</th><th>ĐV</th><th className="text-right">Tối thiểu</th><th className="text-right">Giá bán</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {rows.map(({ it, a, low }, k) => {
                  const pic = it.herb?.imageUrl ?? picOf.get(it.name);
                  return (
                    <tr key={it.id}>
                      <td className="text-brand-ink/60">{k + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          {pic ? <Image src={pic} alt="" width={44} height={44} className="h-11 w-11 rounded-lg object-cover ring-1 ring-slate-200" /> : <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><Leaf className="h-5 w-5" /></span>}
                          <span className="font-semibold">{it.name}</span>
                        </div>
                      </td>
                      <td>{it.type === "HERB" ? "Vị thuốc" : "Thành phẩm"}</td>
                      <td>{a.nearest ? dateVN(a.nearest) : "—"}</td>
                      <td className={`text-right font-bold tabular-nums ${low ? "text-red-700" : ""}`}>{qty(a.total)}</td>
                      <td>{it.unit}</td>
                      <td className="text-right text-brand-ink/70">{it.minStock > 0 ? qty(it.minStock) : "—"}</td>
                      <td className="text-right tabular-nums">{it.prices[0] ? `${vnd(it.prices[0].price)}/${it.unit}` : "—"}</td>
                      <td>
                        {a.expired > 0 ? <span className="chip chip-red">Có lô hết hạn</span>
                          : low ? <span className="chip chip-red">Dưới tối thiểu</span>
                          : a.soon > 0 ? <span className="chip chip-amber">Gần hết hạn</span>
                          : <span className="chip chip-green">Còn hàng</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
