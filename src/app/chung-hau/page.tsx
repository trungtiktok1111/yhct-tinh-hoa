import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { ModuleHeader } from "@/components/ModuleHeader";

export const dynamic = "force-dynamic";

export default async function PatternListPage({ searchParams }: { searchParams: { trang?: string } }) {
  const page = pageOf(searchParams.trang);
  const [patterns, total] = await Promise.all([
    prisma.pattern.findMany({ orderBy: { name: "asc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.pattern.count(),
  ]);
  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Chứng hậu"
        subtitle="Tiêu chí ủng hộ/không phù hợp và dữ kiện cần xác định."
        image="/images/scale-herbs.png"
        action={{ href: "/chung-hau/moi", label: "+ Thêm chứng hậu" }}
      />
      <div className="grid gap-3">
        {patterns.map((p) => (
          <Link key={p.id} href={`/chung-hau/${p.id}`} className="card flex items-center justify-between">
            <div className="font-semibold text-brand-deep">{p.name}</div>
            <StatusPill status={p.status} />
          </Link>
        ))}
        {patterns.length === 0 && <p className="text-sm text-gray-500">Chưa có dữ liệu chứng hậu.</p>}
      </div>
      <Pagination path="/chung-hau" page={page} total={total} />
    </div>
  );
}
