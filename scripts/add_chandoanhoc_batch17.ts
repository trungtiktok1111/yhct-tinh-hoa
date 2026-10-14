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
      locator: "321 trang — Chương 3: Biện Chứng, phần Tạng Phủ Biện Chứng (Thận-Bàng quang)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createPattern(sid, "Thận dương hư",
    "Chức năng sinh lý toàn thân giảm kèm hàn tượng. Do tố thể dương hư, niên cao thận khuy, bệnh lâu thương thận, lao phòng quá độ.",
    "Lưng gối mỏi mềm đau, úy hàn tay chân lạnh (rõ ở chân), hoa mắt chóng mặt, tinh thần ủy mị, sắc mặt nhợt hoặc đen xì, lưỡi nhạt bệu rêu trắng, mạch trầm nhược. Có thể: dương nuy/cung hàn không con, tiêu chảy lâu không cầm/ngũ canh tả, hoặc phù rõ từ lưng xuống (phù mềm ấn lõm) nặng thì bụng trướng mãn phù toàn thân tâm quý ho.",
    "Lưng gối mỏi lạnh + úy hàn chi lạnh rõ ở chân + mạch trầm nhược (hàn tượng toàn thân rõ)");

  await createPattern(sid, "Thận âm hư",
    "Thận tạng âm dịch bất túc, hư nhiệt nội sinh. Do bệnh lâu thương thận, bẩm phú bất túc, phòng sự quá độ, hoặc dùng nhiều thuốc ôn táo.",
    "Đau mỏi lưng gối, chóng mặt ù tai, mất ngủ mộng nhiều, nam dương cường dị cử/di tinh, nữ kinh ít bế kinh hoặc băng lậu, hình thể gầy triều nhiệt đạo hạn ngũ tâm phiền nhiệt, họng khô lưỡng quyền đỏ, tiểu vàng tiêu táo, lưỡi đỏ ít tân, mạch tế sác.",
    "Lưng gối mỏi + triều nhiệt đạo hạn ngũ tâm phiền nhiệt (hư nhiệt) + lưỡi đỏ ít tân mạch tế sác");

  await createPattern(sid, "Thận tinh bất túc",
    "Thận tinh khuy tổn — đặc trưng chậm phát triển (trẻ em) và sớm lão hóa (người lớn). Do bẩm phú bất túc, hậu thiên điều dưỡng kém, phòng thất quá độ, bệnh lâu tổn thận.",
    "Trẻ em: phát dục chậm còi cọc, trí lực/động tác chậm, thóp chậm đóng, xương cốt yếu mềm. Người lớn: tinh ít không con (nam)/bế kinh không con (nữ), mau lão hóa tóc rụng răng lung lay, ù tai điếc tai, hay quên hốt hoảng, động tác trì trệ, chân teo vô lực, tinh thần ngu đốn.",
    "Chậm phát triển (trẻ em) hoặc sớm lão hóa + giảm chức năng sinh lý (cả hai nhóm tuổi)");

  await createPattern(sid, "Thận khí bất cố",
    "Thận khí khuy hư không đủ sức cố nhiếp (thận-bàng quang không cố nhiếp được). Do tuổi cao thận khí hư, trẻ thơ thận khí chưa sung, phòng sự quá độ, bệnh lâu tổn thận.",
    "Sắc mặt trắng nhợt, mệt mỏi uể oải, thính lực giảm, lưng gối mỏi mềm, tiểu nhiều trong hoặc tiểu còn són giọt/đái dầm/tiểu không tự chủ/tiểu đêm nhiều, nam hoạt tinh tảo tiết, nữ đái hạ trong loãng hoặc động thai dễ sảy, lưỡi nhạt rêu trắng, mạch trầm nhược.",
    "Tiểu nhiều/đái dầm/tiểu không tự chủ (bàng quang thất ước) + lưng gối mỏi + mạch trầm nhược (khác thận dương hư ở không có hàn tượng rõ toàn thân)");

  await createPattern(sid, "Thận bất nạp khí",
    "Thận hư suy, khí bất quy nguyên — đặc trưng 'hô đa hấp thiểu' (thở ra nhiều hít vào ít). Do ho suyễn lâu ngày phế hư cập thận, hoặc lao thương thận khí.",
    "Ho suyễn lâu ngày, hô đa hấp thiểu, khí không nối tiếp liên tục, động là suyễn tức tăng, tự hạn, uể oải, tiếng nhỏ, lưng gối mỏi mềm, lưỡi nhạt rêu trắng, mạch trầm nhược. Nặng (dương hư muốn thoát): suyễn tăng, mồ hôi đầm đìa, chi lạnh mặt xanh, mạch phù đại không căn. Thể khí âm lưỡng hư: khí đoản thở gấp, mặt đỏ tâm phiền, họng khô, lưỡi đỏ, mạch tế sác.",
    "Ho suyễn lâu ngày + hô đa hấp thiểu (đặc trưng chẩn đoán) + động là suyễn tăng — phân 3 mức độ nặng dần");

  await createPattern(sid, "Bàng quang thấp nhiệt",
    "Thấp nhiệt uẩn kết bàng quang. Do cảm thấp nhiệt hoặc ẩm thực bất tiết sinh thấp nhiệt hạ chú bàng quang.",
    "Tiểu rắt gắt nóng rát niệu đạo, tiểu nhiều lần, nước tiểu vàng ngắn ít, bụng dưới trướng mãn, có thể kèm sốt đau lưng, hoặc tiểu máu, hoặc tiểu ra sỏi, lưỡi đỏ rêu vàng nê, mạch sác.",
    "Tiểu rắt gắt buốt + nước tiểu vàng + rêu vàng nê mạch sác");

  console.log("Đã xử lý xong các chứng hầu Thận-Bàng quang (Tạng Phủ Biện Chứng). Hoàn tất ngũ tạng lục phủ biện chứng cơ bản.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
