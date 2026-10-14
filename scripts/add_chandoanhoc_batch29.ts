import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Táo Bón và Tiểu Không Thông",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Táo Bón (6 chứng)",
      category: cat,
      summary: "Táo bón (3-5 ngày hoặc lâu hơn mới đi 1 lần) bệnh lý chủ yếu tại tỳ vị và đại trường — nhiệt kết, khí trệ, khí hư, huyết hư, hàn kết, táo kết (tân dịch khô).",
      content: `TÁO BÓN: thời gian mỗi lần đi tiêu kéo dài 3-5 ngày, 5-6 ngày, hoặc lâu hơn. Bệnh lý chủ yếu tại TỲ VỊ và ĐẠI TRƯỜNG. Thức ăn nhập vị được hủ thục, tỳ vận hóa thủy cốc tinh vi khắp cơ thể, cặn bã được đại trường tống ra. Nếu vị trường táo nhiệt nội kết, hoặc khí hư giảm khả năng truyền tống, hoặc huyết hư trường đạo khô sáp, hoặc âm hàn ngưng kết — đều dẫn táo bón.

6 chứng thường gặp:

1. **Nhiệt kết**: táo bón kèm miệng hôi, môi lở loét, mặt đỏ, sốt, tiểu đỏ ngắn, lưỡi đỏ rêu vàng khô, mạch hoạt thực. Vị trường nhiệt thịnh hao tân, trường đạo khô sáp. Miệng môi thuộc tỳ, tỳ nhiệt thượng chưng nên miệng hôi môi lở.

2. **Khí trệ**: táo bón kèm ngực sườn đầy tức, ăn ít, ợ hơi, bụng trướng đầy, rêu mỏng nê, mạch huyền. Khí cơ uất trệ, truyền đạo thất chức.

3. **Khí hư**: táo bón nhưng phân không cứng, phải rặn nhiều mà rất mệt, xuất hạn, thậm chí hư thoát hôn đảo, kèm khí đoản tinh thần lừ đừ uể oải, mặt trắng, lưỡi nhạt, rêu mỏng, mạch hư nhược. Trung khí hư nhược, đại trường truyền tống vô lực.

4. **Huyết hư**: táo bón rặn nhiều khó ra kèm sắc mặt nhợt nhạt không tươi, chóng mặt tâm quý, lưỡi nhạt nộn, mạch tế sáp. Huyết hư tân dịch khuy tổn không nhu nhuận trường đạo.

5. **Hàn kết**: táo bón rất khó ra phân kèm đau lạnh bụng, tứ chi quyết lãnh, lưỡi nhạt rêu trắng, mạch trầm trì. Hàn tà nội kết, đại trường truyền đạo thất chức.

6. **Táo kết** (ôn nhiệt chi tà lưu lại lâu hoặc bệnh lâu hao tân thương dịch): táo bón phân khô cứng như phân dê kèm miệng môi khô táo, hoặc đau ngực khó nuốt, lưỡi khô rêu đen, mạch tế sác. Trường đạo khô kết không thông.

PHÂN BIỆT CHỦ YẾU: Nhiệt kết (mặt đỏ sốt, lưỡi đỏ rêu vàng, mạch hoạt thực) KHÁC hẳn hàn kết (mặt trắng chi lạnh, lưỡi nhạt rêu trắng, mạch trầm trì). Khí trệ (ngực sườn tức đầy, mạch huyền). Khí hư (khí đoản vô lực, thần trí uể oải, mạch hư). Huyết hư (sắc mặt trắng bệch, hoa mắt, tâm quý, mạch tế). Táo kết (đặc điểm bệnh lâu, tân hao dịch tổn).`,
      keyPoints: "Táo bón: Nhiệt kết (thực, nóng) đối lập Hàn kết (thực, lạnh) — cả hai đều thực chứng nhưng tính chất ngược nhau\nKhí trệ (thực, mạch huyền) khác Khí hư/Huyết hư (hư, rặn mệt/khó ra) — phân biệt bằng có lực hay không có lực khi rặn",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Tiểu Tiện Bất Lợi (Tiểu Không Thông, 7 chứng)",
      category: cat,
      summary: "Tiểu tiện bất lợi (khó đi, lượng giảm, thậm chí tắc nghẽn) bệnh vị tại bàng quang, liên quan phế-tỳ-thận — gặp trong thủy thũng (dương/âm thủy), long bế (nhiệt kết/mệnh môn hỏa suy/nhiệt tà úng phế/huyết hư), lâm bệnh, và ngoại cảm nhiệt bệnh âm thương.",
      content: `TIỂU TIỆN BẤT LỢI: khó đi (bài niệu khó), lượng nước tiểu giảm, thậm chí tắc nghẽn — gặp trong thủy thũng, long bế, lâm trọc. Ngoại cảm nhiệt bệnh nhiệt thịnh thương tân cũng gây. Bệnh vị chủ yếu BÀNG QUANG, liên quan PHẾ-TỲ-THẬN: bàng quang khí hóa bất lợi; phế khí không thông điều thủy đạo hạ du bàng quang; tỳ khí bất vận thủy thấp bất hành; thận khí khuy hư mệnh môn hỏa suy tam tiêu quyết độc thất chức.

7 chứng thường gặp:

1. **Dương thủy chứng** (trong thủy thũng): tiểu bất lợi, màu vàng sậm kèm ố hàn sốt, ho, đau họng, phù mặt rồi phù toàn thân, phù ấn lõm, táo kết, bụng trướng, rêu nê, mạch sác. Ngoại tà xâm tập, phế khí thất tuyên, tam tiêu úng trệ.

2. **Âm thủy chứng** (trong phù thũng): tiểu bất lợi, mặt phù chân sưng (bắt đầu từ chân), phù ấn lõm, kèm tức ngực, ăn kém, chi lạnh, lừ đừ, tiêu chảy, thân thể nặng nề sưng đau, lưỡi bệu to, rêu trắng, mạch trầm trì nhược. Tỳ dương bất chấn, thận dương hư nhược.

3. **Nhiệt kết bàng quang** (trong long bế): tiểu bất lợi hoặc từng giọt, nước tiểu vàng sậm, đau cứng thiếu phủ kèm miệng khô khát không muốn uống, đại tiện không sảng, lưỡi đỏ rêu vàng, mạch sác hữu lực. Tà nhiệt kết thái dương chi phủ.

4. **Mệnh môn hỏa suy** (trong long bế): tiểu không thông kèm lưng gối tê mỏi vô lực, tứ chi không ấm, sắc mặt nhợt nhạt, lưỡi nhạt nộn, mạch trầm tế nhược. Thận dương hư, mệnh môn hỏa suy không ôn húc bàng quang.

5. **Nhiệt tà úng phế** (trong long bế): tiểu bất lợi hoặc từng giọt, miệng khô họng táo, phiền khát muốn uống, hơi thở ngắn gấp, rêu vàng, mạch sác. Nhiệt tà úng phế, phế thất túc giáng.

6. **Huyết hư chứng** (trong long bế): tiểu bất lợi hoặc từng giọt hoặc dòng nhỏ, đau ngầm trướng căng bụng dưới, lưỡi tím tối có ứ ban/điểm, mạch sáp hoặc tế sác. Ứ huyết lưu trệ bàng quang.

7. **Lâm bệnh**: tiểu bất lợi, lâm ly thích thống (đau như chọc châm), tiểu nhiều nhưng rắt gắt, cảm giác còn muốn tiểu, bụng dưới đau co thắt hoặc lan lưng bụng, hoặc tiểu ra sạn/máu, lưỡi nhạt, rêu mỏng, mạch huyền sác. Nhiệt kết bàng quang, khí hóa bất hành.

8. **Ngoại cảm nhiệt bệnh âm thương tân khuy**: tiểu bất lợi, sốt không mồ hôi, phiền khát, miệng khô lưỡi táo, táo bón, sơ khởi ố hàn sau sốt cao ra mồ hôi, lưỡi đỏ rêu vàng khô, mạch huyền tế mà sác. Nhiệt thịnh thương tân, thủy nguyên bất túc.

PHÂN BIỆT CHỦ YẾU: Thủy thũng (tiểu bất lợi KÈM phù thũng) — dương thủy (phù từ mặt, kèm ố hàn sốt đau họng tiểu vàng sậm táo bón) khác âm thủy (phù từ chân, kèm tức ngực ăn kém chi lạnh tiêu chảy). Long bế (tiểu bất lợi KHÔNG kèm phù thũng) — nhiệt kết bàng quang (tiểu vàng sậm, bụng dưới đau cứng, lưỡi đỏ rêu vàng); mệnh môn hỏa suy (lưng mỏi gối mềm, mặt trắng, chi lạnh); nhiệt tà úng phế (họng khô, hơi thở gấp ngắn, phiền khát); huyết hư (bụng dưới trướng mãn đau âm ỉ, lưỡi tím ứ ban). Lâm bệnh (lâm ly thích thống, tiểu lắt nhắt gắt đau đường tiểu RẤT RÕ). Ngoại cảm âm thương tân khuy (không mồ hôi, phiền khát, táo bón, CÓ bệnh sử sốt cao đổ mồ hôi).`,
      keyPoints: "Tiểu bất lợi: có phù thũng = thủy thũng bệnh (dương/âm thủy, phân biệt vị trí phù bắt đầu mặt/chân); không phù thũng = long bế bệnh (4 thể: nhiệt kết/mệnh môn hỏa suy/nhiệt tà úng phế/huyết hư)\nLâm bệnh đặc trưng bởi đau rắt gắt RÕ RỆT ở đường tiểu, khác long bế",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề: Táo Bón (6 chứng) và Tiểu Tiện Bất Lợi (8 chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
