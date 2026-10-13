import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function PrincipleListPage() {
  const principles = await prisma.treatmentPrinciple.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-brand-deep">Pháp trị</h1>
        <Link href="/phap-tri/moi" className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">
          + Thêm pháp trị
        </Link>
      </div>
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
