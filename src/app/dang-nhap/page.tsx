import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentStaff()) redirect("/");
  return (
    <div className="fixed inset-0">
      <Image src="/images/art/landscape.jpg" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-brand-deeper/55" />
      <div className="relative h-full grid place-items-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white/95 backdrop-blur p-7 shadow-2xl space-y-4">
          <div className="text-center">
            <Image src="/images/logo-badge.png" alt="" width={72} height={72} className="mx-auto rounded-full ring-2 ring-brand-gold/60" />
            <div className="brand-serif font-bold text-xl text-brand-deep mt-2">YHCT TINH HOA</div>
            <div className="text-sm text-brand-ink/70">Phòng khám Đông y</div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
