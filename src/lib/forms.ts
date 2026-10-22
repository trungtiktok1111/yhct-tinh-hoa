import { COST_VIEW_ROLES, DISPENSE_ROLES, PATIENT_ROLES, REPORT_ROLES, STOCK_VIEW_ROLES, STOCK_WRITE_ROLES, type Role } from "@/lib/permissions";

// Danh mục biểu mẫu và báo cáo Excel của app. Đây là nơi duy nhất liệt kê chúng:
// trang "Biểu mẫu" và đường tải đều đọc từ đây, nên thêm một biểu mẫu mới chỉ cần thêm một dòng.
// kind "mau" = mẫu để điền rồi tải lên; "bao-cao" = file app xuất ra để xem, in, lưu.
export type FormDef = {
  id: string;
  group: "Kho" | "Doanh thu" | "Bệnh nhân" | "Hệ thống";
  kind: "mau" | "bao-cao";
  name: string;
  desc: string;
  cols: string; // các cột chính, để người dùng biết trước file có gì
  roles: Role[];
  period: boolean; // cần chọn kỳ (từ ngày, đến ngày)
  branch: boolean; // theo chi nhánh
  href: string; // đường tải; với route riêng đã có thì trỏ thẳng
  upload?: { href: string; label: string }; // nơi tải mẫu đã điền lên
  extra?: string; // ghi chú ngắn (vd: ai thấy cột giá vốn)
};

const ALL_STAFF: Role[] = ["OWNER", "BRANCH_MANAGER", "RECEPTION", "DOCTOR", "CASHIER", "PHARMACIST", "STOREKEEPER"];

