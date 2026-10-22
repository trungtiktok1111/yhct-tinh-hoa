export const REVIEW_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Bản nháp",
  PENDING_REVIEW: "Chờ thẩm định",
  NEEDS_REVISION: "Yêu cầu chỉnh sửa",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  RETIRED: "Ngừng áp dụng",
};

export const REVIEW_STATUS_OPTIONS = Object.keys(REVIEW_STATUS_LABEL);

export const NAV_ITEMS = [
  { href: "/", label: "Tổng quan", mobile: true, icon: "LayoutDashboard" },
  { href: "/ly-luan", label: "Lý luận cơ bản", mobile: false, icon: "ScrollText" },
  { href: "/benh-hoc", label: "Bệnh học", mobile: false, icon: "Stethoscope" },
  { href: "/chung-hau", label: "Chứng hậu", mobile: false, icon: "Fingerprint" },
  { href: "/phap-tri", label: "Pháp trị", mobile: false, icon: "Compass" },
  { href: "/bai-thuoc", label: "Bài thuốc", mobile: false, icon: "FlaskConical" },
  { href: "/vi-thuoc", label: "Vị thuốc", mobile: false, icon: "Leaf" },
  { href: "/cham-cuu", label: "Châm cứu – Huyệt vị", mobile: false, icon: "Target" },
  { href: "/xoa-bop", label: "Xoa bóp – Bấm huyệt", mobile: false, icon: "Hand" },
  { href: "/ca-lam-sang", label: "Ca lâm sàng", mobile: false, icon: "ClipboardList" },
  { href: "/thu-vien", label: "Thư viện tài liệu", mobile: false, icon: "BookOpen" },
  { href: "/mang-tri-thuc", label: "Mạng lưới tri thức", mobile: false, icon: "Network" },
  { href: "/tiep-don", label: "Tiếp đón", mobile: true, icon: "ClipboardCheck" },
  { href: "/kham", label: "Khám bệnh", mobile: true, icon: "HeartPulse" },
  { href: "/thu-ngan", label: "Thu ngân", mobile: true, icon: "Wallet" },
  { href: "/duoc", label: "Phát thuốc", mobile: true, icon: "Pill" },
  { href: "/bao-cao", label: "Báo cáo", mobile: true, icon: "BarChart3" },
  { href: "/benh-nhan", label: "Bệnh nhân", mobile: true, icon: "Users" },
  { href: "/kho", label: "Kho và giá", mobile: true, icon: "Package" },
  { href: "/quan-tri", label: "Quản trị / Thẩm định", mobile: true, icon: "ShieldCheck" },
] as const;

// Menu mới: tách hẳn vận hành phòng khám và tra cứu y học.
export type NavLink = { href: string; label: string; icon: string };
export const CLINIC_NAV: NavLink[] = [
  { href: "/", label: "Tổng quan", icon: "LayoutDashboard" },
  { href: "/tiep-don", label: "Tiếp đón", icon: "ClipboardCheck" },
  { href: "/benh-nhan", label: "Bệnh nhân", icon: "Users" },
  { href: "/kham", label: "Khám bệnh", icon: "HeartPulse" },
  { href: "/thu-ngan", label: "Thu ngân", icon: "Wallet" },
  { href: "/thu-thuat", label: "Thủ thuật", icon: "Syringe" },
  { href: "/duoc", label: "Phát thuốc", icon: "Pill" },
  { href: "/kho", label: "Kho và giá", icon: "Package" },
  { href: "/bao-cao", label: "Báo cáo", icon: "BarChart3" },
  { href: "/bieu-mau", label: "Biểu mẫu", icon: "FileSpreadsheet" },
];
export const KNOWLEDGE_NAV: NavLink[] = [
  { href: "/ly-luan", label: "Lý luận cơ bản", icon: "ScrollText" },
  { href: "/benh-hoc", label: "Bệnh học", icon: "Stethoscope" },
  { href: "/chung-hau", label: "Chứng hậu", icon: "Fingerprint" },
  { href: "/phap-tri", label: "Pháp trị", icon: "Compass" },
  { href: "/bai-thuoc", label: "Bài thuốc", icon: "FlaskConical" },
  { href: "/vi-thuoc", label: "Vị thuốc", icon: "Leaf" },
  { href: "/cham-cuu", label: "Châm cứu – Huyệt vị", icon: "Target" },
  { href: "/xoa-bop", label: "Xoa bóp – Bấm huyệt", icon: "Hand" },
  { href: "/ca-lam-sang", label: "Ca lâm sàng", icon: "ClipboardList" },
  { href: "/thu-vien", label: "Thư viện tài liệu", icon: "BookOpen" },
  { href: "/mang-tri-thuc", label: "Mạng lưới tri thức", icon: "Network" },
];
export const ADMIN_NAV: NavLink[] = [{ href: "/quan-tri", label: "Quản trị", icon: "ShieldCheck" }];

export const ADMIN_SUB: NavLink[] = [
  { href: "/quan-tri", label: "Thẩm định nội dung", icon: "ClipboardCheck" },
  { href: "/quan-tri/chi-nhanh", label: "Quản lý chi nhánh", icon: "Building2" },
  { href: "/quan-tri/nhan-vien", label: "Nhân viên & phân quyền", icon: "UserCog" },
  { href: "/quan-tri/nhat-ky", label: "Nhật ký thao tác", icon: "ScrollText" },
  { href: "/quan-tri/sao-luu", label: "Sao lưu dữ liệu", icon: "DatabaseBackup" },
  { href: "/quan-tri/cau-hinh", label: "Cấu hình hệ thống", icon: "Settings" },
];

// Đơn vị của thành phẩm trong kho (dược liệu luôn tính bằng g).
export const UNITS = ["viên", "hộp", "chai", "lọ", "gói", "túi", "tuýp"];
