// Thêm "Khí - Huyết - Tân Dịch 气血津液" (25 slide, song ngữ Trung-Việt) vào Lý
// luận cơ bản. Nội dung bổ sung khung "quan hệ Khí-Huyết/Khí-Tân dịch/Huyết-Tân
// dịch" chi tiết, chưa có trong các file đã xử lý trước đó. Trích nguyên văn,
// không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Khí - Huyết - Tân Dịch (气血津液)",
      sourceType: "Bài giảng",
      authorOrOrg: "Không ghi rõ tác giả trong file (song ngữ Trung-Việt)",
      locator: "25 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Khí huyết - Tân dịch";

  await prisma.theoryTopic.create({
    data: {
      name: "Định nghĩa và chức năng sinh lý của Khí, Huyết, Tân dịch",
      category: cat,
      summary: "Khí là yếu tố cơ bản tạo nên cơ thể, có 6 tác dụng; Huyết là chất dịch đỏ nuôi dưỡng cơ thể và là nền tảng vật chất cho Thần; Tân dịch là tên gọi chung mọi dịch lỏng bình thường (trừ huyết), gồm Tân (loãng) và Dịch (đặc).",
      content:
        "KHÍ: định nghĩa là yếu tố cơ bản tạo nên cơ thể và duy trì mọi hoạt động sống. Khí đến từ 3 nguồn: thức ăn đồ uống sau tiêu hóa (thủy cốc tinh khí); không khí tự nhiên khi hít thở (thanh khí); tinh khí bẩm sinh do cha mẹ truyền (tiên thiên chi tinh khí). " +
        "6 chức năng sinh lý chủ yếu của Khí: (1) Tác dụng thúc đẩy (thôi động) — thúc đẩy sinh trưởng phát dục, vận hành huyết/tân dịch, hoạt động tạng phủ. (2) Tác dụng làm ấm (ôn hú) — ôn ấm toàn thân. (3) Tác dụng bảo vệ (phòng ngự) — chống ngoại tà. (4) Tác dụng cố nhiếp — giữ và kiểm soát (huyết trong mạch, tân dịch, tinh không hao thoát). (5) Tác dụng khí hóa — chuyển hóa vật chất trong cơ thể (tinh-khí-huyết-tân dịch chuyển hóa lẫn nhau). (6) Tác dụng dinh dưỡng (doanh dưỡng) — nuôi dưỡng cơ thể. " +
        "Sự vận động của Khí gọi là 'khí cơ' — hình thức: thăng (lên), giáng (xuống), xuất (ra), nhập (vào). Thăng-giáng-xuất-nhập hài hòa → khí cơ điều hòa thông suốt; rối loạn → khí cơ mất điều hòa, sinh khí trệ, khí nghịch, khí hãm. " +
        "HUYẾT: là chất dịch màu đỏ lưu thông trong mạch, đi khắp cơ thể, có tác dụng nuôi dưỡng và làm ẩm các cơ quan, là vật chất quan trọng duy trì sự sống. Hình thành từ 2 nguồn: (1) từ thức ăn đồ uống — sau tiêu hóa, tinh chất chuyển hóa thành Dinh khí và Tân dịch rồi tạo thành Huyết; (2) từ Tinh trong cơ thể (đặc biệt liên quan Thận) — Tinh có thể chuyển hóa thành Huyết ('tinh năng hóa huyết'). Chức năng của Huyết: nuôi dưỡng và làm ẩm cơ thể; là nền tảng vật chất cho hoạt động tinh thần (Thần). " +
        "TÂN DỊCH: tên gọi chung mọi loại dịch lỏng bình thường trong cơ thể (ngoài Huyết) — gồm dịch nội tại các tạng phủ và các chất tiết ra như dịch vị, dịch ruột, mồ hôi, nước mắt. 2 loại: Tân (chất lỏng loãng, lưu động nhiều, phân bố ở da/cơ/lỗ chân lông, có tác dụng làm ẩm/làm ướt) và Dịch (đặc hơn, lưu động ít hơn, nuôi dưỡng khớp/tạng phủ/não/tủy, có tác dụng bổ dưỡng). Chức năng chính của Tân dịch: làm ẩm và nuôi dưỡng (tư nhuận dinh dưỡng); tham gia hình thành huyết dịch (hóa sinh huyết dịch).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Nguyên lý chuyển hóa của Tân dịch (sơ đồ)",
      category: cat,
      summary: "Thức ăn → Vị (tinh khí lan tỏa) → Tỳ (phân tán tinh vi lên Phế) → Phế (tuyên giáng, hơi thở mang nước, mồ hôi qua Vệ khí ở da lông) và → Thận (khí hóa); Tiểu trường chủ tân, Đại trường thải phân, Bàng quang thải nước tiểu; Can điều khí cơ giúp nước dịch lưu thông; Tam tiêu là đường vận hành tân dịch.",
      content:
        "Sơ đồ chuyển hóa tân dịch: Thức ăn vào Vị → tinh khí lan tỏa, đưa lên Tỳ. Tỳ khí phân tán tinh vi, đưa lên Phế ('Tỳ khí tán tinh, thượng quy ư Phế'). Ruột non (Tiểu trường) hấp thu phần tinh sạch, 'Tiểu trường chủ về tân dịch'. Ruột già (Đại trường) nhận phần trọc, thành phân thải ra. Phổi (Phế) tuyên giáng: hơi thở mang theo nước ra ngoài; qua Vệ khí ở da lông bài tiết mồ hôi (chức năng 'tiết biệt thanh trọc' — phần trong của trọc nhưng còn tinh sạch thì giữ lại, phần trọc nhất trong trọc thì thải). Thận chủ khí hóa nước tiểu (thải qua Bàng quang). Gan (Can) điều tiết làm thông suốt khí cơ — khí lưu thông thì nước dịch cũng lưu thông ('Can sơ tiết khí cơ, khí hành tắc thủy hành'). Tam tiêu là con đường vận hành (thông đạo) của tân dịch trong toàn cơ thể.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Quan hệ Khí - Huyết",
      category: cat,
      summary: "'Khí là soái của Huyết, Huyết là mẹ của Khí' — Khí thuộc dương/chủ động/thúc đẩy; Huyết thuộc âm/chủ tĩnh/nuôi dưỡng. 4 cơ chế cụ thể: Khí sinh Huyết, Khí hành Huyết, Khí nhiếp Huyết, Huyết tải Khí.",
      content:
        "Khái quát: Khí thuộc Dương, chủ động, chủ thúc đẩy ('Khí vi huyết chi soái' — Khí là tướng soái của Huyết). Huyết thuộc Âm, chủ tĩnh, chủ nuôi dưỡng ('Huyết vi khí chi mẫu' — Huyết là mẹ của Khí). " +
        "KHÍ NĂNG SINH HUYẾT (Khí có thể sinh Huyết): Dinh khí là một phần cấu thành của Huyết; Khí hóa là động lực hình thành Huyết (khí giúp chuyển hóa thức ăn thành huyết) → Khí yếu thì Huyết cũng ít, Huyết hư thường đi kèm Khí hư — lâm sàng chứng huyết hư/khí huyết lưỡng hư khi bổ huyết thường thêm vị ích khí. " +
        "KHÍ NĂNG HÀNH HUYẾT (Khí có thể vận hành Huyết): tác dụng thúc đẩy của Khí (đặc biệt Tông khí) là động lực trực tiếp cho sự lưu hành của Huyết — Khí hành thì Huyết hành; Khí hư thì Huyết hư (vận hành yếu); Khí trệ thì Huyết ứ; Khí loạn thì Huyết loạn. " +
        "KHÍ NĂNG NHIẾP HUYẾT (Khí có thể giữ Huyết): Khí có chức năng cố nhiếp, giữ Huyết vận hành trong lòng mạch không thoát ra ngoài — Khí mạnh thì huyết lưu thông bình thường, Khí yếu dễ gây chảy máu; người hay xuất huyết mạn tính thường cần bổ khí nhiếp huyết. " +
        "HUYẾT NĂNG TẢI KHÍ (Huyết có thể chở Khí): Khí hoạt lực mạnh, dễ tán ra, nên phải nhờ Huyết và Tân dịch đưa đi khắp cơ thể — Huyết đủ thì Khí có chỗ nương tựa và lưu thông bình thường; mất huyết nhiều thì Khí cũng dễ suy và mất theo, gọi là 'Khí tùy huyết thoát' (khí theo huyết mà thoát), lâm sàng dùng Độc sâm thang.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Quan hệ Khí - Tân dịch và Huyết - Tân dịch",
      category: cat,
      summary: "Huyết và Tân dịch đều thuộc Âm nên quan hệ Khí-Tân dịch tương tự quan hệ Khí-Huyết (Khí sinh Tân, Khí hành Tân, Khí nhiếp Tân, Tân tải Khí). Huyết và Tân dịch đồng nguồn, chuyển hóa lẫn nhau.",
      content:
        "QUAN HỆ KHÍ - TÂN DỊCH (tương tự Khí-Huyết vì Huyết và Tân dịch đều thuộc Âm, đều là dạng dịch lỏng): " +
        "Khí năng sinh Tân — Khí là động lực chính tạo ra Tân dịch, cơ chế qua chức năng Tỳ Vị bình thường; Khí đủ + Tỳ Vị tốt → tân dịch đầy đủ; Khí hư + Tỳ Vị yếu → tân dịch thiếu (người hay khô miệng khô họng cần bổ khí để sinh tân). " +
        "Khí năng hành (hóa) Tân — Khí là động lực cho tân dịch được phân bố và bài tiết, qua thăng-giáng-xuất-nhập của khí, cụ thể dựa vào: Phế khí tuyên giáng, Tỳ khí vận chuyển (chuyển thâu), Thận khí khí hóa (chưng hóa). Khí hành thì Tân hành; Khí hư thì Tân hư; Khí trệ thì Tân đình (ứ đọng). " +
        "Khí năng nhiếp Tân — tác dụng cố nhiếp của Khí kiểm soát sự bài tiết của Tân dịch, dựa vào Phế khí đầy đủ và Thận khí mạnh (cố nhiếp có quyền) → mồ hôi và nước tiểu bài tiết có chừng mực, duy trì cân bằng chuyển hóa nước dịch. Phép ích khí cố nhiếp dùng điều trị ra nhiều mồ hôi, tiểu không tự chủ. " +
        "Tân năng tải Khí — Tân dịch là môi trường để Khí vận hành, Khí phải nhờ Tân dịch để lưu thông khắp cơ thể: Tân dịch ứ trệ → Khí bị bế tắc (dùng lợi thủy, trừ thấp, hóa đàm để giảm đầy trướng); mồ hôi/nôn/tiêu chảy quá mức làm mất tân dịch nhiều → Khí theo Tân dịch mà thoát (khí tùy tân thoát), dùng phép ích khí dưỡng âm để điều hòa. " +
        "QUAN HỆ HUYẾT - TÂN DỊCH: (1) Đồng nguồn — Huyết và Tân dịch đều do Tỳ Vị hóa sinh từ tinh vi của thủy cốc. (2) Chuyển hóa lẫn nhau — Tân dịch trong Huyết có thể thấm ra ngoài mạch để làm ẩm nuôi dưỡng toàn thân; Tân dịch ngoài mạch có thể thấm vào trong mạch trở thành Huyết. (3) Mất huyết thì tổn thương Tân dịch — có thể xuất hiện khô miệng, tiểu ít, da khô. (4) Tân dịch khô kiệt làm Huyết khô ('tân khô tắc huyết táo') — có thể xuất hiện da khô bong tróc, tóc móng kém nuôi dưỡng, và dấu hiệu 'cơ phu giáp thác' (da sạm, khô ráp như vảy).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 4 chủ đề Khí - Huyết - Tân Dịch (quan hệ).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
