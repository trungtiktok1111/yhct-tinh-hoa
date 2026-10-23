import Link from "next/link";
import { AlertTriangle, BellRing, ChevronRight } from "lucide-react";
import { getAlerts } from "@/lib/alerts";
import type { CurrentStaff } from "@/lib/auth";

// Dải cảnh báo đầu trang: đỏ = cần xử lý ngay, vàng = việc đang chờ. Bấm vào để tới đúng nơi xử lý.
export async function AlertBanner({ staff, branchIds }: { staff: CurrentStaff; branchIds: string[] }) {
  const alerts = await getAlerts(staff, branchIds).catch(() => []);
  if (!alerts.length) return null;
  return (
    <div className="space-y-1.5 px-4 pt-3 md:px-6" role="region" aria-label="Cảnh báo cần xử lý">
      {alerts.map((a) => {
        const red = a.level === "red";
        const Icon = red ? AlertTriangle : BellRing;
        return (
          <Link
            key={a.key} href={a.href}
            className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors ${red ? "border-red-300 bg-red-600 text-white hover:bg-red-700" : "border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"}`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${red ? "animate-pulse" : ""}`} />
            <span className="min-w-0 flex-1">{a.text}</span>
            <span className="hidden shrink-0 items-center gap-0.5 text-xs font-bold underline-offset-2 sm:flex">Xử lý ngay<ChevronRight className="h-4 w-4" /></span>
          </Link>
        );
      })}
    </div>
  );
}
