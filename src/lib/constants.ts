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
  { href: "/", label: "Tổng quan", mobile: true },
  { href: "/benh-hoc", label: "Bệnh học", mobile: true },
  { href: "/chung-hau", label: "Chứng hậu", mobile: false },
  { href: "/phap-tri", label: "Pháp trị", mobile: false },
  { href: "/bai-thuoc", label: "Bài thuốc", mobile: true },
  { href: "/vi-thuoc", label: "Vị thuốc", mobile: false },
  { href: "/cham-cuu", label: "Châm cứu – Huyệt vị", mobile: false },
  { href: "/xoa-bop", label: "Xoa bóp – Bấm huyệt", mobile: false },
  { href: "/ca-lam-sang", label: "Ca lâm sàng", mobile: true },
  { href: "/thu-vien", label: "Thư viện tài liệu", mobile: false },
  { href: "/mang-tri-thuc", label: "Mạng lưới tri thức", mobile: false },
  { href: "/quan-tri", label: "Quản trị / Thẩm định", mobile: true },
];
