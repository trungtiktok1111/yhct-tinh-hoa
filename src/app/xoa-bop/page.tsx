import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function ManualTherapyListPage() {
  const therapies = await prisma.manualTherapy.findMany({ orderBy: { name: "asc" }, include: { source: true } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-brand-deep">Xoa bóp – Bấm huyệt & phương pháp khác</h1>
        <Link href="/xoa-bop/moi" className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">
          + Thêm thủ pháp
        </Link>
      </div>
      <div className="grid gap-3">
        {therapies.map((t) => (
          <div key={t.id} className="card">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-brand-deep">{t.name}</div>
              <StatusPill status={t.status} />
            </div>
            {t.techniqueType && <div className="text-xs text-gray-500">Loại kỹ thuật: {t.techniqueType}</div>}
            {t.targetArea && <div className="text-sm mt-1">Vùng tác động: {t.targetArea}</div>}
            {t.indications && <div className="text-sm">Chỉ định: {t.indications}</div>}
            {t.contraindications && (
              <div className="warn-box mt-2 text-sm">Chống chỉ định: {t.contraindications}</div>
            )}
            {t.source && <div className="text-xs text-gray-500 mt-2">Nguồn: {t.source.title}</div>}
          </div>
        ))}
        {therapies.length === 0 && <p className="text-sm text-gray-500">Chưa có dữ liệu thủ pháp.</p>}
      </div>
    </div>
  );
}
