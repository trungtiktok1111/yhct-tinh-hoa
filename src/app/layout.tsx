import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Noto_Serif, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { NAV_ITEMS } from "@/lib/constants";
import { NavIcon } from "@/components/NavIcon";
import { getCurrentStaff } from "@/lib/auth";
import { ROLES, canAccessPath } from "@/lib/permissions";
import { logout } from "@/actions/auth";

const display = Noto_Serif({
  subsets: ["vietnamese", "latin"],
  weight: ["600", "700"],
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
  return (
    <html lang="vi" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Banner minh họa — dãy núi mực tàu, thương hiệu */}
        <header className="relative h-24 md:h-32 overflow-hidden border-b border-brand-gold/30">
          <Image
            src="/images/hero-banner.png"
            alt=""
            fill
            priority
            className="object-cover object-[62%_38%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-deeper via-brand-deeper/80 to-brand-deeper/15" />
          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-3 md:gap-4">
            <span className="relative h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-full ring-2 ring-brand-gold/70 shadow-md overflow-hidden">
              <Image
                src="/images/logo-badge.png"
                alt="YHCT Tinh Hoa"
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-brand-goldLight text-lg md:text-3xl font-bold tracking-wide truncate">
                YHCT TINH HOA
              </h1>
              <p className="hidden sm:block text-brand-cream/80 text-[11px] md:text-sm tracking-wide truncate">
                Hệ thống tri thức và lập luận điều trị Y học cổ truyền
              </p>
            </div>
            {staff && (
              <form action={logout} className="ml-auto flex items-center gap-3 text-brand-cream">
                <div className="text-right leading-tight min-w-0">
                  <div className="text-xs md:text-sm font-semibold truncate max-w-[9rem] md:max-w-none">
                    {staff.fullName}
                  </div>
                  <div className="text-[10px] md:text-xs text-brand-cream/70">{ROLES[staff.role]}</div>
                </div>
                <button
                  type="submit"
                  className="rounded-lg border border-brand-gold/50 px-3 py-1.5 text-xs md:text-sm hover:bg-white/10"
                >
                  Đăng xuất
                </button>
              </form>
            )}
          </div>
        </header>

        <div className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] flex flex-col md:flex-row">
          {/* Sidebar PC */}
          {staff && (
          <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-gradient-to-b from-brand-deep to-brand-deeper text-brand-cream p-4 gap-1 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto ink-scrollbar">
            {NAV_ITEMS.filter((i) => staff && canAccessPath(staff.role, i.href)).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-white/10 hover:text-brand-goldLight transition-colors"
              >
                <NavIcon name={item.icon} className="h-4 w-4 shrink-0 text-brand-gold" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </aside>
          )}

          <main className="flex-1 p-4 md:p-8 pb-24 md:pb-10 max-w-5xl w-full mx-auto">
            <div className="warn-box mb-6 text-sm">
              Bản demo kỹ thuật — dữ liệu minh họa (DEMO), không dùng để chẩn đoán hoặc điều trị thật.
              Mọi quyết định chuyên môn cần người hành nghề có thẩm quyền xác nhận.
            </div>
            {children}
            <footer className="mt-10 pt-4 border-t border-brand-gold/20 text-center text-xs text-brand-ink/50">
              © {new Date().getFullYear()} YHCT Tinh Hoa — bản demo kỹ thuật, dữ liệu minh họa, không dùng điều trị thật.
            </footer>
          </main>

          {/* Bottom nav mobile */}
          {staff && (
          <nav className="md:hidden fixed bottom-0 inset-x-0 bg-gradient-to-t from-brand-deeper to-brand-deep border-t border-brand-gold/30 flex justify-around py-2 z-10">
            {NAV_ITEMS.filter((i) => i.mobile && staff && canAccessPath(staff.role, i.href)).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 text-brand-cream px-2 text-center"
              >
                <NavIcon name={item.icon} className="h-5 w-5 text-brand-gold" />
                <span className="text-[10px] leading-tight">{item.label}</span>
              </Link>
            ))}
          </nav>
          )}
        </div>
      </body>
    </html>
  );
}
