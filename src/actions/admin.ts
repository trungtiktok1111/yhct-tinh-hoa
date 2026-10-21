"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logAudit, requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { parseCommon, parseDate, type FormState } from "@/lib/person";
import { isRole, joinRoles, parseRoles, type Role } from "@/lib/permissions";

function pickRoles(fd: FormData): Role[] {
  return Array.from(new Set(fd.getAll("roles").map(String).filter(isRole)));
}

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

function staffExtras(fd: FormData): { error: string } | { data: { jobTitle: string | null; licenseNo: string | null; hireDate: Date | null; note: string | null } } {
  const hd = parseDate(str(fd, "hireDate"));
  if (hd === null) return { error: "Ngày vào làm không hợp lệ." };
  return {
    data: {
      jobTitle: str(fd, "jobTitle") ?? null, licenseNo: str(fd, "licenseNo") ?? null,
      hireDate: hd ?? null, note: str(fd, "note") ?? null,
    },
  };
}

export async function createStaff(_prev: FormState, formData: FormData): Promise<FormState> {
  const owner = await requireRole("OWNER");
  const username = str(formData, "username")?.toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roles = pickRoles(formData);
  const branchIds = formData.getAll("branchIds").map(String);

  const c = parseCommon(formData, { phoneRequired: false });
  if ("error" in c) return c;
  const x = staffExtras(formData);
  if ("error" in x) return x;
  if (!username || !/^[a-z0-9._-]{3,32}$/.test(username))
    return { error: "Tên đăng nhập 3–32 ký tự: chữ thường không dấu, số, . _ -" };
  if (password.length < PW_MIN) return { error: `Mật khẩu tối thiểu ${PW_MIN} ký tự.` };
  if (roles.length === 0) return { error: "Chọn ít nhất một vai trò." };
  const isOwnerRole = roles.includes("OWNER");
  if (!isOwnerRole && branchIds.length === 0) return { error: "Chọn ít nhất một chi nhánh cho nhân viên này." };
  if (await prisma.staff.findUnique({ where: { username } })) return { error: "Tên đăng nhập đã có người dùng." };
  if (c.data.nationalId && (await prisma.staff.findUnique({ where: { nationalId: c.data.nationalId } })))
    return { error: "Số CCCD này đã có nhân viên khác." };

  const d = c.data;
  const s = await prisma.staff.create({
    data: {
      username,
      fullName: d.fullName,
      role: joinRoles(roles),
      passwordHash: await hashPassword(password),
      birthDate: d.birthDate, sex: d.sex, nationalId: d.nationalId ?? null, phone: d.phone ?? null,
      email: d.email ?? null, address: d.address ?? null, ward: d.ward ?? null, district: d.district ?? null,
      province: d.province ?? null, ...x.data,
      branches: isOwnerRole ? undefined : { create: branchIds.map((branchId) => ({ branchId })) },
    },
  });
  await logAudit({
    staffId: owner.id, staffName: owner.fullName,
    action: "CREATE", entity: "Staff", entityId: s.id, detail: `${username} · ${joinRoles(roles)}`,
  });
  revalidatePath("/quan-tri/nhan-vien");
  redirect("/quan-tri/nhan-vien?ok=1");
}

async function otherActiveOwners(excludeId: string) {
  return prisma.staff.count({ where: { role: { contains: "OWNER" }, active: true, id: { not: excludeId } } });
}

export async function updateStaff(_prev: FormState, formData: FormData): Promise<FormState> {
  const owner = await requireRole("OWNER");
  const id = str(formData, "id");
  const roles = pickRoles(formData);
  const role = joinRoles(roles);
  const isOwnerRole = roles.includes("OWNER");
  const branchIds = formData.getAll("branchIds").map(String);
  if (!id) redirect("/quan-tri/nhan-vien");
  const c = parseCommon(formData, { phoneRequired: false });
  if ("error" in c) return c;
  const x = staffExtras(formData);
  if ("error" in x) return x;
  if (roles.length === 0) return { error: "Chọn ít nhất một vai trò." };
  if (!isOwnerRole && branchIds.length === 0) return { error: "Chọn ít nhất một chi nhánh." };

  const current = await prisma.staff.findUnique({ where: { id } });
  if (!current) return { error: "Không tìm thấy nhân viên." };
  if (parseRoles(current.role).includes("OWNER") && !isOwnerRole && (await otherActiveOwners(id)) === 0)
    return { error: "Phải còn ít nhất một tài khoản Chủ đang hoạt động." };
  if (c.data.nationalId) {
    const dup = await prisma.staff.findFirst({ where: { nationalId: c.data.nationalId, id: { not: id } } });
    if (dup) return { error: "Số CCCD này đã có nhân viên khác." };
  }

  const d = c.data;
  await prisma.$transaction([
    prisma.staffBranch.deleteMany({ where: { staffId: id } }),
    prisma.staff.update({
      where: { id },
      data: {
        fullName: d.fullName,
        role,
        birthDate: d.birthDate, sex: d.sex, nationalId: d.nationalId ?? null, phone: d.phone ?? null,
        email: d.email ?? null, address: d.address ?? null, ward: d.ward ?? null, district: d.district ?? null,
        province: d.province ?? null, ...x.data,
        branches: isOwnerRole ? undefined : { create: branchIds.map((branchId) => ({ branchId })) },
      },
    }),
  ]);
  await logAudit({
    staffId: owner.id, staffName: owner.fullName,
    action: "UPDATE", entity: "Staff", entityId: id, detail: `${current.role} → ${role}`,
  });
  revalidatePath("/quan-tri/nhan-vien");
  redirect("/quan-tri/nhan-vien?ok=1");
}

