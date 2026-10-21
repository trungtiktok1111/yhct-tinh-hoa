"use client";

import { useEffect, useRef, useState } from "react";

// Bỏ dấu, hạ chữ thường để lọc "ha noi" ra "Hà Nội".
export const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();

// Ô nhập vừa chọn từ danh sách vừa gõ tay. Giá trị là chữ trong ô.
export function Combobox({
  name, label, value, onChange, options, placeholder, disabled, className, required,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const q = fold(value);
  const shown = (q ? options.filter((o) => fold(o).includes(q)) : options).slice(0, 60);
  return (
    <div ref={box} className={`relative ${className ?? ""}`}>
      <label className="text-sm block">
        {label}
        <input
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          autoComplete="off"
          placeholder={placeholder}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
          className="w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base disabled:bg-gray-100"
        />
      </label>
      {open && !disabled && shown.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-brand-gold/40 bg-white shadow-lg" role="listbox">
          {shown.map((o) => (
            <li
              key={o}
              role="option"
              aria-selected={o === value}
              onMouseDown={(e) => { e.preventDefault(); onChange(o); setOpen(false); }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-brand-cream"
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
