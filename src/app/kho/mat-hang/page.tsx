import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";
import { createItem, updateItem, setItemActive, deleteItem } from "@/actions/stock";
import { KhoTabs } from "@/components/KhoTabs";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { ALL_UNITS, typeLabel, input, btn } from "@/lib/stock";
import { dateVN, vnd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ItemsPage({ searchParams }: { searchParams: { loi?: string; q?: string } }) {
  const staff = await requireStaff();
  const canManage = hasAny(staff.roles, ITEM_MANAGER_ROLES);
  const q = searchParams.q?.trim();
  const items = await prisma.item.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : {},
    orderBy: [{ active: "desc" }, { name: "asc" }],
    include: { prices: { orderBy: { effectiveFrom: "desc" }, take: 2 } },
  });

  return (
    <div className="space-y-6">
      <BackLink href="/kho" label="Quay lại Kho" />
      <KhoTabs active="mat-hang" />
      <h1 className="text-2xl font-bold font-display">{canManage ? "Mặt hàng và giá bán" : "Bảng giá"}</h1>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}

      {canManage && (
        <div className="card space-y-3">
          <h2 className="font-semibold">Thêm mặt hàng</h2>
          <form action={createItem} className="grid gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Tên (vd: Đảng sâm, Viên Lục vị 100 viên)" required className={`${input} sm:col-span-2`} />
            <label className="text-sm">Loại
              <select name="type" className={input} defaultValue="HERB">
                <option value="HERB">Dược liệu (bán theo gam)</option>
                <option value="PRODUCT">Thành phẩm (viên, hộp, chai...)</option>
                <option value="SUPPLY">Vật tư y tế tiêu hao (kim, chỉ, găng, bông, cồn, ngải cứu…)</option>
              </select>
            </label>
            <label className="text-sm">Đơn vị (thành phẩm / vật tư; dược liệu luôn là g)
              <select name="unit" className={input}>
                {ALL_UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </label>
            <label className="text-sm">Giá bán (đồng / gam hoặc / đơn vị; vật tư tiêu hao để 0)
              <input name="price" inputMode="numeric" placeholder="vd: 450" required className={input} />
            </label>
            <label className="text-sm">Tồn tối thiểu (cảnh báo)
              <input name="minStock" inputMode="decimal" placeholder="vd: 500" className={input} />
            </label>
            <input name="note" placeholder="Ghi chú (không bắt buộc)" className={`${input} sm:col-span-2`} />
            <button type="submit" className={`${btn} sm:col-span-2`}>Thêm mặt hàng</button>
          </form>
        </div>
      )}

      <form method="get" className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Tìm mặt hàng..." className={input} />
        <button className="rounded-lg border border-brand-gold/50 px-4">Tìm</button>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-gray-600">Chưa có mặt hàng nào.</p>}
        {items.map((it) => {
          const cur = it.prices[0];
          return (
            <div key={it.id} className={`card space-y-2 ${it.active ? "" : "opacity-60"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">
                    {it.name}{" "}
                    <span className="text-xs text-gray-500">({typeLabel(it.type).toLowerCase()})</span>
                    {!it.active && <span className="status-pill status-RETIRED ml-2">Ngừng</span>}
                  </div>
                  <div className="text-sm text-gray-700">
                    Giá bán: <b>{cur ? vnd(cur.price) : "chưa đặt"}</b> / {it.unit}
                    {it.type === "HERB" && cur ? ` (${vnd(cur.price * 1000)}/kg)` : ""}
                    {cur && <span className="text-gray-500"> · áp dụng từ {dateVN(cur.effectiveFrom)}</span>}
                  </div>
                  {it.prices[1] && (
                    <div className="text-xs text-gray-500">Giá trước đó: {vnd(it.prices[1].price)}</div>
                  )}
                </div>
              </div>
              {canManage && (
                <div className="flex flex-wrap items-end gap-2">
                  <form action={updateItem} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="id" value={it.id} />
                    <label className="text-xs">Tên
                      <input name="name" defaultValue={it.name} required className="block w-44 rounded-lg border border-brand-gold/40 bg-white px-2 py-2 text-base" />
                    </label>
                    <label className="text-xs">Ghi chú
                      <input name="note" defaultValue={it.note ?? ""} className="block w-40 rounded-lg border border-brand-gold/40 bg-white px-2 py-2 text-base" />
                    </label>
                    <label className="text-xs">Giá bán
                      <input name="price" defaultValue={cur?.price ?? ""} inputMode="numeric" className="block w-28 rounded-lg border border-brand-gold/40 bg-white px-2 py-2 text-base" />
                    </label>
                    <label className="text-xs">Tồn tối thiểu
                      <input name="minStock" defaultValue={it.minStock} inputMode="decimal" className="block w-28 rounded-lg border border-brand-gold/40 bg-white px-2 py-2 text-base" />
                    </label>
                    <button className="rounded-lg bg-brand-deep text-brand-cream px-3 py-2 text-sm">Lưu</button>
                  </form>
                  <form action={setItemActive}>
                    <input type="hidden" name="id" value={it.id} />
                    <input type="hidden" name="active" value={it.active ? "0" : "1"} />
                    <button className="rounded-lg border border-brand-gold/50 px-3 py-2 text-sm">
                      {it.active ? "Ngừng bán" : "Bán lại"}
                    </button>
                  </form>
                  <form action={deleteItem}>
                    <input type="hidden" name="id" value={it.id} />
                    <ConfirmSubmit message={`Xóa mặt hàng "${it.name}"? Chỉ xóa được khi chưa có giao dịch kho.`}>Xóa</ConfirmSubmit>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
