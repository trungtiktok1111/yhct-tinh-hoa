// Cấu hình chung cho sửa/xóa các mục tri thức. Dùng ở trang sửa và server action.
export type FieldDef = { name: string; label: string; long?: boolean; required?: boolean; int?: boolean };

export type EntityDef = {
  path: string; // đường dẫn trang (vd "benh-hoc")
  model: string; // tên model Prisma (camelCase)
  label: string; // tên hiển thị
  titleField: string;
  fields: FieldDef[];
  status: boolean; // có trạng thái thẩm định
  meta: boolean; // có version + updatedBy
  source: boolean; // có nguồn (sourceId)
};

const D = (e: EntityDef) => e;

export const ENTITIES: Record<string, EntityDef> = {
  "benh-hoc": D({
    path: "benh-hoc", model: "disease", label: "Bệnh học", titleField: "name", status: true, meta: true, source: true,
    fields: [
      { name: "name", label: "Tên bệnh", required: true },
      { name: "aliases", label: "Tên khác (phân tách bằng ;)" },
      { name: "nameModern", label: "Bệnh danh YHHĐ tương ứng" },
      { name: "category", label: "Phân loại" },
      { name: "definition", label: "Định nghĩa", long: true },
      { name: "cause", label: "Nguyên nhân", long: true },
      { name: "mechanism", label: "Bệnh cơ", long: true },
      { name: "symptoms", label: "Triệu chứng", long: true },
      { name: "differential", label: "Chẩn đoán phân biệt", long: true },
      { name: "warnings", label: "Cảnh báo / biến chứng", long: true },
    ],
  }),
  "chung-hau": D({
    path: "chung-hau", model: "pattern", label: "Chứng hậu", titleField: "name", status: true, meta: true, source: true,
    fields: [
      { name: "name", label: "Tên chứng hậu", required: true },
      { name: "description", label: "Mô tả", long: true },
      { name: "supportCriteria", label: "Tiêu chí ủng hộ", long: true },
      { name: "againstCriteria", label: "Tiêu chí không phù hợp", long: true },
      { name: "keySigns", label: "Dấu hiệu chính", long: true },
      { name: "missingDataPrompts", label: "Dữ kiện cần hỏi thêm", long: true },
    ],
  }),
  "phap-tri": D({
    path: "phap-tri", model: "treatmentPrinciple", label: "Pháp trị", titleField: "name", status: true, meta: true, source: true,
    fields: [
      { name: "name", label: "Tên pháp trị", required: true },
      { name: "aliases", label: "Tên khác" },
      { name: "description", label: "Mô tả", long: true },
      { name: "goal", label: "Mục tiêu", long: true },
      { name: "scope", label: "Tình huống áp dụng", long: true },
      { name: "limitations", label: "Giới hạn / lưu ý", long: true },
    ],
  }),
  "vi-thuoc": D({
    path: "vi-thuoc", model: "herb", label: "Vị thuốc", titleField: "standardName", status: true, meta: true, source: true,
    fields: [
      { name: "standardName", label: "Tên chuẩn", required: true },
      { name: "aliases", label: "Tên khác" },
      { name: "latinName", label: "Tên Latin" },
      { name: "family", label: "Họ" },
      { name: "partUsed", label: "Bộ phận dùng" },
      { name: "origin", label: "Xuất xứ" },
      { name: "botanicalDescription", label: "Đặc điểm thực vật / hình thái", long: true },
      { name: "distribution", label: "Phân bố", long: true },
      { name: "harvestProcessing", label: "Thu hái, sơ chế, bào chế", long: true },
      { name: "storage", label: "Bảo quản", long: true },
      { name: "chemicalComposition", label: "Thành phần hóa học", long: true },
      { name: "natureFlavor", label: "Tính vị" },
      { name: "meridians", label: "Quy kinh" },
      { name: "actions", label: "Công năng", long: true },
      { name: "indications", label: "Chủ trị", long: true },
      { name: "modernPharmacology", label: "Dược lý hiện đại", long: true },
      { name: "dosage", label: "Liều dùng" },
      { name: "safetyNotes", label: "Lưu ý an toàn", long: true },
      { name: "imageUrl", label: "Đường dẫn ảnh" },
    ],
  }),
  "bai-thuoc": D({
    path: "bai-thuoc", model: "formula", label: "Bài thuốc", titleField: "name", status: true, meta: true, source: true,
    fields: [
      { name: "name", label: "Tên bài thuốc", required: true },
      { name: "aliases", label: "Tên khác" },
      { name: "origin", label: "Xuất xứ (cổ phương / biến phương / kinh nghiệm...)" },
      { name: "indications", label: "Chủ trị", long: true },
      { name: "preparation", label: "Cách chế, cách dùng", long: true },
      { name: "modifications", label: "Gia giảm", long: true },
      { name: "safetyNotes", label: "Lưu ý an toàn", long: true },
    ],
  }),
  "cham-cuu": D({
    path: "cham-cuu", model: "acupuncturePoint", label: "Huyệt vị", titleField: "standardName", status: true, meta: true, source: true,
    fields: [
      { name: "code", label: "Mã huyệt (vd LI4)", required: true },
      { name: "standardName", label: "Tên huyệt", required: true },
      { name: "aliases", label: "Tên khác" },
      { name: "meridian", label: "Kinh" },
      { name: "location", label: "Vị trí", long: true },
      { name: "anatomyNotes", label: "Giải phẫu", long: true },
      { name: "actions", label: "Tác dụng", long: true },
      { name: "technique", label: "Kỹ thuật", long: true },
      { name: "contraindications", label: "Chống chỉ định", long: true },
      { name: "riskNotes", label: "Nguy cơ", long: true },
      { name: "imageUrl", label: "Đường dẫn ảnh" },
    ],
  }),
  "xoa-bop": D({
    path: "xoa-bop", model: "manualTherapy", label: "Thủ pháp xoa bóp", titleField: "name", status: true, meta: false, source: true,
    fields: [
      { name: "name", label: "Tên thủ pháp", required: true },
      { name: "techniqueType", label: "Loại kỹ thuật" },
      { name: "targetArea", label: "Vùng tác động" },
      { name: "sequence", label: "Trình tự", long: true },
      { name: "indications", label: "Chỉ định", long: true },
      { name: "contraindications", label: "Chống chỉ định", long: true },
      { name: "durationForce", label: "Thời gian, lực" },
      { name: "imageUrl", label: "Đường dẫn ảnh" },
    ],
  }),
  "ly-luan": D({
    path: "ly-luan", model: "theoryTopic", label: "Lý luận cơ bản", titleField: "name", status: true, meta: true, source: true,
    fields: [
      { name: "name", label: "Tên chủ đề", required: true },
      { name: "category", label: "Nhóm" },
      { name: "summary", label: "Tóm tắt", long: true },
      { name: "content", label: "Nội dung", long: true },
      { name: "keyPoints", label: "Điểm cần nhớ / ứng dụng", long: true },
    ],
  }),
  "thu-vien": D({
    path: "thu-vien", model: "source", label: "Tài liệu nguồn", titleField: "title", status: false, meta: false, source: false,
    fields: [
      { name: "title", label: "Tiêu đề", required: true },
      { name: "authorOrOrg", label: "Tác giả / tổ chức" },
      { name: "sourceType", label: "Loại tài liệu", required: true },
      { name: "year", label: "Năm", int: true },
      { name: "version", label: "Phiên bản / lần xuất bản" },
      { name: "publisherOrUrl", label: "Nhà xuất bản / đường dẫn" },
      { name: "locator", label: "Trang / chương" },
      { name: "usageRights", label: "Quyền sử dụng" },
    ],
  }),
  "ca-lam-sang": D({
    path: "ca-lam-sang", model: "clinicalCase", label: "Ca lâm sàng", titleField: "caseCode", status: false, meta: false, source: false,
    fields: [
      { name: "caseCode", label: "Mã ca", required: true },
      { name: "minimalIdentity", label: "Định danh tối thiểu (đã ẩn danh)" },
      { name: "history", label: "Bệnh sử", long: true },
      { name: "plan", label: "Kế hoạch điều trị", long: true },
      { name: "actualTreatment", label: "Điều trị thực tế", long: true },
      { name: "outcome", label: "Kết quả", long: true },
    ],
  }),
};

export function getEntity(key: string): EntityDef | undefined {
  return ENTITIES[key];
}
