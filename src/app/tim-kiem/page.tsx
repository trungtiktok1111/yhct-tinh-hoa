import Link from "next/link";
import { prisma } from "@/lib/db";
import { itemTitle, herbTitle } from "@/lib/viName";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() ?? "";

  const [diseases, patterns, principles, formulas, herbs, points] = q
    ? await Promise.all([
        prisma.disease.findMany({ where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { aliases: { contains: q, mode: "insensitive" } }] }, take: 10 }),
        prisma.pattern.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: 10 }),
        prisma.treatmentPrinciple.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: 10 }),
        prisma.formula.findMany({ where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { aliases: { contains: q, mode: "insensitive" } }] }, take: 10 }),
        prisma.herb.findMany({ where: { OR: [{ standardName: { contains: q, mode: "insensitive" } }, { aliases: { contains: q, mode: "insensitive" } }] }, take: 10 }),
        prisma.acupuncturePoint.findMany({ where: { OR: [{ standardName: { contains: q, mode: "insensitive" } }, { code: { contains: q, mode: "insensitive" } }] }, take: 10 }),
      ])
    : [[], [], [], [], [], []];

  const groups = [
    { label: "Bệnh học", items: diseases, hrefBase: "/benh-hoc", name: (i: any) => i.name },
    { label: "Chứng hậu", items: patterns, hrefBase: "/chung-hau", name: (i: any) => i.name },
    { label: "Pháp trị", items: principles, hrefBase: "/phap-tri", name: (i: any) => i.name },
    { label: "Bài thuốc", items: formulas, hrefBase: "/bai-thuoc", name: (i: any) => i.name },
    { label: "Vị thuốc", items: herbs, hrefBase: "/vi-thuoc", name: (i: any) => herbTitle(i.standardName) },
    { label: "Huyệt vị", items: points, hrefBase: "/cham-cuu", name: (i: any) => i.standardName },
  ];

  const total = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-deep">Tìm kiếm toàn cục</h1>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Nhập từ khóa..." className="flex-1 border rounded-lg px-3 py-2" />
        <button className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">Tìm</button>
      </form>

      {q && <p className="text-sm text-gray-600">Kết quả cho &quot;{q}&quot;: {total} mục.</p>}

      {groups
        .filter((g) => g.items.length > 0)
        .map((g) => (
          <div key={g.label}>
            <h2 className="font-semibold text-brand-deep mb-2">{g.label}</h2>
            <div className="grid gap-2">
              {g.items.map((i: any) => (
                <Link key={i.id} href={`${g.hrefBase}/${i.id}`} className="card">
                  {g.name(i)}
                </Link>
              ))}
            </div>
          </div>
        ))}

      {q && total === 0 && <p className="text-sm text-gray-500">Không tìm thấy kết quả phù hợp.</p>}
    </div>
  );
}
