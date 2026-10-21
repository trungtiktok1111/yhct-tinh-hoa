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
  { href: "/benh-nhan", label: "Bệnh nhân", mobile: true, icon: "Users" },
  { href: "/kho", label: "Kho và giá", mobile: true, icon: "Package" },
  { href: "/quan-tri", label: "Quản trị / Thẩm định", mobile: true, icon: "ShieldCheck" },
] as const;
