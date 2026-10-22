"use client";

import type { Opt } from "@/lib/tuchan";

const NORMAL_V = "binh_thuong";

// Lưới tích chọn của một mục tứ chẩn. "Bình thường" loại trừ các dấu hiệu bất thường trong cùng mục.
export function TuChanGrid({ opts, name, cur }: { opts: Opt[]; name: string; cur: string[] }) {
  function onChange(e: React.ChangeEvent<HTMLDivElement>) {
    const t = e.target as HTMLInputElement;
    if (t.type !== "checkbox" || !t.checked) return;
    const boxes = Array.from(e.currentTarget.querySelectorAll<HTMLInputElement>("input[type=checkbox]"));
    for (const b of boxes) {
      if (b === t) continue;
      if (t.value === NORMAL_V || b.value === NORMAL_V) b.checked = false;
    }
  }
  return (
    <div onChange={onChange} className="grid gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
      {opts.map((o) => (
        <label key={o.v} title={o.hint} className="flex items-start gap-2 text-sm leading-snug">
          <input type="checkbox" name={name} value={o.v} defaultChecked={cur.includes(o.v)} className="mt-1" />
          <span className={o.v === NORMAL_V ? "font-medium text-emerald-800" : ""}>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
