import { prisma } from "@/lib/db";
import { PageHead, Panel } from "@/components/ui";
import { DatabaseBackup, Download } from "lucide-react";
import { dateVN, timeVN } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BackupPage() {
  const logs = await prisma.backupLog.findMany({ orderBy: { at: "desc" }, take: 30 });
  return (
    <div className="space-y-4">
      <PageHead icon={DatabaseBackup} title="Sao lưu dữ liệu" sub="Tải bản sao toàn bộ dữ liệu chính (JSON). Nên sao lưu mỗi tuần." img="/images/art/pharmacy.jpg" />
      <div className="card flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1 text-sm">Bản sao gồm: chi nhánh, nhân viên (không mật khẩu), bệnh nhân, lượt khám, hóa đơn, kho, nhà cung cấp, dịch vụ.</div>
        <a href="/quan-tri/sao-luu/xuat" className="flex items-center gap-2 rounded-xl bg-brand-deep px-5 py-2.5 font-semibold text-white hover:bg-brand-deeper"><Download className="h-4 w-4" /> Sao lưu ngay</a>
      </div>
      <Panel pad={false} icon={DatabaseBackup} title="Lịch sử sao lưu">
        <table>
          <thead><tr><th>Thời điểm</th><th>Người thực hiện</th><th>Trạng thái</th><th className="text-right">Dung lượng</th><th>Ghi chú</th></tr></thead>
          <tbody>
            {logs.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-brand-ink/60">Chưa có lần sao lưu nào.</td></tr>}
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{dateVN(l.at)} {timeVN(l.at)}</td>
                <td>{l.staffName ?? "—"}</td>
                <td><span className={`chip ${l.status === "OK" ? "chip-green" : "chip-red"}`}>{l.status === "OK" ? "Thành công" : "Thất bại"}</span></td>
                <td className="text-right">{l.bytes ? `${(l.bytes / 1024).toFixed(1)} KB` : "—"}</td>
                <td className="text-sm text-brand-ink/70">{l.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
