// Danh mục tứ chẩn có cấu trúc. Nguồn: bài giảng "Tứ chẩn" (ThS.BS. Võ Thanh Phong) và
// "Tứ chẩn" (Bộ môn YHCT), dẫn lại Maciocia, HV Trung Y Quảng Châu, Kirschbaum.
// Phần "hint" chỉ là ý nghĩa THAM KHẢO theo giáo trình; bác sĩ tự đánh giá và kết luận.

export type Tag = "BIEU" | "LY" | "HAN" | "NHIET" | "HU" | "THUC" | "AM" | "DUONG";
export const TAG_LABEL: Record<Tag, string> = {
  BIEU: "Biểu", LY: "Lý", HAN: "Hàn", NHIET: "Nhiệt", HU: "Hư", THUC: "Thực", AM: "Âm", DUONG: "Dương",
};

export type Opt = { v: string; label: string; hint?: string; tags?: Tag[] };
export type Field = { key: string; label: string; kind: "multi" | "single"; opts: Opt[]; help?: string };
export type Section = { key: string; title: string; intro?: string; fields: Field[] };
export type Group = { key: "vong" | "van" | "vanhoi" | "thiet"; title: string; sub: string; sections: Section[] };

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const o = (label: string, hint?: string, tags?: Tag[]): Opt => ({ v: slug(label), label, hint, tags });
const multi = (key: string, label: string, opts: Opt[], help?: string): Field => ({ key, label, kind: "multi", opts, help });
const single = (key: string, label: string, opts: Opt[], help?: string): Field => ({ key, label, kind: "single", opts, help });

// ---------- 28 mạch tượng ----------
export const PULSES: Opt[] = [
  o("Phù", "Biểu chứng; ấn nhẹ đã thấy", ["BIEU"]),
  o("Trầm", "Lý chứng; ấn sâu mới thấy", ["LY"]),
  o("Trì", "Hàn; mạch chậm (dưới 60 lần/phút)", ["HAN"]),
  o("Sác", "Nhiệt; mạch nhanh (trên 90 lần/phút)", ["NHIET"]),
  o("Hư", "Hư chứng; vô lực", ["HU"]),
  o("Thực", "Thực chứng; hữu lực", ["THUC"]),
  o("Hoạt", "Đàm ẩm, thực nhiệt, thực tích; trơn tru", ["THUC"]),
  o("Sáp", "Huyết ứ, huyết ít, khí trệ; rít, không trơn", []),
  o("Hồng", "Nhiệt thịnh; to, đến mạnh đi yếu", ["NHIET", "THUC"]),
  o("Tế", "Huyết hư, thấp; nhỏ như sợi chỉ", ["HU"]),
  o("Vi", "Khí huyết đại hư, dương suy; rất nhỏ, mờ", ["HU"]),
  o("Nhu", "Hư, thấp; nông, nhỏ, mềm", ["HU"]),
  o("Nhược", "Khí huyết hư; sâu, nhỏ, mềm", ["HU"]),
  o("Hoãn", "Thấp hoặc Tỳ vị hư; bình thường nếu hòa hoãn", []),
  o("Huyền", "Can đởm, đau, đàm ẩm; căng như dây đàn", []),
  o("Khẩn", "Hàn, đau, thực tích; căng chặt như dây xoắn", ["HAN"]),
  o("Khâu", "Mất máu, thương âm; nổi, to, giữa rỗng", []),
  o("Cách", "Hư hàn, mất máu, tinh hao; ngoài cứng trong rỗng", ["HU"]),
  o("Lao", "Hàn tích, đau (trầm, huyền, thực); sâu, chắc", ["HAN", "LY"]),
  o("Tán", "Nguyên khí ly tán; nổi, tản, không gốc", ["HU"]),
  o("Phục", "Tà bế, đau nặng; ấn sát xương mới thấy", ["LY"]),
  o("Động", "Đau, kinh sợ; hình như hạt đậu, rung", []),
  o("Xúc", "Nhiệt thịnh; nhanh, dừng không đều", ["NHIET"]),
  o("Kết", "Hàn đàm, khí huyết uất; chậm, dừng không đều", ["HAN"]),
  o("Đại (đợi)", "Tạng khí suy; dừng có quy luật", ["HU"]),
  o("Trường", "Khí thịnh (bệnh) hoặc bình thường; vượt hai đầu bộ vị", []),
  o("Đoản", "Khí hư hoặc khí bị tắc trở; không tới đủ bộ vị", []),
  o("Hữu lực", "Phân biệt: trung án vẫn y như trước", ["THUC"]),
  o("Vô lực", "Phân biệt: trung án đã mất", ["HU"]),
];

