import {
  LayoutDashboard,
  Stethoscope,
  Fingerprint,
  Compass,
  FlaskConical,
  Leaf,
  Target,
  Hand,
  ClipboardList,
  BookOpen,
  Network,
  ShieldCheck,
  ScrollText,
  Package,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Stethoscope,
  Fingerprint,
  Compass,
  FlaskConical,
  Leaf,
  Target,
  Hand,
  ClipboardList,
  BookOpen,
  Network,
  ShieldCheck,
  ScrollText,
  Package,
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Leaf;
  return <Icon className={className} strokeWidth={1.75} />;
}
