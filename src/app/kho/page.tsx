import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { branchesFor } from "@/lib/stock";
import { STOCK_WRITE_ROLES, ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";
import { dateVN, qty, vnd } from "@/lib/format";
import Image from "next/image";
import { PageHead, Stat, Panel } from "@/components/ui";
import { X, Search, Download, SlidersHorizontal, Coins } from "lucide-react";
import { KhoTabs } from "@/components/KhoTabs";
import { MoreVertical } from "lucide-react";
import { COST_VIEW_ROLES } from "@/lib/permissions";
import { Package, Boxes, AlertTriangle, CalendarClock, PackageX, PackagePlus, ClipboardCheck, Tag, Leaf } from "lucide-react";

export const dynamic = "force-dynamic";

const SOON_DAYS = 90;

export default async function StockPage({ searchParams }: { searchParams: { cn?: string; q?: string; chi?: string; loai?: string; sel?: string; tt?: string; han?: string; dt?: string; trang?: string; n?: string } }) {
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
      where: { active: true, ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { code: { contains: q, mode: "insensitive" } }] } : {}), ...(searchParams.loai === "HERB" || searchParams.loai === "PRODUCT" ? { type: searchParams.loai } : {}) },
      orderBy: { name: "asc" },
      include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 1 }, herb: { select: { imageUrl: true, latinName: true, actions: true } } },
    }),
    prisma.stockLot.findMany({
      where: { branchId: branch.id, qtyRemaining: { gt: 0 } },
      select: { itemId: true, qtyRemaining: true, expiryDate: true, unitCost: true, supplier: true, receivedAt: true },
    }),
  ]);

  const now = Date.now();
  const soon = now + SOON_DAYS * 86400000;
  const agg = new Map<string, { total: number; expired: number; soon: number; nearest?: Date; value: number; supplier?: string | null; lot?: string }>();
  for (const l of lots) {
    const a = agg.get(l.itemId) ?? { total: 0, expired: 0, soon: 0, value: 0 };
    a.total += l.qtyRemaining;
    a.value += l.qtyRemaining * l.unitCost;
    if (l.expiryDate) {
      const t = l.expiryDate.getTime();
      if (t < now) a.expired += l.qtyRemaining;
      else if (t < soon) a.soon += l.qtyRemaining;
      if (!a.nearest || l.expiryDate < a.nearest) { a.nearest = l.expiryDate; a.supplier = l.supplier; a.lot = `LO${l.receivedAt.toISOString().slice(2, 10).replace(/-/g, "")}`; }
    }
    agg.set(l.itemId, a);
  }

  const rows = items
    .map((it) => {
      const a = agg.get(it.id) ?? { total: 0, expired: 0, soon: 0, value: 0 };
      return { it, a, low: it.minStock > 0 && a.total < it.minStock };
    })
    .filter((r) => !onlyLow || r.low)
    .filter((r) => {
      const t = searchParams.tt;
      if (t === "con") return !r.low && r.a.expired === 0 && r.a.soon === 0;
      if (t === "thap") return r.low;
      if (t === "sap") return r.a.soon > 0;
      if (t === "het") return r.a.expired > 0;
      return true;
    })
    .filter((r) => {
      const h = searchParams.han;
      if (!h) return true;
      if (h === "het") return r.a.expired > 0;
      return !!r.a.nearest && r.a.nearest.getTime() >= Date.now() && r.a.nearest.getTime() <= Date.now() + Number(h) * 86400000;
    });
  const pageSize = [10, 20, 50].includes(Number(searchParams.n)) ? Number(searchParams.n) : 10;
  const page = Math.max(1, parseInt(searchParams.trang ?? "1", 10) || 1);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const totalValue = Array.from(agg.values()).reduce((s2, a) => s2 + a.value, 0);
  const names = items.filter((i) => !i.herb?.imageUrl).map((i) => i.name);
  const herbPics = names.length ? await prisma.herb.findMany({ where: { standardName: { in: names }, imageUrl: { not: null } }, select: { standardName: true, imageUrl: true } }) : [];
  const picOf = new Map(herbPics.map((h) => [h.standardName, h.imageUrl as string]));
  const selItem = searchParams.sel ? items.find((i) => i.id === searchParams.sel) : undefined;
  const selLots = selItem ? await prisma.stockLot.findMany({ where: { itemId: selItem.id, branchId: branch.id }, orderBy: { receivedAt: "desc" }, take: 20 }) : [];
  const selMoves = selItem ? await prisma.stockMove.findMany({ where: { itemId: selItem.id, branchId: branch.id, at: { gte: new Date(Date.now() - 30 * 86400000) } }, orderBy: { at: "asc" } }) : [];
  const selHist = selItem ? await prisma.stockMove.findMany({ where: { itemId: selItem.id, branchId: branch.id }, orderBy: { at: "desc" }, take: 12 }) : [];
  const canCost = hasAny(staff.roles, COST_VIEW_ROLES);
  const dayKey = (d: Date) => new Date(d.getTime() + 7 * 3600000).toISOString().slice(0, 10);
  const usageDays = Array.from({ length: 30 }, (_, i2) => dayKey(new Date(Date.now() - (29 - i2) * 86400000)));
  // Tồn cuối ngày = tồn hiện tại trừ các biến động xảy ra sau ngày đó.
  const nowTotal = selItem ? lots.filter((l) => l.itemId === selItem.id).reduce((s2, l) => s2 + l.qtyRemaining, 0) : 0;
  const level = usageDays.map((d) => nowTotal - selMoves.filter((m) => dayKey(m.at) > d).reduce((s2, m) => s2 + m.qty, 0));
  const maxUse = Math.max(1, ...level);
  const selPic = selItem ? (selItem.herb?.imageUrl ?? picOf.get(selItem.name)) : undefined;
  const link = (extra: Record<string, string>) => `/kho?${new URLSearchParams({ cn: branch.id, ...(q ? { q } : {}), ...(onlyLow ? { chi: "thap" } : {}), ...(searchParams.loai ? { loai: searchParams.loai } : {}), ...extra })}`;
  const soonCount = items.filter((it) => (agg.get(it.id)?.soon ?? 0) > 0).length;
  const expiredCount = items.filter((it) => (agg.get(it.id)?.expired ?? 0) > 0).length;
  const lowCount = items.filter((it) => it.minStock > 0 && (agg.get(it.id)?.total ?? 0) < it.minStock).length;

  const btn = "flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold hover:border-brand-deep";
  const keep = { ...(q ? { q } : {}), ...(searchParams.loai ? { loai: searchParams.loai } : {}), ...(searchParams.tt ? { tt: searchParams.tt } : {}), ...(searchParams.han ? { han: searchParams.han } : {}), ...(onlyLow ? { chi: "thap" } : {}), ...(searchParams.n ? { n: searchParams.n } : {}) };
  const pg = (n2: number) => `/kho?${new URLSearchParams({ cn: branch.id, ...keep, trang: String(n2) })}`;
  const dt = searchParams.dt ?? "tt";
  const latin = (it: (typeof items)[number]) => it.herb?.latinName ?? "";
  const MV: Record<string, string> = { RECEIPT: "Nhập kho", ADJUST: "Điều chỉnh", DISPENSE: "Phát thuốc" };
  return (
    <div className="space-y-4">
      <PageHead icon={Package} title="Kho và giá" sub={`Quản lý vị thuốc, dược liệu, hàng hóa, giá cả và tồn kho · ${branch.name}`} img="/images/art/mortar.jpg" />
      <KhoTabs active="ton" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Boxes} label="Tổng số mặt hàng (SKU)" value={items.length} unit="vị thuốc, dược liệu, thành phẩm" tone="green" />
        {canCost ? <Stat icon={Coins} label="Tổng giá trị tồn kho" value={vnd(totalValue)} unit="theo giá nhập" tone="gold" /> : <Stat icon={Coins} label="Số lô còn hàng" value={lots.length} unit="lô" tone="gold" />}
        <Stat icon={AlertTriangle} label="Dưới mức tối thiểu" value={lowCount} unit="mặt hàng cần nhập" tone="red" href={`/kho?cn=${branch.id}&chi=thap`} />
        <Stat icon={CalendarClock} label="Gần hết hạn" value={soonCount} unit={`mặt hàng (≤ ${SOON_DAYS} ngày)${expiredCount ? ` · ${expiredCount} đã hết hạn` : ""}`} tone="purple" />
      </div>

      <form className="card !p-3 flex flex-wrap items-end gap-3" method="get">
        <input type="hidden" name="cn" value={branch.id} />
        <label className="text-xs text-brand-ink/65">Danh mục<select name="loai" defaultValue={searchParams.loai ?? ""} className="mt-0.5 block rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-brand-ink"><option value="">Tất cả danh mục</option><option value="HERB">Vị thuốc</option><option value="PRODUCT">Thành phẩm</option></select></label>
        <label className="text-xs text-brand-ink/65">Trạng thái tồn kho<select name="tt" defaultValue={searchParams.tt ?? ""} className="mt-0.5 block rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-brand-ink"><option value="">Tất cả</option><option value="con">Còn hàng</option><option value="thap">Dưới tối thiểu</option><option value="sap">Gần hết hạn</option><option value="het">Có lô hết hạn</option></select></label>
        <label className="text-xs text-brand-ink/65">Hạn dùng<select name="han" defaultValue={searchParams.han ?? ""} className="mt-0.5 block rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-brand-ink"><option value="">Tất cả</option><option value="30">Trong 30 ngày</option><option value="90">Trong 90 ngày</option><option value="het">Đã hết hạn</option></select></label>
        <label className="min-w-[14rem] flex-1 text-xs text-brand-ink/65">Tìm kiếm
          <span className="relative mt-0.5 block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input name="q" defaultValue={q} placeholder="Tên thuốc, mã hàng…" className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-brand-ink" /></span>
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm font-medium"><input type="checkbox" name="chi" value="thap" defaultChecked={onlyLow} className="h-4 w-4" />Chỉ sắp hết</label>
        <button type="submit" className="rounded-xl bg-brand-deep px-6 py-2.5 font-semibold text-white">Tìm</button>
        <a href={`/kho/xuat?cn=${branch.id}`} className={`${btn} !py-2 text-sm`}><Download className="h-4 w-4" />Xuất Excel</a>
      </form>

      <div className={selItem ? "grid xl:grid-cols-[minmax(0,1fr)_23rem] gap-4 items-start" : ""}>
      <Panel pad={false} icon={Leaf} title={`Tồn kho (${rows.length} mặt hàng)`}>
        {items.length === 0 ? (
          <p className="p-4 text-sm text-brand-ink/70">Chưa có mặt hàng nào. {canManage ? "Vào “Mặt hàng và giá” để thêm." : "Nhờ quản lý thêm mặt hàng."}</p>
        ) : (
          <>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-10">STT</th><th>Mã hàng</th><th>Tên mặt hàng</th><th>Loại</th><th>Lô / Hạn dùng</th><th>Nhà cung cấp</th><th className="text-right">Tồn kho</th><th>ĐV</th><th className="text-right">Tối thiểu</th>{canCost && <th className="text-right">Giá nhập</th>}<th className="text-right">Giá bán</th><th>Trạng thái</th><th /></tr></thead>
              <tbody>
                {pageRows.map(({ it, a, low }, k) => {
                  const pic = it.herb?.imageUrl ?? picOf.get(it.name);
                  return (
                    <tr key={it.id} className={selItem?.id === it.id ? "bg-emerald-50" : ""}>
                      <td className="text-brand-ink/70">{(page - 1) * pageSize + k + 1}</td>
                      <td className="font-mono text-sm">{it.code ?? "—"}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          {pic ? <Image src={pic} alt="" width={44} height={44} className="h-11 w-11 rounded-lg object-cover ring-1 ring-slate-200" /> : <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><Leaf className="h-5 w-5" /></span>}
                          <div><Link href={link({ sel: it.id })} className="font-semibold hover:underline">{it.name}</Link>{latin(it) && <div className="text-xs italic text-brand-ink/70">{latin(it)}</div>}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap">{it.type === "HERB" ? "Vị thuốc" : "Thành phẩm"}</td>
                      <td className="text-sm">{a.nearest ? <>{a.lot}<div className="text-xs text-brand-ink/70">{dateVN(a.nearest)}</div></> : "—"}</td>
                      <td className="text-sm">{a.supplier ?? "—"}</td>
                      <td className={`text-right font-bold tabular-nums ${low ? "text-red-700" : ""}`}>{qty(a.total)}</td>
                      <td>{it.unit}</td>
                      <td className="text-right text-brand-ink/70">{it.minStock > 0 ? qty(it.minStock) : "—"}</td>
                      {canCost && <td className="text-right tabular-nums">{a.total > 0 ? vnd(Math.round(a.value / a.total)) : "—"}</td>}
                      <td className="text-right tabular-nums">{it.prices[0] ? vnd(it.prices[0].price) : "—"}</td>
                      <td>
                        {a.expired > 0 ? <span className="chip chip-red">Có lô hết hạn</span>
                          : low ? <span className="chip chip-red">Dưới tối thiểu</span>
                          : a.soon > 0 ? <span className="chip chip-amber">Gần hết hạn</span>
                          : <span className="chip chip-green">Còn hàng</span>}
                      </td>
                      <td>
                        <details className="relative">
                          <summary className="cursor-pointer list-none rounded-lg p-1.5 hover:bg-slate-100"><MoreVertical className="h-4 w-4" /></summary>
                          <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white text-sm shadow-lg">
                            <Link href={link({ sel: it.id })} className="block px-3 py-2 hover:bg-slate-50">Xem chi tiết</Link>
                            {canWrite && <Link href="/kho/nhap" className="block px-3 py-2 hover:bg-slate-50">Nhập kho</Link>}
                            {canWrite && <Link href="/kho/dieu-chinh" className="block px-3 py-2 hover:bg-slate-50">Điều chỉnh</Link>}
                          </div>
                        </details>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && <tr><td colSpan={13} className="p-6 text-center text-brand-ink/70">Không có mặt hàng phù hợp.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm">
            <span className="text-brand-ink/70">Hiển thị</span>
            {[10, 20, 50].map((n2) => <Link key={n2} href={`/kho?${new URLSearchParams({ cn: branch.id, ...keep, n: String(n2) })}`} className={`rounded-lg px-2.5 py-1 ${pageSize === n2 ? "bg-brand-deep text-white" : "border border-slate-200 hover:bg-slate-50"}`}>{n2}</Link>)}
            <span className="text-brand-ink/70">/ trang · Tổng {rows.length} mặt hàng</span>
            <div className="ml-auto flex items-center gap-1">
              {page > 1 && <Link href={pg(page - 1)} className="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50">‹</Link>}
              <span className="rounded-lg bg-brand-deep px-3 py-1 text-white">{page}</span>
              <span className="px-1 text-brand-ink/70">/ {pages}</span>
              {page < pages && <Link href={pg(page + 1)} className="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50">›</Link>}
            </div>
          </div>
          </>
        )}
      </Panel>
      {selItem && (
        <aside className="card space-y-4">
          <div className="flex items-start gap-3">
            {selPic ? <Image src={selPic} alt="" width={64} height={64} className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-200" /> : <span className="grid h-16 w-16 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Leaf className="h-7 w-7" /></span>}
            <div className="min-w-0 flex-1">
              <div className="text-lg font-bold">{selItem.name}</div>
              <div className="text-sm italic text-brand-ink/70">{latin(selItem) || (selItem.type === "HERB" ? "Vị thuốc" : "Thành phẩm")}</div>
              {(() => { const a = agg.get(selItem.id); const lowS = selItem.minStock > 0 && (a?.total ?? 0) < selItem.minStock; return lowS ? <span className="chip chip-red mt-1">Dưới tối thiểu</span> : <span className="chip chip-green mt-1">Còn hàng</span>; })()}
            </div>
            <Link href={link({})} className="rounded-full p-1.5 hover:bg-slate-100"><X className="h-5 w-5" /></Link>
          </div>
          <div className="flex gap-1 border-b border-slate-200 text-sm font-semibold">
            {[["tt", "Thông tin"], ["lo", `Lô hàng (${selLots.filter((l) => l.qtyRemaining > 0).length})`], ["ls", "Lịch sử nhập xuất"]].map(([k, l]) => (
              <Link key={k} href={link({ sel: selItem.id, dt: k })} className={`-mb-px border-b-2 px-3 py-2 ${dt === k ? "border-brand-deep text-brand-deep" : "border-transparent text-brand-ink/70 hover:text-brand-ink"}`}>{l}</Link>
            ))}
          </div>
          {dt === "tt" && (
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-brand-ink/65">Mã hàng</dt><dd className="font-mono font-bold">{selItem.code ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-brand-ink/65">Danh mục</dt><dd className="font-bold">{selItem.type === "HERB" ? "Dược liệu" : "Thành phẩm"}</dd></div>
              <div className="flex justify-between"><dt className="text-brand-ink/65">Đơn vị tính</dt><dd className="font-bold">{selItem.unit}</dd></div>
              {selItem.herb?.actions && <div><dt className="text-brand-ink/65">Mô tả</dt><dd>{selItem.herb.actions.slice(0, 160)}</dd></div>}
              <div className="flex justify-between border-t pt-1.5"><dt className="text-brand-ink/65">Tồn kho hiện tại</dt><dd className="font-bold">{qty(agg.get(selItem.id)?.total ?? 0)} {selItem.unit}</dd></div>
              <div className="flex justify-between"><dt className="text-brand-ink/65">Mức tối thiểu</dt><dd className="font-bold">{selItem.minStock > 0 ? `${qty(selItem.minStock)} ${selItem.unit}` : "—"}</dd></div>
              {canCost && (agg.get(selItem.id)?.total ?? 0) > 0 && <div className="flex justify-between"><dt className="text-brand-ink/65">Giá nhập (TB)</dt><dd className="font-bold">{vnd(Math.round((agg.get(selItem.id)?.value ?? 0) / (agg.get(selItem.id)?.total || 1)))}/{selItem.unit}</dd></div>}
              <div className="flex justify-between"><dt className="text-brand-ink/65">Giá bán</dt><dd className="font-bold">{selItem.prices[0] ? `${vnd(selItem.prices[0].price)}/${selItem.unit}` : "—"}</dd></div>
              {selItem.note && !selItem.note.startsWith("[DEMO]") && <div className="text-brand-ink/70">{selItem.note}</div>}
            </dl>
          )}
          {dt === "lo" && (
            <ul className="space-y-1.5 text-sm">
              {selLots.slice(0, 10).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
                  <span className="min-w-0 truncate">{l.supplier ?? "—"}<span className="block text-xs text-brand-ink/70">Nhập {dateVN(l.receivedAt)} · HSD {l.expiryDate ? dateVN(l.expiryDate) : "—"}</span></span>
                  <b className="tabular-nums">{qty(l.qtyRemaining)} {selItem.unit}</b>
                </li>
              ))}
              {selLots.length === 0 && <li className="text-brand-ink/70">Chưa có lô.</li>}
            </ul>
          )}
          {dt === "ls" && (
            <ul className="space-y-1.5 text-sm">
              {selHist.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
                  <span>{MV[m.type] ?? m.type}<span className="block text-xs text-brand-ink/70">{dateVN(m.at)}{m.reason ? ` · ${m.reason.replace("[DEMO] ", "")}` : ""}</span></span>
                  <b className={`tabular-nums ${m.qty < 0 ? "text-red-600" : "text-emerald-700"}`}>{m.qty > 0 ? "+" : ""}{qty(m.qty)}</b>
                </li>
              ))}
              {selHist.length === 0 && <li className="text-brand-ink/70">Chưa có biến động.</li>}
            </ul>
          )}
          <div>
            <div className="mb-1.5 text-sm font-bold">Biến động tồn kho (30 ngày)</div>
            <div className="flex h-24 items-end gap-0.5">
              {usageDays.map((d, i3) => <div key={d} className="flex-1 rounded-t bg-emerald-500/80" title={`${d}: ${qty(level[i3])} ${selItem.unit}`} style={{ height: `${Math.max((Math.max(level[i3], 0) / maxUse) * 100, 3)}%` }} />)}
            </div>
            <div className="mt-0.5 flex justify-between text-[10px] text-brand-ink/70"><span>{usageDays[0].slice(5)}</span><span>{usageDays[29].slice(5)}</span></div>
          </div>
          {canWrite && (
            <div className="grid grid-cols-2 gap-2">
              <Link href="/kho/nhap" className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-deep py-2.5 text-center font-semibold text-white hover:bg-brand-deeper"><PackagePlus className="h-4 w-4" />Nhập kho</Link>
              <Link href="/kho/dieu-chinh" className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2.5 text-center font-semibold hover:bg-slate-50"><SlidersHorizontal className="h-4 w-4" />Điều chỉnh</Link>
              <Link href="/kho/dieu-chinh" className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2.5 text-center font-semibold hover:bg-slate-50"><ClipboardCheck className="h-4 w-4" />Kiểm kê</Link>
              <a href={`/kho/xuat?cn=${branch.id}`} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2.5 text-center font-semibold hover:bg-slate-50"><Download className="h-4 w-4" />Xuất Excel</a>
            </div>
          )}
        </aside>
      )}
      </div>
    </div>
  );
}
