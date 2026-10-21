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

// Kho và giá.
export const STOCK_VIEW_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER", "PHARMACIST", "STOREKEEPER", "CASHIER", "DOCTOR"];
export const STOCK_WRITE_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER", "PHARMACIST", "STOREKEEPER"]; // nhập kho, điều chỉnh
export const ITEM_MANAGER_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER"]; // tạo mặt hàng, đặt giá, mức tối thiểu
export const COST_VIEW_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER"]; // xem giá nhập

export function canAccessPath(role: string, pathname: string): boolean {
  const under = (p: string) => pathname === p || pathname.startsWith(p + "/");
  if (under("/kho/nhap") || under("/kho/dieu-chinh")) return STOCK_WRITE_ROLES.includes(role as Role);
  if (under("/kho")) return STOCK_VIEW_ROLES.includes(role as Role);
  if (OWNER_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return role === "OWNER";
  }
  return true;
}
