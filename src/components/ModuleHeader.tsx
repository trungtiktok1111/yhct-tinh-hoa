import Image from "next/image";
import Link from "next/link";

export function ModuleHeader({
  title,
  subtitle,
  image,
  action,
}: {
  title: string;
  subtitle: string;
  image: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-deep to-brand-deeper px-5 py-4 flex items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-brand-goldLight font-display">{title}</h1>
        <p className="text-brand-cream/70 text-sm mt-0.5">{subtitle}</p>
      </div>
      <span className="h-20 w-20 rounded-full ring-2 ring-brand-gold/60 shadow-md shrink-0 hidden sm:block overflow-hidden">
        <Image src={image} alt="" width={160} height={160} className="h-full w-full object-cover" />
      </span>
      {action && (
        <Link
          href={action.href}
          className="absolute bottom-3 right-3 sm:static bg-brand-gold/90 hover:bg-brand-gold text-brand-deeper rounded-lg px-4 py-2 text-sm font-semibold shrink-0 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
