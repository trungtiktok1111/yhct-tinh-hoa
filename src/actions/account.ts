"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireStaff } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function changeOwnPassword(formData: FormData) {
  const me = await requireStaff();
  const cur = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const again = String(formData.get("again") ?? "");
  const fail = (m: string): never => redirect(`/tai-khoan?loi=${encodeURIComponent(m)}`);
  if (next.length < 8) fail("Mật khẩu mới tối thiểu 8 ký tự.");
  if (next !== again) fail("Hai lần nhập mật khẩu mới không khớp.");
  const row = await prisma.staff.findUnique({ where: { id: me.id } });
  if (!row || !(await verifyPassword(cur, row.passwordHash))) fail("Mật khẩu hiện tại không đúng.");
  await prisma.staff.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(next) } });
  await logAudit({ staffId: me.id, staffName: me.fullName, action: "CHANGE_PASSWORD", entity: "Staff", entityId: me.id });
  redirect("/tai-khoan?ok=1");
}
