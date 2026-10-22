import Link from "next/link";
import type { LucideIcon } from "lucide-react";

// Đầu trang: gọn, phẳng. Tiêu đề + mô tả bên trái, nút hành động bên phải.
// Tham số img giữ lại để không phải sửa nơi gọi; trang làm việc không dùng ảnh nền.
export function PageHead({
  icon: Icon, title, sub, children,
}: { icon: LucideIcon; title: string; sub?: string; img?: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-[var(--line)] bg-white px-5 py-4">
      <Icon className="h-6 w-6 shrink-0 text-brand-deep" aria-hidden />
      <div className="min-w-0">
        <h1 className="text-[1.375rem] font-semibold leading-tight">{title}</h1>
        {sub && <p className="mt-0.5 text-sm text-brand-ink/70">{sub}</p>}
      </div>
      {children && <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}

// Màu chỉ đặt trên con số và một chấm nhỏ: màu là dữ liệu, không phải trang trí.
const TONES = {
  amber: ["text-amber-700", "bg-amber-500"],
  blue: ["text-sky-700", "bg-sky-500"],
  red: ["text-rose-700", "bg-rose-500"],
  purple: ["text-violet-700", "bg-violet-500"],
  green: ["text-emerald-700", "bg-emerald-500"],
  gold: ["text-yellow-700", "bg-yellow-500"],
} as const;
export type Tone = keyof typeof TONES;

// Chỉ số: nhãn nhỏ phía trên, con số lớn, đơn vị nhỏ. Không biểu tượng trong ô màu.
export function Stat({ label, value, unit, tone = "green", href }: { icon?: LucideIcon; label: string; value: React.ReactNode; unit?: string; tone?: Tone; href?: string }) {
  const [tx, dot] = TONES[tone];
  const body = (
    <>
      <div className="flex items-center gap-2 text-sm font-medium text-brand-ink/75">
        <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />{label}
      </div>
      <div className={`mt-1.5 text-[1.75rem] font-semibold leading-none tabular-nums ${tx}`}>{value}</div>
      {unit && <div className="mt-1.5 text-xs text-brand-ink/70">{unit}</div>}
    </>
  );
  const cls = "block rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5";
  return href ? <Link href={href} className={`${cls} transition-colors hover:border-brand-deep`}>{body}</Link> : <div className={cls}>{body}</div>;
}

export function Panel({ icon: Icon, title, right, children, tone = "text-emerald-700", pad = true }: { icon?: LucideIcon; title?: string; right?: React.ReactNode; children: React.ReactNode; tone?: string; pad?: boolean }) {
  return (
    <section className="card !p-0 overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)] font-semibold">
          {Icon && <Icon className={`h-[1.125rem] w-[1.125rem] ${tone}`} aria-hidden />}{title}
          {right && <div className="ml-auto text-sm font-normal">{right}</div>}
        </div>
      )}
      <div className={pad ? "p-4" : ""}>{children}</div>
    </section>
  );
}
