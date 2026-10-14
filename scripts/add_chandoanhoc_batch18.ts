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
      locator: "321 trang — Chương 3: Biện Chứng, phần Tạng Phủ Kiêm Chứng",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createPattern(sid, "Tâm thận bất giao",
    "Tâm thận thủy hỏa ký tế thất điều (thủy khuy dưới, hỏa tích trên). Do bệnh lâu thương âm, phòng sự bất tiết, tư lự uất mà hóa hỏa, hoặc ngoại cảm nhiệt bệnh tâm hỏa độc kháng.",
    "Tâm phiền mất ngủ, tâm quý bất an, chóng mặt ù tai, hay quên, mỏi lưng di tinh, ngũ tâm phiền nhiệt, họng miệng khô táo, lưỡi đỏ, mạch tế sác; có thể kèm lưng chân mỏi lạnh (nếu kèm thận dương hư ở dưới).",
    "Mất ngủ + tâm hỏa kháng (phiền nhiệt/di tinh) + thận thủy hư (lưng mỏi/ù tai) — 'thủy khuy hỏa vượng'");

  await createPattern(sid, "Tâm tỳ lưỡng hư",
    "Tâm huyết bất túc, tỳ khí suy nhược (hai tạng ảnh hưởng qua lại: tỳ không sinh huyết đủ → tâm huyết hư; tâm huyết hư → khí cũng suy → tỳ khí suy). Do bệnh lâu, lao lực suy nghĩ nhiều, hoặc mất máu mạn.",
    "Tâm quý chính xung, mất ngủ mơ nhiều, hoa mắt chóng mặt hay quên, sắc mặt vàng úa, ăn không ngon, bụng trướng tiêu phân lỏng, tinh thần uể oải, có thể xuất huyết dưới da, phụ nữ kinh ít sắc nhạt rỉ rả không dứt, lưỡi nhạt nộn, mạch tế nhược.",
    "Tâm huyết hư (tâm quý mất ngủ) + Tỳ khí hư (ăn kém tiêu lỏng) cùng xuất hiện");

  await createPattern(sid, "Tâm can huyết hư",
    "Hai tạng tâm can huyết dịch hư suy (tâm chủ huyết, can tàng huyết — tâm huyết hư thì can vô sở tàng). Do bệnh lâu cơ thể suy, hoặc tư lự quá độ hao huyết.",
    "Tâm quý hay quên, mất ngủ mộng nhiều, chóng mặt ù tai, sắc mặt trắng không tươi, hai mắt khô rát thị lực giảm, móng tay chân không tươi bóng, tay chân tê dại run co thắt, phụ nữ kinh ít sắc nhạt thậm chí bế kinh, lưỡi nhạt rêu trắng, mạch tế nhược.",
    "Triệu chứng tâm bệnh (tâm quý mất ngủ) + can bệnh (mắt khô/móng khô/tay chân tê run) + huyết hư toàn thân");

  await createPattern(sid, "Tâm thận dương hư",
    "Dương khí tâm thận hư suy, âm hàn nội thịnh, huyết hành ứ trệ, thủy khí nội đình. Do bệnh lâu không khỏi hoặc lao lực nội thương.",
    "Tâm quý chính xung, úy hàn chi quyết lãnh, thần trí mông lung muốn ngủ hoài, tiểu không thông, phù mặt phù chi (chi rõ hơn), môi móng nhạt tối hoặc xanh tím, lưỡi nhạt ám hoặc xanh tím, rêu trắng hoạt, mạch trầm vi tế.",
    "Tâm dương hư (tâm quý úy hàn) + thận dương hư (tiểu không thông, phù) + huyết ứ trệ (môi móng tím)");

  await createPattern(sid, "Tâm phế khí suy",
    "Khí tâm phế đều suy (tông khí thúc đẩy cả hai, hư một ảnh hưởng cái còn lại). Do ho suyễn lâu hao khí, hoặc bẩm phú bất túc/tuổi cao.",
    "Tâm quý ho suyễn, khí đoản mệt mỏi vô lực, động là tăng ho mệt tức ngực, đàm trong loãng, sắc mặt nhợt nhạt, hoa mắt tinh thần uể oải, tự hạn tiếng nói nhỏ, lưỡi nhạt rêu trắng, mạch trầm tế hoặc kết đại.",
    "Tâm quý + ho suyễn cùng xuất hiện + khí hư toàn thân (khác tỳ phế khí hư ở không có triệu chứng tiêu hóa)");

  await createPattern(sid, "Tỳ phế khí hư",
    "Khí tỳ phế đều suy (tỳ không đưa tinh vi lên phế → phế khí suy; 'tỳ là nguồn sinh đàm, phế là nơi tàng đàm'). Do ho suyễn lâu phế hư cập tỳ, hoặc ẩm thực/lao quyện thương tỳ.",
    "Ho lâu không giảm, khí đoản như suyễn, đàm nhiều trắng loãng, ăn uống không ngon, bụng trướng tiêu chảy, tiếng nói nhỏ lười nói, mệt mỏi vô lực, sắc mặt nhợt nhạt, nặng thì mặt phù, lưỡi nhạt rêu trắng, mạch tế nhược.",
    "Ho suyễn + ăn kém bụng trướng tiêu chảy cùng xuất hiện (khác tâm phế khí hư ở có triệu chứng tiêu hóa rõ)");

  await createPattern(sid, "Tỳ thận dương hư",
    "Dương khí tỳ thận đều tổn thương (tương hỗ tư sinh: tỳ dương hư lâu không sinh dưỡng thận dương, hoặc thận dương hư không ôn tỳ dương). Do bệnh lâu hao dương, tiêu chảy mạn, hoặc thủy tà nhập chiếm lâu ngày.",
    "Sắc mặt nhợt nhạt, úy hàn chi lạnh, lưng gối/bụng dưới đau lạnh, tiêu chảy/lỵ mãn hoặc ngũ canh tiết tả hoặc tiêu phân sống, tiểu không thông, mặt phù chi sưng, nặng thì bụng trướng to như trống, lưỡi nhạt bệu rêu trắng hoạt, mạch trầm tế.",
    "Lưng gối + bụng dưới đau lạnh + tiêu chảy mạn (ngũ canh tả) + phù thũng — dương hư cả 2 tạng");

  await createPattern(sid, "Phế thận âm hư",
    "Âm dịch phế thận hỗ tương tư dưỡng thất điều ('Kim thủy tương sinh'). Do ho lâu tổn phế âm cập thận, hoặc thận âm hư/phòng sự quá độ thận hư cập phế.",
    "Ho ít đàm hoặc đàm lẫn máu, miệng họng khô táo, có thể khàn tiếng, hình thể gầy gò, lưng gối mỏi mềm, cốt chưng triều nhiệt, lưỡng quyền đỏ đạo hạn, nam di tinh nữ kinh không đều, lưỡi đỏ ít rêu, mạch tế sác.",
    "Ho đàm máu/khàn tiếng (phế âm hư) + lưng gối mỏi/di tinh (thận âm hư) cùng xuất hiện");

  await createPattern(sid, "Can thận âm hư",
    "Âm dịch can thận tương hỗ tư sinh thất điều ('Can thận đồng nguyên' — thịnh cùng thịnh, suy cùng suy). Do bệnh lâu khí cơ thất điều, hoặc phòng sự bất tiết/tình chí nội thương.",
    "Hoa mắt chóng mặt ù tai hay quên, mất ngủ mơ nhiều, họng miệng khô táo, lưng gối mềm yếu, ngũ tâm phiền nhiệt, đau sườn, quyền đỏ đạo hạn, nam di tinh nữ kinh ít, lưỡi đỏ ít rêu, mạch tế sác.",
    "Đau sườn (can âm hư) + lưng gối mỏi/di tinh (thận âm hư) + ù tai hay quên — khác phế thận âm hư ở có đau sườn can bệnh");

  await createPattern(sid, "Can tỳ bất điều",
    "Can thất sơ tiết ảnh hưởng tỳ vận hóa ('mộc hằng vũ thổ') hoặc ngược lại ('thổ úng vũ mộc'). Do tình chí bất toại uất nộ thương can, hoặc ẩm thực/lao quyện thương tỳ.",
    "Ngực sườn đau tức lan xuyên, thích thở dài, tình chí uất ức nóng nảy dễ nộ, chán ăn bụng trướng, tiêu phân lỏng bất sảng, sôi ruột trung tiện, hoặc đau bụng mót đi cầu đi xong giảm đau, rêu trắng nê, mạch huyền.",
    "Ngực sườn trướng đau (can uất) + ăn ít bụng trướng tiêu lỏng (tỳ hư) + mạch huyền");

  await createPattern(sid, "Can vị bất hòa",
    "Can thất sơ tiết, vị bất hòa giáng — 2 thể: can uất hóa hỏa phạm vị (thực nhiệt) hoặc hàn tà nội phạm can vị (hàn). Do tình chí uất hóa hỏa hoặc hàn tà nội phạm.",
    "Thể hỏa: bụng sườn trướng đau, ợ hơi nấc cụt, tào tạp ợ chua, phiền thao dễ nộ, lưỡi đỏ rêu vàng, mạch huyền/đới sác. Thể hàn: đau đỉnh đầu tăng khi lạnh giảm khi ấm, nôn bọt dãi, hình hàn chi lạnh, lưỡi nhạt rêu trắng hoạt, mạch trầm huyền khẩn.",
    "Bụng sườn trướng đau + ợ hơi/nấc cụt/nôn (vị khí nghịch) — phân biệt thể hỏa (ợ chua, rêu vàng) và thể hàn (nôn bọt dãi, đau đỉnh đầu)");

  await createPattern(sid, "Can hỏa phạm phế",
    "Can khí thăng phát thái quá, khí hỏa thượng nghịch theo kinh phạm phế (can thăng phát + phế túc giáng mất cân bằng). Do uất nộ thương can hoặc can kinh nhiệt tà thượng nghịch.",
    "Ngực sườn chước thống (đau nóng), nóng nảy dễ cáu, mắt đỏ miệng đắng, ho từng cơn, phiền nhiệt hoa mắt, đàm dính ít màu vàng, thậm chí ho ra máu, lưỡi đỏ rêu mỏng vàng, mạch huyền sác.",
    "Ngực sườn đau nóng + mắt đỏ miệng đắng (can hỏa) + ho đàm vàng ít dính (phạm phế) + mạch huyền sác");

  console.log("Đã xử lý xong Tạng Phủ Kiêm Chứng — hoàn tất toàn bộ Tạng Phủ Biện Chứng.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
