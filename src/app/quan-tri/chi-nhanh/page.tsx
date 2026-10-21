import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { createBranch, setBranchActive, updateBranch, deleteBranch } from "@/actions/admin";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

export default async function BranchesPage({ searchParams }: { searchParams: { loi?: string } }) {
  await requireRole("OWNER");
  const branches = await prisma.branch.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { staff: true } } },
  });

  return (
    <div className="space-y-6">
      <BackLink href="/quan-tri" label="Quay lại Quản trị" />
      <h1 className="text-2xl font-bold font-display">Chi nhánh</h1>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}

      <div className="card space-y-3">
        <h2 className="font-semibold">Thêm chi nhánh</h2>
        <form action={createBranch} className="grid gap-3 sm:grid-cols-3">
          <input name="name" placeholder="Tên chi nhánh" required className={input} />
          <input name="address" placeholder="Địa chỉ" className={input} />
          <input name="phone" placeholder="Số điện thoại" inputMode="tel" className={input} />
          <button
            type="submit"
            className="sm:col-span-3 bg-brand-deep hover:bg-brand-deeper text-brand-cream rounded-lg px-4 py-2.5 font-semibold"
          >
            Thêm chi nhánh
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {branches.length === 0 && <p className="text-sm text-gray-600">Chưa có chi nhánh nào.</p>}
        {branches.map((b) => (
          <div key={b.id} className="card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold">
                  {b.name}{" "}
                  {!b.active && <span className="status-pill status-RETIRED ml-1">Ngừng hoạt động</span>}
                </div>
                <div className="text-sm text-gray-600">
                  {[b.address, b.phone].filter(Boolean).join(" · ") || "Chưa có địa chỉ"} · {b._count.staff} nhân viên
                </div>
              </div>
              <div className="flex gap-2">
                <form action={setBranchActive}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="active" value={b.active ? "0" : "1"} />
                  <button type="submit" className="rounded-lg border border-brand-gold/50 px-3 py-2 text-sm">
                    {b.active ? "Ngừng hoạt động" : "Kích hoạt lại"}
                  </button>
                </form>
                <form action={deleteBranch}>
                  <input type="hidden" name="id" value={b.id} />
                  <ConfirmSubmit message={`Xóa chi nhánh "${b.name}"? Chỉ xóa được khi chưa có nhân viên và dữ liệu kho.`} className="rounded-lg border border-red-300 text-red-800 px-3 py-2 text-sm hover:bg-red-50">
                    Xóa
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
            <details>
              <summary className="cursor-pointer text-sm text-brand-deep underline">Sửa thông tin</summary>
              <form action={updateBranch} className="mt-3 grid gap-3 sm:grid-cols-3">
                <input type="hidden" name="id" value={b.id} />
                <input name="name" defaultValue={b.name} required className={input} />
                <input name="address" defaultValue={b.address ?? ""} placeholder="Địa chỉ" className={input} />
                <input name="phone" defaultValue={b.phone ?? ""} placeholder="Số điện thoại" inputMode="tel" className={input} />
                <button type="submit" className="sm:col-span-3 rounded-lg bg-brand-deep text-brand-cream px-4 py-2.5 font-semibold">Lưu</button>
              </form>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
