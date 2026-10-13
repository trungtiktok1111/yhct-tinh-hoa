import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function HerbListPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const herbs = await prisma.herb.findMany({
    where: q
      ? { OR: [{ standardName: { contains: q } }, { aliases: { contains: q } }, { indications: { contains: q } }] }
      : undefined,
    orderBy: { standardName: "asc" },
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-brand-deep">Vị thuốc / Dược liệu</h1>
        <Link href="/vi-thuoc/moi" className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">
          + Thêm vị thuốc
        </Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Lọc theo tên, chủ trị..." className="flex-1 border rounded-lg px-3 py-2" />
        <button className="border border-brand-deep text-brand-deep rounded-lg px-4 py-2 text-sm">Lọc</button>
      </form>
      <div className="grid md:grid-cols-2 gap-3">
        {herbs.map((h) => (
          <Link key={h.id} href={`/vi-thuoc/${h.id}`} className="card flex items-center justify-between">
            <div>
              <div className="font-semibold text-brand-deep">{h.standardName}</div>
              {h.natureFlavor && <div className="text-xs text-gray-500">{h.natureFlavor}</div>}
            </div>
            <StatusPill status={h.status} />
          </Link>
        ))}
        {herbs.length === 0 && <p className="text-sm text-gray-500">Chưa có dữ liệu vị thuốc.</p>}
      </div>
    </div>
  );
}
