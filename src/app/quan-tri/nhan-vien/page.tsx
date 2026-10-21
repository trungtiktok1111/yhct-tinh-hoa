import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { parseRoles, rolesLabel } from "@/lib/permissions";
import { resetStaffPassword, setStaffActive, deleteStaff } from "@/actions/admin";
import { BackLink } from "@/components/BackLink";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { StaffForm } from "@/components/StaffForm";
import { toDateInput } from "@/lib/person";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

export default async function StaffPage({ searchParams }: { searchParams: { loi?: string; ok?: string } }) {
  const me = await requireRole("OWNER");
  const [staff, branches] = await Promise.all([
    prisma.staff.findMany({
      orderBy: { createdAt: "asc" },
      include: { branches: { select: { branchId: true } } },
    }),
    prisma.branch.findMany({ where: { active: true }, orderBy: { createdAt: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <BackLink href="/quan-tri" label="Quay lại Quản trị" />
      <h1 className="text-2xl font-bold font-display">Nhân viên</h1>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">Đã lưu.</div>}

      <details className="card">
        <summary className="cursor-pointer font-semibold">+ Thêm nhân viên</summary>
        <div className="mt-4">
          <StaffForm branches={branches} />
        </div>
      </details>

      <div className="space-y-3">
        {staff.map((s) => (
          <details key={s.id} className="card">
            <summary className="cursor-pointer flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0">
                <span className="font-semibold">{s.fullName}</span>{" "}
                <span className="text-sm text-gray-600">@{s.username} · {rolesLabel(s.role)}{s.jobTitle ? ` · ${s.jobTitle}` : ""}</span>
              </span>
              {!s.active && <span className="status-pill status-RETIRED">Đã khóa</span>}
            </summary>

            <div className="mt-4 space-y-4">
              <StaffForm
                branches={branches}
                staff={{
                  id: s.id, username: s.username, fullName: s.fullName, roles: parseRoles(s.role),
                  branchIds: s.branches.map((b) => b.branchId),
                  birthDate: toDateInput(s.birthDate) || null, sex: s.sex, nationalId: s.nationalId, phone: s.phone,
                  email: s.email, address: s.address, ward: s.ward, district: s.district, province: s.province,
                  jobTitle: s.jobTitle, licenseNo: s.licenseNo, hireDate: toDateInput(s.hireDate) || null, note: s.note,
                }}
              />

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
