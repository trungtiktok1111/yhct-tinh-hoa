import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { STOCK_WRITE_ROLES, COST_VIEW_ROLES, ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";
import { receiveStock, cancelLot, cancelReceipt } from "@/actions/stock";
import { KhoTabs } from "@/components/KhoTabs";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { branchesFor, input, btn } from "@/lib/stock";
import { dateVN, qty, vnd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReceivePage({ searchParams }: { searchParams: { loi?: string; ok?: string } }) {
  const staff = await requireRole(...STOCK_WRITE_ROLES);
  const [branches, items, suppliers] = await Promise.all([
    branchesFor(staff),
    prisma.item.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true, unit: true } }),
    prisma.supplier.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  const branchIds = branches.map((b) => b.id);
  const recent = await prisma.stockLot.findMany({
    where: { branchId: { in: branchIds } },
    orderBy: { receivedAt: "desc" },
    take: 15,
    include: { item: { select: { name: true, unit: true } }, branch: { select: { name: true } } },
  });
  const showCost = hasAny(staff.roles, COST_VIEW_ROLES);
  const canCancelReceipt = hasAny(staff.roles, ITEM_MANAGER_ROLES);
  // Gom các lô theo số phiếu PN (nhập Excel) để xem và hủy cả phiếu.
  const pnLots = (await prisma.stockLot.findMany({
    where: { branchId: { in: branchIds }, note: { contains: "PN-" } },
    orderBy: { receivedAt: "desc" }, take: 600,
    select: { branchId: true, note: true, qtyReceived: true, qtyRemaining: true, unitCost: true, receivedAt: true, staffName: true },
  })) as unknown as { branchId: string; note: string | null; qtyReceived: number; qtyRemaining: number; unitCost: number; receivedAt: Date; staffName: string | null }[];
  const batches = new Map<string, { pn: string; branchId: string; at: Date; by: string | null; n: number; value: number; intact: boolean }>();
  for (const l of pnLots) {
    const pn = l.note?.match(/PN-\d{8}-[0-9A-F]{4,6}/)?.[0];
    if (!pn) continue;
    const b = batches.get(pn + l.branchId) ?? { pn, branchId: l.branchId, at: l.receivedAt, by: l.staffName, n: 0, value: 0, intact: true };
    b.n += 1; b.value += Math.round(l.qtyReceived * l.unitCost); if (l.qtyRemaining !== l.qtyReceived) b.intact = false;
    batches.set(pn + l.branchId, b);
  }
  const batchList = [...batches.values()].slice(0, 20);

  return (
    <div className="space-y-6">
      <BackLink href="/kho" label="Quay lại Kho" />
      <KhoTabs active="nhap" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold font-display">Nhập kho</h1>
        <a href="/kho/nhap/excel" className="flex items-center gap-2 rounded-xl border border-brand-deep px-4 py-2 font-semibold text-brand-deep hover:bg-brand-deep/5">Nhập nhiều dòng từ Excel</a>
      </div>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">{/^\d+$/.test(searchParams.ok) ? "Đã nhập kho." : searchParams.ok}</div>}

      {items.length === 0 ? (
        <div className="warn-box text-sm">Chưa có mặt hàng nào. Quản lý cần thêm mặt hàng ở “Mặt hàng và giá” trước.</div>
      ) : (
        <form action={receiveStock} className="card grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Chi nhánh
            <select name="branchId" className={input} required>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
          <label className="text-sm">Mặt hàng
            <select name="itemId" className={input} required>
              {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
            </select>
          </label>
          <label className="text-sm">Số lượng nhập (g hoặc theo đơn vị)
            <input name="qty" inputMode="decimal" required placeholder="vd: 5000" className={input} />
          </label>
          <label className="text-sm">Giá nhập (đồng / gam hoặc / đơn vị)
            <input name="unitCost" inputMode="numeric" required placeholder="vd: 300" className={input} />
          </label>
          <label className="text-sm">Hạn dùng
            <input name="expiryDate" type="date" className={input} />
          </label>
          <label className="text-sm">Nhà cung cấp
            <select name="supplierId" defaultValue="" className={input}>
              <option value="">— Chọn từ danh sách —</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="text-sm">hoặc gõ tên nhà cung cấp mới
            <input name="supplier" className={input} />
          </label>
          <input name="note" placeholder="Ghi chú (số hóa đơn, lô...)" className={`${input} sm:col-span-2`} />
          <label className="flex items-center gap-2 text-sm text-brand-ink/80 sm:col-span-2"><input type="checkbox" name="confirmOdd" value="1" />Tôi đã kiểm tra giá và số lượng (chỉ cần tích khi hệ thống báo giá hoặc số lượng khác thường)</label>
          <button type="submit" className={`${btn} sm:col-span-2`}>Nhập kho</button>
        </form>
      )}

      {batchList.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Phiếu nhập theo số phiếu (PN)</h2>
          {batchList.map((b) => (
            <div key={b.pn + b.branchId} className="card !py-2.5 text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-mono font-semibold">{b.pn}</span>
              <span className="text-gray-600 tabular-nums">{dateVN(b.at)}</span>
              <span>{b.n} lô</span>
              {showCost && <span>tổng {vnd(b.value)}</span>}
              <span className="text-gray-600">{b.by ?? ""}</span>
              {canCancelReceipt && b.intact && (
                <form action={cancelReceipt} className="ml-auto">
                  <input type="hidden" name="pn" value={b.pn} />
                  <input type="hidden" name="branchId" value={b.branchId} />
                  <ConfirmSubmit message={`Hủy CẢ phiếu ${b.pn} (${b.n} lô)? Toàn bộ số lượng của phiếu sẽ bị trừ khỏi kho.`} className="rounded border border-red-300 text-red-800 px-2 py-0.5 text-xs">Hủy cả phiếu</ConfirmSubmit>
                </form>
              )}
              {!b.intact && <span className="ml-auto text-xs text-gray-500">đã có lô xuất/điều chỉnh</span>}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h2 className="font-semibold">15 lần nhập gần nhất</h2>
        {recent.length === 0 && <p className="text-sm text-gray-600">Chưa có lần nhập nào.</p>}
        {recent.map((l) => (
          <div key={l.id} className="card !py-2.5 text-sm flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-gray-600 tabular-nums">{dateVN(l.receivedAt)}</span>
            <span className="font-semibold">{l.item.name}</span>
            <span>+{qty(l.qtyReceived)}{l.item.unit}</span>
            {showCost && <span>giá nhập {vnd(l.unitCost)}</span>}
            {l.expiryDate && <span>HSD {dateVN(l.expiryDate)}</span>}
            <span className="text-gray-600">{l.branch.name}{l.supplier ? ` · ${l.supplier}` : ""} · {l.staffName}</span>
            {l.qtyRemaining === l.qtyReceived && (
              <form action={cancelLot} className="ml-auto">
                <input type="hidden" name="id" value={l.id} />
                <ConfirmSubmit message="Hủy lần nhập này (nhập nhầm)? Số lượng sẽ bị trừ khỏi kho." className="rounded border border-red-300 text-red-800 px-2 py-0.5 text-xs">Hủy phiếu</ConfirmSubmit>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
