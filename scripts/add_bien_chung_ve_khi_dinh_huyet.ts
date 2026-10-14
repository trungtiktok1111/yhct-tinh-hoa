// Thêm "Biện chứng Vệ Khí Dinh Huyết" (ThS Võ Thanh Phong, 30 slide) vào Lý luận
// cơ bản. Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Biện chứng Vệ Khí Dinh Huyết",
      sourceType: "Bài giảng",
      authorOrOrg:
        "ThS.Bs. Võ Thanh Phong — dẫn Wen, Jian Min & Seifert, Garry (2009), Warm Disease Theory, Paradigm Publications",
      locator: "30 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Bát cương - Biện chứng";

  await prisma.theoryTopic.create({
    data: {
      name: "Ôn bệnh học — đại cương",
      category: cat,
      summary: "Ôn bệnh là bệnh do ôn tà gây ra, khởi phát có phát sốt, dễ hóa táo thương âm. Lịch sử hình thành hệ thống Ôn bệnh học và nguyên tắc điều trị theo Vệ-Khí-Dinh-Huyết và Tam tiêu.",
      content:
        "Lịch sử: Vương An Đạo (nhà Nguyên) phân biệt rõ quan niệm, cơ chế bệnh sinh và điều trị giữa Ôn bệnh và Thương hàn. Diệp Thiên Sĩ (nhà Thanh) có đóng góp quan trọng nhất cho sự hoàn thiện hệ thống Ôn bệnh học (đề ra biện chứng theo Vệ-Khí-Dinh-Huyết). Ngô Cúc Thông bổ sung biện chứng theo Tam tiêu. Tiết Sinh Bạch bổ sung nguyên nhân, bệnh sinh, chứng trạng và điều trị Thấp nhiệt bệnh. Vương Mạnh Anh viết 'Ôn nhiệt kinh vĩ', tổng kết các lý thuyết và kinh nghiệm về Ôn bệnh. " +
        "Khái niệm: Ôn bệnh là bệnh do ôn tà gây ra, lấy khởi phát có phát sốt là chủ chứng, khi nhiệt nặng dễ hóa táo thương âm — đặc trưng cho một loại bệnh ngoại cảm cấp tính nhiệt bệnh. Phân 2 nhóm: Ôn bệnh chỉ có nhiệt (phong ôn, thử ôn, thu táo, xuân ôn, ôn độc, ôn dịch); Ôn bệnh có thấp nhiệt (thấp ôn, thử thấp, thấp nhiệt dịch, phục thử). " +
        "Phân loại theo cách phát bệnh: Tân cảm — khởi phát bệnh ngay sau khi cảm phải tà khí, bệnh từ biểu mà phát. Phục khí — sau khi cảm phải tà khí, tà lưu lại cơ tấu, khi gặp thời thì bệnh phát, bệnh từ lý mà phát. " +
        "Đặc trưng: gây ra bởi ngoại tà có tính ôn nhiệt (lệ khí); có tính lây nhiễm, gây dịch, theo mùa và địa lý; phát triển theo quy luật cụ thể — Vệ Khí Dinh Huyết, Tam tiêu; biểu hiện lâm sàng: sốt cao, dễ hóa táo thương âm. " +
        "Nguyên tắc điều trị theo Diệp Thiên Sĩ (biện chứng Vệ-Khí-Dinh-Huyết): tà tại Vệ phận thì tân lương phát hãn; tà tại Khí phận thì tân lương thanh khí; tà tại Dinh phận thì dùng pháp thanh nhiệt thấu giải, dẫn tà ngoại xuất; tà tại Huyết phận thì thanh nhiệt lương huyết. " +
        "Nguyên tắc điều trị theo Ngô Cúc Thông (biện chứng Tam tiêu): bệnh ở Thượng tiêu dùng dược vị khinh thanh để lên đến Thượng tiêu thanh nhiệt tà; tại Trung tiêu dùng dược vị bình hòa để điều hòa khí cơ Trung tiêu, không thể thiên lệch về một phía; trị Ôn bệnh tại Hạ tiêu dùng dược vị có tính trọng trầm hoặc hàn để bổ vào âm dịch Can Thận bị hao thương.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Biện chứng Vệ - Khí - Dinh - Huyết",
      category: cat,
      summary: "4 giai đoạn phát triển của Ôn bệnh theo chiều sâu xâm nhập: Vệ phận (biểu, nhẹ) → Khí phận → Dinh phận → Huyết phận (sâu, nặng nhất, tổn thương âm huyết).",
      content:
        "VỆ PHẬN CHỨNG: sốt cao, hơi sợ gió (ôn nhiệt xâm nhập cơ biểu, vệ khí uất); ho (bì mao cảm tà khí, Phế khí mất tuyên giáng); đau đầu (nhiệt thượng nhiễu thanh khiếu); lưỡi đỏ, rêu trắng mỏng (nhiệt còn ở biểu); mạch phù sác (ôn nhiệt tà ở biểu); khát nước, đau họng (nhiệt thương tân dịch). " +
        "So sánh Vệ phận (ôn bệnh) với Thái dương thương hàn: Tà khí — ôn nhiệt vs phong hàn. Xâm nhập — bì mao/mũi miệng vs bì phu. Vị trí — Thủ thái âm Phế vs Túc thái dương Bàng quang. Bệnh cơ — tổn thương âm vs tổn thương dương. Lâm sàng — sốt cao, sợ lạnh ít, đau đầu, miệng khát, đau họng, mạch phù sác vs sợ lạnh nhiều, sốt nhẹ, đau đầu cứng gáy, miệng không khát, không ra mồ hôi, mạch phù khẩn. " +
        "Các thể Vệ phận: Nhiệt tại Phế vệ — phát sốt, hơi sợ lạnh, không/ít ra mồ hôi, miệng hơi khát, đau họng, ho, lưỡi đỏ rêu trắng mỏng, mạch phù sác. Thấp trệ vệ khí — sốt về chiều, sợ lạnh, ra ít mồ hôi, đầu nặng, đau mỏi toàn thân, tức ngực, rêu trắng nhớt, mạch nhu hoãn. Táo phạm Phế vệ — sốt, hơi sợ gió lạnh, ra ít mồ hôi, đau đầu, khát nước, họng mũi khô, da khô, ho khan/đàm ít dính, lưỡi đỏ khô, mạch phù sác. " +
        "KHÍ PHẬN CHỨNG: sốt cao, sợ nóng (chính tà đấu tranh kịch liệt, dương nhiệt nhiễu thịnh); khát nước, tiểu vàng (nhiệt thịnh thương tân); bứt rứt (nhiệt nhiễu tâm thần); lưỡi đỏ, rêu vàng; mạch hồng đại sác (nhiệt bức huyết vận hành). So sánh Khí phận với Dương minh chứng (thương hàn): bệnh cơ — ôn nhiệt tà nhập phủ Đại trường vs hàn tà nhập lý hóa nhiệt; tính chất — dễ/ít tổn thương tân dịch hơn; điều trị — thông phủ bảo vệ tân dịch vs thông phủ. " +
        "Các thể Khí phận: Nhiệt tà ủng Phế — ho, khạc đàm vàng, khó thở, sốt cao, ra mồ hôi, đau tức ngực, khát nước, cánh mũi phập phồng, lưỡi đỏ rêu vàng, mạch sác. Nhiệt nhiễu hung cách — sốt cao, bứt rứt không yên, ra mồ hôi, khát nước, lưỡi đỏ rêu vàng, mạch sác. Dương minh nhiệt thịnh — sốt cao, sợ nóng, ra mồ hôi nhiều, khát nước thích uống lạnh, lưỡi đỏ rêu vàng khô, mạch hồng đại. Tà tại Thiếu dương — hàn nhiệt vãng lai, khát nước, buồn bực, bụng đầy tức, sốt về chiều, ra mồ hôi thì sốt giảm. Dương minh nhiệt kết — triều nhiệt, có lúc nói sảng, bụng đầy trướng đau, táo bón, rêu vàng khô, mạch trầm thực. Phế nhiệt di Trường — sốt, ho, đại tiện phân vàng nóng hôi, hậu môn nóng rát, bụng đầy đau, rêu vàng, mạch sác. Thấp ôn khí phận — sốt không cao, ra mồ hôi mà sốt không giảm, bụng đầy, đại tiện lỏng, thân mình nặng nề, buồn nôn/nôn, không khát hoặc khát không muốn uống, rêu trắng nhớt, mạch nhu hoãn. " +
        "DINH PHẬN CHỨNG: sốt về đêm (đêm dương nhập âm, chính tà gặp nhau); miệng khô, không khát nhiều (nhiệt nhập dinh hun đốt tân dịch phía trên); bứt rứt, mất ngủ, hôn mê, nói sảng (nhiệt nhiễu tâm thần); ban chẩn (nhiệt bức huyết vọng hành); mạch vi sác (dinh nhiệt thương âm). Các thể: Nhiệt hãm tâm bào — sốt cao, lơ mơ, nói nhảm hoặc hôn mê, cứng lưỡi, lưỡi đỏ không rêu, mạch vi sác. Nhiệt chưng dinh âm — sốt về đêm, bứt rứt, nói nhảm, ban chẩn mọc, miệng khô không khát nước nhiều, lưỡi đỏ rêu mỏng hoặc không rêu, mạch vi sác. " +
        "HUYẾT PHẬN CHỨNG: phát cuồng (huyết nhiệt nhiễu tâm); ban chẩn nổi rõ, xuất huyết (nhiệt bức huyết); tứ chi co quắp, cứng gáy, giác cung phản trương (huyết nhiệt gây Can phong nội động); triều nhiệt, ngũ tâm phiền nhiệt (nhiệt hun đốt gây âm hư); gầy khô, lưỡi teo nhỏ, răng khô, mắt mờ (âm tinh hao tổn); mạch hư sác (âm hư). Các thể: Nhiệt thịnh bức huyết — sốt cao, bứt rứt không yên, nặng thì hôn mê, co giật, nói nhảm, ban tím sẫm thành mảng, hoặc nôn ra máu, đại tiện ra máu, lưỡi tím, mạch sác. Nhiệt và huyết kết — bụng dưới đầy đau, ấn cự án, tiêu phân đen, phát cuồng, miệng khô cho uống không nuốt, lưỡi tím có ban ứ huyết, mạch trầm sáp. Huyết phận hư nhiệt — sốt không cao, sốt kéo dài, ngũ tâm phiền nhiệt, họng khô, ù tai, lưỡi khô, mạch hư đại. Hư phong nội động (huyết phận) — chân tay run hoặc co quắp, người gầy, mệt mỏi, răng khô, môi khô teo, lưỡi khô đỏ sẫm không rêu, mạch hư.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Biện chứng Tam tiêu (Thượng - Trung - Hạ tiêu)",
      category: cat,
      summary: "Biện chứng Ôn bệnh theo Tam tiêu (Ngô Cúc Thông) — vị trí bệnh biến từ Thượng tiêu (Phế, Tâm bào) → Trung tiêu (Vị, Tỳ, Đại trường) → Hạ tiêu (Can, Thận).",
      content:
        "THƯỢNG TIÊU CHỨNG: phát sốt, hơi sợ gió lạnh (ôn nhiệt phạm biểu); đau đầu (ôn tà thượng nhiễu thanh khiếu); miệng khát (nhiệt thương tân); ra mồ hôi (nhiệt bức tân ngoại tiết); ho, khó thở (tà nhập lý, Phế mất túc giáng); mạch sác (nhiệt tà). Nặng hơn: hôn mê, nói nhảm (tà nghịch chuyển Tâm bào, nhiệt nhiễu thần); sốt cao (lý nhiệt tích thịnh); chân tay co quắp (dương khí nội uất không đạt ra tứ chi); lưỡi đỏ bóng (nhiệt hun đốt dinh âm). Các thể: Ôn tà nhập Phế — phát sốt, hơi sợ gió lạnh, đau đầu, ho, miệng hơi khát, ra ít mồ hôi, rêu trắng mỏng, mạch phù sác. Tà nhiệt ủng Phế — phát sốt, khó thở, hơi thở thô, đàm vàng dính, khát nước, ra mồ hôi, tức ngực, cánh mũi phập phồng, lưỡi đỏ rêu vàng, mạch sác. Thượng tiêu thấp nhiệt — sợ lạnh, ra mồ hôi, sốt không cao, đầu căng nặng, đầy tức ngực, miệng nhạt không khát, rêu trắng nhớt, mạch nhu hoãn. Tà bế Tâm bào — phát sốt, hôn mê, nói nhảm, lưỡi cứng, chân tay lạnh, lưỡi đỏ bóng, mạch vi sác. Đàm thấp bế Tâm bào — phát sốt tăng về đêm, hôn mê, lúc mê lúc tỉnh, nói sảng, rêu vàng nhớt, mạch nhu hoạt sác. " +
        "TRUNG TIÊU CHỨNG: bụng trướng, táo bón (nhiệt tà phạm Dương minh); sốt, mặt đỏ (tà nhiệt hun đốt, thăng bốc lên trên); lơ mơ, nói nhảm (nhiệt nhiễu tâm); khát nước, miệng khô, ưa uống lạnh, tiểu vàng ít (nhiệt thương tân); hơi thở thô (tà nhiệt bức Phế); mạch trầm thực (táo nhiệt nội kết). Thể thấp nhiệt: ngực bụng đầy, buồn nôn, tiêu lỏng (thấp nhiệt cản trở Tỳ vận hóa); sốt không cao (thấp át chế, nhiệt ẩn phục); đầu thân đau, nặng nề (thấp tính trọng trọc); rêu vàng nhớt, mạch nhu sác (thấp nhiệt nội uẩn). Các thể: Vị kinh tích nhiệt — sốt cao, ra mồ hôi nhiều, mặt đỏ, buồn bực, khát nước thích uống lạnh, lưỡi đỏ rêu vàng khô, mạch hồng đại. Nhiệt kết trường đạo — triều nhiệt, bụng đầy tức đau và trướng, táo bón hoặc tiêu lỏng, bứt rứt, nói nhảm, rêu vàng khô, mạch trầm thực. Trung tiêu thấp nhiệt — sốt không cao, ra mồ hôi mà sốt không giảm, miệng khát không thích uống, bụng chướng, buồn nôn, tức ngực, thân thể nặng nề, tiêu lỏng đi xong không thoải mái, rêu vàng nhớt, mạch nhu sác. " +
        "HẠ TIÊU CHỨNG: tổn thương Can Thận âm (nhiệt tà chuyển xuống Hạ tiêu); tai ù (Thận âm hư thoát, tai mất nuôi dưỡng); mệt mỏi (thần không được âm tinh nuôi dưỡng); miệng khô, ngũ tâm phiền nhiệt (âm hư nội nhiệt); chân tay co quắp/run (thủy hư không hàm mộc, Can phong nội động); mạch hư, rêu ít (âm tinh hao kiệt). Các thể: Thận âm hao tổn — sốt không cao, sốt kéo dài, ngũ tâm phiền nhiệt, miệng khô răng đen, lưỡi khô bóng sẫm, tai ù, mạch hư. Hư phong nội động (Hạ tiêu) — chân tay run, co quắp, gầy sút cân, răng đen, môi khô teo, lưỡi khô không rêu, mạch hư. Hạ tiêu thấp nhiệt — tiểu không thông, khát không thích uống, bụng dưới chướng đau, tiêu không thông, tinh thần lơ mơ, rêu trắng nhớt, mạch nhu sác.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 3 chủ đề Biện chứng Vệ Khí Dinh Huyết và Tam tiêu.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