export const FORMS: FormDef[] = [
  // ---- Kho ----
  { id: "phieu-nhap", group: "Kho", kind: "mau", name: "Phiếu nhập kho", desc: "Mẫu nhập hàng loạt. Điền các ô vàng, tải lên, app kiểm tra từng dòng rồi mới lưu. Có dòng trống để thêm mặt hàng mới (quản lý).", cols: "Mã hàng, Tên, ĐV gốc, Tồn, Số lượng nhập, Giá nhập, Hạn dùng, Nhà cung cấp, Số hóa đơn, Giá bán", roles: STOCK_WRITE_ROLES, period: false, branch: true, href: "/kho/nhap/excel/mau", upload: { href: "/kho/nhap/excel", label: "Tải phiếu đã điền lên" }, extra: "Dược liệu tính bằng gam ở mọi cột." },
  { id: "ton-kho", group: "Kho", kind: "bao-cao", name: "Báo cáo tồn kho hiện tại", desc: "Tồn từng mặt hàng, hạn gần nhất, giá trị tồn, trạng thái (hết hàng, dưới tối thiểu, gần hết hạn). Cùng file với phiếu nhập.", cols: "Mã, Tên, Loại, ĐVT, Tồn, Tối thiểu, Hạn gần nhất, Giá nhập TB, Giá trị tồn, Giá bán, Trạng thái", roles: STOCK_VIEW_ROLES, period: false, branch: true, href: "/kho/xuat", extra: "Cột giá vốn chỉ hiện với chủ và quản lý." },
  { id: "nxt", group: "Kho", kind: "bao-cao", name: "Báo cáo nhập – xuất – tồn và thẻ kho", desc: "Tổng hợp theo kỳ: tồn đầu, nhập, xuất, tồn cuối (số lượng, đơn giá, thành tiền) và thẻ kho từng mặt hàng theo mẫu S12-DN.", cols: "STT, Mã, Tên, ĐVT, Tồn đầu, Nhập, Xuất, Tồn cuối; thẻ kho có số chứng từ", roles: STOCK_VIEW_ROLES, period: true, branch: true, href: "/kho/nxt", extra: "Có chỗ ký người lập, thủ kho, kế toán trưởng." },
  { id: "lo-han-dung", group: "Kho", kind: "bao-cao", name: "Sổ lô hàng và hạn dùng", desc: "Từng lô còn hàng: ngày nhập, nhà cung cấp, hạn dùng, số còn lại, tình trạng hạn. Dùng để kiểm hạn và xử lý hàng sắp hết hạn.", cols: "Mã, Tên, Số phiếu, Ngày nhập, Nhà cung cấp, Hạn dùng, Còn lại, Giá nhập, Tình trạng", roles: STOCK_VIEW_ROLES, period: false, branch: true, href: "/bieu-mau/tai/lo-han-dung" },
  { id: "bang-gia", group: "Kho", kind: "bao-cao", name: "Danh mục mặt hàng và bảng giá", desc: "Toàn bộ mặt hàng đang bán với giá bán hiện tại và mức tồn tối thiểu. Dùng để in bảng giá hoặc đối chiếu.", cols: "Mã, Tên, Loại, ĐVT, Giá bán, Tồn tối thiểu, Giá nhập gần nhất", roles: STOCK_VIEW_ROLES, period: false, branch: true, href: "/bieu-mau/tai/bang-gia", extra: "Giá nhập chỉ hiện với chủ và quản lý." },
  { id: "nha-cung-cap", group: "Kho", kind: "bao-cao", name: "Danh sách nhà cung cấp", desc: "Nhà cung cấp, liên hệ và tổng giá trị đã nhập từ mỗi nơi.", cols: "Tên, Điện thoại, Địa chỉ, Số lô, Tổng giá trị nhập", roles: COST_VIEW_ROLES, period: false, branch: true, href: "/bieu-mau/tai/nha-cung-cap" },
  // ---- Doanh thu ----
  { id: "doanh-thu", group: "Doanh thu", kind: "bao-cao", name: "Báo cáo doanh thu theo ngày", desc: "Mỗi ngày một dòng: số hóa đơn, khám và bán lẻ, tiền mặt, chuyển khoản, thẻ, giảm giá, tổng thu.", cols: "Ngày, Số HĐ, Khám, Bán lẻ, Tiền mặt, Chuyển khoản, Thẻ, Giảm giá, Tổng thu", roles: REPORT_ROLES, period: true, branch: true, href: "/bieu-mau/tai/doanh-thu" },
  { id: "bang-ke-hd", group: "Doanh thu", kind: "bao-cao", name: "Bảng kê hóa đơn", desc: "Từng hóa đơn đã thu trong kỳ, kèm hình thức thanh toán và người thu.", cols: "Số HĐ, Ngày giờ, Bệnh nhân, Loại, Tổng tiền, Hình thức, Người thu", roles: REPORT_ROLES, period: true, branch: true, href: "/bieu-mau/tai/bang-ke-hd" },
  { id: "ban-theo-mat-hang", group: "Doanh thu", kind: "bao-cao", name: "Doanh số theo mặt hàng", desc: "Mỗi vị thuốc, thành phẩm bán được bao nhiêu, thu bao nhiêu trong kỳ.", cols: "Mã, Tên, ĐVT, Số lượng bán, Thành tiền, Số hóa đơn", roles: REPORT_ROLES, period: true, branch: true, href: "/bieu-mau/tai/ban-theo-mat-hang" },
  // ---- Bệnh nhân ----
  { id: "so-kham", group: "Bệnh nhân", kind: "bao-cao", name: "Sổ khám bệnh theo kỳ", desc: "Từng lượt khám: số thứ tự, bệnh nhân, bác sĩ, lý do khám, trạng thái.", cols: "Ngày, STT, Mã BN, Họ tên, Bác sĩ, Lý do khám, Trạng thái", roles: PATIENT_ROLES, period: true, branch: true, href: "/bieu-mau/tai/so-kham" },
  { id: "ds-benh-nhan", group: "Bệnh nhân", kind: "bao-cao", name: "Danh sách bệnh nhân", desc: "Hồ sơ hành chính của bệnh nhân. Chỉ chủ, quản lý và lễ tân được tải vì có thông tin cá nhân.", cols: "Mã BN, Họ tên, Giới, Ngày sinh, Điện thoại, Địa chỉ, Ngày tạo", roles: ["OWNER", "BRANCH_MANAGER", "RECEPTION"], period: false, branch: false, href: "/bieu-mau/tai/ds-benh-nhan", extra: "Ghi nhật ký mỗi lần tải." },
  // ---- Hệ thống ----
  { id: "nhat-ky", group: "Hệ thống", kind: "bao-cao", name: "Nhật ký thao tác", desc: "Ai làm gì, lúc nào trong kỳ (đăng nhập, nhập kho, đổi giá, xóa...).", cols: "Thời gian, Người dùng, Hành động, Đối tượng, Chi tiết", roles: ["OWNER"], period: true, branch: false, href: "/bieu-mau/tai/nhat-ky" },
];

export const GROUPS: FormDef["group"][] = ["Kho", "Doanh thu", "Bệnh nhân", "Hệ thống"];
export const formById = (id: string) => FORMS.find((f) => f.id === id);
export { ALL_STAFF };
