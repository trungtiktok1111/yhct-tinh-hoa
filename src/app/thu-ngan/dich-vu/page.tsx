import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ITEM_MANAGER_ROLES } from "@/lib/permissions";
import { saveService, toggleService } from "@/actions/service";
import { BackLink } from "@/components/BackLink";
import { PageHead, Panel } from "@/components/ui";
import { input } from "@/lib/stock";
import { Stethoscope } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage({ searchParams }: { searchParams: { loi?: string } }) {
  await requireRole(...ITEM_MANAGER_ROLES);
  const list = await prisma.serviceItem.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }] });
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
              <tr key={s.id} className={s.active ? "" : "opacity-50"}>
                <td colSpan={3}>
                  <form action={saveService} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={s.id} />
                    <input name="name" defaultValue={s.name} className={`${input} min-w-[14rem] flex-1`} />
                    <input name="unit" defaultValue={s.unit} className={`${input} w-24`} />
                    <input name="price" defaultValue={s.price} inputMode="numeric" className={`${input} w-36`} />
                    <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Lưu</button>
                  </form>
                </td>
                <td><form action={toggleService}><input type="hidden" name="id" value={s.id} /><button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">{s.active ? "Ngừng dùng" : "Dùng lại"}</button></form></td>
              </tr>
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
