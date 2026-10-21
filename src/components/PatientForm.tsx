import { createPatient, updatePatient } from "@/actions/patient";

const cls = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

type P = {
  id: string; fullName: string; birthYear: number; sex: string; phone: string; address: string | null;
  occupation: string | null; weightKg: number | null; heightCm: number | null; pastHistory: string | null;
  familyHistory: string | null; allergies: string | null; chronicConditions: string | null; note: string | null;
};

export function PatientForm({ patient }: { patient?: P }) {
  return (
    <form action={patient ? updatePatient : createPatient} className="space-y-4">
      {patient && <input type="hidden" name="id" value={patient.id} />}
      <div className="card grid gap-3 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">Thông tin hành chính</h2>
        <label className="text-sm sm:col-span-2">Họ tên *
          <input name="fullName" defaultValue={patient?.fullName} required className={cls} />
        </label>
        <label className="text-sm">Năm sinh *
          <input name="birthYear" defaultValue={patient?.birthYear} inputMode="numeric" required placeholder="vd: 1985" className={cls} />
        </label>
        <label className="text-sm">Giới tính *
          <select name="sex" defaultValue={patient?.sex ?? ""} required className={cls}>
            <option value="" disabled>Chọn</option>
            <option value="M">Nam</option>
            <option value="F">Nữ</option>
            <option value="O">Khác</option>
          </select>
        </label>
        <label className="text-sm">Điện thoại *
          <input name="phone" defaultValue={patient?.phone} inputMode="tel" required className={cls} />
        </label>
        <label className="text-sm">Nghề nghiệp
          <input name="occupation" defaultValue={patient?.occupation ?? ""} className={cls} />
        </label>
        <label className="text-sm sm:col-span-2">Địa chỉ
          <input name="address" defaultValue={patient?.address ?? ""} className={cls} />
        </label>
      </div>

      <div className="card grid gap-3 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">Chỉ số và tiền căn</h2>
        <label className="text-sm">Cân nặng (kg)
          <input name="weightKg" defaultValue={patient?.weightKg ?? ""} inputMode="decimal" className={cls} />
        </label>
        <label className="text-sm">Chiều cao (cm)
          <input name="heightCm" defaultValue={patient?.heightCm ?? ""} inputMode="decimal" className={cls} />
        </label>
        <label className="text-sm sm:col-span-2">Tiền căn bản thân
          <textarea name="pastHistory" defaultValue={patient?.pastHistory ?? ""} rows={3} className={cls} />
        </label>
        <label className="text-sm sm:col-span-2">Tiền căn gia đình
          <textarea name="familyHistory" defaultValue={patient?.familyHistory ?? ""} rows={2} className={cls} />
        </label>
        <label className="text-sm sm:col-span-2">Dị ứng (thuốc, thức ăn...)
          <textarea name="allergies" defaultValue={patient?.allergies ?? ""} rows={2} className={cls} />
        </label>
        <label className="text-sm sm:col-span-2">Bệnh mạn tính đang có
          <textarea name="chronicConditions" defaultValue={patient?.chronicConditions ?? ""} rows={2} className={cls} />
        </label>
        <label className="text-sm sm:col-span-2">Ghi chú
          <textarea name="note" defaultValue={patient?.note ?? ""} rows={2} className={cls} />
        </label>
      </div>

      <button type="submit" className="w-full sm:w-auto bg-brand-deep hover:bg-brand-deeper text-brand-cream rounded-lg px-6 py-2.5 font-semibold">
        {patient ? "Lưu thay đổi" : "Tạo hồ sơ"}
      </button>
    </form>
  );
}