export async function setStaffActive(formData: FormData) {
  const owner = await requireRole("OWNER");
  const id = str(formData, "id");
  if (!id) back("/quan-tri/nhan-vien");
  const active = formData.get("active") === "1";
  if (!active) {
    if (id === owner.id) back("/quan-tri/nhan-vien", "Không thể tự khóa tài khoản của mình.");
    const target = await prisma.staff.findUnique({ where: { id } });
    if (target && parseRoles(target.role).includes("OWNER") && (await otherActiveOwners(id)) === 0)
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

export async function updateBranch(formData: FormData) {
  const owner = await requireRole("OWNER");
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!id) back("/quan-tri/chi-nhanh");
  if (!name) back("/quan-tri/chi-nhanh", "Tên chi nhánh không được để trống.");
  await prisma.branch.update({
    where: { id },
    data: { name, address: str(formData, "address") ?? null, phone: str(formData, "phone") ?? null },
  });
  await logAudit({
    staffId: owner.id, staffName: owner.fullName, branchId: id,
    action: "UPDATE", entity: "Branch", entityId: id, detail: name,
  });
  revalidatePath("/quan-tri/chi-nhanh");
  back("/quan-tri/chi-nhanh");
}

// Chỉ xóa được chi nhánh chưa có nhân viên và chưa có giao dịch kho; còn lại thì dùng "Ngừng hoạt động".
export async function deleteBranch(formData: FormData) {
  const owner = await requireRole("OWNER");
  const id = str(formData, "id");
  if (!id) back("/quan-tri/chi-nhanh");
  const b = await prisma.branch.findUnique({ where: { id } });
  if (!b) back("/quan-tri/chi-nhanh");
  const [staff, lots, moves] = await Promise.all([
    prisma.staffBranch.count({ where: { branchId: id } }),
    prisma.stockLot.count({ where: { branchId: id } }),
    prisma.stockMove.count({ where: { branchId: id } }),
  ]);
  if (staff > 0) back("/quan-tri/chi-nhanh", `Còn ${staff} nhân viên thuộc chi nhánh này. Gỡ họ khỏi chi nhánh trước, hoặc chọn "Ngừng hoạt động".`);
  if (lots + moves > 0) back("/quan-tri/chi-nhanh", 'Chi nhánh đã có dữ liệu kho nên không xóa được. Hãy chọn "Ngừng hoạt động".');
  await prisma.branch.delete({ where: { id } });
  await logAudit({
    staffId: owner.id, staffName: owner.fullName, action: "DELETE", entity: "Branch", entityId: id, detail: b.name,
  });
  revalidatePath("/quan-tri/chi-nhanh");
  back("/quan-tri/chi-nhanh");
}

export async function deleteStaff(formData: FormData) {
  const owner = await requireRole("OWNER");
  const id = str(formData, "id");
  if (!id) back("/quan-tri/nhan-vien");
  if (id === owner.id) back("/quan-tri/nhan-vien", "Không thể tự xóa tài khoản của mình.");
  const target = await prisma.staff.findUnique({ where: { id } });
  if (!target) back("/quan-tri/nhan-vien");
  if (parseRoles(target.role).includes("OWNER") && (await otherActiveOwners(id)) === 0)
    back("/quan-tri/nhan-vien", "Phải còn ít nhất một tài khoản Chủ đang hoạt động.");
  await prisma.staff.delete({ where: { id } }); // nhật ký cũ vẫn giữ tên người thao tác
  await logAudit({
    staffId: owner.id, staffName: owner.fullName, action: "DELETE", entity: "Staff", entityId: id,
    detail: `${target.username} · ${target.role}`,
  });
  revalidatePath("/quan-tri/nhan-vien");
  back("/quan-tri/nhan-vien");
}
