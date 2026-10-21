// Phía server: lấy nhân viên hiện tại, kiểm tra quyền, ghi nhật ký.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { canEditKnowledge, isRole, type Role } from "@/lib/permissions";

export type CurrentStaff = {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  branchIds: string[]; // OWNER: rỗng nhưng xem được tất cả (xem isOwner)
  isOwner: boolean;
};

// Đọc cookie, rồi đối chiếu database để nhân viên bị khóa hoặc đổi vai trò có hiệu lực ngay.
export async function getCurrentStaff(): Promise<CurrentStaff | null> {
  const session = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const staff = await prisma.staff.findUnique({
    where: { id: session.sub },
    include: { branches: { select: { branchId: true } } },
  });
  if (!staff || !staff.active || !isRole(staff.role)) return null;
  return {
    id: staff.id,
    username: staff.username,
    fullName: staff.fullName,
    role: staff.role,
    branchIds: staff.branches.map((b) => b.branchId),
    isOwner: staff.role === "OWNER",
  };
}

export async function requireStaff(): Promise<CurrentStaff> {
  const staff = await getCurrentStaff();
  if (!staff) redirect("/dang-nhap");
  return staff;
}

export async function requireRole(...roles: Role[]): Promise<CurrentStaff> {
  const staff = await requireStaff();
  if (!roles.includes(staff.role)) redirect("/khong-co-quyen");
  return staff;
}

// Dùng ở đầu các Server Action ghi dữ liệu tri thức YHCT.
export async function requireKnowledgeEditor(): Promise<CurrentStaff> {
  const staff = await requireStaff();
  if (!canEditKnowledge(staff.role)) redirect("/khong-co-quyen");
  return staff;
}

// Chi nhánh mà nhân viên này được thấy: OWNER thấy tất cả.
export function branchFilter(staff: CurrentStaff): { id?: { in: string[] } } {
  return staff.isOwner ? {} : { id: { in: staff.branchIds } };
}

export async function logAudit(entry: {
  staffId?: string | null;
  staffName?: string | null;
  branchId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  detail?: string | null;
}) {
  try {
    await prisma.auditLog.create({ data: entry });
  } catch (e) {
    console.error("Ghi nhật ký thất bại", e);
  }
}
