import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { ModuleHeader } from "@/components/ModuleHeader";

export const dynamic = "force-dynamic";

export default async function PrincipleListPage() {
  const principles = await prisma.treatmentPrinciple.findMany({ orderBy: { name: "asc" } });
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
    </div>
  );
}
