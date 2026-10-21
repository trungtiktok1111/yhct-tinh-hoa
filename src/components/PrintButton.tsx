"use client";

export function PrintButton({ label = "In hóa đơn" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold hover:bg-slate-50">
      {label}
    </button>
  );
}
