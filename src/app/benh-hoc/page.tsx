import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function DiseaseListPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();
  const diseases = await prisma.disease.findMany({
    where: q
      ? { OR: [{ name: { contains: q } }, { aliases: { contains: q } }, { symptoms: { contains: q } }] }
      : undefined,
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-brand-deep">Bệnh học</h1>
        <Link href="/benh-hoc/moi" className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">
          + Thêm bệnh
        </Link>
      </div>
      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Lọc theo tên, tên khác, triệu chứng..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button className="border border-brand-deep text-brand-deep rounded-lg px-4 py-2 text-sm">Lọc</button>
      </form>
      <div className="grid gap-3">
        {diseases.map((d) => (
          <Link key={d.id} href={`/benh-hoc/${d.id}`} className="card flex items-center justify-between">
            <div>
              <div className="font-semibold text-brand-deep">{d.name}</div>
              {d.aliases && <div className="text-xs text-gray-500">{d.aliases}</div>}
            </div>
            <StatusPill status={d.status} />
          </Link>
        ))}
        {diseases.length === 0 && <p className="text-sm text-gray-500">Chưa có dữ liệu bệnh học.</p>}
      </div>
    </div>
  );
}
