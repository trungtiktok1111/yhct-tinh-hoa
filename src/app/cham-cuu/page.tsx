import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function PointListPage() {
  const points = await prisma.acupuncturePoint.findMany({ orderBy: { meridian: "asc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-brand-deep">Châm cứu – Huyệt vị</h1>
        <Link href="/cham-cuu/moi" className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">
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
