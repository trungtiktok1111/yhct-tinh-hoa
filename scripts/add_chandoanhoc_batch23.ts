import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên Triệu Chứng Chẩn Đoán Gián Biệt, mục Phát Nhiệt (Triều nhiệt, Vãng lai hàn nhiệt, Phiền nhiệt)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Triều Nhiệt (6 bệnh phân biệt)",
      category: cat,
      summary: "Triều nhiệt là sốt có quy luật nhất định như thủy triều, đúng giờ phát đúng giờ ngưng — chia thực chứng (dương minh nhiệt kết, đàm nhiệt trở phế, thấp tà lưu luyến) và hư chứng (âm hư, cốt chưng).",
      content: `TRIỀU NHIỆT: sốt có quy luật nhất định, tăng giảm như thủy triều, mỗi ngày 1 lần, đúng giờ phát đúng giờ ngưng. Thế sốt có cao có thấp, thường gặp giai đoạn giữa-sau ngoại cảm nhiệt bệnh và một số bệnh nội thương. Ngoại cảm nhiệt bệnh: đa số là "Dương minh triều nhiệt" (dương minh phủ nhiệt chứng) — sốt hơi tăng về chiều (ngọ hậu), còn gọi "Nhật bô triều nhiệt". Nội thương: đa số do âm hư gây ra, gọi "Âm hư triều nhiệt". Sốt lâu ngày không lui, khí huyết bất vinh, hình thể gầy gò, sốt như phát từ trong xương ra — gọi "Cốt chưng triều nhiệt". Triều nhiệt thuộc lý nhiệt, khác tráng nhiệt/phiền nhiệt ở tính quy luật; giống tráng nhiệt ở việc nhiều loại ngoại cảm có biểu hiện giống nhau nên trọng điểm phân biệt là "Chứng".

6 bệnh thường gặp có triều nhiệt:

1. **Nhiệt kết dương minh chứng**: triều nhiệt nhật bô mới phát kiêm đầy trướng cứng đau vùng bụng dưới, đại tiện táo kết hoặc phân loãng toàn nước, nhiều khi chiêm ngữ, rêu lưỡi táo thậm chí rêu xám đen mà khô, mạch trầm hữu lực. Tà nhiệt tụ kết trường vị.

2. **Đàm nhiệt trở phế chứng**: triều nhiệt kiêm suyễn thúc không dứt, đàm dãi úng thịnh, đại tiện bí kết, rêu vàng nê hoặc hoạt, mạch bộ thốn phải thực đại. Đàm nhiệt trở phế kết tại đại trường, phế khí không thông mà suyễn, đại trường nhiệt kết mà bón.

3. **Thấp ôn lưu luyến khí phần chứng**: triều nhiệt thân nhiệt bất dương kèm đầu mình nặng nề, ngực bụng bĩ muộn, bụng trướng tiêu phân lỏng, khát mà không muốn uống, nôn ói không muốn ăn, rêu dày nê hoặc vàng nhạt, mạch nhu hơi sác hoặc nhu hoãn, phát mùa hè. Thấp ôn khốn trở tỳ dương, thấp át nhiệt phục.

4. **Giai đoạn hạ tiêu chứng của ôn bệnh (tàn dư nhiệt chưa hết)**: triều nhiệt sau ngọ (ngọ hậu), sốt cao đã hạ nhưng chưa dứt, kèm quyền đỏ, miệng họng khô táo, thủ túc tâm nhiệt thậm chí nóng cả mu bàn tay chân, tinh thần uể oải lười nói, tâm phiền mất ngủ, lưỡi đỏ rêu ít hoặc không rêu, mạch tế sác. Tàn dư nhiệt không dứt hết mà âm dịch chưa hồi phục, can thận âm hư.

5. **Phế thận âm hư chứng**: triều nhiệt quyền đỏ kèm đạo hạn, mất ngủ, ho khan ít đàm, hoa mắt ù tai, lưỡi đỏ ít tân ít rêu hoặc không rêu, mạch tế sác. Âm hư huyết khuy tân dịch bất túc.

6. **Âm hư hỏa vượng chứng** (cốt chưng): triều nhiệt cốt chưng, sốt lâu ngày không lui kèm quyền đỏ đạo hạn, ngũ tâm phiền nhiệt, mất ngủ mơ nhiều, ho đàm ít mà dính hoặc lẫn máu (nặng thì khạc máu), tứ chi vô lực, miệng khô họng táo, hoa mắt ù tai, hình thể gầy ốm, lưỡi quang (không rêu) đỏ ít tân dịch, mạch tế sác. Sốt cao lâu ngày thương tổn âm, hư hỏa thượng viêm chước thương mạch lạc.

ĐIỂM PHÂN BIỆT CHÍNH: chia THỰC CHỨNG triều nhiệt và HƯ CHỨNG triều nhiệt.
- **Thực chứng**: Nhiệt kết dương minh (phát nhật bô, sốt hơi cao, bụng cứng đầy đau, táo bón hoặc chỉ tiêu nước). Đàm nhiệt trở phế (đàm dãi úng thịnh, suyễn thúc không dứt). Thấp tà lưu luyến khí phần (thân nhiệt bất dương, ngực bụng bĩ muộn, bụng trướng tiêu chảy).
- **Hư chứng**: Ôn bệnh hạ tiêu chứng (từ thượng tiêu chuyển đến, mới bệnh sốt cao tráng nhiệt, khi sốt hạ tàn dư nhiệt chưa hết đã xuất hiện triều nhiệt, thế nhiệt hơi thấp — bệnh sử khác phế thận âm hư và âm hư hỏa vượng). Phế thận âm hư (triều nhiệt NHẸ, KHÔNG ho ra máu). Âm hư hỏa vượng (bệnh TƯƠNG ĐỐI NẶNG, bệnh trình DÀI, triều nhiệt cốt chưng, HO RA MÁU là biểu hiện chủ yếu — khác phế thận âm hư).`,
      keyPoints: "Triều nhiệt = sốt có quy luật như thủy triều, đúng giờ phát đúng giờ ngưng\nChia Thực chứng (nhiệt kết dương minh/đàm nhiệt trở phế/thấp tà lưu luyến — đều có dấu hiệu thực tà rõ) và Hư chứng (ôn bệnh hạ tiêu/phế thận âm hư/âm hư hỏa vượng — phân biệt theo độ nặng và có ho ra máu hay không)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Vãng Lai Hàn Nhiệt (3 bệnh phân biệt)",
      category: cat,
      summary: "Hàn nhiệt vãng lai (sốt và ố hàn thay nhau xuất hiện, không đồng thời) là dấu hiệu tà ở bán biểu bán lý — phân biệt thương hàn thiếu dương, phục thử phạm thiếu dương, và ngược tật (sốt rét).",
      content: `VÃNG LAI HÀN NHIỆT: sốt và ố hàn thay nhau xuất hiện — khi sốt không cảm lạnh, khi lạnh không cảm sốt. Là dấu hiệu tà nhập bán biểu bán lý. Một ngày có thể phát vài lần đến vài chục lần. Phát đúng giờ là ngược tật (sốt rét); không định kỳ là ngoại cảm nhiệt bệnh.

3 bệnh thường gặp:

1. **Thương hàn tà nhập thiếu dương chứng**: vãng lai hàn nhiệt, ngực sườn khổ mãn kèm tâm phiền buồn nôn, không muốn ăn uống, miệng đắng họng khô, chóng mặt, mạch huyền. Phong hàn chi tà truyền nhập thiếu dương, chính tà giao tranh bán biểu bán lý — tà nội nhập thì hàn, chính khí khu tà ra biểu thì nhiệt. Vị khí thất hòa nên tâm phiền muốn ói không muốn ăn; tà nhiệt thương tân nên miệng đắng họng khô.

2. **Phục thử tà phạm thiếu dương chứng**: hàn nhiệt vãng lai như "ngược" (sốt rét), miệng khát tâm phiền, tức bụng, sốt tăng về chiều đêm càng tăng cao, khi trời sáng đổ mồ hôi thì triệu chứng đều hết nhưng vẫn còn ngực bụng chước nhiệt, rêu vàng mà nê, mạch huyền sác, phát mùa thu đông. Thử thấp uất tại thiếu dương.

3. **Ngược tật** (sốt rét): vãng lai hàn nhiệt lúc phát lúc không kèm tay chân mình mẩy đau tê, toàn thân phạt lực, đầu đau như vỡ, miệng khát thích uống, sau ra mồ hôi sốt lui thân thể mát mẻ, cứ tái đi tái lại, mạch huyền, phát mùa hè thu. Ngược tà xâm nhập bán biểu bán lý, tà chính giao tranh.

ĐIỂM PHÂN BIỆT CHỦ YẾU: Thương hàn tà nhập thiếu dương — hàn nhiệt vãng lai phát KHÔNG ĐỊNH GIỜ, miệng khát và ngực bụng chước nhiệt (khác phục thử). Ngược tật — phát mùa hè thu, hàn nhiệt vãng lai LÚC PHÁT LÚC NGƯNG, tái lập LIÊN TỤC CÓ TÍNH CHU KỲ (khác 2 chứng kia không có tính chu kỳ rõ).`,
      keyPoints: "Vãng lai hàn nhiệt = dấu hiệu tà ở bán biểu bán lý (thiếu dương); phân biệt chính: phát đúng giờ theo chu kỳ = ngược tật (sốt rét); không định kỳ = ngoại cảm nhiệt bệnh (thương hàn thiếu dương hoặc phục thử)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Phiền Nhiệt (11 bệnh phân biệt)",
      category: cat,
      summary: "Phiền nhiệt (sốt kèm bứt rứt bực bội không yên, 'nội nhiệt vi phiền') khác tráng nhiệt/triều nhiệt ở biểu hiện chủ yếu là tâm phiền/thao nhiễu chứ không chỉ là sốt — chia thể thực nhiệt (7 bệnh) và hư nhiệt (4 bệnh).",
      content: `PHIỀN NHIỆT: bệnh nhân do sốt mà cảm thấy bực bội (phiền thao) không yên, hoặc ngũ tâm phiền nhiệt (bứt rứt bực bội), ngồi nằm không yên. Gặp trong ngoại cảm bệnh và một số nội thương. Sốt cao đa số thực chứng, sốt thấp đa số hư chứng. "Loại chứng trị tài": "Nội nhiệt vi phiền". Phiền nhiệt đa số thuộc lý nhiệt chứng, thường pha trộn với tráng nhiệt/triều nhiệt của lý chứng — phân biệt: "Phiền nhiệt" biểu hiện chủ yếu là "Tâm phiền"/"Thao nhiễu", còn tráng nhiệt/triều nhiệt biểu hiện chủ yếu là "Sốt". Điều trị phiền nhiệt đa số đồng thời thanh nhiệt và trừ phiền.

THỂ THỰC NHIỆT (7 bệnh):

1. **Phong ôn bệnh nhiệt nhiễu hung cách**: phiền thao bất an, sốt không dứt kèm hung cách chước nhiệt như thiêu đốt, môi miệng khô táo, miệng khát tiện bí, lưỡi đỏ rêu vàng, mạch hoạt sác, phát mùa xuân. Tân dịch khuy tổn.

2. **Thử ôn bệnh thử nhập dương minh chứng**: tâm phiền tráng nhiệt kèm đau đầu chóng mặt, mặt đỏ khí thô, miệng khát mồ hôi nhiều, rêu vàng khô, mạch hồng sác, phát mùa hè. Thử nhiệt thương khí, nhiệt chước dương minh nội nhiễu tâm thượng chưng đầu.

3. **Ôn bệnh nhiệt nhập tâm dinh chứng**: phiền thao tráng nhiệt kèm đêm ngủ không ngon, có lúc chiêm ngữ, họng khô, nặng thì hôn mê bất tỉnh, lưỡi đỏ thẫm, mạch sác, phát xuân hạ (gặp trong thử ôn, xuân ôn, phong ôn). Tà nhập tâm dinh, dinh âm bị chước, nhiệt nhiễu tâm thần.

4. **Ôn bệnh nhiệt thịnh động huyết chứng**: phiền thao tráng nhiệt nặng thì hôn cuồng chiêm vọng kèm ban chẩn màu tím đen hoặc thổ nục tiện huyết, lưỡi đỏ thẫm, phát xuân hạ (gặp thử ôn, xuân ôn). Tráng nhiệt nhiễu động tâm thần bức huyết vọng hành.

5. **Thấp ôn bệnh thấp nhiệt uất trở trung tiêu**: phiền thao bất ninh, sốt ra mồ hôi không hết sốt kèm miệng khát không muốn uống nước, ngực bụng bĩ muộn, nôn ói, tiêu phân lỏng vàng hoặc rôm sảy, rêu vàng hoạt nê, mạch hoạt sác, phát mùa hạ. Thấp nhiệt uất trở trung tiêu, thăng giáng thất điều.

6. **Thu táo bệnh táo nhiệt thương phế chứng**: tâm phiền sốt, ho khan không đàm, khí nghịch mà suyễn kèm miệng họng khô, ngực đầy miệng khát, rêu trắng mỏng mà khô, lưỡi đỏ hai rìa và đầu lưỡi, mạch sác, phát mùa thu. Táo nhiệt chước phế âm dịch hao thương.

7. **Thấp nhiệt phát hoàng, dương hoàng chứng**: tâm phiền bứt rứt, sốt miệng khát kèm vàng mắt vàng da (màu vàng tươi), buồn nôn nôn ói, tiểu ngắn đỏ, bụng trướng đầy, hoặc táo bón, rêu vàng nê, mạch huyền sác. Thấp nhiệt giao chưng, đởm trấp tràn ra gây vàng.

Và thêm 2 chứng thủy/khí liên quan:
- **Thủy thũng thấp nhiệt úng thịnh chứng**: tâm phiền sốt, miệng khát mà không muốn uống kèm toàn thân phù thũng, ngực bụng tức căng, tiểu ngắn đỏ đại tiện khô, rêu vàng nê, mạch trầm sác. Thấp tà nội uẩn cùng nhiệt giao chưng, tam tiêu bất lợi.
- **Thử ôn giai đoạn cuối, thử thương tâm thận**: phiền thao sốt kèm tiêu khát, lưỡi đỏ thẫm, rêu vàng táo, phát hạ, bệnh trình dài. Thử nhiệt lưu lại lâu ảnh hưởng tâm thận, thủy hỏa không ký tế.

THỂ HƯ NHIỆT (4 bệnh/chứng):

1. **Âm hư hỏa vượng chứng**: tâm phiền sốt không nằm nghỉ được kèm lưỡi đỏ rêu vàng, mạch tế sác. Nhiệt thương thận âm, tâm hỏa kháng thịnh. Thường gặp nội thương tạp bệnh hoặc xuân ôn/phong ôn giai đoạn cuối, phát xuân.

2. **Thử thương tâm thận** (giai đoạn cuối thử bệnh, đã nêu ở thực nhiệt nhưng cũng mang tính hư — đàm nhiệt tiêu khát liên tục).

3. **Can âm bất túc chứng**: tâm trung phiền nhiệt kèm sườn đau âm ỉ, miệng khô họng táo, hoa mắt chóng mặt, mắt khô rát, lưỡi đỏ ít rêu, mạch huyền tế mà sác. Can uất lâu hóa hỏa hao can âm, hoặc bệnh lâu suy nhược tinh huyết khuy tổn. Bệnh trình dài, đau âm ỉ vùng sườn, mắt khô rát.

4. **Hư nhiệt phế nuy chứng**: ngũ tâm phiền nhiệt kèm ho khan đàm ít, khí cấp suyễn thúc, họng khô táo, da khô, lưỡi đỏ thẫm ít rêu mà khô, mạch hư sác. Hư hỏa nội viêm, phế nhiệt diệp tiêu, âm tân khô kiệt. Có bệnh sử phế bệnh, bệnh trình dài, ho suyễn không đàm, da khô không mồ hôi.

PHÂN BIỆT CHỦ YẾU: Thể thực nhiệt — mỗi bệnh có mùa phát và đặc điểm riêng (phong ôn nhiệt nhiễu hung cách: ngực chước nhiệt, xuân; thử nhập dương minh: mồ hôi nhiều khát mạch hồng sác, hạ; nhiệt nhập tâm dinh: chiêm ngữ lưỡi đỏ thẫm, xuân hạ; nhiệt thịnh động huyết: phải có phát ban/máu cam/tiện huyết; thấp nhiệt uất trở trung tiêu: khát không muốn uống, đầy bụng tiêu chảy/rôm sảy, hạ; táo nhiệt thương phế: ho khan không đàm miệng khô, thu; dương hoàng: vàng da toàn thân màu tươi). Thể hư nhiệt — âm hư hỏa vượng (sốt tâm phiền không nằm nghỉ được là chủ yếu); thử thương tâm thận (đàm nhiệt tiêu khát liên tục, hạ); can âm bất túc (đau âm ỉ sườn, mắt khô rát, bệnh trình dài — khác 2 chứng ngoại cảm cuối kỳ trên); phế nuy (bệnh sử phế bệnh, ho suyễn không đàm da khô không mồ hôi — đặc trưng riêng).`,
      keyPoints: "Phiền nhiệt khác tráng nhiệt/triều nhiệt: biểu hiện CHỦ YẾU là tâm phiền/thao nhiễu (không chỉ là mức độ sốt) — điều trị phải kết hợp thanh nhiệt VÀ trừ phiền\nThể thực nhiệt (7+ bệnh, đa số ngoại cảm nhiệt bệnh các giai đoạn) vs Thể hư nhiệt (4 bệnh/chứng, âm hư là gốc, bệnh trình dài hơn)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 3 chủ đề: Triều Nhiệt (6 bệnh), Vãng Lai Hàn Nhiệt (3 bệnh), Phiền Nhiệt (11 bệnh).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
