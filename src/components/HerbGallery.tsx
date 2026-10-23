"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, X, ChevronLeft, ChevronRight, ZoomIn, Sprout } from "lucide-react";

type Img = { src: string; cap: string };

// Ảnh vị thuốc: bấm để xem lớn; phóng/thu bằng nút +/−, lăn chuột, hoặc 2 ngón; kéo để di chuyển.
export function HerbGallery({ name, main, refs }: { name: string; main?: string | null; refs: Img[] }) {
  const all: Img[] = [...(main ? [{ src: main, cap: "Ảnh tiêu bản" }] : []), ...refs];
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      <button
        type="button" disabled={!main} onClick={() => main && setOpen(0)}
        className="specimen-frame group relative flex min-h-[180px] w-full items-center justify-center"
        aria-label={main ? `Xem lớn ảnh ${name}` : undefined}
      >
        {main ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={main} alt={name} className="relative max-h-56 w-auto rounded object-contain" />
            <span className="absolute bottom-2 right-2 rounded-full bg-black/55 p-1.5 text-white opacity-80 group-hover:opacity-100"><ZoomIn className="h-4 w-4" /></span>
          </>
        ) : (
          <div className="relative flex flex-col items-center gap-2 py-10 text-brand-ink/35">
            <Sprout className="h-10 w-10" strokeWidth={1.25} />
            <span className="text-xs">Chưa có ảnh tiêu bản</span>
          </div>
        )}
      </button>
      {refs.length > 0 && (
        <div className={`grid gap-2 ${refs.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {refs.map((r, i) => (
            <button type="button" key={r.cap} onClick={() => setOpen((main ? 1 : 0) + i)} className="specimen-frame group relative overflow-hidden rounded-lg text-left" aria-label={`Xem lớn ảnh ${name} ${r.cap.toLowerCase()}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.src} alt={`${name} - ${r.cap.toLowerCase()}`} className="h-28 w-full object-cover" loading="lazy" />
              <span className="absolute right-1.5 top-1.5 rounded-full bg-black/55 p-1 text-white opacity-80 group-hover:opacity-100"><ZoomIn className="h-3.5 w-3.5" /></span>
              <span className="block py-1 text-center text-xs font-semibold text-brand-deep">{r.cap}</span>
            </button>
          ))}
        </div>
      )}
      {open !== null && <Viewer name={name} imgs={all} start={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Viewer({ name, imgs, start, onClose }: { name: string; imgs: Img[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const [z, setZ] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const last = useRef<{ d: number; z: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => { setZ(1); setPos({ x: 0, y: 0 }); }, []);
  const zoom = useCallback((f: number) => setZ((v) => { const n = Math.min(8, Math.max(1, v * f)); if (n === 1) setPos({ x: 0, y: 0 }); return n; }), []);
  const go = useCallback((d: number) => { setI((v) => (v + d + imgs.length) % imgs.length); reset(); }, [imgs.length, reset]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoom(1.25);
      else if (e.key === "-") zoom(0.8);
      else if (e.key === "0") reset();
      else if (e.key === "ArrowLeft" && imgs.length > 1) go(-1);
      else if (e.key === "ArrowRight" && imgs.length > 1) go(1);
    };
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [onClose, zoom, reset, go, imgs.length]);

  // lăn chuột để phóng/thu (cần non-passive để chặn cuộn trang)
  useEffect(() => {
    const el = box.current; if (!el) return;
    const w = (e: WheelEvent) => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15); };
    el.addEventListener("wheel", w, { passive: false });
    return () => el.removeEventListener("wheel", w);
  }, [zoom]);

  function down(e: React.PointerEvent) { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); last.current = null; }
  function move(e: React.PointerEvent) {
    const p = pts.current.get(e.pointerId); if (!p) return;
    if (pts.current.size === 2) {
      pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = Array.from(pts.current.values());
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (last.current) setZ(Math.min(8, Math.max(1, last.current.z * (d / last.current.d))));
      else last.current = { d, z };
      return;
    }
    if (z > 1) setPos((v) => ({ x: v.x + e.clientX - p.x, y: v.y + e.clientY - p.y }));
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }
  function up(e: React.PointerEvent) { pts.current.delete(e.pointerId); last.current = null; }

  const cur = imgs[i];
  const btn = "rounded-full bg-white/15 p-2.5 text-white hover:bg-white/30";
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90" role="dialog" aria-modal="true" aria-label={`Ảnh ${name}`}>
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-white">
        <div className="min-w-0 truncate text-sm font-semibold">{name} · {cur.cap}{imgs.length > 1 ? ` (${i + 1}/${imgs.length})` : ""} · {Math.round(z * 100)}%</div>
        <div className="flex items-center gap-1.5">
          <button type="button" className={btn} onClick={() => zoom(0.8)} aria-label="Thu nhỏ"><Minus className="h-5 w-5" /></button>
          <button type="button" className={btn} onClick={() => zoom(1.25)} aria-label="Phóng to"><Plus className="h-5 w-5" /></button>
          <button type="button" className={btn} onClick={reset} aria-label="Về cỡ ban đầu"><RotateCcw className="h-5 w-5" /></button>
          <button type="button" className={btn} onClick={onClose} aria-label="Đóng"><X className="h-5 w-5" /></button>
        </div>
      </div>
      <div
        ref={box} className="relative flex-1 touch-none select-none overflow-hidden"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        onDoubleClick={() => (z > 1 ? reset() : setZ(2.5))}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cur.src} alt={`${name} - ${cur.cap}`} draggable={false}
          className="absolute left-1/2 top-1/2 max-h-[92%] max-w-[94%] object-contain"
          style={{ transform: `translate(-50%,-50%) translate(${pos.x}px,${pos.y}px) scale(${z})`, cursor: z > 1 ? "grab" : "zoom-in", transition: pts.current.size ? "none" : "transform .12s" }}
        />
        {imgs.length > 1 && (
          <>
            <button type="button" className={`${btn} absolute left-3 top-1/2 -translate-y-1/2`} onClick={() => go(-1)} aria-label="Ảnh trước"><ChevronLeft className="h-6 w-6" /></button>
            <button type="button" className={`${btn} absolute right-3 top-1/2 -translate-y-1/2`} onClick={() => go(1)} aria-label="Ảnh sau"><ChevronRight className="h-6 w-6" /></button>
          </>
        )}
      </div>
      <p className="px-3 py-1.5 text-center text-xs text-white/60">Lăn chuột hoặc dùng nút +/− để phóng/thu · kéo để di chuyển · bấm đúp để phóng nhanh · Esc để đóng</p>
    </div>
  );
}
