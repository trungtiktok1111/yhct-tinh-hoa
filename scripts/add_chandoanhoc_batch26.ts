import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Mất Máu/Thất Huyết (Khái huyết, Ẩu huyết, Nục huyết, Tiện huyết, Niệu huyết, Băng lậu)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Mất Máu Tổng Quan và Khái Huyết (Ho Ra Máu, 6 chứng)",
      category: cat,
      summary: "Thất huyết (huyết không tuần kinh, tràn ra ngoài mạch) chia 6 vị trí: thổ huyết, khái huyết, nục huyết, tiện huyết, niệu huyết, băng lậu — nguyên nhân chính là hỏa (hư/thực) và khí (nghịch/hư) và ứ huyết. Khái huyết (ho ra máu) bệnh vị tại phế, liên quan can thận.",
      content: `THẤT HUYẾT TỔNG QUAN: huyết không tuần kinh mà vọng hành tràn ra ngoài mạch đạo gây xuất huyết. Theo vị trí chia: thổ huyết (ẩu huyết), khái huyết, nục huyết, tiện huyết, niệu huyết, băng lậu. Nguyên nhân thường gặp: HỎA và KHÍ. Hư hỏa và thực hỏa trong tạng phủ đều có thể chước thương kinh lạc, bức huyết vọng hành. Khí nghịch là huyết theo khí thượng nghịch; khí hư không thể nhiếp huyết — đều dẫn đến thất huyết. Ứ huyết trở trệ, huyết bất quy kinh cũng gây thất huyết.

KHÁI HUYẾT (ho ra máu): máu từ khí đạo theo đàm ho khạc ra, hoặc đàm kèm tơ máu, hoặc ho hộc ra máu, màu tươi thường kèm bọt. Bệnh vị tại PHẾ nhưng liên quan can thận. Tính chất thuộc NHIỆT chứng, chia ngoại cảm (đa số thực) và nội thương (đa số hư). Hư nhiệt, thực nhiệt đều làm phế lạc tổn thương, huyết dịch ngoại dật.

6 chứng thường gặp:
1. **Phong nhiệt thương phế chứng**: đàm lẫn máu kèm ho đàm vàng, đau họng, miệng khát, sốt hoặc hơi ố phong hàn, rêu mỏng vàng, mạch phù sác hoặc hoạt sác. Phát xuân là ngoại cảm phong nhiệt xâm phế; phát đông là ngoại cảm phong hàn nhập lý hóa nhiệt.
2. **Thu táo, táo nhiệt thương phế chứng**: đàm kèm sợi huyết, ho khan ít đàm hoặc không đàm, có lúc đau ngực, mũi họng khô, sốt hơi ố phong hàn, đầu lưỡi đỏ, rêu mỏng vàng, mạch hoạt sác. Phát thu khô táo. Táo tà hao tân tổn phế lạc.
3. **Can hỏa phạm phế chứng**: khái huyết kèm miệng đắng, tức ngực, khí đoản, đau ngực sườn, phiền thao dễ cáu, đại tiện khô táo, lưỡi đỏ rêu vàng, mạch huyền sác. Can hỏa kháng thịnh nghịch hành chước thương phế lạc.
4. **Phế khí hư suy khái huyết chứng**: đàm lẫn máu kèm ho lâu ngày, ho đàm loãng, chóng mặt, khí đoản phạt lực, da lông khô héo, lưỡi nhạt, mạch trầm trì vô lực. Ho lâu phế khí bất túc, phế lạc lúc căng lúc chùng, dương khí không cố thủ.
5. **Phế lao ho máu**: khái huyết màu đỏ tươi kèm triều nhiệt đạo hạn, lưỡng quyền đỏ, hình thể gầy ốm, lưỡi đỏ không rêu, mạch tế sác. Hư tổn lâu thành lao, phế tân hao tổn, âm hư hỏa vượng chước thương phế lạc.
6. **Tâm phế lưỡng hư**: khái huyết trong huyết lẫn bọt lượng nhiều kèm tâm quý liên tục, khí suyễn không nằm được, quyền đỏ, phiền muộn, họng hầu chước nhiệt, lưỡi đỏ, mạch tế sác hoặc kết đại. Khí hư không nhiếp huyết, âm hư hỏa vượng lạc mạch tổn thương.

PHÂN BIỆT CHỦ YẾU: phong nhiệt thương phế (phát đông xuân, có bệnh sử ố hàn sốt, đàm vàng, sốt). Thu táo (chỉ phát thu táo, ho khan ít đàm, mũi họng khô táo). Can hỏa phạm phế (miệng đắng, đau sườn, phiền thao dễ nộ). Phế khí hư (bệnh trình dài, hoa mắt chóng mặt, khí đoản đàm loãng, lưỡi nhạt trắng). Phế lao (hư lao lâu ngày, quyền đỏ triều nhiệt đạo hạn gầy gò lưỡi đỏ). Tâm phế khí âm lưỡng hư (bệnh trình dài, khạc máu lẫn bọt, tâm quý khí suyễn).`,
      keyPoints: "Thất huyết 6 vị trí (thổ/khái/nục/tiện/niệu huyết + băng lậu) — nguyên nhân chung: Hỏa (hư/thực) + Khí (nghịch/hư) + Ứ huyết\nKhái huyết luôn thuộc nhiệt chứng; ngoại cảm (phong nhiệt/táo nhiệt) đa số thực, nội thương (can hỏa/phế khí hư/phế lao/tâm phế lưỡng hư) đa số hư — phân biệt theo bệnh sử, mùa, và kiêm chứng",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Ẩu Huyết (Nôn Máu, 4 chứng) và Nục Huyết (Chảy Máu Mũi/Chân Răng, 7 chứng)",
      category: cat,
      summary: "Ẩu huyết (huyết nôn ra kèm thức ăn, bệnh vị tại thực quản/vị, liên quan can tỳ) và Nục huyết (xuất huyết mũi/chân răng/tai/lưỡi/da không do sang chấn, liên quan phế/vị/can/thận).",
      content: `ẨU HUYẾT (NÔN MÁU): huyết dịch nôn ra đường miệng kèm thức ăn. Bệnh vị chủ yếu thực quản và vị, liên quan can tỳ. Chia hư thực hàn nhiệt — đa số do tình chí thất điều, ẩm thực bất tiết, lao dật quá độ tạo hỏa nội sinh, hoặc khí hư bất nhiếp, huyết dịch vọng hành.

4 chứng thường gặp:
1. **Vị nhiệt úng thịnh ẩu huyết**: nôn máu màu tím tối hoặc tím đỏ kèm thức ăn, đau trướng căng bụng, miệng hôi, môi đỏ, đại tiện khô táo sắc đen, rêu vàng nê, mạch hoạt sác. Vị trung tích nhiệt chước thương mạch lạc, huyết tùng khí thăng.
2. **Can hỏa phạm vị ẩu huyết**: ẩu huyết tím tối hoặc đỏ tươi kèm đồ ăn, đau trướng vùng sườn, miệng đắng, tâm phiền dễ cáu, lưỡi đỏ, mạch huyền sác. Can hỏa phạm vị tổn thương vị lạc.
3. **Tâm tỳ lưỡng hư**: ẩu huyết màu nhạt tối, tái phát liên tục kèm mặt trắng môi nhạt, gầy gò mệt mỏi, tâm quý khí đoản, bụng trướng tiêu chảy, lưỡi nhạt nộn, mạch tế nhược. Khí hư không nhiếp huyết, huyết bất tuần kinh vọng hành.
4. **Tỳ hư hàn ngưng**: ẩu huyết màu nhạt tối tái phát liên tục kèm đau âm ỉ bụng, sắc mặt trắng nhợt, tứ chi không ấm, lười biếng vô lực, lưỡi nhạt rêu mỏng trắng, mạch trầm tế vô lực. Tỳ hư không thống huyết, trung hư hàn ngưng.

PHÂN BIỆT: vị nhiệt úng thịnh (miệng hôi, táo bón, rêu vàng). Can hỏa phạm vị (sườn trướng thống, miệng đắng dễ cáu). Tâm tỳ lưỡng hư (PHẢI kèm tâm quý, khí đoản, tiêu phân lỏng). Tỳ hư hàn ngưng (bụng đau âm ỉ, sắc mặt nhợt nhạt, tứ chi không ấm).

NỤC HUYẾT: xuất huyết mũi, chân răng, tai, lưỡi, da KHÔNG mang tính sang chấn (tỵ nục và xỉ nục — máu cam, máu chân răng — hay gặp nhất). Chủ yếu do bệnh biến phế, vị, can, thận: phế vị nhiệt thịnh, can hỏa thượng nghịch bức huyết vọng hành, can thận âm hư hư hỏa thượng viêm tổn mạch lạc, hoặc khí hư không thống nhiếp huyết.

7 chứng thường gặp:
1. **Phế nhiệt tỵ nục**: máu cam nhiều/ít kèm mũi họng khô táo, sốt, ho ít đàm, lưỡi đỏ, mạch sác. Phong nhiệt/táo nhiệt phạm phế, phế nhiệt thượng chưng tới phế khiếu.
2. **Vị hỏa tỵ nục**: máu cam đỏ tươi lượng tương đối nhiều kèm tức ngực, miệng hôi, khát thích uống, táo bón, lưỡi đỏ rêu vàng, mạch sác. Vị hỏa tuần kinh thượng phạm vị mạch (vị mạch khởi từ mũi).
3. **Can hỏa tỵ nục**: máu mũi xuất hiện theo tình chí biến hóa kèm đau đầu hoa mắt, mắt đỏ, phiền thao dễ nộ, lưỡi đỏ, mạch huyền sác. Can khí uất kết hóa hỏa bức huyết vọng hành tuần kinh.
4. **Thận hư hỏa vượng tỵ nục**: chảy máu mũi hay tái phát kèm hoa mắt ù tai, mũi khô mà nóng, lưng gối mỏi tê, lưỡi quang đỏ, mạch tế sác. Thận dương bất túc hư hỏa nội nhiễu chước thương mạch lạc.
5. **Vị trường thực hỏa xỉ nục**: chảy máu chân răng đỏ tươi kèm đau sưng đỏ chân răng, miệng hôi, táo kết, rêu vàng/cáu, mạch hồng sác.
6. **Vị trung hư hỏa xỉ nục**: chảy máu chân răng hay tái phát lâu không khỏi, màu hơi đỏ/nhạt kèm lở loét chân răng sưng đau, miệng khô, rêu vàng hoặc giữa quang ít tân, mạch nhỏ hoạt sác. Vị âm bất túc hư hỏa nội nhiễu.
7. **Thận hư hỏa vượng xỉ nục**: chảy máu chân răng từng giọt màu đỏ nhạt kèm sưng phù chân răng, răng lung lay hơi đau, hoa mắt ù tai, lưỡi nhạt đỏ, mạch tế sác. Thận hư hỏa động phù lên trên.

Thêm **khí huyết khuy hư chứng**: máu mũi/chân răng hoặc da xuất huyết từng đám màu tím ấn không đổi màu kèm hoa mắt tâm quý, sắc mặt nhợt nhạt, uể oải vô lực, lưỡi nhạt mạch tế vô lực. Khí không nhiếp huyết, huyết vô sở chủ ngoại dật.
Lưu ý: phụ nữ chảy máu cam trước/sau/trong kỳ kinh gọi "Đảo kinh"/"Nghịch kinh" — huyết nhiệt bức huyết thượng hành thương lạc, liên quan chu kỳ kinh, có tính quy luật, kèm kinh không đều.

PHÂN BIỆT NỤC HUYẾT: phế nhiệt tỵ nục (mũi họng khô táo, sốt, ho ít đàm). Vị hỏa tỵ nục (đỏ tươi, miệng hôi, táo bón). Can hỏa tỵ nục (hoa mắt mắt đỏ phiền thao dễ cáu). Thận hư hỏa vượng (ù tai, lưng gối mỏi tê). Vị trường thực hỏa xỉ nục (sưng đỏ đau chân răng, miệng hôi, táo bón). Vị trung hư hỏa (lở loét chân răng, miệng khô). Thận hư hỏa vượng xỉ nục (lợi sưng đau, răng lung lay, hoa mắt ù tai). Khí huyết khuy hư (khí đoản, tâm quý, mặt trắng nhợt, lừ đừ vô lực).`,
      keyPoints: "Ẩu huyết (bệnh vị tại vị/can-tỳ): vị nhiệt (thực, miệng hôi táo bón) → can hỏa (tức giận) → tâm tỳ lưỡng hư (khí hư) → tỳ hư hàn ngưng (hư hàn) — từ thực tới hư dần\nNục huyết (phế/vị/can/thận): phân biệt theo vị trí xuất huyết VÀ tạng gây bệnh — tỵ nục (mũi) do phế/vị/can/thận; xỉ nục (răng) do vị thực/vị hư/thận hư",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Tiện Huyết, Niệu Huyết, Băng Lậu",
      category: cat,
      summary: "Tiện huyết (máu qua hậu môn, khác kiết lỵ ở không có mủ nhầy/lý cấp hậu trọng), Niệu huyết (tiểu máu, bệnh tại thận-bàng quang liên quan tâm/tiểu trường/can/tỳ), Băng lậu (xuất huyết âm đạo ngoài kỳ kinh, liên quan can-tỳ-thận-xung nhâm).",
      content: `TIỆN HUYẾT (tiêu ra máu): huyết từ hậu môn ra, kèm phân hoặc chỉ có máu. KHÁC kiết lỵ: tiện huyết máu lẫn trong phân (thường máu tươi), kiết lỵ phân kèm máu NHẦY + có lý cấp hậu trọng. Đa số do ẩm thực bất tiết thương tỳ vị dẫn trung khí bất túc khí bất nhiếp huyết, hoặc thấp nhiệt uẩn kết đại trường tổn âm lạc.

4 chứng thường gặp:
1. **Tỳ vị hư hàn**: tiêu phân TRƯỚC huyết SAU, màu tím tối kèm tinh thần uể oải phạt lực, đau ngầm bụng, ăn ít, tiêu chảy, lưỡi nhạt, mạch tế nhược. Tỳ bất thống huyết, huyết tràn theo phân xuống.
2. **Thấp nhiệt uẩn chưng**: tiêu máu TRƯỚC phân SAU, màu đỏ tươi kèm miệng đắng dính, tiểu ngắn đỏ, táo bón, rêu vàng nê, mạch hoạt sác hoặc nhu sác. Thấp nhiệt kết tỳ vị hạ di đại trường chước thương âm lạc.
3. **Trường phong hạ huyết**: máu tươi bắn thành tia màu đỏ tươi kèm miệng đắng, tiểu vàng, táo bón, lưỡi đỏ rêu vàng, mạch hoạt sác. Phong nhiệt chước thương trường lạc.
4. **Trĩ tiêu ra máu**: màu đỏ tươi, đau sưng hậu môn kèm trĩ hoặc nứt hậu môn, mạch huyền sác. Thấp nhiệt uất lâu thành trĩ.

PHÂN BIỆT: tỳ vị hư hàn (phân trước máu sau, tím tối, chán ăn tiêu chảy). Thấp nhiệt (máu trước phân sau, đỏ tươi, miệng đắng dính, tiểu ngắn đỏ). Trường phong (máu vọt như cắt cổ gà, đỏ tươi, tiểu vàng táo bón). Trĩ (hậu môn sưng đau kèm búi trĩ/nứt).

NIỆU HUYẾT (tiểu ra máu): bệnh vị tại thận, bàng quang, liên quan tâm, tiểu trường, can, tỳ. Đa số do nhiệt tà nhiễu động huyết phần, hoặc khí suy thống huyết vô quyền.

6 chứng thường gặp:
1. **Tâm hỏa kháng thịnh**: tiểu máu đỏ tươi, niệu đạo nóng rát kèm tâm phiền mất ngủ, miệng khát, mặt đỏ, miệng lưỡi lở, đầu lưỡi đỏ, mạch sác. Dịch nhiệt xuống tiểu trường, nhiệt thương lạc mạch.
2. **Can hỏa nội tích**: tiểu máu đỏ tươi/đỏ sậm, niệu đạo nóng rát kèm miệng đắng khát, hoa mắt chóng mặt, đau sườn, phiền thao dễ cáu, hai rìa lưỡi đỏ, mạch huyền hoạt hoặc sác.
3. **Thận âm bất túc**: tiểu máu tái phát liên tục, đa số đỏ tươi kèm hoa mắt ù tai, lưng gối mỏi mềm, họng khô táo bón, lưỡi đỏ, mạch tế sác. Hư hỏa vọng động chước thương âm lạc.
4. **Tỳ khí hư nhược**: tiểu máu tái phát liên tục sắc nhạt kèm lừ đừ mệt mỏi vô lực, ăn uống giảm, sắc mặt vàng héo/nhợt nhạt, bụng trướng tiêu phân lỏng, lưỡi nhạt mạch hư nhược.
5. **Huyết lâm** (trong lâm bệnh): tiểu máu thậm chí huyết cục, đau rát niệu đạo hoặc tâm phiền, lưỡi đỏ rêu vàng, mạch sác hữu lực. Thấp nhiệt hạ chú bàng quang.
6. **Thạch lâm** (trong lâm bệnh): nước tiểu kèm máu thỉnh thoảng có sa thạch, khó tiểu, tiểu vàng đỏ, cảm giác chặn dòng, đau dữ dội, rêu mỏng vàng, mạch hoạt sác. Thấp nhiệt hạ chú luyện niệu thành sỏi.

PHÂN BIỆT: tâm hỏa (tâm phiền mất ngủ, miệng khát mặt đỏ, lưỡi miệng lở). Can hỏa (miệng đắng, hoa mắt chóng mặt, đau sườn dễ cáu). Thận âm bất túc (ù tai, lưng gối mỏi mềm). Tỳ khí hư (sắc máu nhạt, uể oải vô lực, bụng trướng tiêu lỏng). Huyết lâm (tiểu nóng rát đau). Thạch lâm (thỉnh thoảng tiểu ra sỏi, tiểu ngưng giữa dòng, đau buốt hay tái phát).

BĂNG LẬU HẠ HUYẾT: âm đạo xuất huyết NGOÀI chu kỳ hành kinh, rỉ rả không dứt. Lượng nhiều ồ ạt = "băng"; lượng ít lâm ly không dứt = "lậu". Liên quan can-tỳ-thận và xung nhâm mạch. Đa số do huyết nhiệt, huyết ứ, khí hư.

6 chứng thường gặp:
1. **Thấp nhiệt nội uất**: xuất lượng lớn hoặc rỉ rả lâu, chất đặc dính tanh hôi, tay chân rã rời vô lực, không muốn ăn, táo kết hoặc phân lỏng không sảng, mạch trầm sác.
2. **Can uất hóa hỏa**: xuất huyết nhiều/lâm ly, sắc đỏ nhạt, hoa mắt chóng mặt, miệng khô thích uống, tâm phiền dễ nộ, ngực sườn trướng đau, rêu vàng, mạch huyền sác.
3. **Tâm tỳ lưỡng hư**: xuất huyết nhiều/rỉ rả, sắc nhạt loãng kèm sắc mặt trắng nhợt/hư phù, tâm quý khí đoản, uể oải lười nói, tứ chi không ấm, chán ăn tiêu lỏng, lưỡi bệu dấu răng, mạch tế nhược. Tỳ hư thanh dương không thăng hạ hãm, thống huyết vô quyền.
4. **Thận âm hư**: xuất huyết ít hoặc lâm ly, màu đỏ tươi, hoa mắt ù tai, ngũ tâm phiền nhiệt, quyền đỏ đạo hạn, lưng gối mỏi mềm, lưỡi đỏ ít rêu, mạch tế sác vô lực.
5. **Thận dương hư**: xuất huyết nhiều/rỉ rả, màu đỏ nhạt, tinh thần ủy mị, hoa mắt chóng mặt, úy hàn chi lạnh, tiểu nhiều trong dài, đại tiện lỏng, lưỡi nhạt rêu mỏng trắng, mạch trầm tế/vi nhược (bộ xích rất yếu).
6. **Huyết ứ**: xuất huyết rỉ rả hoặc đột nhiên nhiều kèm huyết cục, đau bụng dưới cự án, chất lưỡi tối đỏ có ứ điểm, mạch trầm sáp hoặc huyền khẩn.

PHÂN BIỆT: thấp nhiệt nội uất (xuất huyết đặc hôi tanh, miệng đắng dính, không ăn, đại tiện bất sảng). Can uất hóa hỏa (máu đỏ tươi, miệng khô thích uống, tâm phiền dễ nộ, đau sườn). Tâm tỳ khí hư (máu loãng nhạt, sắc mặt nhợt, ăn kém tiêu lỏng, lưỡi bệu dấu răng). Thận âm hư (xuất huyết ít, hoa mắt ù tai, quyền đỏ đạo hạn, lưng gối mỏi mềm). Thận dương hư (máu nhạt, úy hàn chi lạnh, tiểu nhiều trong). Huyết ứ (màu đỏ tối kèm huyết cục, đau bụng dưới, lưỡi ứ điểm).`,
      keyPoints: "Tiện huyết: phân trước-máu sau (hư hàn) khác máu trước-phân sau (thấp nhiệt); trường phong (bắn tia) khác trĩ (kèm búi trĩ)\nNiệu huyết: phân biệt theo tạng gây bệnh (tâm/can/thận/tỳ) và 2 dạng lâm bệnh (huyết lâm đau rát, thạch lâm có sỏi)\nBăng lậu: 6 chứng từ thực (thấp nhiệt/can hỏa) đến hư (tâm tỳ/thận âm/thận dương) đến ứ huyết — bệnh cơ liên quan can-tỳ-thận-xung nhâm",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 3 chủ đề: Khái Huyết, Ẩu Huyết+Nục Huyết, Tiện Huyết+Niệu Huyết+Băng Lậu.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
