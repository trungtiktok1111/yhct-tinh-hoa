import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function FormulaListPage() {
  const formulas = await prisma.formula.findMany({
    orderBy: { name: "asc" },
    include: { principle: true, ingredients: { include: { herb: true } } },
  });
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
        {formulas.length === 0 && <p className="text-sm text-gray-500">Chưa có dữ liệu bài thuốc.</p>}
      </div>
    </div>
  );
}
