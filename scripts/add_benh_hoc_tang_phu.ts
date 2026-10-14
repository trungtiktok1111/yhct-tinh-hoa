// Thêm ~35 hội chứng bệnh tạng phủ (biện chứng luận trị cổ điển, không gắn 1 bệnh
// danh YHHĐ cụ thể) từ "2. Bệnh học tạng phủ. Lý luận YHCT. Nguyễn Tú Như.pptx"
// (98 slide): Phế-Đại trường, Tâm-Tiểu trường, Thận-Bàng quang, Can-Đởm, Tỳ-Vị.
// Mỗi hội chứng: nguyên nhân/cơ chế (description) + triệu chứng (keySigns). File
// nguồn không có bài thuốc kèm theo (thuần biện chứng) nên không tạo Formula.
// Trích nguyên văn, không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type P = { name: string; cause: string; signs: string };

async function addPatterns(source: { id: string }, list: P[]) {
  for (const p of list) {
    await prisma.pattern.create({
      data: { name: p.name, description: p.cause, keySigns: p.signs, status: "DRAFT", sourceId: source.id },
    });
  }
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Bệnh học Tạng - Phủ (lý luận YHCT)",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Nguyễn Tú Như",
      locator: "98 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  // ================= PHẾ - ĐẠI TRƯỜNG =================
  await addPatterns(source, [
    { name: "Phong hàn thúc Phế", cause: "Phong hàn tà xâm nhập Phế qua da lông, mũi họng.", signs: "Sợ gió, sợ lạnh, đau đầu, cổ gáy; rêu lưỡi mỏng; mạch phù khẩn. Phế bất tuyên: khó thở, nghẹt mũi, ho, đờm trong loãng." },
    { name: "Phong nhiệt phạm Phế", cause: "Phong nhiệt tà xâm nhập Phế qua da lông, mũi họng.", signs: "Sợ gió, đau đầu cổ gáy, sốt, lưỡi đỏ, họng khô khát, táo bón, tiểu vàng ít sậm, mạch sác. Tổn âm dịch, nhiệt bức huyết: đau họng, đau ngực, ho, khạc đờm vàng có khi vướng máu." },
    { name: "Phế âm hư", cause: "Bệnh nội thương tính nhiệt lâu ngày tổn thương Phế âm; hậu quả táo nhiệt, tân dịch tổn thương (ra mồ hôi nhiều), hút thuốc/rượu nhiều, ăn cay nóng, lão suy.", signs: "Miệng họng khô khát, da khô (tân dịch giảm); ho khan hoặc đờm dính ít có khi lẫn máu; ngực nóng, gò má đỏ, bứt rứt, sốt, lòng bàn tay nóng; đạo hãn; tiểu ít sẫm màu, táo bón; hơi thở ngắn, tiếng nói thô ráp; lưỡi khô đỏ; mạch trầm hoặc tế sác." },
    { name: "Phế Thận âm hư", cause: "Bệnh nội thương tính nhiệt; dùng thuốc tính nhiệt/hút thuốc lâu ngày; sau bệnh cảm nhiễm ngoại nhiệt/ôn dịch; lao lực quá độ.", signs: "Ho khan hoặc đờm ít dính; họng miệng khô khát; da khô; đau lưng, cốt chưng, di tinh; nước tiểu vàng lượng ít; đạo hãn, triều nhiệt; lưỡi đỏ, mạch tế sác." },
    { name: "Phế khí hư", cause: "Do Tỳ khí hư, Thận khí hư; lao lực quá độ; tình chí thất điều (buồn làm khí tán); Phế âm hư; sau bệnh ngoại cảm ở Phế.", signs: "Ho, có khi thở suyễn (động thì bệnh tăng); mệt mỏi, tiếng nói nhỏ, đoản khí; đàm trong; tự hãn, dễ cảm; sắc mặt kém tươi; lưỡi bệu rêu trắng; mạch nhược." },
    { name: "Tỳ Phế Thận khí hư", cause: "Bệnh nội thương ở phần khí của một trong các tạng Tỳ/Phế/Thận rồi ảnh hưởng sang tạng khác.", signs: "Mệt mỏi; ho, tiếng nói nhỏ, đoản khí, khó thở (suyễn); đàm trong; sợ lạnh; phù thũng; trướng bụng, cầu phân lỏng; di tinh (nam)/kinh sớm (nữ); đau lưng mỏi gối; lưỡi bệu, mạch nhược." },
    { name: "Nhiệt kết Đại trường", cause: "Nhiệt tà hóa nhiệt táo ở Đại trường, ảnh hưởng chức năng truyền tống phân, tổn khí hao tân dịch.", signs: "Sốt, bụng chướng cự án, tiểu ít đỏ, táo bón, mặt đỏ, tay chân nóng, lưỡi đỏ môi khô, mạch trầm hữu lực." },
    { name: "Hàn kết Đại trường", cause: "Hàn tà xâm nhập Đại trường gây khí tụ, ảnh hưởng truyền tống phân.", signs: "Sợ lạnh, bụng chướng cự án, môi lợt, táo bón, mặt trắng, tay chân mát, rêu lưỡi trắng, mạch trầm huyền." },
    { name: "Nhiệt bức Đại trường", cause: "Nhiệt tà bức bách Đại trường, ảnh hưởng truyền tống phân.", signs: "Mót rặn, hậu môn nóng rát, sốt cao, nói sảng, phân có máu, tiêu chảy." },
    { name: "Thấp nhiệt Đại trường", cause: "Thấp nhiệt tà bức bách Đại trường.", signs: "Mót rặn, đau bụng nhiều quanh rốn, sôi ruột, trung tiện mùi hôi, phân có máu nhầy nhớt, sốt cao lạnh run, vã mồ hôi, tay chân nóng, nôn mửa, lưỡi đỏ rêu vàng nhầy nhớt, mạch tế sác, tiêu chảy ồ ạt." },
  ]);

  // ================= TÂM - TIỂU TRƯỜNG =================
  await addPatterns(source, [
    { name: "Tâm huyết uất trệ", cause: "Đàm bế tắc; khí uất do tình chí thất điều; khí hư không vận hành được huyết.", signs: "Nặng đầu, đau đầu, chóng mặt, tê bì các chi; hồi hộp đánh trống ngực; đau ngực; bứt rứt; tiểu sậm màu; lưỡi đỏ có điểm ứ huyết; mạch tế sáp." },
    { name: "Tâm âm hư", cause: "Bệnh nội thương tính nhiệt lâu ngày tổn thương Tâm âm; hậu quả táo nhiệt, tân dịch tổn thương, hút thuốc/rượu, ăn cay nóng, lão suy.", signs: "Mất ngủ, hay mơ, nói mơ; bứt rứt; giảm trí nhớ; ngũ tâm phiền nhiệt, nóng trong người, triều nhiệt, mặt đỏ; ra mồ hôi trộm; tiểu đỏ ít; lưỡi khô rêu vàng; mạch tế sác." },
    { name: "Tâm huyết hư", cause: "Bệnh nội thương tính nhiệt lâu ngày tổn thương Tâm huyết; 'sinh huyết' kém; xuất huyết nhiều.", signs: "Sắc mặt xanh nhợt, môi nhợt, da niêm nhợt; hồi hộp, mất ngủ, hay quên; hay sợ; xây xẩm chóng mặt; lưỡi nhợt bệu; mạch sác nhược." },
    { name: "Tâm khí hư", cause: "Bệnh ở khí phận lâu ngày ảnh hưởng Tâm; Tâm âm hư; lão suy.", signs: "Nặng ngực; mất ngủ, hay sợ hãi; hồi hộp, vận động thì bệnh tăng; mệt mỏi, đoản hơi; nóng khát, gò má đỏ; sợ lạnh, tự hãn; da tái xanh; lưỡi nhạt rêu trắng; mạch tế vô lực." },
    { name: "Tâm Thận bất giao", cause: "Bệnh tích nhiệt làm Tâm dương vượng lên; Thận dương hư không khí hóa được Bàng quang để ức chế Tâm, làm Tâm dương vượng lên.", signs: "Chóng mặt, hoa mắt, ù tai, bốc hỏa mặt; mất ngủ, hồi hộp, giảm trí nhớ; bứt rứt; miệng họng khô nóng; nước tiểu sậm ít; đạo hãn, triều nhiệt; di tinh; lưng gối mỏi; lạnh 2 chân; mạch tế sác." },
    { name: "Tâm Tỳ hư", cause: "Ăn uống kém; xuất huyết nhiều → Tâm huyết hư → nuôi Tỳ kém → Tỳ khí hư (hoặc chiều ngược lại); thất tình.", signs: "Hồi hộp đánh trống ngực; ngủ ít, hay mơ, hay quên; mệt mỏi yếu sức; ăn kém ngon, bụng đầy; cầu lỏng; lưỡi nhạt bệu; mạch tế nhược." },
    { name: "Tiểu trường hư hàn", cause: "Hư hàn phạm Tiểu trường.", signs: "Đau bụng âm ỉ thích xoa nắn, sôi ruột tiêu chảy; tiểu nhiều trong dài; tay chân mệt mỏi lạnh không sức; cầu lỏng; lưỡi nhạt bệu rêu trắng mỏng; mạch tế nhược." },
  ]);

  // ================= THẬN - BÀNG QUANG =================
  await addPatterns(source, [
    { name: "Thận âm hư", cause: "Thận âm suy giảm không nuôi dưỡng được cơ thể, sinh hư nhiệt.", signs: "Người gầy, đau lưng mỏi gối, ù tai, răng lung lay, rối loạn kinh nguyệt/di tinh/mộng tinh; sốt về chiều, đạo hãn, lòng bàn tay chân nóng; lưỡi đỏ họng khô; mạch trầm tế sác." },
    { name: "Thận khí bất túc", cause: "Thận chủ bế tàng và nạp khí suy giảm.", signs: "Di/hoạt tinh, liệt dương, kinh đến sớm; tiểu nhiều lần, tiểu không tự chủ, tiểu trong; mệt mỏi, chóng mặt, tai ù, mắt kém, đau mỏi lưng; khó thở (hít ngắn thở dài); tự hãn, sợ lạnh; dễ tiêu chảy; lưỡi bệu rêu trắng mỏng; mạch trầm vô lực." },
    { name: "Thận dương hư — thủy tràn", cause: "Thận không khí hóa được Bàng quang, kèm triệu chứng Thận khí bất túc.", signs: "Sợ lạnh, tay chân lạnh, lạnh bụng dưới; phù chân/toàn thân; tiểu ít nước tiểu trong; phân lỏng." },
    { name: "Tâm Thận dương hư", cause: "Dương hư ảnh hưởng đồng thời Tâm và Thận.", signs: "Tay chân lạnh, sợ lạnh, mệt mỏi (dương hư); di tinh, hoạt tinh, liệt dương, lãnh cảm (Thận dương hư); trầm cảm, nói khó, hồi hộp, ngủ kém (Tâm dương hư); lưỡi bệu rêu trắng mỏng; mạch trầm trì vô lực." },
    { name: "Tỳ Thận dương hư", cause: "Dương hư ảnh hưởng đồng thời Tỳ và Thận.", signs: "Triệu chứng Thận dương hư kèm: tiêu chảy lúc mờ sáng (ngũ canh tả), tiêu phân sống, trướng bụng, lạnh bụng đau âm ỉ, chườm ấm dễ chịu." },
    { name: "Can Thận âm hư (Thận-Bàng quang)", cause: "Âm hư đồng thời ở Can và Thận.", signs: "Triệu chứng nội nhiệt + Thận âm hư kèm: đau đầu vùng đỉnh căng, bứt rứt run khó ngủ, mắt nhìn kém (triệu chứng Can âm hư)." },
    { name: "Bàng quang hư hàn", cause: "Thận dương hư dẫn đến Bàng quang bất cố.", signs: "Triệu chứng Thận dương hư kèm: tiểu són, tiểu dầm, tiểu lắt nhắt, dòng nước tiểu rỉ rỉ." },
  ]);

  // ================= CAN - ĐỞM =================
  await addPatterns(source, [
    { name: "Can âm hư", cause: "Bệnh nội thương tính nhiệt tổn thương Can âm (Thận âm hư...); Can khí uất hóa hỏa; ăn uống đồ cay nóng; thuốc nhiệt; tiên thiên Can âm bất túc.", signs: "Đau đầu (đỉnh); hoa mắt chóng mặt nhìn kém; triều nhiệt, đạo hãn; đau vùng hông sườn; rối loạn kinh nguyệt; lưỡi đỏ; mạch tế sác." },
    { name: "Can huyết hư", cause: "Huyết hư toàn thân → Can huyết hư; Can âm hư → Can huyết hư; cường kinh; lao lực quá độ.", signs: "Sắc mặt nhợt, niêm nhợt; hoa mắt chóng mặt, mắt khô nhìn kém; kinh ít, vô kinh; mệt mỏi; ngủ kém; phiền nhiệt; lưỡi nhợt bệu; mạch tế sác." },
    { name: "Can dương xung", cause: "Can âm hư; Thận âm hư → Can âm hư.", signs: "Đau đầu, chóng mặt, nóng phừng mặt, mắt đỏ, nóng trong người; hay mơ; ma mộc (tê dại); run, dễ bị kích thích; ù tai, mắt mờ; họng khô; lưỡi khô rìa đỏ; mạch huyền sác." },
    { name: "Can khí uất", cause: "Tình chí uất ức làm Can khí sơ tiết kém.", signs: "Tình chí uất ức, phiền muộn; tức ngực, đau mạng sườn/bụng dưới; hay than thở; mai hạch khí; đau nhức cổ gáy; nữ căng đau tuyến vú, đau bụng kinh, rối loạn kinh nguyệt có khi bế kinh; mạch huyền." },
    { name: "Can phong nội động", cause: "Can âm hư, Can huyết hư, Thận âm hư → Can âm hư, Can khí uất, Can hỏa vượng.", signs: "Đau đầu, hoa mắt chóng mặt, mặt đỏ; ù tai; nói khó/không được, lưỡi run hoặc co cứng; tay chân yếu có thể co rút/run; lơ mơ đến hôn mê; mạch huyền tế." },
    { name: "Can hỏa thượng viêm", cause: "Can khí uất hóa hỏa; Can dương vượng; Can âm hư.", signs: "Sốt, cảm giác nóng, mặt đỏ, mắt đỏ, hai gò má đỏ; bứt rứt dễ kích động; hoa mắt chóng mặt; ù tai; nục huyết/thổ huyết; đau tức hông sườn; lưỡi đỏ; mạch huyền sác." },
    { name: "Can Tỳ Vị bất hòa", cause: "Can khí uất làm Tỳ khí hư.", signs: "Bứt rứt bực bội dễ kích thích; nhớt dính cổ họng; miệng đắng, ăn kém ngon; đau thượng vị; ợ hơi nôn ói; trung tiện thấy dễ chịu; đau tức hông sườn; đau bụng kinh; mạch huyền." },
    { name: "Can Thận âm hư (Can-Đởm)", cause: "Thận tinh hao tổn; bệnh tính nhiệt lâu ngày tổn thương phần âm Can Thận; lao lực quá độ; dùng thuốc tính nhiệt; lão suy.", signs: "Đau mỏi thắt lưng gối; nóng trong người, đạo hãn, ngũ tâm phiền nhiệt, họng khô; đau căng đầu vùng đỉnh; bứt rứt run; ngủ kém; ù tai; di mộng tinh, rối loạn kinh nguyệt; lưỡi đỏ; mạch tế sác." },
    { name: "Đởm khí bất túc", cause: "Bệnh nội thương Can; Can âm hư; ảnh hưởng công năng quyết đoán của Đởm; tình chí thất điều.", signs: "Đau đầu, hoa mắt, chóng mặt, nhìn kém, giảm thị lực; sốt về chiều, cảm giác nóng, ra mồ hôi trộm; dễ kinh sợ, dễ cáu gắt, do dự, hoạt động trí óc giảm; rối loạn kinh nguyệt, đau hông sườn; lưỡi đỏ bệu; mạch tế sác vô lực." },
  ]);

  // ================= TỲ - VỊ =================
  await addPatterns(source, [
    { name: "Tỳ khí hư", cause: "Tạng người yếu, làm việc quá sức, ăn uống kém.", signs: "Ăn uống kém, người mệt mỏi vô lực, hơi thở ngắn, ngại nói, sắc mặt vàng. Tỳ mất kiện vận: bụng đầy, đại tiện lỏng, chất lưỡi nhạt bệu, rêu trắng, mạch hư. Tỳ hư hạ hãm: ỉa chảy, sa trực tràng/dạ con/dạ dày, trĩ, lưỡi nhợt, mạch hư nhược. Tỳ không thống huyết: đại tiện ra máu, kinh nguyệt quá nhiều, rong kinh, lưỡi nhạt, mạch hư nhược. Pháp điều trị: kiện Tỳ ích khí, ích khí thăng đề, kiện Tỳ nhiếp huyết." },
    { name: "Tỳ dương hư", cause: "Tỳ khí hư tiến triển, dương khí suy giảm.", signs: "Bụng lạnh đau, chườm nóng đỡ đau, đại tiện lỏng, người lạnh, chân tay lạnh, lưỡi nhạt rêu trắng, mạch trầm trì. Pháp điều trị: ôn trung kiện Tỳ." },
  ]);

  console.log("Đã thêm ~35 hội chứng bệnh tạng phủ (Phế-ĐT, Tâm-TT, Thận-BQ, Can-Đởm, Tỳ-Vị).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
