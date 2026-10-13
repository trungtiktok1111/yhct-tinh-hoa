import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const entities = [
    { label: "Bệnh học", model: prisma.disease },
    { label: "Chứng hậu", model: prisma.pattern },
    { label: "Pháp trị", model: prisma.treatmentPrinciple },
    { label: "Bài thuốc", model: prisma.formula },
    { label: "Vị thuốc", model: prisma.herb },
    { label: "Huyệt vị", model: prisma.acupuncturePoint },
  ] as const;

  const rows = await Promise.all(
    entities.map(async (e) => {
      // @ts-expect-error — mỗi model đều có groupBy trên field status
      const grouped = await e.model.groupBy({ by: ["status"], _count: { status: true } });
      const byStatus: Record<string, number> = {};
      for (const g of grouped as any[]) byStatus[g.status] = g._count.status;
      return { label: e.label, byStatus };
    })
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-deep">Quản trị / Thẩm định</h1>

      <div className="card">
        <p className="font-semibold mb-2">Chưa triển khai ở bản demo này</p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Đăng nhập, quản lý tài khoản và phân quyền theo vai trò.</li>
          <li>Quy trình duyệt nội dung (chuyển trạng thái Bản nháp → Chờ thẩm định → Đã duyệt) bằng thao tác thực tế — hiện chỉ đặt trạng thái lúc tạo.</li>
          <li>Nhật ký truy cập/sửa/xóa và sao lưu–khôi phục.</li>
        </ul>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="font-semibold text-brand-deep mb-3">Bảng trạng thái nội dung (theo mục 13.3 tiêu chí nghiệm thu)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-1 pr-3">Phân hệ</th>
              <th className="py-1 pr-3">Bản nháp</th>
              <th className="py-1 pr-3">Chờ thẩm định</th>
              <th className="py-1 pr-3">Đã duyệt</th>
              <th className="py-1 pr-3">Khác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const known = ["DRAFT", "PENDING_REVIEW", "APPROVED"];
              const other = Object.entries(r.byStatus)
                .filter(([k]) => !known.includes(k))
                .reduce((sum, [, v]) => sum + v, 0);
              return (
                <tr key={r.label} className="border-b last:border-0">
                  <td className="py-1.5 pr-3 font-medium">{r.label}</td>
                  <td className="py-1.5 pr-3">{r.byStatus.DRAFT ?? 0}</td>
                  <td className="py-1.5 pr-3">{r.byStatus.PENDING_REVIEW ?? 0}</td>
                  <td className="py-1.5 pr-3">{r.byStatus.APPROVED ?? 0}</td>
                  <td className="py-1.5 pr-3">{other}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
