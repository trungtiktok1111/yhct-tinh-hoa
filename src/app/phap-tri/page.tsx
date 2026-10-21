import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { ModuleHeader } from "@/components/ModuleHeader";

export const dynamic = "force-dynamic";

export default async function PrincipleListPage({ searchParams }: { searchParams: { trang?: string } }) {
  const page = pageOf(searchParams.trang);
  const [principles, total] = await Promise.all([
    prisma.treatmentPrinciple.findMany({ orderBy: { name: "asc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.treatmentPrinciple.count(),
  ]);
  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Pháp trị"
        subtitle="Nguyên tắc điều trị, mục tiêu và căn cứ áp dụng."
        image="/images/mountain-path.png"
        action={{ href: "/phap-tri/moi", label: "+ Thêm pháp trị" }}
      />
      <div className="grid gap-3">
        {principles.map((p) => (
          <Link key={p.id} href={`/phap-tri/${p.id}`} className="card flex items-center justify-between">
            <div className="font-semibold text-brand-deep">{p.name}</div>
            <StatusPill status={p.status} />
          </Link>
        ))}
        {principles.length === 0 && <p className="text-sm text-gray-500">Chưa có dữ liệu pháp trị.</p>}
      </div>
      <Pagination path="/phap-tri" page={page} total={total} />
    </div>
  );
}
