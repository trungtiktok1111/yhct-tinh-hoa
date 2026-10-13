import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SourceListPage() {
  const sources = await prisma.source.findMany({ orderBy: { title: "asc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-brand-deep">Thư viện tài liệu / Nguồn</h1>
        <Link href="/thu-vien/moi" className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">
          + Thêm nguồn
        </Link>
      </div>
      <div className="grid gap-3">
        {sources.map((s) => (
          <Link key={s.id} href={`/thu-vien/${s.id}`} className="card">
            <div className="font-semibold text-brand-deep">{s.title}</div>
            <div className="text-xs text-gray-500">
              {s.sourceType}
              {s.authorOrOrg ? ` · ${s.authorOrOrg}` : ""}
              {s.year ? ` · ${s.year}` : ""}
              {s.version ? ` · ${s.version}` : ""}
            </div>
          </Link>
        ))}
        {sources.length === 0 && <p className="text-sm text-gray-500">Chưa có nguồn tài liệu nào.</p>}
      </div>
    </div>
  );
}
