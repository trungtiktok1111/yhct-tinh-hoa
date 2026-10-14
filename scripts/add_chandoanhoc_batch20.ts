import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 3: Biện Chứng, phần Lục Kinh Biện Chứng",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Bát cương - Biện chứng";

  await prisma.theoryTopic.create({
    data: {
      name: "Lục Kinh Biện Chứng - Khái niệm tổng quan và Thái Dương Bệnh Chứng",
      category: cat,
      summary: "Lục kinh biện chứng (Trương Trọng Cảnh, 'Thương hàn luận') dùng âm dương làm cương lĩnh chia bệnh ngoại cảm thành tam dương (thái dương/dương minh/thiếu dương — lục phủ, sức kháng mạnh) và tam âm (thái âm/thiếu âm/quyết âm — ngũ tạng, sức kháng yếu). Thái dương là hàng rào ngoài cùng, chủ cơ biểu, có 2 thể: trúng phong (biểu hư) và thương hàn (biểu thực).",
      content: `KHÁI NIỆM TỔNG QUAN: "Thương hàn luận" của Trương Trọng Cảnh (nhà Hán), trên cơ sở "Tố Vấn - Nhiệt luận", kết hợp quy luật truyền biến bệnh Thương hàn mà tổng kết thành một loại biện chứng bệnh ngoại cảm. Lục kinh biện chứng lấy các triệu chứng trong diễn biến bệnh ngoại cảm, dùng âm dương làm cương lĩnh chia thành tam âm và tam dương làm cơ sở luận trị. Tam dương: thái dương bệnh chứng, dương minh bệnh chứng, thiếu dương bệnh chứng (sức kháng bệnh mạnh, thế bệnh kháng thịnh). Tam âm: thái âm bệnh chứng, thiếu âm bệnh chứng, quyết âm bệnh chứng (sức kháng yếu, thế bệnh suy yếu). Lục kinh bệnh chứng phản ánh biến hóa bệnh lý tạng phủ kinh lạc: tam dương bệnh chứng lấy lục phủ bệnh biến làm cơ sở, tam âm bệnh chứng lấy bệnh biến ngũ tạng làm cơ sở — thực chất bao gồm cả bệnh biến tạng phủ và 12 kinh, nhưng trọng tâm là phân tích ngoại cảm phong hàn và quy luật truyền biến của nó, nên không thể đánh đồng với tạng phủ bệnh chứng của nội thương tạp bệnh.
Thông thường lục kinh truyền biến dương chứng đa số bắt đầu từ thái dương, sau truyền nhập dương minh, thiếu dương; nếu chính khí bất túc cũng có thể truyền tới tam âm kinh. Âm chứng đa số bắt đầu từ thái âm, sau truyền nhập thiếu âm, quyết âm; nhưng cũng có khi tà khí trực trúng tam âm. Bệnh tà truyền biến đa số từ biểu vào lý, từ thực sang hư (bệnh tiến); khi chính khí hồi phục, tà suy yếu, cũng có thể từ lý đạt biểu, từ hư chuyển thực (bệnh lui). Thể trạng suy nhược hoặc chữa không đúng: dù dương chứng cũng có thể truyền vào tam âm; chăm sóc tốt chữa đúng: dù âm chứng cũng có thể chuyển ra tam dương.

THÁI DƯƠNG KINH BỆNH CHỨNG: Thái dương là hàng rào (phiên li) của cơ thể, chủ cơ biểu — ngoại tà xâm tập đại đa số nhập từ thái dương trước, chính khí được huy động kháng tà, nên triệu chứng đầu tiên là thái dương bệnh. Chủ mạch chủ chứng: mạch phù, đầu gáy cứng đau mà ố hàn — bất luận cảm tà khí nào, bệnh trình ngắn, gặp mạch chứng này đều biện là thái dương bệnh. Cơ chế: ngoại tà xâm nhập phu biểu, chính khí kháng tà huy động ra ngoài nên mạch phù; túc thái dương kinh mạch đi từ đầu xuống chân ở phần lưng, bị tà mất nhu hòa nên đầu gáy cứng đau; ố hàn bao hàm ố phong, do ngoại tà xâm tập vệ dương bị uất.
Tùy thể trạng và tà khí, thái dương bệnh chia 2 thể:

**Thái dương trúng phong chứng** (dinh vệ thất điều — "trúng phong" đây là ngoại thương phong tà, khác đột quỵ): Sốt ố phong, đau đầu, mạch phù hoãn, tự hạn, có lúc nghẹt mũi và nôn khan. Cơ chế: vệ là dương bảo vệ bên ngoài, dinh là âm dinh dưỡng bên trong ("dương tại ngoại vi âm chi sứ, âm tại nội vi dương chi thủ"). Phong tà ngoại tập vệ phần, vệ dương phù thịnh ra ngoài nên sốt ("dương phù giả nhiệt tự phát"); vệ dương phù thịnh mất tác dụng cố ngoại khai hợp nên dinh âm không nội thủ mà mồ hôi tự ra ("âm nhược giả hạn tự xuất"); hạn xuất cơ tấu lỏng lẻo, âm dịch bất túc nên mạch phù hoãn; ố phong, nghẹt mũi, nôn khan do phong tà úng trệ ảnh hưởng phế vị. Vì biểu hiện hạn xuất cơ tấu lỏng lẻo nên còn gọi "Biểu hư chứng" (không tuyệt đối là hư chứng, so với thái dương thương hàn biểu thực).

**Thái dương thương hàn chứng** (hàn tà tập biểu, vệ dương bị thúc, âm dinh uất trệ): Sốt ố hàn, đầu gáy cứng đau, đau mình, không mồ hôi mà suyễn, mạch phù khẩn. Cơ chế: tà úng tại biểu nên ố hàn, vệ tà đấu tranh nên sốt (sơ khởi có người chưa sốt do vệ dương bị át tạm thời chưa giao tranh, nhưng tất sẽ sốt); vệ dương bị át, âm dinh cũng bị tà trệ, cân mạch thất dưỡng ôn húc nên đau mình đau khớp; tấu lý bế tắc nên không mồ hôi; chính khí muốn ra ngoài nhưng hàn tà trói biểu nên mạch phù khẩn; phế ngoài hợp bì mao, tà thúc ngoài ảnh hưởng phế nên hô hấp gấp suyễn thúc. Vì không mồ hôi nên gọi "Biểu thực chứng".`,
      keyPoints: "Lục kinh: Tam dương (thái dương-dương minh-thiếu dương, lục phủ, mạnh) và Tam âm (thái âm-thiếu âm-quyết âm, ngũ tạng, yếu)\nThái dương chủ mạch chứng: mạch phù + đầu gáy cứng đau + ố hàn\nThái dương trúng phong (biểu hư, có mồ hôi, mạch phù hoãn) khác thái dương thương hàn (biểu thực, không mồ hôi, mạch phù khẩn)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Lục Kinh Biện Chứng - Dương Minh Bệnh Chứng (Kinh chứng và Phủ chứng)",
      category: cat,
      summary: "Dương minh bệnh do thái dương bệnh chưa khỏi, tà kháng thịnh nhập lý, thuộc lý thực nhiệt chứng — 2 thể: kinh chứng (tứ đại chứng) và phủ chứng (táo kết nặng hơn).",
      content: `Dương minh bệnh do thái dương bệnh chưa khỏi, bệnh tà dần kháng thịnh nhập lý — giai đoạn dương khí kháng vượng, tà theo nhiệt hóa cực thịnh. Thuộc lý thực nhiệt chứng.

**Dương minh bệnh kinh chứng** (tà nhiệt lan tỏa toàn thân, tràn đầy kinh dương minh, trường đạo CHƯA có phân khô nội kết): Sốt rất cao, đại hạn xuất, khát nhiều uống nhiều — "tứ đại chứng": đại nhiệt, đại hạn, đại khát, mạch hồng đại; mặt đỏ, tâm phiền, rêu vàng khô, mạch hồng đại. Cơ chế: tà nhập dương minh táo nhiệt kháng thịnh tràn đầy kinh mạch nên sốt rất cao; dương minh chi mạch vinh ở mặt, nhiệt thượng đằng nên mặt đỏ; nhiệt bức tân dịch ngoại tiết nên đại hạn; hạn xuất mà tân dịch không tiếp tế nên đại khát uống nhiều; dương minh nhiệt thịnh chưng chước tâm thần nên tâm phiền; nhiệt thâm thương tân nên rêu vàng khô; nhiệt thịnh dương kháng, dương minh kinh khí huyết rất nhiều nên mạch hồng đại.

**Dương minh bệnh phủ chứng** (tà nhiệt truyền lý tương bác với cặn bã trong ruột hình thành táo kết — NẶNG HƠN kinh chứng, thường tiến triển từ kinh chứng): Nhật bô triều nhiệt (sốt vào giờ thân, khoảng 3-5 giờ chiều), tay chân đổ mồ hôi liên tục, đau trướng vùng bụng rốn, đại tiện táo bón, hoặc sôi bụng trung tiện, nặng thì chiêm ngữ cuồng loạn mất ngủ, rêu lưỡi dày vàng khô, rìa lưỡi đầu lưỡi mọc nhú gai thậm chí khô đét nứt, mạch trầm trì mà thực hoặc hoạt sác. Cơ chế: giống kinh chứng ở sốt mồ hôi nhiều (hoặc do dùng thuốc phát hạn làm tân dịch ngoại tiết nhiều) khiến tân dịch trong ruột khô táo, lý nhiệt càng nặng làm phân đóng kết thành phủ chứng; kinh khí dương minh vượng vào giờ nhật bô, tứ chi nhận khí từ dương minh, phủ trung thực nhiệt lan tỏa toàn kinh nên nhật bô triều nhiệt, tay chân hạn xuất không ngớt; nhiệt và cặn bã tràn ngập trường đạo kết lại không thông nên đau trướng bụng quanh rốn, táo bón; phân khô nội kết, khí đi xuống nên sôi bụng trung tiện; tà nhiệt tích thịnh thượng chưng hun chước tâm cung nên chiêm ngữ, cuồng loạn, mất ngủ; nhiệt nội kết cướp đoạt tân dịch nên rêu vàng khô mọc nhú gai hoặc khô đen nứt nẻ; táo nhiệt nội kết ở trường, mạch đạo úng trệ tà nhiệt thúc giục nên mạch trầm trì mà thực hoặc hoạt sác.`,
      keyPoints: "Dương minh kinh chứng: 'tứ đại chứng' (đại nhiệt, đại hạn, đại khát, mạch hồng đại) — trường đạo chưa táo kết\nDương minh phủ chứng: nhật bô triều nhiệt + táo bón + chiêm ngữ cuồng loạn + rêu vàng khô mọc gai — nặng hơn kinh chứng, có táo kết thực sự trong ruột",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Lục Kinh Biện Chứng - Thiếu Dương Bệnh Chứng và Thái Âm Bệnh Chứng",
      category: cat,
      summary: "Thiếu dương: bán biểu bán lý nhiệt chứng (giữa thái dương và dương minh). Thái âm: lý hư hàn thấp, biểu lý với dương minh (tà theo táo nhiệt hóa thành dương minh; tà theo hàn thấp hóa thành thái âm).",
      content: `THIẾU DƯƠNG KINH BỆNH CHỨNG: Về vị trí bệnh, thiếu dương đã xa thái dương biểu mà chưa vào tới dương minh lý — bệnh tại giữa biểu và lý, không hẳn biểu chứng cũng không hẳn lý chứng mà thuộc bán biểu bán lý nhiệt chứng. Biểu hiện: miệng đắng, họng khô, chóng mặt (mục huyền), hàn nhiệt vãng lai, ngực sườn tức mãn, không muốn ăn uống, tâm phiền buồn nôn, rêu trắng mỏng hoặc mỏng vàng, mạch huyền. "Thương hàn luận" dùng miệng đắng, họng khô, mục huyền làm tiêu chuẩn chẩn đoán thiếu dương bệnh. Cơ chế: tà nhiệt hun chưng, đởm nhiệt thượng đằng nên miệng đắng; tân bị nhiệt chước thương nên họng khô; mắt là ngoại hầu của can đởm, thiếu dương phong hỏa thượng đằng nên mắt huyền; tà nhập thiếu dương bán biểu bán lý, chính tà tương tranh — chính không thắng tà thì ố hàn, chính thắng tà thì sốt, nên hàn nhiệt vãng lai là đặc điểm của thiếu dương kinh; kinh mạch thiếu dương phân bố ở sườn, nhiệt uất thiếu dương nên ngực sườn tức đầy; đởm nhiệt mộc uất cán nhiễu vị phủ nên không muốn ăn; thiếu dương mộc uất, mộc hỏa thượng nghịch nên tâm phiền; đởm khí hằng nghịch, vị thổ bị vũ (khắc), vị giáng thất thường ngược lại khí nghịch lên gây buồn nôn; can đởm bệnh khí cơ uất trệ nên mạch huyền.

THÁI ÂM KINH BỆNH CHỨNG: Tính chất thuộc lý hư hàn thấp. Tỳ thuộc thái âm có quan hệ biểu lý với dương minh vị — vị dương vượng thịnh thì tà theo táo nhiệt mà hóa (thành dương minh); tỳ dương bất túc thì tà theo hàn thấp mà hóa (thành thái âm); do đó dương minh bệnh thuộc lý thực nhiệt, thái âm bệnh thuộc lý hư hàn. Tỳ vị cùng ở trung châu lại tương biểu lý nên 2 kinh thường chuyển hóa cho nhau: dương minh bệnh mà trung khí suy có thể chuyển thành thái âm bệnh; thái âm bệnh mà trung dương dần hồi phục cũng có thể chuyển thành dương minh. Lâm sàng: phàm tam dương bệnh mà trung khí hư đều dễ chuyển thành tỳ vị hư hàn chứng — gọi là "truyền kinh". Nếu bản thân vốn có lý dương hư, mới phát bệnh đã gặp hư hàn chứng — gọi là "trực trúng".
Biểu hiện: bụng đầy nôn ói, ăn không được, tiêu chảy (tự lợi), miệng không khát, có lúc tự nhiên đau bụng; hoặc rêu lưỡi trắng nê, mạch trầm hoãn mà nhược. Cơ chế: tỳ thổ hư hàn, khí cơ không thông nên bụng đầy tức; hàn tà trở trệ nên đau bụng từng cơn (khác đau bụng dương minh: thái âm đau lúc có lúc không, thích ấm xoa ấn; dương minh đau dữ dội cự án do phân khô nội kết); trung tiêu hư hàn nên ăn không vô hoặc tự lợi, tà theo hàn thấp hóa; chức năng khí hóa hạ tiêu chưa tổn thương, tân dịch vẫn lên trên được nên miệng không khát (khi nôn/tiêu chảy nặng có thể khô miệng nhưng khát không thích uống, hoặc chỉ thích nước ấm uống ít); hàn thấp tà tràn lan nên rêu trắng nê, mạch trầm hoãn mà nhược.`,
      keyPoints: "Thiếu dương chủ chứng: miệng đắng + họng khô + mục huyền + hàn nhiệt vãng lai + mạch huyền (bán biểu bán lý)\nThái âm-Dương minh biểu lý chuyển hóa: vị dương vượng → tà hóa táo nhiệt (dương minh); tỳ dương hư → tà hóa hàn thấp (thái âm)\nPhân biệt đau bụng thái âm (hư, lúc có lúc không, thích ấn) với dương minh (thực, dữ dội, cự án)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Lục Kinh Biện Chứng - Thiếu Âm Bệnh Chứng (Hàn hóa, Nhiệt hóa) và Quyết Âm Bệnh Chứng",
      category: cat,
      summary: "Thiếu âm (tâm thận, thủy hỏa chi tạng — căn bản con người) chia hàn hóa (dương hư hàn thịnh) và nhiệt hóa (âm hư dương kháng). Quyết âm là giai đoạn muộn, phức tạp nhất — đặc trưng thượng nhiệt hạ hàn.",
      content: `THIẾU ÂM KINH BỆNH CHỨNG: Thiếu âm bệnh là hư hàn chứng tính chất toàn thân. Thiếu âm kinh thuộc tâm thận, là thủy hỏa chi tạng, căn bản của con người. Khi chức năng tâm thận suy kiệt, sức kháng bệnh giảm, hình thành thiếu âm bệnh chứng. Thiếu âm bệnh vừa có thể tùng âm hóa hàn vừa có thể tùng dương hóa nhiệt — chia 2 loại:

**Thiếu âm bệnh hàn hóa chứng** (thường gặp — dương khí bất túc, bệnh tà nhập nội tùng âm hàn hóa, hư hàn toàn thân, khác trường vị hư hàn của thái âm): Không sốt chỉ ố hàn, mạch vi tế, chỉ muốn ngủ, tứ chi lạnh, hạ lợi thanh cốc (tiêu phân sống), nôn ói, không ăn được hoặc ăn vào nôn ra liền; hoặc mạch vi muốn tuyệt mà ngược lại không ố hàn, mặt đỏ tía (hiện tượng "đái dương" — giả nhiệt). Cơ chế: thiếu âm dương khí suy kiệt, âm hàn độc thịnh nên không sốt chỉ ố hàn ("Vô nhiệt ố hàn giả, phát vu âm dã" = "Dương hư tắc ngoại hàn"); dương khí suy vi không cổ động huyết dịch nên mạch vi tế; "Dương khí giả, tinh tắc dưỡng thần" — dương khí suy vi thần khí thất dưỡng nên chỉ muốn ngủ, tinh thần mơ hồ suy kiệt; dương hư hàn thịnh, ngoài không ôn húc tứ chi nên quyết lãnh, trong không ôn vận tỳ vị nên hạ lợi thanh cốc, nôn không muốn ăn. Phân biệt quan trọng: hạ lợi thanh cốc của thiếu âm TẤT kèm miệng khát (vì hạ tiêu dương khí suy vi không hóa khí thăng tân, đồng thời hạ lợi nhiều làm tân dịch ngoại tiết theo) — khác hạ lợi của thái âm KHÔNG khát (hạ tiêu dương khí chưa ảnh hưởng, hạ lợi không nặng bằng). Nếu âm hàn cực thịnh dưới đẩy tàn dương cách cự lên trên → "đái dương" giả nhiệt chứng (mặt đỏ tía mà thực chất là hàn cực).

**Thiếu âm bệnh nhiệt hóa chứng** (âm hư dương kháng, tùng dương hóa nhiệt — ngược với hàn hóa là dương vi âm thịnh): Tâm phiền bứt rứt không nằm nghỉ được, miệng khô họng táo, đầu lưỡi đỏ thẫm, mạch tế sác. Cơ chế: tà nhập thiếu âm (thủy hỏa chi tạng) tùng dương hóa nhiệt — âm dịch bị chước thiêu không lên trên được nên họng khô; thủy khuy không thượng tế tâm nên tâm hỏa độc kháng, dương kháng không nhập âm, âm hư không được dương nạp nên tâm phiền mất ngủ; tâm hỏa thượng viêm âm dịch hao thương nên miệng khô táo, đầu lưỡi đỏ thẫm, mạch tế sác.

QUYẾT ÂM KINH BỆNH CHỨNG: Giai đoạn tương đối muộn của quá trình bệnh biến — chính khí và bệnh tà cùng tranh đấu bên trong nên biểu hiện cực kỳ phức tạp, thác tạp. Túc quyết âm kinh thuộc can mà hiệp vị nên bệnh biến đa số là chứng hầu của can đởm và vị. Đặc điểm lâm sàng: âm dương đối mặt nhau, hàn nhiệt giao thác (thượng nhiệt hạ hàn, quyết nhiệt thắng bại). Biểu hiện: tiêu khát, khí thượng xung tâm, tâm trung nóng đau, đói mà không muốn ăn, ăn lập tức nôn ra. Cơ chế: chủ chứng là thượng nhiệt hạ hàn — quyết âm là tận cùng của âm (âm chi tận), đặc điểm dương cứ đi lên nên thượng nhiệt, âm cứ đi xuống nên hạ hàn. Ba chứng đầu (tiêu khát, khí thượng xung tâm, tâm trung nóng đau) do thượng tiêu tân thương nhiệt nhiễu; chứng sau (đói không ăn, ăn nôn ra — có thể nôn ra giun) do hạ bộ trường đạo hư hàn và giun đũa không thích ứng môi trường biến đổi, không có đồ ăn nên ăn vào là ói ra giun.`,
      keyPoints: "Thiếu âm hàn hóa (dương hư, không sốt chỉ ố hàn, hạ lợi thanh cốc KÈM khát) vs nhiệt hóa (âm hư, tâm phiền mất ngủ, mạch tế sác)\nPhân biệt mấu chốt: hạ lợi thanh cốc thiếu âm có khát; hạ lợi thái âm không khát (do mức độ tổn thương hạ tiêu khác nhau)\nQuyết âm đặc trưng thượng nhiệt hạ hàn — giai đoạn phức tạp nhất, âm dương giao tranh",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Lục Kinh Biện Chứng - Hợp Bệnh, Tịnh Bệnh, Truyền Kinh, Trực Trúng",
      category: cat,
      summary: "4 hình thức diễn biến phức tạp của lục kinh bệnh: hợp bệnh (2-3 kinh đồng thời), tịnh bệnh (kinh này chưa hết đã thêm kinh khác), truyền kinh (3 quy luật: tuần kinh/việt kinh/biểu lý truyền), trực trúng (tà vào thẳng tam âm).",
      content: `HỢP BỆNH: Hai kinh hoặc ba kinh cùng đồng thời phát bệnh. Ví dụ: thái dương bệnh (thương hàn hoặc trúng phong chứng) và dương minh bệnh cùng xuất hiện gọi là "Thái dương dương minh hợp bệnh"; ba kinh dương đồng bệnh gọi là "Tam dương hợp bệnh".

TỊNH BỆNH: Một kinh bệnh chữa chưa triệt để hoặc triệu chứng chưa dứt mà lại xuất hiện triệu chứng của kinh khác (khác hợp bệnh ở chỗ không đồng thời từ đầu). Ví dụ: thái dương bệnh phát hạn không triệt để, bệnh chuyển thuộc dương minh gọi là "thái dương dương minh tịnh bệnh"; thiếu dương bệnh phát triển thêm tới dương minh, hoặc thiếu dương triệu chứng chưa hết mà xuất hiện dương minh chứng gọi là "thiếu dương dương minh tịnh bệnh". Đau đầu cứng gáy, chóng mặt, có lúc như kết hung, tâm hạ bĩ ngạnh là "thái dương thiếu dương tịnh bệnh" — thực chất là một hình thức truyền biến.

TRUYỀN KINH: Bệnh tà từ ngoài xâm nhập có xu hướng truyền dần vào trong, chứng hầu kinh này truyền biến sang chứng hầu kinh khác. Có truyền kinh hay không phụ thuộc 3 mặt: cảm thụ tà nặng nhẹ, thể trạng mạnh yếu, chữa đúng hay sai. Tà thịnh chính nhược → truyền biến; chính thịnh tà thoái → chuyển biến tốt. Cơ thể mạnh khỏe: tà truyền biến chủ yếu ở 3 kinh dương; cơ thể yếu: dễ nhập tam âm kinh. Ngộ hạn/ngộ hạ cũng có thể truyền nhập dương minh, hoặc không qua dương minh/thiếu dương mà truyền thẳng vào tam âm. Tam âm bệnh không nhất thiết do dương kinh truyền tới — có lúc ngoại tà trực trúng tam âm (xem mục Trực trúng).
3 quy luật truyền kinh:
1. **Tuần kinh truyền**: theo thứ tự lục kinh. Ví dụ thái dương chưa khỏi truyền thiếu dương, thiếu dương chưa hết truyền dương minh, tam dương chưa hết truyền tam âm (thái âm → thiếu âm → quyết âm). Thứ tự: Thái dương → Thiếu dương → Dương minh → Thái âm → Thiếu âm → Quyết âm.
2. **Việt (vượt) kinh truyền**: không theo thứ tự mà cách 1-2 kinh. Ví dụ thái dương chưa khỏi không truyền thiếu dương mà truyền thẳng dương minh, hoặc không qua thiếu dương/dương minh mà truyền thẳng thái âm. Nguyên nhân đa số do bệnh tà vượng thịnh, chính khí bất túc.
3. **Biểu lý truyền**: những kinh có quan hệ tương biểu lý truyền cho nhau. Ví dụ thái dương truyền nhập thiếu âm, dương minh truyền nhập thái âm, thiếu dương truyền nhập quyết âm. Biểu lý tương truyền là tà thịnh chính suy, bệnh từ thực chuyển sang hư, bệnh nặng lên.

TRỰC TRÚNG: Bệnh tà sơ khởi không từ dương kinh truyền nhập mà nhập trực tiếp tam âm kinh. Các hình thức trên (hợp bệnh, tịnh bệnh, truyền kinh, trực trúng) đều thuộc "ngoại truyền nội, từ dương chuyển âm". Ngoài ra còn "lý tà xuất biểu" — từ âm chuyển sang dương, âm bệnh chuyển dương chứng, nói lên chính khí dần hồi phục, bệnh diễn tiến tốt.`,
      keyPoints: "4 hình thức diễn biến: Hợp bệnh (đồng thời từ đầu), Tịnh bệnh (nối tiếp, kinh trước chưa hết), Truyền kinh (3 quy luật: tuần kinh/việt kinh/biểu lý), Trực trúng (vào thẳng tam âm không qua tam dương)\nLý tà xuất biểu (âm chuyển dương) là dấu hiệu bệnh tốt lên — ngược hướng với truyền kinh/trực trúng (dương chuyển âm, bệnh nặng lên)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vệ Khí Dinh Huyết Biện Chứng - Vệ Phần và Khí Phần Chứng Hầu",
      category: cat,
      summary: "Phương pháp của Diệp Thiên Sỹ (nhà Thanh) biện chứng ôn nhiệt bệnh, bổ sung lục kinh biện chứng — 4 giai đoạn từ nông vào sâu: vệ → khí → dinh → huyết. Vệ phần (biểu, phế/bì mao), Khí phần (lý, đa dạng theo tạng phủ).",
      content: `KHÁI NIỆM: Vệ khí dinh huyết biện chứng do Diệp Thiên Sỹ (nhà Thanh) vận dụng biện chứng ngoại cảm ôn nhiệt bệnh, phát triển trên cơ sở Thương hàn lục kinh biện chứng, bổ sung thiếu sót của lục kinh biện chứng. 4 loại chứng hầu khác nhau, đồng thời biểu thị quá trình phát triển ôn nhiệt bệnh tà qua 4 giai đoạn từ nông vào sâu, từ nhẹ đến nặng: vệ phần (ngoài cùng) → khí phần → dinh phần → huyết phần (sâu nhất). Diệp Thiên Sỹ ("Ngoại cảm ôn nhiệt bệnh"): "Ôn tà phạm ở trên, đầu tiên sẽ phạm phế nghịch truyền vào tâm bào, phế chủ khí thuộc vệ, tâm chủ huyết thuộc dinh" — sau vệ là khí, sau khí là dinh, sau dinh là huyết, bệnh tà từng bước xâm nhập. Vệ phần chứng thuộc biểu bệnh (tại phế và bì mao); khí phần chứng chủ lý bệnh (tại hung cách, phế, vị, trường, đởm); dinh phần chứng là tà nhập tâm cung (bệnh tại tâm và bào lạc); huyết phần chứng là nhiệt nhập sâu can thận (chủ yếu động huyết và hao huyết).

VỆ PHẦN CHỨNG HẦU (giai đoạn đầu ngoại cảm ôn nhiệt bệnh — ôn nhiệt tà xâm phạm cơ biểu, vệ khí thất thường; phế hợp bì mao chủ biểu lại ở vị trí cao nhất nên tà tổn thương đầu tiên, vệ phần chứng thường kèm bệnh biến phế kinh): Sốt hơi ố phong hàn, đầu lưỡi và hai bên rìa đỏ, mạch phù sác, thường kèm đau đầu, miệng khô hơi khát nước, ho, sưng đau hầu họng. Cơ chế: ôn nhiệt bệnh tà phạm cơ biểu, vệ bị tà uất nên sốt hơi ố phong hàn; ôn là dương tà nên sốt nặng ố hàn nhẹ (khác thái dương thương hàn: ố hàn nặng sốt nhẹ); ôn nhiệt tại biểu nên lưỡi đỏ hai bên rìa và đầu lưỡi, mạch phù sác; dương tà thương tổn dương lạc, thanh không bị nhiễu nên đau đầu; tà uất cơ biểu, phế thất tuyên giáng nên ho; nhiệt thương tân dịch nên khởi phát miệng khô hơi khát; họng hầu là cửa ngõ của phế, ôn nhiệt thượng chước nên hầu họng sưng đau.

KHÍ PHẦN CHỨNG HẦU (ôn nhiệt bệnh tà nội nhập tạng phủ, chính thực tà thịnh cự nhau kịch liệt, dương nhiệt kháng thịnh — là lý chứng; tà nhập khí phần phạm nhiều tạng phủ khác nhau nên chứng hầu đa dạng): Sốt không ố hàn mà ố nhiệt, lưỡi đỏ rêu vàng, mạch sác, thường kèm tâm phiền miệng khát, tiểu đỏ. 4 thể thường gặp theo vị trí: (1) **Nhiệt úng tại phế** — kèm ho, đau ngực, khạc đàm vàng đặc. (2) **Nhiệt nhiễu hung cách** — kèm tâm phiền, ngồi nằm không yên. (3) **Nhiệt tại phế vị** — kèm tự hạn, suyễn cấp, bực bội, khát nước nhiều, mạch sác mà rêu vàng khô táo. (4) **Nhiệt bức đại trường** — kèm tức ngực, phiền khát, tiêu chảy, chiêm ngữ. Cơ chế chung: tà nhập khí phần, chính tà kịch đấu, dương nhiệt kháng thịnh nên sốt không ố hàn mà ố nhiệt, tiểu đỏ, lưỡi đỏ rêu vàng mạch sác; nhiệt thịnh thương tân nên khát; nhiệt nhiễu tâm thần nên tâm phiền. Theo thể: nhiệt úng phế → phế thất thanh túc khí cơ bất lợi → ho đau ngực, phế nhiệt luyện dịch thành đàm đặc vàng; nhiệt nhiễu hung cách → uất mà không đạt → phiền muộn đứng ngồi không yên; nhiệt tại phế vị → phế nhiệt uất chưng → tự hạn suyễn cấp, tân dịch trong vị bị đốt chước → phiền muộn khát nhiều mạch sác rêu vàng khô; nhiệt bức đại trường → phế vị chi nhiệt bức đại trường, trường nhiệt tích thịnh nhiệt kết bàng lưu → tức ngực phiền khát tiêu chảy chiêm ngữ.`,
      keyPoints: "4 giai đoạn vệ-khí-dinh-huyết từ nông vào sâu, từ nhẹ đến nặng — phát triển bổ sung cho lục kinh biện chứng (dùng cho Ôn bệnh thay vì Thương hàn)\nVệ phần: sốt + ố phong hàn NHẸ + đầu lưỡi đỏ rìa + mạch phù sác (biểu, phế)\nKhí phần: sốt không ố hàn mà ố nhiệt + lưỡi đỏ rêu vàng + mạch sác (lý) — 4 thể theo vị trí: phế/hung cách/phế vị/đại trường",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Vệ Khí Dinh Huyết Biện Chứng - Dinh Phần, Huyết Phần Chứng Hầu và Quy Luật Truyền Biến",
      category: cat,
      summary: "Dinh phần (tà nội hãm sâu, dinh âm hao tổn, tâm thần nhiễu loạn) và Huyết phần (giai đoạn cuối, nặng nhất — thực nhiệt và hư nhiệt) là 2 giai đoạn sâu nhất; quy luật truyền biến thường theo thứ tự nhưng có thể thác tạp/nhảy cóc.",
      content: `DINH PHẦN CHỨNG HẦU (ôn nhiệt bệnh tà nội hãm sâu bên trong và nặng; dinh khí hành trong mạch thông với tâm nên đặc điểm là dinh âm hao tổn nhiều, tâm thần nhiễu loạn; dinh là ranh giới giữa khí phần và huyết phần — tà chuyển từ dinh ra khí là bệnh đỡ, dinh nhập huyết là bệnh gia tăng): Sốt về đêm, miệng không khát lắm, tâm phiền mất ngủ, nặng thì thần hôn chiêm ngữ, ban chẩn ẩn hiện, lưỡi đỏ thẫm, mạch tế sác. Cơ chế: tà nhiệt nhập dinh phần chước thương dinh âm, dinh âm tổn thương thì chân dương bị cướp nên sốt cao về đêm càng cao, miệng khô mà không khát lắm, mạch tế sác; dinh phần hữu nhiệt chưng đằng nên lưỡi đỏ thẫm; nhiệt xuyên huyết lạc thì ban chẩn ẩn hiện; dinh khí thông tâm, tâm thần bị nhiễu nên tâm phiền mất ngủ, thần hôn chiêm ngữ. Cần phân biệt với hôn chiêm của dương minh phủ thực (nhiệt thịnh): đa số kèm táo bón, đau cứng bụng, lưỡi đóng bợn dày — dựa vào đó dễ phân biệt.

HUYẾT PHẦN CHỨNG HẦU (giai đoạn cuối, sâu nặng nhất của vệ khí dinh huyết; tâm chủ huyết, can tàng huyết nên tà nhập huyết phần ảnh hưởng tâm can; tà nhiệt ngưng trệ lâu hao thương chân âm ảnh hưởng thận — huyết phần chứng chủ yếu bệnh biến tại tâm can thận; ngoài triệu chứng dinh phần nặng hơn còn có hao huyết, âm thương, động phong): chia 2 thể:

**Huyết phần thực nhiệt** (đa số do dinh phần bệnh chưa giải truyền nhập huyết phần, hoặc khí phần tà nhiệt trực tiếp nhập huyết phần; bệnh biến thiên về tâm can): Trên nền dinh phần chứng còn có phiền nhiệt nóng nảy, hôn cuồng mê sảng, ban chẩn thấu lộ sắc tím hoặc đen, thổ huyết tiện huyết niệu huyết, lưỡi đỏ thẫm hoặc tím, mạch tế sác; hoặc kèm co giật, giác cung phản trương, răng cắn chặt, mạch huyền sác. Cơ chế: huyết nhiệt nhiễu tâm nên nóng nảy phát cuồng; huyết phần nhiệt cực bức huyết vọng hành nên xuất huyết đa dạng; nhiệt tích cực thịnh nên hôn chiêm và phát ban tím đen; nhiệt tích trong huyết nên lưỡi đỏ thẫm/tím; thực nhiệt thương âm hao huyết nên mạch tế sác; can tàng huyết chủ phong, huyết nhiệt chước can kinh gây can phong nội động nên co giật, cổ gáy cứng, giác cung phản trương, mắt trợn ngược, răng cắn chặt.

**Huyết phần hư nhiệt** (đa số do huyết phần thực nhiệt diễn biến, cũng có thể từ dinh phần chứng kéo dài chuyển biến; bệnh biến thiên về can thận, cần tham khảo hạ tiêu bệnh chứng trong tam tiêu để phân biệt): Sốt thấp kéo dài, tối nóng sáng mát, ngũ tâm phiền nhiệt, sốt lui không mồ hôi, miệng họng khô táo, lừ đừ mệt mỏi, ù tai, tay chân khô gầy, lưỡi ít tân dịch, mạch hư tế, hoặc tay chân co giật/co quắp. Cơ chế: tà nhiệt lưu lại lâu tại huyết phần cướp chước âm can thận, âm hư dương nhiệt nội nhiễu nên sốt thấp kiểu tối nóng sáng mát, ngũ tâm phiền nhiệt; âm tinh hao kiệt không thượng vinh thanh khiếu nên miệng họng khô táo, lưỡi ít tân, ù tai; âm tinh khuy tổn thần thất dưỡng nên lừ đừ mệt mỏi; âm tinh huyết dịch thiếu, tay chân thất dưỡng nên khô gầy; tinh huyết bất túc nên mạch hư tế; huyết không dưỡng cân nên hư phong nội động tay chân co quắp.

QUY LUẬT TRUYỀN BIẾN: Thường từ vệ phần → khí phần → dinh phần → huyết phần. Nhưng có các biến thể: (1) giai đoạn đầu không nhất định xuất hiện vệ phần mà lập tức khí phần, hoặc vệ phần rất ngắn rồi chuyển ngay; (2) chứng hầu các giai đoạn có thể thác tạp đan xen — ví dụ tà đã nhập dinh mà khí phần vẫn còn nhiệt nhiều (thần hôn chiêm ngữ, lưỡi đỏ thẫm, khát nhưng rêu lưỡi vẫn vàng trắng — nhiệt tà chưa hoàn toàn nhập dinh); tà nhiệt sau khi nhập huyết phần đa số vẫn kiêm triệu chứng dinh phần; (3) "vệ nhiệt hãm nhập dinh phần" — bắt đầu vệ phần, KHÔNG qua khí phần (không khát không phiền thao) mà trực tiếp hôn mê nói nhảm lưỡi đỏ thẫm (dinh phần) — bệnh biến hóa nhanh nghiêm trọng; (4) ôn bệnh nội nhiệt từ lý đạt biểu — không từ vệ phần mà khởi bệnh ngay ở khí phần hoặc dinh huyết; nếu ngoại cảm dẫn động nội nhiệt kết hợp, lý nhiệt càng rõ mà không có triệu chứng vệ phần (không mồ hôi, ố hàn).`,
      keyPoints: "Dinh phần: sốt về đêm + tâm phiền mất ngủ + ban chẩn ẩn hiện + lưỡi đỏ thẫm (phân biệt hôn chiêm dinh phần với hôn chiêm dương minh phủ thực qua táo bón/lưỡi đóng bợn)\nHuyết phần: thực nhiệt (xuất huyết + cuồng + can phong động) nặng hơn, hư nhiệt (sốt thấp kéo dài + âm hư cạn kiệt) là giai đoạn sau/kéo dài\nTruyền biến không cố định: có thể bỏ qua giai đoạn, thác tạp đan xen, hoặc khởi bệnh thẳng ở khí/dinh/huyết",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Tam Tiêu Biện Chứng - Thượng, Trung, Hạ Tiêu Bệnh Chứng và Quy Luật Truyền Biến",
      category: cat,
      summary: "Phương pháp của Ngô Cúc Thông ('Ôn bệnh điều biện', nhà Thanh) biện chứng ôn bệnh theo 3 giai đoạn sơ-trung-mạt dựa trên tạng phủ thuộc tam tiêu. Thượng tiêu (phế+tâm bào), Trung tiêu (vị+tỳ), Hạ tiêu (thận+can).",
      content: `KHÁI NIỆM: Ngô Cúc Thông (nhà Thanh, "Ôn bệnh điều biện") dùng lý luận thượng-trung-hạ tiêu luận thuật ôn bệnh chứng trị, dựa trên "Nội kinh" về vị trí tam tiêu và tạng phủ sở thuộc, kết hợp Thương hàn luận và Vệ khí dinh huyết của Diệp Thiên Sỹ, tổng kết quy luật truyền biến trong Ôn bệnh. Thượng tiêu gồm triệu chứng thủ thái âm phế kinh và thủ quyết âm tâm bào kinh; trung tiêu gồm túc dương minh vị kinh và túc thái âm tỳ kinh; hạ tiêu gồm túc thiếu âm thận kinh và túc quyết âm can kinh.

THƯỢNG TIÊU BỆNH CHỨNG (ôn bệnh tà nhập qua mũi miệng, từ trên xuống dưới; mũi thông phế thuộc thủ thái âm nên bắt đầu bệnh ngay xuất hiện triệu chứng phế vệ thụ tà; 2 khuynh hướng truyền biến: thuận truyền — thượng tiêu xuống trung tiêu dương minh vị; nghịch truyền — phế vệ truyền thủ quyết âm tâm bào): Hơi ố phong hàn, sốt tự hạn, miệng khát hoặc không khát mà ho, sốt cao về chiều, mạch phù sác hoặc hai bộ thốn đập to rõ. Nếu tà nhập tâm bào (nghịch truyền): nói khó, tê lạnh tay chân, thần hôn chiêm ngữ. Cơ chế: tà phạm thượng tiêu, phế hợp bì mao chủ biểu nên ố phong hàn; phế bệnh không hóa khí được, khí uất nên sốt; ho do phế khí uất; sốt tăng chiều do âm bị hỏa khắc chế, trọc âm nhân lúc hỏa vượng phát tác; ôn nhiệt tại biểu nên mạch phù sác; tà tại thượng tiêu nên 2 bộ thốn to. Nghịch truyền tâm bào: lưỡi là tâm khiếu nên nói khó; tâm dương nội uất nên chi lạnh (cần phân biệt với âm hàn gây lạnh: lạnh từ bàn ngón qua khuỷu gối lên trên — khác cách); nhiệt bức tổn thương tâm nên thần hôn chiêm ngữ.

TRUNG TIÊU BỆNH CHỨNG (ôn bệnh thuận truyền từ thượng tiêu tới trung tiêu, xuất hiện triệu chứng tỳ vị; vị tính ưa nhuận ghét táo — tà nhập tùng táo hóa thành dương minh táo nhiệt; tỳ tính thích táo ghét thấp — tà nhập tùng thấp hóa thành thái âm thấp nhiệt):
**Dương minh táo nhiệt**: mắt mặt đều đỏ, hơi thở thô, táo bón, bụng đầy, miệng họng khô táo, môi nứt lưỡi khô, rêu vàng hoặc cháy đen, mạch trầm sáp. Cơ chế: dương nhiệt thượng viêm → mặt mắt đỏ; tà nhiệt úng thịnh → thở thô; nhiệt bức tân thương, vị thất nhu nhuận → bụng đầy táo bón, miệng họng khô táo, môi nứt lưỡi khô, rêu vàng/cháy đen; tân dịch khuy nhiệt kết, khí cơ không thông → mạch trầm sáp.
**Thái âm thấp nhiệt**: sắc mặt vàng nhạt, đầu căng thân thể nặng nề, tức ngực không đói, sốt (thân nhiệt bất dương), tiểu không thông, đại tiện không thông suốt hoặc tiêu chảy, rêu vàng nê, mạch tế mà nhu sác. Cơ chế: nhiệt thấp chưng uất trên → mặt vàng nhạt, đầu căng thân nặng; thấp nhiệt khốn uất khí cơ, thăng giáng thất thường → ngực tức không đói; nhiệt chưng thấp uất cơ biểu → thân nhiệt bất dương; thấp nhiệt trở trệ trung tiêu, tỳ vận bất kiện → tiểu không thông, đại tiện không sảng hoặc tiêu chảy; rêu vàng nê mạch tế nhu sác là thấp uất nhiệt át.

HẠ TIÊU BỆNH CHỨNG (ôn bệnh tà lưu lâu trung tiêu dương minh táo nhiệt thiêu đốt, hạ tiêu âm dịch hao tổn, "ất quý đồng nguyên" can thận bị chước nên đa số can thận âm hư; cũng có thể do thấp lâu ngày tỳ dương tiêu hao ảnh hưởng thận dương): Sốt mặt đỏ, thủ túc tâm nhiệt (nóng cả lòng và mu tay chân), miệng khô lưỡi táo, uể oải ù tai, mạch hư đại; hoặc tay chân run hoặc co quắp, mệt mỏi mạch hư lưỡi đỏ sẫm ít rêu, nặng thì có thể muốn thoát bất cứ lúc nào. Cơ chế: giai đoạn sau ôn bệnh, tà xuống hạ tiêu dễ tổn âm dịch thận; thận tinh khuy tổn, hư nhiệt nội nhiễu → sốt mặt đỏ; âm hư nội nhiệt → lòng và mu tay chân nóng, miệng lưỡi khô táo; can chủ cân phải dựa hàm dưỡng thận thủy — nhiệt tà lưu lâu chân âm bị chước, thủy khuy mộc vượng, cân thất dưỡng → co quắp run tay chân hoặc co giật; tinh thần uể oải, mạch hư, lưỡi đỏ sẫm ít rêu hoặc muốn thoát → âm tinh khuy kiệt.

QUY LUẬT TRUYỀN BIẾN TAM TIÊU: 3 giai đoạn khác nhau — thượng tiêu đa số giai đoạn đầu, trung tiêu giai đoạn giữa, hạ tiêu giai đoạn cuối. Truyền biến thường: thượng tiêu (thủ thái âm phế) → trung tiêu → hạ tiêu (thuận truyền). Nếu tà nặng, sức đề kháng giảm: phế vệ → thủ quyết âm tâm bào (nghịch truyền). Quyết định bởi tính chất tà và sức đề kháng: thể trạng thiên âm hư nhưng đề kháng mạnh, cảm ôn nhiệt/ôn độc/phong ôn/ôn dịch/đông ôn — thuận truyền trung tiêu đa số tùng táo hóa (dương minh táo hóa chứng), truyền hạ tiêu thành can thận âm hư. Thể trạng thiên dương hư, đề kháng yếu, cảm hàn thấp — thuận truyền trung tiêu đa số tùng thấp hóa (thái âm thấp hóa chứng), truyền hạ tiêu thành thấp lâu thương dương. Thử tà kèm thấp nhiệt — trung tiêu có thể tùng táo hoặc tùng thấp hóa, hạ tiêu có thể thương âm hoặc thương dương tùy loại tà. Không cố định bất biến: có thể không truyền biến (chữa tốt), có thể vượt tầng truyền thẳng can thận (như việt kinh truyền trong lục kinh), có thể sơ khởi đã là trung tiêu thái âm hoặc quyết âm (như trực trúng), hoặc lưỡng tiêu/tam tiêu đồng bệnh (như hợp bệnh/tịnh bệnh trong lục kinh).`,
      keyPoints: "Tam tiêu: Thượng (phế+tâm bào, giai đoạn đầu), Trung (vị+tỳ, giữa — chia dương minh táo nhiệt/thái âm thấp nhiệt), Hạ (thận+can, cuối — âm hư)\nQuy luật truyền biến tam tiêu tương tự lục kinh: có thuận truyền/nghịch truyền, có thể vượt tầng hoặc trực trúng, không cố định",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 8 chủ đề: hoàn tất Lục Kinh Biện Chứng + Vệ Khí Dinh Huyết Biện Chứng + Tam Tiêu Biện Chứng. Chương 3 BIỆN CHỨNG đã hoàn tất toàn bộ.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
