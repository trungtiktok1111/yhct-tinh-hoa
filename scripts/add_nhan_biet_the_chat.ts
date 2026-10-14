// Thêm "Nhận biết thể chất" (Thầy Hồ Hải Long, 32 slide, song ngữ Trung-Việt)
// vào Lý luận cơ bản. Đây là học thuyết "Thể chất học" (9 loại thể chất kinh
// điển theo Vương Kỳ) — lý luận YHCT hợp lệ dù trình bày trong bối cảnh khóa
// đào tạo spa/dưỡng sinh. Bỏ qua các phần mang tính quảng cáo thương mại cụ thể
// (so sánh sản phẩm). Trích nguyên văn phần lý luận, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Nhận biết thể chất (认识体质)",
      sourceType: "Bài giảng",
      authorOrOrg: "Thầy Hồ Hải Long (胡海龙)",
      locator: "32 slide, song ngữ Trung-Việt",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const cat = "Thể chất học";

  await prisma.theoryTopic.create({
    data: {
      name: "Thể chất là gì — hình thành và phân loại 9 loại thể chất",
      category: cat,
      summary: "Thể chất gồm thể tiên thiên (bẩm sinh) và hậu thiên (hình thành sau sinh); phân 9 loại: Bình hòa (khỏe mạnh) và 8 loại lệch lạc (Khí hư, Dương hư, Âm hư, Đàm thấp, Thấp nhiệt, Huyết ứ, Khí uất, Đặc bẩm).",
      content:
        "ĐỊNH NGHĨA: Thể chất (thể tạng) là vóc dáng/cấu tạo cơ thể, khả năng vận hành của các cơ quan, và đặc điểm tính cách/cảm xúc — hình thành từ Thể chất tiên thiên (bẩm sinh, do Âm Dương cha mẹ truyền) và Hậu thiên (do thói quen ăn uống, môi trường sống, khí hậu thời tiết, tuổi tác, trạng thái tinh thần, nếp sinh hoạt, vận động). " +
        "LIÊN HỆ ĐỊA LÝ - TUỔI TÁC - GIỚI TÍNH: Thấp Nhiệt thường gặp ở vùng ven biển nóng ẩm (như Quảng Đông); Huyết Ứ và Âm Hư phổ biến ở vùng cao nguyên khô lạnh áp suất thấp (như Thanh Hải); Dương Hư chiếm tỷ lệ cao ở vùng lạnh giá kéo dài (như Đông Bắc). Nam giới thường thuộc Đàm Thấp và Thấp Nhiệt (do thói quen rượu bia, thuốc lá); Nữ giới thường thuộc Khí Uất và Dương Hư (do suy nghĩ nội tâm nhiều, tâm lý dễ vướng mắc). " +
        "PHÂN LOẠI 9 THỂ CHẤT (theo học thuyết thể chất học YHCT — 9 loại): Bình hòa (khỏe mạnh); Khí hư (biểu hiện: sa trễ); Dương hư (sợ lạnh); Âm hư (thiếu nước/tân dịch); Đàm thấp (béo phì); Thấp nhiệt (nổi mụn); Huyết ứ (nám sạm); Khí uất (u uất); Đặc bẩm/Đặc lẫm (dị ứng). " +
        "BẢNG TRIỆU CHỨNG CHI TIẾT TỪNG THỂ CHẤT (vùng mặt / toàn thân): " +
        "Đàm Thấp — mặt bóng dầu, lỗ chân lông to, mắt sưng húp, bọng mắt dạng hạt, mụn bọc/mụn nang; toàn thân béo phì, mùi cơ thể nặng, đầy bụng, mỡ bụng mềm nhão, hành động chậm chạp, đầu óc choáng váng nặng nề. " +
        "Thấp Nhiệt — da dầu nhờn xỉn màu/vàng sạm, mụn trứng cá kinh niên, rụng tóc kèm gàu, bọng mắt tích dịch, chàm; toàn thân mùi mồ hôi nồng, nặng nề mệt mỏi, táo bón, nam dễ ẩm ướt vùng bẹn, nữ khí hư nhiều có mùi. " +
        "Âm Hư — da khô bong tróc, ngoài dầu trong khô, dễ nếp nhăn và nám, hai gò má đỏ ửng; toàn thân nóng lòng bàn tay bàn chân và ngực (ngũ tâm phiền nhiệt), suy buồng trứng sớm, khô âm đạo, hoa mắt chóng mặt, lão thị sớm, nhiều rỉ mắt, mất ngủ nhiều mộng, ù tai, tóc khô xơ nhiều gàu, người gầy sút. " +
        "Khí Hư — da lỏng lẻo chảy xệ (rãnh rồng, cơ táo, ngực, bụng, mông), bọng mắt lỏng, sắc mặt vàng nhợt; toàn thân rã rời, chóng mặt, suy nhược thần kinh, hay buồn ngủ, đầu óc uể oải dễ cảm mạo, tóc khô xơ, có thể béo bệu hoặc gầy yếu. " +
        "Khí Uất — sắc da xanh xao xỉn màu, nổi mụn/nám, da khô, quầng thâm mắt ánh xanh; toàn thân tâm trạng uất ức lo âu, nhạy cảm đa nghi, hồi hộp chóng mặt, đau tức đầu, mất ngủ mộng mị, khó tập trung, chán ăn, đại tiện khô, nước tiểu vàng, viêm họng mãn tính (vướng víu cổ họng — mai hạch khí). " +
        "Đặc Bẩm — da mẫn cảm, phát ban đỏ ngứa ngáy, chàm; toàn thân phản ứng nhạy cảm với môi trường/mùi lạ/vật lạ (nghẹt mũi chảy nước mũi, hắt hơi liên tục, ho hen), dễ dị ứng theo mùa/phấn hoa/thực phẩm. " +
        "Huyết Ứ — da tối sạm, nám, nổi gân máu đỏ, khô tróc vảy, mụn sẩn tím u tối, vết thâm mụn khó tan, mắt đục, quầng thâm kèm mạch máu nhỏ tím, vùng mũi u tối, môi thâm; toàn thân rụng tóc, trí nhớ giảm sút, nhiều mộng mị hay quên, các chứng đau nhức tái phát (đau nửa đầu, đau đầu thần kinh). " +
        "Dương Hư — nám, béo bệu/phù, rụng tóc kèm phù thũng, da xỉn màu/trắng bệch, môi nhợt/thâm, mắt quầng lõm; toàn thân ngủ nông dễ giật mình, sợ lạnh thích ấm, chân tay lạnh, mệt mỏi thiếu sức sống, phù nề chi dưới/mí mắt (ấn lõm khó đàn hồi), đầy bụng đau bụng, đại tiện lỏng nát; nam dễ liệt dương/xuất tinh sớm, nữ tử cung lạnh/thống kinh (máu cục màu tối)/kinh chậm/kinh ít/vô sinh. " +
        "Mỗi người thường không chỉ có 1 thể chất đơn lẻ mà xen lẫn 3-5 loại, luôn có 1 loại chủ chốt — nếu điều kiện cho phép có thể điều dưỡng đồng thời, nếu không thì ưu tiên loại thể tạng chính trước.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Thể chất liên hệ với vấn đề sức khỏe thường gặp",
      category: cat,
      summary: "Các vấn đề sức khỏe thường gặp (mất ngủ, béo phì, tam cao, táo bón, rụng tóc...) thường do một hoặc nhiều thể chất lệch lạc gây ra — bảng đối chiếu triệu chứng với thể chất nguyên nhân.",
      content:
        "Cơ chế chung: nhịp sống nhanh, lao lực quá mức, áp lực/lo âu/cảm xúc tiêu cực gây hoặc làm trầm trọng thêm tình trạng mất cân bằng thể tạng, dẫn đến trạng thái 'kém khỏe mạnh' (tiền bệnh lý), thậm chí bệnh tật thực thể. " +
        "Bảng đối chiếu vấn đề sức khỏe — thể chất nguyên nhân có thể gây ra: Mất ngủ (Âm Hư, Khí Huyết Hư, Khí Uất, Huyết Ứ); Lo âu/trầm cảm (Khí Uất, Huyết Ứ); Mệt mỏi thường xuyên (Khí Huyết Hư, Dương Hư); Béo phì/thừa cân (Đàm Thấp, Thấp Nhiệt, Huyết Ứ, Khí Huyết Hư, Dương Hư); 'Tam cao' — cao huyết áp/mỡ máu/đường huyết (Đàm Thấp, Huyết Ứ, Âm Hư); Táo bón (Âm Hư); Tiêu chảy mãn tính (Khí Huyết Hư, Dương Hư); Đau nhức lưng/cổ/vai/cổ tay (Huyết Ứ, Khí Uất, Khí Huyết Hư, Đàm Thấp, Thấp Nhiệt); Khô mắt/khó chịu ở mắt (Âm Hư); Nám sạm/tàn nhang/quầng thâm (Huyết Ứ, Thấp Nhiệt, Đàm Thấp, Âm Hư, Khí Huyết Hư); Da dầu/lỗ chân lông to/bọng mắt (Thấp Nhiệt, Đàm Thấp); Rụng tóc/tóc bạc sớm (Khí Huyết Hư, Dương Hư, Âm Hư); Các vấn đề phụ khoa (mọi loại thể tạng mất cân bằng đều có thể là nguyên nhân). " +
        "Ý nghĩa của việc thấu hiểu thể chất: (1) phòng bệnh từ sớm — khi thể tạng đã lệch lạc nhưng chưa thành bệnh, điều chỉnh kịp thời giúp phát hiện/cảnh báo sớm; (2) trị bệnh từ gốc — chỉ chữa triệu chứng mà bỏ qua điều dưỡng thể tạng thì bệnh dễ tái phát; (3) cá nhân hóa chăm sóc sức khỏe và làm đẹp; (4) hiểu tính cách/phản ứng người khác.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  await prisma.theoryTopic.create({
    data: {
      name: "Nguyên tắc điều dưỡng thể chất và ưu tiên thực dưỡng",
      category: cat,
      summary: "Nguyên tắc 'Nhiệt dùng Hàn, Hàn dùng Nhiệt, Hư thì Bổ, Thực thì Tả'; quy trình 4 bước (Chẩn đoán - Can thiệp - Đánh giá - Duy trì); ưu tiên thực dưỡng hơn dùng thuốc theo tư tưởng Tôn Tư Mạo.",
      content:
        "QUY TRÌNH 4 BƯỚC CẢI THIỆN THỂ TẠNG: (1) Chẩn đoán — thấu hiểu thể tạng (qua phiếu chẩn đoán thủ công hoặc máy AI tứ chẩn thể chất; quan sát rêu lưỡi — thể Bình hòa có màu lưỡi đỏ nhạt tươi sáng, rêu trắng mỏng không khô không ẩm, thân lưỡi mềm vận động linh hoạt). (2) Can thiệp — tiến hành cải thiện. (3) Đánh giá — so sánh hiệu quả. (4) Duy trì — chăm sóc và bảo dưỡng. " +
        "NGUYÊN TẮC ĐIỀU DƯỠNG THEO TÍNH CHẤT THỂ TẠNG: Nhiệt thì dùng tính Hàn để khắc chế (thanh nhiệt); Hàn thì dùng tính Nhiệt/Ấm để sưởi ấm (tán hàn, ôn thông); Hư (suy yếu) thì dùng phép Bổ để bồi dưỡng; Thực (dư thừa độc tố) thì dùng phép Tả để đào thải. Phương pháp cụ thể: chẩn đoán chuyên sâu hiểu thể tạng → xây phác đồ dưỡng sinh cá nhân hóa → kết hợp liệu pháp thẩm thấu qua da (dược dục/tắm thảo dược, trà thể chất, canh thể chất, dầu thể chất) → đưa thể tạng lệch lạc về trạng thái Bình hòa khỏe mạnh. " +
        "TƯ TƯỞNG DƯỠNG SINH ĐÔNG Y: 'Thiên Nhân hợp nhất' (cơ thể người và vũ trụ/môi trường tự nhiên-xã hội là một khối thống nhất) và 'Biện thể thi dưỡng' (dựa cơ địa riêng mỗi người để đưa ra chăm sóc phù hợp). " +
        "ƯU TIÊN THỰC DƯỠNG: Tôn Tư Mạo ('Dược vương') trong Bị cấp thiên kim yếu phương: 'Người làm thầy thuốc trước hết phải thấu hiểu ngọn nguồn căn bệnh, biết rõ vị trí bị tổn thương, rồi dùng thực phẩm để điều trị; nếu thực dưỡng không khỏi thì mới dùng đến thuốc' — xếp thực dưỡng đứng đầu các phương pháp chữa bệnh. Lý do: 'dược thực đồng nguyên' (thuốc và thực phẩm cùng nguồn gốc, cùng hiệu quả, cùng nguyên lý, cùng tính chất); 'dược tính mãnh, thực tính hoãn' — dùng thuốc như dùng binh (rủi ro cao), thuốc là 'thực phẩm có độc', thực phẩm là 'thuốc không độc' — nên ưu tiên thực dưỡng hơn thuốc trị liệu nếu không bất khả kháng. " +
        "CƠ SỞ LÝ LUẬN THỰC DƯỠNG: thể tạng mỗi người phân theo Hư-Thực-Hàn-Nhiệt; thực phẩm có Tứ tính (ôn-lương-hàn-nhiệt), Ngũ vị (chua-đắng-ngọt-cay-mặn), và Quy kinh riêng — dựa vào thể tạng cụ thể áp dụng nguyên tắc 'Nhiệt dùng Hàn, Hàn dùng Nhiệt, Hư thì Bổ, Thực thì Tả' để đạt hiệu quả dưỡng sinh qua ăn uống.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  console.log("Đã thêm 3 chủ đề Nhận biết thể chất.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
