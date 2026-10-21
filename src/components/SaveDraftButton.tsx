"use client";
import { Save } from "lucide-react";

// Lưu nháp: gửi form đang mở ở tab hiện tại (mỗi tab có form lưu riêng).
export function SaveDraftButton() {
  return (
    <button
      type="button"
      onClick={() => {
        const f = document.querySelector<HTMLFormElement>("[data-exam-panel]:not([hidden]) form");
        if (f) f.requestSubmit();
      }}
      className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 font-semibold hover:bg-slate-50"
    >
      <Save className="h-4 w-4" />Lưu nháp
    </button>
  );
}
