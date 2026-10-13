import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SourceDetailPage({ params }: { params: { id: string } }) {
  const source = await prisma.source.findUnique({
    where: { id: params.id },
    include: {
      diseases: true,
      patterns: true,
      principles: true,
      formulas: true,
      herbs: true,
      points: true,
    },
  });
  if (!source) notFound();

  const usedBy = [
    ...source.diseases.map((d) => ({ href: `/benh-hoc/${d.id}`, label: d.name, type: "Bệnh" })),
    ...source.patterns.map((p) => ({ href: `/chung-hau/${p.id}`, label: p.name, type: "Chứng hậu" })),
    ...source.principles.map((p) => ({ href: `/phap-tri/${p.id}`, label: p.name, type: "Pháp trị" })),
    ...source.formulas.map((f) => ({ href: `/bai-thuoc/${f.id}`, label: f.name, type: "Bài thuốc" })),
    ...source.herbs.map((h) => ({ href: `/vi-thuoc/${h.id}`, label: h.standardName, type: "Vị thuốc" })),
    ...source.points.map((p) => ({ href: `/cham-cuu/${p.id}`, label: p.standardName, type: "Huyệt" })),
  ];

  return (
    <div className="space-y-6">
      <Link href="/thu-vien" className="text-sm text-brand-deep underline">
        ← Thư viện tài liệu
      </Link>
      <h1 className="text-2xl font-bold text-brand-deep">{source.title}</h1>
      <div className="card space-y-1 text-sm">
        <div>Loại nguồn: {source.sourceType}</div>
        {source.authorOrOrg && <div>Tác giả/cơ quan: {source.authorOrOrg}</div>}
        {source.year && <div>Năm: {source.year}</div>}
        {source.version && <div>Phiên bản: {source.version}</div>}
        {source.publisherOrUrl && <div>Nhà xuất bản/URL: {source.publisherOrUrl}</div>}
        {source.locator && <div>Vị trí trích dẫn: {source.locator}</div>}
      </div>
      <div className="card">
        <h2 className="font-semibold text-brand-deep mb-2">Được trích dẫn bởi</h2>
        <ul className="space-y-1">
          {usedBy.map((u, i) => (
            <li key={i}>
              <Link href={u.href} className="text-brand-deep underline">
                {u.label}
              </Link>{" "}
              <span className="text-xs text-gray-500">({u.type})</span>
            </li>
          ))}
          {usedBy.length === 0 && <p className="text-sm text-gray-500">Chưa có mục nào trích dẫn nguồn này.</p>}
        </ul>
      </div>
    </div>
  );
}
