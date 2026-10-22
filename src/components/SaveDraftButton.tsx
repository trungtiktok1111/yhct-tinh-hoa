"use client";
import { useEffect, useRef } from "react";
import { Save } from "lucide-react";

const PANEL = "[data-exam-panel]:not([hidden])";

// Lưu nháp: lưu phần mà bác sĩ vừa nhập (form có data-draft chứa ô được chạm gần nhất ở tab đang mở).
// Không có phần nào được chạm thì lưu form lưu đầu tiên của tab, như trước đây.
// Chỉ chọn form có data-draft để không vô tình kích hoạt các form "Bỏ", "Hủy khám", "Hoàn tất khám".
export function SaveDraftButton() {
  const last = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const f = t.closest<HTMLFormElement>("form[data-draft]");
      if (f) last.current = f;
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, []);

  return (
    <button
      type="button"
      title="Lưu phần bạn vừa nhập ở tab đang mở"
      onClick={() => {
        const panel = document.querySelector<HTMLElement>(PANEL);
        if (!panel) return;
        const touched = last.current;
        const f =
          (touched && touched.isConnected && panel.contains(touched) ? touched : null) ??
          panel.querySelector<HTMLFormElement>("form[data-draft]") ??
          panel.querySelector<HTMLFormElement>("form");
        if (f) f.requestSubmit();
      }}
      className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 font-semibold hover:bg-slate-50"
    >
      <Save className="h-4 w-4" />Lưu nháp
    </button>
  );
}
