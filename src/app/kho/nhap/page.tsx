import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { STOCK_WRITE_ROLES, COST_VIEW_ROLES } from "@/lib/permissions";
import { receiveStock, cancelLot } from "@/actions/stock";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { branchesFor, input, btn } from "@/lib/stock";
import { dateVN, qty, vnd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReceivePage({ searchParams }: { searchParams: { loi?: string; ok?: string } }) {
  const staff = await requireRole(...STOCK_WRITE_ROLES);
  const [branches, items] = await Promise.all([
    branchesFor(staff),
    prisma.item.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true, unit: true } }),
  ]);
  const branchIds = branches.map((b) => b.id);
  const recent = await prisma.stockLot.findMany({
    where: { branchId: { in: branchIds } },
    orderBy: { receivedAt: "desc" },
    take: 15,
    include: { item: { select: { name: true, unit: true } }, branch: { select: { name: true } } },
  });
  const showCost = COST_VIEW_ROLES.includes(staff.role);

  return (
    <div className="space-y-6">
      <BackLink href="/kho" label="Quay lại Kho" />
      <h1 className="text-2xl font-bold font-display">Nhập kho</h1>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">Đã nhập kho.</div>}

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
            <input name="supplier" className={input} />
          </label>
          <input name="note" placeholder="Ghi chú (số hóa đơn, lô...)" className={`${input} sm:col-span-2`} />
          <button type="submit" className={`${btn} sm:col-span-2`}>Nhập kho</button>
        </form>
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