// ---------- VỌNG ----------
const VONG: Group = {
  key: "vong",
  title: "Vọng chẩn (nhìn)",
  sub: "Thần, sắc, hình thái, đầu mặt và ngũ quan, tứ chi, da, lưỡi",
  sections: [
    {
      key: "than", title: "Vọng thần",
      intro: "Bước đầu của vọng chẩn: xem hình sắc, nhãn thần, thần chí, hơi thở. “Đắc thần giả sinh, thất thần giả tử”.",
      fields: [
        single("than_tong", "Thần tổng quát", [
          o("Còn thần (đắc thần)", "Tinh đủ khí túc; bệnh nhẹ, dự hậu tốt"),
          o("Thần khí bất túc", "Thất thần nhẹ, thường hư chứng: uể oải, hay quên, tiếng nhỏ", ["HU"]),
          o("Mất thần (thất thần)", "Tạng phủ suy bại, dự hậu xấu; vuốt áo, mò giường", ["HU"]),
          o("Giả thần", "Bệnh nặng, lâu ngày bỗng tỉnh táo, má đỏ như phấn: báo hiệu nguy kịch", ["HU"]),
          o("Thần khí dị thường", "Phiền táo, thần hôn, lảm nhảm, điên, cuồng, giản"),
        ]),
        multi("than_dau", "Dấu hiệu cụ thể", [
          o("Mắt sáng, tinh anh, lanh lợi"), o("Mắt lờ đờ, chậm chạp", undefined, ["HU"]),
          o("Nói năng bình thường"), o("Nói năng thất thường, mê sảng"),
          o("Hình sắc tươi nhuận, cơ không teo"), o("Hình gầy, cơ teo, sắc tối"),
          o("Hơi thở điều hòa"), o("Hơi thở khác thường"),
        ]),
      ],
    },
    {
      key: "sac", title: "Vọng sắc (sắc diện)",
      intro: "Ngũ sắc tương ứng ngũ tạng. Tươi nhuận là tốt, xám tối là xấu. Phân biệt chủ sắc (suốt đời) và khách sắc (theo mùa, rượu, gắng sức, cảm xúc).",
      fields: [
        single("sac_chung", "Sắc diện chung", [
          o("Bình thường (hồng vàng ẩn, nhuận)"), o("Xanh", "Phong, hàn, đau, kinh phong, bệnh Can"),
          o("Đỏ", "Nhiệt, bệnh Tâm", ["NHIET"]), o("Vàng", "Thấp, bệnh Tỳ"),
          o("Trắng", "Hư, hàn, mất huyết, thoát khí, bệnh Phế", ["HU"]), o("Đen", "Hàn, đau, bệnh Thận; đen khô thuộc nhiệt"),
        ]),
        multi("sac_chitiet", "Đặc điểm chi tiết", [
          o("Mặt đỏ hồng cả mặt", "Thực nhiệt", ["NHIET", "THUC"]),
          o("Hai gò má ửng đỏ (triều hồng)", "Hư nhiệt, âm hư", ["NHIET", "HU"]),
          o("Mặt đỏ như đánh phấn", "Hư dương ngoại việt", ["HU"]),
          o("Vàng tươi như vỏ quýt (dương hoàng)", "Thấp nhiệt", ["NHIET", "THUC"]),
          o("Vàng tối như hun khói (âm hoàng)", "Hàn thấp", ["HAN"]),
          o("Vàng dơ, cáu bẩn", "Thấp tà trở khí cơ"),
          o("Vàng nhạt, gầy ốm", "Tỳ hư, nguồn sinh hóa không đủ", ["HU"]),
          o("Vàng nhạt, phù", "Thủy thấp thất vận"),
          o("Trắng nhợt", "Dương hư", ["HU", "HAN"]),
          o("Trắng nhạt", "Khí hư", ["HU"]),
          o("Trắng nhạt hơi vàng", "Huyết hư", ["HU"]),
          o("Trắng bệch", "Thoát huyết, mất máu"),
          o("Xanh từng đợt", "Khí đạo bất thông, đau"),
          o("Xanh đen", "Hàn", ["HAN"]),
          o("Xanh tím", "Huyết ứ"),
          o("Đen xì", "Hàn, huyết thất ôn dưỡng", ["HAN"]),
          o("Đen khô", "Âm hư, hư hỏa", ["HU", "NHIET"]),
          o("Quầng mắt đen", "Thận hư, thủy ẩm", ["HU"]),
          o("Tím đen", "Ứ huyết"),
        ]),
        single("sac_trach", "Quang trạch", [o("Tươi nhuận (thuận)"), o("Khô, xám, tối (nghịch)")]),
      ],
    },
    {
      key: "hinh", title: "Vọng hình thể, thể tạng, tư thế",
      fields: [
        single("hinh_the", "Hình thể", [
          o("Cường tráng", "Xương to, ngực nở, cơ chắc, da nhuận"),
          o("Thanh gọn"), o("Cơ bắp"),
          o("Suy nhược (gầy, da khô)", "Ngực lép, cơ mềm", ["HU"]),
          o("Béo bệu (thừa cân)", "Đàm thấp"),
        ]),
        single("hinh_tang", "Thể tạng âm dương", [
          o("Dương tạng", "Gầy cao, đầu dài, cổ dài, vai hẹp, hơi cúi", ["DUONG"]),
          o("Âm tạng", "Thấp mập, đầu tròn, cổ ngắn, vai rộng, hay ưỡn", ["AM"]),
          o("Âm dương hòa bình"),
        ]),
        single("hinh_tuong", "Thể tạng tứ tượng", [
          o("Thái dương"), o("Thái âm"), o("Thiếu dương"), o("Thiếu âm"),
        ]),
        single("hinh_hanh", "Hình thể ngũ hành", [
          o("Hình Mộc"), o("Hình Hỏa"), o("Hình Thổ"), o("Hình Kim"), o("Hình Thủy"),
        ]),
        multi("hinh_tang_phu", "Nhìn hình đoán tạng", [
          o("Da lông khô thưa", "Phế hư", ["HU"]), o("Cơ nhục tay chân gầy nhão", "Tỳ hư", ["HU"]),
          o("Khung xương nhỏ, răng lung lay, tóc thưa", "Thận hư", ["HU"]),
          o("Chân tay run hoặc co cứng", "Can hư"), o("Người béo bệu", "Đàm thấp"),
          o("Ngực gà, lưng rùa, chân vòng kiềng, dị hình"),
        ]),
        multi("hinh_tuthe", "Tư thế, vận động", [
          o("Cử động không yên, thích nơi sáng", "Dương chứng", ["DUONG"]),
          o("Nằm yên, thích nơi tối, quay vào tường", "Âm chứng, hàn, hư", ["AM", "HAN", "HU"]),
          o("Co ro, mặc nhiều áo, sợ lạnh", "Ố hàn", ["HAN"]),
          o("Cởi áo, tung chăn, sợ nóng", "Ố nhiệt", ["NHIET"]),
          o("Nằm co quắp", "Dương hư úy hàn hoặc đau cực độ"),
          o("Nằm sải tay chân, mặt hướng lên", "Dương chứng, nhiệt thịnh", ["NHIET", "DUONG"]),
          o("Ngồi thích phủ phục", "Phế hư khí thiểu", ["HU"]),
          o("Ngồi ưỡn ngẩng", "Phế thực khí thịnh", ["THUC"]),
          o("Ngồi không nằm được (nằm thì khí nghịch)", "Khái suyễn phế trướng, thủy ẩm"),
          o("Chỉ nằm không ngồi được, chóng mặt", "Khí huyết đều hư", ["HU"]),
          o("Nằm ngồi không yên", "Phiền táo hoặc bụng đầy trướng"),
          o("Run giật (mi, mặt, môi, ngón)", "Ngoại cảm nhiệt bệnh, huyết hư âm khuy"),
          o("Run tay chân", "Hư phong nội động"),
          o("Co giật, cổ lưng cứng (giác cung phản trương)", "Kinh bệnh, nhiệt cực sinh phong"),
          o("Rét run", "Chính tà đấu tranh dữ dội, sốt rét cơn"),
          o("Yếu liệt, không đau, vận động kém", "Nuy chứng"),
          o("Khớp sưng đau, khó vận động", "Tý chứng"),
          o("Hôn đảo đột ngột, liệt nửa người, méo miệng", "Trúng phong"),
          o("Tay ôm bụng, dáng đi ngã về trước", "Đau bụng"),
          o("Đang đi bỗng dừng, ôm ngực", "Chân tâm thống"),
        ]),
      ],
    },
    {
      key: "dau_mat", title: "Vọng đầu, mặt",
      fields: [
        multi("dau", "Đầu và tóc", [
          o("Thóp hở bất thường (trẻ em)"), o("Thóp lõm"), o("Tóc thưa, rụng", "Thận hư, huyết hư", ["HU"]),
          o("Tóc bạc sớm"), o("Tóc khô", "Huyết hư", ["HU"]), o("Đầu lắc, run"),
        ]),
        multi("mat", "Hình dạng mặt", [
          o("Mặt phù, sưng nề", "Thủy thũng"),
          o("Má sưng đột ngột, họng đau, mặt đỏ", "Ôn độc", ["NHIET"]),
          o("Miệng mắt méo lệch", "Trúng phong, khẩu nhãn oa tà"),
        ]),
      ],
    },
    {
      key: "khieu", title: "Vọng ngũ quan (các khiếu)",
      fields: [
        multi("mat_khieu", "Mắt", [
          o("Mắt đỏ toàn bộ", "Can kinh phong nhiệt", ["NHIET"]),
          o("Mắt sưng đau đỏ", "Can hỏa, phong nhiệt", ["NHIET"]),
          o("Khóe mắt đỏ", "Tâm hỏa", ["NHIET"]),
          o("Lòng trắng đỏ", "Phế hỏa", ["NHIET"]),
          o("Lòng trắng vàng", "Thấp nhiệt nội thịnh", ["NHIET"]),
          o("Mí mắt đỏ, ẩm, loét", "Tỳ hỏa", ["NHIET"]),
          o("Mí mắt sưng", "Tỳ nhiệt"),
          o("Mí mắt tối ám, quầng thâm", "Thận hư", ["HU"]),
          o("Mống mắt nhạt", "Huyết hư", ["HU"]),
          o("Ổ mắt lõm", "Tinh khí tạng phủ suy kiệt", ["HU"]),
          o("Đồng tử giãn", "Thận thủy suy", ["HU"]),
          o("Gân đỏ nổi ở tròng trắng", "Có đau nhức; gân xanh tím đỏ: ngực có tích ứ"),
          o("Mắt trợn ngược, trực thị", "Chứng nguy"),
        ]),
        multi("mui", "Mũi", [
          o("Nghẹt, chảy nước đục", "Ngoại cảm phong nhiệt", ["BIEU", "NHIET"]),
          o("Nghẹt, chảy nước trong", "Ngoại cảm phong hàn", ["BIEU", "HAN"]),
          o("Cánh mũi phập phồng", "Thực nhiệt, tắc Phế khí; lâu ngày: suyễn hư"),
          o("Chóp mũi xanh", "Đau bụng"), o("Chóp mũi vàng", "Thấp nhiệt"),
          o("Chóp mũi trắng", "Mất huyết"), o("Chóp mũi đỏ", "Tỳ Phế có nhiệt", ["NHIET"]),
          o("Chóp mũi đen", "Thủy khí"), o("Mũi khô", "Dương minh có nhiệt", ["NHIET"]),
          o("Mũi sưng", "Tà khí thịnh", ["THUC"]),
        ]),
        multi("tai", "Tai", [
          o("Tai nhuận, thịt đầy (bình thường)"), o("Tai trắng nhợt", "Hàn", ["HAN"]),
          o("Tai xanh đen", "Đau"), o("Tai khô xám", "Thận thủy suy cực", ["HU"]),
          o("Tai sưng", "Tà khí thực", ["THUC"]), o("Tai gầy", "Chính khí hư", ["HU"]),
          o("Vành tai sần sùi", "Bệnh lâu, có huyết ứ"),
        ]),
        multi("moi", "Môi, miệng", [
          o("Môi xanh", "Đau"), o("Môi trắng nhợt", "Huyết hư", ["HU"]), o("Môi vàng", "Bệnh ở Tỳ"),
          o("Môi đỏ thẫm", "Thực nhiệt", ["NHIET", "THUC"]), o("Môi hồng nhợt", "Hư hàn", ["HU", "HAN"]),
          o("Môi dộp, khô", "Tích nhiệt", ["NHIET"]), o("Môi tím", "Ứ huyết"),
          o("Quanh miệng tím đen", "Thận tuyệt"), o("Miệng méo lệch", "Trúng phong"),
          o("Thở há miệng", "Phế tuyệt"), o("Miệng run giật", "Can phong hại Tỳ"),
        ]),
        multi("rang", "Răng, nướu", [
          o("Răng nhuận ướt (bình thường)"), o("Răng khô ráo", "Âm dịch hư tổn, Dương minh nhiệt thịnh", ["NHIET"]),
          o("Răng như xương khô", "Thận âm sắp cạn", ["HU"]),
          o("Răng cắn chặt", "Nhiệt cực sinh phong"), o("Nghiến răng, cắn răng", "Can phong động"),
          o("Nướu nhợt", "Huyết hư", ["HU"]), o("Nướu chảy máu", "Vị hỏa thịnh", ["NHIET"]),
        ]),
        multi("hong", "Hầu họng", [
          o("Hồng nhạt, nhuận (bình thường)"),
          o("Đỏ sậm", "Nhiệt", ["NHIET"]), o("Đỏ nhợt", "Hư nhiệt", ["NHIET", "HU"]),
          o("Sưng đỏ đau cấp", "Phong nhiệt", ["BIEU", "NHIET"]), o("Sưng đỏ đau mạn", "Vị nhiệt", ["NHIET"]),
          o("Khô họng, không sưng, đau mạn", "Phế Thận âm hư, hư nhiệt", ["HU"]),
          o("Đỏ, sưng, loét", "Nhiệt độc", ["NHIET"]), o("Loét mạn, tái phát", "Hư nhiệt", ["HU"]),
        ]),
      ],
    },
    {
      key: "tuchi", title: "Vọng tứ chi, móng, da",
      fields: [
        multi("chi", "Tứ chi", [
          o("Khớp sưng nóng đỏ", "Thấp nhiệt, chứng tý", ["NHIET"]),
          o("Khớp sưng trên nền huyết hư", "Trước tý trên nền Can huyết hư", ["HU"]),
          o("Phù bàn tay", "Phế dương hư; cấp: phong thủy phạm Phế"),
          o("Phù bàn chân", "Thận dương hư", ["HU"]), o("Phù cả tứ chi", "Tỳ dương hư, thấp, khí trệ"),
          o("Tứ chi mềm yếu (nuy)", "Phế nhiệt thương tân, thấp nhiệt, Tỳ Vị hư, Thận âm hư"),
          o("Tứ chi co cứng", "Ngoại phong, Can dương vượng, huyết ứ, đàm thấp"),
          o("Yếu liệt tứ chi", "Tỳ Vị hư, khí huyết hư, Can Thận âm hư, phong đàm"),
          o("Co rút tứ chi", "Phong tà, thấp, nhiệt thương tân, Can huyết hư"),
          o("Run bàn tay", "Can phong"), o("Run nhỏ", "Khí huyết hư, Can huyết hư", ["HU"]),
        ]),
        multi("mong", "Móng tay chân", [
          o("Móng nhợt", "Huyết hư", ["HU"]), o("Móng tím", "Huyết ứ"), o("Móng có sọc", "Can huyết hư", ["HU"]),
        ]),
        multi("nguteh", "Ngư tế (mô cái bàn tay)", [
          o("Gân xanh", "Hàn ở Vị", ["HAN"]), o("Xanh kèm gân nổi ngắn", "Vị hư", ["HU"]),
          o("Gân đỏ", "Nhiệt ở Vị", ["NHIET"]), o("Gân tím", "Huyết ứ ở Vị"),
        ]),
        multi("chivan", "Chỉ văn (trẻ dưới 3 tuổi)", [
          o("Ở phong quan (đốt 1)", "Bệnh nhẹ"), o("Đến khí quan (đốt 2)", "Bệnh nặng"),
          o("Đến mệnh quan (đốt 3)", "Bệnh nguy kịch"),
          o("Đỏ tươi", "Ngoại tà", ["BIEU"]), o("Tía", "Nhiệt", ["NHIET"]), o("Nhợt", "Hư", ["HU"]),
          o("Xanh", "Phong, đau"), o("Xanh kèm tím", "Huyết lạc bế uất"),
          o("Nổi", "Bệnh ở biểu", ["BIEU"]), o("Chìm", "Bệnh ở lý", ["LY"]),
        ]),
        multi("da", "Da", [
          o("Da khô", "Can huyết hư", ["HU"]), o("Da ngứa", "Phong"),
          o("Phù ấn lõm", "Thận dương hư, thủy thũng"), o("Phù ấn không lõm", "Khí trệ, khí thũng"),
          o("Vàng tươi", "Dương hoàng, thấp nhiệt", ["NHIET"]), o("Vàng tối", "Âm hoàng, hàn thấp", ["HAN"]),
          o("Gân nổi đỏ", "Huyết nhiệt", ["NHIET"]), o("Gân nổi tím", "Huyết ứ"),
          o("Gân xanh nhợt", "Đau"), o("Gân xanh tái", "Hàn", ["HAN"]),
          o("Sẩn đỏ", "Nhiệt ở Phế Vị", ["NHIET"]), o("Mụn nước", "Thấp"),
          o("Ban chẩn, nốt ngoài da"),
        ]),
      ],
    },
    {
      key: "thiet", title: "Thiệt chẩn (xem lưỡi)",
      intro: "Xem dưới ánh sáng tự nhiên, trước khi ăn. Lưu ý rêu có thể bị nhuộm do ăn uống; cạo thử xem rêu có bong không. Hình lưỡi đánh giá hư thực, sắc lưỡi đánh giá hàn nhiệt, rêu đánh giá biểu lý và Vị khí. Bệnh về khí xét rêu, bệnh về huyết xét chất lưỡi.",
      fields: [
        single("luoi_sac", "Sắc chất lưỡi", [
          o("Hồng nhạt, nhuận (bình thường)"),
          o("Nhợt", "Hư hàn; hơi ướt: dương hư; hơi khô: huyết hư; hơi nhợt: khí hư", ["HU", "HAN"]),
          o("Đỏ", "Nhiệt; có rêu: thực nhiệt; không rêu: hư nhiệt", ["NHIET"]),
          o("Đỏ sậm (giáng)", "Nhiệt nhập dinh phận, nhiệt nhiều", ["NHIET"]),
          o("Tím", "Huyết ứ; tím nhuận: hàn; tím khô: nhiệt"),
          o("Xanh tím / xanh", "Hàn thịnh, ứ", ["HAN"]),
          o("Đen", "Hàn hoặc nhiệt cực; xét nhuận hay khô"),
        ]),
        multi("luoi_hinh", "Hình dạng, thái lưỡi", [
          o("Thon chắc, mềm mại, linh hoạt (bình thường)"),
          o("Phù nề, bệu", "Có đàm thấp", ["HU"]),
          o("Có dấu ấn răng", "Tỳ khí hư", ["HU"]),
          o("Gầy, mỏng, teo", "Huyết hư, âm hư", ["HU"]),
          o("Nứt nẻ", "Có nhiệt, âm hư; nứt giữa: Vị âm hư; nứt đầu lưỡi: Tâm nhiệt", ["NHIET", "HU"]),
          o("Gai nhọn nổi cao", "Nhiệt, thực", ["NHIET", "THUC"]),
          o("Không có gai, mềm", "Hư", ["HU"]),
          o("Cứng, khó nói", "Nội phong, huyết ứ, âm hư nặng"),
          o("Run", "Run + hồng tím: Can phong; run + nhạt: hư", []),
          o("Lệch, méo", "Trúng phong"),
          o("Rút ngắn", "Trắng nhuận: hàn; đỏ khô: nhiệt"),
          o("Mềm khô đỏ", "Nhiệt thương tân", ["NHIET"]),
          o("Tĩnh mạch dưới lưỡi phồng, xanh tím", "Huyết ứ"),
          o("Chấm đỏ đầu lưỡi", "Tâm nhiệt", ["NHIET"]),
          o("Chấm đỏ hai bên lưỡi", "Can nhiệt", ["NHIET"]),
        ]),
        multi("luoi_vung", "Vùng lưỡi bất thường", [
          o("Đầu lưỡi", "Tâm Phế"), o("Hai bên lưỡi", "Can Đởm"), o("Giữa lưỡi", "Tỳ Vị"), o("Gốc lưỡi", "Thận, Bàng quang, Đại trường"),
        ]),
        single("luoi_reu", "Sắc rêu", [
          o("Trắng mỏng, sạch, nhuận (bình thường)"),
          o("Không rêu", "Âm hư", ["HU"]),
          o("Trắng", "Phong hàn thấp, biểu chứng; trắng dày trơn: hàn", ["BIEU"]),
          o("Trắng chuyển vàng", "Nhiệt ít, tà vào lý", ["NHIET"]),
          o("Vàng", "Bệnh ở lý, nhiệt", ["LY", "NHIET"]),
          o("Xám", "Xám nhuận: hàn; xám khô: nhiệt"),
          o("Đen", "Đen nhuận: hàn; đen khô: nhiệt cực, tân dịch kiệt"),
        ]),
        multi("luoi_reu_tc", "Tính chất rêu", [
          o("Mỏng", "Bệnh mới phát, nông, nhẹ", ["BIEU"]),
          o("Dày", "Tà vào lý", ["LY"]),
          o("Nhuận", "Tân dịch còn"), o("Khô", "Tân dịch hao tổn", ["NHIET"]),
          o("Nhớt", "Thấp trọc"), o("Nhờn", "Đàm thấp, thừa tân dịch"),
          o("Bong tróc từng mảng", "Vị âm hư"),
        ]),
        single("luoi_dich", "Tân dịch (đánh giá chung)", [
          o("Bảo tồn"), o("Tổn thương"), o("Suy nhiều"), o("Khô kiệt"), o("Thừa (trơn nhầy, trướng)"),
        ]),
      ],
    },
  ],
};

