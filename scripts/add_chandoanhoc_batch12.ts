import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 3: Biện Chứng, phần Bệnh Nhân Biện Chứng",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Bát cương - Biện chứng";

  await prisma.theoryTopic.create({
    data: {
      name: "Biện Chứng - Tổng quan và Bệnh Nhân Biện Chứng: Lục Dâm (Phong, Hàn, Thử, Thấp, Táo, Hỏa)",
      category: cat,
      summary: "Biện chứng là bước thâm hóa sau bát cương (tứ chẩn → bát cương → biện chứng); có nhiều phương pháp biện chứng; Bệnh nhân biện chứng truy nguyên nhân qua chứng hầu của lục dâm.",
      content: `TỔNG QUAN VỀ BIỆN CHỨNG: Biện chứng là dùng tư duy biện chứng trên dữ liệu tứ chẩn, dưới chỉ đạo lý luận chỉnh thể/con người-tự nhiên tương ứng/biến động, sau bát cương phân tích sơ bộ, tiếp tục phân tích tổng hợp để nắm bản chất bệnh, tìm tên chứng hầu và tên bệnh. Quá trình: tứ chẩn → bát cương → biện chứng (từng bước thâm hóa). "Chứng" (chứng hầu/hội chứng, kết quả sau biện chứng) khác "triệu chứng" (từng chứng trạng); "Bệnh" là tên gọi chung chứa nhiều "chứng" (Từ Linh Đài: "Bệnh vi tổng giả, nhất bệnh tổng hữu số chứng"). Chẩn đoán: biện chứng trước → biện bệnh → biện chứng thêm lần nữa — trọng điểm vẫn là biện chứng, nên gọi "biện chứng luận trị" chứ không "biện bệnh luận trị".
Các phương pháp biện chứng: Bệnh nhân (nguyên nhân) biện chứng — cơ sở cho ngoại cảm bệnh; Kinh lạc biện chứng; Khí huyết tân dịch biện chứng; Tạng phủ biện chứng (trọng điểm trong tạp bệnh biện chứng); Lục kinh biện chứng (biện "Thương hàn"); Vệ khí dinh huyết biện chứng (biện "Ôn bệnh"); Tam tiêu biện chứng.

BỆNH NHÂN BIỆN CHỨNG: nguyên nhân bệnh gồm lục dâm, thất tình, ẩm thực lao dật, ngoại thương. Mọi chứng hầu đều có nguyên nhân — biện chứng bệnh nhân là phân tích bệnh thái phản ứng để truy nguyên nhân, làm chứng cứ điều trị.

LỤC DÂM, DỊCH LỆ BIỆN CHỨNG (nguyên nhân ngoại cảm): lục dâm = phong, hàn, thử, thấp, táo, hỏa; dịch lệ = nhân tố truyền nhiễm cực mạnh.

- PHONG DÂM: phong vi bách bệnh chi trưởng, tính nhẹ nhàng thiện hành sác biến (di chuyển, biến hóa khôn lường), phát bệnh nhanh hết nhanh. Biểu hiện: sốt, ố phong, đau đầu, ra mồ hôi, ho, nghẹt mũi chảy nước mũi, rêu trắng mỏng, mạch phù hoãn; hoặc chi thể tê dại/co cứng/co giật/giác cung phản trương; hoặc ngứa da. Cơ chế: phong tập biểu tổn vệ khí → sốt ố phong ra mồ hôi; phong thượng thụ xâm phế → ho nghẹt mũi; phong tập kinh lạc → co cứng giật; phong uất bì phu → ngứa.

- HÀN DÂM: hàn vi âm tà, tính lạnh ngưng trệ, tổn dương khí, trở trệ vận hành khí huyết. Biểu hiện: ố hàn, sốt, không mồ hôi, đau đầu mình, suyễn ho, rêu trắng mỏng, mạch phù khẩn; hoặc tay chân co quắp, tứ chi quyết lãnh mạch vi muốn tuyệt; hoặc đau bụng sôi ruột tiêu chảy nôn ói. Cơ chế: hàn thúc biểu, huyền phủ không thông, vệ khí không tuyên → sốt ố hàn không mồ hôi; hàn trúng lý tổn dương khí tỳ vị → đau bụng tiêu chảy.

- THỬ DÂM: tính viêm nhiệt thăng tán, dễ tổn hao khí và tân dịch, thường kết hợp thấp tà. Thương thử: ố nhiệt, đổ mồ hôi, khát, mệt mỏi, tiểu vàng, lưỡi đỏ rêu trắng/vàng, mạch hư sác. Trúng thử (nặng hơn): sốt, đột ngột hôn đảo, hạn xuất dầm dề, thở gấp, có thể hôn mê kinh quyết, lưỡi đỏ thẫm khô, mạch nhu sác.

- THẤP DÂM: tính nặng nề dơ trọc niêm trệ, bệnh dai dẳng kéo dài. Thương thấp: đầu căng đau, tức ngực không muốn uống, thân nặng đau, sốt, uể oải, tiểu trong dài, rêu trắng hoạt, mạch nhu/hoãn. Mạo thấp: đầu nặng căng như bó, khó chịu toàn thân, tứ chi uể oải, mạch nhu nhược. Thấp tổn khớp: đau mỏi nặng, khó co duỗi ("Trước tý").

- TÁO DÂM: tính can dễ thương tân dịch, chia lương táo và ôn táo. Lương táo (cuối thu, lạnh khô): đầu hơi đau, ố hàn không mồ hôi, ho ngứa họng nghẹt mũi, lưỡi trắng khô, mạch phù. Ôn táo (đầu thu, còn nóng): sốt có mồ hôi, khát, họng khô, ho đau ngực (nặng ho đàm máu), mũi khô, lưỡi khô rêu vàng, mạch phù sác.

- HỎA DÂM (hỏa/nhiệt/ôn tà — hỏa > nhiệt > ôn về mức độ, thường bàn chung): tính thiêu đốt bức cấp, hao tân thương dịch, dẫn đến động phong (cân mạch thất nhuận) và động huyết (bức huyết vọng hành). Biểu hiện: sốt cao khát, mắt mặt đỏ, phiền thao chiêm ngữ, máu cam, ban chẩn, hoặc cuồng, ung mủ, lưỡi đỏ thẫm, mạch hồng sác/tế sác.`,
      keyPoints: "Quy trình biện chứng: tứ chẩn → bát cương → biện chứng (phân tích sâu dần); chứng ≠ triệu chứng ≠ bệnh\nLục dâm: Phong (di chuyển/biến hóa nhanh), Hàn (ngưng trệ, tổn dương), Thử (viêm nhiệt, hao khí tân dịch), Thấp (nặng nề dai dẳng), Táo (thương tân dịch, chia lương/ôn táo), Hỏa (thiêu đốt, động phong động huyết)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bệnh Nhân Biện Chứng - Dịch Lệ (Ôn dịch, Dịch chẩn, Ôn hoàng)",
      category: cat,
      summary: "Dịch lệ (ôn bệnh) là bệnh truyền nhiễm cực mạnh, phát bệnh nhanh cấp nặng nguy kịch; 3 thể chính: ôn dịch (chứng hầu điển hình), dịch chẩn (gây ban chẩn), ôn hoàng (gây vàng da cấp).",
      content: `Dịch lệ (= ôn bệnh/ôn hoàng, do cảm nhiễm dịch độc) gây bệnh truyền nhiễm. "Y học chính truyền - Ôn dịch": khi dịch khí phát sẽ đại lưu hành gây hại nghiêm trọng trong cộng đồng. Đặc điểm chung: phát bệnh nhanh cấp nặng nguy kịch, tính truyền nhiễm cao.

CHỨNG HẦU ÔN DỊCH: mới phát sợ lạnh rồi sốt, sau chỉ sốt không sợ lạnh. 2-3 ngày đầu mạch không phù không trầm mà sác, đau đầu đau mình, sốt ngày đêm nhưng tăng chiều (nhật bô), rêu trắng đóng bựa như phấn. Cơ chế: tà lưu tại mạc nguyên hướng ra ảnh hưởng vệ khí → ố hàn sốt đau đầu mình; bệnh độc xú trọc uẩn tích → rêu như đóng phấn. So với thái dương/dương minh thương hàn: ôn dịch đau đầu như bửa chặt (nặng hơn); mồ hôi đặc biệt nhiều ở đầu (do đầu lĩnh các kinh dương, hỏa độc chưng áo đi lên). Diễn biến 2 xu hướng: tùng ngoại giải (bứt rứt, chiến hạn, tự hạn) hoặc tùng nội hãm (ngực đầy bụng trướng đau táo kết hoặc nôn ói, thần hôn chiêm ngữ, lưỡi vàng rêu đen mọc gai). Chú ý: sau rét run đại hạn mạch tĩnh thân mát có thể còn phục tà chưa tận giải, tái phát ố hàn trước sốt sau — biến chứng thêm.

DỊCH CHẨN BỆNH HẦU (cảm táo nhiệt dịch độc gây ban chẩn): sơ khởi sốt toàn thân đầu đau như bổ, ban chẩn thấu lộ đỏ/đỏ thẫm/tím đen, mạch sác. Nếu nặng: lục mạch tế sác trầm phục, sắc mặt xanh lơ mơ, tứ chi quyết lạnh, mồ hôi đầu như mưa, đau bụng cồn cào muốn ói/tiêu chảy mà không được, lắc đầu nhướng trán = "muộn dịch" (nguy kịch, độc hãm sâu không phát lộ được). Cơ chế: độc tà từ bì mao/mũi miệng xâm phế vị, phế vị tán bố 12 kinh mạch → sốt đau đầu ban chẩn xuất lộ. Mạch phù đại sác = độc đã phát dương (ra ngoài, tốt hơn); trầm tế sác = độc vào sâu; không phù không trầm mà sác = độc hãm bán biểu bán lý ở mạc nguyên.

ÔN HOÀNG BỆNH HẦU (ôn độc hiệp thấp nhiệt, gây vàng da cấp "cấp hoàng"): sơ khởi sốt ố hàn, sau đột nhiên phát hoàng toàn thân (lợi răng, củng mạc vàng thẫm). Nặng: tứ chi nghịch lãnh, thần hôn chiêm ngữ, trực thị (đứng tròng), tiểu không hay, lưỡi co cuộn, tay bắt chuồn chuồn (tuần y mạc sàng) — đây là triệu chứng nguy kịch do dịch độc nội hãm ngũ tạng, tinh khí hao kiệt. Cơ chế: thấp nhiệt + ôn độc ủ uất giữa bì phu cơ tấu → sốt ố hàn rồi đột nhiên phát hoàng; độc nội hãm ngũ tạng, âm dương cách cự → tứ chi nghịch lãnh; cán nhiễu não hệ mông bịt thanh khiếu → trực thị; phạm can thận hạ tiêu thất cố → di niệu; thiếu âm tinh khí thoát tuyệt → lưỡi cuộn tay bắt chuồn chuồn.`,
      keyPoints: "Dịch lệ = bệnh truyền nhiễm cực mạnh (thời hành bệnh), đặc điểm giống thương hàn lúc khởi phát nhưng khác ở mức độ (đau đầu dữ hơn, mồ hôi đầu nhiều hơn)\nMạch phù đại sác (độc phát dương, tốt) khác trầm tế sác (độc vào sâu, nặng) trong dịch chẩn\nÔn hoàng cấp hoàng với các dấu hiệu trực thị/lưỡi co cuộn/tay bắt chuồn chuồn là dấu hiệu tinh khí hao kiệt, nguy kịch",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bệnh Nhân Biện Chứng - Thất Tình",
      category: cat,
      summary: "Thất tình (hỷ, nộ, ưu, tư, bi, khủng, kinh) kích thích quá độ gây tổn thương nội tạng tương ứng (hỷ thương tâm, nộ thương can, ưu/bi thương phế, tư thương tỳ, khủng thương thận, kinh loạn khí).",
      content: `Thất tình = hỷ, nộ, ưu, tư, bi, khủng, kinh — chứng hầu chỉ gặp ở nội thương tạp bệnh. Kích thích bên ngoài quá mức gây hưng phấn/ức chế tình chí quá độ → tổn thương nội tạng. Biểu hiện chủ yếu ở biến hóa âm dương khí huyết: bạo hỷ thương dương, bạo nộ thương âm, khí uất hóa hỏa, khí nghịch huyết loạn — trực tiếp tổn thương ngũ tạng tương ứng.

- HỶ THƯƠNG (vui quá độ): thương tâm, khí hoãn tán không tụ → tâm thần bất an, nói năng lộn xộn, đi đứng thất thường.
- NỘ THƯƠNG (giận quá độ): thương can, can khí nghịch huyết loạn → nặng thì huyết phạm lên gây thần hôn bạo quyết.
- ƯU THƯƠNG (lo lắng quá độ): thương phế (lâu dài cũng thương tỳ), khí bế tắc → tình chí uất ức buồn rười rượi, tinh thần uể oải ăn kém.
- TƯ THƯƠNG (suy nghĩ quá độ): thương tỳ (và tâm) → hay quên, chính xung (đau ngực/ngoại tâm thu), ngủ kém, hình thể gầy gò.
- BI THƯƠNG (buồn quá độ): thương phế, phế chủ khí bị tổn → sắc mặt ảm đạm, thần khí bất túc ("Tâm khí hư tắc bi" - Linh khu).
- KHỦNG THƯƠNG (sợ hãi quá độ): thương thận, thận khí khuy hư → nơm nớp sợ hãi không yên, đóng cửa ở một mình, sợ người hại.
- KINH THƯƠNG (hoảng sợ bất ngờ): khí loạn nội động tâm thần → buồn thắc mắc không yên, nặng thì tinh thần thác loạn ngôn ngữ hành vi bất thường.

Do thất tình liên quan chặt chẽ với nội thương tạng phủ khí huyết, lâm sàng cần kết hợp tạng phủ và khí huyết biện chứng khi biện thất tình.`,
      keyPoints: "Thất tình thương tổn theo quy luật ngũ tạng: hỷ→tâm, nộ→can, ưu/bi→phế, tư→tỳ, khủng→thận; kinh gây khí loạn nội động tâm thần",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Bệnh Nhân Biện Chứng - Ẩm Thực, Lao Dật, Phòng Thất, Ngoại Thương",
      category: cat,
      summary: "Ẩm thực thất điều tổn vị trường; lao dật (quá mệt hoặc quá nhàn) tổn khí huyết cân cốt; phòng thất quá độ tổn tinh khí; ngoại thương (kim đao, trùng thú, trật đả) gây tổn thương cục bộ/toàn thân.",
      content: `ẨM THỰC TỔN THƯƠNG: ăn đồ béo ngọt không tiết chế → vận hóa thất thường. Tổn vị: vị thống, sợ ngửi mùi đồ ăn, ăn kém, ngực đầy tức, ợ hơi ợ chua, rêu dày nê, mạch hoạt hữu lực. Tổn trường: đau bụng tiêu chảy. Ăn đồ độc: nôn ói hoặc thổ tả, đau bụng quặn. Mạch thường hoạt tật/trầm thực, rêu dày dơ/vàng.

LAO DẬT TỔN THƯƠNG (dật = an nhàn — cả quá mệt và quá nhàn đều gây bệnh): Quá mệt nhọc: uể oải vô lực muốn nằm hoài, lười nói, ăn giảm, mạch hoãn đại/tế — tổn nguyên khí. Quá an nhàn: béo mập đi lại khó, động là thở hổn hển tim đập nhanh hụt hơi tay chân mềm — khí cơ uất trệ huyết mạch mất thông. Quy luật tổn thương theo hoạt động: nhìn lâu thương huyết, nằm lâu thương khí, ngồi lâu thương cơ nhục, đứng lâu thương xương cốt, đi lâu thương cân; đổ mồ hôi nhiều sau lao quyện thương huyết; thận lao thương tinh.

PHÒNG THẤT THƯƠNG TỔN (quá độ dễ thành chứng lao): Âm hư: ho khạc huyết, cốt chưng triều nhiệt, tâm quý tự hạn. Dương hư: liệt dương, tảo tiết (xuất tinh sớm), tay chân lạnh, đau lưng mỏi gối, mộng di hoạt tinh. Cơ chế: tinh khí tổn → tinh hư khí hư → âm hư dương kháng hoặc dương hư tinh bất cố. Cần xem bẩm phú bệnh nhân mạnh/yếu và mức độ lao thương để biện biệt.

NGOẠI THƯƠNG (đao kéo, té ngã, trùng thú cắn):
- Kim đao tổn thương: vết thương cục bộ xuất huyết đau sưng đỏ; đứt gân gãy xương chảy máu không dứt, đau cực độ, xuất huyết nhiều → mặt trắng nhợt chóng mặt (hư thoát). Nếu nhiễm phong tà độc khí (uốn ván/"phá thương phong"): lạnh run sốt co gân, răng cắn chặt vẻ mặt như cười đau khổ, co giật từng cơn, giác cung phản trương, đàm kéo úng thịnh.
- Trùng thú tổn thương: nhẹ sưng đỏ đau tê hoặc phát chẩn; nặng tứ chi tê dại đau nhiều, hoa mắt tức ngực, ứ ban/xuất huyết. Chó dại cắn: sợ nước ánh sáng tiếng động khi phát bệnh — thời gian ủ bệnh phụ thuộc tuổi, vị trí/độ sâu vết cắn, lượng độc.
- Trật đả tổn thương: đau sưng, trật gân chảy máu, gãy xương; nếu đè ép/rơi từ cao → có thể thổ huyết tiện huyết. Cơ chế chung: kinh lạc khí huyết uất trệ → đau sưng; rách da → chảy máu.`,
      keyPoints: "Quy luật lao thương theo tư thế/hoạt động: nhìn lâu thương huyết, nằm lâu thương khí, ngồi lâu thương cơ nhục, đứng lâu thương xương cốt, đi lâu thương cân",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 4 chủ đề Bệnh Nhân Biện Chứng - hoàn tất phần đầu Chương 3.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
