"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";
import { getCurrentStaff, logAudit } from "@/lib/auth";

const MAX_FAILS = 5;
const LOCK_MINUTES = 15;

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Nhập tên đăng nhập và mật khẩu." };

  // Khóa tạm khi sai nhiều lần liên tiếp.
  const since = new Date(Date.now() - LOCK_MINUTES * 60 * 1000);
  const fails = await prisma.auditLog.count({
    where: { action: "LOGIN_FAILED", entity: "Staff", entityId: username, at: { gte: since } },
  });
  if (fails >= MAX_FAILS) {
    return { error: `Sai quá nhiều lần. Thử lại sau ${LOCK_MINUTES} phút.` };
  }

  const staff = await prisma.staff.findUnique({ where: { username } });
  const ok = staff && staff.active && (await verifyPassword(password, staff.passwordHash));
  if (!staff || !ok) {
    await logAudit({ action: "LOGIN_FAILED", entity: "Staff", entityId: username });
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }

  let token: string;
  try {
    token = await signSession({ sub: staff.id, name: staff.fullName, role: staff.role });
  } catch {
    return { error: "Hệ thống chưa cấu hình AUTH_SECRET. Liên hệ quản trị." };
  }

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  await prisma.staff.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
  await logAudit({
    staffId: staff.id,
    staffName: staff.fullName,
    action: "LOGIN",
    entity: "Staff",
    entityId: staff.id,
  });
  redirect("/");
}

export async function logout() {
  const staff = await getCurrentStaff();
  if (staff) {
    await logAudit({
      staffId: staff.id,
      staffName: staff.fullName,
      action: "LOGOUT",
      entity: "Staff",
      entityId: staff.id,
    });
  }
  cookies().delete(SESSION_COOKIE);
  redirect("/dang-nhap");
}
