"use client";
import { useRef, useState } from "react";
import { FileSpreadsheet, Download, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type Row = {
  row: number; code: string; name: string; inText: string; total: number; expiry: string | null;
  supplier: string | null; errors: string[]; warnings: string[];
};
type Preview = { fileErrors: string[]; rows: Row[]; total: number; duplicateAt: string | null; error?: string };

const vnd = (n: number) => n.toLocaleString("vi-VN") + " đ";

export function ExcelImport({
  branches, action,
}: {
  branches: { id: string; name: string }[];
  action: (fd: FormData) => void | Promise<void>;
}) {
  const [branch, setBranch] = useState(branches[0]?.id ?? "");
  const [prev, setPrev] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function check(cn: string) {
    const f = fileRef.current?.files?.[0];
    setConfirm(false);
    if (!f) { setPrev(null); return; }
    setBusy(true);
    const fd = new FormData();
    fd.set("file", f);
    fd.set("cn", cn);
    try {
      const r = await fetch("/kho/nhap/excel/xem", { method: "POST", body: fd });
      setPrev(await r.json());
    } catch {
      setPrev({ fileErrors: ["Không kiểm tra được file. Thử lại."], rows: [], total: 0, duplicateAt: null });
    }
    setBusy(false);
  }

  const errs = prev ? prev.rows.filter((r) => r.errors.length).length : 0;
  const warns = prev ? prev.rows.filter((r) => r.warnings.length).length : 0;
  const blocked = !prev || !!prev.error || prev.fileErrors.length > 0 || errs > 0 || !!prev.duplicateAt || prev.rows.length === 0;
  const needConfirm = warns > 0 && !confirm;

  return (
    <form action={action} className="space-y-4">
      <div className="card grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Chi nhánh
            <select name="branchId" value={branch} onChange={(e) => { setBranch(e.target.value); void check(e.target.value); }} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5">
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
          <label className="text-sm">File phiếu nhập (.xlsx)
            <input ref={fileRef} type="file" name="file" accept=".xlsx" onChange={() => void check(branch)} className="mt-1 w-full rounded-lg border border-dashed border-slate-400 bg-slate-50 px-3 py-2" />
          </label>
        </div>
        <a href={`/kho/nhap/excel/mau?cn=${branch}`} className="flex items-center justify-center gap-2 rounded-xl border border-brand-deep px-4 py-2.5 font-semibold text-brand-deep hover:bg-brand-deep/5">
          <Download className="h-4 w-4" />Tải phiếu nhập kho (Excel)
        </a>
      </div>

      {busy && <div className="card text-sm text-brand-ink/70">Đang kiểm tra file…</div>}
      {prev?.error && <div className="warn-box text-sm">{prev.error}</div>}
      {prev?.fileErrors.map((e) => <div key={e} className="warn-box text-sm">{e}</div>)}
      {prev?.duplicateAt && <div className="warn-box text-sm">File này đã được nhập lúc {new Date(prev.duplicateAt).toLocaleString("vi-VN")}. Không nhập lại để tránh trùng.</div>}

      {prev && prev.rows.length > 0 && (
        <div className="card !p-0 overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-[var(--line)] px-4 py-3 text-sm">
            <span className="flex items-center gap-1.5 font-semibold"><FileSpreadsheet className="h-4 w-4" />{prev.rows.length} dòng · tổng {vnd(prev.total)}</span>
            <span className="text-emerald-700">{prev.rows.length - errs - warns} hợp lệ</span>
            {warns > 0 && <span className="text-amber-700">{warns} cảnh báo</span>}
            {errs > 0 && <span className="text-red-700">{errs} lỗi</span>}
          </div>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th className="w-12">Dòng</th><th>Mặt hàng</th><th>Số lượng × giá</th><th className="text-right">Thành tiền</th><th>Hạn dùng</th><th>Nhà cung cấp</th><th>Kiểm tra</th></tr></thead>
              <tbody>
                {prev.rows.map((r) => (
                  <tr key={r.row} className={r.errors.length ? "bg-red-50" : r.warnings.length ? "bg-amber-50/70" : ""}>
                    <td className="text-brand-ink/70">{r.row}</td>
                    <td><div className="font-semibold">{r.name}</div><div className="text-xs text-brand-ink/70">{r.code}</div></td>
                    <td className="whitespace-nowrap text-sm">{r.inText || "—"}</td>
                    <td className="whitespace-nowrap text-right text-sm">{r.total ? vnd(r.total) : "—"}</td>
                    <td className="whitespace-nowrap text-sm">{r.expiry ? r.expiry.split("-").reverse().join("/") : "—"}</td>
                    <td className="text-sm">{r.supplier ?? "—"}</td>
                    <td className="min-w-[16rem] text-sm">
                      {r.errors.map((e) => <div key={e} className="flex gap-1.5 text-red-700"><XCircle className="mt-0.5 h-4 w-4 shrink-0" />{e}</div>)}
                      {r.warnings.map((e) => <div key={e} className="flex gap-1.5 text-amber-700"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{e}</div>)}
                      {!r.errors.length && !r.warnings.length && <span className="flex items-center gap-1.5 text-emerald-700"><CheckCircle2 className="h-4 w-4" />Hợp lệ</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 border-t border-[var(--line)] px-4 py-3">
            {warns > 0 && errs === 0 && (
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" name="confirmOdd" value="1" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-0.5" />
                Tôi đã xem các dòng cảnh báo và xác nhận giá, số lượng, hạn dùng là đúng.
              </label>
            )}
            {errs > 0 && <p className="text-sm text-red-700">Còn {errs} dòng lỗi. Sửa trong file Excel rồi chọn lại file. Không dòng nào được lưu khi còn lỗi.</p>}
            <button disabled={blocked || needConfirm} className="w-full rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white hover:bg-brand-deeper disabled:cursor-not-allowed disabled:opacity-40">
              Xác nhận nhập {prev.rows.length} dòng · {vnd(prev.total)}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
