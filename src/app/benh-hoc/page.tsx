import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { ModuleHeader } from "@/components/ModuleHeader";

export const dynamic = "force-dynamic";

export default async function DiseaseListPage({
  searchParams,
}: {
  searchParams: { q?: string; trang?: string };
}) {
  const q = searchParams.q?.trim();
  const page = pageOf(searchParams.trang);
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { aliases: { contains: q, mode: "insensitive" as const } },
          { symptoms: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;
  const [diseases, total] = await Promise.all([
    prisma.disease.findMany({ where, orderBy: { name: "asc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.disease.count({ where }),
  ]);

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Bệnh học"
        subtitle="Danh mục, nguyên nhân, bệnh cơ và chẩn đoán phân biệt theo nguồn."
        image="/images/apothecary-shelf.png"
        action={{ href: "/benh-hoc/moi", label: "+ Thêm bệnh" }}
      />
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
      <Pagination path="/benh-hoc" page={page} total={total} params={{ q }} />
    </div>
  );
}
