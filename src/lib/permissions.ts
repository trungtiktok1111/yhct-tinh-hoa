// Vai trò và quyền. File này không import gì của Node để dùng được trong middleware (edge).

export const ROLES = {
  OWNER: "Chủ / Quản lý tổng",
  BRANCH_MANAGER: "Quản lý chi nhánh",
  RECEPTION: "Lễ tân",
  DOCTOR: "Bác sĩ",
  CASHIER: "Thu ngân",
  PHARMACIST: "Dược",
  STOREKEEPER: "Thủ kho",
  TECHNICIAN: "Y sĩ / Kỹ thuật viên",
} as const;

export type Role = keyof typeof ROLES;

export const ROLE_KEYS = Object.keys(ROLES) as Role[];

export function isRole(v: unknown): v is Role {
  return typeof v === "string" && v in ROLES;
}

// Một người có thể giữ nhiều vai trò: lưu dạng "DOCTOR,CASHIER".
export function parseRoles(v: string | null | undefined): Role[] {
  return (v ?? "").split(",").map((x) => x.trim()).filter(isRole);
}
export function joinRoles(roles: Role[]): string {
  return roles.join(",");
}
export function hasAny(roles: Role[], allowed: Role[]): boolean {
  return roles.some((r) => allowed.includes(r));
}
export function rolesLabel(v: string | null | undefined): string {
  const r = parseRoles(v);
  return r.length ? r.map((x) => ROLES[x]).join(" + ") : "—";
}

// Đường dẫn chỉ OWNER được vào.
const OWNER_ONLY_PREFIXES = ["/quan-tri/nhan-vien", "/quan-tri/chi-nhanh", "/quan-tri/nhat-ky", "/quan-tri/sao-luu", "/quan-tri/cau-hinh"];

// Vai trò được sửa dữ liệu tri thức YHCT (bệnh học, chứng hậu, bài thuốc...).
export const KNOWLEDGE_EDITOR_ROLES: Role[] = ["OWNER", "DOCTOR"];

export function canEditKnowledge(role: string): boolean {
  return hasAny(parseRoles(role), KNOWLEDGE_EDITOR_ROLES);
}

// Bệnh nhân và tiếp đón.
export const PATIENT_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER", "RECEPTION", "DOCTOR", "CASHIER"];
export const PATIENT_DELETE_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER"];

// Khám bệnh: bác sĩ (và Chủ).
export const EXAM_ROLES: Role[] = ["OWNER", "DOCTOR"];

// Thu ngân và bán thuốc lẻ.
export const CASHIER_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER", "CASHIER"];

// Báo cáo.
export const REPORT_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER"];

// Thủ thuật (điện châm, xoa bóp bấm huyệt, cấy chỉ, thủy châm): y sĩ / kỹ thuật viên thực hiện; bác sĩ và quản lý xem và làm được.
export const PROCEDURE_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER", "DOCTOR", "TECHNICIAN"];

// Phát thuốc.
export const DISPENSE_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER", "PHARMACIST"];

// Kho và giá.
export const STOCK_VIEW_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER", "PHARMACIST", "STOREKEEPER", "CASHIER", "DOCTOR"];
export const STOCK_WRITE_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER", "PHARMACIST", "STOREKEEPER"]; // nhập kho, điều chỉnh
export const ITEM_MANAGER_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER"]; // tạo mặt hàng, đặt giá, mức tối thiểu
export const COST_VIEW_ROLES: Role[] = ["OWNER", "BRANCH_MANAGER"]; // xem giá nhập

export function canAccessPath(role: string, pathname: string): boolean {
  const roles = parseRoles(role); // role có thể là nhiều vai trò, vd "DOCTOR,CASHIER"
  const under = (p: string) => pathname === p || pathname.startsWith(p + "/");
  if (under("/thu-ngan")) return hasAny(roles, CASHIER_ROLES);
  if (under("/bao-cao")) return hasAny(roles, REPORT_ROLES);
  if (under("/thu-thuat")) return hasAny(roles, PROCEDURE_ROLES);
  if (under("/duoc")) return hasAny(roles, DISPENSE_ROLES);
  if (under("/kham")) return hasAny(roles, EXAM_ROLES);
  if (under("/benh-nhan") || under("/tiep-don")) return hasAny(roles, PATIENT_ROLES);
  if (under("/kho/nhap") || under("/kho/dieu-chinh")) return hasAny(roles, STOCK_WRITE_ROLES);
  if (under("/kho")) return hasAny(roles, STOCK_VIEW_ROLES);
  if (OWNER_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return roles.includes("OWNER");
  }
  return true;
}
