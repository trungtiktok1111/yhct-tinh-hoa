"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { isRole } from "@/lib/permissions";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

function back(path: string, error?: string): never {
  redirect(error ? `${path}?loi=${encodeURIComponent(error)}` : path);
}

// ---------- Chi nhánh ----------

export async function createBranch(formData: FormData) {
  const owner = await requireRole("OWNER");
  const name = str(formData, "name");
  if (!name) back("/quan-tri/chi-nhanh", "Nhập tên chi nhánh.");
  const b = await prisma.branch.create({
    data: { name, address: str(formData, "address"), phone: str(formData, "phone") },
  });
  await logAudit({
    staffId: owner.id, staffName: owner.fullName, branchId: b.id,
    action: "CREATE", entity: "Branch", entityId: b.id, detail: name,
  });
  revalidatePath("/quan-tri/chi-nhanh");
  back("/quan-tri/chi-nhanh");
}

export async function setBranchActive(formData: FormData) {
  const owner = await requireRole("OWNER");
  const id = str(formData, "id");
  if (!id) back("/quan-tri/chi-nhanh");
  const active = formData.get("active") === "1";
  await prisma.branch.update({ where: { id }, data: { active } });
  await logAudit({
    staffId: owner.id, staffName: owner.fullName, branchId: id,
    action: active ? "ACTIVATE" : "DEACTIVATE", entity: "Branch", entityId: id,
  });
  revalidatePath("/quan-tri/chi-nhanh");
  back("/quan-tri/chi-nhanh");
}

// ---------- Nhân viên ----------

const PW_MIN = 8;

export async function createStaff(formData: FormData) {
  const owner = await requireRole("OWNER");
  const username = str(formData, "username")?.toLowerCase();
  const fullName = str(formData, "fullName");
  const password = String(formData.get("password") ?? "");
  const role = str(formData, "role");
  const branchIds = formData.getAll("branchIds").map(String);

  if (!username || !/^[a-z0-9._-]{3,32}$/.test(username))
    back("/quan-tri/nhan-vien", "Tên đăng nhập 3–32 ký tự: chữ thường không dấu, số, . _ -");
  if (!fullName) back("/quan-tri/nhan-vien", "Nhập họ tên.");
  if (password.length < PW_MIN) back("/quan-tri/nhan-vien", `Mật khẩu tối thiểu ${PW_MIN} ký tự.`);
  if (!isRole(role)) back("/quan-tri/nhan-vien", "Chọn vai trò.");
  if (role !== "OWNER" && branchIds.length === 0)
    back("/quan-tri/nhan-vien", "Chọn ít nhất một chi nhánh cho nhân viên này.");
  if (await prisma.staff.findUnique({ where: { username } }))
    back("/quan-tri/nhan-vien", "Tên đăng nhập đã có người dùng.");

  const s = await prisma.staff.create({
    data: {
      username,
      fullName,
      role,
      passwordHash: await hashPassword(password),
      branches: role === "OWNER" ? undefined : { create: branchIds.map((branchId) => ({ branchId })) },
    },
  });
  await logAudit({
    staffId: owner.id, staffName: owner.fullName,
    action: "CREATE", entity: "Staff", entityId: s.id, detail: `${username} · ${role}`,
  });
  revalidatePath("/quan-tri/nhan-vien");
  back("/quan-tri/nhan-vien");
}

async function otherActiveOwners(excludeId: string) {
  return prisma.staff.count({ where: { role: "OWNER", active: true, id: { not: excludeId } } });
}

export async function updateStaff(formData: FormData) {
  const owner = await requireRole("OWNER");
  const id = str(formData, "id");
  const fullName = str(formData, "fullName");
  const role = str(formData, "role");
  const branchIds = formData.getAll("branchIds").map(String);
  if (!id || !fullName || !isRole(role)) back("/quan-tri/nhan-vien", "Thiếu thông tin.");
  if (role !== "OWNER" && branchIds.length === 0)
    back("/quan-tri/nhan-vien", "Chọn ít nhất một chi nhánh.");

  const current = await prisma.staff.findUnique({ where: { id } });
  if (!current) back("/quan-tri/nhan-vien", "Không tìm thấy nhân viên.");
  if (current.role === "OWNER" && role !== "OWNER" && (await otherActiveOwners(id)) === 0)
    back("/quan-tri/nhan-vien", "Phải còn ít nhất một tài khoản Chủ đang hoạt động.");

  await prisma.$transaction([
    prisma.staffBranch.deleteMany({ where: { staffId: id } }),
    prisma.staff.update({
      where: { id },
      data: {
        fullName,
        role,
        branches: role === "OWNER" ? undefined : { create: branchIds.map((branchId) => ({ branchId })) },
      },
    }),
  ]);
  await logAudit({
    staffId: owner.id, staffName: owner.fullName,
    action: "UPDATE", entity: "Staff", entityId: id, detail: `${current.role} → ${role}`,
  });
  revalidatePath("/quan-tri/nhan-vien");
  back("/quan-tri/nhan-vien");
}

export async function setStaffActive(formData: FormData) {
  const owner = await requireRole("OWNER");
  const id = str(formData, "id");
  if (!id) back("/quan-tri/nhan-vien");
  const active = formData.get("active") === "1";
  if (!active) {
    if (id === owner.id) back("/quan-tri/nhan-vien", "Không thể tự khóa tài khoản của mình.");
    const target = await prisma.staff.findUnique({ where: { id } });
    if (target?.role === "OWNER" && (await otherActiveOwners(id)) === 0)
      back("/quan-tri/nhan-vien", "Phải còn ít nhất một tài khoản Chủ đang hoạt động.");
  }
  await prisma.staff.update({ where: { id }, data: { active } });
  await logAudit({
    staffId: owner.id, staffName: owner.fullName,
    action: active ? "ACTIVATE" : "DEACTIVATE", entity: "Staff", entityId: id,
  });
  revalidatePath("/quan-tri/nhan-vien");
  back("/quan-tri/nhan-vien");
}

export async function resetStaffPassword(formData: FormData) {
  const owner = await requireRole("OWNER");
  const id = str(formData, "id");
  const password = String(formData.get("password") ?? "");
  if (!id) back("/quan-tri/nhan-vien");
  if (password.length < PW_MIN) back("/quan-tri/nhan-vien", `Mật khẩu tối thiểu ${PW_MIN} ký tự.`);
  await prisma.staff.update({ where: { id }, data: { passwordHash: await hashPassword(password) } });
  await logAudit({
    staffId: owner.id, staffName: owner.fullName,
    action: "RESET_PASSWORD", entity: "Staff", entityId: id,
  });
  revalidatePath("/quan-tri/nhan-vien");
  back("/quan-tri/nhan-vien");
}
