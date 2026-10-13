import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function PointListPage() {
  const points = await prisma.acupuncturePoint.findMany({ orderBy: { meridian: "asc" } });
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
    </div>
  );
}
