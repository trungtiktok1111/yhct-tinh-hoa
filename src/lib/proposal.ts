import { allFields, type TuChanData } from "@/lib/tuchan";

// Đề xuất từ tứ chẩn: bộ quy tắc biện chứng đơn giản theo dấu hiệu đã tích.
// Chỉ là gợi ý để bác sĩ duyệt và sửa. Không chấm điểm phần trăm. Nội dung là DEMO, cần chuyên gia hiệu chỉnh.

type Sig = { key: string; v: string; label: string };

const FIELDS = new Map(allFields().map((f) => [f.key, f]));
function S(key: string, ...labels: string[]): Sig[] {
  const f = FIELDS.get(key);
  if (!f) throw new Error(`Đề xuất: không có mục ${key}`);
  return labels.map((label) => {
    const o = f.opts.find((x) => x.label === label);
    if (!o) throw new Error(`Đề xuất: mục ${key} không có “${label}”`);
    return { key, v: o.v, label };
  });
}

export type Herb = { n: string; g: number; note?: string; alt?: string[] };
export type PatternRule = {
  key: string;
  pattern: string; // chứng hậu
  disease: string; // bệnh danh gợi ý
  cuong: { exteriorInterior?: "BIEU" | "LY"; coldHeat?: "HAN" | "NHIET"; deficiencyExcess?: "HU" | "THUC"; yinYang?: "AM" | "DUONG" };
  methods: string[]; // bát pháp
  principle: string; // pháp trị
  formula: string;
  herbs: Herb[];
  thang: number;
  decoction: string;
  modifications?: string;
  points: [string, string][]; // [nhãn huyệt, ghi chú]
  therapy: [string, string][];
  advice: string;
  followUpDays: number;
  core: Sig[];
  support: Sig[];
  against: Sig[];
};

