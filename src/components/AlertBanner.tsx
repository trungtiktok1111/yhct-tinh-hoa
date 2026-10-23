import Link from "next/link";
import { getAlerts } from "@/lib/alerts";
import type { CurrentStaff } from "@/lib/auth";

// Dải cảnh báo gọn một hàng: chip đỏ = cần xử lý ngay, chip vàng = việc đang chờ.
// Bấm vào chip để tới đúng nơi xử lý; rê chuột để xem lời nhắc đầy đủ.
export async function AlertBanner({ staff, branchIds }: { staff: CurrentStaff; branchIds: string[] }) {
  const alerts = await getAlerts(staff, branchIds).catch(() => []);
  if (!alerts.length) return null;
  const sorted = [...alerts].sort((a, b) => (a.level === b.level ? 0 : a.level === "red" ? -1 : 1));
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-4 pt-3 md:px-6" role="region" aria-label="Cảnh báo cần xử lý">
      {sorted.map((a) => {
        const red = a.level === "red";
        return (
          <Link
            key={a.key} href={a.href} title={`${a.text} — bấm để xử lý`}
            className={`group inline-flex items-center gap-1.5 rounded-full py-1 pl-2.5 pr-3 text-xs font-semibold shadow-sm ring-1 transition ${red ? "bg-red-600 text-white ring-red-700/40 hover:bg-red-700" : "bg-amber-50 text-amber-900 ring-amber-300 hover:bg-amber-100"}`}
          >
            <span className="relative flex h-2 w-2">
              {red && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${red ? "bg-white" : "bg-amber-500"}`} />
            </span>
            {a.short}
            <span aria-hidden className="opacity-60 transition-transform group-hover:translate-x-0.5">›</span>
          </Link>
        );
      })}
    </div>
  );
}
