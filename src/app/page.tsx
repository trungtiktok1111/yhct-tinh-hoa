import Link from "next/link";
import Image from "next/image";
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
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-deep to-brand-deeper text-white">
      <Image src="/images/jar-herbs.png" alt="" width={483} height={239} className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-40 [mask-image:linear-gradient(to_left,black,transparent)]" />
      <div className="relative p-6">
        <div className="text-xs uppercase tracking-[0.2em] text-brand-goldLight">Hôm nay · {dateText}</div>
        <h1 className="text-2xl md:text-3xl font-bold mt-1">{hello}, {staff.fullName}</h1>
        <p className="text-white/75 text-sm mt-1">{branch ? branch.name : "Chưa có chi nhánh"}</p>
      </div>
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
  const [visits, toInvoice, unpaid, toDispense, revenue] = await Promise.all([
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
  ]);

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

  const cards = [
    { label: "Chờ khám", n: waiting, cls: "text-amber-600", href: can("/kham") ? "/kham" + cn : can("/tiep-don") ? "/tiep-don" + cn : null },
    { label: "Đang khám", n: inExam, cls: "text-blue-600", href: can("/kham") ? "/kham" + cn : null },
    { label: "Chờ thu", n: toInvoice + unpaid, cls: "text-red-600", href: can("/thu-ngan") ? "/thu-ngan" + cn : null },
    { label: "Chờ phát thuốc", n: toDispense, cls: "text-purple-600", href: can("/duoc") ? "/duoc" + cn : null },
  ];

  const actions = [
    { href: "/benh-nhan", label: "Tiếp đón bệnh nhân", ok: can("/tiep-don") },
    { href: "/kham" + cn, label: "Vào khám bệnh", ok: can("/kham") },
    { href: "/thu-ngan" + cn, label: "Thu tiền", ok: can("/thu-ngan") },
    { href: "/duoc" + cn, label: "Phát thuốc", ok: can("/duoc") },
  ].filter((a) => a.ok);

  return (
    <div className="space-y-6">
      {header}

      <div className={`grid grid-cols-2 ${revenue ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-4`}>
        {cards.map((c) => {
          const body = (
            <>
              <div className="text-sm font-semibold text-brand-ink/70">{c.label}</div>
              <div className={`mt-1 text-4xl font-bold ${c.cls}`}>{c.n}</div>
            </>
          );
          return c.href ? (
            <Link key={c.label} href={c.href} className="card interactive">{body}</Link>
          ) : (
            <div key={c.label} className="card">{body}</div>
          );
        })}
        {revenue && (
          <div className="card col-span-2 lg:col-span-1">
            <div className="text-sm font-semibold text-brand-ink/70">Doanh thu hôm nay</div>
            <div className="mt-1 text-2xl lg:text-3xl font-bold text-brand-deep">{vnd(revenue._sum.total ?? 0)}</div>
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {actions.map((a, i) => (
            <Link key={a.href} href={a.href} className={i === 0 ? "rounded-xl bg-brand-deep text-white px-5 py-3 font-semibold hover:bg-brand-deeper" : "rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:border-brand-deep"}>
              {a.label}
            </Link>
          ))}
        </div>
      )}

      <section className="card !p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold">Hàng chờ hôm nay <span className="text-brand-ink/50 font-medium">({visits.length})</span></h2>
        </div>
        {visits.length === 0 ? (
          <p className="p-6 text-brand-ink/60">Chưa có bệnh nhân nào hôm nay.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-brand-ink/60">
                <tr>
                  <th className="px-5 py-2.5 w-16">STT</th>
                  <th className="px-3 py-2.5">Bệnh nhân</th>
                  <th className="px-3 py-2.5 hidden md:table-cell">Lý do khám</th>
                  <th className="px-3 py-2.5 hidden sm:table-cell">Giờ đến</th>
                  <th className="px-3 py-2.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visits.map((v) => {
                  const c = chipOf(v);
                  const age = v.patient.birthDate ? ageOf(v.patient.birthDate) : null;
                  return (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-bold text-brand-deep">{v.queueNo}</td>
                      <td className="px-3 py-3">
                        <Link href={c.href} className="font-semibold hover:underline">{v.patient.fullName}</Link>
                        <div className="text-xs text-brand-ink/55">{patientCode(v.patient.seq)}{age != null ? ` · ${age} tuổi` : ""}</div>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell text-brand-ink/75 max-w-xs truncate">{v.reason ?? "—"}</td>
                      <td className="px-3 py-3 hidden sm:table-cell text-brand-ink/75">{timeVN(v.createdAt)}</td>
                      <td className="px-3 py-3"><Link href={c.href}><span className={`chip ${c.cls}`}>{c.text}</span></Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
