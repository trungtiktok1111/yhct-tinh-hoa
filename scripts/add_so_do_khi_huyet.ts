// Thêm "Sơ đồ Khí Huyết và Ứng dụng" (5 trang) vào Lý luận cơ bản.
// Nội dung tóm lược vòng chuyển hóa Khí-Huyết đã có trong Khí Huyết YHCT.docx,
// nhưng trình bày riêng với khung khái niệm Khí(Dương)/Âm-Huyết-Tinh rõ ràng,
// nên vẫn ghi nhận là nguồn riêng. Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Sơ đồ Khí Huyết và Ứng dụng",
      sourceType: "Tài liệu giảng dạy",
      authorOrOrg: "Không ghi rõ tác giả trong file",
      locator: "5 trang",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Sơ đồ Khí Huyết — khái niệm Khí/Dương và Âm/Huyết/Tinh",
      category: "Khí huyết - Tân dịch",
      summary: "Khí (Dương) là vật chất vô hình, biểu hiện công năng tạng phủ, cần vật hữu hình làm chỗ lưu chú; Âm-Huyết-Tinh là vật chất hữu hình, tạo hình cơ thể, cần Khí để dẫn vận hành.",
      content:
        "KHÁI NIỆM CƠ BẢN: (1) Khí (Dương) là vật chất vô hình, phụ trách nuôi dưỡng về mặt chức năng, là 'biểu hiện' công năng của tạng phủ; vì Dương, Khí vốn động, tính tỏa ra ngoài/đi lên trên, nên cần vật hữu hình để làm chỗ lưu chú. (2) Âm, Huyết, Tinh là vật chất hữu hình, nuôi dưỡng cơ thể về mặt hình thể (phụ trách 'tạo hình' các cơ quan bộ phận — Tinh của tạng phủ là phần vật chất tạo hình lên tạng phủ đó); Âm, Huyết vốn tĩnh nên không tự vận hành được, cần Khí để dẫn. " +
        "GIẢI THÍCH SƠ ĐỒ: Vị nạp thức ăn/nước uống, làm ngấu nhừ (chín) nhờ Tỳ cung cấp dương khí (Tỳ khí) — đây là chức năng 'hóa' của Tỳ khí; Tỳ khí 'vận' phần tinh ba lên Phế, phần cặn bã tống xuống Tiểu trường. Tiểu trường phân (biệt) cặn bã thành phần thanh (lên Phế) và phần dịch/thủy (ngấm xuống Bàng quang qua kinh mạch và Tam tiêu), phần cặn bã còn lại truyền xuống Đại trường (giáng trọc). Đại trường tiếp tục phân: thủy dịch giữ lại (tế bí biệt trấp, ngấm xuống Bàng quang), cặn bã cuối thành phân. " +
        "Phế là tạng cao nhất trong 12 tạng phủ, chứa nguồn khí lớn nhất (Tông khí, khí hải), hợp từ 3 nguồn: khí trời trong sạch hít vào; khí thủy cốc (tinh ba đồ ăn) do Tỳ khí vận lên; khí từ thủy dịch ở Bàng quang do Thận dương khí hóa đưa lên. Tinh ba thủy cốc có 2 phần: Khí (dinh khí, góp phần tạo Tông khí) và Tinh (dinh âm, kết hợp với thủy do Bàng quang hóa khí đưa lên, cả hai hội ở Phế). Chất dinh âm và thủy dịch ở Phế được Tông khí dẫn vận hành khắp nơi — thể hiện chức năng Phế: tuyên phát (tỏa ra xung quanh), tuyên giáng (tỏa ra và đi xuống), túc giáng (làm sạch khí trời và đưa xuống dưới); con đường vận hành là hệ kinh mạch và phủ Tam tiêu.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Sơ đồ Khí Huyết — Tông khí, Dinh-Vệ khí, Huyết, và Bàng quang-Thận dương",
      category: "Khí huyết - Tân dịch",
      summary: "Tông khí chia Dinh khí (trong mạch) và Vệ khí (ngoài mạch) — cùng một nguồn, chỉ khác vị trí; Huyết là Dinh âm được Tâm 'hóa đỏ'; Thận dương khí hóa Bàng quang tạo ra khí mang hàn tính khắc chế Tâm hỏa.",
      content:
        "TÔNG KHÍ có 2 phần: phần đi trong mạch (vận hành huyết, tân dịch) là Dinh khí; phần đi ngoài mạch (nhanh mạnh, bảo vệ) là Vệ khí — vì cùng xuất nguồn từ Tông khí nên nếu Vệ khí đi trong mạch thì chính là Dinh khí, và ngược lại. " +
        "VỆ KHÍ: đi ngoài kinh mạch nên có mặt khắp nơi (do kinh mạch có khắp cơ thể); ở bì phu phụ trách đóng mở lỗ chân lông (bì khổng/huyền phủ, điều hòa ra mồ hôi) và bảo vệ chống ngoại tà. Nguồn gốc: từ Tông khí ở Phế; và từ khí ở Bàng quang (do Thận dương khí hóa thủy dịch) đi lên. " +
        "TẠNG KHÍ: khi Tông khí (Dinh+Vệ) đến các tạng phủ thì trở thành khí tạng phủ (tạng khí/phủ khí) riêng, mang chức năng của tạng phủ đó, lưu hành đi khắp nơi kể cả những nơi đường kinh của tạng phủ đó không liên lạc tới. " +
        "DINH ÂM, HUYẾT: Dinh âm từ Phế được bố tán đi khắp nơi; phần đi qua Tâm được Tâm 'hóa' ra sắc đỏ gọi là Huyết — Huyết khác Dinh âm ở chỗ có màu đỏ, cả hai đều nuôi dưỡng hình thể các cơ quan. Vì Tâm là nguồn hỏa nhiệt chính (Quân hỏa), Huyết còn mang nhiệm vụ dẫn hỏa của Tâm đi khắp nơi để ôn dưỡng (nuôi dưỡng và làm ấm) các tạng phủ. " +
        "BÀNG QUANG, THẬN DƯƠNG: Thận dương cung cấp dương khí cho Bàng quang để 'hóa' thủy thành 'khí' — gọi là 'Khí hóa Bàng quang'. Khí này có 3 đặc điểm: (1) xuất nguồn từ thủy nên mang hàn tính, khi lên thượng tiêu sẽ khắc chế Tâm hỏa để không quá vượng; (2) là khí nên có tính đi ra ngoài (phù việt), tạo ra Vệ khí; (3) khi tới Phế (thượng tiêu) lại ngưng tụ thành thủy dịch, được Phế giáng xuống dưới — do đó có câu 'Phế là nguồn nước trên, Thận là nguồn nước dưới'.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 2 chủ đề Sơ đồ Khí Huyết và Ứng dụng.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
