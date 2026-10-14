// Chẩn đoán học YHCT (ĐHYD.HCM, 321 trang, 3581 đoạn) batch 1: Chủ luận +
// Vọng Thần + Vọng Sắc Diện (Chương 1, Bài 1 Vọng chẩn, phần đầu). Đây là
// giáo trình chẩn đoán học rất chi tiết và hệ thống — sẽ xử lý qua nhiều batch
// nối tiếp. Trích/diễn giải trung thực theo nguồn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 1 (Tứ chẩn), Bài 1 Vọng chẩn: Chủ luận, Vọng Thần, Vọng Sắc Diện",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Chẩn đoán học YHCT — Chủ luận (nguyên tắc và nội dung chẩn đoán)",
      category: cat,
      summary: "3 nguyên tắc lớn của chẩn đoán học YHCT: Thẩm sát nội ngoại, Biện chứng cầu nhân, Tứ chẩn hợp tham. Nội dung chủ yếu gồm Tứ chẩn, Bát cương, Biện chứng.",
      content:
        "ĐỊNH NGHĨA: Chẩn đoán học YHCT được tiến hành dưới sự chỉ đạo của lý luận cơ bản, dùng để chẩn đoán, biện biệt chứng hầu của bệnh tật. Nội Kinh gọi là 'chẩn pháp', chủ yếu gồm vọng, văn, vấn, thiết (tứ chẩn). " +
        "NGUYÊN TẮC 1 — THẨM SÁT NỘI NGOẠI: Con người là một chỉnh thể, da thịt gân mạch xương cốt kinh lạc đều liên quan tạng phủ (tạng phủ làm trung tâm, kinh lạc là đường nối trong-ngoài). Bệnh cục bộ có thể ảnh hưởng toàn thân và ngược lại; kích thích tinh thần ảnh hưởng tạng phủ, bệnh tạng phủ cũng cải biến hoạt động tinh thần. Con người và tự nhiên tương ứng — thời tiết, địa phương, điều kiện sinh hoạt, hoàn cảnh tinh thần đều cần thẩm sát. " +
        "NGUYÊN TẮC 2 — BIỆN CHỨNG CẦU NHÂN: Nguyên tắc cơ bản — căn cứ chứng hầu cụ thể (cảm giác chủ quan bệnh nhân + kết quả tứ chẩn) để phân tích tổng hợp tìm bản chất bệnh, làm căn cứ điều trị. Chữ 'Nhân' hiểu rộng: ngoài lục dâm/thất tình/ẩm thực/lao quyện, còn bao hàm 'chứng kết' (sản phẩm bệnh lý) như khí uất, ứ huyết, đàm ẩm, trùng tích — là nhân tố gây bệnh nội tại quan trọng trong điều trị. Ví dụ: sốt + ố hàn + đau đầu + mạch phù + rêu trắng mỏng + bệnh mới phát → sơ bộ là ngoại cảm biểu chứng; thêm mạch phù khẩn/lưỡi không đỏ/không khát → phong hàn; mạch phù sác/lưỡi đỏ/khát → phong nhiệt. " +
        "NGUYÊN TẮC 3 — TỨ CHẨN HỢP THAM: không được dùng 1 chẩn pháp thay thế cả 4. Vấn chẩn tìm quá trình bệnh; Văn chẩn nghe tiếng nói/khí vị; Vọng chẩn xem hình thái thần sắc; Thiết chẩn xem mạch và các vị trí khác. Có khi cần 'xá mạch tùng chứng' hoặc 'xá chứng tùng mạch' (bỏ một bên để theo bên kia) khi có hiện tượng chân-giả. " +
        "NỘI DUNG CHỦ YẾU: (1) Tứ chẩn — Vọng (quan sát thần sắc hình thái ngũ quan lưỡi dịch tiết), Văn (nghe tiếng nói/hơi thở/ngửi mùi), Vấn (hỏi bệnh nhân/gia thuộc), Thiết (chẩn mạch và các vị trí khác). (2) Bát cương — âm dương, biểu lý, hàn nhiệt, hư thực (Trương Cảnh Nhạc gọi là 'Âm dương lục biến'): hàn nhiệt phân biện thuộc tính bệnh, biểu lý phân biện vị trí nông sâu, hư thực phân biện chính tà thịnh suy, âm dương là tổng cương phân loại bệnh. (3) Biện chứng — biện bệnh nhân (nguyên nhân), biện khí huyết tân dịch, biện tạng phủ kinh lạc, biện lục kinh, vệ khí dinh huyết, tam tiêu biện chứng — đều dựa trên cơ sở bát cương biện chứng mà biến hóa ra.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Thần — Đắc thần, Thất thần, Giả thần",
      category: cat,
      summary: "Thần là hoạt động sống của cơ thể (nghĩa rộng) hoặc hoạt động tinh thần (nghĩa hẹp). 3 trạng thái: Đắc thần (bệnh nhẹ), Thất thần (bệnh nặng, dự hậu xấu), Giả thần ('hồi quang phản chiếu' — sắp lâm chung).",
      content:
        "KHÁI NIỆM THẦN: nghĩa rộng là biểu hiện ngoại tại hoạt động sống của chỉnh thể (= sinh mệnh); nghĩa hẹp là hoạt động tinh thần. Thần không ly khai hình thể mà tồn tại độc lập — 'hình thần hợp nhất', hình kiện thì thần vượng, hình suy thì thần mệt. Nguồn gốc: từ tiên thiên chi tinh ('lưỡng tinh tương bác vị chi thần' — Linh khu Bản thần), nhưng dựa vào hậu thiên chi tinh (tinh của thủy cốc) để tư dưỡng. Quan hệ Tinh-Khí-Thần: tinh sinh thần, thần ngự tinh; khí sinh thần, thần ngự khí — tinh xung khí túc thần vượng là khỏe mạnh, tinh khuy khí suy thần hao là lão hóa. Nơi biểu hiện thần rõ nhất là mục quang (ánh mắt — 'cửa sổ tâm linh'). " +
        "ĐẮC THẦN (hữu thần): tinh xung khí túc thần vượng — bệnh nhẹ, chính khí chưa tổn thương. Biểu hiện: thần trí tỉnh táo mạch lạc, tiếng nói rõ, mục quang sáng, sắc mặt vinh nhuận, tư thế khoan thai, phản ứng nhạy, động tác linh hoạt, hơi thở đều, cơ bắp không teo. Phân theo tạng: thần trí tỉnh táo + giọng trong rõ + sắc diện vinh nhuận = tinh khí Tâm đầy đủ; mắt sáng + phản ứng nhạy + tư thế tự nhiên = tinh khí Can Thận sung túc; hơi thở đều + cơ nhục không teo = tinh khí Tỳ Phế đầy đủ. " +
        "THẤT THẦN (vô thần): tinh tổn khí khuy thần suy — bệnh giai đoạn nghiêm trọng. Biểu hiện: thần trí u mê/nói lộn xộn/vuốt áo sờ giường, mắt u tối đờ đẫn, sắc diện u tối, phản ứng chậm, động tác không linh hoạt, hơi thở bất thường, teo cơ. Phân theo tạng: thần hôn nói nhảm + sắc mặt u tối = tinh khí Tâm suy bại; mắt đờ đẫn + phản ứng chậm = tinh khí Can Thận suy; hơi thở khác thường + teo cơ = tinh khí Tỳ Phế suy kiệt. Vuốt áo sờ giường/bắt chuồn chuồn/thần hôn chiêm ngữ là tà khí hãm Tâm bào, âm dương ly quyết — chứng nghiêm trọng. " +
        "GIẢ THẦN: hiện tượng tinh thần tạm thời tốt lên ở bệnh nguy kịch — dự báo sắp lâm chung ('hồi quang phản chiếu', 'tàn đăng phục minh'). Biểu hiện: bệnh nặng lâu ngày vốn thất thần đột nhiên mắt sáng lên, nói không ngớt, muốn gặp người thân; hoặc tiếng nói/hơi thở yếu đứt đoạn đột nhiên trong cao lại; hoặc sắc mặt u tối đột nhiên hai gò má đỏ như đánh phấn; hoặc tự nhiên đói ăn nhiều sau khi không ăn được. Cơ chế: tinh khí suy kiệt cùng cực, âm bất liễm dương, hư dương ngoại việt. " +
        "THẦN KHÍ BẤT TÚC (biểu hiện nhẹ của thất thần, ở hư chứng): tinh thần không phấn chấn, hay quên, buồn ngủ, tiếng nói nhỏ lười nói, uể oải vô lực, động tác chậm — đa số thuộc Tâm Tỳ lưỡng hư hoặc Thận dương bất túc. " +
        "TINH THẦN DỊ THƯỜNG: Phiền táo bất an/thần hôn nói nhảm — đa số do tà khách Tâm bào hoặc nhập Thận (phiền thuộc nhiệt). Điên bệnh — đạm bạc ít nói, u uất không vui, nói lảm nhảm một mình, cười khóc vô thường, đa số do đàm khí uất kết trở trệ thần minh, hoặc thần bất thủ xá do Tâm Tỳ lưỡng hư. Cuồng bệnh — điên cuồng hung hãn đánh chửi, đập phá, leo cao hát, cởi quần áo chạy lung tung, tự cho mình cao quý, không ăn không ngủ; đa số do khí uất hóa hỏa/đàm hỏa nhiễu Tâm, hoặc Dương minh nhiệt thịnh, hoặc súc huyết ứ trở che lấp thần minh. Giản bệnh (động kinh) — đột ngột hôn đảo, sùi bọt mép, tứ chi co giật, tỉnh lại như thường; đa số do Can phong kẹp đàm đi lên che lấp thanh khiếu, hoặc đàm hỏa nhiễu Tâm, Can phong nội động.",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vọng Sắc Diện — nguyên lý, bộ vị, thập pháp, ngũ sắc chủ bệnh",
      category: cat,
      summary: "Sắc diện là ngoại vinh của khí huyết tạng phủ. Ngũ sắc ứng ngũ tạng (xanh-Can, đỏ-Tâm, vàng-Tỳ, trắng-Phế, đen-Thận). 'Thập pháp vọng sắc' và phân biệt Thường sắc/Bệnh sắc, Thiện sắc/Ác sắc.",
      content:
        "NGUYÊN LÝ: 'Khí do tạng phát, sắc tùy khí hóa' (Tố Vấn) — sắc trạch là ngoại vinh của khí huyết tạng phủ, qua kinh lạc vinh hiện ở mặt. Ngũ tạng ứng ngũ sắc: Thanh(xanh)-Can, Xích(đỏ)-Tâm, Hoàng(vàng)-Tỳ, Bạch(trắng)-Phế, Hắc(đen)-Thận. Quan hệ Khí-Sắc: khí là sinh cơ ẩn trong bì phu, sắc là huyết sắc nổi ngoài da — có khí phải có sắc, có sắc phải có khí; 'khí chí sắc bất chí giả sinh, sắc chí khí bất chí giả tử' (được khí mà chưa được sắc thì sống, được sắc mà mất khí thì chết) — khí quan trọng hơn sắc. Quan hệ Thần-Sắc: 'thần vượng tắc sắc vượng, thần suy tắc sắc suy'. " +
        "BỘ VỊ TƯƠNG QUAN MẶT-TẠNG PHỦ (theo Linh khu - Ngũ sắc): Đình (trán) - đầu mặt; Khuyết thượng - hầu họng; Khuyết trung/ấn đường - Phế; Khuyết hạ/sơn căn - Tâm; dưới sơn căn/niên thọ - Can; hai bên Can - Đởm; dưới Can/chuẩn đầu - Tỳ; hai bên Tỳ - Vị; quyền hạ - Đại trường; kẹp Đại trường - Thận; minh đường/đầu mũi lên trên - Tiểu trường; dưới minh đường - Bàng quang, Tử xứ. Cách khác (Tố Vấn - Thích nhiệt): má trái-Can, má phải-Phế, trán-Tâm, cằm-Thận, mũi-Tỳ (dùng tham khảo). " +
        "THẬP PHÁP VỌNG SẮC (Uông Hồng, dựa Nội Kinh): Phù (sắc ở ngoài da, chủ bệnh tại biểu) / Trầm (sắc ẩn trong da, chủ bệnh tại lý); Thanh (trong sáng, chủ bệnh tại dương) / Trọc (u tối, chủ bệnh tại âm); Vi (nhạt, chủ khí hư) / Thâm (đậm, chủ tà khí thịnh); Tán (dàn trải, chủ bệnh gần khỏi) / Bác (úng trệ, chủ bệnh lâu ngày tụ dần); Trạch (nhuận, chủ sống) / Yểu (khô héo, chủ chết). Thập pháp biện biểu lý-âm dương-hư thực-lâu mới-thành bại; ngũ sắc biện 'sắc của khí'. " +
        "THƯỜNG SẮC: sắc trạch sinh lý bình thường, biểu thị tinh thần khí huyết tân dịch sung doanh. Người Á Đông: hồng vàng mờ ảo ẩn chứa minh nhuận (thần khí = quang minh nhuận trạch; vị khí = ẩn hiện sắc vàng kín đáo). Chủ sắc — đặc trưng cá thể, không đổi suốt đời (do di truyền/bẩm phú theo ngũ hành hình người). Khách sắc — biến đổi theo tứ thời/ngày đêm/thời tiết (xuân hơi xanh, hạ hơi đỏ, trưởng hạ vàng, thu trắng, đông hơi đen). " +
        "BỆNH SẮC: sắc trạch phản thường. Ngũ sắc thiện-ác: sáng nhuận trạch = thiện sắc (vị khí còn, dự hậu tốt, 'khí chí'); u tối khô héo = ác sắc (tạng phủ bại hoại, vị khí suy kiệt, 'khí bất chí'). Mô tả kinh điển (Tố Vấn - Ngũ tạng sinh thành): thiện sắc — xanh như lông chim phỉ thúy, đỏ như mồng gà, vàng như bụng cua, trắng như mỡ heo, đen như lông quạ; ác sắc — xanh như tàu lá, đỏ như cục máu đông, vàng như chỉ thực khô, trắng như xương khô, đen như mồ hóng. Bệnh-sắc giao thoa: chính bệnh chính sắc (bệnh và sắc tương ứng theo ngũ hành) là bình thường; sắc tương sinh với bệnh = thuận chứng; sắc tương khắc với bệnh = nghịch chứng (ví dụ Can bệnh sắc xanh = chính sắc; thấy đen/đỏ = tương sinh, thuận; thấy vàng/trắng = tương khắc, nghịch). " +
        "NGŨ SẮC CHỦ BỆNH: Thanh (xanh) — chủ hàn chứng, thống chứng, ứ huyết, kinh phong (hàn ngưng khí trệ huyết ứ kinh mạch co thắt); trẻ em kinh phong thấy xanh quanh mày/mũi/miệng; phụ nữ mặt xanh là Can cường Tỳ nhược; mặt xanh tai đỏ đa số Can hỏa; Tỳ bệnh gặp sắc xanh đa số khó chữa. Xích (đỏ) — chủ nhiệt chứng (đỏ thẫm = thực nhiệt, hơi đỏ = hư nhiệt); lưỡng quyền triều hồng về chiều = âm hư hỏa vượng; sắc mặt nhợt nhạt mà lưỡng quyền đỏ như đánh phấn (di chuyển vô định) = hư dương phù việt, chứng 'đái dương' chân hàn giả nhiệt rất nguy hiểm; Phế bệnh thấy đỏ đa số khó chữa. Hoàng (vàng) — chủ hư chứng, thấp chứng (Tỳ hư thấp uẩn); vàng nhạt khô héo = 'ủy hoàng' (Tỳ Vị khí suy); vàng hư phù = 'hoàng bạng' (Tỳ khí hư thấp tà nội trở); vàng toàn thân = 'hoàng đản' — vàng tươi như vỏ quýt = dương hoàng (thấp nhiệt hun chưng), vàng tối như ám khói = âm hoàng (hàn thấp uất trở).",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 3 chủ đề Chẩn đoán học YHCT batch 1 (Chủ luận, Vọng Thần, Vọng Sắc Diện).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
