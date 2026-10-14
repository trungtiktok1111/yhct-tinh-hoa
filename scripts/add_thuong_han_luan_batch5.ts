// Thương hàn luận batch 5: điều 110-122 (trang 119-129), cuối Thiếu dương +
// các chứng hỏa nghịch/hỏa tà (chữa nhầm bằng chườm nóng/cứu/thiêu châm).
// Liều lượng nguyên văn, không bịa thêm.
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
      locator: "302 trang, điều 110-122 (trang 119-129), chương Thiếu dương/hỏa nghịch",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Sài hồ gia Long cốt Mẫu lệ thang",
    "Thương hàn 8-9 ngày, dùng nhầm thuốc hạ sinh ngực đầy phiền kinh, tiểu tiện không lợi, nói sảng, khắp mình đều nặng không trở trăn được (tà Thiếu dương chưa giải, nhiệt tà hãm vào trong).",
    [
      { name: "Sài hồ", amount: "4 lạng" },
      { name: "Long cốt", amount: "1,5 lạng" },
      { name: "Hoàng cầm", amount: "1,5 lạng" },
      { name: "Sinh khương", amount: "1,5 lạng", preparation: "thái mỏng" },
      { name: "Duyên đơn", amount: "1,5 lạng" },
      { name: "Nhân sâm", amount: "1,5 lạng" },
      { name: "Quế chi", amount: "1,5 lạng", preparation: "bỏ vỏ" },
      { name: "Phục linh", amount: "1,5 lạng" },
      { name: "Bán hạ", amount: "2,5 cáp", preparation: "tẩy" },
      { name: "Đại hoàng", amount: "2 lạng" },
      { name: "Mẫu lệ", amount: "1,5 lạng", preparation: "nướng" },
      { name: "Đại táo", amount: "6 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Quế chi khử Thược dược gia Thục tất Mẫu lệ Long cốt cứu nghịch thang",
    "Thương hàn mạch phù, thầy thuốc dùng nhầm phép chườm nóng để cưỡng ra mồ hôi, vong dương, nên phát cuồng, nằm ngồi không yên (chứng vong dương kinh cuồng).",
    [
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
      { name: "Mẫu lệ", amount: "5 lạng", preparation: "nướng" },
      { name: "Thục tất", amount: "3 lạng", preparation: "tẩy bỏ mùi tanh" },
      { name: "Long cốt", amount: "4 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Quế chi gia Quế thang",
    "Dùng phép thiêu châm cho ra mồ hôi, chỗ châm bị hàn tà nhiễm vào nổi hạch đỏ, phát chứng bôn đồn, khí từ bụng dưới xông lên tâm (tổn thương tâm dương, hàn tà thừa hư lấn vào).",
    [
      { name: "Quế chi", amount: "5 lạng", preparation: "bỏ vỏ" },
      { name: "Thược dược", amount: "3 lạng" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Quế chi Cam thảo Long cốt Mẫu lệ thang",
    "Chứng hỏa nghịch mà lại hạ, do thiêu châm mà buồn phiền vật vã (tâm dương bị thương, nặng hơn chứng của Quế chi Cam thảo thang).",
    [
      { name: "Quế chi", amount: "1 lạng", preparation: "bỏ vỏ" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Mẫu lệ", amount: "2 lạng", preparation: "nung" },
      { name: "Long cốt", amount: "2 lạng" },
    ]
  );

  console.log("Hoàn tất batch 5 Thương hàn luận (4 phương thuốc, điều 110-122).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
