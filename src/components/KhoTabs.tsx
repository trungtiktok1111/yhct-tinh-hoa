import Link from "next/link";
import { getCurrentStaff } from "@/lib/auth";
import { STOCK_WRITE_ROLES, ITEM_MANAGER_ROLES, hasAny } from "@/lib/permissions";
import { Package, PackagePlus, ClipboardCheck, Tag, Truck, CalendarClock } from "lucide-react";

const TABS = [
  ["ton", "/kho", "Tồn kho", Package, "view"],
  ["nhap", "/kho/nhap", "Nhập kho", PackagePlus, "write"],
  ["dieu-chinh", "/kho/dieu-chinh", "Điều chỉnh / Kiểm kê", ClipboardCheck, "write"],
  ["mat-hang", "/kho/mat-hang", "Mặt hàng và giá", Tag, "view"],
  ["ncc", "/kho/nha-cung-cap", "Nhà cung cấp", Truck, "view"],
  ["lo", "/kho/lo", "Lô và hạn dùng", CalendarClock, "view"],
] as const;

// Thanh tab chung của khu Kho và giá.
export async function KhoTabs({ active }: { active: string }) {
  const staff = await getCurrentStaff();
  const write = !!staff && hasAny(staff.roles, STOCK_WRITE_ROLES);
  void ITEM_MANAGER_ROLES;
  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.filter((t) => t[4] === "view" || write).map(([k, href, label, Icon]) => (
        <Link key={k} href={href} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold ${active === k ? "border-brand-deep bg-brand-deep text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
          <Icon className="h-4 w-4" />{label}
        </Link>
      ))}
    </nav>
  );
}
