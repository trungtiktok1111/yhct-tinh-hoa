// Vai trò và quyền. File này không import gì của Node để dùng được trong middleware (edge).

export const ROLES = {
  OWNER: "Chủ / Quản lý tổng",
  BRANCH_MANAGER: "Quản lý chi nhánh",
  RECEPTION: "Lễ tân",
  DOCTOR: "Bác sĩ",
  CASHIER: "Thu ngân",
  PHARMACIST: "Dược",
  STOREKEEPER: "Thủ kho",
} as const;

export type Role = keyof typeof ROLES;

export const ROLE_KEYS = Object.keys(ROLES) as Role[];

export function isRole(v: unknown): v is Role {
  return typeof v === "string" && v in ROLES;
}

// Đường dẫn chỉ OWNER được vào.
const OWNER_ONLY_PREFIXES = ["/quan-tri/nhan-vien", "/quan-tri/chi-nhanh", "/quan-tri/nhat-ky"];

// Vai trò được sửa dữ liệu tri thức YHCT (bệnh học, chứng hậu, bài thuốc...).
export const KNOWLEDGE_EDITOR_ROLES: Role[] = ["OWNER", "DOCTOR"];

export function canEditKnowledge(role: string): boolean {
  return KNOWLEDGE_EDITOR_ROLES.includes(role as Role);
}

export function canAccessPath(role: string, pathname: string): boolean {
  if (OWNER_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return role === "OWNER";
  }
  return true;
}
