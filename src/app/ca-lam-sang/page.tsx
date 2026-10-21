import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE, pageOf } from "@/lib/paging";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/ModuleHeader";

export const dynamic = "force-dynamic";

export default async function ClinicalCaseListPage({ searchParams }: { searchParams: { trang?: string } }) {
  const page = pageOf(searchParams.trang);
  const [cases, total] = await Promise.all([
    prisma.clinicalCase.findMany({ orderBy: { updatedAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.clinicalCase.count(),
  ]);
  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Ca lâm sàng"
        subtitle="Tứ chẩn, đối chiếu chứng hậu, kết luận và theo dõi điều trị."
        image="/images/jar-herbs.png"
        action={{ href: "/ca-lam-sang/moi", label: "+ Tạo ca mới" }}
      />

      <div className="warn-box text-sm">
        Dữ liệu demo — không dùng cho người bệnh thật. Phân tích chứng hậu dưới đây dùng phương pháp so khớp
        từ khóa đơn giản, chưa được chuyên gia thẩm định phương pháp.
      </div>

      <div className="grid gap-3">
        {cases.map((c) => (
          <Link key={c.id} href={`/ca-lam-sang/${c.id}`} className="card">
            <div className="font-semibold text-brand-deep">{c.caseCode}</div>
            {c.confirmedConclusion && <div className="text-xs text-gray-500">Kết luận: {c.confirmedConclusion}</div>}
            {!c.confirmedConclusion && <div className="text-xs text-gray-500">Chưa có kết luận xác nhận.</div>}
          </Link>
        ))}
        {cases.length === 0 && <p className="text-sm text-gray-500">Chưa có ca nào.</p>}
      </div>
      <Pagination path="/ca-lam-sang" page={page} total={total} />
    </div>
  );
}
