// Thêm "Học thuyết Kinh Lạc" (ThS Võ Thanh Phong, 28 slide) vào Lý luận cơ bản.
// Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Học thuyết Kinh Lạc",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Võ Thanh Phong",
      locator: "28 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Học thuyết Kinh Lạc",
      category: "Kinh lạc - Huyệt vị",
      summary:
        "Kinh lạc = Kinh mạch (đường chạy dọc cơ thể) + Lạc mạch (hệ thống phân nhánh của kinh mạch). Phân bố toàn thân, tuần hành có quy luật, liên kết phức tạp làm cơ thể thống nhất thành chỉnh thể, duy trì hoạt động sống bình thường. Chịu ảnh hưởng học thuyết Âm dương, Ngũ hành.",
      content:
        "— CẤU TRÚC — Hệ kinh lạc gồm Kinh mạch (12 Kinh chính + liên quan: 12 kinh cân, 12 kinh biệt, 12 bì bộ; và Kỳ kinh bát mạch) và Lạc mạch (15 lạc mạch lớn; phù lạc, tôn lạc, huyết lạc nhỏ hơn). " +
        "12 Kinh chính (Kinh âm ↔ Kinh dương, theo vị trí Tay/Chân): Tay — Thủ thái âm Phế ↔ Thủ dương minh Đại trường; Thủ thiếu âm Tâm ↔ Thủ thái dương Tiểu trường; Thủ quyết âm Tâm bào ↔ Thủ thiếu dương Tam tiêu. Chân — Túc thái âm Tỳ ↔ Túc dương minh Vị; Túc thiếu âm Thận ↔ Túc thái dương Bàng quang; Túc quyết âm Can ↔ Túc thiếu dương Đởm. " +
        "Hướng đi 12 kinh chính (Âm thăng, Dương giáng): Kinh âm/tay — từ tạng, qua mặt trong tay, đến ngón tay, hội với kinh dương. Kinh dương/tay — từ ngón tay lên đầu, hội với kinh dương/chân. Kinh dương/chân — từ đầu xuống ngón chân, hội với kinh âm/chân. Kinh âm/chân — từ ngón chân qua bụng-ngực, hội với kinh âm/tay. " +
        "Quy luật phân bố: Đầu — 6 kinh dương giao nhau ở vùng đầu mặt (đầu là nơi hội tụ các kinh dương). Thân — Túc thái dương ở lưng, Túc thiếu dương ở bên hông, Túc dương minh ở bụng; Túc tam âm đều ở trước bụng. Tứ chi — Kinh âm ở mặt trong, Kinh dương ở mặt ngoài. " +
        "Thứ tự tuần hành (vòng tuần hoàn khí của 12 kinh, nối tiếp nhau): Thủ thái âm Phế → Thủ dương minh Đại trường → Túc dương minh Vị → Túc thái âm Tỳ → Thủ thiếu âm Tâm → Thủ thái dương Tiểu trường → Túc thái dương Bàng quang → Túc thiếu âm Thận → Thủ quyết âm Tâm bào → Thủ thiếu dương Tam tiêu → Túc thiếu dương Đởm → Túc quyết âm Can → (trở lại Phế). " +
        "Huyệt: nơi kinh khí vận hành qua lại/vào ra; cửa ngõ xâm phạm của tà khí; nơi phản ánh bệnh lý của tạng phủ/kinh lạc; tác động lên huyệt giúp điều hòa khí huyết tạng phủ/kinh lạc. Phân loại theo vị trí: Kinh huyệt (thuộc 12 kinh chính + Nhâm + Đốc), Huyệt ngoài kinh (không thuộc 12 kinh chính/Nhâm/Đốc), A thị huyệt (tại vị trí đau). Phân loại theo chức năng: Huyệt Du-Mộ, Huyệt Khích, Huyệt Nguyên-Lạc, Huyệt Ngũ du, Bát hội huyệt, Lục tổng huyệt. " +
        "Kinh biệt: tuần hành sâu và dài, rẽ từ kinh chính, chi phối vùng kinh chính không đến; khởi từ tay/chân → vào tạng phủ → ra đầu cổ; mang bản khí của kinh chính; tăng cường liên kết kinh chính với tạng phủ, kinh âm với kinh dương biểu lý, và quan hệ 12 kinh chính với đầu. " +
        "Kinh cân: hệ thống cân phụ thuộc 12 kinh chính, nối liền các khớp xương, ràng buộc toàn thân; chức năng co duỗi/vận động do Can làm chủ, nhờ khí huyết nuôi dưỡng; bắt đầu từ móng tay/chân. " +
        "12 Bì bộ: 12 vị trí ở bì phu phân chia theo 12 kinh mạch, phân bố theo phạm vi tuần hành của kinh chính nhưng rộng hơn; nơi ôn chiếu và cố mật của Vệ khí (bảo vệ cơ thể); phản ánh bệnh lý tạng phủ/kinh lạc (dùng để chẩn đoán). " +
        "Lạc mạch: rẽ từ kinh chính, phân bố dưới da; phân nhánh nhỏ dần: đại lạc, tiểu lạc, tôn lạc, phù lạc, huyết lạc — hình thành mạng lưới dày đặc đưa khí huyết khắp cơ thể. 15 đại lạc gồm: 12 lạc mạch nối từ huyệt Nguyên đến huyệt Lạc của kinh biểu lý với nó, và 3 lạc còn lại (dương lạc của Đốc mạch, âm lạc của Nhâm mạch, và lạc của Tỳ — Đại bao). " +
        "Bát mạch kỳ kinh: Dương duy, Âm duy, Dương kiểu, Âm kiểu, Xung, Nhâm, Đốc, Đới. Đặc điểm: không đi vào tạng phủ; không gắn với Ngũ hành; không có huyệt riêng (trừ Nhâm mạch và Đốc mạch). Tác dụng — tổng hợp, điều hòa: Đốc mạch tổng quản các kinh Dương; Nhâm mạch tổng quản các kinh Âm; Xung mạch thông suốt huyết của 12 kinh; Đới mạch vòng quanh eo, ràng buộc 2 bên cơ thể; Duy mạch và Kiểu mạch điều hòa Âm Dương.",
      keyPoints:
        "Ứng dụng SINH LÝ: (1) Tác dụng liên hệ — tạng phủ với bì tiết, tạng phủ với quan khiếu, giữa các tạng phủ, giữa các kinh mạch. (2) Tác dụng dẫn truyền cảm ứng — kích thích truyền từ cơ biểu vào tạng phủ làm thay đổi công năng tạng phủ (cơ sở của điều trị); ngược lại thay đổi hoạt động tạng phủ cũng biểu hiện ra cơ biểu thông qua kinh lạc — đây là cơ sở của hiện tượng 'đắc khí'. (3) Tác dụng nhu dưỡng — khí huyết phân tán nuôi dưỡng toàn cơ thể qua hệ kinh lạc; Vệ khí phân tán ra ngoài để phòng ngự. (4) Tác dụng điều tiết — duy trì vận hành khí huyết, điều hòa âm dương; là nền tảng để tác động lên huyệt nhằm điều trị. " +
        "Ứng dụng BỆNH LÝ: kinh lạc là nơi xâm nhập tà khí, con đường truyền biến bệnh tật, truyền bệnh giữa tạng phủ và cơ biểu (vd Lục kinh truyền biến, tạng phủ truyền biến; Vị kinh có nhiệt truyền lên nướu răng gây sưng lở loét nướu). " +
        "Ứng dụng CHẨN ĐOÁN: dựa vào phân bố kinh lạc/tạng phủ liên quan để tìm vị trí bệnh; điểm đau trên đường kinh bị bệnh giúp chẩn đoán (vd bệnh Phế thấy nổi cứng ở huyệt Phế du). " +
        "Ứng dụng ĐIỀU TRỊ: châm cứu, xoa bóp để điều chỉnh công năng tạng phủ qua kinh lạc; dùng thuốc theo nguyên tắc quy kinh (thuốc đi vào kinh nào để tác động đúng tạng phủ đó).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm Học thuyết Kinh Lạc.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
