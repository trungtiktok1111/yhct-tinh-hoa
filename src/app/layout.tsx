import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";
import { Noto_Serif, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { CLINIC_NAV, KNOWLEDGE_NAV, ADMIN_NAV, ADMIN_SUB } from "@/lib/constants";
import { NavIcon } from "@/components/NavIcon";
import { SideNav } from "@/components/SideNav";
import { BranchSwitch } from "@/components/BranchSwitch";
import { branchesFor } from "@/lib/stock";
import { NotificationBell } from "@/components/NotificationBell";
import { AlertBanner } from "@/components/AlertBanner";
import { getCurrentStaff } from "@/lib/auth";
import { rolesLabel, canAccessPath } from "@/lib/permissions";
import { logout } from "@/actions/auth";

const display = Noto_Serif({
  subsets: ["vietnamese", "latin"],
  weight: ["600", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YHCT Tinh Hoa",
  description:
    "Hệ thống tri thức và lập luận điều trị Y học cổ truyền — bản demo kỹ thuật, dữ liệu DEMO, không dùng để điều trị.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const staff = await getCurrentStaff().catch(() => null);
  const branches = staff ? await branchesFor(staff).catch(() => []) : [];
  const ok = <T extends { href: string }>(l: T[]) => l.filter((i) => staff && canAccessPath(staff.role, i.href));
  const clinic = ok(CLINIC_NAV);
  const knowledge = ok(KNOWLEDGE_NAV);
  const admin = ok(ADMIN_NAV);
  const adminSub = ok(ADMIN_SUB);
  const initials = staff?.fullName.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();

  return (
    <html lang="vi" className={`${display.variable} ${body.variable}`}>
      <body>
        {!staff ? (
          <main className="min-h-screen flex items-center justify-center p-4">{children}</main>
        ) : (
          <div className="min-h-screen md:flex">
            {/* Sidebar PC */}
            <aside className="hidden md:flex md:w-64 md:shrink-0 flex-col bg-[#133b2d] text-white sticky top-0 h-screen">
              <Link href="/" className="flex shrink-0 items-center gap-3 px-4 py-3 border-b border-white/10">
                <span className="relative h-12 w-12 shrink-0 rounded-full ring-2 ring-brand-goldLight/70 overflow-hidden">
                  <Image src="/images/logo-badge.png" alt="" width={160} height={160} className="h-full w-full object-cover" />
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-lg font-bold tracking-wide text-brand-goldLight">YHCT TINH HOA</span>
                  <span className="block text-[11px] text-white/60">Phòng khám Đông y</span>
                </span>
              </Link>
              <div className="min-h-0 flex-1 overflow-y-auto p-3 ink-scrollbar">
                <SideNav clinic={clinic} knowledge={knowledge} admin={admin} adminSub={adminSub} />
              </div>
            </aside>

            <div className="flex-1 min-w-0 flex flex-col">
              {/* Thanh trên */}
              <header className="sticky top-0 z-20 flex items-center gap-3 bg-white border-b border-[var(--line)] px-4 md:px-6 h-14">
                <Link href="/" className="md:hidden font-display font-bold text-brand-deep">YHCT Tinh Hoa</Link>
                <Suspense fallback={null}><BranchSwitch branches={branches} /></Suspense>
                <form action="/benh-nhan" className="relative min-w-0 flex-1 max-w-xl hidden sm:block">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="q"
                    placeholder="Tìm bệnh nhân: tên, số điện thoại, mã BN…"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-deep/30"
                  />
                </form>
                <div className="ml-auto flex items-center gap-2">
                <NotificationBell staff={staff} branchIds={branches.map((b) => b.id)} />
                <details className="relative">
                  <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full py-1 pl-1 pr-3 hover:bg-slate-100">
                    <span className="h-9 w-9 rounded-full bg-brand-deep text-brand-goldLight grid place-items-center text-sm font-bold">{initials}</span>
                    <span className="hidden sm:block text-left leading-tight">
                      <span className="block text-sm font-semibold">{staff.fullName}</span>
                      <span className="block text-[11px] text-brand-ink/70">{rolesLabel(staff.role)}</span>
                    </span>
                    <ChevronDown className="hidden sm:block h-4 w-4 text-slate-500" />
                  </summary>
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    <Link href="/tai-khoan" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Tài khoản, đổi mật khẩu</Link>
                    <form action={logout}>
                      <button className="w-full text-left rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50">Đăng xuất</button>
                    </form>
                  </div>
                </details>
                </div>
              </header>

              <Suspense fallback={null}><AlertBanner staff={staff} branchIds={branches.map((b) => b.id)} /></Suspense>

              <main className="flex-1 p-4 md:px-6 md:py-5 pb-24 md:pb-5 w-full">
                {children}
                <footer className="mt-4 pt-3 border-t border-slate-200 text-center text-xs text-brand-ink/70">
                  YHCT Tinh Hoa — bản demo kỹ thuật, dữ liệu minh họa, không dùng chẩn đoán hoặc điều trị thật.
                </footer>
              </main>
            </div>

            {/* Thanh dưới trên điện thoại: chỉ các mục vận hành chính */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-brand-deep border-t border-brand-gold/30 flex justify-around py-2">
              {[...clinic.slice(0, 5), ...(knowledge.length ? [{ href: "/tra-cuu", label: "Tra cứu", icon: "BookOpen" }] : [])].map((item) => (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 text-white px-1.5 text-center">
                  <NavIcon name={item.icon} className="h-5 w-5 text-brand-goldLight" />
                  <span className="text-[10px] leading-tight">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </body>
    </html>
  );
}
