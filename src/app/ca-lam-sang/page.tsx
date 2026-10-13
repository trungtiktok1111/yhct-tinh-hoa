import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ClinicalCaseListPage() {
  const cases = await prisma.clinicalCase.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-brand-deep">Ca lâm sàng</h1>
        <Link href="/ca-lam-sang/moi" className="bg-brand-deep text-white rounded-lg px-4 py-2 text-sm font-medium">
          + Tạo ca mới
        </Link>
      </div>

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
    </div>
  );
}
