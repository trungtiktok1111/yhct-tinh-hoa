import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Vi Nhiệt và Hạn Xuất (đổ mồ hôi)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Vi Nhiệt (Sốt Thấp)",
      category: cat,
      summary: "Vi nhiệt (sốt thấp 37-38°C) gặp giai đoạn cuối của bệnh nội thương và ôn nhiệt bệnh — phân biệt phế vị âm thương (ho khan + miệng khô) với can thận âm hư (chóng mặt + tay chân run).",
      content: `VI NHIỆT: sốt thấp, nhiệt độ khoảng 37-38°C, thường gặp giai đoạn cuối một số bệnh nội thương và ôn nhiệt bệnh. 2 chứng thường gặp:

1. **Phế vị âm thương chứng**: sốt thấp kèm ho khan ít đàm hoặc đàm dính, miệng lưỡi khô khốc mà khát, lưỡi đỏ ít tân, mạch hư. Hay phát mùa xuân; nếu có tiền sử phong ôn thì là giai đoạn sau của phong ôn bệnh. Tà nhiệt tuy lui nhưng chưa sạch hết, phong nhiệt chi tà thương tân, phế vị âm thương gây sốt thấp.

2. **Nội thương can thận âm hư chứng** (hoặc can phong nội động): sốt thấp dai dẳng kèm lưỡng quyền đỏ, thủ túc tâm nhiệt, miệng họng khô táo, hoa mắt chóng mặt, lười biếng uể oải, tay chân run, lưỡi đỏ thẫm mà khô ít rêu, mạch hư sác. Phát mùa xuân; nếu có tiền sử xuân ôn bệnh thì là giai đoạn cuối xuân ôn bệnh (can thận âm thương chứng). Nhiều loại ôn bệnh giai đoạn cuối thường xuất hiện chứng này, do can thận âm thương, tân khuy thất dưỡng.

PHÂN BIỆT CHỦ YẾU: cả 2 đều sốt thấp nhưng biểu hiện khác nhau. Phế vị âm thương: đặc điểm ho khan ít đàm, miệng lưỡi khô táo (nếu giai đoạn cuối phong ôn thì phải có tiền sử mắc phong ôn). Can thận âm hư: hoa mắt chóng mặt, lười uể oải, chân tay run là biểu hiện chính (nếu là ôn bệnh giai đoạn cuối thì phải có tiền sử mắc ôn bệnh).`,
      keyPoints: "Vi nhiệt (37-38°C) luôn là giai đoạn cuối bệnh, âm hư là gốc chung\nPhân biệt: Phế vị âm thương (ho khan + khô miệng là trọng tâm) vs Can thận âm hư (chóng mặt + tay chân run là trọng tâm)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Hạn Xuất Toàn Thân (Đổ Mồ Hôi Toàn Thân, 9 bệnh phân biệt)",
      category: cat,
      summary: "Đổ mồ hôi bệnh lý toàn thân không do khí hậu/lao động/tình chí — ngoại cảm (thực chứng: trúng phong, dương minh, thử hạn, thấp hạn) và nội thương (hư chứng: tự hạn do dương/khí hư, đạo hạn do âm hư — liên quan tâm/phế/tỳ/thận).",
      content: `HẠN XUẤT (đổ mồ hôi): ra mồ hôi không do khí hậu/lao động mệt nhọc/tình chí là bệnh thái hạn xuất — chia toàn thân và cục bộ.

TOÀN THÂN RA MỒ HÔI: ngoại cảm tà khí (phong, nhiệt, thử, thấp) làm âm dương thất điều, khí huyết tân dịch vận hành thất chức → hạn xuất toàn thân (đa số THỰC chứng). Nội thương do dương hư/âm hư/vong âm/vong dương → tự hạn, đạo hạn, tuyệt hạn toàn thân (đa số HƯ chứng, do dương hư bất cố, âm hư bất liễm). Cũng có khi hư thực tương kiêm.

9 bệnh thường gặp:

1. **Thái dương trúng phong thương vệ chứng**: toàn thân xuất hạn lượng hơi ít kèm sốt, ố phong, nghẹt mũi họng khô, mạch phù hoãn. Phong là dương tà tính khai tiết, tấu lý sơ hở huyền phủ khai trương, tân dịch ngoại tiết.

2. **Thương hàn dương minh kinh chứng**: toàn thân đại hạn, lượng rất nhiều kèm sốt cao, ố nhiệt, phiền khát thích uống, đau đầu vùng trán, lưỡi đỏ thẫm rêu vàng khô, mạch hồng đại hữu lực. Nhiệt tà nội thịnh, chưng tân ngoại tiết.

3. **Thử ôn bệnh thử hạn**: toàn thân hạn xuất tương đối nhiều, dầm dề không dứt kèm phiền khát, ngực cách tức căng, lưỡi đỏ rêu vàng thô, mạch hồng đại hữu lực, phát mùa hạ. Thử tà tính nhiệt, nhiệt tắc bì phu tấu lý khai.

4. **Thấp hạn** (cảm thụ thấp tà hoặc thấp tùng trung sinh): toàn thân hạn xuất, lòng bàn tay chân và đầu mồ hôi rất nhiều, luôn kèm ố phong, thân thể nặng nề tê dại, hoa mắt ù tai, hoặc khớp đau nặng nề, phù thũng tiểu ít, lưỡi bệu nhiều dấu răng, mạch phù hoãn mà như sáp. Thấp tà trọng trọc niêm nê trở trệ vệ dương, ngoài không cô mật cơ phu, trong không thúc đẩy tuần hoàn tân dịch.

5. **Tâm khí hư và Tâm dương hư (tự hạn)**: toàn thân mồ hôi lạnh, động tắc hạn nhiều suyễn tăng kèm tâm quý khí đoản phạt lực, úy hàn chi lạnh, sắc mặt trắng, lưỡi nhạt, mạch hư nhược. Hạn vi tâm dịch — tâm khí tâm dương hư nên tâm dịch tiết ra ngoài. Nếu đại hạn lâm ly, sắc mặt nhợt nhạt, tứ chi quyết lãnh, hoa mắt chóng mặt, tâm quý khí đoản, mạch vi muốn tuyệt → tâm dương muốn thoát/vong dương.

6. **Phế khí hư (tự hạn)**: toàn thân hạn xuất kèm khí đoản ho, đàm trong loãng, sắc mặt nhợt nhạt, lưỡi nhạt rêu trắng, mạch phù hoãn. Phế chủ nhất thân chi khí ngoài hợp bì mao, phế khí hư thì vệ dương hư, cơ biểu bất cố.

7. **Tỳ khí hư (tự hạn)**: toàn thân hạn xuất liên tục không dứt kèm tay chân vô lực, khí đoản lười nói, bụng đầy tiêu chảy, lưỡi nhạt, mạch hư đại mà hồng. Tỳ khí hư suy cơ nhục thất dưỡng, tấu lý không chặt chẽ.

8. **Tâm âm hư (đạo hạn)**: mồ hôi toàn thân lúc ngủ, tỉnh dậy ngưng kèm tâm quý tâm phiền, nóng lòng bàn tay chân, lưỡi đỏ ít tân, mạch tế sác. Tâm âm hư hóa nhiệt bức tân dịch ngoại tiết.

9. **Phế âm hư (đạo hạn)**: mồ hôi toàn thân lúc ngủ, tỉnh dậy hết kèm ho, khí đoản, đàm ít mà dính, ngũ tâm phiền nhiệt, lưỡi đỏ ít rêu, mạch tế sác.

10. **Thận âm hư (đạo hạn)**: mồ hôi toàn thân lúc ngủ tỉnh dậy hết kèm lưng gối mỏi mềm, hoặc di tinh hoạt tinh, ngũ tâm phiền nhiệt, lưỡi đỏ ít rêu, mạch tế sác. Thận chủ ngũ dịch súc tàng âm tinh, tinh thiểu âm hư dương thịnh hóa nhiệt.

PHÂN BIỆT CHỦ YẾU: Thái dương trúng phong (ố phong, mạch phù hoãn). Dương minh kinh chứng (đại hạn, sốt hầm hập, khát thích uống, mạch hồng đại hữu lực). Thử hạn (phát hè, mạch hồng đại VÔ LỰC — khác dương minh). Thấp hạn (hoa mắt căng đầu, thân nặng, tay chân tê, phù, tiêu chảy, lưỡi bệu dấu răng, mạch nhu). Dương hư tự hạn (có úy hàn chi lạnh) khác khí hư tự hạn (không úy hàn chi lạnh). Tâm dương hư/muốn thoát tự hạn (kèm tâm quý, tâm hoảng, dễ giật mình, phạt lực). Phế hư tự hạn (ho đàm loãng). Tỳ hư tự hạn (bụng đầy tiêu chảy, tay chân rã rời, khí đoản lười nói). Âm hư đạo hạn (đổ mồ hôi lúc ngủ, tỉnh dậy ngưng — đặc trưng cơ bản): cả 3 tạng tâm/phế/thận đều có ngũ tâm phiền nhiệt + lưỡi đỏ + mạch tế sác chung, phân biệt theo kiêm chứng riêng — tâm âm hư: tâm quý tâm phiền ngủ mơ nhiều; phế âm hư: ho đàm ít dính; thận âm hư: đau lưng mỏi gối.`,
      keyPoints: "Toàn thân hạn xuất: ngoại cảm = thực chứng (trúng phong/dương minh/thử hạn/thấp hạn, phân biệt theo mạch lực và kiêm chứng biểu), nội thương = hư chứng (tự hạn do dương/khí hư ban ngày, đạo hạn do âm hư lúc ngủ)\nĐạo hạn (mồ hôi trộm, lúc ngủ tỉnh dậy ngưng) liên quan 3 tạng tâm-phế-thận, đều có ngũ tâm phiền nhiệt+lưỡi đỏ+mạch tế sác chung, phân biệt bằng kiêm chứng đặc trưng từng tạng",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Hạn Xuất Cục Bộ (Đầu, Ngực, Tay Chân, Nửa Người)",
      category: cat,
      summary: "Mồ hôi cục bộ theo vị trí phản ánh tạng phủ khác nhau: đầu hạn (thấp nhiệt/bàng quang súc huyết/khí suy), tâm hung hạn (tâm khí/âm hư), mồ hôi tay chân (tỳ), mồ hôi nửa người (khí huyết lưỡng hư/dương hư/thận âm hư/huyết ứ).",
      content: `ĐẦU HẠN (mồ hôi vùng đầu — "Đầu vi chư dương chi hội", nội thương ngoại cảm gây khí thanh dương thăng tuyên thất chức):
- Kèm thân thể nặng nề uể oải, vàng da vàng mắt, tiểu không thông, rêu vàng nê, mạch nhu sác → thấp nhiệt uất chưng bức tân ngoại tiết.
- Kèm đau trướng bụng dưới, đại tiện phân đen, tiểu không thông, sốt về đêm, phiền thao chiêm ngữ, rêu vàng nê, mạch trầm sáp → bàng quang súc huyết chứng (khí hóa giảm, tân dịch không chuyển hóa thành nước tiểu mà nghịch hành lên gây mồ hôi đầu).
- Kèm sắc mặt nhợt nhạt, tứ chi không ấm, úy hàn khí đoản, tinh thần uể oải mệt mỏi, lưỡi nhạt, mạch nhược → khí suy (dương khí đại suy, tân dịch theo dương khí phù việt tiết ra trên).

MỒ HÔI VÙNG NGỰC (tâm hung hạn — chỉ vùng ngực có mồ hôi, nơi khác không — "Hạn vi tâm dịch", tâm ở ngực nên tâm dịch tiết ra gần tâm):
- Kèm mặt trắng úy hàn, tâm quý khí đoản, mệt mỏi phạt lực, lưỡi nhạt, mạch hư → tâm khí hư.
- Kèm tâm quý, tâm phiền mất ngủ, nóng lòng bàn tay chân, lưỡi đỏ ít rêu, mạch tế sác → tâm âm hư (không thể liễm dương, một lượng ít tâm dịch theo dương ngoại tiết).

MỒ HÔI TAY CHÂN (giới hạn lòng bàn tay chân — bệnh cơ chủ yếu quy trách nhiệm cho TỲ, vì tỳ chủ tứ chi, tay chân là "chư dương chi bản"):
- Kèm tức nặng ngực, tiêu chảy, tay chân uể oải vô lực, mạch nhu sác → tỳ vị thấp nhiệt.
- Kèm tứ chi lạnh, uể oải vô lực, ăn ít, tiêu chảy, lưỡi nhạt nộn, mạch hư nhược → tỳ khí hư nhược.
- Kèm nóng lòng bàn tay chân, miệng khô họng táo, lưỡi đỏ ít rêu, mạch tế sác → âm hư dương thịnh (âm kinh hư nhiệt chưng tân ngoại tiết).

MỒ HÔI NỬA NGƯỜI (phân bố không đều — nửa trên/dưới, phải/trái, một nửa có mồ hôi nửa kia khô ráo — do hàn thấp nội trở, khí huyết bất túc, dương khí suy nhược, hoặc âm hư hỏa vượng):
- Kèm sắc mặt trắng nhợt, khí đoản tâm quý, tê môi lưỡi tứ chi, lưỡi nhạt mạch nhược → khí huyết lưỡng hư (tân dịch không vận hành toàn thân).
- Mồ hôi nửa trên, nửa dưới không mồ hôi, kèm mặt nhợt, úy hàn, khí đoản, tinh thần mệt mỏi vô lực, lưỡi nhạt rêu trắng, mạch hư đại vô lực → dương khí đại hư suy (mồ hôi theo hư dương ngoại tiết).
- Nửa thân dưới đổ mồ hôi kèm đau lưng, lưng gối mỏi mềm, di tinh hoạt tinh, miệng họng khô táo, ngũ tâm phiền nhiệt → thận âm hư tổn (hư hỏa nội nhiễu bức tân dịch ngoại tiết nửa dưới).
- Mồ hôi không đều (bất kỳ vị trí) kèm đau nhức (thích thống), hoặc bán thân bất toại, lưỡi xanh hoặc có dấu ứ huyết, mạch trầm sáp → ứ huyết (trị pháp: hoạt huyết hóa ứ).

PHÂN BIỆT CHỦ YẾU: Đầu hạn chia 3 thể: thấp nhiệt (đầu mắt vàng, tiểu không thông), bàng quang súc huyết (đau bụng dưới, mạch trầm sáp), khí hư/dương hư (tứ chi không ấm, lưỡi nhạt mạch nhược). Tâm hung hạn chủ yếu do tâm hư: tâm khí hư (tâm quý khí đoản, lưỡi nhạt mạch nhược) khác tâm âm hư (tâm quý tâm phiền, lòng bàn tay chân nóng, lưỡi đỏ mạch tế sác). Mồ hôi tay chân bệnh tại tỳ: tỳ uẩn thấp nhiệt (tiêu chảy mệt mỏi, rêu vàng, mạch nhu sác) khác tỳ khí hư (ăn kém tiêu chảy mạch hư vô lực) khác âm kinh hư nhược (miệng họng khô, lưỡi đỏ ít rêu, mạch tế sác). Nửa thân mồ hôi: khí huyết lưỡng hư (mặt trắng tay chân tê lưỡi nhạt mạch nhược), dương khí đại hư (nửa trên, úy hàn uể oải lờ đờ), thận âm khuy hư (nửa dưới, lưng gối mỏi, ngũ tâm phiền nhiệt), huyết ứ (đau như châm chích, lưỡi xanh mạch sáp).`,
      keyPoints: "Vị trí mồ hôi cục bộ định vị tạng phủ: đầu (bàng quang/thấp nhiệt/khí suy), ngực (tâm), tay chân (tỳ), nửa người (khí huyết/dương/thận âm/huyết ứ)\nMồ hôi tay chân luôn quy về TỲ (tỳ chủ tứ chi) dù nguyên nhân là thấp nhiệt, khí hư, hay âm hư",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 3 chủ đề: Vi Nhiệt, Hạn Xuất Toàn Thân, Hạn Xuất Cục Bộ.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
