import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES, ROLE_KEYS } from "@/lib/permissions";
import { createStaff, resetStaffPassword, setStaffActive, updateStaff, deleteStaff } from "@/actions/admin";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

export default async function StaffPage({ searchParams }: { searchParams: { loi?: string } }) {
  const me = await requireRole("OWNER");
  const [staff, branches] = await Promise.all([
    prisma.staff.findMany({
      orderBy: { createdAt: "asc" },
      include: { branches: { select: { branchId: true } } },
    }),
    prisma.branch.findMany({ where: { active: true }, orderBy: { createdAt: "asc" } }),
  ]);

  const BranchChecks = ({ selected }: { selected: string[] }) => (
    <fieldset className="flex flex-wrap gap-x-4 gap-y-2">
      <legend className="text-sm font-medium mb-1">Chi nhánh (Chủ tự động thấy tất cả)</legend>
      {branches.length === 0 && <span className="text-sm text-gray-600">Chưa có chi nhánh. Tạo chi nhánh trước.</span>}
      {branches.map((b) => (
        <label key={b.id} className="flex items-center gap-2 text-sm py-1">
          <input type="checkbox" name="branchIds" value={b.id} defaultChecked={selected.includes(b.id)} className="h-5 w-5" />
          {b.name}
        </label>
      ))}
    </fieldset>
  );

  const RoleSelect = ({ value }: { value?: string }) => (
    <select name="role" defaultValue={value ?? ""} required className={input}>
      <option value="" disabled>Chọn vai trò</option>
      {ROLE_KEYS.map((r) => (
        <option key={r} value={r}>{ROLES[r]}</option>
      ))}
    </select>
  );

  return (
    <div className="space-y-6">
      <BackLink href="/quan-tri" label="Quay lại Quản trị" />
      <h1 className="text-2xl font-bold font-display">Nhân viên</h1>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}

      <div className="card space-y-3">
        <h2 className="font-semibold">Thêm nhân viên</h2>
        <form action={createStaff} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="fullName" placeholder="Họ tên" required className={input} />
            <input name="username" placeholder="Tên đăng nhập (chữ thường, không dấu)" autoCapitalize="none" required className={input} />
            <input name="password" type="password" placeholder="Mật khẩu (tối thiểu 8 ký tự)" minLength={8} required autoComplete="new-password" className={input} />
            <RoleSelect />
          </div>
          <BranchChecks selected={[]} />
          <button type="submit" className="w-full bg-brand-deep hover:bg-brand-deeper text-brand-cream rounded-lg px-4 py-2.5 font-semibold">
            Thêm nhân viên
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {staff.map((s) => (
          <details key={s.id} className="card">
            <summary className="cursor-pointer flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0">
                <span className="font-semibold">{s.fullName}</span>{" "}
                <span className="text-sm text-gray-600">@{s.username} · {ROLES[s.role as keyof typeof ROLES] ?? s.role}</span>
              </span>
              {!s.active && <span className="status-pill status-RETIRED">Đã khóa</span>}
            </summary>

            <div className="mt-4 space-y-4">
              <form action={updateStaff} className="space-y-3">
                <input type="hidden" name="id" value={s.id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="fullName" defaultValue={s.fullName} required className={input} />
                  <RoleSelect value={s.role} />
                </div>
                <BranchChecks selected={s.branches.map((b) => b.branchId)} />
                <button type="submit" className="rounded-lg border border-brand-gold/50 px-4 py-2 text-sm font-semibold">
                  Lưu thay đổi
                </button>
              </form>

              <form action={resetStaffPassword} className="flex flex-wrap gap-2">
                <input type="hidden" name="id" value={s.id} />
                <input name="password" type="password" placeholder="Mật khẩu mới" minLength={8} required autoComplete="new-password" className={`${input} sm:flex-1`} />
                <button type="submit" className="rounded-lg border border-brand-gold/50 px-4 py-2 text-sm">
                  Đặt lại mật khẩu
                </button>
              </form>

              {s.id !== me.id && (
                <div className="flex flex-wrap gap-2">
                  <form action={setStaffActive}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="active" value={s.active ? "0" : "1"} />
                    <button type="submit" className="rounded-lg border border-brand-gold/50 px-4 py-2 text-sm">
                      {s.active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    </button>
                  </form>
                  <form action={deleteStaff}>
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmSubmit message={`Xóa tài khoản "${s.fullName}"? Không thể hoàn tác. Nếu chỉ muốn ngăn đăng nhập, hãy chọn Khóa.`} className="rounded-lg border border-red-300 text-red-800 px-4 py-2 text-sm hover:bg-red-50">
                      Xóa tài khoản
                    </ConfirmSubmit>
                  </form>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
