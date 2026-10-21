import { allFields, fieldName, type TuChanData } from "@/lib/tuchan";

export const SAMPLE_NAME = "Lê Văn Mẫu (CA MẪU)";

// [mã mục, nhãn lựa chọn...]. Nhãn phải khớp danh mục tứ chẩn, sai là báo lỗi ngay.
type Pick = [string, ...string[]];

const PICKS: Pick[] = [
  // Vọng
  ["than_tong", "Còn thần (đắc thần)"],
  ["than_dau", "Mắt sáng, tinh anh, lanh lợi", "Nói năng bình thường", "Hơi thở điều hòa"],
  ["sac_chung", "Bình thường (hồng vàng ẩn, nhuận)"],
  ["sac_trach", "Tươi nhuận (thuận)"],
  ["hinh_the", "Thanh gọn"],
  ["hinh_tuthe", "Co ro, mặc nhiều áo, sợ lạnh"],
  ["mui", "Nghẹt, chảy nước trong"],
  ["hong", "Hồng nhạt, nhuận (bình thường)"],
  ["luoi_sac", "Hồng nhạt, nhuận (bình thường)"],
  ["luoi_hinh", "Thon chắc, mềm mại, linh hoạt (bình thường)"],
  ["luoi_reu", "Trắng"],
  ["luoi_reu_tc", "Mỏng", "Nhuận"],
  ["luoi_dich", "Bảo tồn"],
  // Văn
  ["tieng_noi", "Tiếng nặng đục (nghẹt mũi)"],
  ["hoi_tho", "Bình thường, đều"],
  ["mui_vi", "Không mùi bất thường"],
  // Vấn
  ["khoi_phat", "Đột ngột, cấp"],
  ["thoi_gian_benh", "Dưới 1 tuần"],
  ["yeu_to_khoi", "Gió lạnh, thay đổi thời tiết"],
  ["da_dieu_tri", "Chưa điều trị"],
  ["han_nhiet", "Sợ lạnh (ố hàn)", "Sợ gió", "Sốt nhẹ, ớn lạnh nhiều, không mồ hôi"],
  ["mo_hoi", "Không ra mồ hôi"],
  ["an_uong", "Ăn uống bình thường"],
  ["khat", "Không khát"],
  ["dai_tien", "Bình thường"],
  ["tieu_tien", "Bình thường"],
  ["kieu_dau", "Co thắt, co rút, tăng khi lạnh, giảm khi nóng"],
  ["yeu_to_dau", "Thiện án (xoa ấn dễ chịu)", "Giảm khi gặp nóng"],
  ["dau_dau", "Đau đầu vùng chẩm, cứng gáy"],
  ["dau_than", "Đau toàn thân buốt, sốt, ớn lạnh", "Đau cổ vai gáy"],
  ["giac_ngu", "Ngủ bình thường"],
  // Thiết
  ["mach_dk", "Đã nghỉ ngơi trước khi bắt mạch"],
  ["mach_tong", "Phù", "Khẩn"],
  ["mach_vl", "Hữu lực"],
  ["mach_nhip", "Đều"],
  ["mach_vikhi", "Có Vị khí, có thần, có căn (hòa hoãn, bộ xích trầm hữu lực)"],
  ["mach_tt", "Phù", "Khẩn"],
  ["mach_tq", "Phù", "Khẩn"],
  ["mach_tx", "Phù"],
  ["mach_ht", "Phù", "Khẩn"],
  ["mach_hq", "Phù"],
  ["mach_hx", "Phù"],
  ["p_sau", "Rất nông (phù)"],
  ["p_manh", "Trung bình"],
  ["p_cung", "Rất cứng, căng"],
  ["p_tron", "Trung bình"],
  ["p_tan", "Trung bình"],
  ["p_deu", "Đều"],
  ["p_thetich", "Trung bình"],
  ["p_dai", "Trung bình"],
  ["xuc_da", "Da khô táo", "Gân cơ căng như dây đàn"],
  ["xuc_chi", "Tay chân lạnh, sợ lạnh"],
  ["xuc_bung", "Bụng mềm"],
  ["xuc_huyet", "Có điểm đau A thị (ghi vị trí ở ghi chú)", "Co cứng cơ cạnh sống"],
];

// Ghi tay bổ sung theo từng mục (ví dụ cách dùng ô “Bổ sung ghi tay”).
const NOTES: Record<string, string> = {
  dau_than: "Đau mỏi cả hai bên vùng cổ vai gáy, quay cổ khó, tăng khi gặp gió lạnh",
  han_nhiet: "Nhiệt độ đo 37,6 °C; ớn lạnh rõ từ chiều hôm qua",
  xuc_huyet: "A thị: điểm đau và cứng ở cơ thang hai bên, cạnh huyệt Kiên tỉnh",
  tieng_noi: "Nói giọng mũi, nghẹt mũi nhẹ từ sáng hôm qua",
};

export function buildSampleTuChan(): string {
  const fields = new Map(allFields().map((f) => [f.key, f]));
  const out: TuChanData = {};
  for (const [key, ...labels] of PICKS) {
    const f = fields.get(key);
    if (!f) throw new Error(`Ca mẫu: không có mục ${key}`);
    const vs = labels.map((l) => {
      const o = f.opts.find((x) => x.label === l);
      if (!o) throw new Error(`Ca mẫu: mục ${key} không có lựa chọn “${l}”`);
      return o.v;
    });
    out[key] = { v: vs, ...(NOTES[key] ? { n: NOTES[key] } : {}) };
  }
  for (const [key, n] of Object.entries(NOTES)) if (!out[key]) out[key] = { v: [], n };
  return JSON.stringify(out);
}

export { fieldName };

export const SAMPLE_TEXT = {
  chiefComplaint: "Đau mỏi vai gáy, sợ lạnh, không ra mồ hôi 2 ngày",
  presentHistory:
    "Đầu tuần dầm mưa. Chiều hôm sau bắt đầu ớn lạnh, nhức đầu vùng chẩm, đau mỏi cổ vai gáy và đau mình, nghẹt mũi nhẹ, không ra mồ hôi, không khát. Ăn ngủ bình thường, đại tiểu tiện bình thường. Chưa dùng thuốc gì.",
  inspection: "Thể trạng thanh gọn, tinh thần tỉnh táo, co ro, mặc nhiều áo. Sắc mặt bình thường. Lưỡi hồng nhạt, rêu trắng mỏng nhuận.",
  listening: "Giọng nói hơi nghẹt mũi, hơi thở đều, không ho, không có mùi bất thường.",
  inquiry: "Sợ lạnh, sợ gió, sốt nhẹ, không ra mồ hôi, đau đầu vùng chẩm và đau cổ vai gáy, không khát, ăn ngủ và đại tiểu tiện bình thường.",
  palpation: "Mạch Phù Khẩn hữu lực, 78 lần/phút, đều. Da khô, không mồ hôi, tay chân lạnh. Cơ thang hai bên căng cứng, có điểm đau A thị.",
  modernDiagnosis: "Cảm lạnh (cảm mạo) kèm đau cơ vùng cổ vai gáy",
  advice:
    "Uống thuốc khi còn ấm, đắp chăn mỏng cho ra mồ hôi nhẹ rồi lau khô, ngưng thuốc khi đã ra mồ hôi. Giữ ấm cổ vai gáy, tránh gió lạnh, kiêng đồ sống lạnh, dầu mỡ nặng, rượu. Nghỉ ngơi. Tái khám sau 3 ngày hoặc khi có sốt cao, khó thở.",
};
