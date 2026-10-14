import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Tâm Quý (Chính Xung) và Bất Muội (Mất Ngủ)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Tâm Quý và Chính Xung (Hồi Hộp, 7 chứng)",
      category: cat,
      summary: "Tâm quý (tim đập nhanh/chậm không đều, hồi hộp, nhẹ) và Chính xung (tim đập nhanh hồi hộp không ngưng, nặng hơn) có nguyên nhân/triệu chứng giống nhau, chỉ khác mức độ — 7 chứng từ kinh khủng đến ứ huyết.",
      content: `TÂM QUÝ VÀ CHÍNH XUNG: chủ yếu chỉ tim đập không bình thường, hồi hộp, tâm phiền bất an, không tự chủ. Khác biệt: Tâm quý là cảm giác tim đập nhanh/chậm không đều, hồi hộp, KHÔNG phải vì giật mình sợ hãi, lúc phát lúc nghỉ, không tự chủ. Chính xung là tim đập nhanh hồi hộp KHÔNG ngưng nghỉ (nặng hơn tâm quý). Nguyên nhân và triệu chứng cơ bản giống nhau, chỉ khác mức độ nặng nhẹ. Thường kèm mất ngủ, hay quên, huyền vựng, ù tai.

7 chứng thường gặp:

1. **Kinh khủng thương thần**: tâm quý thường hay giật mình sợ hãi, đứng ngồi không yên, ngủ mơ nhiều dễ bị bóng đè, không muốn ăn uống, lưỡi như bình thường, mạch hư nhỏ. Kinh tắc khí loạn, tâm thần phù động không tự chủ.

2. **Tâm khí hư**: tâm quý cảm giác trống rỗng trong tim, lúc nào cũng cảnh giác không yên, sắc mặt nhạt trắng, khí đoản phạt lực, tự hạn, tay chân mình mẩy không ấm, lưỡi nhạt, mạch nhược.

3. **Tâm huyết hư**: sắc mặt phờ phạc, miệng môi không tươi, huyền vựng, lưỡi nhạt, mạch tế vô lực. Huyết thiểu không tư dưỡng tâm.

4. **Tâm âm hư**: tâm quý tim đập hồi hộp bất an, tâm phiền, ít ngủ kèm thủ túc tâm nhiệt, miệng khô lưỡi táo, chóng mặt ù tai, lưỡi đỏ, mạch tế sác. Âm hư dương thịnh, tâm hỏa độc kháng không nằm yên.

5. **Ẩm tà thượng phạm**: tâm quý huyền vựng kèm ngực bụng đầy tức, khí đoản suyễn tức, tiểu ít phù thũng, lưỡi nhạt rêu trắng, mạch trầm nhược. Thủy tà thượng phạm, thủy khí lăng tâm.

6. **Phong thấp khốn tâm**: tâm quý kèm đau đầu, đau lưng, đau khớp, mặt trắng, lưỡng quyền đỏ như thoa phấn, khí đoản tức ngực, lưỡi đỏ, mạch tế sác. Phong thấp trở trệ lạc mạch, bệnh lâu suy nhược.

7. **Ứ huyết tâm quý**: tâm quý kèm tức ngực, đau như bóp xé trong ngực, đau lan vai, ngực, mặt trong cánh tay, lúc phát lúc nghỉ, mặt môi xanh tím tối, lưỡi tím tối có ứ ban, mạch sáp kết. Tâm mạch ứ trở huyết lưu không thông.

PHÂN BIỆT CHỦ YẾU: Kinh khủng (gặp chuyện giật mình sợ hãi thì tăng triệu chứng — đặc trưng rõ). Tâm khí hư (mặt nhợt nhạt, khí đoản phạt lực, tự hạn, mạch nhược). Tâm huyết hư (sắc mặt phờ phạc, huyền vựng, mạch tế). Tâm âm hư (ngũ tâm phiền nhiệt, lưỡng quyền đỏ, mạch tế sác). Ẩm tà thương tâm (khí đoản suyễn thúc, tiểu ít, phù thũng — KHÁC phong thấp khốn tâm là đau mỏi toàn thân, đau khớp). Ứ huyết tâm quý (PHẢI kèm đau ngực như châm chích, đau lan vai lưng/mặt trong cánh tay, mặt môi xanh/tím, lưỡi có ứ ban, mạch sáp).`,
      keyPoints: "Tâm quý (nhẹ, lúc phát lúc nghỉ) khác Chính xung (nặng, không ngưng nghỉ) chỉ về MỨC ĐỘ, cùng nguyên nhân cơ chế\n7 chứng theo nguyên nhân: tinh thần (kinh khủng) → hư (khí/huyết/âm hư tâm) → tà thực (ẩm tà/phong thấp/ứ huyết)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Bất Muội (Mất Ngủ, 6 chứng)",
      category: cat,
      summary: "Bất muội (thất miên — khó vào giấc, ngủ không sâu, lúc ngủ lúc tỉnh, hoặc mất ngủ cả đêm) bệnh vị tại tâm, liên quan tỳ-thận-can-vị — do khí huyết và chức năng tạng phủ thất điều khiến tâm thần bất an.",
      content: `BẤT MUỘI (thất miên, mất ngủ): khó vào giấc ngủ hoặc ngủ không sâu, lúc ngủ lúc tỉnh hay cả đêm không ngủ được. Bệnh vị tại TÂM nhưng liên quan tỳ-thận-can-vị. Do khí huyết và chức năng tạng phủ thất điều dẫn tâm thần bất an.

6 chứng thường gặp:

1. **Can hỏa thượng viêm**: ngủ ít mơ nhiều gặp ác mộng liên miên kèm tâm phiền dễ nộ, ngực sườn trướng đầy hoặc đau đầu, mắt đỏ, miệng đắng, tiểu vàng sậm, lưỡi đỏ rêu vàng, mạch huyền sác. Can khí uất kết hóa hỏa, hỏa nhiệt nội nhiễu thần hồn bất an.

2. **Đàm nhiệt nội trở**: mất ngủ tâm quý, ngực cách trướng mãn, nôn nước dãi, đàm nhiều mà vàng, rêu vàng nê, mạch hoạt sác. Hung cách tích đàm sinh nhiệt, đàm hỏa thượng nhiễu.

3. **Thực trệ vị quản**: mất ngủ bụng trướng bí ợ hơi khó chịu hoặc đại tiện không sảng, đau bụng, rêu nê, mạch trầm hoạt. Ẩm thực đình trệ tổn thương tỳ vị, khí cơ bị trở.

4. **Tâm tỳ lưỡng hư**: bất muội mà ngủ là mơ nhiều, ngủ dễ thức giấc kèm tâm quý, hay quên, uể oải mệt mỏi, ăn uống không mùi vị, ăn ít lưỡi nhạt, rêu mỏng, mạch tế nhược. Khí huyết bất túc không tư dưỡng tâm thần, "thần bất thủ xá".

5. **Tâm thận bất giao**: bất muội kèm tâm quý, chóng mặt, ù tai, ngũ tâm phiền nhiệt, miệng họng khô táo, đau lưng hoặc mộng tinh, lưỡi đỏ, mạch tế sác. Thận thủy bất túc, tâm hỏa độc kháng hư nhiệt thượng nhiễu thần minh.

6. **Tâm đởm khí hư**: bất muội mơ nhiều kèm dễ giật mình kinh sợ, không dám ngủ 1 mình, lưỡi nhạt, mạch huyền tế.

Thêm **Huyết ứ chứng trong bệnh điên cuồng**: bất muội thậm chí suốt đêm thức trắng kèm thần chí điên đảo, muốn khóc muốn cười, nói năng lộn xộn, lưỡi nhạt ẩn sắc xanh hoặc có ứ ban ứ điểm, mạch huyền sác hoặc sáp trệ. Khí trệ huyết ứ nhiễu loạn tâm thần.

PHÂN BIỆT CHỦ YẾU: Can hỏa thượng viêm (đa số kèm tâm phiền dễ nộ, ngực sườn trướng mãn, mắt đỏ, miệng đắng). Đàm nhiệt nội trở (thường kèm nôn ói nước dãi, đàm nhiều màu vàng). Thực trệ vị quản (đa số kèm bụng bĩ muộn, ợ hơi, bụng trướng khó chịu). Tâm tỳ lưỡng hư (đa số có tâm quý hay quên, tinh thần lừ đừ uể oải, ăn ít tiêu chảy). Tâm thận bất giao (kèm tâm phiền, chóng mặt, ù tai, ngũ tâm phiền nhiệt, đau lưng). Tâm đởm khí hư (thường dễ giật mình sợ hãi, không dám ngủ một mình — đặc trưng riêng). Huyết ứ trong điên cuồng (PHẢI kèm thần chí điên đảo, nói năng lộn xộn, lưỡi ẩn sắc xanh hoặc có ứ ban).`,
      keyPoints: "Bất muội phân biệt theo nguyên nhân: thực tà (can hỏa/đàm nhiệt/thực trệ — mỗi loại có dấu hiệu thực riêng) vs hư (tâm tỳ/tâm thận bất giao/tâm đởm khí hư) vs huyết ứ (điên cuồng, nặng nhất)\nTâm đởm khí hư đặc trưng: không dám ngủ một mình, dễ giật mình kinh sợ",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề: Tâm Quý/Chính Xung (7 chứng) và Bất Muội (7 chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
