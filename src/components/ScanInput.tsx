"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, QrCode, X } from "lucide-react";

// Ô quét mã: nhận từ máy quét USB/Bluetooth (gõ vào ô) hoặc quét bằng camera điện thoại/máy tính.
// Quét được mã QR trên CCCD gắn chip, thẻ BHYT, mã BN. Quét xong tự gửi form tìm kiếm.
export function ScanInput({ name }: { name: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) return;
    let stop: (() => Promise<void>) | null = null;
    let dead = false;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const sc = new Html5Qrcode("scan-view");
        await sc.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (text: string) => {
            if (dead) return;
            dead = true;
            if (inputRef.current) inputRef.current.value = text;
            sc.stop().catch(() => {}).finally(() => {
              setOpen(false);
              inputRef.current?.form?.requestSubmit();
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
          <input ref={inputRef} name={name} placeholder="Quét mã…" autoComplete="off" className="w-full rounded-xl border border-dashed border-slate-400 bg-slate-50 py-2.5 pl-9 pr-3" />
        </div>
        <button type="button" onClick={() => { setErr(""); setOpen(true); }} className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold hover:border-brand-deep">
          <Camera className="h-4 w-4" />Camera
        </button>
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
