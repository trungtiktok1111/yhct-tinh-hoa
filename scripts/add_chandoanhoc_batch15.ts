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
      locator: "321 trang — Chương 3: Biện Chứng, phần Tạng Phủ Biện Chứng (Tỳ-Vị)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createPattern(sid, "Tỳ khí hư",
    "Tỳ khí bất túc, vận hóa thất kiện. Do ẩm thực thất điều, lao lực quá độ, bệnh mạn tính hao tổn tỳ khí.",
    "Ăn ít, bụng trướng tăng sau ăn ('thực nhập bất vận'), đại tiện phân lỏng, uể oải lười biếng, thiểu khí lười nói, sắc mặt vàng héo/trắng nhợt, có thể phù thũng hoặc gầy ốm, lưỡi nhạt rêu trắng, mạch hoãn nhược.",
    "Ăn ít + bụng trướng tăng sau ăn + đại tiện lỏng + mạch hoãn nhược");

  await createPattern(sid, "Tỳ dương hư",
    "Tỳ dương hư suy, âm hàn nội thịnh (còn gọi 'Tỳ hư hàn' hoặc 'Tỳ vị hư hàn'). Từ tỳ khí hư phát triển thêm, hoặc ăn nhiều đồ sống lạnh, hoặc thận dương hư hỏa bất sinh thổ.",
    "Bụng trướng ăn ít, đau bụng thích ấm thích án, đại tiện lỏng loãng (lỏng hơn tỳ khí hư), tứ chi không ấm hoặc nặng nề mỏi mệt, có thể phù toàn thân tiểu không thông, hoặc bạch đới nhiều loãng, lưỡi nhạt bệu rêu trắng hoạt, mạch trầm trì vô lực.",
    "Bụng đau thích ấm + tiêu lỏng loãng + tứ chi không ấm + mạch trầm trì vô lực (hàn tượng rõ hơn tỳ khí hư)");

  await createPattern(sid, "Trung khí hạ hãm",
    "Tỳ khí khuy hư không đủ sức thăng đề mà hạ hãm — đặc trưng sa nội tạng. Từ tỳ khí hư phát triển, hoặc tiêu chảy/lỵ mạn, lao lực quá độ.",
    "Quản phúc trì nặng trướng căng (tăng sau ăn), mót đi cầu hoài hậu môn trì nặng thậm chí thoát giang hoặc sa tử cung, tiểu đục như nước vo gạo, kèm khí thiểu phạt lực, chi thể uể oải, tiếng nhỏ lười nói, hoa mắt chóng mặt, lưỡi nhạt rêu trắng, mạch nhược.",
    "Tỳ khí hư + sa nội tạng (sa dạ dày/thoát giang/sa tử cung) + tiểu đục như nước vo gạo");

  await createPattern(sid, "Tỳ bất thống huyết",
    "Tỳ khí hư suy không thống nhiếp được huyết dịch. Do bệnh lâu tỳ hư hoặc lao lực tổn tỳ.",
    "Tiện huyết, niệu huyết, xuất huyết dưới da, chảy máu chân răng, hoặc kinh nguyệt quá nhiều/băng lậu, kèm ăn ít, tiêu chảy, mệt mỏi uể oải, thiểu khí lười nói, sắc mặt không tươi, lưỡi nhạt rêu trắng, mạch tế nhược.",
    "Xuất huyết đa vị trí (tiện huyết/niệu huyết/băng lậu) + tỳ khí hư chứng kèm theo");

  await createPattern(sid, "Hàn thấp khốn tỳ",
    "Hàn thấp nội thịnh, trung dương bị khốn (thực chứng, bệnh trình ngắn). Do ẩm thực bất tiết, ăn đồ sống lạnh, dầm mưa lội nước, cư ngụ nơi ẩm thấp.",
    "Bụng trướng căng đau (bĩ muộn), ăn ít, tiêu lỏng, buồn nôn, miệng nhạt không khát, đầu mình nặng nề, sắc mặt vàng tối hoặc da mặt mắt vàng ám tối như hun khói, có thể phù chi, tiểu ngắn ít, lưỡi bệu rêu trắng nê, mạch nhu hoãn.",
    "Bụng trướng đau + miệng nhạt không khát + đầu mình nặng + rêu trắng nê mạch nhu hoãn (thực, bệnh ngắn — khác tỳ dương hư là hư, bệnh dài, mạch trầm trì)");

  await createPattern(sid, "Thấp nhiệt uẩn tỳ",
    "Thấp nhiệt nội uẩn trung tiêu. Do cảm thấp nhiệt ngoại tà hoặc ăn nhiều đồ béo ngọt/rượu chè ủ thấp sinh nhiệt.",
    "Bụng đầy tức khó chịu, ăn kém buồn nôn lợm giọng, tiêu lỏng, tiểu vàng, tay chân nặng nề, có thể vàng da vàng mắt (màu tươi như vỏ quýt) ngứa da, sốt lúc cao lúc thấp ra mồ hôi không hết sốt, lưỡi đỏ rêu vàng nê, mạch nhu sác.",
    "Bụng đầy tức + vàng da màu tươi (khác hàn thấp khốn tỳ: vàng da tối như hun khói) + sốt lúc cao lúc thấp + mạch nhu sác");

  await createPattern(sid, "Vị âm hư",
    "Phủ vị âm hư suy. Do bệnh vị lâu không khỏi, sau nhiệt bệnh tân dịch chưa hồi phục, ưa ăn cay nóng, hoặc khí uất hóa hỏa tổn vị âm.",
    "Vị quản ẩn thống, đói không muốn ăn, miệng khô họng táo, đại tiện khô kết, có thể tức đầy thượng vị, nôn khan nấc cục, lưỡi đỏ ít tân, mạch tế sác.",
    "Đau vị quản ngấm ngầm + đói không muốn ăn + miệng khô họng táo + lưỡi đỏ ít tân mạch tế sác");

  await createPattern(sid, "Thực trệ vị quản",
    "Thức ăn đình lưu tại vị quản không tiêu hóa. Do ẩm thực bất tiết, bạo ẩm bạo thực, hoặc tỳ vị hư sẵn vận hóa kém.",
    "Vị quản trướng muộn, nặng thì đau, ợ hơi ợ chua, nôn nước chua và đồ ăn (giảm đau sau nôn), trung tiện liên tục mùi hôi hoặc tiêu phân chua hôi, rêu lưỡi dày nê, mạch hoạt.",
    "Vị quản trướng đau + ợ chua + nôn đồ ăn (giảm đau sau nôn) + rêu dày nê mạch hoạt");

  await createPattern(sid, "Vị hàn",
    "Âm hàn ngưng trệ tại vị phủ, chia thực hàn (dương khí bị át) và hư hàn (dương khí bị tổn, bệnh trình dài có thể chuyển hư). Do lạnh bụng, ăn đồ sống lạnh, hoặc lao quyện cảm thêm hàn tà.",
    "Vị quản thống (nhẹ âm ỉ, nặng co thắt dữ dội), gặp lạnh đau tăng gặp ấm giảm, miệng nhạt không khát, tinh thần uể oải, tay chân lạnh thích ấm, giảm đau sau ăn, có thể vị quản sôi và chảy nước dãi trong (kèm thủy ẩm), lưỡi nhạt rêu trắng hoạt, mạch trì hoặc huyền.",
    "Đau vị quản gặp lạnh tăng gặp ấm giảm + miệng nhạt không khát + mạch trì");

  await createPattern(sid, "Vị nhiệt",
    "Vị trung tích nhiệt. Do ăn cay nóng béo ngậy hóa nhiệt, khí uất hóa hỏa, hoặc nhiệt tà nội phạm.",
    "Vị quản chước thống (đau nóng rát), ợ chua trào ngược, tào tạp (xót trống dạ dày), ăn vào đói liền hoặc mau đói, khát thích uống mát, có thể sưng đau loét chảy máu chân răng miệng hôi, đại tiện bí kết, tiểu ngắn đỏ, lưỡi đỏ rêu vàng, mạch hoạt sác.",
    "Đau vị quản nóng rát + ợ chua trào ngược + ăn mau đói + mạch hoạt sác");

  console.log("Đã xử lý xong các chứng hầu Tỳ-Vị (Tạng Phủ Biện Chứng).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
