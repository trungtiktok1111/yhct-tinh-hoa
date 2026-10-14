// Thêm "Nguyên nhân gây bệnh" (ThS Võ Thanh Phong, 68 slide) vào Lý luận cơ bản:
// Cơ chế phát bệnh, Lục dâm, Thất tình, Bất nội ngoại nhân, Nội tà (nội sinh ngũ
// tà), Sản phẩm bệnh lý. Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Nguyên nhân gây bệnh",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong — dẫn Trần Quốc Bảo (2010) Lý luận cơ bản YHCT; Bành Văn Khìu (2002); Giovanni Maciocia (2015); Lý Đông Viên (2008) Nội ngoại thương biện hoặc luận",
      locator: "68 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Nguyên nhân gây bệnh - Bệnh cơ";

  await prisma.theoryTopic.create({
    data: {
      name: "Cơ chế phát bệnh",
      category: cat,
      summary: "Đấu tranh chính-tà là cơ sở phát bệnh; bệnh có nhiều loại hình phát bệnh và quy luật chuyển hóa/truyền biến.",
      content:
        "Phát bệnh: do đấu tranh chính tà — chính khí bất túc + tà khí gây bệnh quyết định tính chất/kiểu/đặc điểm phát bệnh (bệnh tính, vị trí bệnh). " +
        "Nhân tố ảnh hưởng phát bệnh — Bên ngoài: khí hậu (Lục khí → Lục dâm; tương ứng thiên nhân), địa lý (khí hậu/thổ nhưỡng/sản vật/tập quán khác nhau), hoàn cảnh sinh hoạt. Bên trong: thể chất, tinh thần, dinh dưỡng/rèn luyện, tiên thiên. " +
        "Loại hình phát bệnh: Đột phát, Phục phát, Tự phát, Kế phát (bệnh cũ chưa khỏi + bệnh mới), Hợp bệnh và Tính bệnh, Phúc phát (tái phát). " +
        "Chuyển hóa: Tà chính thịnh suy → chuyển hóa hư thực (tà trục chính suy; tà thịnh chính hư; tà chính cầm cự; chính hư tà lui) và phát triển/hồi phục; cũng có chuyển hóa hàn nhiệt. " +
        "Truyền biến: Xuất nhập bệnh tà (biểu tà nhập lý; lý bệnh xuất biểu). Truyền biến vị trí — theo kinh mạch (âm dương, biểu lý, thủ túc), theo tam tiêu/vệ khí dinh huyết, theo tạng phủ.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Lục dâm (6 tà khí ngoại cảm)",
      category: cat,
      summary: "Lục khí (Phong/Hàn/Thử/Thấp/Táo/Hỏa) khi thái quá/bất cập hoặc đến sai thời trở thành Lục dâm — tà khí gây bệnh từ ngoài vào.",
      content:
        "Khái niệm: Lục khí là khí hậu bình thường giúp vạn vật phát triển, cơ thể thích ứng được. Lục dâm là Lục khí thái quá/bất cập, hoặc 'thời chưa đến mà khí đến', hoặc khí hậu biến hóa quá nhanh. Tính chất Lục dâm gần giống Lục khí; đặc điểm gây bệnh liên hệ đặc tính Lục khí; cần phân biệt ngoại cảm Lục dâm với nội sinh Ngũ tà. " +
        "Đặc tính chung của tà khí ngoại cảm: tính ngoại cảm (xâm nhập qua cơ biểu, miệng, mũi vào trong); tính theo mùa; tính khu vực; tính kết hợp; tính biến hóa. Con đường xuất-nhập ngoại tà: Nhập qua bì mao, mũi-họng, ăn uống, giao hợp, dị vật xuyên thấu; Xuất qua phát hãn, hắt hơi-ho, dũng thổ (nôn), tả hạ, lợi thủy, âm đạo, chích lể. " +
        "PHONG tà (dương tà, chủ khí mùa xuân, Mộc khí thông Can): tính nhẹ, thăng tán, khai tiết; di chuyển, biến hóa; chủ động; các tà khác thường dựa vào Phong để xâm nhập. " +
        "HÀN tà (âm tà, chủ khí mùa đông, Thủy khí thông Thận): dễ tổn thương dương khí; tính ngưng trệ; tính thu dẫn; Hàn thủy tràn lan gây phù thũng. " +
        "THỬ tà (dương tà, chủ khí mùa hạ — từ hạ chí đến lập thu; có dương thử/âm thử): tính hỏa nhiệt; tính thăng tán; thương tân hao khí, nhiễu động tâm thần; thường kèm Thấp. " +
        "THẤP tà (âm tà, chủ khí Trưởng hạ, tương ứng Tỳ thổ — Tỳ vừa vận thấp vừa sợ thấp): làm trệ khí cơ; tính trọng trọc; tính niêm trệ (dính, khó trừ); tính hạ hãm (có xu hướng đi xuống). " +
        "TÁO tà (dương tà trong âm — có ôn táo, lương táo; chủ khí mùa thu, tương ứng Phế): tính khô sáp, dễ thương tân dịch; dễ thương Phế. " +
        "HỎA tà (dương tà, hỏa vượng mùa hạ — xuân phân/thanh minh/cốc vũ/lập hạ; chủ khí mùa hạ, tương ứng Tâm): dễ thương tân hao khí; tính thượng viêm; dễ sinh phong, động huyết; nhiễu tâm thần; dễ gây lở loét.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Thất tình (7 cảm xúc gây bệnh)",
      category: cat,
      summary: "Thất tình (hỉ, nộ, ưu, tư, bi, kinh, khủng) khi vượt mức bình thường tác động trực tiếp đến tạng phủ gây bệnh — khác Lục dâm (vốn xâm phạm biểu trước khi vào tạng phủ).",
      content:
        "Tác nhân gây bệnh từ bên trong là nhân tố tình chí/hành vi vượt mức bình thường, tác động trực tiếp tạng phủ. Thất tình: hỉ, nộ, ưu, tư, bi, kinh, khủng — bình thường phản ánh tình chí khác nhau do tác động sự vật bên ngoài, không gây bệnh nếu ở mức bình thường. " +
        "Cơ chế bệnh sinh: tình chí đột ngột mạnh và kéo dài, vượt quá mức điều tiết/chịu đựng của cơ thể thì gây bệnh. Thất tình ảnh hưởng TRỰC TIẾP tạng phủ; trái lại Lục dâm xâm phạm biểu rồi mới vào tạng phủ (đây là khác biệt cơ chế quan trọng). " +
        "Tình chí tác động lên tạng phủ cụ thể: Vui quá hại Tâm; Buồn quá hại Phế; Ưu tư quá hại Tỳ; Giận quá hại Can; Kinh khủng quá hại Thận. " +
        "Tình chí tác động hoạt động của Khí: Vui → khí hoãn (tán); Buồn → khí tiêu; Ưu tư → khí kết; Nộ (giận) → khí thượng; Khủng (sợ) → khí hạ; Kinh (hoảng) → khí loạn. " +
        "Chi tiết từng cảm xúc (theo Maciocia 2015): " +
        "GIẬN (Nộ) — ảnh hưởng Can, gây khí thượng: đau đầu, chóng mặt, ù tai, mặt đỏ, cứng cổ; nếu đè nén gây Can khí uất, dần thành Can dương vượng hoặc Can hỏa. " +
        "VUI MỪNG (Hỷ) — ảnh hưởng Tâm, gây khí hoãn: hồi hộp, kích động, mất ngủ, không yên, đầu lưỡi đỏ; vui mừng quá đột ngột cũng như Kinh. " +
        "BUỒN (Bi) — ảnh hưởng Phế và Tâm, gây khí tiêu: khó thở, mệt mỏi, khó chịu ở ngực, trầm cảm, khóc; đôi lúc gây Can huyết hư. " +
        "LO LẮNG (Ưu) — ảnh hưởng Phế và Tỳ, gây khí kết: (Phế) khó chịu ngực, khó thở nhẹ, vai co cứng, sắc mặt nhợt, thở dài; (Tỳ) chán ăn, cảm giác đầy. " +
        "SUY NGHĨ (Tư) — ảnh hưởng Tỳ, gây khí kết: chán ăn, khó chịu thượng vị, chướng bụng, mệt mỏi, sắc mặt nhạt. " +
        "SỢ (Khủng) — ảnh hưởng Thận, gây khí hạ: tiểu đêm, tiểu không tự chủ, tiêu chảy; đôi lúc gây khí thượng (hồi hộp, mất ngủ, đạo hãn, khô miệng, nóng phừng mặt). " +
        "HOẢNG (Kinh) — ảnh hưởng Tâm, gây khí loạn: hồi hộp, khó thở, mất ngủ.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bất nội ngoại nhân (nguyên nhân khác)",
      category: cat,
      summary: "Nhóm nguyên nhân không thuộc ngoại tà hay nội thương cảm xúc: lao nhàn, ăn uống, ngoại thương, bệnh do thuốc, bệnh do thầy thuốc, nhân tố tiên thiên.",
      content:
        "LAO NHÀN: lao động mức độ vừa phải giúp khí huyết lưu thông, cơ thể khỏe mạnh; nghỉ ngơi đúng giúp giải trừ mệt nhọc; lao động quá mức HOẶC an nhàn quá mức đều gây bệnh. Lao động thể lực quá mức kéo dài tổn thương khí; lao động trí óc quá mức tổn hao Tâm huyết, tổn thương Tỳ khí; phòng dục quá độ tổn hại tinh khí Thận; nhàn hạ quá mức làm vận hành khí huyết rối loạn → khí trệ huyết ứ. " +
        "ĂN UỐNG: ăn uống quá nhiều vượt khả năng vận hóa của Tỳ Vị gây ứ trệ, tổn thương Tỳ Vị — thực tích lâu ngày hóa nhiệt, tụ thấp thành đàm; quá đói không đủ sinh khí huyết; ăn uống không hợp vệ sinh gây bệnh trường vị, nhiễm ký sinh trùng; ăn thiên lệch 1 vị quá mức gây quá thừa/quá thiếu chất tương ứng. " +
        "NGOẠI THƯƠNG: bị thương do đạn/gươm dao/ngã/sai khớp — tổn thương trực tiếp gân/mạch/cơ/cốt hoặc tạng phủ → huyết ứ, gãy xương, trật khớp, xuất huyết; bị bỏng do nhiệt/lạnh; chết đuối, sét đánh; bị thương do trùng thú cắn. " +
        "BỆNH DO THUỐC: dùng thuốc quá liều; bào chế không đúng; phối ngũ không đúng; dùng không đúng phương pháp. " +
        "NHÂN TỐ TIÊN THIÊN: bẩm tố tiên thiên hình thành từ tinh cha + tinh mẹ lúc thụ thai/mang thai, bị ảnh hưởng bởi sức khỏe cha mẹ, tuổi của cha mẹ, tình trạng của cha/mẹ lúc thụ thai.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Nội tà (Nội sinh ngũ tà)",
      category: cat,
      summary: "5 loại tà khí sinh ra từ bên trong cơ thể (khác ngoại cảm): Nội phong, Nội hàn, Nội thấp, Nội táo, Nội hỏa — mỗi loại có nhiều nguyên nhân sinh ra và phân biệt rõ với dạng ngoại cảm tương ứng.",
      content:
        "NỘI PHONG — do Nhiệt cực sinh phong (nhiệt thiêu đốt huyết dịch), Can dương hóa phong, Âm hư sinh phong (âm không liễm được dương), Huyết hư sinh phong (huyết hư cân mạch thất dưỡng), Huyết táo sinh phong, Đàm ứ sinh phong. So Ngoại phong/Nội phong: Ngoại phong — ngoại cảm phong tà, lâm sàng phát sốt/sợ gió/mạch phù. Nội phong — do nhiệt cực (sốt cao, co quắp, cứng gáy), Can vượng (chóng mặt, run), âm hư (co quắp, run tay chân), huyết hư (chóng mặt, tê, run), huyết táo (da lông khô, ngứa ngoài da, móng khô), đàm ứ (mập bệu, liệt nửa người). " +
        "NỘI HÀN — phân Thực hàn/Hư hàn (và Biểu hàn/Lý hàn — biểu hàn nhập lý là ngoại hàn tà trực tiếp phạm vào lý như Vị/Trường/Bào cung; thực hàn tổn thương dương). So Thực hàn/Hư hàn: khởi phát (cấp/mạn), đau (cường độ cao co thắt/âm ỉ), lưỡi (rêu trắng dày/nhợt rêu trắng dày), mạch (khẩn trì hữu lực/trầm trì nhược). So Ngoại hàn/Nội hàn: Ngoại hàn — ngoại cảm hàn tà, phát sốt sợ lạnh đau đầu mạch phù khẩn, bụng lạnh đau ăn ít buồn nôn tiêu lỏng. Nội hàn — do Dương hư, biểu hiện sợ lạnh chân tay lạnh, tiêu lỏng lẫn thức ăn, tiểu trong nhiều, mệt mỏi thích nằm. " +
        "NỘI THẤP — do Tỳ không vận hóa thủy thấp, Phế không thông điều thủy đạo, Thận không khí hóa Bàng quang → tân dịch đọng lại thành thấp. So Ngoại thấp/Nội thấp: Ngoại thấp — ngoại cảm thấp tà, đầu nặng tứ chi nặng, cơ khớp đau nhức co duỗi khó. Nội thấp — do Tỳ/Phế/Thận, biểu hiện miệng nhớt, ăn kém, buồn nôn/nôn, bụng đầy, đại tiện lỏng, tiểu đục, đới hạ. " +
        "NỘI TÁO — do Âm hư (khác Táo tà ngoại cảm từ thuốc/thức ăn). So Ngoại táo/Nội táo: Ngoại táo — ngoại cảm táo tà, phát sốt sợ lạnh đau đầu mạch phù. Nội táo — do tân dịch tổn hao, biểu hiện người gầy khô, da khô sáp, yếu liệt. " +
        "NỘI HỎA — do Lục dâm (ngũ khí hóa hỏa/tà vào Dương minh hóa nhiệt), Ẩm thực (thức ăn/thuốc tính nhiệt tích tụ lâu ngày), Đàm thấp, Tình chí (ngũ chí uất kết cản trở dương khí vận hành), hoặc do Âm hư (dương vượng tương đối so âm). So Thực nhiệt/Hư nhiệt: cảm giác nóng (cả ngày/chiều); khát (nặng cả ngày/chiều-đêm uống ít); khô miệng (cả ngày/đêm); đắng miệng (có/không); tinh thần (bứt rứt nhiều/bứt rứt đêm); lưỡi (đỏ rêu vàng khô/đỏ không rêu); mạch (phù sác hữu lực/trầm sác vô lực). So Ngoại hỏa/Nội hỏa (Thực hỏa, Hư hỏa) và Âm thịnh cách dương: Ngoại hỏa — ngoại cảm phong nhiệt, sợ lạnh đau đầu mạch phù miệng khát mạch hồng sác. Thực hỏa (dương thịnh) — miệng khát, tiểu sậm, đại tiện táo, lưỡi đỏ, mạch hồng sác. Hư hỏa (âm hư nội nhiệt) — ngũ tâm phiền nhiệt, triều nhiệt, đạo hãn, lưỡi đỏ ít rêu, mạch vi sác. Âm thịnh cách dương — sốt thích ấm, khát thích uống ấm, lưỡi nhợt, tiểu trong (đây là hàn giả nhiệt, không phải hỏa thật).",
      keyPoints:
        "Phân biệt phát nhiệt do Nội thương và Ngoại cảm (Lý Đông Viên, Nội ngoại thương biện hoặc luận): Ngoại cảm (Thực) — sợ gió không cách nào giảm (tà nhập lý tự khỏi); sốt âm ỉ thoáng qua (hàn tà bế Vệ dương); ăn uống được; nóng mu bàn tay hơn lòng bàn tay; tắc/chảy mũi, giọng trầm đục; đau đầu liên tục (hết khi tà nhập lý); tứ chi co rút cử động khó khăn. Nội thương (Hư) — sợ gió nhưng vào nơi ấm thì hết; sốt giảm gần nơi mát (thấp khí từ Tỳ hạ xuống, Thận hỏa bốc lên); ăn uống kém; nóng lòng bàn tay hơn mu bàn tay; chán ăn, đoản hơi, biếng nói; đau đầu lúc có lúc không; tứ chi yếu sức, lười vận động.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Sản phẩm bệnh lý (Thủy ẩm thấp đàm, Huyết ứ, Kết thạch)",
      category: cat,
      summary: "Các sản phẩm bệnh lý sinh ra trong quá trình bệnh, sau đó lại trở thành nguyên nhân gây bệnh tiếp theo: Thủy-Ẩm-Thấp-Đàm (từ tân dịch ứ đọng/cô đặc), Huyết ứ, Kết thạch (sỏi).",
      content:
        "THỦY ẨM THẤP ĐÀM — đều có gốc từ Tân dịch bị ứ đọng/cô đặc ở các mức độ khác nhau: Thủy tràn ra bì phu (phần ngoài); Ẩm/Thấp/Đàm ở trong lý. Phân loại ẨM theo vị trí: Đàm ẩm (ở trường vị), Huyền ẩm (dưới mạn sườn), Dật ẩm (lan tràn tứ chi), Chi ẩm (đình tụ trong ngực). Tính chất: Thủy — chia Âm thủy/Dương thủy, dịch trong, tràn lan phần ngoài. Ẩm — dịch loãng, đình trệ khoang hốc, phần thấp. Thấp — dính nhớp không định hình, kết hợp ngũ khí gây bệnh. Đàm — chia vô hình và hữu hình. " +
        "So sánh Dật ẩm / Phong thủy: Dật ẩm — sợ lạnh, không mồ hôi, tiểu tiện thông lợi, phù rõ tứ chi/nửa người, đau nhức toàn thân. Phong thủy — ra mồ hôi, sợ gió, tiểu tiện không thông, phù từ mắt lan tứ chi/toàn thân. " +
        "HUYẾT Ứ — nguyên nhân: Hàn ngưng (hàn tà tính thu dẫn, tổn thương dương); Nhiệt kết (hư nhiệt/thực nhiệt đều hao tân → cô đặc huyết dịch, huyết vận hành khó); Khí uất/trệ (mạch lạc trống không → huyết hành khó); Khí hư; Huyết hư; Đàm thấp. " +
        "KẾT THẠCH (sỏi) — hình thành từ sự kết hợp của Đàm thấp + Huyết ứ + Trùng tích (trên nền Khí trệ huyết ứ).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 6 chủ đề Nguyên nhân gây bệnh (Cơ chế phát bệnh, Lục dâm, Thất tình, Bất nội ngoại nhân, Nội tà, Sản phẩm bệnh lý).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