// ---------- VĂN ----------
const VAN: Group = {
  key: "van",
  title: "Văn chẩn (nghe, ngửi)",
  sub: "Tiếng nói, hơi thở, ho, nôn, nấc, ợ; mùi",
  sections: [
    {
      key: "thanam", title: "Nghe thanh âm",
      intro: "Âm thanh phát ra liên quan Phế khí, họng, lưỡi, răng, môi, mũi; Thận chủ nạp khí. Tiếng nói bình thường: tự nhiên, điều hòa.",
      fields: [
        multi("tieng_noi", "Tiếng nói", [
          o("Bình thường, tự nhiên"),
          o("Khàn, mất tiếng, mới phát", "Thực chứng, ngoại cảm phong hàn/phong nhiệt, đàm trọc úng Phế", ["THUC", "BIEU"]),
          o("Khàn, mất tiếng, kéo dài", "Hư, Phế Thận âm hư, hư hỏa", ["HU"]),
          o("Tiếng to, cao, thô, hữu lực", "Thực, nhiệt", ["THUC", "NHIET"]),
          o("Tiếng nặng đục (nghẹt mũi)", "Phong hàn thấp"),
          o("Tiếng nhỏ, thấp, yếu, đứt quãng", "Hư, hàn", ["HU", "HAN"]),
          o("Trầm mặc, ít nói", "Hư, hàn", ["HU", "HAN"]),
          o("Nói nhiều, phiền táo", "Nhiệt, thực", ["NHIET", "THUC"]),
          o("Nói chậm, nhẹ, muốn nói không nổi (đoạt khí)", "Trung khí đại hư", ["HU"]),
          o("Nói chậm, không rõ, khó hiểu", "Phong đàm trở trệ lạc"),
          o("Nói lảm nhảm, nói sảng (chiêm ngữ)", "Mất thần, nhiệt nhiễu thần minh"),
          o("Ngáy khi ngủ", "Thường do khí đạo không thông; ngủ mê ngáy liên tục là nguy"),
          o("Rên rỉ không ngớt", "Thường do đau"),
        ]),
        multi("hoi_tho", "Hơi thở", [
          o("Bình thường, đều"),
          o("Thở thô, hổn hển, nhanh", "Thực, nhiệt", ["THUC", "NHIET"]),
          o("Thở nhỏ, chậm, yếu", "Hư, hàn", ["HU", "HAN"]),
          o("Suyễn thực (khởi phát nhanh, thở thô, cao)", "Phế thực nhiệt hoặc đàm ẩm nội đình", ["THUC"]),
          o("Suyễn hư (từ từ, thở nhỏ, động thì tăng)", "Phế Thận hư, khí không nạp", ["HU"]),
          o("Háo (khó thở kèm khò khè)", "Đàm ẩm"),
          o("Đoản khí (thở ngắn gấp, không rụt vai)", "Đàm trệ trong ngực (thực) hoặc Phế khí bất túc (hư)"),
          o("Thiểu khí (thở nhỏ yếu)", "Hư bất túc", ["HU"]),
          o("Cánh mũi phập phồng"),
        ]),
        multi("ho", "Ho", [
          o("Ho tiếng nặng, tức ngực", "Hàn thấp", ["HAN"]),
          o("Ho tiếng nặng đục, đàm loãng trắng, nghẹt mũi", "Ngoại cảm phong hàn", ["BIEU", "HAN"]),
          o("Ho tiếng nhỏ, đàm nhiều, dễ khạc", "Ho hàn, thấp, đàm ẩm", ["HAN"]),
          o("Ho tiếng thanh giòn, ho khan, ít đàm dính", "Táo nhiệt, hỏa nhiệt", ["NHIET"]),
          o("Ho khản đặc, đàm vàng dính, họng khô đau", "Phế nhiệt", ["NHIET"]),
          o("Ho vô lực, tiếng nhỏ, bọt trắng", "Phế hư", ["HU"]),
          o("Ho nhiều về đêm", "Thận thủy khuy"),
          o("Ho nhiều khi trời sáng", "Tỳ hư hoặc đàm thấp tại Đại trường"),
        ]),
        multi("khi_nghich", "Nôn, nấc, ợ, thở dài, hắt hơi, sôi ruột", [
          o("Nôn từ từ, tiếng nhỏ, nước trong, đàm nhớt", "Hư hàn", ["HU", "HAN"]),
          o("Nôn mạnh, tiếng to, nước vàng chua đắng", "Thực nhiệt", ["THUC", "NHIET"]),
          o("Nôn vọt", "Nhiệt nhiễu thần minh"),
          o("Nấc hữu lực, cao, ngắn", "Thực nhiệt", ["THUC", "NHIET"]),
          o("Nấc nhỏ, trầm, dài, cách hồi lâu", "Hư hàn", ["HU", "HAN"]),
          o("Nấc nhỏ như không lên tới họng", "Tỳ Vị khí suy"),
          o("Ợ chua, ngực bụng trướng", "Thực tích, Vị khí trệ"),
          o("Ợ rõ, trong, liên tục, theo cảm xúc", "Can khí phạm Vị"),
          o("Ợ thấp trầm, không chua hôi", "Tỳ Vị hư nhược", ["HU"]),
          o("Thở dài", "Can khí uất kết"),
          o("Hắt hơi", "Ngoại cảm phong hàn; hắt hơi sau bệnh lâu: báo hiệu gần khỏi"),
          o("Sôi ruột, như sấm", "Phong hàn thấp tà, đầy bụng, đại tiện lỏng"),
          o("Sôi ruột như đói, gặp ấm/ăn thì giảm", "Trung hư, trường Vị bất thực", ["HU"]),
        ]),
      ],
    },
    {
      key: "muivi", title: "Ngửi mùi vị",
      fields: [
        multi("mui_vi", "Mùi", [
          o("Không mùi bất thường"),
          o("Miệng hôi", "Tiêu hóa kém, sâu răng, miệng không sạch; hôi thối: Vị nhiệt", ["NHIET"]),
          o("Miệng mùi chua hôi", "Trong Vị có thực tích"),
          o("Miệng hôi thối nặng", "Nội ung, lở loét"),
          o("Mồ hôi tanh khét", "Phong thấp nhiệt"),
          o("Mũi hôi, chảy mũi đặc", "Tỵ uyên"),
          o("Thân thể hôi, lở loét", "Kiểm tra nhọt lở"),
          o("Phân, nước tiểu, kinh, khí hư mùi hôi", "Nhiệt, thấp nhiệt", ["NHIET"]),
          o("Phân tanh", "Hàn", ["HAN"]),
        ]),
      ],
    },
  ],
};

