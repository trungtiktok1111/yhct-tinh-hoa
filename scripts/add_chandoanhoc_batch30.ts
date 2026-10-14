import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 5: Phụ Biên, mục Hoàng Đản và Huyền Vựng",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;
  const cat = "Tứ chẩn";

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Hoàng Đản (Vàng Da, 6 chứng)",
      category: cat,
      summary: "Hoàng đản chia Dương hoàng (vàng tươi như vỏ quýt, do thấp nhiệt) và Âm hoàng (vàng ám tối, do hàn thấp) — gồm nhiệt nặng hơn thấp, thấp nặng hơn nhiệt, nhiệt độc tích thịnh (cấp hoàng), can uất đởm trệ, hàn thấp, can huyết uất trệ.",
      content: `HOÀNG ĐẢN: căn cứ màu sắc chia DƯƠNG HOÀNG (vàng tươi như vỏ quýt — đa số do thấp nhiệt nội uẩn hun chưng cơ phu) và ÂM HOÀNG (vàng ám tối không tươi — đa số do hàn thấp nội trở, tỳ dương bất vận, đởm trấp không tuần kinh).

6 chứng thường gặp:

1. **Nhiệt nặng hơn thấp (trong dương hoàng)**: mặt và toàn thân vàng tươi như vỏ quýt kèm sốt, miệng khát, sợ đồ ăn dầu mỡ, buồn ói, sườn đau, bụng trướng, tiểu vàng đục, táo bón, lưỡi đỏ rêu vàng, mạch huyền sác. Thấp nhiệt giao chưng đởm trấp tràn ra; khốn trở tỳ vị khí cơ can đởm không thông.

2. **Thấp nặng hơn nhiệt (trong dương hoàng)**: mặt mắt toàn thân vàng không tươi lắm kèm nặng đầu, thân thể nặng nề, ngực bụng bĩ muộn, ăn ít bụng trướng tiêu chảy, rêu dày nê mà vàng, mạch nhu hoãn. Thấp tà nội trở thanh dương không tuyên, thấp nhiệt khốn tỳ.

3. **Nhiệt độc tích thịnh (cấp hoàng — dương hoàng trọng chứng)**: vàng da vàng mắt khởi bệnh cấp kèm thần hôn chiêm ngữ, sốt cao phiền khát, da phát ban, nục huyết niệu huyết, lưỡi đỏ sẫm, rêu vàng khô, mạch huyền hoạt. Nhiệt độc tích thịnh bức đởm trấp tràn ra rất nhanh, nhiệt tà nội hãm tâm bào.

4. **Can uất đởm trệ**: vàng da vàng mắt hay tái phát, đau dữ dội hạ sườn phải lan vai lưng, sốt ố hàn, phân màu xám trắng. Can khí uất kết, đởm dịch lưu thông không thông, không xuống được nên phân xám trắng (không vàng).

5. **Hàn thấp (âm hoàng chứng)**: vàng da vàng mắt, màu vàng nhạt hoặc vàng như hun khói kèm úy hàn chi lạnh, bụng căng ngăn (bí hơi), ăn kém, bụng trướng tiêu chảy, lưỡi nhạt rêu nê, mạch trì hoãn. Âm hàn tà lưu trệ trung tiêu, hàn thấp khốn tỳ.

6. **Can huyết uất trệ**: vàng da vàng mắt ám tối trọc trệ kèm đau có u cục (chưng tích) ở hạ sườn, da có sao mạch, lưỡi xanh tím có ứ ban, mạch huyền sác. Ứ huyết đình tích, đởm trấp vận hành trở ngại.

PHÂN BIỆT CHỦ YẾU: Nhiệt nặng hơn thấp (vàng tươi như vỏ quýt, sốt, buồn nôn, chán ăn/sợ ăn, sườn đau, bụng trướng, rêu vàng, mạch huyền sác). Thấp nặng hơn nhiệt (vàng KHÔNG tươi, đầu nặng, mình nặng, chán ăn tiêu chảy, rêu vàng nê, mạch nhu hoãn). Nhiệt độc tích thịnh (phát bệnh RẤT NHANH, sốt rất cao, miệng khát, phát ban, nục huyết là đặc điểm chính — cấp cứu). Can khí trở trệ (đau sườn lan vai lưng, tiêu phân màu XÁM TRẮNG — đặc trưng riêng). Hàn thấp (mặt vàng NHẠT, PHẢI có úy hàn chi lạnh, tiêu chảy, mạch trì hoãn). Can huyết ứ trở (PHẢI có đau và chưng tích hạ sườn, đa số có sao mạch, lưỡi xanh tím có ứ ban).`,
      keyPoints: "Hoàng đản: Dương hoàng (vàng tươi, thấp nhiệt — chia nhiệt>thấp và thấp>nhiệt theo mức độ) vs Âm hoàng (vàng tối như hun khói, hàn thấp)\nCấp hoàng (nhiệt độc tích thịnh) là cấp cứu: phát bệnh rất nhanh + sốt cao + phát ban + xuất huyết + thần hôn\nCan uất đởm trệ đặc trưng bởi phân màu xám trắng (đởm dịch tắc nghẽn không xuống ruột)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Phụ Biên Chẩn Đoán Gián Biệt - Huyền Vựng (Chóng Mặt Hoa Mắt, 8 chứng)",
      category: cat,
      summary: "Huyền vựng (huyền=mắt tối xầm từng đợt, vựng=đầu quay) chủ yếu bệnh lý can-thận, do phong/đàm/hư ('Chư phong điệu huyền giới thuộc vu can', 'Vô đàm bất tác huyền', 'Vô hư bất tác huyền').",
      content: `HUYỀN VỰNG: "Huyền" là từng đợt mắt tối xầm; "Vựng" là đầu cảm giác lúc nào cũng quay — gộp chung "huyền vựng" (chóng mặt hoa mắt). Nhẹ nhắm mắt là hết; nặng cảm giác chòng chành như ngồi xe/ghe không đứng được, kèm buồn nôn nôn ói hạn xuất. Chủ yếu bệnh lý 2 tạng CAN và THẬN, do phong/đàm/hư: "Chư phong điệu huyền, giới thuộc vu can" (mọi chứng phong gây chóng mặt đều thuộc can), "Vô đàm bất tác huyền" (không đàm thì không gây huyền vựng), "Vô hư bất tác huyền" (không hư thì không gây huyền vựng).

8 chứng thường gặp:

1. **Can dương thượng kháng**: huyền vựng tai ù mất ngủ, mộng nhiều, mặt triều hồng, đau sườn, nóng nảy dễ quạo, hoặc tay chân run nhẹ, lưỡi đỏ, mạch huyền sác mà phù. Tình cảm uất ức/bạo nộ thương can, can dương thượng kháng hóa nhiệt sinh phong.

2. **Can hỏa thượng viêm**: huyền vựng ù tai điếc tai kèm đầu căng đau, mặt đỏ, miệng đắng, sườn đau, tâm phiền dễ cáu, tiểu vàng sậm, lưỡi đỏ thẫm, rêu vàng khô, mạch huyền sác hoặc huyền hoạt. Can khí uất nhiệt hóa hỏa thượng viêm.

3. **Can đởm thấp nhiệt**: huyền vựng ù tai kèm đầu nặng căng, ngực bụng căng tức, sườn đau nóng, nóng nảy dễ cáu, tay chân tê hoặc phù 2 chân, phụ nữ xích bạch đới hạ, lưỡi đỏ bệu hoặc dấu răng, mạch trầm huyền mà sác. Thấp nhiệt uẩn kết ức chế thanh dương, hạ chú gây phù chi dưới và đới hạ.

4. **Thận âm hư**: huyền vựng ù tai kèm lưng gối tê mỏi mềm, đau lưng, ngũ tâm phiền nhiệt, lưỡi đỏ ít rêu, mạch tế sác. Thận âm bất túc, thận phủ trống rỗng.

5. **Thận dương hư**: đầu vựng ù tai kèm khí đoản phạt lực, lưng mỏi gối mềm, hoặc đái dầm di tinh, úy hàn chi lạnh, lưỡi nhạt, mạch trầm nhược.

6. **Khí hư**: huyền vựng động tắc nặng hơn kèm khí đoản phạt lực, tự hạn, hơi ố hàn, lưỡi nhạt, mạch vi nhược. Trung khí bất túc, thanh dương không lên đầu mặt — tăng khi động đậy đi lại.

7. **Huyết hư**: huyền vựng mặt trắng, tâm quý khí đoản, đứng lên đột ngột mắt tối sầm muốn té, lưỡi nhạt gầy, mạch tế nhược. Huyết dịch hư thiểu không tư nhuận không khiếu.

8. **Đàm thấp trung trở**: đầu vựng tai ù, đầu nặng như bó buộc, ngực tức muốn ói, ăn ít đàm nhiều dễ khạc, thích ngủ hoài, rêu trắng nê, mạch nhu hoạt. Đàm thấp mông bịt thanh dương không thăng phát, chức năng thăng giáng tỳ vị hỗn loạn.

PHÂN BIỆT CHỦ YẾU: Can dương/can hỏa/can đởm thấp nhiệt đều có tai ù, dễ cáu, đau sườn CHUNG — phân biệt: can dương thượng kháng (mặt triều hồng, mất ngủ mộng nhiều, tay chân run, mạch huyền PHÙ sác); can hỏa thượng viêm (mặt đỏ RỰC, mắt đỏ miệng đắng tâm phiền tiểu vàng sậm, mạch huyền TRẦM hoạt/trầm sác); can đởm thấp nhiệt (mặt đỏ, nặng đầu tức ngực, tê chi, bụng trướng, mạch TRẦM huyền sác). Thận âm hư và thận dương hư đều có huyền vựng ù tai lưng gối mỏi — âm hư KÈM ngũ tâm phiền nhiệt lưỡi đỏ mạch tế sác; dương hư KÈM úy hàn chi lạnh lưỡi nhạt mạch trầm nhược. Khí hư và huyết hư đều huyền vựng — khí hư KÈM khí đoản phạt lực tự hạn, động tắc huyền tăng, mạch vi; huyết hư mặt trắng bệch tâm quý, mắt tối sầm khi ĐỨNG LÊN ĐỘT NGỘT, mạch tế. Đàm thấp trung trở: đầu nặng như bó buộc, tức ngực buồn nôn đàm nhiều, mạch nhu hoãn.`,
      keyPoints: "Huyền vựng luôn quy về can-thận theo nguyên lý 'phong→can, đàm→có, hư→có'\n3 chứng liên quan can (dương thượng kháng/hỏa thượng viêm/đởm thấp nhiệt) đều có tai ù+dễ cáu+đau sườn chung — phân biệt bằng vị trí mạch (phù/trầm) và mức độ đỏ mặt\nHuyết hư huyền vựng đặc trưng: mắt tối sầm khi đứng lên đột ngột (tư thế tính)",
      status: "DRAFT",
      sourceId: sid,
    },
  });

  console.log("Đã thêm 2 chủ đề: Hoàng Đản (6 chứng) và Huyền Vựng (8 chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
