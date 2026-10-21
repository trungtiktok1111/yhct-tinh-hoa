"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createStaff, updateStaff } from "@/actions/admin";
import { PersonFields } from "@/components/PersonFields";
import { ROLES, ROLE_KEYS } from "@/lib/permissions";
import type { FormState } from "@/lib/person";

const cls = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

export type StaffValues = {
  id: string; username: string; fullName: string; roles: string[]; branchIds: string[];
  birthDate: string | null; sex: string | null; nationalId: string | null; phone: string | null; email: string | null;
  address: string | null; ward: string | null; district: string | null; province: string | null;
  jobTitle: string | null; licenseNo: string | null; hireDate: string | null; note: string | null;
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto bg-brand-deep hover:bg-brand-deeper text-brand-cream rounded-lg px-6 py-2.5 font-semibold disabled:opacity-60"
    >
      {pending ? "Đang lưu…" : label}
    </button>
  );
}

export function StaffForm({
  staff,
  branches,
}: {
  staff?: StaffValues;
  branches: { id: string; name: string }[];
}) {
  const [state, action] = useFormState<FormState, FormData>(staff ? updateStaff : createStaff, {});
  return (
    <form action={action} className="space-y-4">
      {staff && <input type="hidden" name="id" value={staff.id} />}
      {state.error && <div className="warn-box text-sm" role="alert">{state.error}</div>}

      <PersonFields v={staff} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Chức danh
          <input name="jobTitle" defaultValue={staff?.jobTitle ?? ""} placeholder="vd: Bác sĩ CKI, Dược sĩ, Điều dưỡng" className={cls} />
        </label>
        <label className="text-sm">Số chứng chỉ hành nghề
          <input name="licenseNo" defaultValue={staff?.licenseNo ?? ""} className={cls} />
        </label>
        <label className="text-sm">Ngày vào làm
          <input name="hireDate" type="date" defaultValue={staff?.hireDate ?? ""} className={cls} />
        </label>
        <label className="text-sm">Ghi chú
          <input name="note" defaultValue={staff?.note ?? ""} className={cls} />
        </label>
      </div>

      {!staff && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Tên đăng nhập * (chữ thường, không dấu)
            <input name="username" autoCapitalize="none" required className={cls} />
          </label>
          <label className="text-sm">Mật khẩu * (tối thiểu 8 ký tự)
            <input name="password" type="password" minLength={8} required autoComplete="new-password" className={cls} />
          </label>
        </div>
      )}

      <fieldset className="flex flex-wrap gap-x-4 gap-y-2">
        <legend className="text-sm font-medium mb-1">Vai trò * (chọn một hoặc nhiều)</legend>
        {ROLE_KEYS.map((r) => (
          <label key={r} className="flex items-center gap-2 text-sm py-1">
            <input type="checkbox" name="roles" value={r} defaultChecked={staff?.roles.includes(r)} className="h-5 w-5" />
            {ROLES[r]}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-wrap gap-x-4 gap-y-2">
        <legend className="text-sm font-medium mb-1">Chi nhánh làm việc (Chủ tự động thấy tất cả)</legend>
        {branches.length === 0 && <span className="text-sm text-gray-600">Chưa có chi nhánh. Tạo chi nhánh trước.</span>}
        {branches.map((b) => (
          <label key={b.id} className="flex items-center gap-2 text-sm py-1">
            <input type="checkbox" name="branchIds" value={b.id} defaultChecked={staff?.branchIds.includes(b.id)} className="h-5 w-5" />
            {b.name}
          </label>
        ))}
      </fieldset>

      <Submit label={staff ? "Lưu thay đổi" : "Thêm nhân viên"} />
    </form>
  );
}
