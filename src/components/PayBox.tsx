"use client";
import { useState } from "react";
import { Banknote, Landmark, CreditCard, CheckCircle2 } from "lucide-react";
import { payInvoice } from "@/actions/billing";

const vnd = (n: number) => `${n.toLocaleString("vi-VN")} ₫`;
const METHODS = [["CASH", "Tiền mặt", Banknote], ["TRANSFER", "Chuyển khoản", Landmark], ["CARD", "Thẻ", CreditCard]] as const;

// Chọn phương thức, nhập tiền khách đưa, hiện tiền thừa, xác nhận thanh toán.
export function PayBox({ invoiceId, total }: { invoiceId: string; total: number }) {
  const [method, setMethod] = useState<string>("CASH");
  const [given, setGiven] = useState<string>(String(total));
  const g = Number(given.replace(/[.\s]/g, "")) || 0;
  const change = g - total;
  return (
    <form action={payInvoice} className="space-y-3">
      <input type="hidden" name="invoiceId" value={invoiceId} />
      <input type="hidden" name="method" value={method} />
      <div className="grid grid-cols-3 gap-2">
        {METHODS.map(([k, label, Icon]) => (
          <button key={k} type="button" onClick={() => setMethod(k)}
            className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-sm font-semibold ${method === k ? "border-brand-deep bg-brand-deep text-white" : "border-slate-300 hover:bg-slate-50"}`}>
            <Icon className="h-5 w-5" />{label}
          </button>
        ))}
      </div>
      {method === "CASH" && (
        <div className="space-y-2">
          <label className="flex items-center justify-between gap-3 text-sm">Khách đưa
            <input name="cashGiven" value={given} onChange={(e) => setGiven(e.target.value)} inputMode="numeric" className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-right" />
          </label>
          <div className="flex items-center justify-between text-sm">Tiền thừa
            <b className={change < 0 ? "text-red-600" : "text-emerald-700"}>{change < 0 ? `Thiếu ${vnd(-change)}` : vnd(change)}</b>
          </div>
        </div>
      )}
      <button
        disabled={method === "CASH" && change < 0}
        onClick={(e) => { if (!window.confirm(`Xác nhận đã thu ${vnd(total)}?`)) e.preventDefault(); }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-deep py-3 text-base font-semibold text-white hover:bg-brand-deeper disabled:opacity-50">
        <CheckCircle2 className="h-5 w-5" />Xác nhận thanh toán
      </button>
    </form>
  );
}
