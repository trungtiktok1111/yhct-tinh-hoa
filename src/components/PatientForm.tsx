"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createPatient, updatePatient } from "@/actions/patient";
import { PersonFields } from "@/components/PersonFields";
import type { FormState } from "@/lib/person";

const cls = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

export type PatientValues = {
  id: string; fullName: string; birthDate: string | null; sex: string; nationalId: string | null; phone: string;
  email: string | null; address: string | null; ward: string | null; district: string | null; province: string | null;
  ethnicity: string | null; nationality: string | null; occupation: string | null; bloodType: string | null;
  insuranceNo: string | null; emergencyName: string | null; emergencyRelation: string | null; emergencyPhone: string | null;
  weightKg: number | null; heightCm: number | null; pastHistory: string | null; familyHistory: string | null;
  allergies: string | null; chronicConditions: string | null; note: string | null;
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

export function PatientForm({ patient }: { patient?: PatientValues }) {
  const [state, action] = useFormState<FormState, FormData>(patient ? updatePatient : createPatient, {});
  return (
    <form action={action} className="space-y-4">
      {patient && <input type="hidden" name="id" value={patient.id} />}
      {state.error && <div className="warn-box text-sm" role="alert">{state.error}</div>}

      <div className="card space-y-3">
        <h2 className="font-semibold">Thông tin hành chính</h2>
        <PersonFields v={patient} phoneRequired />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Dân tộc
            <input name="ethnicity" defaultValue={patient?.ethnicity ?? "Kinh"} className={cls} />
          </label>
          <label className="text-sm">Quốc tịch
            <input name="nationality" defaultValue={patient?.nationality ?? "Việt Nam"} className={cls} />
          </label>
          <label className="text-sm">Nghề nghiệp
            <input name="occupation" defaultValue={patient?.occupation ?? ""} className={cls} />
          </label>
          <label className="text-sm">Số thẻ BHYT
            <input name="insuranceNo" defaultValue={patient?.insuranceNo ?? ""} className={cls} />
          </label>
        </div>
      </div>

      <div className="card grid gap-3 sm:grid-cols-3">
        <h2 className="font-semibold sm:col-span-3">Người liên hệ khi cần</h2>
        <label className="text-sm">Họ tên
          <input name="emergencyName" defaultValue={patient?.emergencyName ?? ""} className={cls} />
        </label>
        <label className="text-sm">Quan hệ
          <input name="emergencyRelation" defaultValue={patient?.emergencyRelation ?? ""} placeholder="vd: vợ, con, cha" className={cls} />
        </label>
        <label className="text-sm">Điện thoại
          <input name="emergencyPhone" defaultValue={patient?.emergencyPhone ?? ""} inputMode="tel" className={cls} />
        </label>
      </div>

      <div className="card grid gap-3 sm:grid-cols-3">
        <h2 className="font-semibold sm:col-span-3">Chỉ số và tiền căn</h2>
        <label className="text-sm">Cân nặng (kg)
          <input name="weightKg" defaultValue={patient?.weightKg ?? ""} inputMode="decimal" className={cls} />
        </label>
        <label className="text-sm">Chiều cao (cm)
          <input name="heightCm" defaultValue={patient?.heightCm ?? ""} inputMode="decimal" className={cls} />
        </label>
        <label className="text-sm">Nhóm máu
          <select name="bloodType" defaultValue={patient?.bloodType ?? ""} className={cls}>
            <option value="">Chưa biết</option>
            {["A", "B", "AB", "O"].flatMap((g) => [`${g}+`, `${g}-`]).map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label className="text-sm sm:col-span-3">Tiền căn bản thân
          <textarea name="pastHistory" defaultValue={patient?.pastHistory ?? ""} rows={3} className={cls} />
        </label>
        <label className="text-sm sm:col-span-3">Tiền căn gia đình
          <textarea name="familyHistory" defaultValue={patient?.familyHistory ?? ""} rows={2} className={cls} />
        </label>
        <label className="text-sm sm:col-span-3">Dị ứng (thuốc, thức ăn...)
          <textarea name="allergies" defaultValue={patient?.allergies ?? ""} rows={2} className={cls} />
        </label>
        <label className="text-sm sm:col-span-3">Bệnh mạn tính đang có
          <textarea name="chronicConditions" defaultValue={patient?.chronicConditions ?? ""} rows={2} className={cls} />
        </label>
        <label className="text-sm sm:col-span-3">Ghi chú
          <textarea name="note" defaultValue={patient?.note ?? ""} rows={2} className={cls} />
        </label>
      </div>

      <Submit label={patient ? "Lưu thay đổi" : "Tạo hồ sơ"} />
    </form>
  );
}
