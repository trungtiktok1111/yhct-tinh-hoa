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
      aria-current={on ? "page" : undefined}
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors duration-150 ${
        on ? "bg-white/[0.13] font-semibold text-white" : "font-medium text-white/80 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      {on && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-brand-goldLight" aria-hidden />}
      <NavIcon name={item.icon} className={`h-5 w-5 shrink-0 ${on ? "text-brand-goldLight" : "text-white/60"}`} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function SideNav({ clinic, knowledge, admin, adminSub = [] }: { clinic: NavLink[]; knowledge: NavLink[]; admin: NavLink[]; adminSub?: NavLink[] }) {
  const path = usePathname() || "/";
  const kOpen = path.startsWith("/tra-cuu") || knowledge.some((k) => isActive(path, k.href));
  return (
    <nav className="flex flex-col gap-1">
      {clinic.length > 0 && <div className="px-3 pb-1 pt-2 text-xs font-medium text-white/60">Phòng khám</div>}
      {clinic.map((i) => <Item key={i.href} item={i} path={path} />)}

      {knowledge.length > 0 && (
        <>
          <div className="my-3 border-t border-white/15" />
          <details open={kOpen} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium text-white/80 transition-colors hover:bg-white/[0.07] hover:text-white">
              <span className="flex items-center gap-3">
                <NavIcon name="BookOpen" className="h-5 w-5 text-white/60" /> Tra cứu y học
              </span>
              <span className="text-xs text-white/50 transition-transform duration-150 group-open:rotate-90" aria-hidden>▸</span>
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
          {path.startsWith("/quan-tri") && adminSub.length > 0 && (
            <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-white/15 pl-2">
              {adminSub.map((i) => {
                const on = i.href === "/quan-tri" ? path === i.href : isActive(path, i.href);
                return (
                  <Link key={i.href} href={i.href} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[14px] ${on ? "bg-white/[0.13] font-semibold text-white" : "text-white/75 hover:bg-white/[0.07] hover:text-white"}`}>
                    <NavIcon name={i.icon} className="h-4 w-4 shrink-0" /> <span className="truncate">{i.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </nav>
  );
}