// ---------- VẤN ----------
const VANHOI: Group = {
  key: "vanhoi",
  title: "Vấn chẩn (hỏi)",
  sub: "Bệnh sử, thập vấn (hàn nhiệt, hãn, ẩm thực, nhị tiện, đau, đầu thân, ngực bụng, tai mắt, giấc ngủ…), phụ khoa, nhi",
  sections: [
    {
      key: "benhsu", title: "Bệnh sử",
      intro: "Mỗi triệu chứng khai thác: khởi phát (khi nào, yếu tố khởi phát), vị trí và hướng lan, tính chất, yếu tố tăng giảm (thời gian trong ngày, ăn uống, thuốc), triệu chứng kèm theo.",
      fields: [
        single("khoi_phat", "Khởi phát", [o("Đột ngột, cấp", undefined, ["THUC"]), o("Từ từ, kéo dài", undefined, ["HU"])]),
        single("thoi_gian_benh", "Thời gian bệnh", [o("Dưới 1 tuần"), o("1 đến 4 tuần"), o("1 đến 6 tháng"), o("Trên 6 tháng")]),
        multi("yeu_to_khoi", "Yếu tố khởi phát", [
          o("Gió lạnh, thay đổi thời tiết"), o("Ăn uống không điều độ"), o("Làm việc quá sức, lao lực"),
          o("Ngồi lâu, tư thế sai"), o("Chấn thương"), o("Căng thẳng, cảm xúc"), o("Sau sinh, sau bệnh nặng"),
        ]),
        multi("da_dieu_tri", "Đã điều trị", [
          o("Chưa điều trị"), o("Thuốc tây"), o("Thuốc Đông y"), o("Châm cứu, xoa bóp"), o("Có đỡ"), o("Không đỡ hoặc nặng thêm"),
        ]),
      ],
    },
    {
      key: "hannhiet", title: "1. Hàn nhiệt",
      fields: [
        multi("han_nhiet", "Triệu chứng", [
          o("Sợ lạnh (ố hàn)", "Hàn; ngoại cảm: biểu", ["HAN"]),
          o("Sợ gió", "Biểu hư", ["BIEU"]),
          o("Sợ nóng", "Nhiệt", ["NHIET"]),
          o("Phát sốt", "Ngoại cảm hoặc nhiệt chứng"),
          o("Sốt nhẹ, ớn lạnh nhiều, không mồ hôi", "Ngoại cảm phong hàn biểu chứng", ["BIEU", "HAN"]),
          o("Sốt nặng, ớn lạnh nhẹ, có mồ hôi", "Ngoại cảm phong nhiệt biểu chứng", ["BIEU", "NHIET"]),
          o("Hàn nhiệt vãng lai", "Bán biểu bán lý, thiếu dương"),
          o("Sốt không ớn lạnh, khát, táo bón", "Lý thực nhiệt", ["LY", "THUC", "NHIET"]),
          o("Sốt nhẹ về chiều (triều nhiệt)", "Âm hư phát nhiệt", ["HU", "NHIET"]),
          o("Ngũ tâm phiền nhiệt", "Âm hư", ["HU", "NHIET"]),
          o("Cốt chưng nhiệt", "Âm hư", ["HU"]),
          o("Tay chân lạnh", "Dương hư", ["HU", "HAN"]),
          o("Cảm giác lạnh trong người (nội thương)", undefined, ["HAN"]),
          o("Cảm giác nóng trong người (nội thương)", undefined, ["NHIET"]),
        ]),
      ],
    },
    {
      key: "han", title: "2. Hãn (mồ hôi)",
      fields: [
        multi("mo_hoi", "Mồ hôi", [
          o("Không ra mồ hôi", "Biểu thực (nếu có sợ lạnh phát sốt)", ["BIEU", "THUC"]),
          o("Có mồ hôi, sợ lạnh, phát sốt", "Biểu hư", ["BIEU", "HU"]),
          o("Tự hãn (ra mồ hôi tự nhiên, ban ngày)", "Khí hư, dương hư", ["HU"]),
          o("Đạo hãn (mồ hôi trộm)", "Âm hư", ["HU"]),
          o("Sốt cao, ra nhiều mồ hôi, vẫn còn sốt", "Nhiệt vào lý", ["LY", "NHIET"]),
          o("Mồ hôi nhiều không dứt, tay chân lạnh", "Thoát dương, nguy kịch"),
          o("Ra mồ hôi ở đầu, ngực", "Hãy ghi rõ vị trí vào ghi chú"),
          o("Ra mồ hôi lòng bàn tay, bàn chân"),
        ]),
      ],
    },
    {
      key: "amthuc", title: "3. Ẩm thực (ăn uống), khát",
      fields: [
        multi("an_uong", "Ăn uống", [
          o("Ăn uống bình thường", "Vị khí chưa tổn thương"),
          o("Chán ăn", "Tỳ khí hư", ["HU"]),
          o("Bệnh mới, không muốn ăn, ợ hơi", "Tích trệ, khí trệ Tỳ Vị"),
          o("Bệnh lâu, ăn kém", "Tỳ Vị hư nhược", ["HU"]),
          o("Ăn nhiều, mau đói", "Vị hỏa mạnh", ["NHIET"]),
          o("Đói nhưng không muốn ăn", "Vị âm hư", ["HU"]),
          o("Ăn vào đau tăng", "Thực", ["THUC"]), o("Ăn vào đau giảm", "Hư", ["HU"]),
          o("Đầy bụng", "Thấp hoặc thực tích"), o("Căng chướng", "Khí trệ"), o("Nặng nề", "Thấp"),
          o("Thích ăn uống nóng", "Hàn", ["HAN"]), o("Thích ăn uống mát lạnh", "Nhiệt", ["NHIET"]),
        ]),
        multi("vi_giac", "Vị giác và nôn", [
          o("Nhạt miệng", "Đàm trọc hoặc hư"), o("Đắng miệng", "Tâm hoặc Can Đởm có nhiệt", ["NHIET"]),
          o("Ngọt miệng", "Tỳ hư hoặc thấp nhiệt"), o("Chua miệng", "Thực tích hoặc Can phạm Vị"),
          o("Mặn miệng", "Thận âm hư"), o("Cay miệng", "Phế nhiệt", ["NHIET"]),
          o("Giảm vị giác", "Tỳ Vị hư", ["HU"]),
          o("Nôn chua", "Can phạm Vị"), o("Nôn đắng", "Can Đởm có nhiệt", ["NHIET"]),
          o("Nôn nước trong", "Hàn tà phạm Vị", ["HAN"]), o("Nôn sau ăn", "Nhiệt chứng", ["NHIET"]),
        ]),
        multi("khat", "Khát và uống nước", [
          o("Khát, uống nhiều, thích nước lạnh", "Thực nhiệt", ["THUC", "NHIET"]),
          o("Khát, uống ít", "Âm hư", ["HU"]),
          o("Khát mà không muốn uống", "Thấp nhiệt hoặc đàm thấp"),
          o("Không khát", "Hàn chứng", ["HAN"]),
          o("Thích uống nước ấm", "Hàn", ["HAN"]), o("Thích uống nước lạnh", "Nhiệt", ["NHIET"]),
          o("Uống nhiều, tiểu nhiều, gầy nhanh", "Tiêu khát"),
        ]),
      ],
    },
    {
      key: "nhitien", title: "4. Nhị tiện (đại tiện, tiểu tiện)",
      fields: [
        multi("dai_tien", "Đại tiện", [
          o("Bình thường"),
          o("Táo bón cấp, khát, rêu vàng", "Nhiệt ở Vị trường", ["NHIET", "THUC"]),
          o("Táo bón ở người già, phụ nữ sau sinh", "Huyết hư, tân hao", ["HU"]),
          o("Táo bón phân nhỏ, khô như phân dê", "Can khí uất, nhiệt ở trường"),
          o("Đi tiêu khó, phân không khô", "Can khí uất"),
          o("Táo bón kèm đau bụng", "Nội hàn, hư hoặc thực"),
          o("Táo bón, miệng khô, uống ít", "Âm hư (Thận, Vị)", ["HU"]),
          o("Táo bón xen tiêu chảy", "Can khí phạm Vị"),
          o("Triệu chứng giảm sau đi tiêu", "Thực", ["THUC"]), o("Triệu chứng tăng sau đi tiêu", "Hư", ["HU"]),
          o("Tiêu chảy mạn", "Tỳ hoặc Thận dương hư", ["HU", "HAN"]),
          o("Ngũ canh tả (tiêu chảy gần sáng)", "Thận dương hư", ["HU", "HAN"]),
          o("Tiêu chảy kèm đau bụng", "Nội hàn", ["HAN"]),
          o("Phân có nhầy mủ", "Thấp ở trường"), o("Phân có máu mủ, mót rặn", "Thấp nhiệt ở trường", ["NHIET"]),
          o("Phân sống, nhão, không tiêu", "Tỳ khí hư", ["HU"]),
          o("Phân sệt, đi nhiều lần", "Trung khí hư", ["HU"]),
          o("Phân đen", "Huyết ứ, xuất huyết trên"),
          o("Máu tươi trước phân", "Huyết nhiệt (hậu môn đau nặng: thấp nhiệt)", ["NHIET"]),
          o("Phân lỏng như nước, phân trước máu sau", "Tỳ khí hư không nhiếp huyết", ["HU"]),
          o("Phân tanh hôi", "Nhiệt", ["NHIET"]),
          o("Tiêu ra như nước, phóng như bắn, nóng rát hậu môn", "Vị trường nhiệt", ["NHIET"]),
        ]),
        multi("tieu_tien", "Tiểu tiện", [
          o("Bình thường"),
          o("Tiểu nhạt màu, nhiều", "Hàn", ["HAN"]), o("Tiểu sậm màu", "Nhiệt", ["NHIET"]),
          o("Tiểu vàng ít", "Thận âm hư", ["HU"]), o("Tiểu đục", "Thấp"),
          o("Tiểu nhiều lần, trong", "Thận dương hư", ["HU", "HAN"]),
          o("Tiểu nhiều lần và ít", "Khí hư", ["HU"]),
          o("Tiểu đêm nhiều, tiểu dầm, không tự chủ", "Thận hư", ["HU"]),
          o("Tiểu không hết, tiểu khó", "Thấp phạm bàng quang hoặc Thận hư"),
          o("Đau trước khi tiểu", "Khí trệ hạ tiêu"), o("Đau trong khi tiểu", "Thấp nhiệt bàng quang", ["NHIET"]),
          o("Đau sau khi tiểu", "Khí hư", ["HU"]),
          o("Tiểu buốt, rắt, có máu hoặc cát sỏi", "Chứng lâm"),
          o("Bí tiểu đột ngột, nước tiểu hôi, bàng quang nóng đau", "Thực chứng", ["THUC"]),
        ]),
      ],
    },
    {
      key: "dau", title: "5. Đau",
      intro: "Hỏi: vị trí, kiểu đau, giờ đau, yếu tố tăng giảm (nóng, lạnh, ấn, ăn, nghỉ, vận động).",
      fields: [
        multi("kieu_dau", "Tính chất đau", [
          o("Căng nhiều hơn đau, không cố định, lúc có lúc không", "Khí trệ"),
          o("Đau nhói như đâm, cố định", "Huyết ứ"),
          o("Co thắt, co rút, tăng khi lạnh, giảm khi nóng", "Hàn", ["HAN"]),
          o("Đau rát, nóng, kèm đầy tức nặng", "Thấp nhiệt", ["NHIET"]),
          o("Đau âm ỉ, kéo dài", "Hư", ["HU"]),
          o("Đau dữ dội, rõ, khởi phát đột ngột", "Thực", ["THUC"]),
          o("Nặng nề, ê ẩm", "Thấp"),
          o("Đau căng như mạch đập (đau đầu mạn)", "Can dương vượng"),
        ]),
        multi("yeu_to_dau", "Yếu tố tăng giảm", [
          o("Thiện án (xoa ấn dễ chịu)", "Hư", ["HU"]), o("Cự án (sợ sờ, ấn đau tăng)", "Thực", ["THUC"]),
          o("Giảm khi gặp nóng", "Hàn", ["HAN"]), o("Giảm khi gặp lạnh", "Nhiệt", ["NHIET"]),
          o("Giảm khi nghỉ", "Hư", ["HU"]), o("Giảm khi vận động", "Thực hoặc hàn"),
          o("Nặng hơn khi vận động", "Nhiệt"),
          o("Giảm sau ăn", "Hư", ["HU"]), o("Tăng sau ăn", "Thực", ["THUC"]),
          o("Đau ban đêm", "Huyết hư hoặc huyết ứ"), o("Đau ban ngày, mệt thì nặng", "Dương hư"),
          o("Đau sau giờ Ngọ", "Âm hư"),
        ]),
      ],
    },
    {
      key: "dauthan", title: "6. Đầu, mặt, thân mình",
      fields: [
        multi("dau_dau", "Đầu", [
          o("Đau đầu vùng chẩm, cứng gáy", "Ngoại phong", ["BIEU"]),
          o("Đau đầu hai bên thái dương, sốt, sợ lạnh", "Ngoại cảm", ["BIEU"]),
          o("Đau một bên đầu", "Nội phong hoặc huyết hư"),
          o("Đau đầu, chóng mặt, mắt đỏ, miệng đắng", "Can Đởm thịnh", ["NHIET"]),
          o("Đau đầu nặng như bó, ê ẩm", "Thấp nặng"),
          o("Chóng mặt, hồi hộp, ngắn hơi, yếu", "Khí huyết hư", ["HU"]),
          o("Chóng mặt đột ngột", "Thực", ["THUC"]), o("Chóng mặt lâu ngày", "Hư", ["HU"]),
          o("Choáng váng", undefined),
        ]),
        multi("dau_than", "Mặt và thân mình", [
          o("Nóng mặt"), o("Đau mặt"), o("Chảy mũi"), o("Chảy máu chân răng", "Vị hỏa"), o("Loét miệng"),
          o("Đau toàn thân buốt, sốt, ớn lạnh", "Ngoại cảm", ["BIEU"]),
          o("Đau mình lâu ngày", "Khí huyết bất túc", ["HU"]),
          o("Đau lưng", "Thận hư", ["HU"]), o("Mỏi gối", "Thận hư", ["HU"]),
          o("Đau cổ vai gáy"), o("Tê bì"),
          o("Đau khớp, cơ bắp, tê bại, cố định hoặc di chuyển", "Phong hàn thấp tý"),
        ]),
      ],
    },
    {
      key: "nguc_bung", title: "7. Hung phúc (ngực bụng)",
      fields: [
        multi("nguc", "Ngực", [
          o("Đau ngực, sốt, ho ra mủ máu", "Phế ung"),
          o("Đau ngực, sốt chiều, ho khan, đờm lẫn máu", "Lao phổi"),
          o("Đau ngực lan bả vai, cảm giác nén vùng tim", "Hung tý"),
          o("Đau sườn dưới", "Can khí bất thư"),
          o("Tức ngực"), o("Hồi hộp, đánh trống ngực"), o("Khó thở"),
        ]),
        multi("bung", "Bụng", [
          o("Đau bụng trên, nôn nước trong, gặp lạnh đau dữ", "Hàn", ["HAN"]),
          o("Bụng trên chướng đau, ợ chua hôi", "Thực trệ", ["THUC"]),
          o("Đau quanh rốn từng cơn, nổi cục", "Giun đũa"),
          o("Đau bụng, sốt, tiêu chảy hoặc lỵ, mót rặn", "Thấp nhiệt thực", ["NHIET", "THUC"]),
          o("Đau bụng ê ẩm, phân nát, sợ lạnh, chi mát", "Hàn thấp hư", ["HAN", "HU"]),
          o("Đau bụng dưới", "Hạ tiêu"), o("Đầy trướng bụng"),
        ]),
      ],
    },
    {
      key: "tuchi_h", title: "8. Tứ chi",
      fields: [
        multi("hoi_chi", "Triệu chứng chi", [
          o("Yếu liệt"), o("Tê chi"), o("Đau khớp"), o("Đau cơ"), o("Đi đứng khó khăn"), o("Run chi"),
          o("Lạnh tay", "Dương hư", ["HU", "HAN"]), o("Lạnh chân", "Dương hư", ["HU", "HAN"]),
          o("Yếu gối", "Thận hư", ["HU"]), o("Nặng mỏi chi", "Thấp"),
        ]),
      ],
    },
    {
      key: "ngu", title: "9. Giấc ngủ",
      fields: [
        multi("giac_ngu", "Giấc ngủ", [
          o("Ngủ bình thường"),
          o("Khó vào giấc", "Tâm huyết hư; kèm chóng mặt nhìn mờ: Can huyết hư", ["HU"]),
          o("Thức nhiều lần trong đêm", "Âm hư (Tâm, Thận, Can)", ["HU"]),
          o("Khó ngủ, hồi hộp, hay quên, ăn kém, mệt", "Tâm Tỳ lưỡng hư", ["HU"]),
          o("Thức nhiều lần, mơ nhiều, đạo hãn, hồi hộp", "Tâm Thận âm hư", ["HU"]),
          o("Mơ nhiều, đầu lưỡi đỏ, tâm phiền", "Tâm hỏa vượng", ["NHIET"]),
          o("Mất ngủ, nhiều mộng, đau đầu, miệng đắng, cáu", "Can hỏa vượng", ["NHIET"]),
          o("Ngủ không yên, mơ nhiều, bụng đầy", "Thực tích", ["THUC"]),
          o("Thức dậy sớm, không ngủ lại được", "Đởm hư", ["HU"]),
          o("Ngủ nhiều, mệt, chi mỏi", "Khí hư", ["HU"]),
          o("Ăn xong uể oải muốn ngủ", "Tỳ khí bất túc", ["HU"]),
          o("Ngủ nhiều, mình nặng, mạch hoãn", "Thấp thắng"),
        ]),
      ],
    },
    {
      key: "nangluong", title: "10. Năng lượng (mệt mỏi)",
      fields: [
        multi("met_moi", "Mệt mỏi mạn kèm", [
          o("Muốn nằm, chán ăn, phân lỏng", "Tỳ khí hoặc Tỳ dương hư", ["HU"]),
          o("Nói yếu, dễ cảm lạnh", "Phế khí hoặc Phế dương hư", ["HU"]),
          o("Đau lưng, sợ lạnh, tiểu nhiều lần", "Thận dương hư", ["HU", "HAN"]),
          o("Chóng mặt, nhìn mờ, kinh ít", "Can huyết hư", ["HU"]),
          o("Lo lắng, khô miệng về đêm, lưỡi không rêu", "Thận âm hư", ["HU"]),
          o("Cảm giác nặng nề", "Thấp"), o("Nặng nề, chóng mặt", "Đàm"),
          o("Bụng chướng, kích thích, mạch huyền", "Can khí uất"),
          o("Nóng lạnh thay đổi, kích thích, rêu một bên", "Hội chứng thiếu dương"),
        ]),
      ],
    },
    {
      key: "tai_mat_h", title: "11. Tai và mắt",
      fields: [
        multi("hoi_tai_mat", "Triệu chứng", [
          o("Điếc đột ngột", "Can Đởm hỏa vượng, thực", ["THUC"]), o("Điếc lâu", "Thận hư, khí hư", ["HU"]),
          o("Ù tai kèm hồi hộp, chóng mặt", "Hư", ["HU"]),
          o("Ù tai kèm tức ngực, đau sườn, miệng đắng", "Thực", ["THUC"]),
          o("Nhìn mờ"), o("Khô mắt", "Can âm hư"), o("Quáng gà"), o("Đau mắt"), o("Mắt nóng"),
        ]),
      ],
    },
    {
      key: "camxuc", title: "12. Cảm xúc, tình dục",
      fields: [
        multi("cam_xuc", "Cảm xúc", [
          o("Trầm cảm"), o("Lo âu, sợ hãi", "Thận"), o("Tức giận", "Can"),
          o("Lo lắng, suy nghĩ nhiều", "Tỳ"), o("Buồn, đau khổ", "Phế"), o("Vui mừng quá độ", "Tâm"),
        ]),
        multi("tinh_duc", "Tình dục", [
          o("Giảm libido", "Thận dương hư"), o("Liệt dương", "Thận dương hư"), o("Xuất tinh sớm"),
          o("Mệt, chóng mặt sau xuất tinh", "Thận hư"), o("Đau đầu sau cực khoái (nữ)"),
        ]),
      ],
    },
    {
      key: "phukhoa", title: "13. Phụ khoa (nữ)",
      fields: [
        single("kinh_chu_ky", "Chu kỳ kinh", [
          o("Đều, bình thường"), o("Kinh sớm (trước kỳ)", "Huyết nhiệt hoặc khí hư"), o("Kinh muộn (sau kỳ)", "Hàn, huyết ứ hoặc huyết hư"),
          o("Rong kinh, rong huyết"), o("Bế kinh"), o("Đã mãn kinh"),
        ]),
        multi("kinh_tinh", "Tính chất kinh, đới hạ", [
          o("Màu đỏ tươi, lượng nhiều", "Huyết nhiệt", ["NHIET"]),
          o("Màu nhạt, lượng ít, đau sau hành kinh", "Khí huyết thiếu", ["HU"]),
          o("Màu thẫm, có cục, đau trước hành kinh", "Huyết ứ, hàn, khí huyết không thông"),
          o("Màu tím đen, thành khối, đau bụng", "Huyết ứ"),
          o("Khí hư nhiều, loãng", "Tỳ Thận hư hàn", ["HU", "HAN"]),
          o("Khí hư vàng hôi, ngứa", "Thấp nhiệt", ["NHIET"]),
          o("Đang mang thai"),
        ]),
      ],
    },
    {
      key: "nhikhoa", title: "14. Nhi khoa",
      fields: [
        multi("nhi", "Trẻ em", [
          o("Sinh thường, đủ tháng"), o("Sinh non, nhẹ cân"), o("Chậm biết đi, nói"),
          o("Thóp chậm đóng"), o("Đã tiêm chủng đủ"), o("Chưa tiêm chủng đủ"),
          o("Đã qua sởi"), o("Đã qua thủy đậu"), o("Đã dùng thuốc bổ dưỡng"),
        ]),
      ],
    },
  ],
};

