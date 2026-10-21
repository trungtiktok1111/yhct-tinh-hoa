import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DISPENSE_ROLES } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { timeVN, vnDayStart, vnd } from "@/lib/format";
import { PageHead, Stat, Panel } from "@/components/ui";
import { qty as fq } from "@/lib/format";
import { ClipboardList, Pill, Hourglass, CheckCircle2, AlertTriangle, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DispenseQueuePage({ searchParams }: { searchParams: { cn?: string; sel?: string } }) {
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
  const selId = searchParams.sel ?? waiting[0]?.id;
  const sel = selId ? await prisma.invoice.findUnique({ where: { id: selId }, include: { patient: { select: { fullName: true, allergies: true, phone: true, seq: true } }, lines: { orderBy: { position: "asc" } } } }) : null;
  const stockRows = sel ? await prisma.stockLot.groupBy({ by: ["itemId"], where: { branchId: branch.id, itemId: { in: sel.lines.map((l) => l.itemId).filter(Boolean) as string[] }, qtyRemaining: { gt: 0 }, OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }] }, _sum: { qtyRemaining: true } }) : [];
  const have = new Map(stockRows.map((x) => [x.itemId, x._sum.qtyRemaining ?? 0]));
  const dayName = new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <div className="space-y-4">
      <PageHead icon={Pill} title="Phát thuốc" sub={`Hôm nay, ${dayName}`} img="/images/art/herbs-wide.jpg" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Stat icon={Package} label="Đơn đã thanh toán, chờ phát" value={waiting.length} unit="đơn" tone="amber" />
        <Stat icon={CheckCircle2} label="Đã phát hôm nay" value={done.length} unit="đơn" tone="green" />
        <Stat icon={AlertTriangle} label="Đơn có bệnh nhân dị ứng" value={waiting.filter((i) => i.patient?.allergies).length} unit="đơn chờ phát" tone="red" />
      </div>

      <div className={sel ? "grid xl:grid-cols-[1fr_26rem] gap-4 items-start" : ""}>
      <div className="space-y-4">
      <Panel icon={Hourglass} title={`Danh sách đơn chờ phát thuốc (${waiting.length})`} pad={false} tone="text-amber-600">
        {waiting.length === 0 ? <p className="p-4 text-sm text-brand-ink/60">Không có đơn nào chờ phát.</p> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-12">STT</th><th>Bệnh nhân</th><th>Mã đơn</th><th>Loại</th><th>Thu lúc</th><th className="text-right">Số dòng</th><th>Lưu ý</th><th></th></tr></thead>
              <tbody>
                {waiting.map((i, k) => (
                  <tr key={i.id} className={sel?.id === i.id ? "bg-amber-50" : ""}>
                    <td className="text-brand-ink/60">{k + 1}</td>
                    <td><Link href={`/duoc?cn=${branch.id}&sel=${i.id}`} className="font-semibold hover:underline">{name(i)}</Link></td>
                    <td className="font-mono text-sm">HD-{String(i.seq).padStart(6, "0")}</td>
                    <td>{i.kind === "RETAIL" ? "Bán lẻ" : "Theo đơn"}</td>
                    <td>{i.paidAt ? timeVN(i.paidAt) : ""}</td>
                    <td className="text-right">{i._count.lines}</td>
                    <td>{i.patient?.allergies ? <span className="chip chip-red">Dị ứng: {i.patient.allergies}</span> : <span className="chip chip-green">Đã thanh toán</span>}</td>
                    <td><Link href={`/duoc/${i.id}`} className="whitespace-nowrap rounded-lg bg-brand-deep px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-deeper">Soạn thuốc</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel icon={CheckCircle2} title={`Đã phát hôm nay (${done.length})`} pad={false}>
        {done.length === 0 ? <p className="p-4 text-sm text-brand-ink/60">Chưa phát đơn nào.</p> : (
          <table>
            <thead><tr><th>Mã đơn</th><th>Bệnh nhân</th><th>Phát lúc</th><th>Người phát</th><th></th></tr></thead>
            <tbody>
              {done.map((i) => (
                <tr key={i.id}>
                  <td className="font-mono text-sm">HD-{String(i.seq).padStart(6, "0")}</td>
                  <td className="font-semibold">{name(i)}</td>
                  <td>{i.dispensedAt ? timeVN(i.dispensedAt) : ""}</td>
                  <td>{i.dispensedBy}</td>
                  <td><Link href={`/duoc/${i.id}`} className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">Xem</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
      </div>
      {sel && (
        <aside className="card space-y-3">
          <div className="flex items-center justify-between"><div className="font-bold">Chi tiết đơn thuốc</div><span className={`chip ${sel.dispensedAt ? "chip-green" : "chip-amber"}`}>{sel.dispensedAt ? "Đã phát" : "Đang xử lý"}</span></div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-100 text-amber-700"><Pill className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1"><div className="font-bold">{sel.patient?.fullName ?? sel.customerName ?? "Khách lẻ"}</div><div className="text-xs text-brand-ink/60">{sel.patient ? `BN-${String(sel.patient.seq).padStart(6, "0")} · ${sel.patient.phone}` : "Bán lẻ"}</div></div>
            <div className="text-right text-xs text-brand-ink/60">HD-{String(sel.seq).padStart(6, "0")}</div>
          </div>
          {sel.patient?.allergies && <div className="warn-box text-sm"><b>Dị ứng:</b> {sel.patient.allergies}</div>}
          <table>
            <thead><tr><th>Tên thuốc</th><th className="text-right">Số lượng</th><th className="text-right">Tồn kho</th><th></th></tr></thead>
            <tbody>
              {sel.lines.filter((l) => l.kind !== "FEE").map((l) => {
                const h = l.itemId ? have.get(l.itemId) ?? 0 : 0;
                const enough = h >= l.qty;
                return (
                  <tr key={l.id}>
                    <td className="text-sm">{l.name}</td>
                    <td className="text-right text-sm">{fq(l.qty)} {l.unit}</td>
                    <td className="text-right text-sm">{fq(h)}</td>
                    <td>{enough ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t pt-3"><span className="text-brand-ink/70">Tổng tiền</span><b className="text-xl text-amber-600">{vnd(sel.total)}</b></div>
          <Link href={`/duoc/${sel.id}`} className="block rounded-xl bg-brand-deep py-3 text-center font-semibold text-white hover:bg-brand-deeper">{sel.dispensedAt ? "Xem đơn" : "Soạn thuốc và xác nhận phát"}</Link>
        </aside>
      )}
      </div>

      <Panel icon={ClipboardList} title="Quy trình phát thuốc">
        <ol className="grid gap-3 sm:grid-cols-4">
          {["Kiểm tra đơn (đã thanh toán)", "Soạn và cân thuốc", "Đóng gói, dán nhãn", "Xác nhận phát thuốc"].map((t, k) => (
            <li key={t} className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-deep text-sm font-bold text-white">{k + 1}</span><span className="text-sm font-medium">{t}</span></li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
