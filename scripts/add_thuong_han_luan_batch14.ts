// Thương hàn luận batch 14: điều 307-326 (trang 242-254) — HOÀN TẤT chương
// Thiếu âm. Đào hoa thang (ỉa máu mủ hư hàn), Trư phụ thang + Cam thảo thang +
// Cát cánh thang + Khổ tửu thang + Bán hạ tán và thang (nhóm trị đau họng),
// Bạch thông thang + Bạch thông gia Trư đởm trấp thang + Thông mạch Tứ nghịch
// thang (hồi dương), Tứ nghịch tán (dương uất). Liều lượng nguyên văn, không
// bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findOrCreateHerb(sourceId: string, name: string) {
  const existing = await prisma.herb.findFirst({
    where: { standardName: { equals: name, mode: "insensitive" } },
  });
  if (existing) return existing.id;
  const created = await prisma.herb.create({
    data: { standardName: name, status: "DRAFT", sourceId },
  });
  return created.id;
}

async function createFormula(
  sourceId: string,
  name: string,
  indications: string,
  ingredients: { name: string; amount?: string; preparation?: string }[]
) {
  const existing = await prisma.formula.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existing) {
    console.log(`Bỏ qua (đã tồn tại): ${name}`);
    return;
  }
  const formula = await prisma.formula.create({
    data: { name, origin: "Thương hàn luận (Trương Trọng Cảnh)", indications, status: "DRAFT", sourceId },
  });
  for (const ing of ingredients) {
    const herbId = await findOrCreateHerb(sourceId, ing.name);
    await prisma.formulaIngredient.create({
      data: { formulaId: formula.id, herbId, amount: ing.amount, preparation: ing.preparation },
    });
  }
  console.log(`Đã thêm: ${name}`);
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Thương hàn luận (bản dịch đầy đủ)",
      sourceType: "Sách kinh điển",
      authorOrOrg: "Trương Trọng Cảnh; bản dịch Việt ngữ",
      locator: "302 trang, điều 307-326 (trang 242-254), hết chương Thiếu âm",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Đào hoa thang",
    "Bệnh Thiếu âm, ỉa chảy ra máu mủ (tỳ thận dương hư, hạ tiêu hoạt thoát — ôn trung tán hàn, cố sáp).",
    [
      { name: "Xích thạch chi", amount: "1 cân", preparation: "một nửa dùng cả, một nửa giã rây lấy bột" },
      { name: "Can khương", amount: "1 lạng" },
      { name: "Gạo tẻ", amount: "1 thăng" },
    ]
  );

  await createFormula(
    sid,
    "Trư phụ thang",
    "Thiếu âm ỉa chảy lâu ngày tổn hại chân âm: đau họng, ngực đầy, tâm phiền (tư âm nhuận táo hòa trung).",
    [
      { name: "Bong bóng lợn", amount: "1 cân" },
      { name: "Mật ong", amount: "1 thăng" },
      { name: "Bột gạo tẻ", amount: "5 cáp", preparation: "sao thơm" },
    ]
  );

  await createFormula(
    sid,
    "Cam thảo thang",
    "Bệnh Thiếu âm 2-3 ngày, đau họng do khách nhiệt (thanh nhiệt hoãn cơn đau). Không khỏi thì dùng Cát cánh thang.",
    [{ name: "Cam thảo", amount: "2 lạng" }]
  );

  await createFormula(
    sid,
    "Cát cánh thang",
    "Như Cam thảo thang mà chưa khỏi — gia Cát cánh để tuyên phế long đờm.",
    [
      { name: "Cát cánh", amount: "1 lạng" },
      { name: "Cam thảo", amount: "2 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Khổ tửu thang",
    "Bệnh Thiếu âm, trong họng bị tổn thương sinh lở, không nói năng được, thanh âm không phát ra được (đàm hỏa kết ở họng — tẩy đờm tiêu thũng, dứt đau, thu liễm vết lở; ngậm nuốt ít một).",
    [
      { name: "Bán hạ", amount: "14 hạt", preparation: "tẩy, đập vỡ như hạt táo" },
      { name: "Trứng gà", amount: "1 quả", preparation: "bỏ lòng đỏ, để trong vỏ, cho giấm vào" },
    ]
  );

  await createFormula(
    sid,
    "Bán hạ tán và thang",
    "Bệnh Thiếu âm đau trong họng do phong hàn bó ngoài, nhiệt uất trong họng, nhiều đờm (tán hàn khai uất kết).",
    [
      { name: "Bán hạ", preparation: "tẩy" },
      { name: "Quế chi", preparation: "bỏ vỏ" },
      { name: "Chích thảo" },
    ]
  );

  await createFormula(
    sid,
    "Bạch thông thang",
    "Bệnh Thiếu âm ỉa chảy (âm hàn thịnh, dương khí hư, khí uất mạch vi — thông dương để phù âm; nhẹ hơn trường hợp cần Tứ nghịch thang).",
    [
      { name: "Hành tăm", amount: "4 củ" },
      { name: "Can khương", amount: "1 lạng" },
      { name: "Phụ tử", amount: "1 củ", preparation: "dùng sống, bóc bỏ vỏ, xẻ làm 8 miếng" },
    ]
  );

  await createFormula(
    sid,
    "Bạch thông gia Trư đởm trấp thang",
    "Bệnh Thiếu âm ỉa chảy không hết sau Bạch thông thang, quyết lạnh không có mạch, nôn khan mà phiền (âm dịch muốn thoát — dẫn dương nhập âm bằng mật lợn, nước tiểu).",
    [
      { name: "Hành tăm", amount: "4 củ" },
      { name: "Can khương", amount: "1 lạng" },
      { name: "Phụ tử", amount: "1 củ", preparation: "dùng sống, bóc bỏ vỏ, xẻ làm 8 miếng" },
      { name: "Nước tiểu", amount: "5 cáp" },
      { name: "Nước mật lợn", amount: "1 cáp" },
    ]
  );

  await createFormula(
    sid,
    "Thông mạch Tứ nghịch thang",
    "Bệnh Thiếu âm ỉa chảy ra nguyên cơm nước, trong lạnh ngoài nóng, chân tay giá lạnh, mạch vi muốn tuyệt, mình không sợ lạnh, sắc mặt đỏ (chân hàn giả nhiệt, âm thịnh đẩy dương ra ngoài — tức Tứ nghịch thang bội Can khương).",
    [
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Phụ tử", amount: "1 củ to", preparation: "dùng sống, gọt bỏ vỏ, xẻ làm 8 miếng" },
      { name: "Can khương", amount: "3 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Tứ nghịch tán",
    "Bệnh Thiếu âm chân tay giá lạnh do dương uất bên trong không thể tỏa đến chân tay (khác với chân tay lạnh do dương hư thực sự) — tuyên phát uất trệ.",
    [
      { name: "Chích thảo", amount: "10 phân" },
      { name: "Chỉ thực", amount: "10 phân", preparation: "xẻ ra, ngâm nước rồi nướng khô" },
      { name: "Sài hồ", amount: "10 phân" },
      { name: "Thược dược", amount: "10 phân" },
    ]
  );

  console.log("Hoàn tất batch 14 Thương hàn luận (10 phương thuốc, điều 307-326 — HẾT chương Thiếu âm).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