// ---------- THIẾT ----------
const POS: [string, string][] = [
  ["tt", "Tả thốn (Tâm, Tiểu trường)"], ["tq", "Tả quan (Can, Đởm)"], ["tx", "Tả xích (Thận âm, Bàng quang)"],
  ["ht", "Hữu thốn (Phế, Đại trường)"], ["hq", "Hữu quan (Tỳ, Vị)"], ["hx", "Hữu xích (Mệnh môn, Thận dương)"],
];
const THIET: Group = {
  key: "thiet",
  title: "Thiết chẩn (bắt mạch, sờ nắn)",
  sub: "Mạch chẩn theo 6 bộ vị và 8 thông số; xúc chẩn da thịt, tay chân, bụng",
  sections: [
    {
      key: "dkmach", title: "Điều kiện bắt mạch",
      intro: "Bệnh nhân nghỉ ngơi khoảng 15 phút, tốt nhất buổi sáng chưa ăn. Không nên bắt mạch khi quá no, đói, uống rượu, vừa đi xa. Ba mức ấn: phù (nông), trung (Vị khí), trầm (tạng).",
      fields: [
        multi("mach_dk", "Điều kiện thực tế", [
          o("Đã nghỉ ngơi trước khi bắt mạch"), o("Vừa ăn no"), o("Đang đói"), o("Vừa vận động, đi xa"),
          o("Có uống rượu"), o("Môi trường ồn"), o("Mạch 2 tay chênh lệch nhiều"),
        ]),
      ],
    },
    {
      key: "machtong", title: "Mạch tổng quát (tổng khán)",
      fields: [
        multi("mach_tong", "Mạch tượng chung", PULSES, "Chọn các mạch tượng thấy rõ khi tổng khán; kiêm mạch như Phù Sác, Trầm Trì thì chọn nhiều mạch."),
        single("mach_vl", "Mạch có lực hay không", [o("Hữu lực"), o("Vô lực")]),
        single("mach_nhip", "Nhịp mạch", [o("Đều"), o("Không đều (kết, xúc, đại)")]),
        single("mach_vikhi", "Vị khí, thần, căn", [
          o("Có Vị khí, có thần, có căn (hòa hoãn, bộ xích trầm hữu lực)"), o("Thiếu Vị khí hoặc thiếu căn"),
        ]),
      ],
    },
    {
      key: "machbo", title: "Mạch theo từng bộ vị (đơn khán)",
      intro: "Tả: huyết (Tâm, Can, Thận âm). Hữu: khí (Phế, Tỳ, Mệnh môn). Bộ nào trái thường thì bộ ấy bệnh; mạnh là hữu dư, yếu là bất túc.",
      fields: POS.map(([k, l]) => multi(`mach_${k}`, l, PULSES)),
    },
    {
      key: "machtso", title: "Thông số mạch",
      intro: "Độ sâu phản ánh khí ra ngoài hay vào trong; độ mạnh: khí nhiều hay ít; độ cứng: khí uất kết; độ trơn: khí lưu thông; tần số: tốc độ huyết; đều đặn: Tâm luật; thể tích: huyết dịch; độ dài: khí đến nhiều hay ít.",
      fields: [
        single("p_sau", "Độ sâu", [o("Rất nông (phù)", "Khí phù việt ra ngoài", ["BIEU"]), o("Trung bình"), o("Rất sâu (trầm)", "Khí vào trong lý", ["LY"])]),
        single("p_manh", "Độ mạnh", [o("Rất yếu", "Khí ít", ["HU"]), o("Trung bình"), o("Rất mạnh", "Khí nhiều", ["THUC"])]),
        single("p_cung", "Độ cứng", [o("Rất mềm", "Khí uất kết ít"), o("Trung bình"), o("Rất cứng, căng", "Khí uất kết nhiều")]),
        single("p_tron", "Độ trơn", [o("Rất rít (sít)", "Khí bị cản trở"), o("Trung bình"), o("Rất trơn", "Khí hành lưu lợi")]),
        single("p_tan", "Tần số", [o("Rất chậm", "Huyết hành chậm: khí hư, hàn, trệ", ["HAN"]), o("Trung bình"), o("Rất nhanh", "Huyết hành nhanh: khí vượng hoặc nhiệt", ["NHIET"])]),
        single("p_deu", "Đều đặn", [o("Đều"), o("Không đều", "Tâm khí loạn: Tâm khí hư, Tâm huyết ứ, đàm nhiệt nhiễu Tâm…")]),
        single("p_thetich", "Thể tích (độ rộng)", [o("Rất nhỏ", "Âm, huyết, tinh, tân dịch ít", ["HU"]), o("Trung bình"), o("Rất to", "Âm, huyết, tinh, tân dịch nhiều")]),
        single("p_dai", "Độ dài", [o("Rất ngắn", "Khí hư hoặc có tắc trở"), o("Trung bình"), o("Rất dài", "Khí đến nhiều hoặc uất kết")]),
      ],
    },
    {
      key: "xucchan", title: "Xúc chẩn (sờ nắn)",
      fields: [
        multi("xuc_da", "Da thịt", [
          o("Sờ nóng ngay, càng lâu càng nóng", "Thực chứng, biểu nhiệt", ["THUC", "BIEU", "NHIET"]),
          o("Sờ nóng, ấn sâu mát", "Trong hư ngoài thực"),
          o("Lòng bàn tay nóng, da nóng bừng không sốt", "Hư nhiệt", ["HU", "NHIET"]),
          o("Da khô táo", "Tân dịch giảm, ứ huyết"),
          o("Phù ấn lõm còn", "Thủy thũng"), o("Phù ấn lõm nổi đầy ngay", "Khí thũng"),
          o("Da thịt săn chắc vừa phải", "Khí huyết sung mãn"),
          o("Da thịt nhão", "Tỳ Vị hư hàn", ["HU", "HAN"]),
          o("Da thịt quá dày", "Thấp, thấp nhiệt"),
          o("Lỗ chân lông thưa, hở", "Dễ ngoại cảm (Phế khí hư)"),
          o("Gân cơ căng như dây đàn", "Tà xâm nhập, ứ huyết"),
        ]),
        multi("xuc_chi", "Tay chân", [
          o("Tay chân lạnh, sợ lạnh", "Dương hư", ["HU", "HAN"]), o("Tay chân nóng", "Nhiệt thịnh", ["NHIET"]),
          o("Nóng ở mu bàn tay", "Biểu nhiệt, ngoại cảm", ["BIEU", "NHIET"]),
          o("Nóng ở lòng bàn tay", "Nội thương"),
        ]),
        multi("xuc_bung", "Phúc chẩn (bụng)", [
          o("Thiện án (thích xoa ấn)", "Hư", ["HU"]), o("Cự án (không thích ấn)", "Thực", ["THUC"]),
          o("Có khối rắn, đau, không di chuyển", "Giun, huyết ứ"),
          o("Lúc có lúc tan, không nơi nhất định", "Khí trệ"),
          o("Bụng mềm"), o("Bụng căng, gồng cứng"), o("Bụng trướng như trống"),
          o("Đau ấn thượng vị"), o("Đau ấn quanh rốn"), o("Đau ấn hạ vị"), o("Đau ấn hạ sườn"),
        ]),
        multi("xuc_huyet", "Ấn huyệt, A thị", [
          o("Có điểm đau A thị (ghi vị trí ở ghi chú)"), o("Điểm đau chẩn đoán trên đường kinh (ghi tên kinh ở ghi chú)"),
          o("Co cứng cơ cạnh sống"), o("Có nút cứng, dây cứng ở cơ"),
        ]),
      ],
    },
  ],
};

