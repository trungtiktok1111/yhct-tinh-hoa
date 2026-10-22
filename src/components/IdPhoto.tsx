"use client";

import { useState } from "react";
import { FileImage } from "lucide-react";
import { parseCccdQr, parseCccdText, type CccdInfo } from "@/lib/cccd";

// Chọn/chụp ảnh CCCD hoặc ảnh chụp màn hình VNeID: thử đọc mã QR trước (chính xác nhất),
// không có QR thì đọc CHỮ trên ảnh (OCR tiếng Việt) rồi tách các trường.
export function IdPhoto({ onInfo, onError }: { onInfo: (i: CccdInfo, how: "qr" | "ocr") => void; onError: (m: string) => void }) {
  const [busy, setBusy] = useState("");

  async function run(f: File | undefined) {
    if (!f) return;
    setBusy("Đang đọc mã QR…");
    try {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const holder = document.createElement("div");
        holder.id = "idphoto-tmp"; holder.style.display = "none"; document.body.appendChild(holder);
        try {
          const text = await new Html5Qrcode("idphoto-tmp").scanFile(f, false);
          const r = parseCccdQr(text);
          if (!("error" in r)) { onInfo(r, "qr"); return; }
        } finally { holder.remove(); }
      } catch { /* không có QR → đọc chữ */ }

      setBusy("Đang đọc chữ trên ảnh (lần đầu cần tải dữ liệu tiếng Việt, ~15 giây)…");
      const { createWorker } = await import("tesseract.js");
      const w = await createWorker("vie");
      try {
        const { data } = await w.recognize(f);
        const r = parseCccdText(data.text);
        if ("error" in r) onError(r.error); else onInfo(r, "ocr");
      } finally { await w.terminate(); }
    } catch {
      onError("Không đọc được ảnh. Kiểm tra mạng rồi thử lại, hoặc dùng nút Camera quét mã QR.");
    } finally { setBusy(""); }
  }

  return (
    <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold hover:border-brand-deep">
      <FileImage className="h-4 w-4" />{busy || "Đọc ảnh CCCD / VNeID (QR + chữ)"}
      <input type="file" accept="image/*" className="hidden" disabled={!!busy} onChange={(e) => { void run(e.target.files?.[0]); e.target.value = ""; }} />
    </label>
  );
}
