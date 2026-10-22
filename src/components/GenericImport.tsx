"use client";
import { useState } from "react";
import { runImport } from "@/actions/importer";

type Row = { row: number; label: string; detail: string; errors: string[]; warnings: string[] };
type Preview = { fileErrors: string[]; rows: Row[]; summary: string; duplicate: boolean };

// Chọn file, tự xem trước từng dòng, chỉ cho nhập khi không còn lỗi (cảnh báo cần tích xác nhận).
export function GenericImport({ id, name, branches, needsBranch, columns, hint }: { id: string; name: string; branches: { id: string; name: string }[]; needsBranch: boolean; columns: [string, string]; hint: string }) {
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [prev, setPrev] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [confirm, setConfirm] = useState(false);

  async function look(f: File | null, b: string) {
    setPrev(null); setErr(""); setConfirm(false);
    if (!f) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", f); fd.set("branchId", b);
      const res = await fetch(`/bieu-mau/nhap/${id}/xem`, { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) setErr(j.error ?? "Không đọc được file."); else setPrev(j);
    } catch { setErr("Không đọc được file."); }
    setBusy(false);
  }
  const bad = prev?.rows.filter((r) => r.errors.length).length ?? 0;
  const warn = prev?.rows.filter((r) => r.warnings.length).length ?? 0;
  const canGo = !!prev && !prev.fileErrors.length && !prev.duplicate && bad === 0 && prev.rows.length > 0 && (warn === 0 || confirm);

  return (
    <form action={runImport} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <div className="card !p-4 space-y-3">
        {needsBranch && (
          <label className="block text-sm font-medium">Chi nhánh
            <select name="branchId" value={branchId} onChange={(e) => { setBranchId(e.target.value); look(file, e.target.value); }} className="mt-1 block w-full max-w-sm rounded-xl border border-slate-300 bg-white px-3 py-2">
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
        )}
        <label className="block text-sm font-medium">File {name} đã điền (.xlsx)
          <input type="file" name="file" accept=".xlsx" onChange={(e) => { const f = e.target.files?.[0] ?? null; setFile(f); look(f, branchId); }} className="mt-1 block w-full max-w-md text-sm" />
        </label>
        <p className="text-xs text-brand-ink/60">{hint}</p>
        {busy && <p className="text-sm text-brand-ink/70">Đang kiểm tra file...</p>}
        {err && <p className="warn-box text-sm">{err}</p>}
      </div>

      {prev && (
        <div className="card !p-0 overflow-hidden">
          {prev.fileErrors.map((e) => <p key={e} className="warn-box m-3 text-sm">{e}</p>)}
          {prev.duplicate && <p className="warn-box m-3 text-sm">File này đã được nhập trước đó. Không nhập lại để tránh trùng, hãy tải mẫu mới.</p>}
          {prev.rows.length > 0 && (
            <>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[var(--line)] px-4 py-3 text-sm">
                <span className="font-semibold">{prev.summary}</span>
                {bad > 0 && <span className="font-medium text-rose-700">{bad} dòng lỗi</span>}
                {warn > 0 && <span className="font-medium text-amber-700">{warn} dòng cảnh báo</span>}
                {bad === 0 && warn === 0 && <span className="font-medium text-emerald-700">Tất cả hợp lệ</span>}
              </div>
              <div className="max-h-[28rem] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-left text-xs text-brand-ink/70"><tr><th className="px-3 py-2">Dòng</th><th className="px-3 py-2">{columns[0]}</th><th className="px-3 py-2">{columns[1]}</th><th className="px-3 py-2">Kiểm tra</th></tr></thead>
                  <tbody>
                    {prev.rows.map((r) => (
                      <tr key={r.row} className={`border-t border-[var(--line)] align-top ${r.errors.length ? "bg-rose-50" : r.warnings.length ? "bg-amber-50" : ""}`}>
                        <td className="px-3 py-2 tabular-nums">{r.row}</td>
                        <td className="px-3 py-2 font-medium">{r.label}</td>
                        <td className="px-3 py-2">{r.detail}</td>
                        <td className="px-3 py-2 text-xs">
                          {r.errors.map((e) => <div key={e} className="font-medium text-rose-700">{e}</div>)}
                          {r.warnings.map((w) => <div key={w} className="text-amber-700">{w}</div>)}
                          {!r.errors.length && !r.warnings.length && <span className="text-emerald-700">Hợp lệ</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {prev && warn > 0 && bad === 0 && (
        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="confirmOdd" value="1" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="h-4 w-4" />Tôi đã kiểm tra các dòng cảnh báo</label>
      )}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={!canGo} className="rounded-xl bg-brand-deep px-6 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Nhập vào app</button>
        {bad > 0 && <span className="text-sm text-rose-700">Có dòng lỗi nên chưa nhập được. Sửa file rồi chọn lại.</span>}
      </div>
    </form>
  );
}