export const GROUPS: Group[] = [VONG, VAN, VANHOI, THIET];

// Mỗi mục khám phải có lựa chọn "bình thường" đứng đầu: người bệnh không phải mục nào cũng bất thường.
// Chọn "bình thường" là bác sĩ đã khám mục đó và không thấy gì lạ (khác với để trống = chưa khám).
export const NORMAL_V = "binh_thuong";
const NORMAL: Record<string, string> = {
  hinh_tuthe: "Bình thường (tư thế, vận động tự nhiên)",
  dau: "Bình thường (đầu, tóc không bất thường)",
  mat: "Bình thường (mặt cân đối, không phù)",
  mat_khieu: "Bình thường (mắt sáng, không đỏ, không sưng)",
  mui: "Bình thường (không nghẹt, không chảy dịch)",
  moi: "Bình thường (môi hồng nhuận)",
  chi: "Bình thường (tứ chi không sưng, không biến dạng)",
  mong: "Bình thường (móng hồng nhuận)",
  nguteh: "Bình thường",
  da: "Bình thường (da nhuận, không phát ban, không phù)",
  ho: "Không ho",
  khi_nghich: "Không có",
  mo_hoi: "Mồ hôi bình thường",
  han_nhiet: "Bình thường (không sợ lạnh, không sợ nóng)",
  vi_giac: "Vị giác bình thường",
  khat: "Bình thường (khát vừa, uống nước vừa phải)",
  kieu_dau: "Không đau",
  dau_dau: "Không đau đầu",
  dau_than: "Bình thường (mặt và thân mình không đau, không bất thường)",
  nguc: "Bình thường (ngực không đau, không tức)",
  bung: "Bình thường (bụng không đau, không chướng)",
  hoi_chi: "Bình thường (tay chân không tê, không đau, không yếu)",
  met_moi: "Không mệt mỏi bất thường",
  hoi_tai_mat: "Tai mắt bình thường",
  cam_xuc: "Cảm xúc bình thường",
  tinh_duc: "Bình thường",
  kinh_tinh: "Bình thường",
  xuc_da: "Bình thường (da ấm vừa, không nóng, không lạnh)",
  xuc_chi: "Bình thường (tay chân ấm)",
  xuc_bung: "Bình thường (bụng mềm, không đau khi ấn)",
  xuc_huyet: "Không có điểm đau",
  mach_tong: "Bình mạch (hòa hoãn, có Vị khí, có thần, có căn)",
};
for (const g of GROUPS) for (const sec of g.sections) for (const f of sec.fields) {
  const label = NORMAL[f.key];
  if (label && !f.opts.some((x) => x.v === NORMAL_V)) f.opts.unshift({ v: NORMAL_V, label });
}

