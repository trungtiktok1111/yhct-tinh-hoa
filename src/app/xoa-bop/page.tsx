import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";
import { ModuleHeader } from "@/components/ModuleHeader";

export const dynamic = "force-dynamic";

export default async function ManualTherapyListPage() {
  const therapies = await prisma.manualTherapy.findMany({ orderBy: { name: "asc" }, include: { source: true } });
  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Xoa bóp – Bấm huyệt & phương pháp khác"
        subtitle="Kỹ thuật, vùng tác động, chỉ định và chống chỉ định theo nguồn."
        image="/images/acupuncture-needles.png"
        action={{ href: "/xoa-bop/moi", label: "+ Thêm thủ pháp" }}
      />
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