const R: PatternRule[] = [
  {
    key: "phong_han_bieu_thuc", pattern: "Thái dương thương hàn (biểu thực)", disease: "Cảm mạo",
    cuong: { exteriorInterior: "BIEU", coldHeat: "HAN", deficiencyExcess: "THUC", yinYang: "DUONG" },
    methods: ["Hãn"], principle: "Tân ôn giải biểu", formula: "Ma hoàng thang", thang: 3,
    herbs: [
      { n: "Ma hoàng", g: 9, note: "Quân. Sắc trước, vớt bọt" }, { n: "Quế chi", g: 6, note: "Thần" },
      { n: "Hạnh nhân", g: 9, note: "Tá. Đập dập" }, { n: "Cam thảo (chích)", g: 3, note: "Sứ", alt: ["Cam thảo", "Chích cam thảo"] },
    ],
    decoction: "Sắc Ma hoàng trước 10 phút, vớt bọt, cho các vị còn lại vào sắc. Uống ấm, ngày 1 thang chia 2 lần. Ra mồ hôi thì ngưng.",
    modifications: "Cứng gáy lưng nhiều: thêm Cát căn 12 g hoặc dùng Cát căn thang. Ngạt mũi nhiều: thêm Tân di 6 g.",
    points: [["GB20 — Phong trì", "Châm tả, giải biểu, trị đau gáy"], ["LI4 — Hợp cốc", "Châm tả, phối hợp giải biểu"], ["LU7 — Liệt khuyết", "Giải biểu, tuyên Phế"], ["BL12 — Phong môn", "Khu phong, giải biểu"]],
    therapy: [["Xoa bóp vùng cổ vai gáy", "10 phút, ấn, day, bóp, làm ấm trước khi xoa"]],
    advice: "Uống thuốc khi còn ấm, đắp chăn mỏng cho ra mồ hôi nhẹ rồi lau khô, ngưng thuốc khi đã ra mồ hôi. Giữ ấm cổ vai gáy, tránh gió lạnh. Kiêng đồ sống lạnh, dầu mỡ nặng, rượu. Nghỉ ngơi. Tái khám khi sốt cao, khó thở hoặc không đỡ sau 3 ngày.",
    followUpDays: 3,
    core: [...S("han_nhiet", "Sợ lạnh (ố hàn)", "Sốt nhẹ, ớn lạnh nhiều, không mồ hôi"), ...S("mo_hoi", "Không ra mồ hôi"), ...S("mach_tong", "Phù", "Khẩn"), ...S("luoi_reu", "Trắng")],
    support: [...S("han_nhiet", "Sợ gió", "Phát sốt"), ...S("luoi_reu_tc", "Mỏng"), ...S("mui", "Nghẹt, chảy nước trong"), ...S("dau_dau", "Đau đầu vùng chẩm, cứng gáy"), ...S("dau_than", "Đau toàn thân buốt, sốt, ớn lạnh", "Đau cổ vai gáy"), ...S("khat", "Không khát"), ...S("khoi_phat", "Đột ngột, cấp"), ...S("yeu_to_khoi", "Gió lạnh, thay đổi thời tiết")],
    against: [...S("mo_hoi", "Có mồ hôi, sợ lạnh, phát sốt", "Tự hãn (ra mồ hôi tự nhiên, ban ngày)"), ...S("han_nhiet", "Sợ nóng"), ...S("luoi_reu", "Vàng"), ...S("mach_tong", "Sác")],
  },
  {
    key: "phong_han_bieu_hu", pattern: "Thái dương trúng phong (biểu hư, vinh vệ bất hòa)", disease: "Cảm mạo",
    cuong: { exteriorInterior: "BIEU", coldHeat: "HAN", deficiencyExcess: "HU", yinYang: "DUONG" },
    methods: ["Hãn", "Hòa"], principle: "Giải cơ phát biểu, điều hòa vinh vệ", formula: "Quế chi thang", thang: 3,
    herbs: [
      { n: "Quế chi", g: 9, note: "Quân" }, { n: "Bạch thược", g: 9, note: "Thần", alt: ["Thược dược"] }, { n: "Sinh khương", g: 9, note: "Tá" },
      { n: "Đại táo", g: 12, note: "Tá" }, { n: "Cam thảo (chích)", g: 6, note: "Sứ", alt: ["Cam thảo", "Chích cam thảo"] },
    ],
    decoction: "Sắc uống ấm, sau uống một chén cháo nóng, đắp chăn nhẹ cho người ấm lên, ra mồ hôi nhẹ là tốt. Ngày 1 thang chia 2 lần.",
    points: [["GB20 — Phong trì", "Khu phong, giải biểu"], ["BL12 — Phong môn", "Khu phong"], ["LI4 — Hợp cốc", "Giải biểu"], ["ST36 — Túc tam lý", "Bổ khí, hòa vinh vệ (châm bổ)"]],
    therapy: [],
    advice: "Uống thuốc ấm, ăn cháo nóng sau uống thuốc, tránh gió. Kiêng đồ sống lạnh, dầu mỡ, rượu, đồ tanh. Không dùng khi không ra mồ hôi. Tái khám sau 3 ngày hoặc khi sốt cao.",
    followUpDays: 3,
    core: [...S("mo_hoi", "Có mồ hôi, sợ lạnh, phát sốt"), ...S("han_nhiet", "Sợ gió"), ...S("mach_tong", "Phù", "Hoãn")],
    support: [...S("han_nhiet", "Phát sốt"), ...S("mui", "Nghẹt, chảy nước trong"), ...S("khoi_phat", "Đột ngột, cấp"), ...S("yeu_to_khoi", "Gió lạnh, thay đổi thời tiết")],
    against: [...S("mo_hoi", "Không ra mồ hôi"), ...S("mach_tong", "Khẩn"), ...S("han_nhiet", "Sợ nóng")],
  },
  {
    key: "phong_nhiet", pattern: "Phong nhiệt phạm biểu", disease: "Cảm mạo",
    cuong: { exteriorInterior: "BIEU", coldHeat: "NHIET", deficiencyExcess: "THUC", yinYang: "DUONG" },
    methods: ["Hãn", "Thanh"], principle: "Tân lương giải biểu, thanh nhiệt giải độc", formula: "Ngân kiều tán", thang: 3,
    herbs: [
      { n: "Kim ngân hoa", g: 12 }, { n: "Liên kiều", g: 12 }, { n: "Cát cánh", g: 6 }, { n: "Bạc hà", g: 6, note: "Cho sau" },
      { n: "Trúc diệp", g: 4 }, { n: "Cam thảo", g: 5, alt: ["Cam thảo (chích)"] }, { n: "Kinh giới", g: 5 }, { n: "Đạm đậu xị", g: 5 },
      { n: "Ngưu bàng tử", g: 9 }, { n: "Lô căn", g: 15 },
    ],
    decoction: "Sắc nhanh (không quá 15 phút), cho Bạc hà sau. Uống ấm, ngày 1 thang chia 2 đến 3 lần.",
    points: [["GV14 — Đại chùy", "Thanh nhiệt, giải biểu"], ["LI11 — Khúc trì", "Thanh nhiệt"], ["LI4 — Hợp cốc", "Giải biểu"], ["LU11 — Thiếu thương", "Chích nặn máu nếu họng sưng đau"]],
    therapy: [],
    advice: "Uống nhiều nước ấm, ăn nhẹ, kiêng cay nóng, rượu, đồ chiên rán. Nghỉ ngơi, giữ họng sạch. Tái khám khi sốt cao kéo dài, khó thở hoặc không đỡ sau 3 ngày.",
    followUpDays: 3,
    core: [...S("han_nhiet", "Phát sốt", "Sốt nặng, ớn lạnh nhẹ, có mồ hôi"), ...S("hong", "Sưng đỏ đau cấp"), ...S("mach_tong", "Phù", "Sác"), ...S("luoi_reu", "Trắng chuyển vàng")],
    support: [...S("khat", "Khát, uống nhiều, thích nước lạnh"), ...S("mui", "Nghẹt, chảy nước đục"), ...S("ho", "Ho khản đặc, đàm vàng dính, họng khô đau"), ...S("han_nhiet", "Sợ gió"), ...S("luoi_sac", "Đỏ")],
    against: [...S("han_nhiet", "Sợ lạnh (ố hàn)"), ...S("mo_hoi", "Không ra mồ hôi"), ...S("luoi_reu", "Trắng")],
  },
  {
    key: "can_khi_uat", pattern: "Can khí uất kết", disease: "Uất chứng (khí trệ)",
    cuong: { exteriorInterior: "LY", deficiencyExcess: "THUC" },
    methods: ["Hòa"], principle: "Sơ Can giải uất, lý khí", formula: "Sài hồ sơ Can tán", thang: 7,
    herbs: [
      { n: "Sài hồ", g: 6 }, { n: "Xuyên khung", g: 5 }, { n: "Hương phụ", g: 5 }, { n: "Chỉ xác", g: 5 },
      { n: "Bạch thược", g: 9, alt: ["Thược dược"] }, { n: "Trần bì", g: 6 }, { n: "Cam thảo (chích)", g: 3, alt: ["Cam thảo", "Chích cam thảo"] },
    ],
    decoction: "Sắc uống ấm, ngày 1 thang chia 2 lần, uống sau ăn.",
    points: [["LR3 — Thái xung", "Sơ Can, châm tả"], ["PC6 — Nội quan", "Lý khí, giải uất ngực sườn"], ["GB34 — Dương lăng tuyền", "Sơ Can Đởm"], ["LR14 — Kỳ môn", "Sơ Can, hòa vị"]],
    therapy: [["Day ấn vùng hạ sườn và lưng", "Nhẹ nhàng, 10 đến 15 phút"]],
    advice: "Giữ tinh thần thoải mái, tránh căng thẳng và cáu giận. Vận động nhẹ đều đặn, ngủ đúng giờ. Kiêng rượu, đồ cay nóng, chiên rán. Tái khám sau 1 tuần.",
    followUpDays: 7,
    core: [...S("mach_tong", "Huyền"), ...S("khi_nghich", "Thở dài"), ...S("cam_xuc", "Tức giận", "Lo lắng, suy nghĩ nhiều"), ...S("nguc", "Đau sườn dưới")],
    support: [...S("dau_dau", "Đau một bên đầu"), ...S("kinh_tinh", "Màu thẫm, có cục, đau trước hành kinh"), ...S("giac_ngu", "Mất ngủ, nhiều mộng, đau đầu, miệng đắng, cáu"), ...S("vi_giac", "Đắng miệng"), ...S("nguc", "Tức ngực")],
    against: [...S("mach_tong", "Nhược")],
  },
  {
    key: "ty_khi_hu", pattern: "Tỳ khí hư", disease: "Tỳ vị hư nhược",
    cuong: { exteriorInterior: "LY", coldHeat: "HAN", deficiencyExcess: "HU", yinYang: "AM" },
    methods: ["Bổ"], principle: "Kiện Tỳ ích khí", formula: "Tứ quân tử thang", thang: 7,
    herbs: [
      { n: "Đảng sâm", g: 12, note: "Quân", alt: ["Nhân sâm"] }, { n: "Bạch truật", g: 9, note: "Thần" }, { n: "Phục linh", g: 9, note: "Tá" },
      { n: "Cam thảo (chích)", g: 6, note: "Sứ", alt: ["Cam thảo", "Chích cam thảo"] },
    ],
    decoction: "Sắc uống ấm, ngày 1 thang chia 2 lần, uống trước ăn.",
    modifications: "Đầy bụng, đờm thấp: thêm Trần bì 6 g, Bán hạ chế 9 g (Lục quân tử thang).",
    points: [["ST36 — Túc tam lý", "Bổ khí kiện Tỳ"], ["SP6 — Tam âm giao", "Kiện Tỳ"], ["CV12 — Trung quản", "Hòa Vị, có thể cứu"], ["BL20 — Tỳ du", "Bổ Tỳ"]],
    therapy: [["Xoa bóp bụng và day huyệt Túc tam lý", "10 đến 15 phút, thuận chiều kim đồng hồ"]],
    advice: "Ăn chín uống ấm, chia nhỏ bữa, nhai kỹ. Kiêng đồ sống lạnh, béo ngọt, rượu. Vận động nhẹ, ngủ đủ. Tái khám sau 2 tuần.",
    followUpDays: 14,
    core: [...S("an_uong", "Chán ăn", "Bệnh lâu, ăn kém"), ...S("dai_tien", "Phân sống, nhão, không tiêu", "Tiêu chảy mạn"), ...S("luoi_hinh", "Có dấu ấn răng", "Phù nề, bệu"), ...S("luoi_sac", "Nhợt"), ...S("mach_tong", "Nhược", "Hoãn", "Hư")],
    support: [...S("giac_ngu", "Ngủ nhiều, mệt, chi mỏi", "Ăn xong uể oải muốn ngủ"), ...S("met_moi", "Muốn nằm, chán ăn, phân lỏng"), ...S("hoi_chi", "Nặng mỏi chi"), ...S("sac_chitiet", "Vàng nhạt, gầy ốm"), ...S("bung", "Đầy trướng bụng")],
    against: [...S("mach_tong", "Thực"), ...S("luoi_reu", "Vàng")],
  },
  {
    key: "than_duong_hu", pattern: "Thận dương hư", disease: "Yêu thống (đau lưng do Thận hư)",
    cuong: { exteriorInterior: "LY", coldHeat: "HAN", deficiencyExcess: "HU", yinYang: "AM" },
    methods: ["Bổ", "Ôn"], principle: "Ôn bổ Thận dương", formula: "Kim quỹ Thận khí hoàn (dạng thang)", thang: 14,
    herbs: [
      { n: "Thục địa", g: 24 }, { n: "Hoài sơn", g: 12 }, { n: "Sơn thù", g: 12 }, { n: "Trạch tả", g: 9 },
      { n: "Phục linh", g: 9 }, { n: "Mẫu đơn bì", g: 9 }, { n: "Quế chi", g: 3 }, { n: "Phụ tử chế", g: 3, note: "Sắc trước 30 đến 60 phút. Bác sĩ cân nhắc kỹ" },
    ],
    decoction: "Sắc uống ấm, ngày 1 thang chia 2 lần. Phụ tử chế sắc trước.",
    points: [["BL23 — Thận du", "Bổ Thận, có thể cứu"], ["GV4 — Mệnh môn", "Ôn bổ Thận dương, cứu"], ["KI3 — Thái khê", "Bổ Thận"], ["CV4 — Quan nguyên", "Cứu ấm hạ tiêu"]],
    therapy: [["Xoa bóp ấm vùng thắt lưng", "10 đến 15 phút, có thể kết hợp cứu ngải"]],
    advice: "Giữ ấm lưng và chân, tránh lạnh ẩm. Ăn ấm, hạn chế đồ sống lạnh. Không thức khuya, tránh lao lực. Tái khám sau 2 tuần.",
    followUpDays: 14,
    core: [...S("dau_than", "Đau lưng", "Mỏi gối"), ...S("han_nhiet", "Tay chân lạnh", "Sợ lạnh (ố hàn)"), ...S("tieu_tien", "Tiểu đêm nhiều, tiểu dầm, không tự chủ", "Tiểu nhiều lần, trong"), ...S("luoi_sac", "Nhợt"), ...S("mach_tong", "Trầm", "Trì", "Nhược")],
    support: [...S("tinh_duc", "Giảm libido", "Liệt dương"), ...S("met_moi", "Đau lưng, sợ lạnh, tiểu nhiều lần"), ...S("dai_tien", "Ngũ canh tả (tiêu chảy gần sáng)"), ...S("hoi_chi", "Yếu gối", "Lạnh chân")],
    against: [...S("han_nhiet", "Sợ nóng", "Ngũ tâm phiền nhiệt"), ...S("luoi_sac", "Đỏ")],
  },
  {
    key: "am_hu_noi_nhiet", pattern: "Can Thận âm hư (âm hư nội nhiệt)", disease: "Âm hư nội nhiệt",
    cuong: { exteriorInterior: "LY", coldHeat: "NHIET", deficiencyExcess: "HU", yinYang: "AM" },
    methods: ["Bổ", "Thanh"], principle: "Tư bổ Can Thận âm", formula: "Lục vị địa hoàng hoàn (dạng thang)", thang: 14,
    herbs: [
      { n: "Thục địa", g: 24 }, { n: "Sơn thù", g: 12 }, { n: "Hoài sơn", g: 12 }, { n: "Trạch tả", g: 9 }, { n: "Phục linh", g: 9 }, { n: "Mẫu đơn bì", g: 9 },
    ],
    decoction: "Sắc uống ấm, ngày 1 thang chia 2 lần.",
    points: [["KI3 — Thái khê", "Bổ Thận âm"], ["SP6 — Tam âm giao", "Dưỡng âm"], ["BL23 — Thận du", "Bổ Thận"], ["HT7 — Thần môn", "An thần nếu mất ngủ"]],
    therapy: [],
    advice: "Ngủ đủ, tránh thức khuya. Uống đủ nước, hạn chế cay nóng, rượu, cà phê. Giữ tinh thần ổn định. Tái khám sau 2 tuần.",
    followUpDays: 14,
    core: [...S("han_nhiet", "Ngũ tâm phiền nhiệt", "Sốt nhẹ về chiều (triều nhiệt)", "Cốt chưng nhiệt"), ...S("mo_hoi", "Đạo hãn (mồ hôi trộm)"), ...S("luoi_sac", "Đỏ"), ...S("luoi_reu", "Không rêu"), ...S("mach_tong", "Tế", "Sác")],
    support: [...S("met_moi", "Lo lắng, khô miệng về đêm, lưỡi không rêu"), ...S("giac_ngu", "Thức nhiều lần, mơ nhiều, đạo hãn, hồi hộp"), ...S("tieu_tien", "Tiểu sậm màu"), ...S("luoi_hinh", "Nứt nẻ"), ...S("hinh_the", "Suy nhược (gầy, da khô)")],
    against: [...S("luoi_reu", "Trắng"), ...S("han_nhiet", "Sợ lạnh (ố hàn)"), ...S("luoi_sac", "Nhợt")],
  },
  {
    key: "phong_han_thap_ty", pattern: "Phong hàn thấp tý", disease: "Tý chứng (đau khớp)",
    cuong: { exteriorInterior: "BIEU", coldHeat: "HAN", deficiencyExcess: "THUC", yinYang: "AM" },
    methods: ["Hãn", "Ôn"], principle: "Khu phong tán hàn trừ thấp, thông lạc chỉ thống", formula: "Quyên tý thang", thang: 7,
    herbs: [
      { n: "Khương hoạt", g: 9 }, { n: "Khương hoàng", g: 9 }, { n: "Phòng phong", g: 9 }, { n: "Đương quy", g: 9 }, { n: "Hoàng kỳ", g: 9 },
      { n: "Xích thược", g: 9, alt: ["Thược dược"] }, { n: "Cam thảo (chích)", g: 3, alt: ["Cam thảo", "Chích cam thảo"] }, { n: "Sinh khương", g: 5 },
    ],
    decoction: "Sắc uống ấm, ngày 1 thang chia 2 lần, uống sau ăn.",
    points: [["Điểm A thị tại chỗ đau", "Châm hoặc cứu ấm tại chỗ"], ["ST36 — Túc tam lý", "Bổ khí huyết"], ["GB34 — Dương lăng tuyền", "Gân hội, thư cân"], ["GB20 — Phong trì", "Khu phong (nếu đau vùng cổ vai)"]],
    therapy: [["Xoa bóp ấm vùng khớp đau", "10 đến 15 phút, kết hợp chườm nóng"]],
    advice: "Giữ ấm vùng khớp, tránh gió lạnh và ẩm ướt. Vận động nhẹ nhàng, không gắng sức. Kiêng đồ sống lạnh. Tái khám sau 1 tuần.",
    followUpDays: 7,
    core: [...S("kieu_dau", "Co thắt, co rút, tăng khi lạnh, giảm khi nóng", "Nặng nề, ê ẩm"), ...S("yeu_to_dau", "Giảm khi gặp nóng"), ...S("dau_than", "Đau khớp, cơ bắp, tê bại, cố định hoặc di chuyển"), ...S("hoi_chi", "Đau khớp", "Nặng mỏi chi"), ...S("mach_tong", "Huyền", "Khẩn")],
    support: [...S("luoi_reu", "Trắng"), ...S("luoi_reu_tc", "Nhờn"), ...S("han_nhiet", "Sợ lạnh (ố hàn)"), ...S("yeu_to_khoi", "Gió lạnh, thay đổi thời tiết"), ...S("hinh_tuthe", "Khớp sưng đau, khó vận động")],
    against: [...S("chi", "Khớp sưng nóng đỏ"), ...S("han_nhiet", "Sợ nóng")],
  },
  {
    key: "vi_han", pattern: "Vị hàn (hàn tà phạm Vị)", disease: "Vị quản thống (đau dạ dày do hàn)",
    cuong: { exteriorInterior: "LY", coldHeat: "HAN", deficiencyExcess: "HU", yinYang: "AM" },
    methods: ["Ôn", "Bổ"], principle: "Ôn trung tán hàn, kiện Tỳ", formula: "Lý trung thang", thang: 5,
    herbs: [
      { n: "Đảng sâm", g: 9, alt: ["Nhân sâm"] }, { n: "Can khương", g: 9 }, { n: "Bạch truật", g: 9 }, { n: "Cam thảo (chích)", g: 9, alt: ["Cam thảo", "Chích cam thảo"] },
    ],
    decoction: "Sắc uống ấm, ngày 1 thang chia 2 đến 3 lần, uống lúc đau hoặc trước ăn.",
    points: [["CV12 — Trung quản", "Ôn Vị, có thể cứu"], ["ST36 — Túc tam lý", "Hòa Vị"], ["PC6 — Nội quan", "Giảm đau, chống nôn"], ["ST25 — Thiên khu", "Điều trường vị (nếu kèm tiêu chảy)"]],
    therapy: [["Chườm ấm và xoa bụng", "10 phút, thuận chiều kim đồng hồ"]],
    advice: "Ăn chín uống ấm, tránh đồ sống lạnh, giữ ấm bụng. Ăn đúng giờ, chia nhỏ bữa. Kiêng rượu, đồ cay, chua nhiều. Tái khám sau 1 tuần hoặc ngay khi đau dữ dội, nôn ra máu hoặc đi cầu phân đen.",
    followUpDays: 7,
    core: [...S("bung", "Đau bụng trên, nôn nước trong, gặp lạnh đau dữ"), ...S("yeu_to_dau", "Thiện án (xoa ấn dễ chịu)", "Giảm khi gặp nóng"), ...S("vi_giac", "Nôn nước trong"), ...S("an_uong", "Thích ăn uống nóng"), ...S("mach_tong", "Trì", "Khẩn", "Trầm")],
    support: [...S("han_nhiet", "Tay chân lạnh"), ...S("khat", "Thích uống nước ấm"), ...S("luoi_reu", "Trắng"), ...S("dai_tien", "Phân sống, nhão, không tiêu")],
    against: [...S("an_uong", "Thích ăn uống mát lạnh"), ...S("luoi_reu", "Vàng")],
  },
  {
    key: "tam_ty_hu", pattern: "Tâm Tỳ lưỡng hư (mất ngủ)", disease: "Bất mị (mất ngủ)",
    cuong: { exteriorInterior: "LY", deficiencyExcess: "HU", yinYang: "AM" },
    methods: ["Bổ"], principle: "Ích khí bổ huyết, kiện Tỳ dưỡng Tâm an thần", formula: "Quy Tỳ thang", thang: 7,
    herbs: [
      { n: "Hoàng kỳ", g: 12 }, { n: "Đảng sâm", g: 9, alt: ["Nhân sâm"] }, { n: "Bạch truật", g: 9 }, { n: "Phục thần", g: 9, alt: ["Phục linh"] },
      { n: "Táo nhân", g: 12, alt: ["Toan táo nhân"] }, { n: "Long nhãn", g: 12 }, { n: "Đương quy", g: 9 }, { n: "Viễn chí", g: 6 },
      { n: "Mộc hương", g: 6, note: "Cho sau" }, { n: "Cam thảo (chích)", g: 3, alt: ["Cam thảo", "Chích cam thảo"] }, { n: "Sinh khương", g: 3 }, { n: "Đại táo", g: 9 },
    ],
    decoction: "Sắc uống ấm, ngày 1 thang chia 2 lần, lần thứ hai uống buổi tối.",
    points: [["HT7 — Thần môn", "An thần"], ["SP6 — Tam âm giao", "Kiện Tỳ, bổ huyết"], ["PC6 — Nội quan", "An thần, ninh Tâm"], ["BL15 — Tâm du", "Bổ Tâm"], ["BL20 — Tỳ du", "Kiện Tỳ"]],
    therapy: [["Xoa bóp đầu mặt và day huyệt An miên", "10 phút buổi tối, nhẹ nhàng"]],
    advice: "Ngủ đúng giờ, tránh thiết bị điện tử trước khi ngủ, không dùng cà phê, trà đặc buổi chiều. Giữ tinh thần nhẹ nhàng. Ăn uống đủ chất, dễ tiêu. Tái khám sau 1 tuần.",
    followUpDays: 7,
    core: [...S("giac_ngu", "Khó ngủ, hồi hộp, hay quên, ăn kém, mệt"), ...S("nguc", "Hồi hộp, đánh trống ngực"), ...S("an_uong", "Chán ăn"), ...S("luoi_sac", "Nhợt"), ...S("mach_tong", "Tế", "Nhược")],
    support: [...S("giac_ngu", "Khó vào giấc", "Thức nhiều lần trong đêm"), ...S("sac_chitiet", "Vàng nhạt, gầy ốm", "Trắng nhợt"), ...S("cam_xuc", "Lo lắng, suy nghĩ nhiều"), ...S("kinh_tinh", "Màu nhạt, lượng ít, đau sau hành kinh")],
    against: [...S("mach_tong", "Thực"), ...S("luoi_sac", "Đỏ")],
  },
];

export type Proposal = {
  rule: PatternRule;
  coreHit: Sig[];
  supportHit: Sig[];
  againstHit: Sig[];
  coreTotal: number;
  supportTotal: number;
};

export function proposeFromTuChan(data: TuChanData): Proposal[] {
  const have = new Set<string>();
  for (const [k, d] of Object.entries(data)) for (const v of d.v) have.add(`${k}:${v}`);
  const hit = (xs: Sig[]) => xs.filter((s) => have.has(`${s.key}:${s.v}`));
  const out: (Proposal & { score: number })[] = [];
  for (const rule of R) {
    const coreHit = hit(rule.core), supportHit = hit(rule.support), againstHit = hit(rule.against);
    if (coreHit.length < 2 || coreHit.length / rule.core.length < 0.4) continue;
    const score = coreHit.length * 2 + supportHit.length - againstHit.length * 3;
    if (score < 4) continue;
    out.push({ rule, coreHit, supportHit, againstHit, coreTotal: rule.core.length, supportTotal: rule.support.length, score });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, 3).map(({ score: _s, ...p }) => p);
}

export function ruleByKey(key: string): PatternRule | undefined {
  return R.find((r) => r.key === key);
}
