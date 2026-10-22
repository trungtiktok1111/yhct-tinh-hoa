"use client";

import { useState } from "react";
import { FileImage } from "lucide-react";
import { parseCccdQr, parseCccdText, type CccdInfo } from "@/lib/cccd";

// Chọn/chụp ảnh CCCD hoặc ảnh chụp màn hình VNeID: thử đọc mã QR trước (chính xác nhất),
// không có QR thì đọc CHỮ trên ảnh (OCR tiếng Việt) rồi tách các trường.
export function IdPhoto({ onInfo, onError }: { onInfo: (i: CccdInfo, how: "qr" | "ocr") => void; onError: (m: string) => void }) {
  const [busy, setBusy] = useState("");

  // PDF → ảnh từng trang (tối đa 3 trang đầu)
  async function pdfPages(f: File): Promise<File[]> {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();
    const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
    const out: File[] = [];
    for (let i = 1; i <= Math.min(doc.numPages, 3); i++) {
      const page = await doc.getPage(i);
      const vp = page.getViewport({ scale: 2.5 });
      const c = document.createElement("canvas");
      c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
      await page.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise;
      const blob: Blob = await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("canvas"))), "image/png"));
      out.push(new File([blob], `trang-${i}.png`, { type: "image/png" }));
    }
    return out;
  }

  async function qrOf(f: File) {
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const holder = document.createElement("div");
      holder.id = "idphoto-tmp"; holder.style.display = "none"; document.body.appendChild(holder);
      try {
        const text = await new Html5Qrcode("idphoto-tmp").scanFile(f, false);
        const r = parseCccdQr(text);
        return "error" in r ? null : r;
      } finally { holder.remove(); }
    } catch { return null; }
  }

  async function run(f: File | undefined) {
    if (!f) return;
    try {
      let pages: File[] = [f];
      if (f.type === "application/pdf" || /\.pdf$/i.test(f.name)) { setBusy("Đang mở PDF…"); pages = await pdfPages(f); }
      setBusy("Đang đọc mã QR…");
      for (const pg of pages) { const r = await qrOf(pg); if (r) { onInfo(r, "qr"); return; } }

      setBusy("Đang đọc chữ trên ảnh (lần đầu cần tải dữ liệu tiếng Việt, ~15 giây)…");
      const { createWorker } = await import("tesseract.js");
      const w = await createWorker("vie");
      try {
        let text = "";
        for (const pg of pages) text += "\n" + (await w.recognize(pg)).data.text;
        const r = parseCccdText(text);
        if ("error" in r) onError(r.error); else onInfo(r, "ocr");
      } finally { await w.terminate(); }
    } catch {
      onError("Không đọc được tệp. Kiểm tra mạng rồi thử lại, hoặc dùng nút Camera quét mã QR.");
    } finally { setBusy(""); }
  }

  return (
    <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold hover:border-brand-deep">
      <FileImage className="h-4 w-4" />{busy || "Đọc ảnh / PDF CCCD, VNeID"}
      <input type="file" accept="image/*,application/pdf,.pdf" className="hidden" disabled={!!busy} onChange={(e) => { void run(e.target.files?.[0]); e.target.value = ""; }} />
    </label>
  );
}
