import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

// Đầu trang: biểu tượng + tiêu đề + mô tả, ảnh nghệ thuật mờ dần bên phải, nút hành động.
export function PageHead({
  icon: Icon, title, sub, img = "/images/art/herbs-wide.jpg", children,
}: { icon: LucideIcon; title: string; sub?: string; img?: string; children?: React.ReactNode }) {
  return (
    <header className="relative rounded-2xl border border-slate-200 bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <Image src={img} alt="" width={900} height={300} className="absolute right-0 top-0 h-full w-1/2 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white from-45% via-white/85 to-white/10" />
      </div>
      <div className="relative flex flex-wrap items-center gap-4 px-5 py-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-brand-deep"><Icon className="h-7 w-7" /></span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          {sub && <p className="text-sm text-brand-ink/65">{sub}</p>}
        </div>
        {children && <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}

const TONES = {
  amber: ["bg-amber-50 border-amber-200", "bg-amber-100 text-amber-600", "text-amber-600"],
  blue: ["bg-sky-50 border-sky-200", "bg-sky-100 text-sky-700", "text-sky-700"],
  red: ["bg-rose-50 border-rose-200", "bg-rose-100 text-rose-600", "text-rose-600"],
  purple: ["bg-violet-50 border-violet-200", "bg-violet-100 text-violet-700", "text-violet-700"],
  green: ["bg-emerald-50 border-emerald-200", "bg-emerald-100 text-emerald-700", "text-emerald-700"],
  gold: ["bg-yellow-50 border-yellow-200", "bg-yellow-100 text-yellow-700", "text-yellow-700"],
} as const;
export type Tone = keyof typeof TONES;

export function Stat({ icon: Icon, label, value, unit, tone = "green", href }: { icon: LucideIcon; label: string; value: React.ReactNode; unit?: string; tone?: Tone; href?: string }) {
  const [box, ic, tx] = TONES[tone];
  const body = (
    <div className="relative flex items-center gap-3 overflow-hidden">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${ic}`}><Icon className="h-5 w-5" /></span>
      <div className="min-w-0">
        <div className="text-sm font-bold leading-tight">{label}</div>
        <div className={`text-2xl font-bold leading-tight ${tx}`}>{value}</div>
        {unit && <div className="text-xs text-brand-ink/60">{unit}</div>}
      </div>
      <Icon className={`absolute -bottom-3 -right-2 h-16 w-16 opacity-[0.1] ${tx}`} />
    </div>
  );
  const cls = `rounded-2xl border p-3.5 ${box}`;
  return href ? <Link href={href} className={`${cls} hover:shadow-md transition block`}>{body}</Link> : <div className={cls}>{body}</div>;
}

export function Panel({ icon: Icon, title, right, children, tone = "text-emerald-700", pad = true }: { icon?: LucideIcon; title?: string; right?: React.ReactNode; children: React.ReactNode; tone?: string; pad?: boolean }) {
  return (
    <section className="card !p-0 overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 font-bold">
          {Icon && <Icon className={`h-5 w-5 ${tone}`} />}{title}
          {right && <div className="ml-auto text-sm font-normal">{right}</div>}
        </div>
      )}
      <div className={pad ? "p-4" : ""}>{children}</div>
    </section>
  );
}
