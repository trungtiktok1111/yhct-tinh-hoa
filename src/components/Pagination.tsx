import Link from "next/link";
import { PAGE_SIZE } from "@/lib/paging";

export function Pagination({
  path,
  page,
  total,
  params = {},
}: {
  path: string;
  page: number;
  total: number;
  params?: Record<string, string | undefined>;
}) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pages <= 1) return <p className="text-xs text-brand-ink/70">{total} mục</p>;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("trang", String(p));
    const qs = sp.toString();
    return qs ? `${path}?${qs}` : path;
  };
  const cls = "rounded-lg border border-brand-gold/50 px-3 py-1.5 text-sm";
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {page > 1 ? <Link href={href(page - 1)} className={cls}>← Trước</Link> : <span className={`${cls} opacity-40`}>← Trước</span>}
      <span>Trang {page}/{pages} · {total} mục</span>
      {page < pages ? <Link href={href(page + 1)} className={cls}>Sau →</Link> : <span className={`${cls} opacity-40`}>Sau →</span>}
    </div>
  );
}
