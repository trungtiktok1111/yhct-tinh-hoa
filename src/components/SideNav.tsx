"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/NavIcon";
import type { NavLink } from "@/lib/constants";

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

function Item({ item, path }: { item: NavLink; path: string }) {
  const on = isActive(path, item.href);
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
        on ? "bg-white text-brand-deep shadow-sm" : "text-white/85 hover:bg-white/10"
      }`}
    >
      <NavIcon name={item.icon} className={`h-5 w-5 shrink-0 ${on ? "text-brand-deep" : "text-brand-goldLight"}`} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function SideNav({ clinic, knowledge, admin }: { clinic: NavLink[]; knowledge: NavLink[]; admin: NavLink[] }) {
  const path = usePathname() || "/";
  const kOpen = path.startsWith("/tra-cuu") || knowledge.some((k) => isActive(path, k.href));
  return (
    <nav className="flex flex-col gap-1">
      {clinic.length > 0 && <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">Phòng khám</div>}
      {clinic.map((i) => <Item key={i.href} item={i} path={path} />)}

      {knowledge.length > 0 && (
        <>
          <div className="my-3 border-t border-white/15" />
          <details open={kOpen} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-semibold text-brand-goldLight hover:bg-white/10">
              <span className="flex items-center gap-3">
                <NavIcon name="BookOpen" className="h-5 w-5" /> Tra cứu y học
              </span>
              <span className="text-xs transition-transform group-open:rotate-90">▸</span>
            </summary>
            <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-white/15 pl-2">
              <Item item={{ href: "/tra-cuu", label: "Trang chủ tra cứu", icon: "LayoutDashboard" }} path={path} />
              {knowledge.map((i) => <Item key={i.href} item={i} path={path} />)}
            </div>
          </details>
        </>
      )}

      {admin.length > 0 && (
        <>
          <div className="my-3 border-t border-white/15" />
          {admin.map((i) => <Item key={i.href} item={i} path={path} />)}
        </>
      )}
    </nav>
  );
}