// ---------- Lưu và đọc ----------
export type TuChanData = Record<string, { v: string[]; n?: string }>;

export const fieldName = (key: string) => `t_${key}`;
export const noteName = (key: string) => `n_${key}`;
export const groupNoteName = (g: string) => `g_${g}`;

export function allFields(): Field[] {
  return GROUPS.flatMap((g) => g.sections.flatMap((s) => s.fields));
}

// Đọc từ form theo danh mục (bỏ giá trị lạ). Trả JSON chuỗi hoặc null nếu trống.
export function parseTuChanForm(fd: FormData): string | null {
  const out: TuChanData = {};
  for (const f of allFields()) {
    const allowed = new Set(f.opts.map((x) => x.v));
    const vals = (f.kind === "multi" ? fd.getAll(fieldName(f.key)) : [fd.get(fieldName(f.key))])
      .filter((x): x is string => typeof x === "string" && allowed.has(x));
    const noteRaw = fd.get(noteName(f.key));
    const n = typeof noteRaw === "string" ? noteRaw.trim().slice(0, 500) : "";
    if (vals.length || n) out[f.key] = { v: [...new Set(vals)], ...(n ? { n } : {}) };
  }
  return Object.keys(out).length ? JSON.stringify(out) : null;
}

export function readTuChan(raw: string | null | undefined): TuChanData {
  if (!raw) return {};
  try { const d = JSON.parse(raw); return d && typeof d === "object" ? (d as TuChanData) : {}; } catch { return {}; }
}

