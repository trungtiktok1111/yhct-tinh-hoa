import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createPattern(
  sourceId: string,
  name: string,
  description: string,
  supportCriteria: string,
  keySigns: string
) {
  const existing = await prisma.pattern.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existing) {
    console.log(`Bỏ qua (đã tồn tại): ${name}`);
    return;
  }
  await prisma.pattern.create({
    data: { name, description, supportCriteria, keySigns, status: "DRAFT", sourceId },
  });
  console.log(`Đã thêm: ${name}`);
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Chẩn đoán học Y học cổ truyền",
      sourceType: "Giáo trình",
      authorOrOrg: "Đại học Y Dược TP. Hồ Chí Minh",
      locator: "321 trang — Chương 3: Biện Chứng, phần Tạng Phủ Biện Chứng (Tâm-Tiểu trường, Phế-Đại trường)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  // TÂM VÀ TIỂU TRƯỜNG
  await createPattern(sid, "Tâm khí hư",
    "Dương khí tạng tâm hư suy, chức năng hoạt động toàn thân giảm. Do bệnh lâu cơ thể suy, bạo bệnh thương chính khí, bẩm phú bất túc, cao niên tạng khí hư.",
    "Tâm quý chính xung, tức ngực, khí đoản tăng sau vận động, sắc mặt trắng nhạt/nhợt, tự hạn, lưỡi nhạt rêu trắng, mạch hư.",
    "Tâm quý; khí đoản tăng khi vận động; mạch hư vô lực");

  await createPattern(sid, "Tâm dương hư",
    "Trên cơ sở tâm khí hư xuất hiện thêm triệu chứng hư hàn. Dương khí tạng tâm không đủ ôn húc cơ thể.",
    "Tâm quý chính xung kèm úy hàn chi lạnh, tâm thống, lưỡi nhạt bệu, rêu trắng hoạt, mạch vi tế.",
    "Tâm thống + úy hàn chi lạnh; mạch vi tế");

  await createPattern(sid, "Tâm dương bạo thoát",
    "Trên cơ sở tâm dương hư xuất hiện hư thoát vong dương — chứng nguy kịch. Dương khí suy vong đột ngột không thể vệ ngoại, ôn húc, cố nhiếp cơ thể.",
    "Đột nhiên mồ hôi lạnh lâm ly, tứ chi quyết lãnh, hô hấp vi nhỏ, sắc mặt trắng nhợt, môi miệng xanh tím, thần trí mơ hồ hoặc hôn mê.",
    "Mồ hôi lạnh đầm đìa + tứ chi quyết lãnh + hôn mê — cấp cứu");

  await createPattern(sid, "Tâm huyết hư",
    "Tâm huyết bất túc không nhu dưỡng tạng tâm. Do bệnh lâu hao âm huyết, mất máu nhiều, âm huyết sinh không đủ, tình chí bất toại hao âm huyết.",
    "Tâm quý chính xung, mất ngủ mơ nhiều, chóng mặt hay quên, sắc mặt trắng nhạt không tươi hoặc vàng héo, môi miệng nhợt, lưỡi trắng nhạt, mạch tế nhược.",
    "Tâm quý mất ngủ + chóng mặt hay quên + mạch tế nhược (khác tâm âm hư ở không có nhiệt tượng)");

  await createPattern(sid, "Tâm âm hư",
    "Tâm âm khuy hư không nhu dưỡng tạng tâm, kèm hư nhiệt nội sinh.",
    "Tâm quý chính xung, mất ngủ mơ nhiều, kèm ngũ tâm phiền nhiệt, triều nhiệt, đạo hạn, lưỡng quyền đỏ, lưỡi đỏ ít tân, mạch tế sác.",
    "Tâm quý mất ngủ + ngũ tâm phiền nhiệt/triều nhiệt/đạo hạn + mạch tế sác (khác tâm huyết hư ở có nhiệt tượng)");

  await createPattern(sid, "Tâm hỏa kháng thịnh",
    "Tâm hỏa nội tích (thực chứng). Do thất tình uất kết hóa hỏa, hỏa nhiệt nội uẩn, hoặc ghiền đồ béo/thuốc lá/rượu lâu ngày hóa nhiệt.",
    "Tâm (ngực) phiền nhiệt, đêm trằn trọc khó ngủ, mặt đỏ, khát, tiểu vàng, táo bón, chót lưỡi đỏ thẫm hoặc lở loét đau rát, mạch sác hữu lực; hoặc cuồng thao chiêm ngữ, thổ huyết nục huyết, nhọt lở ngoài da sưng nóng đỏ đau.",
    "Chót lưỡi đỏ thẫm lở đau + phiền nhiệt mất ngủ + mạch sác hữu lực (thực, khác tâm âm hư là hư)");

  await createPattern(sid, "Tâm mạch tý trở",
    "Mạch lạc tạng tâm tý trở không thông, trên nền chính khí hư (bản hư tiêu thực). Do tuổi cao/bệnh lâu chính khí hư dẫn đến huyết ứ, đàm ngưng, hàn trệ, khí uất.",
    "Tâm quý chính xung, tâm hung nghẹt tức đau lan lưng vai và mặt trong cánh tay, lúc phát lúc nghỉ. Phân 4 thể: đau như châm (huyết ứ, lưỡi tím ứ điểm, mạch tế sáp/kết đại), đau tức kèm đàm nhiều thể mập (đàm trở, rêu trắng nê mạch trầm hoạt), đau dữ dội bạo phát gặp ấm giảm (hàn ngưng, mạch trầm trì/khẩn), đau trướng liên quan tình chí (khí trệ, mạch huyền).",
    "Đau ngực lan vai/cánh tay trong, lúc phát lúc nghỉ — cần phân biệt 4 thể ứ/đàm/hàn/khí (có thể kết hợp)");

  await createPattern(sid, "Đàm mê tâm khiếu",
    "Đàm trọc mông bịt tâm khiếu. Do thấp trọc ủ thành đàm hoặc tình chí bất toại khí uất sinh đàm.",
    "Sắc mặt ám trệ, tức bụng buồn nôn, ý thức mơ hồ, khò khè trong họng, nặng thì mê bất tỉnh, rêu trắng nê, mạch hoạt. Thể điên (can khí uất kết + đàm): tinh thần uất ức, thần trí ngây ngô, lẩm bẩm, động tác thất thường. Thể giản (đàm phục theo can phong): đột ngột té ngã bất tỉnh, sùi bọt mép, mắt trợn ngược, tay chân co quắp, tiếng kêu dị thường.",
    "Thần trí không tỉnh + khò khè đàm + rêu trắng nê mạch hoạt; phân biệt điên (đàm trọc) và giản (đàm theo can phong)");

  await createPattern(sid, "Đàm hỏa nhiễu tâm",
    "Đàm hỏa nhiễu loạn tâm thần. Do kích thích tinh thần/uất nộ hóa hỏa luyện đàm, hoặc ngoại cảm nhiệt tà chước dịch thành đàm.",
    "Ngoại cảm: sốt, hơi thở thô, mặt mắt đỏ, đàm vàng đặc, đàm minh, cuồng thao chiêm ngữ, rêu vàng nê mạch hoạt sác. Nội thương: mất ngủ tâm phiền tức ngực đàm nhiều, hoặc cuồng chứng (lời nói thác loạn, cười khóc vô thường, đập phá sức mạnh vô cùng).",
    "Sốt cao + đàm thịnh + thần chí không tỉnh (ngoại cảm); mất ngủ/tâm phiền nhẹ đến cuồng loạn nặng (nội thương)");

  await createPattern(sid, "Tiểu trường thực nhiệt",
    "Nhiệt tích thịnh trong tiểu trường, đa số do tâm nhiệt hạ di (tâm và tiểu trường biểu lý).",
    "Tâm phiền khát, miệng lưỡi lở nhọt, tiểu đỏ sáp nóng rát niệu đạo, tiểu máu, lưỡi đỏ rêu vàng, mạch sác.",
    "Tâm phiền + tiểu đỏ sáp đau rát (liên hệ tâm-tiểu trường biểu lý)");

  // PHẾ VÀ ĐẠI TRƯỜNG
  await createPattern(sid, "Phế khí hư",
    "Chức năng hoạt động của phế giảm yếu. Do bệnh lâu suyễn khái hoặc sinh khí bất túc.",
    "Ho suyễn vô lực, khí thiểu không đủ, động là tăng hụt hơi, đàm trong loãng, tiếng nói nhỏ khẽ, sắc mặt trắng nhạt/nhợt, tự hạn úy phong dễ cảm, lưỡi nhạt rêu trắng, mạch hư.",
    "Ho suyễn vô lực + khí thiểu + dễ cảm mạo (vệ khí hư) + mạch hư");

  await createPattern(sid, "Phế âm hư",
    "Phế âm bất túc, hư nhiệt nội sinh. Do ho lâu tổn âm, trùng lao xâm phế, hoặc nhiệt bệnh thời kỳ sau âm tân tổn thương.",
    "Ho không đàm hoặc đàm ít dính, miệng hầu khô táo, hình thể gầy, triều nhiệt về chiều, ngũ tâm phiền nhiệt, đạo hạn, quyền hồng, nặng thì đàm lẫn máu, tiếng khản, lưỡi đỏ ít tân, mạch tế sác.",
    "Ho khan đàm ít dính + triều nhiệt/đạo hạn + lưỡi đỏ ít tân mạch tế sác");

  await createPattern(sid, "Phong hàn thúc phế",
    "Cảm phong hàn, phế khí bị thúc trói. Lấy ho làm chủ chứng kèm phong hàn biểu chứng (thường nhẹ).",
    "Ho đàm loãng trắng, nghẹt mũi chảy nước mũi trong, hơi ố hàn, sốt nhẹ không mồ hôi, rêu trắng, mạch phù khẩn.",
    "Ho là chủ chứng + biểu chứng phong hàn nhẹ (khác phong hàn biểu chứng lấy ố hàn sốt làm chủ chứng, ho nhẹ hoặc không có)");

  await createPattern(sid, "Hàn tà khách phế",
    "Hàn tà nội khách tại phế, khởi phát cấp tính không có tiền sử, thuộc thực chứng. Khác ẩm đình tại phế (mạn tính, bản hư tiêu thực, đàm nhiều như bọt nước) và phong hàn thúc phế (ho nhẹ, biểu chứng rõ).",
    "Ho khí suyễn đột nhiên phát tác, đàm loãng trắng (lượng ít), hình hàn chi lạnh, không sốt, bệnh trình tương đối dài trong cơn, lưỡi nhạt rêu trắng, mạch trì hoãn.",
    "Ho suyễn đột phát + hình hàn chi lạnh + không sốt + đàm ít loãng trắng (phân biệt ẩm đình tại phế: đàm nhiều như bọt, mạn tính tái phát theo mùa)");

  await createPattern(sid, "Đàm thấp trở phế",
    "Đàm thấp trở trệ phế hệ, gặp cả cấp và mạn (mạn nhiều hơn). Do tỳ khí hư, ho lâu thương phế, hoặc ngoại cảm hàn thấp.",
    "Ho đàm nhiều, đàm trắng dính dễ khạc, tức ngực, nặng thì khí suyễn đàm minh, lưỡi nhạt rêu trắng nê, mạch hoạt.",
    "Ho đàm nhiều dính dễ khạc + tức ngực + rêu trắng nê mạch hoạt");

  await createPattern(sid, "Phong nhiệt phạm phế",
    "Phong nhiệt xâm phạm phế hệ, vệ khí bị bệnh. Thuộc ngoại cảm nhiệt bệnh, nhẹ, dự hậu tốt.",
    "Ho đàm đặc vàng, nghẹt mũi chảy nước mũi vàng đục, sốt, hơi ố phong hàn, miệng khô họng đau, đầu lưỡi đỏ, rêu mỏng vàng, mạch phù sác.",
    "Ho + đàm vàng đặc + biểu chứng phong nhiệt (sốt nhẹ, ố phong) + mạch phù sác");

  await createPattern(sid, "Nhiệt tà úng phế",
    "Nhiệt tà nội úng phế kim (bệnh tại lý), bệnh trình nặng kéo dài hơn phong nhiệt phạm phế. Do ôn nhiệt tà nhập qua miệng mũi, hoặc phong hàn/phong nhiệt nhập lý hóa nhiệt.",
    "Ho đàm đặc vàng, khí suyễn hơi thở thô, sốt cao khát, phiền thao bất an, nặng thì cánh mũi phập phồng (nguy kịch), chảy máu cam/khạc máu, hoặc đau ngực dữ dội khạc đàm mủ tanh hôi, đại tiện khô táo tiểu ngắn đỏ, lưỡi đỏ rêu vàng, mạch hoạt sác.",
    "Sốt cao + ho đàm vàng đặc + khí suyễn thở thô (lý nhiệt nặng, khác phong nhiệt phạm phế là biểu nhẹ); cánh mũi phập phồng là dấu hiệu nguy kịch");

  await createPattern(sid, "Táo tà phạm phế",
    "Mùa thu cảm táo tà xâm phạm phế vệ, biểu hiện khô táo ít tân là đặc trưng. Chia lương táo (giống hàn) và ôn táo (giống nhiệt).",
    "Ho khan không đàm hoặc đàm ít dính khó khạc, môi lưỡi hầu mũi khô, hoặc sốt ố hàn (lương táo) hoặc sốt kèm khát (ôn táo), hoặc đau ngực khạc máu nếu táo hóa hỏa, lưỡi đỏ rêu trắng hoặc vàng, mạch sác.",
    "Ho khan + khô táo toàn thân (môi/lưỡi/hầu/mũi) là đặc trưng chẩn đoán chính");

  await createPattern(sid, "Đại trường thấp nhiệt",
    "Thấp nhiệt xâm tập đại trường. Do cảm thấp nhiệt ngoại tà hoặc ẩm thực bất tiết.",
    "Đau bụng, hạ lợi xích bạch (kiết lỵ nhầy máu) lý cấp hậu trọng, hoặc bạo hạ tiết màu vàng hôi, nóng rát hậu môn, tiểu ngắn đỏ, khát, có thể kèm ố hàn sốt hoặc chỉ sốt, lưỡi đỏ rêu vàng nê, mạch nhu sác hoặc hoạt sác.",
    "Hạ lợi xích bạch/lý cấp hậu trọng + nóng rát hậu môn + rêu vàng nê (thấp nặng hơn nhiệt: mạch nhu sác; nhiệt nặng hơn thấp: mạch hoạt sác)");

  await createPattern(sid, "Đại trường dịch khuy",
    "Tân dịch bất túc, không nhu nhuận đại trường. Do tố thể âm khuy, bệnh lâu thương âm, sau nhiệt bệnh tân dịch chưa hồi, hoặc sản hậu mất máu nhiều.",
    "Đại tiện táo kết khô khó đi (vài ngày đến cả chục ngày một lần), miệng khô họng táo, có thể miệng hôi chóng mặt, lưỡi đỏ ít tân, mạch tế sáp.",
    "Táo bón mạn tính kiểu 'thói quen' + miệng khô họng táo + lưỡi đỏ ít tân (khác thực nhiệt táo bón ở không có nhiệt tượng rõ)");

  await createPattern(sid, "Trường hư hoạt tả",
    "Đại trường dương khí hư suy không cố nhiếp. Do tiêu chảy/lỵ lâu ngày không khỏi.",
    "Tiêu chảy vô độ hoặc đại tiện không tự chủ, nặng thì thoát giang, bụng đau âm ỉ thích ấm thích án, lưỡi nhạt rêu trắng hoạt, mạch trầm nhược.",
    "Đại tiện không tự chủ/thoát giang + bụng đau thích ấm thích án + mạch trầm nhược (dương hư)");

  console.log("Đã xử lý xong các chứng hầu Tâm-Tiểu trường, Phế-Đại trường (Tạng Phủ Biện Chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
