import Link from "next/link";
import Image from "next/image";
import { Users, Stethoscope, FileText, Pill, Banknote, UserPlus, HeartPulse, Receipt, CalendarDays, ClipboardList, Eye, MoreVertical, Clock, BarChart3, Hourglass, FileCheck, FileX, ArrowRight, Leaf, type LucideIcon } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { canAccessPath } from "@/lib/permissions";
import { branchesFor } from "@/lib/stock";
import { patientCode, timeVN, vnDayStart, vnd } from "@/lib/format";
import { ageOf } from "@/lib/person";

export const dynamic = "force-dynamic";

type Chip = { text: string; cls: string; href: string };

export default async function TodayPage({ searchParams }: { searchParams: { cn?: string } }) {
  const staff = await requireStaff();
  const can = (p: string) => canAccessPath(staff.role, p);
  const branches = await branchesFor(staff);
  const branch = branches.find((b) => b.id === searchParams.cn) ?? branches[0];

  const now = new Date();
  const dateText = now.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  const hour = Number(now.toLocaleString("en-GB", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", hour12: false }));
  const hello = hour < 11 ? "Chào buổi sáng" : hour < 14 ? "Chào buổi trưa" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  const header = (
    <section className="relative overflow-hidden rounded-2xl bg-brand-deeper text-white min-h-[9rem]">
      <Image src="/images/art/panorama.jpg" alt="" width={1800} height={600} priority className="absolute inset-0 h-full w-full object-cover object-right" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-deeper via-brand-deeper/85 to-brand-deeper/10" />
      <div className="relative p-5 md:px-8 md:py-5">
        <div className="text-sm text-brand-goldLight capitalize">{dateText}</div>
        <h1 className="brand-serif text-2xl md:text-3xl font-bold mt-0.5 uppercase leading-tight">{hello},<br />{staff.fullName}</h1>
        <p className="mt-2 font-semibold">{branch ? branch.name : "Chưa có chi nhánh"}</p>
        <p className="text-white/70 text-sm">Kế thừa tinh hoa · Phụng sự sức khỏe cộng đồng</p>
      </div>
      <div className="absolute right-6 bottom-4 hidden md:block text-right brand-serif italic text-brand-goldLight/90 leading-snug">Thiện tâm<br />Dưỡng sinh<br />Trị bệnh</div>
    </section>
  );

  if (!branch) {
    return (
      <div className="space-y-5">
        {header}
        <div className="warn-box text-sm">Bạn chưa được gán chi nhánh nào. Nhờ chủ phòng khám gán chi nhánh.</div>
      </div>
    );
  }

  const since = vnDayStart();
  const weekStart = new Date(since.getTime() - 6 * 86400000);
  const [visits, toInvoice, unpaid, toDispense, revenue, week, voided] = await Promise.all([
    prisma.visit.findMany({
      where: { branchId: branch.id, createdAt: { gte: since } },
      orderBy: { queueNo: "asc" },
      include: {
        patient: { select: { id: true, fullName: true, seq: true, birthDate: true, sex: true } },
        exam: { select: { status: true } },
        invoice: { select: { id: true, status: true, dispensedAt: true, lines: { select: { itemId: true } } } },
      },
    }),
    prisma.visit.count({ where: { branchId: branch.id, createdAt: { gte: since }, status: "DONE", invoice: null, exam: { status: "FINAL" } } }),
    prisma.invoice.count({ where: { branchId: branch.id, createdAt: { gte: since }, status: "UNPAID" } }),
    prisma.invoice.count({ where: { branchId: branch.id, status: "PAID", dispensedAt: null, lines: { some: { itemId: { not: null } } } } }),
    can("/thu-ngan") || can("/bao-cao")
      ? prisma.invoice.aggregate({ _sum: { total: true }, where: { branchId: branch.id, status: "PAID", paidAt: { gte: since } } })
      : Promise.resolve(null),
    can("/thu-ngan") || can("/bao-cao")
      ? prisma.invoice.findMany({ where: { branchId: branch.id, status: "PAID", paidAt: { gte: weekStart } }, select: { total: true, paidAt: true, patient: { select: { fullName: true } }, customerName: true } })
      : Promise.resolve([]),
    prisma.invoice.count({ where: { branchId: branch.id, status: "VOID", createdAt: { gte: since } } }),
  ]);
  const days = Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * 86400000));
  const dayTotals = days.map((d) => week.filter((w) => w.paidAt && w.paidAt >= d && w.paidAt < new Date(d.getTime() + 86400000)).reduce((a, w) => a + w.total, 0));
  const weekSum = dayTotals.reduce((a, b) => a + b, 0);
  const maxDay = Math.max(...dayTotals, 1);
  const dayLabel = (d: Date) => new Date(d.getTime() + 7 * 3600000).toISOString().slice(8, 10) + "/" + new Date(d.getTime() + 7 * 3600000).toISOString().slice(5, 7);
  const events = [
    ...visits.map((v) => ({ at: v.createdAt, who: v.patient.fullName, text: "Đến phòng khám", pay: false })),
    ...week.filter((w) => w.paidAt).map((w) => ({ at: w.paidAt as Date, who: w.patient?.fullName ?? w.customerName ?? "Khách lẻ", text: `Đã thu tiền ${vnd(w.total)}`, pay: true })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 5);
  const withMeds = visits.filter((v) => v.invoice?.lines.some((l) => l.itemId)).length;
  const paidToday = visits.filter((v) => v.invoice?.status === "PAID").length;

  const waiting = visits.filter((v) => v.status === "WAITING").length;
  const inExam = visits.filter((v) => v.status === "IN_EXAM").length;
  const cn = `?cn=${branch.id}`;

  const chipOf = (v: (typeof visits)[number]): Chip => {
    const kham = can("/kham") ? `/kham/${v.id}` : `/benh-nhan/${v.patient.id}`;
    if (v.status === "CANCELLED") return { text: "Đã hủy", cls: "chip-gray", href: `/benh-nhan/${v.patient.id}` };
    if (v.status === "WAITING") return { text: "Chờ khám", cls: "chip-amber", href: kham };
    if (v.status === "IN_EXAM") return { text: "Đang khám", cls: "chip-blue", href: kham };
    const inv = v.invoice;
    if (!inv) {
      return v.exam?.status === "FINAL"
        ? { text: "Chờ thu", cls: "chip-red", href: can("/thu-ngan") ? "/thu-ngan" + cn : `/benh-nhan/${v.patient.id}` }
        : { text: "Đang khám", cls: "chip-blue", href: kham };
    }
    const toThu = can("/thu-ngan") ? `/thu-ngan/${inv.id}` : `/benh-nhan/${v.patient.id}`;
    if (inv.status === "UNPAID") return { text: "Chờ thu", cls: "chip-red", href: toThu };
    if (inv.status === "VOID") return { text: "Đã hủy HĐ", cls: "chip-gray", href: toThu };
    const hasMed = inv.lines.some((l) => l.itemId);
    if (hasMed && !inv.dispensedAt) return { text: "Chờ phát thuốc", cls: "chip-purple", href: can("/duoc") ? `/duoc/${inv.id}` : toThu };
    return { text: "Hoàn tất", cls: "chip-green", href: toThu };
  };

  const tint = {
    amber: "bg-amber-50 border-amber-200", blue: "bg-sky-50 border-sky-200", red: "bg-rose-50 border-rose-200", purple: "bg-violet-50 border-violet-200",
  } as const;
  const cards = [
    { label: "Chờ khám", n: waiting, Icon: Users, ic: "bg-amber-100 text-amber-600", cls: "text-amber-600", t: tint.amber, href: can("/kham") ? "/kham" + cn : can("/tiep-don") ? "/tiep-don" + cn : null },
    { label: "Đang khám", n: inExam, Icon: Stethoscope, ic: "bg-sky-100 text-sky-700", cls: "text-sky-700", t: tint.blue, href: can("/kham") ? "/kham" + cn : null },
    { label: "Chờ thu", n: toInvoice + unpaid, Icon: FileText, ic: "bg-rose-100 text-rose-600", cls: "text-rose-600", t: tint.red, href: can("/thu-ngan") ? "/thu-ngan" + cn : null },
    { label: "Chờ phát thuốc", n: toDispense, Icon: Pill, ic: "bg-violet-100 text-violet-700", cls: "text-violet-700", t: tint.purple, href: can("/duoc") ? "/duoc" + cn : null },
  ];
  const actions = [
    { href: "/tiep-don" + cn, label: "Tiếp đón bệnh nhân", Icon: UserPlus, ok: can("/tiep-don") },
    { href: "/kham" + cn, label: "Vào khám bệnh", Icon: HeartPulse, ok: can("/kham") },
    { href: "/thu-ngan" + cn, label: "Thu tiền", Icon: Receipt, ok: can("/thu-ngan") },
    { href: "/duoc" + cn, label: "Phát thuốc", Icon: Pill, ok: can("/duoc") },
  ].filter((a) => a.ok);

  return (
    <div className="space-y-4">
      {header}
      <div className="grid xl:grid-cols-[1fr_22rem] gap-5 items-start">
        <div className="space-y-4 min-w-0">
          <div className={`grid grid-cols-2 ${revenue ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-3`}>
            {cards.map((c) => {
              const body = (
                <div className="relative flex items-center gap-3 overflow-hidden">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${c.ic}`}><c.Icon className="h-5 w-5" /></span>
                  <div>
                    <div className="font-bold leading-tight">{c.label}</div>
                    <div className={`text-3xl font-bold leading-tight ${c.cls}`}>{c.n}</div>
                    <div className="text-xs text-brand-ink/60">bệnh nhân</div>
                  </div>
                  <c.Icon className={`absolute -bottom-3 -right-2 h-16 w-16 opacity-[0.12] ${c.cls}`} />
                </div>
              );
              return c.href ? <Link key={c.label} href={c.href} className={`rounded-2xl border p-4 hover:shadow-md transition ${c.t}`}>{body}</Link> : <div key={c.label} className={`rounded-2xl border p-4 ${c.t}`}>{body}</div>;
            })}
            {revenue && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 font-bold text-sm"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Banknote className="h-4 w-4" /></span>Doanh thu hôm nay</div>
                <div className="mt-1 text-2xl font-bold text-emerald-800">{vnd(revenue._sum.total ?? 0)}</div>
                <div className="text-xs text-brand-ink/60">Tổng thu</div>
              </div>
            )}
          </div>

          {actions.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {actions.map((a, i) => (
                <Link key={a.href} href={a.href} className={`flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-center font-semibold ${i === 0 ? "bg-brand-deep text-white hover:bg-brand-deeper" : "bg-white border border-slate-200 hover:border-brand-deep"}`}><a.Icon className={`h-5 w-5 ${i === 0 ? "" : "text-brand-deep"}`} />{a.label}</Link>
              ))}
            </div>
          )}

          <section className="card !p-0 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-200 font-bold text-lg"><span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-100 text-amber-600"><Users className="h-5 w-5" /></span>Hàng chờ hôm nay <span className="text-brand-ink/50 font-medium">({visits.length})</span><Link href={can("/tiep-don") ? "/tiep-don" + cn : "/benh-nhan"} className="ml-auto flex items-center gap-1 text-sm font-medium text-sky-700 hover:underline">Xem tất cả <ArrowRight className="h-4 w-4" /></Link></div>
            {visits.length === 0 ? (
              <p className="p-6 text-brand-ink/60">Chưa có bệnh nhân nào hôm nay.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[15px]">
                  <thead className="text-left text-xs uppercase tracking-wide text-brand-ink/60 border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-2.5 w-14">STT</th>
                      <th className="px-3 py-2.5">Bệnh nhân</th>
                      <th className="px-3 py-2.5 hidden md:table-cell">Lý do khám</th>
                      <th className="px-3 py-2.5 hidden sm:table-cell">Giờ đến</th>
                      <th className="px-3 py-2.5">Trạng thái</th>
                      <th className="px-3 py-2.5 w-24 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visits.map((v) => {
                      const c = chipOf(v);
                      const age = v.patient.birthDate ? ageOf(v.patient.birthDate) : null;
                      return (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-semibold">{v.queueNo}</td>
                          <td className="px-3 py-3">
                            <Link href={c.href} className="font-semibold hover:underline">{v.patient.fullName}</Link>
                            <div className="text-xs text-brand-ink/55">{patientCode(v.patient.seq)}{age != null ? ` · ${age} tuổi` : ""}</div>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell text-brand-ink/75 max-w-xs truncate">{v.reason ?? "—"}</td>
                          <td className="px-3 py-3 hidden sm:table-cell">{timeVN(v.createdAt)}</td>
                          <td className="px-3 py-3"><Link href={c.href}><span className={`chip ${c.cls}`}>{c.text}</span></Link></td>
                          <td className="px-3 py-3"><div className="flex items-center justify-center gap-2 text-slate-500"><Link href={c.href} title="Xem" className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 hover:bg-slate-100"><Eye className="h-4 w-4" /></Link><Link href={`/benh-nhan/${v.patient.id}`} title="Hồ sơ bệnh nhân" className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"><MoreVertical className="h-4 w-4" /></Link></div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="grid md:grid-cols-2 gap-5">
            {revenue && (
              <section className="card">
                <div className="flex items-center gap-2 font-bold mb-3 text-emerald-700"><BarChart3 className="h-5 w-5" /><span className="text-brand-ink">Doanh thu 7 ngày gần nhất</span></div>
                <div className="flex items-end gap-2 h-32">
                  {dayTotals.map((t, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className={`w-full rounded-t ${i === 6 ? "bg-brand-deep" : "bg-emerald-200"}`} style={{ height: `${Math.max((t / maxDay) * 100, 3)}%` }} title={vnd(t)} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-1 text-[11px] text-brand-ink/60">{days.map((d, i) => <div key={i} className="flex-1 text-center">{dayLabel(d)}</div>)}</div>
                <div className="mt-3 text-sm text-brand-ink/70">Tổng 7 ngày: <b className="text-brand-deep text-lg">{vnd(weekSum)}</b></div>
              </section>
            )}
            <section className="card">
              <div className="flex items-center gap-2 font-bold mb-3 text-emerald-700"><Clock className="h-5 w-5" /><span className="text-brand-ink">Hoạt động gần đây</span></div>
              {events.length === 0 ? <p className="text-sm text-brand-ink/60">Chưa có hoạt động.</p> : (
                <ul className="space-y-3">
                  {events.map((e, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-11 shrink-0 text-brand-ink/60">{timeVN(e.at)}</span>
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${e.pay ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-600"}`}>{e.pay ? <Receipt className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}</span>
                      <span><b>{e.who}</b><span className="text-brand-ink/70"> · {e.text}</span></span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="card">
            <div className="flex items-center gap-2 font-bold mb-2"><CalendarDays className="h-5 w-5 text-emerald-700" />Lịch khám hôm nay <span className="text-brand-ink/50 font-medium">({visits.length})</span></div>
            {visits.length === 0 ? <p className="text-sm text-brand-ink/60">Chưa có.</p> : (
              <ul className="divide-y divide-slate-100">
                {visits.slice(0, 6).map((v) => {
                  const c = chipOf(v);
                  return (
                    <li key={v.id} className="py-2.5 flex items-center gap-3">
                      <span className="w-12 text-sm text-brand-ink/70">{timeVN(v.createdAt)}</span>
                      <Link href={c.href} className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{v.patient.fullName}</div>
                        <div className="text-xs text-brand-ink/55">{patientCode(v.patient.seq)}</div>
                      </Link>
                      <span className={`chip ${c.cls}`}>{c.text}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
          <section className="card">
            <div className="flex items-center gap-2 font-bold mb-3"><ClipboardList className="h-5 w-5 text-emerald-700" />Thống kê hôm nay</div>
            <dl className="space-y-2.5 text-[15px]">
              {([["Lượt khám", visits.length, FileText, "bg-emerald-100 text-emerald-700", ""], ["Đơn thuốc", withMeds, Pill, "bg-sky-100 text-sky-700", ""], ["Hóa đơn đã thu", paidToday, FileCheck, "bg-amber-100 text-amber-600", ""], ["Hóa đơn đã hủy", voided, FileX, "bg-rose-100 text-rose-600", "text-rose-600"]] as [string, number, LucideIcon, string, string][]).map(([l, n, I, ic, tc]) => (
                <div key={l} className="flex items-center gap-3"><span className={`grid h-8 w-8 place-items-center rounded-lg ${ic}`}><I className="h-4 w-4" /></span><dt className="flex-1 text-brand-ink/75">{l}</dt><dd className={`font-bold text-lg ${tc}`}>{n}</dd></div>
              ))}
            </dl>
          </section>
          <div className="relative overflow-hidden rounded-2xl h-32">
            <Image src="/images/art/mortar.jpg" alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deeper/80 to-transparent" />
            <div className="absolute bottom-3 left-4 brand-serif italic text-brand-goldLight text-lg">Sức khỏe hôm nay<br />Hạnh phúc ngày mai</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
