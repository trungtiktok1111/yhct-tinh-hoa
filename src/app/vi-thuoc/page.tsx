import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function HerbListPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const herbs = await prisma.herb.findMany({
    where: q
      ? { OR: [{ standardName: { contains: q } }, { aliases: { contains: q } }, { indications: { contains: q } }] }
      : undefined,
    orderBy: { standardName: "asc" },
  });
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-deep to-brand-deeper px-5 py-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-goldLight font-display">Vị thuốc / Dược liệu</h1>
          <p className="text-brand-cream/70 text-sm mt-0.5">Tên chuẩn, tính vị, quy kinh và công năng theo nguồn.</p>
        </div>
        <span className="h-20 w-20 rounded-full ring-2 ring-brand-gold/60 shadow-md shrink-0 hidden sm:block overflow-hidden">
          <Image src="/images/mortar-pestle.png" alt="" width={160} height={160} className="h-full w-full object-cover" />
        </span>
        <Link
          href="/vi-thuoc/moi"
          className="absolute bottom-3 right-3 sm:static bg-brand-gold/90 hover:bg-brand-gold text-brand-deeper rounded-lg px-4 py-2 text-sm font-semibold shrink-0 transition-colors"
        >
          + Thêm vị thuốc
        </Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Lọc theo tên, chủ trị..." className="flex-1 border rounded-lg px-3 py-2" />
        <button className="border border-brand-deep text-brand-deep rounded-lg px-4 py-2 text-sm">Lọc</button>
      </form>
      <p className="text-xs text-brand-ink/50">{herbs.length} vị thuốc</p>
      <div className="grid md:grid-cols-2 gap-3">
        {herbs.map((h) => (
          <Link key={h.id} href={`/vi-thuoc/${h.id}`} className="card flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {h.imageUrl && (
                <Image
                  src={h.imageUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-brand-gold/40 shrink-0"
                />
              )}
              <div className="min-w-0">
                <div className="font-semibold text-brand-deep truncate">{h.standardName}</div>
                {h.natureFlavor && <div className="text-xs text-gray-500 truncate">{h.natureFlavor}</div>}
              </div>
            </div>
            <StatusPill status={h.status} />
          </Link>
        ))}
        {herbs.length === 0 && <p className="text-sm text-gray-500">Chưa có dữ liệu vị thuốc.</p>}
      </div>
    </div>
  );
}
