import { prisma } from "@/lib/db";
import { PageHead, Panel } from "@/components/ui";
import { Settings } from "lucide-react";
import { ROLES } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const [branches, items, services, suppliers] = await Promise.all([
    prisma.branch.count({ where: { active: true } }),
    prisma.item.count({ where: { active: true } }),
    prisma.serviceItem.count({ where: { active: true } }),
    prisma.supplier.count(),
  ]);
  const rows: [string, string][] = [
    ["Chi nhánh đang hoạt động", String(branches)],
    ["Mặt hàng kho", String(items)],
    ["Dịch vụ khám / thủ thuật", String(services)],
    ["Nhà cung cấp", String(suppliers)],
    ["Vai trò trong hệ thống", Object.values(ROLES).join(", ")],
    ["Múi giờ", "Asia/Ho_Chi_Minh (UTC+7)"],
    ["Tiền tệ", "VNĐ"],
  ];
  return (
    <div className="space-y-4">
      <PageHead icon={Settings} title="Cấu hình hệ thống" sub="Tổng quan cấu hình hiện tại" img="/images/art/pharmacy.jpg" />
      <Panel pad={false} icon={Settings} title="Thông số chung">
        <table><tbody>{rows.map(([k, v]) => <tr key={k}><td className="w-72 font-semibold">{k}</td><td>{v}</td></tr>)}</tbody></table>
      </Panel>
    </div>
  );
}
