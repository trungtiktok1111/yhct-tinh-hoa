import Link from "next/link";
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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-brand-deep">Bài thuốc / Phương tễ</h1>
        <Link href="/bai-thuoc/moi" className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">
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
