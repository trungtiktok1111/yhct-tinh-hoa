"use client";

import { useEffect, useState } from "react";
import { Combobox, fold } from "@/components/Combobox";
import { VN_PROVINCES } from "@/lib/vn-provinces";

const cls = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";
const PROVINCE_NAMES = VN_PROVINCES.map((p) => p.name);

// Tỉnh/thành -> xã/phường/đặc khu theo địa giới từ 01/07/2025 (không còn cấp quận/huyện).
// Chọn từ danh sách hoặc gõ tay đều được; tỉnh không có trong danh sách thì xã/phường gõ tay.
export function AddressFields({
  address, ward, province,
}: {
  address?: string | null; ward?: string | null; province?: string | null;
}) {
  const [prov, setProv] = useState(province ?? "");
  const [wd, setWd] = useState(ward ?? "");
  const [wards, setWards] = useState<string[]>([]);

  const matched = VN_PROVINCES.find((p) => fold(p.name) === fold(prov)) ??
    // cho phép gõ thiếu chữ "Tỉnh"/"Thành phố"
    VN_PROVINCES.find((p) => fold(p.name.replace(/^(Tỉnh|Thành phố)\s+/, "")) === fold(prov));

  useEffect(() => {
    let cancelled = false;
    if (!matched) { setWards([]); return; }
    fetch(`/vn/wards-${matched.id}.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((l: string[]) => { if (!cancelled) setWards(l); })
      .catch(() => { if (!cancelled) setWards([]); });
    return () => { cancelled = true; };
  }, [matched?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Combobox
        name="province" label="Tỉnh / thành phố" value={prov} onChange={(v) => { setProv(v); }}
        options={PROVINCE_NAMES} placeholder="Chọn hoặc gõ, vd: ha noi" className="sm:col-span-1"
      />
      <Combobox
        name="ward" label="Xã / phường / đặc khu" value={wd} onChange={setWd}
        options={wards} placeholder={matched ? "Chọn hoặc gõ tên" : "Chọn tỉnh trước, hoặc gõ tay"} className="sm:col-span-1"
      />
      <label className="text-sm sm:col-span-2">Số nhà, đường, thôn/xóm
        <input name="address" defaultValue={address ?? ""} className={cls} />
      </label>
    </div>
  );
}
