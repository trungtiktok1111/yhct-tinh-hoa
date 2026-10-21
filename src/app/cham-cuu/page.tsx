import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function PointListPage({ searchParams }: { searchParams: { q?: string; trang?: string } }) {
  const q = searchParams.q?.trim();
  const page = pageOf(searchParams.trang);
  const where = q
    ? {
        OR: [
          { standardName: { contains: q, mode: "insensitive" as const } },
          { code: { contains: q, mode: "insensitive" as const } },
          { meridian: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;
  const [points, total] = await Promise.all([
    prisma.acupuncturePoint.findMany({
      where,
      orderBy: [{ meridian: "asc" }, { code: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.acupuncturePoint.count({ where }),
  ]);
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-deep to-brand-deeper px-5 py-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-goldLight font-display">Châm cứu – Huyệt vị</h1>
          <p className="text-brand-cream/70 text-sm mt-0.5">Vị trí, kinh mạch, kỹ thuật và cảnh báo an toàn theo nguồn.</p>
        </div>
        <span className="h-20 w-20 rounded-full ring-2 ring-brand-gold/60 shadow-md shrink-0 hidden sm:block overflow-hidden">
          <Image src="/images/meridian-chart.png" alt="" width={160} height={160} className="h-full w-full object-cover" />
        </span>
        <Link
          href="/cham-cuu/moi"
          className="absolute bottom-3 right-3 sm:static bg-brand-gold/90 hover:bg-brand-gold text-brand-deeper rounded-lg px-4 py-2 text-sm font-semibold shrink-0 transition-colors"
        >
          + Thêm huyệt
        </Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Lọc theo tên, mã huyệt, kinh..." className="flex-1 border rounded-lg px-3 py-2" />
        <button className="border border-brand-deep text-brand-deep rounded-lg px-4 py-2 text-sm">Lọc</button>
      </form>
      <div className="grid md:grid-cols-2 gap-3">
        {points.map((p) => (
          <Link key={p.id} href={`/cham-cuu/${p.id}`} className="card flex items-center justify-between">
            <div>
              <div className="font-semibold text-brand-deep">
                {p.code ? `${p.code} — ` : ""}
                {p.standardName}
              </div>
              {p.meridian && <div className="text-xs text-gray-500">{p.meridian}</div>}
            </div>
            <StatusPill status={p.status} />
          </Link>
        ))}
        {points.length === 0 && <p className="text-sm text-gray-500">Chưa có dữ liệu huyệt vị.</p>}
      </div>
      <Pagination path="/cham-cuu" page={page} total={total} params={{ q }} />
    </div>
  );
}
