// Thương hàn luận batch 4: điều 97-109 (trang 107-119), chương Thái dương/
// Thiếu dương — nhóm phương Sài hồ (hòa giải Thiếu dương) + Tiểu kiến trung
// thang + Đào hạch thừa khí thang. Liều lượng nguyên văn, không bịa thêm.
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
      locator: "302 trang, điều 97-109 (trang 107-119), chương Thái dương/Thiếu dương",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Tiểu sài hồ thang",
    "Thương hàn/trúng phong 5-6 ngày: nóng rét qua lại, ngực sườn đầy tức, lìm lịm không muốn ăn uống, tâm phiền muốn nôn (chủ phương hòa giải bệnh Thiếu dương, bán biểu bán lý). Chỉ cần thấy 1 chứng chủ yếu là đủ dùng, không cần đủ cả.",
    [
      { name: "Sài hồ", amount: "1/2 cân" },
      { name: "Hoàng cầm", amount: "3 lạng" },
      { name: "Nhân sâm", amount: "3 lạng" },
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Cam thảo" },
      { name: "Sinh khương", amount: "3 lạng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Tiểu kiến trung thang",
    "Bệnh Thiếu dương kiêm lý hư hàn: trong bụng đau thắt (trước dùng bài này để điều hòa khí huyết, xây dựng trung khí, nếu không khỏi mới dùng Tiểu sài hồ thang). Cũng dùng khi Thương hàn 2-3 ngày, tim hồi hộp mà phiền (trung khí không đủ). Người vốn có bệnh ôn không nên dùng vì vị ngọt.",
    [
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
      { name: "Thược dược", amount: "6 lạng" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
      { name: "Mạch nha", amount: "1 thăng" },
    ]
  );

  await createFormula(
    sid,
    "Đại Sài hồ thang",
    "Bệnh Thiếu dương (chứng Sài hồ) kiêm lý thực: sau khi hạ nhầm nhiều lần mà chứng Sài hồ vẫn còn, nôn không dứt, dưới tâm cấp bức khó chịu, bứt rứt hơi phiền — lưỡng giải cả Thiếu dương lẫn Dương minh.",
    [
      { name: "Sài hồ", amount: "1/2 cân" },
      { name: "Hoàng cầm", amount: "3 lạng" },
      { name: "Thược dược", amount: "3 lạng" },
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Sinh khương", amount: "5 lạng", preparation: "thái mỏng" },
      { name: "Chỉ thực", amount: "4 quả" },
      { name: "Đại táo", amount: "12 quả" },
    ]
  );

  await createFormula(
    sid,
    "Sài hồ gia Mang tiêu thang",
    "Thương hàn 13 ngày, ngực sườn đầy mà nôn, về chiều sốt cơn, đi ngoài hơi lỏng do dùng nhầm thuốc hoàn để hạ (chứng Sài hồ kiêm lý thực nhẹ) — trước dùng Tiểu sài hồ thang giải ngoại, sau dùng bài này kiêm trị lý thực.",
    [
      { name: "Sài hồ", amount: "2 lạng 16 thù" },
      { name: "Hoàng cầm", amount: "1 lạng" },
      { name: "Nhân sâm", amount: "1 lạng" },
      { name: "Cam thảo", amount: "1 lạng" },
      { name: "Sinh khương", amount: "1 lạng", preparation: "thái mỏng" },
      { name: "Bán hạ", amount: "20 thù" },
      { name: "Đại táo", amount: "4 quả", preparation: "xẻ ra" },
      { name: "Mang tiêu", amount: "2 lạng" },
    ]
  );

  console.log("Hoàn tất batch 4 Thương hàn luận (4 phương thuốc, điều 97-109).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
