import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PROCEDURE_ROLES } from "@/lib/permissions";
import { branchesFor, input } from "@/lib/stock";
import { patientCode, timeVN, vnDayStart } from "@/lib/format";
import { startProcedure, completeProcedure, cancelProcedure } from "@/actions/procedure";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { PageHead, Stat, Panel } from "@/components/ui";
import { Syringe, Hourglass, Activity, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

type Row = {
  id: string; name: string; sessionNo: number; sessionTotal: number | null; status: string; patientId: string | null; serviceId: string | null;
  performerName: string | null; startedAt: Date | null; endedAt: Date | null; note: string | null; createdAt: Date;
};

export default async function ProceduresPage({ searchParams }: { searchParams: { cn?: string; ok?: string; loi?: string } }) {
  const staff = await requireRole(...PROCEDURE_ROLES);
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  if (!branch) return <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>;

  const since = vnDayStart();
  const [open, done] = (await Promise.all([
    prisma.procedureOrder.findMany({ where: { branchId: branch.id, status: { in: ["PENDING", "IN_PROGRESS"] } }, orderBy: { createdAt: "asc" } }),
    prisma.procedureOrder.findMany({ where: { branchId: branch.id, status: "DONE", endedAt: { gte: since } }, orderBy: { endedAt: "desc" } }),
  ])) as unknown as [Row[], Row[]];

  // Liệu trình nhiều buổi: chỉ hiện buổi kế tiếp của mỗi bệnh nhân + dịch vụ; và không hiện nếu hôm nay đã làm buổi của dịch vụ đó.
  const doneToday = new Set(done.map((d) => `${d.patientId}|${d.serviceId}`));
  const seen = new Set<string>();
  const queue = open.filter((o) => {
    if (o.status === "IN_PROGRESS") return true;
    const k = `${o.patientId}|${o.serviceId}`;
    if (doneToday.has(k) || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const running = queue.filter((o) => o.status === "IN_PROGRESS");
  const waiting = queue.filter((o) => o.status === "PENDING");

  const pids = Array.from(new Set([...queue, ...done].map((o) => o.patientId).filter((x): x is string => !!x)));
  const patients = pids.length
    ? ((await prisma.patient.findMany({ where: { id: { in: pids } }, select: { id: true, fullName: true, seq: true, allergies: true } })) as unknown as { id: string; fullName: string; seq: number; allergies: string | null }[])
    : [];
  const pmap = new Map(patients.map((p) => [p.id, p]));
  const who = (o: Row) => (o.patientId ? pmap.get(o.patientId) : undefined);
  const buoi = (o: Row) => `Buổi ${o.sessionNo}${o.sessionTotal ? `/${o.sessionTotal}` : ""}`;
  const mins = (o: Row) => (o.startedAt && o.endedAt ? Math.max(1, Math.round((o.endedAt.getTime() - o.startedAt.getTime()) / 60000)) : null);

  const head = (o: Row) => {
    const p = who(o);
    return (
      <div className="min-w-0">
        <div className="font-semibold">{p?.fullName ?? "Khách lẻ"} <span className="text-xs font-normal text-brand-ink/60">{p ? patientCode(p.seq) : ""}</span></div>
        <div className="text-sm">{o.name} · <b>{buoi(o)}</b></div>
        {p?.allergies && <div className="mt-0.5 text-xs font-medium text-rose-700">Dị ứng: {p.allergies}</div>}
      </div>
    );
  };
  const cancelForm = (o: Row) => (
    <form action={cancelProcedure} className="flex items-center gap-1">
      <input type="hidden" name="id" value={o.id} />
      <input name="reason" required placeholder="Lý do hủy" className="w-36 rounded-lg border border-slate-200 px-2 py-1 text-xs" />
      <ConfirmSubmit message="Hủy thủ thuật này?" className="rounded border border-red-300 px-2 py-1 text-xs text-red-800">Hủy</ConfirmSubmit>
    </form>
  );

  return (
    <div className="space-y-4">
      <PageHead icon={Syringe} title="Thủ thuật" sub={`Điện châm, xoa bóp bấm huyệt, cấy chỉ, thủy châm · ${branch.name}`} />
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">{searchParams.ok}</div>}
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      <div className="grid grid-cols-3 gap-2">
        <Stat icon={Hourglass} label="Chờ thực hiện" value={waiting.length} unit="phiếu" tone="amber" />
        <Stat icon={Activity} label="Đang làm" value={running.length} unit="phiếu" tone="blue" />
        <Stat icon={CheckCircle2} label="Xong hôm nay" value={done.length} unit="phiếu" tone="green" />
      </div>

      <Panel icon={Activity} title={`Đang thực hiện (${running.length})`} tone="text-sky-700">
        {running.length === 0 ? <p className="text-sm text-brand-ink/70">Không có thủ thuật nào đang làm.</p> : (
          <div className="space-y-3">
            {running.map((o) => (
              <div key={o.id} className="rounded-xl border border-sky-200 bg-sky-50/50 p-3">
                <div className="flex flex-wrap items-start gap-3">
                  {head(o)}
                  <div className="ml-auto text-right text-xs text-brand-ink/70">{o.performerName}<br />bắt đầu {o.startedAt ? timeVN(o.startedAt) : ""}</div>
                </div>
                <form action={completeProcedure} className="mt-2 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <label className="min-w-[14rem] flex-1 text-sm">Ghi chú (huyệt, thông số, phản ứng, dặn dò)<input name="note" className={input} /></label>
                  <label className="text-sm">Tổng số buổi<input name="sessionTotal" inputMode="numeric" defaultValue={o.sessionTotal ?? ""} placeholder="vd 10" className={`${input} w-24`} /></label>
                  <button className="rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white hover:bg-brand-deeper">Hoàn thành</button>
                </form>
                <div className="mt-2">{cancelForm(o)}</div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel icon={Hourglass} title={`Chờ thực hiện (${waiting.length})`} tone="text-amber-600">
        {waiting.length === 0 ? <p className="text-sm text-brand-ink/70">Không có bệnh nhân nào chờ làm thủ thuật. Phiếu xuất hiện ở đây sau khi thu ngân thu tiền dịch vụ thủ thuật.</p> : (
          <div className="space-y-2">
            {waiting.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 p-3">
                {head(o)}
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  {cancelForm(o)}
                  <form action={startProcedure}><input type="hidden" name="id" value={o.id} /><button className="rounded-xl bg-brand-deep px-4 py-2 font-semibold text-white hover:bg-brand-deeper">Bắt đầu</button></form>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel icon={CheckCircle2} title={`Đã xong hôm nay (${done.length})`} tone="text-emerald-700" pad={false}>
        <table>
          <thead><tr><th>Bệnh nhân</th><th>Thủ thuật</th><th>Buổi</th><th>Người thực hiện</th><th>Giờ</th><th>Ghi chú</th></tr></thead>
          <tbody>
            {done.map((o) => (
              <tr key={o.id}>
                <td className="font-semibold">{who(o)?.fullName ?? "Khách lẻ"}</td>
                <td>{o.name}</td>
                <td>{buoi(o)}</td>
                <td>{o.performerName}</td>
                <td className="tabular-nums">{o.startedAt ? timeVN(o.startedAt) : ""} – {o.endedAt ? timeVN(o.endedAt) : ""}{mins(o) ? ` (${mins(o)} phút)` : ""}</td>
                <td>{o.note}</td>
              </tr>
            ))}
            {done.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-brand-ink/70">Chưa có thủ thuật nào hoàn thành hôm nay.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
