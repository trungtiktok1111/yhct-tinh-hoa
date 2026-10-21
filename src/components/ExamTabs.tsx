"use client";
import { useEffect, useState } from "react";

export type ExamTab = { key: string; label: string; ids: string[]; content: React.ReactNode };

// Tab các bước khám. Mọi tab đều có mặt trong DOM (chỉ ẩn bằng CSS) nên form không bị mất khi chuyển bước.
export function ExamTabs({ tabs }: { tabs: ExamTab[] }) {
  const [cur, setCur] = useState(tabs[0].key);
  useEffect(() => {
    const go = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (!h) return;
      const t = tabs.find((x) => x.key === h || x.ids.includes(h));
      if (t) {
        setCur(t.key);
        setTimeout(() => document.getElementById(h)?.scrollIntoView({ block: "start" }), 50);
      }
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, [tabs]);
  const idx = tabs.findIndex((t) => t.key === cur);
  const move = (i: number) => { setCur(tabs[i].key); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="space-y-4">
      <div className="sticky top-[3.75rem] z-10 -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {tabs.map((t, i) => (
          <button
            key={t.key} type="button" onClick={() => move(i)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${i === idx ? "bg-brand-deep text-white" : "text-brand-ink/75 hover:bg-slate-100"}`}
          >
            <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${i === idx ? "bg-brand-goldLight text-brand-deeper" : "bg-slate-200"}`}>{i + 1}</span>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.key} hidden={t.key !== cur} data-exam-panel className="space-y-4">
          {t.content}
          <div className="flex justify-between pt-1">
            {i > 0 ? <button type="button" onClick={() => move(i - 1)} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold hover:bg-slate-50">◂ {tabs[i - 1].label}</button> : <span />}
            {i < tabs.length - 1 && <button type="button" onClick={() => move(i + 1)} className="rounded-xl bg-brand-deep px-5 py-2.5 font-semibold text-white hover:bg-brand-deeper">Bước tiếp: {tabs[i + 1].label} ▸</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
