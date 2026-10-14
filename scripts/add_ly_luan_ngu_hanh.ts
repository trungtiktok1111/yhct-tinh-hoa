// Thêm "Học thuyết Ngũ Hành" + "Học thuyết Thiên Nhân Hợp Nhất" (ThS Võ Thanh
// Phong, 45 slide). Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Học thuyết Ngũ Hành",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong — dẫn Bành Văn Khìu, Đặng Quốc Khánh (2002) NXB Hà Nội; Trần Quốc Bảo",
      locator: "45 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Học thuyết Ngũ Hành",
      category: "Âm dương - Ngũ hành",
      summary: "Vạn vật được cấu tạo bởi 5 thuộc tính cơ bản: Mộc, Hỏa, Thổ, Kim, Thủy — vận động tương sinh, tương khắc không ngừng để duy trì bình hằng. Học thuyết mô tả mối tương tác giữa các sự vật, hiện tượng trong tự nhiên.",
      content:
        "Đặc tính riêng từng hành: Thủy — nhuận hạ (tư nhuận, hạ hành, hàn lương, bế tàng); Mộc — uốn thẳng (thoải mái, điều đạt, vươn thẳng, sinh trưởng); Kim — dễ biến đổi (trầm giáng, thu liễm); Hỏa — thượng viêm (ôn nhiệt, hướng thượng); Thổ — để trồng/hái (sinh hóa, gánh chịu, thu nạp). " +
        "Quy loại theo Ngũ hành — Vật chất: Gỗ/Lửa/Đất/Kim loại/Nước; Màu: Xanh/Đỏ/Vàng/Trắng/Đen; Vị: Chua/Đắng/Ngọt/Cay/Mặn; Hóa sinh: Sinh/Trưởng/Hóa/Thu/Tàng; Khí: Phong/Thử/Thấp/Táo/Hàn; Phương: Đông/Nam/Trung/Tây/Bắc; Mùa: Xuân/Hạ/Trưởng hạ/Thu/Đông (theo thứ tự Mộc-Hỏa-Thổ-Kim-Thủy). " +
        "Quy luật tương sinh: tương trợ, giúp đỡ, xúc tiến — mối quan hệ tư sinh, giúp đỡ sinh trưởng, thúc đẩy lẫn nhau tuần tự giữa Kim-Mộc-Thủy-Hỏa-Thổ (Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc). " +
        "Quy luật tương khắc: chế ước, khắc chế, ức chế — quan hệ khắc chế, kìm hãm lẫn nhau tuần tự ngắt quãng (Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim). " +
        "Nguyên lý chế hóa: chế ước lẫn nhau + hóa sinh lẫn nhau để duy trì điều hòa cân bằng — không có Sinh thì không phát sinh/trưởng thành, không có Khắc chế thì sự vật phát triển thái quá gây hại (vd Thủy sinh Mộc giúp Mộc không bị Kim làm hại; Kim khắc Mộc giúp Mộc không phát triển thái quá). " +
        "Nguyên lý tương thừa (bệnh lý — thái quá/bất cập): một hành chế khắc quá độ với hành 'sở thắng' của nó, do quan hệ tương khắc quá mạnh vượt mức bình thường, làm hành bị khắc suy yếu. Tương thừa do thái quá: hành khắc quá thịnh; do bất cập: hành bị khắc đã tự suy yếu trước. " +
        "Nguyên lý tương vũ (khinh nhờn — ngược chiều tương khắc): một hành quá mạnh khiến hành vốn khắc nó không khắc được mà bị nó khắc ngược lại. Thái quá: hành bị vũ trở nên quá cường thịnh khắc ngược; bất cập: hành đi khắc trở nên quá hư yếu không khắc được còn bị khắc lại. " +
        "Nguyên lý tương cập (liên lụy): mẹ bệnh liên lụy con, con bệnh liên lụy mẹ ('mẫu bệnh cập tử', 'tử bệnh cập mẫu') — kết quả cả hành mẹ và hành con đều bất túc. " +
        "Nguyên lý thắng phục: khi tương thừa/tương vũ xảy ra làm một hành bị khắc chế quá độ, hành đó thông qua tương sinh-tương khắc sẽ hồi phục lại trạng thái cân bằng (ví dụ chuỗi: Mộc thái quá → khắc Thổ làm Thổ suy → Thổ suy không chế được Thủy → Thủy vượng → Thủy vượng chế Hỏa làm Hỏa suy → Hỏa suy không chế Kim → Kim vượng → Kim vượng chế Mộc → trở lại bình thường).",
      keyPoints:
        "Giải thích sinh lý — bảng phối ngũ tạng theo Ngũ hành: Mộc-Can-Đởm-Cân-Mắt-Giận-Hét; Hỏa-Tâm-Tiểu trường-Mạch-Lưỡi-Mừng-Cười; Thổ-Tỳ-Vị-Thịt-Miệng-Lo nghĩ-Tiếng ợ/nấc; Kim-Phế-Đại trường-Da lông-Mũi-Buồn-Khóc; Thủy-Thận-Bàng quang-Xương tủy-Tai-Sợ-Tiếng rên. " +
        "Quan hệ tạng phủ theo tương sinh/tương khắc (vd Tâm hỏa ôn Tỳ thổ; Tâm chủ huyết, Tỳ sinh huyết; Phế chủ khí, Thận chủ nạp khí; Can tàng huyết, Tâm chủ huyết; Tỳ thổ chế ước Thận thủy ngăn thủy ẩm tràn lan; Can sơ tiết ngăn Tỳ khí ủng trệ). " +
        "Truyền biến bệnh tật ví dụ tương thừa: Tâm hỏa vượng thiêu đốt Phế tân; Tỳ có thấp cản trở Thận chủ thủy; Can khí uất không sơ tiết làm rối loạn vận hóa Tỳ Vị. Ví dụ mẫu bệnh cập tử: Tâm dương hư không ôn Tỳ dương; Tỳ khí hư làm hóa sinh khí huyết vô lực nên Phế khí hư; Thận âm hư không nuôi Can âm làm Can âm hư. " +
        "Chẩn đoán: xác định vị trí bệnh qua quy nạp Ngũ hành; xác định truyền biến; tiên lượng — mạch và chứng tương sinh là thuận, tương khắc là nghịch. " +
        "Điều trị (ứng dụng tương sinh): Hư tắc bổ kỳ mẫu, Thực giả tả kỳ tử; Tư thủy hàm mộc; Ích hỏa bổ thổ; Bồi thổ sinh kim; Kim thủy tương sinh. " +
        "Dược học/bào chế theo Ngũ hành: Kim-vị Cay-màu Trắng-chế rượu-quy kinh Phế; Thủy-Mặn-Đen-chế muối/đậu đen-Thận; Mộc-Chua-Xanh-chế giấm-Can; Hỏa-Đắng-Đỏ-Tâm; Thổ-Ngọt-Vàng-sao vàng/chích mật-Tỳ. " +
        "Châm cứu — Ngũ du huyệt (Tỉnh-Vinh-Du/Nguyên-Kinh-Hợp, ứng Mộc-Hỏa-Thổ-Kim-Thủy) của 6 kinh âm: Phế (Thiếu dương[Thiếu Thương]-Ngư tế-Thái uyên-Kinh cừ-Xích trạch), Tâm bào (Trung xung-Lao cung-Đại lăng-Giản sử-Khúc trạch), Tâm (Thiếu xung-Thiếu phủ-Thần môn-Linh đạo-Thiếu hải), Tỳ (Ẩn bạch-Đại đô-Thái bạch-Thương khâu-Âm lăng), Can (Đại đôn-Hành gian-Thái xung-Trung phong-Khúc tuyền), Thận (Dũng tuyền-Nhiên cốc-Thái khê-Phục lưu-Âm cốc).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Học thuyết Thiên Nhân Hợp Nhất",
      category: "Âm dương - Ngũ hành",
      summary: "Con người là một bộ phận trong chỉnh thể trời đất vạn vật, liên hệ với nhau qua Khí; sự biến hóa của người và trời đất-vạn vật thường tương ứng với nhau.",
      content:
        "Giữa trời đất vạn vật tràn đầy Khí tạo ra tương hỗ giữa chúng; chính nhờ có Khí mà trời đất vạn vật liên quan với nhau thành một chỉnh thể, con người chỉ là một bộ phận trong chỉnh thể ấy. Tố Vấn — Bảo mệnh toàn hình luận: 'Người do khí của trời đất sinh ra và phải theo quy luật của bốn mùa mà tồn tại.' Con người cùng với sự biến hóa âm dương, thăng giáng, tiêu trưởng của thời tiết mà sinh ra những thích ứng tương ứng; khí của tạng phủ, kinh lạc theo đó biến đổi theo. Sự vận động biến hóa của khí âm dương trong tự nhiên có mối liên hệ mật thiết với sinh lý, bệnh lý cơ thể; sự phát sinh bệnh tật là kết quả tương tác giữa Thiên (trời) - Địa (đất) - Nhân (người).",
      keyPoints: "Liên hệ khoa học hiện đại (được nhắc trong bài, không có nội dung chi tiết trong slide trích xuất được): nguyên lý 'ưu tiên bên trái', câu 'Dương thường hữu dư, âm thường bất túc'; dẫn ý tưởng của Court Payen về hệ điều chỉnh rối loạn qua 2 quá trình hưng phấn/ức chế ưu việt ở hệ ngũ giác; liên hệ khối đa diện Platon.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm Học thuyết Ngũ Hành + Thiên Nhân Hợp Nhất.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
