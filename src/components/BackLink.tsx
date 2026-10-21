import Link from "next/link";

export function BackLink({ href, label = "Quay lại" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-lg border border-brand-gold/50 bg-white/70 px-3 py-1.5 text-sm text-brand-deep hover:bg-white"
    >
      ← {label}
    </Link>
  );
}
