import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { herbTitle } from "@/lib/viName";

export const dynamic = "force-dynamic";

const TILES = [
  { href: "/ly-luan", label: "Lý luận cơ bản", note: "Âm dương, ngũ hành, tạng phủ", img: "/images/art/landscape.jpg" },
  { href: "/benh-hoc", label: "Bệnh học", note: "Bệnh danh, nguyên nhân, biểu hiện", img: "/images/art/pharmacy.jpg" },
  { href: "/chung-hau", label: "Chứng hậu", note: "Bát cương, tạng phủ, kinh lạc", img: "/images/art/tea.jpg" },
  { href: "/bai-thuoc", label: "Bài thuốc", note: "Thành phần, liều, gia giảm", img: "/images/art/scale.jpg" },
  { href: "/vi-thuoc", label: "Vị thuốc", note: "Hình ảnh, tính vị, quy kinh", img: "/images/art/mortar.jpg" },
  { href: "/cham-cuu", label: "Châm cứu – Huyệt vị", note: "Huyệt, đường kinh, thủ pháp", img: "/images/art/needles.jpg" },
  { href: "/xoa-bop", label: "Xoa bóp – Bấm huyệt", note: "Thủ thuật theo vùng, theo chứng", img: "/images/art/meridian.jpg" },
  { href: "/thu-vien", label: "Thư viện tài liệu", note: "Nguồn trích dẫn", img: "/images/art/tall.jpg" },
];

export default async function ReferenceHome() {
  const [diseases, patterns, formulas, herbs, points, herbPics] = await Promise.all([
    prisma.disease.count(),
    prisma.pattern.count(),
    prisma.formula.count(),
    prisma.herb.count(),
    prisma.acupuncturePoint.count(),
    prisma.herb.findMany({
      where: { imageUrl: { not: null } },
      orderBy: { updatedAt: "desc" },
      take: 12,
      select: { id: true, standardName: true, natureFlavor: true, imageUrl: true },
    }),
  ]);
  const stats = [
    ["Bệnh", diseases], ["Chứng hậu", patterns], ["Bài thuốc", formulas], ["Vị thuốc", herbs], ["Huyệt", points],
  ] as const;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl">
        <Image src="/images/art/herbs-wide.jpg" alt="" width={1672} height={941} priority className="h-56 md:h-64 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deeper/90 via-brand-deeper/60 to-transparent" />
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center text-white">
          <div className="text-xs uppercase tracking-[0.2em] text-brand-goldLight">Tra cứu y học</div>
          <h1 className="text-3xl md:text-4xl font-bold mt-1">Thư viện Y học cổ truyền</h1>
          <p className="mt-2 max-w-md text-white/85 text-sm md:text-base">Tra bệnh, chứng hậu, bài thuốc, vị thuốc và huyệt vị. Dùng để đối chiếu khi khám — không thay cho quyết định của bác sĩ.</p>
          <form action="/tim-kiem" className="mt-4 flex max-w-lg gap-2">
            <input name="q" placeholder="Tìm bệnh, bài thuốc, vị thuốc, huyệt…" className="flex-1 rounded-full px-5 py-2.5 text-brand-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-goldLight" />
            <button className="rounded-full bg-brand-goldLight text-brand-deeper font-semibold px-6">Tìm</button>
          </form>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map(([l, n]) => (
          <div key={l} className="card text-center !py-3">
            <div className="text-2xl font-bold text-brand-deep">{n}</div>
            <div className="text-sm text-brand-ink/70">{l}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-xl font-bold mb-3">Danh mục</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TILES.map((t) => (
            <Link key={t.href} href={t.href} className="card interactive !p-0 overflow-hidden group">
              <Image src={t.img} alt="" width={400} height={240} className="h-28 w-full object-cover group-hover:scale-105 transition-transform" />
              <div className="p-3">
                <div className="font-semibold text-brand-deep">{t.label}</div>
                <div className="text-xs text-brand-ink/70 mt-0.5">{t.note}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {herbPics.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-xl font-bold">Vị thuốc có hình ảnh</h2>
            <Link href="/vi-thuoc" className="text-sm text-brand-deep underline">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {herbPics.map((h) => (
              <Link key={h.id} href={`/vi-thuoc/${h.id}`} className="group text-center">
                <Image src={h.imageUrl!} alt={h.standardName} width={200} height={200} className="aspect-square w-full rounded-2xl object-cover ring-1 ring-slate-200 group-hover:ring-brand-deep" />
                <div className="mt-1.5 text-sm font-semibold leading-tight">{herbTitle(h.standardName)}</div>
                {h.natureFlavor && <div className="text-[11px] text-brand-ink/70 truncate">{h.natureFlavor}</div>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
