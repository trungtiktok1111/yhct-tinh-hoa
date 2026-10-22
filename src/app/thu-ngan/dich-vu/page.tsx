import { Fragment } from "react";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ITEM_MANAGER_ROLES } from "@/lib/permissions";
import { saveService, toggleService, setProcedure, saveSupply, removeSupply } from "@/actions/service";
import { BackLink } from "@/components/BackLink";
import { PageHead, Panel } from "@/components/ui";
import { input } from "@/lib/stock";
import { Stethoscope } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage({ searchParams }: { searchParams: { loi?: string } }) {
  await requireRole(...ITEM_MANAGER_ROLES);
  const [list, items] = await Promise.all([
    prisma.serviceItem.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }], include: { supplies: true } }),
    prisma.item.findMany({ where: { active: true, type: "SUPPLY" }, orderBy: { name: "asc" }, select: { id: true, name: true, unit: true } }),
  ]);
  const iname = new Map((items as { id: string; name: string; unit: string }[]).map((i) => [i.id, i]));
  return (
    <div className="space-y-4">
      <BackLink href="/thu-ngan" label="Thu ngân" />
      <PageHead icon={Stethoscope} title="Dịch vụ khám chữa bệnh" sub="Danh mục dịch vụ và giá dùng khi lập hóa đơn" img="/images/art/needles.jpg" />
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      <Panel pad={false} title="Danh mục dịch vụ">
        <table>
          <thead><tr><th>Tên dịch vụ</th><th>Đơn vị</th><th>Giá (đồng)</th><th /></tr></thead>
          <tbody>
            {list.map((s) => (
              <Fragment key={s.id}>
              <tr className={s.active ? "" : "opacity-50"}>
                <td colSpan={3}>
                  <form action={saveService} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={s.id} />
                    <input name="name" defaultValue={s.name} className={`${input} min-w-[14rem] flex-1`} />
                    <input name="unit" defaultValue={s.unit} className={`${input} w-24`} />
                    <input name="price" defaultValue={s.price} inputMode="numeric" className={`${input} w-36`} />
                    <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Lưu</button>
                  </form>
                </td>
                <td>
                  <form action={setProcedure} className="mb-1.5">
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="procedure" value={s.procedure ? "0" : "1"} />
                    <button className={`rounded-lg border px-3 py-1.5 text-sm ${s.procedure ? "border-brand-deep bg-brand-deep/10 font-semibold text-brand-deep" : "border-slate-300 hover:bg-slate-50"}`}>{s.procedure ? "✓ Là thủ thuật" : "Đặt là thủ thuật"}</button>
                  </form>
                  <form action={toggleService}><input type="hidden" name="id" value={s.id} /><button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">{s.active ? "Ngừng dùng" : "Dùng lại"}</button></form></td>
              </tr>
              {s.procedure && (
                <tr className={s.active ? "" : "opacity-50"}>
                  <td colSpan={4} className="!pt-0">
                    <div className="rounded-xl border border-dashed border-brand-deep/40 bg-brand-deep/5 p-3 text-sm">
                      <div className="mb-1.5 font-semibold text-brand-deep">Vật tư tiêu hao mỗi lần làm (tự trừ kho khi y sĩ hoàn thành)</div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {s.supplies.length === 0 && <span className="text-brand-ink/60">Chưa khai báo vật tư. Chưa có trong danh sách? Thêm ở Kho → Mặt hàng, chọn loại “Vật tư y tế”.</span>}
                        {s.supplies.map((u) => (
                          <form key={u.id} action={removeSupply} className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1">
                            <input type="hidden" name="id" value={u.id} />
                            {iname.get(u.itemId)?.name ?? "?"} × {u.qty} {iname.get(u.itemId)?.unit}
                            <button className="ml-1 text-red-700" aria-label="Bỏ vật tư">×</button>
                          </form>
                        ))}
                      </div>
                      <form action={saveSupply} className="flex flex-wrap items-end gap-2">
                        <input type="hidden" name="serviceId" value={s.id} />
                        <select name="itemId" required className={`${input} w-64`}>
                          <option value="">Chọn vật tư y tế (kim, chỉ cấy, găng, bông, cồn, ngải cứu…)</option>
                          {(items as { id: string; name: string; unit: string }[]).map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                        </select>
                        <input name="qty" required inputMode="decimal" placeholder="Số lượng" className={`${input} w-28`} />
                        <button className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">Thêm / sửa</button>
                      </form>
                    </div>
                  </td>
                </tr>
              )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Panel>
      <Panel title="Thêm dịch vụ">
        <form action={saveService} className="flex flex-wrap items-end gap-2">
          <label className="min-w-[14rem] flex-1 text-sm">Tên dịch vụ<input name="name" required className={input} /></label>
          <label className="text-sm">Đơn vị<input name="unit" defaultValue="Lần" className={`${input} w-24`} /></label>
          <label className="text-sm">Giá (đồng)<input name="price" required inputMode="numeric" className={`${input} w-36`} /></label>
          <button className="rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white">Thêm</button>
        </form>
      </Panel>
    </div>
  );
}
