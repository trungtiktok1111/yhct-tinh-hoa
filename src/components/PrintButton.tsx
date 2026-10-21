"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-lg border border-brand-gold/50 px-4 py-2">
      In hóa đơn
    </button>
  );
}
