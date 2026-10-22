import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";
import { cancelVisit, createVisit } from "@/actions/patient";
import { saveQuickNote, deleteQuickNote, togglePriority } from "@/actions/note";
import { patientSearchWhere } from "@/lib/person";
import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import { branchesFor, input } from "@/lib/stock";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { SEX_LABEL, VISIT_STATUS, patientCode, timeVN, vnDayStart } from "@/lib/format";
import { ageOf } from "@/lib/person";
import { PageHead, Stat, Panel } from "@/components/ui";
import { ChevronLeft, ChevronRight, ClipboardCheck, Users, Clock, Stethoscope, CheckCircle2, XCircle, UserPlus, Search, AlertTriangle, FolderOpen, QrCode, StickyNote, Star, Save, Trash2 } from "lucide-react";
import { canAccessPath } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ReceptionPage({ searchParams }: { searchParams: { cn?: string; loi?: string; ok?: string; ngay?: string; tt?: string; bs?: string; k?: string; q?: string; trang?: string } }) {
  const staff = await requireRole(...PATIENT_ROLES);
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];
  if (!branch) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold font-display">Tiếp đón</h1>
        <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>
      </div>
    );
  }
  const today = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
  const day = searchParams.ngay && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.ngay) ? searchParams.ngay : today;
  const dStart = new Date(`${day}T00:00:00+07:00`);
  const dEnd = new Date(dStart.getTime() + 86400000);
  const shift = (n: number) => new Date(dStart.getTime() + n * 86400000 + 7 * 3600000).toISOString().slice(0, 10);
  const allVisits = await prisma.visit.findMany({
    where: { branchId: branch.id, createdAt: { gte: dStart, lt: dEnd } },
    orderBy: { queueNo: "asc" },
    include: { patient: true, exam: { select: { doctorName: true } } },
  });
  const kw = searchParams.k?.trim().toLowerCase();
  const doctorOf = (v: (typeof allVisits)[number]) => v.doctorName ?? v.exam?.doctorName ?? "";
  const doctors = Array.from(new Set(allVisits.map(doctorOf).filter(Boolean)));
  const filtered = allVisits.filter((v) =>
    (!searchParams.tt || v.status === searchParams.tt) &&
    (!searchParams.bs || doctorOf(v) === searchParams.bs) &&
    (!kw || v.patient.fullName.toLowerCase().includes(kw) || patientCode(v.patient.seq).toLowerCase().includes(kw) || (v.patient.phone ?? "").includes(kw)));
  const page = pageOf(searchParams.trang);
  const visits = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const staffDocs = await prisma.staff.findMany({
    where: { active: true, role: { in: ["DOCTOR", "OWNER"] }, ...(staff.isOwner ? {} : { branches: { some: { branchId: branch.id } } }) },
    select: { fullName: true }, orderBy: { fullName: "asc" },
  });
  const q = searchParams.q?.trim();
  const found = q ? await prisma.patient.findMany({ where: patientSearchWhere(q), take: 6, orderBy: { createdAt: "desc" } }) : [];
  const notes = await prisma.quickNote.findMany({ where: { OR: [{ branchId: branch.id }, { branchId: null }] }, orderBy: { createdAt: "desc" }, take: 4 });
  const waiting = allVisits.filter((v) => v.status === "WAITING").length;

  const count = (st: string) => allVisits.filter((v) => v.status === st).length;
  const chip: Record<string, [string, string]> = { WAITING: ["Đang chờ", "chip-amber"], IN_EXAM: ["Đang khám", "chip-blue"], DONE: ["Đã khám", "chip-green"], CANCELLED: ["Đã hủy", "chip-gray"] };
  const canExam = canAccessPath(staff.role, "/kham");
  return (
    <div className="space-y-4">
      <PageHead icon={ClipboardCheck} title="Tiếp đón hôm nay" sub="Quản lý bệnh nhân đến khám và tiếp nhận ban đầu" img="/images/art/mortar.jpg">
        <Link href="/benh-nhan/moi" className="flex items-center gap-2 rounded-xl bg-brand-deep px-4 py-2.5 font-semibold text-white hover:bg-brand-deeper"><UserPlus className="h-5 w-5" />Thêm bệnh nhân mới</Link>
      </PageHead>
      {searchParams.loi && <div className="warn-box text-sm">{searchParams.loi}</div>}
      {searchParams.ok && <div className="card !bg-green-50 text-sm text-green-800">Đã tiếp đón. Số thứ tự: <b>{searchParams.ok}</b></div>}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat icon={Users} label="Tổng bệnh nhân" value={allVisits.length} unit="hôm nay" tone="green" />
        <Stat icon={Clock} label="Đang chờ" value={waiting} unit="bệnh nhân" tone="amber" />
        <Stat icon={Stethoscope} label="Đang khám" value={count("IN_EXAM")} unit="bệnh nhân" tone="blue" />
        <Stat icon={CheckCircle2} label="Đã khám" value={count("DONE")} unit="bệnh nhân" tone="green" />
        <Stat icon={XCircle} label="Hủy" value={count("CANCELLED")} unit="bệnh nhân" tone="red" />
      </div>

      <div className="grid xl:grid-cols-[1fr_20rem] gap-4 items-start">
        <Panel pad={false} icon={Users} title={`Danh sách ${day === today ? "hôm nay" : day.split("-").reverse().join("/")} (${filtered.length})`} right={
          <form className="flex items-center gap-1">
            <input type="hidden" name="cn" value={branch.id} />
            <Link href={`/tiep-don?cn=${branch.id}&ngay=${shift(-1)}`} className="rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-50"><ChevronLeft className="h-4 w-4" /></Link>
            <input type="date" name="ngay" defaultValue={day} className="rounded-lg border border-slate-300 px-2 py-1 text-sm" />
            <button className="rounded-lg bg-brand-deep px-3 py-1 text-sm font-semibold text-white">Xem</button>
            <Link href={`/tiep-don?cn=${branch.id}&ngay=${shift(1)}`} className="rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-50"><ChevronRight className="h-4 w-4" /></Link>
          </form>}>
          <form className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <input type="hidden" name="cn" value={branch.id} />
            <input type="hidden" name="ngay" value={day} />
            <div className="relative min-w-[12rem] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input name="k" defaultValue={searchParams.k} placeholder="Tìm bệnh nhân trong danh sách…" className="w-full rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-sm" />
            </div>
            <select name="tt" defaultValue={searchParams.tt ?? ""} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
              <option value="">Trạng thái: Tất cả</option>
              {Object.entries(chip).map(([k, [t]]) => <option key={k} value={k}>{t}</option>)}
            </select>
            <select name="bs" defaultValue={searchParams.bs ?? ""} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
              <option value="">Bác sĩ: Tất cả</option>
              {doctors.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <button className="rounded-lg bg-brand-deep px-3 py-1.5 text-sm font-semibold text-white">Lọc</button>
          </form>
          {visits.length === 0 ? <p className="p-5 text-brand-ink/70">Không có lượt khám nào.</p> : (
            <div className="overflow-x-auto">
              <table>
                <thead><tr><th className="w-14">STT</th><th>Bệnh nhân</th><th>Giờ đến</th><th>Lý do khám</th><th className="hidden min-[1800px]:table-cell">Bác sĩ</th><th>Trạng thái</th><th className="text-center">Thao tác</th></tr></thead>
                <tbody>
                  {visits.map((v) => {
                    const [t, c] = chip[v.status] ?? [v.status, "chip-gray"];
                    return (
                      <tr key={v.id} className={v.status === "CANCELLED" ? "opacity-50" : ""}>
                        <td className="font-bold text-brand-deep">{v.queueNo}</td>
                        <td className="whitespace-nowrap">
                          <Link href={`/benh-nhan/${v.patient.id}`} className="font-semibold hover:underline">{v.patient.fullName}</Link>
                          {v.priority && <span className="chip chip-red ml-1.5">Ưu tiên</span>}
                          {v.patient.allergies && <AlertTriangle className="inline h-4 w-4 ml-1 text-red-600" aria-label="Có dị ứng" />}
                          <div className="text-xs text-brand-ink/70">{patientCode(v.patient.seq)} · {SEX_LABEL[v.patient.sex] ?? v.patient.sex} · {ageOf(v.patient.birthDate, v.patient.birthYear)} tuổi</div>
                        </td>
                        <td className="whitespace-nowrap">{timeVN(v.createdAt)}</td>
                        <td className="min-w-[11rem] max-w-xs text-brand-ink/80">{v.reason ?? "—"}</td>
                        <td className="hidden max-w-[9rem] truncate whitespace-nowrap text-sm min-[1800px]:table-cell" title={doctorOf(v) || ""}>{doctorOf(v) || "—"}</td>
                        <td className="whitespace-nowrap"><span className={`chip ${c}`}>{t}</span></td>
                        <td className="whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 [&_a]:whitespace-nowrap [&_button]:whitespace-nowrap">
                            {canExam && (v.status === "WAITING" || v.status === "IN_EXAM") && <Link href={`/kham/${v.id}`} className="rounded-lg bg-brand-deep px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-deeper">{v.status === "WAITING" ? "Bắt đầu khám" : "Tiếp tục"}</Link>}
                            <Link href={`/benh-nhan/${v.patient.id}`} title="Hồ sơ bệnh nhân" aria-label="Hồ sơ bệnh nhân" className="flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm hover:bg-slate-50"><FolderOpen className="h-4 w-4" /><span className="hidden min-[1800px]:inline">Hồ sơ</span></Link>
                            {v.status === "WAITING" && (
                              <form action={togglePriority}>
                                <input type="hidden" name="id" value={v.id} />
                                <button title={v.priority ? "Bỏ ưu tiên" : "Đánh dấu ưu tiên"} className={`rounded-lg border px-2 py-1.5 ${v.priority ? "border-rose-300 bg-rose-50 text-rose-600" : "border-slate-300 text-slate-500 hover:bg-slate-50"}`}><Star className="h-4 w-4" /></button>
                              </form>
                            )}
                            {v.status === "WAITING" && (
                              <form action={cancelVisit}>
                                <input type="hidden" name="id" value={v.id} />
                                <ConfirmSubmit message="Hủy lượt khám này?">Hủy</ConfirmSubmit>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="border-t border-slate-100 px-4 py-2.5"><Pagination path="/tiep-don" page={page} total={filtered.length} params={{ cn: branch.id, ngay: day, tt: searchParams.tt, bs: searchParams.bs, k: searchParams.k }} /></div>
        </Panel>

        <aside className="space-y-4">
          <Panel icon={Search} title="Tiếp đón nhanh">
            <form className="space-y-3">
              <input type="hidden" name="cn" value={branch.id} />
              <input type="hidden" name="ngay" value={day} />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input name="q" defaultValue={q} placeholder="Nhập tên, SĐT hoặc mã BN…" className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3" />
              </div>
              <div className="text-xs text-brand-ink/70">hoặc quét CCCD / thẻ BHYT / mã BN (máy quét gõ vào ô bên dưới)</div>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input name="q" placeholder="Quét mã…" className="w-full rounded-xl border border-dashed border-slate-400 bg-slate-50 py-2.5 pl-9 pr-3" />
              </div>
              <button className="w-full rounded-xl bg-brand-deep py-2.5 font-semibold text-white hover:bg-brand-deeper">Tìm bệnh nhân để tiếp đón</button>
            </form>
            {q && (
              <div className="mt-3 space-y-2">
                {found.length === 0 ? <p className="text-sm text-brand-ink/70">Không thấy bệnh nhân “{q}”.</p> : found.map((p) => (
                  <form key={p.id} action={createVisit} className="rounded-xl border border-slate-200 p-2.5 text-sm">
                    <input type="hidden" name="patientId" value={p.id} />
                    <input type="hidden" name="branchId" value={branch.id} />
                    <div className="font-semibold">{p.fullName}</div>
                    <div className="text-xs text-brand-ink/70">{patientCode(p.seq)} · {SEX_LABEL[p.sex] ?? p.sex} · {ageOf(p.birthDate, p.birthYear)} tuổi · {p.phone}</div>
                    <input name="reason" placeholder="Lý do khám" className="mt-2 w-full rounded-lg border border-slate-300 px-2 py-1.5" />
                    <select name="doctorName" className="mt-2 w-full rounded-lg border border-slate-300 px-2 py-1.5">
                      <option value="">Bác sĩ: tự phân</option>
                      {staffDocs.map((d) => <option key={d.fullName} value={d.fullName}>{d.fullName}</option>)}
                    </select>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" name="priority" />Ưu tiên</label>
                      <button className="ml-auto rounded-lg bg-brand-deep px-3 py-1.5 font-semibold text-white">Tiếp đón</button>
                    </div>
                  </form>
                ))}
              </div>
            )}
            <Link href="/benh-nhan/moi" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 font-semibold hover:bg-slate-50"><UserPlus className="h-4 w-4" />Bệnh nhân mới</Link>
          </Panel>
          <Panel icon={Clock} title="Bệnh nhân đến trong ngày" tone="text-amber-600">
            {allVisits.length === 0 ? <p className="text-sm text-brand-ink/70">Chưa có.</p> : (
              <ul className="space-y-2.5">
                {allVisits.slice(-8).map((v) => {
                  const [t, c] = chip[v.status] ?? [v.status, "chip-gray"];
                  return (
                    <li key={v.id} className="flex items-center gap-3 text-sm">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
                      <span className="w-11 text-brand-ink/70">{timeVN(v.createdAt)}</span>
                      <span className="min-w-0 flex-1 truncate font-semibold">{v.patient.fullName}</span>
                      <span className={`chip ${c}`}>{t}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
          <Panel icon={StickyNote} title="Ghi chú nhanh" tone="text-amber-600">
            <form action={saveQuickNote} className="space-y-2">
              <input type="hidden" name="branchId" value={branch.id} />
              <textarea name="text" rows={3} placeholder="Ghi chú về bệnh nhân, yêu cầu đặc biệt…" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <button className="ml-auto flex items-center gap-1.5 rounded-lg bg-brand-deep px-4 py-1.5 text-sm font-semibold text-white"><Save className="h-4 w-4" />Lưu</button>
            </form>
            {notes.length > 0 && (
              <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                {notes.map((n) => (
                  <li key={n.id} className="flex items-start gap-2 text-sm">
                    <div className="min-w-0 flex-1"><div>{n.text}</div><div className="text-xs text-brand-ink/70">{n.staffName} · {timeVN(n.createdAt)}</div></div>
                    <form action={deleteQuickNote}><input type="hidden" name="id" value={n.id} /><input type="hidden" name="branchId" value={branch.id} /><button title="Xóa" className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></form>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <div className="relative h-40 overflow-hidden rounded-2xl">
            <img src="/images/art/needles.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deeper/80 to-transparent" />
            <div className="absolute bottom-3 left-4 brand-serif italic text-brand-goldLight text-lg">Thầy thuốc như từ mẫu</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
