"use client";

import { useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

// Ô ngày: GÕ TAY dạng dd/mm/yyyy (tự thêm dấu "/") hoặc bấm biểu tượng lịch để chọn.
// Giá trị gửi lên form luôn là yyyy-mm-dd (ô ẩn cùng tên).
const toText = (iso?: string | null) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
};

function parse(raw: string): string | null {
  const t = raw.trim();
  if (!t) return "";
  let d: string, m: string, y: string;
  if (/^\d{8}$/.test(t)) { d = t.slice(0, 2); m = t.slice(2, 4); y = t.slice(4); }
  else {
    const p = t.split(/[\/.\-\s]+/);
    if (p.length !== 3 || p.some((x) => !/^\d+$/.test(x))) return null;
    [d, m, y] = p;
    if (y.length === 2) y = (Number(y) > 30 ? "19" : "20") + y;
    if (y.length !== 4) return null;
  }
  const dd = Number(d), mm = Number(m), yy = Number(y);
  const dt = new Date(Date.UTC(yy, mm - 1, dd));
  if (yy < 1000 || dt.getUTCFullYear() !== yy || dt.getUTCMonth() !== mm - 1 || dt.getUTCDate() !== dd) return null;
  return `${y}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

export function DateInput({
  name, defaultValue, value, onValue, required, min, max, className = "", placeholder = "dd/mm/yyyy",
}: {
  name: string; defaultValue?: string | null; value?: string | null; onValue?: (iso: string) => void;
  required?: boolean; min?: string; max?: string; className?: string; placeholder?: string;
}) {
  const [text, setText] = useState(toText(value ?? defaultValue));
  const [prev, setPrev] = useState(value);
  const txt = useRef<HTMLInputElement>(null);
  const toks = className.split(/\s+/).filter(Boolean);
  const isBox = (t: string) => /^(sm:|md:|lg:)?(w-|min-w-|max-w-|flex-|shrink|grow)/.test(t);
  const wrap = toks.filter(isBox).join(" ");
  const inner = toks.filter((t) => !isBox(t)).join(" ");
  const pick = useRef<HTMLInputElement>(null);

  // giá trị điều khiển từ ngoài (vd: sau khi quét CCCD)
  if (value !== undefined && value !== prev) { setPrev(value); setText(toText(value)); }

  const iso = parse(text);
  let msg = "";
  if (iso === null) msg = "Ngày không hợp lệ. Gõ dạng dd/mm/yyyy, vd 25/12/1990.";
  else if (iso && min && iso < min) msg = `Ngày phải từ ${toText(min)} trở đi.`;
  else if (iso && max && iso > max) msg = `Ngày không được sau ${toText(max)}.`;
  txt.current?.setCustomValidity(msg);

  function onChange(raw: string) {
    let v = raw.replace(/[^\d\/.\-\s]/g, "");
    // tự thêm "/" khi đang gõ liền số
    if (/^\d+$/.test(v) && v.length > text.replace(/\D/g, "").length) {
      if (v.length === 2 || v.length === 5) v += "/";
      else if (v.length > 2 && v.length < 5 && !v.includes("/")) v = v.slice(0, 2) + "/" + v.slice(2);
    }
    setText(v.slice(0, 10));
    const p = parse(v);
    if (p !== null) onValue?.(p);
  }
  function onBlur() {
    const p = parse(text);
    if (p) { setText(toText(p)); onValue?.(p); }
  }

  return (
    <span className={`relative ${wrap ? "inline-block" : "block"} ${wrap}`}>
      <input
        ref={txt} type="text" inputMode="numeric" autoComplete="off" placeholder={placeholder} maxLength={10}
        value={text} required={required} onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
        className={`${inner} w-full pr-11`}
      />
      <input type="hidden" name={name} value={iso ?? ""} />
      <button
        type="button" tabIndex={-1} aria-label="Chọn ngày từ lịch" title="Chọn từ lịch"
        onClick={() => { try { pick.current?.showPicker(); } catch { pick.current?.focus(); } }}
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-deep"
      >
        <CalendarDays className="h-4 w-4" />
      </button>
      <input
        ref={pick} type="date" tabIndex={-1} aria-hidden min={min} max={max} value={iso ?? ""}
        onChange={(e) => { if (e.target.value) { setText(toText(e.target.value)); onValue?.(e.target.value); } }}
        className="pointer-events-none absolute right-0 top-full h-0 w-0 opacity-0"
      />
    </span>
  );
}