export type Summary = {
  rows: { group: string; section: string; field: string; labels: string[]; note?: string }[];
  hints: { field: string; label: string; hint: string }[];
  cuong: Record<Tag, string[]>;
  text: string;
  count: number;
};

export function summarize(data: TuChanData): Summary {
  const rows: Summary["rows"] = [];
  const hints: Summary["hints"] = [];
  const cuong: Record<Tag, string[]> = { BIEU: [], LY: [], HAN: [], NHIET: [], HU: [], THUC: [], AM: [], DUONG: [] };
  const parts: string[] = [];
  let count = 0;
  for (const g of GROUPS) for (const s of g.sections) for (const f of s.fields) {
    const d = data[f.key];
    if (!d) continue;
    const chosen = f.opts.filter((x) => d.v.includes(x.v));
    if (!chosen.length && !d.n) continue;
    count += chosen.length;
    rows.push({ group: g.title, section: s.title, field: f.label, labels: chosen.map((c) => c.label), note: d.n });
    for (const c of chosen) {
      if (c.hint) hints.push({ field: `${s.title} · ${f.label}`, label: c.label, hint: c.hint });
      for (const t of c.tags ?? []) cuong[t].push(`${f.label === "Triệu chứng" ? s.title.replace(/^\d+\.\s*/, "") : f.label}: ${c.label}`);
      parts.push(c.label);
    }
    if (d.n) parts.push(d.n);
  }
  return { rows, hints, cuong, text: parts.filter(Boolean).join("; "), count };
}
