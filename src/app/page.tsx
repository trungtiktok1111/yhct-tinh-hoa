import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [diseaseCount, patternCount, principleCount, formulaCount, herbCount, pointCount, sourceCount] =
    await Promise.all([
      prisma.disease.count(),
      prisma.pattern.count(),
      prisma.treatmentPrinciple.count(),
      prisma.formula.count(),
      prisma.herb.count(),
      prisma.acupuncturePoint.count(),
      prisma.source.count(),
    ]);

  const [recentDiseases, recentFormulas] = await Promise.all([
    prisma.disease.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.formula.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Bệnh học", count: diseaseCount, href: "/benh-hoc" },
    { label: "Chứng hậu", count: patternCount, href: "/chung-hau" },
    { label: "Pháp trị", count: principleCount, href: "/phap-tri" },
    { label: "Bài thuốc", count: formulaCount, href: "/bai-thuoc" },
    { label: "Vị thuốc", count: herbCount, href: "/vi-thuoc" },
    { label: "Huyệt vị", count: pointCount, href: "/cham-cuu" },
    { label: "Tài liệu nguồn", count: sourceCount, href: "/thu-vien" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-deep mb-1">Tổng quan</h1>
        <p className="text-sm text-brand-ink/70">
          Hệ thống tri thức và lập luận điều trị Y học cổ truyền. Luồng ưu tiên: Bệnh học → Chứng hậu → Pháp trị →
          Bài thuốc → Vị thuốc → Nguồn.
        </p>
      </div>

      <form action="/tim-kiem" className="flex gap-2">
        <input
          name="q"
          placeholder="Tìm bệnh, chứng hậu, bài thuốc, vị thuốc, huyệt..."
          className="flex-1 border border-brand-gold/40 rounded-lg px-4 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
        />
        <button className="bg-brand-deep hover:bg-brand-deeper text-brand-goldLight rounded-lg px-5 py-2 font-medium transition-colors">
          Tìm
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className="card interactive">
            <div className="font-display text-2xl font-bold text-brand-deep">{s.count}</div>
            <div className="text-sm text-brand-ink/70">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="seal-divider text-xs uppercase tracking-[0.2em]">Cập nhật gần đây</div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-brand-deep mb-2">Bệnh học mới cập nhật</h2>
          <ul className="space-y-1">
            {recentDiseases.map((d) => (
              <li key={d.id}>
                <Link href={`/benh-hoc/${d.id}`} className="text-brand-deep underline">
                  {d.name}
                </Link>
              </li>
            ))}
            {recentDiseases.length === 0 && <li className="text-sm text-gray-500">Chưa có dữ liệu.</li>}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-brand-deep mb-2">Bài thuốc mới cập nhật</h2>
          <ul className="space-y-1">
            {recentFormulas.map((f) => (
              <li key={f.id}>
                <Link href={`/bai-thuoc/${f.id}`} className="text-brand-deep underline">
                  {f.name}
                </Link>
              </li>
            ))}
            {recentFormulas.length === 0 && <li className="text-sm text-gray-500">Chưa có dữ liệu.</li>}
          </ul>
        </div>
      </div>

      <div className="card text-sm">
        <h2 className="font-semibold text-brand-deep mb-2">Phân hệ chưa triển khai ở bản demo này</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>
            Ca lâm sàng &amp; biện chứng luận trị theo từng bước: <strong>đã có</strong> (nhập tứ chẩn, đối chiếu
            chứng hậu, xác nhận kết luận, nối tới pháp trị/bài thuốc) nhưng đối chiếu chỉ dùng so khớp từ khóa đơn
            giản — chưa phải suy luận lâm sàng thật, cần chuyên gia định nghĩa lại quy tắc.
          </li>
          <li>Mạng lưới tri thức dạng sơ đồ nút–cạnh tương tác — chưa làm.</li>
          <li>Trợ lý AI / RAG có trích dẫn — chưa làm.</li>
          <li>Đăng nhập, phân quyền theo vai trò, quy trình thẩm định nội dung — chưa làm (bản demo mở, ai cũng sửa được).</li>
        </ul>
      </div>
    </div>
  );
}
