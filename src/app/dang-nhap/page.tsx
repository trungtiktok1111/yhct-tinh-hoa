import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentStaff()) redirect("/");
  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="card space-y-4">
        <h1 className="text-xl font-bold font-display">Đăng nhập</h1>
        <LoginForm />
      </div>
    </div>
  );
}
