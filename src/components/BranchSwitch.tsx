"use client";
import { Building2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function BranchSwitch({ branches }: { branches: { id: string; name: string }[] }) {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  if (branches.length === 0) return null;
  const cur = sp.get("cn") ?? branches[0].id;
  return (
    <label className="flex shrink-0 items-center gap-2 text-sm"><span className="hidden lg:inline text-brand-ink/70">Chi nhánh</span><Building2 className="h-5 w-5 text-brand-deep -mr-1" />
      
      <select
        value={branches.some((b) => b.id === cur) ? cur : branches[0].id}
        onChange={(e) => {
          const p = new URLSearchParams(sp.toString());
          p.set("cn", e.target.value);
          router.push(`${path}?${p.toString()}`);
        }}
        className="w-auto min-w-[17rem] max-w-[26rem] shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold uppercase text-brand-ink"
      >
        {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
    </label>
  );
}
