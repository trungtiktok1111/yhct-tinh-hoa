import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { NAV_ITEMS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "YHCT Tinh Hoa",
  description:
    "Hệ thống tri thức và lập luận điều trị Y học cổ truyền — bản demo kỹ thuật, dữ liệu DEMO, không dùng để điều trị.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Sidebar PC */}
          <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 bg-brand-deep text-brand-cream p-4 gap-1 sticky top-0 h-screen overflow-y-auto">
            <div className="font-bold text-lg mb-4 tracking-wide">YHCT TINH HOA</div>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-2 text-sm hover:bg-brand-dark transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </aside>

          {/* Top bar mobile */}
          <header className="md:hidden sticky top-0 z-10 bg-brand-deep text-brand-cream px-4 py-3 font-bold">
            YHCT TINH HOA
          </header>

          <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-6xl w-full mx-auto">
            <div className="warn-box mb-6 text-sm">
              Bản demo kỹ thuật — dữ liệu minh họa (DEMO), không dùng để chẩn đoán hoặc điều trị thật.
              Mọi quyết định chuyên môn cần người hành nghề có thẩm quyền xác nhận.
            </div>
            {children}
          </main>

          {/* Bottom nav mobile */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-brand-deep/20 flex justify-around py-2 z-10">
            {NAV_ITEMS.filter((i) => i.mobile).map((item) => (
              <Link key={item.href} href={item.href} className="text-xs text-brand-deep px-2 text-center">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </body>
    </html>
  );
}
