import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { STOCK_WRITE_ROLES } from "@/lib/permissions";
import { adjustStock } from "@/actions/stock";
import { BackLink } from "@/components/BackLink";
import { branchesFor, input, btn } from "@/lib/stock";
import { qty } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdjustPage({ searchParams }: { searchParams: { loi?: string; ok?: string } }) {
  const staff = await requireRole(...STOCK_WRITE_ROLES);
  const [branches, items] = await Promise.all([
    branchesFor(staff),
    prisma.item.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, unit: true } }),
  ]);
  const moves = await prisma.stockMove.findMany({
    where: { branchId: { in: branches.map((b) => b.id) }, type: "ADJUST" },
    orderBy: { at: "desc" },
    take: 20,
    include: { item: { select: { name: true, unit: true } }, branch: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <BackLink href="/kho" label="Quay lại Kho" />
      <h1 className="text-2xl font-bold font-display">Điều chỉnh / kiểm kê</h1>
      <p className="text-sm text-gray-600">
        Dùng khi kiểm kê lệch, hao hụt, hỏng, hết hạn. Số âm là giảm, số dương là tăng. Bắt buộc ghi lý do; mọi điều chỉnh đều lưu vết.
      </p>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">Đã điều chỉnh.</div>}

      {items.length === 0 && (
        <div className="warn-box text-sm">Chưa có mặt hàng nào. Quản lý cần thêm mặt hàng ở “Mặt hàng và giá” trước.</div>
      )}
      <form action={adjustStock} className="card grid gap-3 sm:grid-cols-2">
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
        <label className="text-sm">Số lượng thay đổi (vd: -200 hoặc 150)
          <input name="delta" inputMode="decimal" required className={input} />
        </label>
        <label className="text-sm">Lý do
          <input name="reason" required placeholder="Kiểm kê lệch / hỏng / hết hạn..." className={input} />
        </label>
        <button type="submit" className={`${btn} sm:col-span-2`}>Lưu điều chỉnh</button>
      </form>

      <div className="space-y-2">
        <h2 className="font-semibold">20 điều chỉnh gần nhất</h2>
        {moves.length === 0 && <p className="text-sm text-gray-600">Chưa có.</p>}
        {moves.map((m) => (
          <div key={m.id} className="card !py-2.5 text-sm flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-gray-600 tabular-nums">
              {m.at.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
            </span>
            <span className="font-semibold">{m.item.name}</span>
            <span className={m.qty < 0 ? "text-red-700" : "text-green-700"}>
              {m.qty > 0 ? "+" : ""}{qty(m.qty)}{m.item.unit}
            </span>
            <span>{m.reason}</span>
            <span className="text-gray-600">{m.branch.name} · {m.staffName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
