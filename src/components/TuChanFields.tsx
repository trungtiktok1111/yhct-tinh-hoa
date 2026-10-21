import { GROUPS, fieldName, type TuChanData } from "@/lib/tuchan";

const selCls = "w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2 text-sm";

// Các ô tứ chẩn có cấu trúc: mỗi nhóm là một khối gập, tích chọn nhiều hoặc chọn một.
export function TuChanFields({ data, groupNotes }: { data: TuChanData; groupNotes: Record<string, string | null> }) {
  const noteField: Record<string, string> = { vong: "inspection", van: "listening", vanhoi: "inquiry", thiet: "palpation" };
  return (
    <div className="space-y-3">
      {GROUPS.map((g, gi) => {
        const picked = g.sections.flatMap((s) => s.fields).reduce((n, f) => n + (data[f.key]?.v.length ?? 0), 0);
        return (
          <details key={g.key} open={gi === 0} className="rounded-xl border border-brand-gold/40 bg-white/60">
            <summary className="cursor-pointer select-none px-4 py-3">
              <span className="font-semibold text-brand-deep">{g.title}</span>
              <span className="ml-2 text-xs text-gray-600">{g.sub}</span>
              {picked > 0 && <span className="ml-2 rounded-full bg-brand-deep px-2 py-0.5 text-xs text-brand-cream">{picked} mục</span>}
            </summary>
            <div className="space-y-3 border-t border-brand-gold/30 p-3">
              {g.sections.map((s) => (
                <details key={s.key} className="rounded-lg border border-brand-gold/25 bg-white" open={gi === 0 && s.key === "than"}>
                  <summary className="cursor-pointer select-none px-3 py-2 text-sm font-semibold">
                    {s.title}
                    {(() => {
                      const n = s.fields.reduce((a, f) => a + (data[f.key]?.v.length ?? 0), 0);
                      return n > 0 ? <span className="ml-2 rounded-full bg-brand-gold/30 px-2 py-0.5 text-xs">{n}</span> : null;
                    })()}
                  </summary>
                  <div className="space-y-3 px-3 pb-3">
                    {s.intro && <p className="text-xs text-gray-600">{s.intro}</p>}
                    {s.fields.map((f) => {
                      const cur = new Set(data[f.key]?.v ?? []);
                      return (
                        <fieldset key={f.key} className="space-y-1">
                          <legend className="text-sm font-medium">{f.label}</legend>
                          {f.help && <p className="text-xs text-gray-600">{f.help}</p>}
                          {f.kind === "single" ? (
                            <select name={fieldName(f.key)} defaultValue={[...cur][0] ?? ""} className={selCls}>
                              <option value="">— Chưa ghi —</option>
                              {f.opts.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
                            </select>
                          ) : (
                            <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                              {f.opts.map((o) => (
                                <label key={o.v} title={o.hint} className="flex items-start gap-2 text-sm leading-snug">
                                  <input type="checkbox" name={fieldName(f.key)} value={o.v} defaultChecked={cur.has(o.v)} className="mt-1" />
                                  <span>{o.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </fieldset>
                      );
                    })}
                  </div>
                </details>
              ))}
              <label className="block text-sm">Ghi chú thêm, mô tả tự do ({g.title.split(" (")[0].toLowerCase()})
                <textarea name={noteField[g.key]} defaultValue={groupNotes[g.key] ?? ""} className="w-full rounded-lg border border-brand-gold/40 bg-white px-3 py-2 text-base min-h-[4.5rem]" />
              </label>
            </div>
          </details>
        );
      })}
    </div>
  );
}
