import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PATIENT_ROLES } from "@/lib/permissions";
import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import { SEX_LABEL, patientCode } from "@/lib/format";
import { ageOf } from "@/lib/person";

export const dynamic = "force-dynamic";

export default async function PatientListPage({ searchParams }: { searchParams: { q?: string; trang?: string } }) {
  await requireRole(...PATIENT_ROLES);
  const q = searchParams.q?.trim();
  const page = pageOf(searchParams.trang);
  const digits = q?.replace(/\D/g, "");
  const seq = q && /^(bn-?)?0*\d+$/i.test(q) ? parseInt(q.replace(/\D/g, ""), 10) : undefined;
  const where = q
    ? {
        OR: [
          { fullName: { contains: q, mode: "insensitive" as const } },
          ...(digits && digits.length >= 3 ? [{ phone: { contains: digits } }, { nationalId: { contains: digits } }] : []),
          ...(seq !== undefined && Number.isSafeInteger(seq) && seq < 2147483647 ? [{ seq }] : []),
        ],
      }
    : undefined;
  const [patients, total] = await Promise.all([
    prisma.patient.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.patient.count({ where }),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold font-display">Bệnh nhân</h1>
        <Link href="/benh-nhan/moi" className="rounded-lg bg-brand-deep text-brand-cream px-4 py-2.5 font-semibold">
          + Thêm bệnh nhân
        </Link>
      </div>
      <form className="flex gap-2">
        <input
          name="q" defaultValue={q} placeholder="Tìm theo họ tên, điện thoại, CCCD hoặc mã BN..."
          className="flex-1 rounded-lg border border-brand-gold/40 bg-white px-3 py-2.5 text-base"
        />
        <button className="rounded-lg border border-brand-gold/50 px-4">Tìm</button>
      </form>
      <div className="space-y-2">
        {patients.map((p) => (
          <Link key={p.id} href={`/benh-nhan/${p.id}`} className="card !py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-semibold">{p.fullName}</div>
              <div className="text-xs text-gray-600">
                {patientCode(p.seq)} · {SEX_LABEL[p.sex] ?? p.sex} · {ageOf(p.birthDate, p.birthYear)} tuổi · {p.phone}
              </div>
            </div>
            {p.allergies && <span className="text-xs text-red-700 font-semibold">Có dị ứng</span>}
          </Link>
        ))}
        {patients.length === 0 && (
          <p className="text-sm text-gray-600">{q ? "Không tìm thấy bệnh nhân." : "Chưa có bệnh nhân nào."}</p>
        )}
      </div>
      <Pagination path="/benh-nhan" page={page} total={total} params={{ q }} />
    </div>
  );
}
