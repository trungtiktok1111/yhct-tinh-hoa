// Thêm "Học thuyết Âm Dương" vào mục Lý luận cơ bản (ThS Võ Thanh Phong, 25 slide).
// Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Học thuyết Âm Dương",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong — dẫn Bành Văn Khìu, Đặng Quốc Khánh (2002), NXB Hà Nội",
      locator: "25 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Học thuyết Âm Dương",
      category: "Âm dương - Ngũ hành",
      summary:
        "Âm dương biểu thị sự vật/hiện tượng đối lập nhau, hoặc hai mặt đối lập trong cùng một sự vật; thuộc tính âm dương của sự vật là tương đối (không tuyệt đối, không cố định).",
      content:
        "6 quy luật cơ bản: " +
        "(1) Âm dương giao cảm: âm dương trong quá trình vận động cảm ứng và giao hội với nhau — là điều kiện vạn vật hóa sinh; vận động là điều kiện phát sinh giao cảm; khí dương hạ giáng, khí âm thượng thăng. " +
        "(2) Âm dương đối lập chế ước: âm dương tương phản dẫn đến chế ước lẫn nhau, kết quả là trạng thái cân bằng động. " +
        "(3) Âm dương hỗ căn hỗ dụng: hai mặt âm dương tuy đối lập nhưng dựa vào nhau, có nguồn gốc từ nhau; không thể tồn tại độc lập; không ngừng tương sinh, thúc đẩy lẫn nhau; âm có nguồn gốc từ dương, dương có nguồn gốc từ âm. " +
        "(4) Âm dương tiêu trưởng bình hành: tiêu là thu nhỏ, trưởng là gia tăng — quá trình âm dương vận động biến hóa theo nguyên lý đối lập chế ước và hỗ căn hỗ dụng; ổn định trong phạm vi nhất định là bình hành (quân bình), mất bình hành thì trái thường (bệnh lý). " +
        "(5) Âm dương chuyển hóa lẫn nhau: một thuộc tính tổng thể của sự vật, trong điều kiện nhất định, có thể chuyển hóa theo hướng tương phản với nó — là hình thức cơ bản của vận động âm dương; khi tiêu trưởng đến giai đoạn nhất định, nội bộ âm dương xuất hiện đảo ngược thuộc tính sự vật. " +
        "(6) Âm dương vô tận: bất kỳ sự vật/hiện tượng nào trong tự nhiên đều có thể khái quát thành âm hoặc dương; trong mỗi sự vật luôn có cả hai mặt; bất kỳ một mặt âm dương nào lại có thể tiếp tục phân thành âm và dương (chia nhỏ vô tận).",
      keyPoints:
        "Giải thích kết cấu/chức năng sinh lý cơ thể: hoạt động sống bình thường là khi âm dương thăng bằng, thăng giáng xuất nhập thăng bằng là bình thường; Âm thuộc hình thể, nuôi dưỡng — Dương thuộc công năng, hoạt động. " +
        "Giải thích biến đổi bệnh lý: âm dương không điều hòa sinh bệnh tật; chính khí có phần âm dương, tà khí có phần âm dương; chính-tà đấu tranh dẫn đến âm dương thiên thắng/thiên suy; có các tổ hợp hàn-nhiệt và hàn nhiệt thác tạp. " +
        "Chẩn đoán: dùng âm dương khái quát thuộc tính, vị trí bệnh biến, tính chất chứng hậu; phân tích thuộc tính âm dương của màu sắc, thanh âm, chứng trạng, mạch tượng, vị trí bệnh. " +
        "Điều trị: phân tích rõ tình trạng rối loạn âm dương để điều chỉnh lại thăng bằng; nguyên tắc 'Hư thì bổ, Thực thì tả', 'Trong dương cầu âm, trong âm cầu dương'. " +
        "Dược học: chế biến nhằm thay đổi thuộc tính âm dương của dược vật cho phù hợp công dụng điều trị (vd tăng tính dương của thuốc bằng phụ liệu Gừng, Sa nhân, Rượu). " +
        "Phòng bệnh: theo âm dương đối lập — mùa đông mặc ấm, mùa hè mặc thoáng; lao động trí óc thì nghỉ ngơi bằng hoạt động thể lực và ngược lại; theo âm dương tiêu trưởng — làm việc khởi động từ từ rồi tăng dần cường độ, nghỉ ngơi thì giảm dần cường độ.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm Học thuyết Âm Dương.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
