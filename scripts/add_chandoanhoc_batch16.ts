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
      locator: "321 trang — Chương 3: Biện Chứng, phần Tạng Phủ Biện Chứng (Can-Đởm)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createPattern(sid, "Can khí uất kết",
    "Can thất sơ tiết, khí cơ uất trệ. Do tình chí uất ức hoặc tinh thần bị kích thích dữ dội.",
    "Ngực sườn/thiếu phúc trướng tức đau lan xuyên, tức ngực thích thở dài, tinh thần uất ức dễ cáu, có thể dị cảm trong họng (mai hạch khí), bướu cổ, hà chứng (u cục bụng); phụ nữ đau căng nhũ phòng, thống kinh, kinh không đều/bế kinh.",
    "Trướng đau vùng can kinh đi qua (ngực sườn/thiếu phúc) + tình chí uất ức dễ cáu + liên quan rõ đến cảm xúc");

  await createPattern(sid, "Can hỏa thượng viêm",
    "Can kinh khí hỏa thượng nghịch (thực hỏa). Do tình chí bất toại can uất hóa hỏa hoặc nhiệt tà nội phạm.",
    "Hoa mắt căng trướng đầu, mặt mắt đỏ, miệng đắng khô, nóng nảy dễ cáu, mất ngủ/ác mộng, sườn chước thống (đau nóng), đại tiện khô tiểu vàng, tai ù hoặc đau sưng chảy mủ tai, có thể thổ huyết nục huyết, lưỡi đỏ rêu vàng, mạch hoạt sác.",
    "Thực hỏa tích thịnh vùng can kinh đi qua (đầu/mắt/tai/sườn) + mạch hoạt sác (thực nhiệt, khác can âm hư là hư nhiệt)");

  await createPattern(sid, "Can huyết hư",
    "Tạng can huyết dịch khuy hư. Do tỳ thận khuy hư nguồn sinh hóa bất túc, bệnh mạn hao huyết, hoặc mất máu nhiều.",
    "Hoa mắt ù tai, mặt trắng không tươi, móng không bóng, ngủ mơ nhiều, thị lực giảm/quáng gà, tay chân tê dại/khớp co cứng/run máy cơ (hư phong nội động), phụ nữ kinh nhiều sắc nhạt thậm chí bế kinh, lưỡi nhạt rêu trắng, mạch huyền tế.",
    "Cân/mạch/móng/mắt mất nhu dưỡng của huyết + triệu chứng huyết hư toàn thân + mạch huyền tế");

  await createPattern(sid, "Can âm hư",
    "Âm dịch can tạng khuy hư (hư nhiệt, khác can hỏa thượng viêm là thực nhiệt). Do tình chí uất hóa hỏa, can bệnh, hoặc ôn nhiệt bệnh hao can âm.",
    "Hoa mắt ù tai, hai mắt khô rát, đỏ hồng vùng mặt, sườn đau trướng, triều nhiệt đạo hạn, miệng khô họng táo, có thể tay chân run nhẹ, lưỡi đỏ ít tân, mạch huyền tế sác.",
    "Nhiệt tượng can bệnh dạng hư (triều nhiệt/đạo hạn) + lưỡi đỏ ít tân + mạch huyền tế sác (hư nhiệt)");

  await createPattern(sid, "Can dương thượng kháng",
    "Thủy bất hàm mộc, can dương thiên kháng (can thận âm hư ở dưới, dương kháng ở trên — 'thượng thịnh hạ hư'). Do can thận âm hư, can dương thất tiềm, hoặc giận dữ/suy nghĩ nhiều hao âm.",
    "Chóng mặt ù tai, đầu mắt đau tức trướng, mặt mắt đỏ, nóng nảy dễ giận, tâm quý hay quên, mất ngủ mơ nhiều, lưng gối mỏi mềm, đầu nặng chân nhẹ, lưỡi đỏ mạch huyền hữu lực hoặc huyền tế sác.",
    "Đầu nặng chân nhẹ (thượng thịnh hạ hư) + lưng gối mỏi mềm (thận âm hư ở dưới) + chóng mặt đầu đau (can dương kháng ở trên)");

  await createPattern(sid, "Can dương hóa phong",
    "Can dương kháng nghịch không chế ngự được, phát triển từ can dương thượng kháng — nguy cơ trúng phong. Do can thận âm hư lâu dẫn can dương thất tiềm mà bạo phát.",
    "Chóng mặt muốn té, đầu lắc mà đau, cổ cứng tay run nói khó, tay chân tê dại đi không vững, nặng thì đột nhiên hôn mê bất tỉnh miệng mắt méo xệch bán thân bất toại lưỡi cứng khó nói, lưỡi đỏ rêu trắng/nê, mạch huyền hữu lực.",
    "Trên nền can dương thượng kháng sẵn có + đột ngột xuất hiện triệu chứng can phong (chóng mặt muốn té/co giật/á khẩu/bán thân bất toại)");

  await createPattern(sid, "Nhiệt cực sinh phong",
    "Nhiệt tà kháng thịnh dẫn động can phong. Do tà nhiệt chưng đốt can kinh (ngoại cảm nhiệt bệnh giai đoạn nặng).",
    "Sốt cao, hôn mê bứt rứt như cuồng, tay chân co giật, cổ gáy co cứng, nặng thì giác cung phản trương, hai mắt trợn ngược, răng cắn chặt, lưỡi đỏ hoặc thẫm, mạch huyền sác.",
    "Sốt cao + can phong (co giật/giác cung phản trương) cùng xuất hiện — khác can dương hóa phong (không sốt cao, nền bệnh mạn tính âm hư)");

  await createPattern(sid, "Hàn trệ can mạch",
    "Hàn tà ngưng trệ can mạch (= 'Hàn sán' trong bệnh sán khí/sa ruột, còn gọi tiểu trường khí thống). Do cảm hàn tà.",
    "Thiếu phúc căng kéo, cao hoàn trụy trướng lạnh đau hoặc co thắt âm nang gây đau, gặp lạnh đau tăng gặp ấm giảm, lưỡi rêu trắng hoạt, mạch trầm huyền hoặc trì.",
    "Đau thiếu phúc/cao hoàn gặp lạnh tăng gặp ấm giảm + mạch trầm huyền/trì");

  await createPattern(sid, "Can đởm thấp nhiệt",
    "Thấp nhiệt uẩn kết can đởm. Do cảm thấp nhiệt tà, ăn béo ngọt ủ thấp sinh nhiệt, hoặc tỳ vị thất kiện thấp uất hóa nhiệt.",
    "Trướng nóng đau sườn, có thể u cục, chán ăn bụng trướng, miệng đắng buồn nôn, đại tiện không đều, tiểu ngắn đỏ, lưỡi đỏ rêu vàng nê mạch huyền sác; hoặc hàn nhiệt vãng lai, vàng da vàng mắt, âm nang thấp chẩn ngứa, cao hoàn sưng nóng đau, đái hạ vàng hôi, ngứa sinh dục ngoài.",
    "Đau trướng sườn phải + chán ăn tiểu vàng + lưỡi đỏ rêu vàng nê (có thể kèm vàng da hoặc triệu chứng sinh dục theo đường kinh can)");

  await createPattern(sid, "Đởm uất đàm nhiễu",
    "Đởm thất sơ tiết, đàm nhiệt nội nhiễu. Do tình chí bất toại, sơ tiết thất chức sinh đàm hóa hỏa.",
    "Kinh quý mất ngủ, phiền thao bất an, miệng đắng, buồn nôn, ngực sườn trướng tức, hoa mắt chóng mặt ù tai, rêu vàng nê, mạch huyền hoạt.",
    "Mất ngủ kinh quý + miệng đắng + hoa mắt ù tai + rêu vàng nê mạch huyền hoạt");

  console.log("Đã xử lý xong các chứng hầu Can-Đởm (Tạng Phủ Biện Chứng).");
  console.log("Lưu ý: Âm hư động phong và Huyết hư sinh phong được dẫn chiếu tới Can âm hư và Can huyết hư tương ứng (nguồn không mô tả riêng), không tạo Pattern trùng lặp.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
