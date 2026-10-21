import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { BackLink } from "@/components/BackLink";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  await requireRole("OWNER");
  const logs = await prisma.auditLog.findMany({ orderBy: { at: "desc" }, take: 200 });

  return (
    <div className="space-y-4">
      <BackLink href="/quan-tri" label="Quay lại Quản trị" />
      <h1 className="text-2xl font-bold font-display">Nhật ký thao tác</h1>
      <p className="text-sm text-gray-600">200 thao tác gần nhất. Nhật ký chỉ thêm, không sửa hoặc xóa.</p>
      <div className="space-y-2">
        {logs.length === 0 && <p className="text-sm text-gray-600">Chưa có thao tác nào.</p>}
        {logs.map((l) => (
          <div key={l.id} className="card !py-2.5 text-sm flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-gray-600 tabular-nums">
              {l.at.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
            </span>
            <span className="font-semibold">{l.staffName ?? "Chưa đăng nhập"}</span>
            <span>
              {l.action} · {l.entity}
              {l.detail ? ` · ${l.detail}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
