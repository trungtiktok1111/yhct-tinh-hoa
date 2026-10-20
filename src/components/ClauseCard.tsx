import {
  Zap,
  Flame,
  Snowflake,
  Droplet,
  Moon,
  Soup,
  Wind,
  SprayCan,
  Activity,
  Sparkles,
  Waves,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { pickClauseIcon } from "@/lib/clauses";

const ICONS: Record<string, LucideIcon> = {
  pain: Zap,
  "fever-heat": Flame,
  cold: Snowflake,
  bleeding: Droplet,
  "calm-sleep": Moon,
  digestive: Soup,
  respiratory: Wind,
  detox: SprayCan,
  "qi-blood": Activity,
  skin: Sparkles,
  diuretic: Waves,
  default: Leaf,
};

export function ClauseCard({ clause }: { clause: string }) {
  const Icon = ICONS[pickClauseIcon(clause)];
  return (
    <div className="flex gap-2.5 items-start rounded-lg bg-brand-cream/70 border border-brand-gold/20 px-3 py-2.5">
      <span className="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-brand-deep/10 flex items-center justify-center">
        <Icon className="h-3.5 w-3.5 text-brand-deep" strokeWidth={1.75} />
      </span>
      <span className="text-sm leading-snug text-brand-ink">{clause}</span>
    </div>
  );
}
