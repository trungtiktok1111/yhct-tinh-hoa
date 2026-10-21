import { AddressFields } from "@/components/AddressFields";
const cls = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

type V = {
  fullName?: string | null; birthDate?: string | null; sex?: string | null; nationalId?: string | null;
  phone?: string | null; email?: string | null; address?: string | null; ward?: string | null;
  district?: string | null; province?: string | null;
};

// Các ô thông tin cơ bản của một công dân: dùng cho bệnh nhân và nhân viên.
export function PersonFields({ v = {}, phoneRequired = false }: { v?: V; phoneRequired?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">Họ và tên *
        <input name="fullName" defaultValue={v.fullName ?? ""} required className={cls} />
      </label>
      <label className="text-sm">Ngày tháng năm sinh *
        <input name="birthDate" type="date" defaultValue={v.birthDate ?? ""} required min="1900-01-01" className={cls} />
      </label>
      <label className="text-sm">Giới tính *
        <select name="sex" defaultValue={v.sex ?? ""} required className={cls}>
          <option value="" disabled>Chọn</option>
          <option value="M">Nam</option>
          <option value="F">Nữ</option>
          <option value="O">Khác</option>
        </select>
      </label>
      <label className="text-sm">Số CCCD / CMND / hộ chiếu
        <input name="nationalId" defaultValue={v.nationalId ?? ""} inputMode="numeric" className={cls} />
      </label>
      <label className="text-sm">Số điện thoại{phoneRequired ? " *" : ""}
        <input name="phone" defaultValue={v.phone ?? ""} inputMode="tel" required={phoneRequired} className={cls} />
      </label>
      <label className="text-sm sm:col-span-2">Email
        <input name="email" type="email" defaultValue={v.email ?? ""} className={cls} />
      </label>
      <div className="sm:col-span-2">
        <AddressFields address={v.address} ward={v.ward} province={v.province} />
      </div>
    </div>
  );
}
