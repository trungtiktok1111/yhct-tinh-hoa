"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ImageUp, QrCode, X } from "lucide-react";

// Ô quét mã: nhận từ máy quét USB/Bluetooth (gõ vào ô) hoặc quét bằng camera điện thoại/máy tính.
// Quét được mã QR trên CCCD gắn chip, thẻ BHYT, mã BN. Quét xong tự gửi form tìm kiếm.
export function ScanInput({ name, onText, placeholder = "Quét mã…" }: { name?: string; onText?: (text: string) => void; placeholder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // Có onText: trả chuỗi quét được cho nơi gọi (không gửi form); không có: điền vào ô rồi gửi form tìm kiếm.
  function deliver(text: string) {
    if (onText) { if (inputRef.current) inputRef.current.value = ""; onText(text); return; }
    if (inputRef.current) inputRef.current.value = text;
    inputRef.current?.form?.requestSubmit();
  }

  // Chụp ảnh thẻ bằng camera gốc của điện thoại (nét hơn video trực tiếp) rồi đọc mã QR trong ảnh.
  async function fromPhoto(f: File | undefined) {
    if (!f) return;
    setErr(""); setBusy(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const holder = document.createElement("div");
      holder.id = "scan-file-tmp"; holder.style.display = "none"; document.body.appendChild(holder);
      try {
        const sc = new Html5Qrcode("scan-file-tmp");
        const text = await sc.scanFile(f, false);
        deliver(text);
      } finally { holder.remove(); }
    } catch {
      setErr("Không đọc được mã QR trong ảnh. Chụp lại gần hơn, đủ sáng, không chói, mã QR nằm trọn trong ảnh.");
    } finally { setBusy(false); }
  }

  useEffect(() => {
    if (!open) return;
    let stop: (() => Promise<void>) | null = null;
    let dead = false;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const sc = new Html5Qrcode("scan-view");
        await sc.start(
          { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
          { fps: 12, qrbox: (w: number, h: number) => { const m = Math.floor(Math.min(w, h) * 0.85); return { width: m, height: m }; }, aspectRatio: 1 },
          (text: string) => {
            if (dead) return;
            dead = true;
            sc.stop().catch(() => {}).finally(() => {
              setOpen(false);
              deliver(text);
            });
          },
          () => {},
        );
        stop = async () => { try { await sc.stop(); } catch { /* đã dừng */ } };
        if (dead) await stop();
      } catch {
        setErr("Không mở được camera. Hãy cho phép trình duyệt dùng camera (cần mở trang bằng https), hoặc dùng máy quét / gõ tay.");
      }
    })();
    return () => { dead = true; if (stop) void stop(); };
  }, [open]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <QrCode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input ref={inputRef} name={name} placeholder={placeholder} autoComplete="off" onKeyDown={onText ? (e) => { if (e.key === "Enter") { e.preventDefault(); const v = e.currentTarget.value.trim(); if (v) deliver(v); } } : undefined} className="w-full rounded-xl border border-dashed border-slate-400 bg-slate-50 py-2.5 pl-9 pr-3" />
        </div>
        <button type="button" onClick={() => { setErr(""); setOpen(true); }} className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold hover:border-brand-deep">
          <Camera className="h-4 w-4" />Camera
        </button>
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold hover:border-brand-deep">
          <ImageUp className="h-4 w-4" />{busy ? "Đang đọc…" : "Chụp ảnh"}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { void fromPhoto(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
      </div>
      {open && (
        <div className="rounded-xl border border-slate-300 bg-black/90 p-2">
          <div className="mb-1 flex items-center justify-between text-xs text-white/80">
            <span>Đưa mã QR trên CCCD / thẻ BHYT / mã BN vào khung</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng camera" className="rounded p-1 hover:bg-white/10"><X className="h-4 w-4" /></button>
          </div>
          <div id="scan-view" className="overflow-hidden rounded-lg" />
        </div>
      )}
      {err && <p className="warn-box text-xs">{err}</p>}
    </div>
  );
}
