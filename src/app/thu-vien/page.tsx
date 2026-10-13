import Link from "next/link";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/ModuleHeader";

export const dynamic = "force-dynamic";

export default async function SourceListPage() {
  const sources = await prisma.source.findMany({ orderBy: { title: "asc" } });
  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Thư viện tài liệu / Nguồn"
        subtitle="Y thư, giáo trình, dược điển và nghiên cứu — mọi nhận định đều có trích dẫn."
        image="/images/library-books.png"
        action={{ href: "/thu-vien/moi", label: "+ Thêm nguồn" }}
      />
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
