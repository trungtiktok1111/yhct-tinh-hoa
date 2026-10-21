import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function FormulaListPage({ searchParams }: { searchParams: { q?: string; trang?: string } }) {
  const q = searchParams.q?.trim();
  const page = pageOf(searchParams.trang);
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { aliases: { contains: q, mode: "insensitive" as const } },
          { indications: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;
  const [formulas, total] = await Promise.all([
    prisma.formula.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { principle: true, ingredients: { include: { herb: { select: { standardName: true } } } } },
    }),
    prisma.formula.count({ where }),
  ]);
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-deep to-brand-deeper px-5 py-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-goldLight font-display">Bài thuốc / Phương tễ</h1>
          <p className="text-brand-cream/70 text-sm mt-0.5">Thành phần, vai trò quân thần tá sứ và cách dùng theo nguồn.</p>
        </div>
        <span className="h-20 w-20 rounded-full ring-2 ring-brand-gold/60 shadow-md shrink-0 hidden sm:block overflow-hidden">
          <Image src="/images/teapot.png" alt="" width={160} height={160} className="h-full w-full object-cover" />
        </span>
        <Link
          href="/bai-thuoc/moi"
          className="absolute bottom-3 right-3 sm:static bg-brand-gold/90 hover:bg-brand-gold text-brand-deeper rounded-lg px-4 py-2 text-sm font-semibold shrink-0 transition-colors"
        >
          + Thêm bài thuốc
        </Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Lọc theo tên, chủ trị..." className="flex-1 border rounded-lg px-3 py-2" />
        <button className="border border-brand-deep text-brand-deep rounded-lg px-4 py-2 text-sm">Lọc</button>
      </form>
      <div className="grid gap-3">
        {formulas.map((f) => (
          <Link key={f.id} href={`/bai-thuoc/${f.id}`} className="card">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-brand-deep">{f.name}</div>
              <StatusPill status={f.status} />
            </div>
            {f.principle && <div className="text-xs text-gray-500 mt-1">Pháp trị: {f.principle.name}</div>}
            <div className="text-xs text-gray-500">
              Thành phần: {f.ingredients.map((i) => i.herb.standardName).join(", ") || "chưa có"}
            </div>
          </Link>
        ))}
        {formulas.length === 0 && <p className="text-sm text-gray-500">Không có bài thuốc nào.</p>}
      </div>
      <Pagination path="/bai-thuoc" page={page} total={total} params={{ q }} />
    </div>
  );
}
