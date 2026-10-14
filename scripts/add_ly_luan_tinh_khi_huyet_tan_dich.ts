// Thêm "Các vật chất sống cơ bản: Tinh - Khí - Huyết - Tân dịch - Thần" (ThS Võ
// Thanh Phong, 57 slide) vào Lý luận cơ bản. Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Các vật chất sống cơ bản: Tinh - Khí - Huyết - Tân dịch - Thần",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong — dẫn Giovanni Maciocia (2015), The foundations of Chinese medicine, Elsevier",
      locator: "57 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Khí - Huyết - Tân dịch - Tinh - Thần";

  await prisma.theoryTopic.create({
    data: {
      name: "Tinh (精)",
      category: cat,
      summary: "Vật chất cơ bản duy trì cấu trúc và chức năng cơ thể, và duy trì nòi giống — tàng trữ ở Thận.",
      content:
        "Tinh khí trong triết học: Khí là nguồn gốc căn bản tạo nên thế giới, vận động biến hóa không ngừng, là cầu nối người-vạn vật; tinh khí trời đất hóa sinh thành con người (Tố Vấn — Bảo mệnh toàn hình luận: 'Người do khí của trời đất sinh ra và phải theo quy luật bốn mùa mà tồn tại'; Hoài Nam Tử: 'Khí trọc thành trùng, khí thanh thành người'; Linh Khu — Tuế lộ: 'Người tương thâm với trời đất, tương ứng với nhật nguyệt'). " +
        "Tinh khí trong YHCT: là động lực hoạt động sống; đầy đủ thì hoạt động sống duy trì bình thường; vận động của khí cần được điều hòa thông đạt. " +
        "TINH: vật chất cơ bản duy trì cấu trúc/chức năng cơ thể, và duy trì nòi giống, trữ ở Thận. Tinh tiên thiên: vật chất ban đầu xây dựng cơ thể và duy trì nòi giống (từ cha mẹ). Tinh hậu thiên: vật chất cơ bản thu được từ thức ăn sau tiêu hóa/hấp thu. Thận tinh: tinh tàng trữ ở Thận = kết hợp Tinh tiên thiên + Tinh hậu thiên (tinh hậu thiên bổ sung liên tục, tinh tiên thiên thúc đẩy khí hóa hình thành). " +
        "Chức năng của Tinh: sinh trưởng/phát triển/sinh sản; là cơ sở của Thận khí; sinh tủy (Thận tinh → Tủy → Tủy xương/Xương, Tủy sống, Não); cơ sở thể chất khỏe mạnh. 'Tam bảo': Tinh-Khí-Thần. " +
        "Chu kỳ sinh trưởng/phát triển/sinh sản theo tuổi (Nam theo bội số 8, Nữ theo bội số 7): Thận khí thịnh (Nam 8/Nữ 7) → Thiên quý sung túc (Nam 16 tuổi xuất tinh/Nữ 14 tuổi hành kinh) → Thận khí đầy đủ (Nam 24/Nữ 21) → Thận khí thịnh nhất (Nam 32/Nữ 28) → Dương minh suy (Nam 40/Nữ 35) → Tam dương suy (Nam 48/Nữ 42) → Thiên quý hết (Nam 56 tinh thiểu/Nữ 49 mãn kinh) → Tinh khí suy (Nam 64). " +
        "Thận khí = Thận âm + Thận dương, trên cơ sở Thận tinh.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Khí (氣)",
      category: cat,
      summary: "Vật chất dinh dưỡng cơ bản trong cơ thể và hoạt động chức năng của nó — có rất nhiều loại Khí phân theo nguồn gốc, vị trí, và chức năng khác nhau.",
      content:
        "Khái niệm chung: Khí tự nhiên — yếu tố cơ bản tạo vũ trụ, qua chuyển động/biến đổi/chuyển hóa tạo ra toàn vũ trụ (gồm con người và hoạt động sống). Khí trong y học — chỉ vật chất dinh dưỡng trong cơ thể và hoạt động chức năng của nó. Khí tiên thiên (có sẵn từ khi sinh) và Khí hậu thiên (thu được sau sinh, từ khí thức ăn + khí trời ở Phế). " +
        "Các loại Khí theo chức năng/vị trí: Tông khí — kết hợp tinh khí hóa đồ ăn thức uống + khí trời hít thở vào ngực, là động lực tuần hoàn máu/hô hấp/tiếng nói/vận động. Vệ khí — di chuyển ngoài mạch, bảo vệ bề mặt cơ thể khỏi ngoại tà. Dinh/Doanh khí — di chuyển trong mạch, dinh dưỡng mọi cơ quan/tổ chức. Tân khí — (1) tân dịch; (2) khí được vận hành bởi dịch. " +
        "Chính khí — chức năng bình thường của cơ thể, gồm khả năng tự điều hòa/thích nghi. Chân khí — kết hợp khí tiên thiên + hậu thiên, nền tảng vật chất và động lực cho mọi chức năng sống. Nguyên khí — kết hợp khí tiên thiên + hậu thiên, là khí chủ yếu nhất của cơ thể. Nguồn gốc: Thiên khí (khí trời, qua Phế) + Cốc khí (khí đồ ăn, qua Tỳ) → Tông khí → phân thành Nguyên khí/Chân khí/Dinh khí/Vệ khí. " +
        "Tạng khí (khí giúp tạng hoạt động) — Phủ khí (khí giúp phủ hoạt động) — Trung khí (khí trung tiêu, cơ sở cho hoạt động Tỳ/Vị/Tiểu trường: tiêu hóa, hấp thu, vận chuyển, thăng thanh giáng trọc) — Kinh khí (khí chạy qua các đường kinh/lạc). " +
        "Khí hóa: thuật ngữ chung chỉ những thay đổi do hoạt động của khí — cụ thể là chuyển hóa/biến đổi lẫn nhau giữa Tinh-Khí-Huyết-Tân dịch. Khí cơ: chuyển động của khí gồm Thăng-Giáng-Xuất-Nhập (4 hình thức cơ bản). Âm khí (phần âm, khí của cơ sở vật chất) và Dương khí (phần dương, khí của hoạt động chức năng). Nguyên lý 'Tinh huyết đồng nguyên', 'Tân huyết đồng nguyên'. " +
        "5 chức năng của Khí: Thúc đẩy, Ôn chiếu (làm ấm), Phòng ngự, Thăng đề (giữ các cơ quan ở đúng vị trí), Cố nhiếp (giữ/kiểm soát, vd giữ huyết trong mạch). " +
        "Khí cơ cụ thể theo tạng (ví dụ minh họa): Can — Sơ tiết (chủ đạo, điều hòa khí cơ toàn thân), Xuất/Nhập với Cân. Phế-Thận — Phế nạp khí từ dưới lên (khí hóa Bàng quang → Phế là Thăng), Phế giáng đưa thủy xuống Bàng quang (Giáng); Thận Xuất/Nhập với Xương. Vị-Tỳ — Vị Giáng xuống Tiểu trường; Tỳ Thăng lên Tâm và Phế; Xuất/Nhập với Cơ nhục.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Huyết (血)",
      category: cat,
      summary: "Chất dịch màu đỏ giàu dinh dưỡng, có tác dụng tư nhuận, chảy trong huyết mạch đi khắp toàn thân — là chất cơ bản cấu tạo và duy trì hoạt động sống.",
      content:
        "Nguồn gốc Huyết: Tỳ Vị (từ Cốc khí) + Thận (Thận tinh, qua Nguyên khí) → kết hợp với Khí hậu thiên + Khí tiên thiên để hóa sinh Huyết; có sự tham gia chuyển hóa qua Tâm và Phế trong quá trình hóa huyết. " +
        "Chức năng của Huyết: nuôi dưỡng và tư nhuận toàn thân; là 'nhà của Thần' (nơi Thần trú ngụ) — cơ sở vật chất của hoạt động thần chí; duy trì sự bình hằng của âm-dương; hình thành kinh nguyệt. " +
        "Quan hệ Khí-Huyết: Khí là 'mẹ của Huyết' — Khí có vai trò Sinh thành Huyết, thúc đẩy Vận hành Huyết, và Cố nhiếp Huyết (giữ Huyết trong mạch, không để thoát ra ngoài).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tân dịch (津液)",
      category: cat,
      summary: "Tân (trong, lỏng, loãng — đi cùng Vệ khí) và Dịch (đục, nặng, đặc — đi cùng Dinh khí) — 2 dạng của dịch thể sinh ra từ đồ ăn thức uống.",
      content:
        "Khái niệm: Tân — sinh từ đồ ăn thức uống, theo khí của Tam tiêu phân bố đến khoảng cơ nhục/bì phu để ôn dưỡng cơ nhục, tươi nhuận da lông; bao gồm nước bọt, dịch vị, dịch trường, nước tiểu, mồ hôi. Dịch — từ đồ ăn uống hóa sinh, theo Huyết đi toàn thân, chứa lại ở các khiếu, dịch não tủy, khớp xương. " +
        "So sánh Tân/Dịch: Tính chất (trong lỏng loãng / đục nặng đặc); Phân bố (đi cùng Vệ khí / đi cùng Dinh khí); Vận hành (chạy nhanh / chạy chậm); Chức năng (Tân: tư nhuận bì phu-cơ nhục, bài tiết thành mồ hôi/nước mắt/nước bọt/dịch nhầy / Dịch: nhu dưỡng quan tiết (khớp), cột sống, não và tủy). " +
        "Chức năng chung của Tân dịch: tác dụng nhu dưỡng và tư nhuận; hóa sinh huyết dịch; điều tiết thăng bằng âm dương; bài tiết sản phẩm chuyển hóa; vận chuyển khí đi khắp toàn thân. " +
        "Chuyển hóa Tân dịch: Tỳ Vị (ăn uống) → phân Thanh/Trọc; phần Thanh lên Thượng tiêu qua Phế (tuyên phát) đến bì mao/cơ nhục, nhuận Phế; qua Trung tiêu; phần Trọc xuống Hạ tiêu (Tiểu trường, Đại trường → phân; Thận, Bàng quang → nước tiểu, có tái hấp thu phần thanh, khí hóa). " +
        "Quan hệ Khí-Tân dịch: Khí Vận chuyển/khí hóa Tân dịch; Tân dịch Cố nhiếp và Tư dưỡng Khí (quan hệ 2 chiều). Quan hệ Huyết-Tân dịch: Tân dịch Tư dưỡng/bổ sung cho Huyết; Huyết giúp Làm đầy (một phần cấu thành) Tân dịch.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Thần (神)",
      category: cat,
      summary: "Thần là quy luật nội tại về vận động/biến hóa của vật chất, biểu hiện bên ngoài của hoạt động sinh vật; trong YHCT gắn với Tâm ('Tâm tàng Thần') và hoạt động tư duy-ý thức-tinh thần.",
      content:
        "Khái niệm Thần: quy luật nội tại về sự vận động/biến hóa của vật chất trong tự nhiên; toàn bộ biểu hiện bên ngoài hoạt động của sinh vật; chủ 1 hoạt động chức năng trong cơ thể ('Tâm tàng Thần'); hoạt động tư duy-ý thức-tinh thần của con người. 3 nghĩa của chữ Thần (神): Mind (hoạt động tinh thần: tỉnh táo, suy nghĩ, cảm giác), Spirit (hoạt động tinh thần nói chung), Vitality (biểu hiện chức năng sống). " +
        "Các khái niệm liên quan: Tinh thần (essence-spirit) — trạng thái tinh thần/tình cảm, phản ánh sức khỏe của Tinh. Hồn (ethereal soul, 魂) — phần đạo đức/tinh thần của con người. Phách (corporeal soul, 魄) — hình ảnh động của Thần. Ý (ideation, 意) — hoạt động/sức mạnh của suy nghĩ, đưa ra ý tưởng. Chí (will, 志) — sức mạnh ý chí điều khiển ý nghĩ và hành động. " +
        "Ví dụ minh họa (điếu thuốc đang cháy): khói thuốc bay lên ('Thiên') là Hồn; lá thuốc ('Thiên'... bản chất vật liệu) là Tinh; tro tàn rơi xuống ('Địa') là Phách; cả điếu thuốc (toàn bộ quá trình) là Thần. " +
        "Định nghĩa cổ điển các khái niệm tâm thần: Âm dương lưỡng tinh kết hợp sinh ra hoạt động sinh mạng = Thần. Hoạt động tinh thần theo vãng lai của thần khí = Hồn. Chủ hoạt động khí quan dựa vào xuất nhập của tinh khí = Phách. Gánh chịu cảm thụ sự vật và phân tích = Tâm. Trong lòng có ý niệm chuẩn bị làm = Chí. Vì thực hiện ý nguyện mà suy đi nghĩ lại = Tư. Suy nghĩ sinh hoài nghi/lo lắng = Lự. Suy nghĩ kỹ đặt ra cách xử lý tương ứng = Trí. " +
        "Chức năng Tâm thần: hoạt động tinh thần (gồm cảm xúc), tri giác, trí nhớ, suy nghĩ, giấc ngủ. " +
        "Thần và trí nhớ: Trí nhớ học tập/xa/gần liên quan Tâm (Thần), Tỳ (Ý), Thận (Chí). Thần và quyết định: thực hiện ra quyết định liên quan Tâm (tinh thần sáng suốt toàn vẹn), Can (khả năng lập kế hoạch), Tiểu trường (khả năng phân biệt/phản biện), Thận (động lực và trí lực), Đởm (quyết đoán). " +
        "Quan hệ Tinh-Khí-Thần: Tinh hóa Khí, Khí hóa Tinh — tinh khí hóa lẫn nhau; Tinh Khí sinh Thần, Tinh Khí dưỡng Thần, Thần thống ngự Tinh và Khí. Tâm khí thúc đẩy vận hành huyết dịch và là động lực hoạt động Tâm thần. Huyết (gồm dinh dưỡng + tân dịch) chủ yếu có tác dụng tư dưỡng Tâm thần. (Sơ đồ liên hệ: Tâm↔Thần, Phế/Tỳ Vị↔Khí, Thận↔Tinh). " +
        "Thần và Hồn (trạng thái cảm xúc): Hồn 'đến và đi quá nhiều' = hưng cảm (mania); 'đến và đi bình thường' = bình thường; 'đến và đi quá ít' = trầm cảm.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 5 chủ đề: Tinh, Khí, Huyết, Tân dịch, Thần.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
