"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { AddressFields } from "@/components/AddressFields";
import { DateInput } from "@/components/DateInput";
import { ScanInput } from "@/components/ScanInput";
import { IdPhoto } from "@/components/IdPhoto";
import { parseCccdQr, type CccdInfo } from "@/lib/cccd";

const cls = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base";

type V = {
  fullName?: string | null; birthDate?: string | null; sex?: string | null; nationalId?: string | null;
  phone?: string | null; email?: string | null; address?: string | null; ward?: string | null;
  district?: string | null; province?: string | null;
};

const todayIso = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);

// Các ô thông tin cơ bản của một công dân: dùng cho bệnh nhân và nhân viên.
// Quét QR trên CCCD gắn chip hoặc ảnh/mã QR VNeID để tự điền.
export function PersonFields({ v = {}, phoneRequired = false }: { v?: V; phoneRequired?: boolean }) {
  const [name, setName] = useState(v.fullName ?? "");
  const [dob, setDob] = useState(v.birthDate ?? "");
  const [sex, setSex] = useState(v.sex ?? "");
  const [nid, setNid] = useState(v.nationalId ?? "");
  const [addr, setAddr] = useState({ address: v.address ?? "", ward: v.ward ?? "", province: v.province ?? "", k: 0 });
  const [scan, setScan] = useState<{ ok?: string; err?: string }>({});

  function onScan(text: string) {
    const r = parseCccdQr(text);
    if ("error" in r) { setScan({ err: r.error }); return; }
    apply(r, "qr");
  }
  function apply(r: CccdInfo, how: "qr" | "ocr") {
    // chỉ ghi đè ô nào đọc được; ô không đọc được giữ nguyên
    if (r.fullName) setName(r.fullName);
    if (r.birthDate) setDob(r.birthDate);
    if (r.sex !== "O" || how === "qr") setSex(r.sex);
    if (r.nationalId) setNid(r.nationalId);
    if (r.rawAddress) setAddr((a) => ({ address: r.address, ward: r.ward, province: r.province, k: a.k + 1 }));
    const miss = [!r.fullName && "họ tên", !r.birthDate && "ngày sinh", !r.nationalId && "số CCCD", !r.rawAddress && "địa chỉ"].filter(Boolean);
    setScan({ ok: `Đã điền (${how === "qr" ? "từ mã QR" : "đọc chữ trên ảnh — có thể sai dấu/số, kiểm tra kỹ"}): ${r.fullName || "—"} · CCCD ${r.nationalId || "—"}. Địa chỉ đọc được: ${r.rawAddress || "(trống)"}.${miss.length ? ` Chưa đọc được: ${miss.join(", ")} — nhập tay.` : ""}` });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2 rounded-xl border border-dashed border-brand-deep/40 bg-brand-deep/5 p-3">
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-brand-deep">
          <BadgeCheck className="h-4 w-4" />Quét CCCD / VNeID để tự điền thông tin
        </div>
        <ScanInput onText={onScan} placeholder="Quét mã QR trên CCCD hoặc ảnh VNeID…" />
        <div className="mt-2"><IdPhoto onInfo={apply} onError={(m) => setScan({ err: m })} /></div>
        <p className="mt-1.5 text-xs text-brand-ink/60">
          <b>Camera</b>/<b>Chụp ảnh</b>: quét mã QR. <b>Đọc ảnh CCCD / VNeID</b>: chọn ảnh thẻ hoặc ảnh chụp màn hình VNeID, app đọc mã QR, không có QR thì đọc chữ. Máy quét USB: bấm vào ô rồi quét.
        </p>
        {scan.ok && <p className="mt-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-800">{scan.ok}</p>}
        {scan.err && <p className="warn-box mt-1.5 text-xs">{scan.err}</p>}
      </div>
      <label className="text-sm sm:col-span-2">Họ và tên *
        <input name="fullName" value={name} onChange={(e) => setName(e.target.value)} required className={cls} />
      </label>
      <label className="text-sm">Ngày tháng năm sinh * <span className="text-xs text-brand-ink/50">(gõ dd/mm/yyyy)</span>
        <DateInput name="birthDate" value={dob} onValue={setDob} required min="1900-01-01" max={todayIso()} className={cls} />
      </label>
      <label className="text-sm">Giới tính *
        <select name="sex" value={sex} onChange={(e) => setSex(e.target.value)} required className={cls}>
          <option value="" disabled>Chọn</option>
          <option value="M">Nam</option>
          <option value="F">Nữ</option>
          <option value="O">Khác</option>
        </select>
      </label>
      <label className="text-sm">Số CCCD / CMND / hộ chiếu
        <input name="nationalId" value={nid} onChange={(e) => setNid(e.target.value)} inputMode="numeric" className={cls} />
      </label>
      <label className="text-sm">Số điện thoại{phoneRequired ? " *" : ""}
        <input name="phone" defaultValue={v.phone ?? ""} inputMode="tel" required={phoneRequired} className={cls} />
      </label>
      <label className="text-sm sm:col-span-2">Email
        <input name="email" type="email" defaultValue={v.email ?? ""} className={cls} />
      </label>
      <div className="sm:col-span-2">
        <AddressFields key={addr.k} address={addr.address} ward={addr.ward} province={addr.province} />
      </div>
    </div>
  );
}
