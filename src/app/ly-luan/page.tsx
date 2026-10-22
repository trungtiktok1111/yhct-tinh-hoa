import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { ModuleHeader } from "@/components/ModuleHeader";

export const dynamic = "force-dynamic";

export default async function TheoryTopicListPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();
  const topics = await prisma.theoryTopic.findMany({
    where: q
      ? { OR: [{ name: { contains: q } }, { category: { contains: q } }, { summary: { contains: q } }] }
      : undefined,
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const byCategory = new Map<string, typeof topics>();
  for (const t of topics) {
    const key = t.category ?? "Khác";
    byCategory.set(key, [...(byCategory.get(key) ?? []), t]);
  }

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Lý luận cơ bản"
        subtitle="Âm dương, Ngũ hành, Tạng tượng, Kinh lạc, Khí-Huyết-Tân dịch, Tứ chẩn, Bát cương, Bát pháp và các lý luận nền tảng khác của YHCT."
        image="/images/apothecary-shelf.png"
        action={{ href: "/ly-luan/moi", label: "+ Thêm lý luận" }}
      />
      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Lọc theo tên, nhóm, tóm tắt..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button className="border border-brand-deep text-brand-deep rounded-lg px-4 py-2 text-sm">Lọc</button>
      </form>
      <div className="space-y-6">
        {[...byCategory.entries()].map(([category, items]) => (
          <div key={category}>
            <h2 className="text-sm font-semibold text-brand-ink/70 mb-2">{category}</h2>
            <div className="grid gap-3">
              {items.map((t) => (
                <Link key={t.id} href={`/ly-luan/${t.id}`} className="card flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-brand-deep">{t.name}</div>
                    {t.summary && <div className="text-xs text-gray-500 line-clamp-2">{t.summary}</div>}
                  </div>
                  <StatusPill status={t.status} />
                </Link>
              ))}
            </div>
          </div>
        ))}
        {topics.length === 0 && <p className="text-sm text-gray-500">Chưa có dữ liệu lý luận cơ bản.</p>}
      </div>
    </div>
  );
}
