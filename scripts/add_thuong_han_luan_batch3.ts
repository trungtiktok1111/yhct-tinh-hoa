// Thương hàn luận batch 3: điều 74-96 (trang 95-107), chương Thái dương —
// nhóm phương Chi tử (thanh nhiệt trừ phiền) + Phục linh Cam thảo thang.
// Chân vũ thang đã tồn tại (từ batch Tạng Tâm) nên bỏ qua. Vũ dư lương hoàn
// không có thành phần trong nguyên bản (ghi "khuyết") nên không tạo Formula.
// Liều lượng lấy nguyên văn, không bịa thêm.
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
      locator: "302 trang, điều 74-96 (trang 95-107), chương Thái dương",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Phục linh Cam thảo thang",
    "Thương hàn đổ mồ hôi mà không khát (nước tích ở trung tiêu, không phải do khí hóa trở ngại) kèm dưới tâm hồi hộp — phân biệt với Ngũ linh tán (dùng khi khát).",
    [
      { name: "Phục linh", amount: "2 lạng" },
      { name: "Quế chi", amount: "2 lạng", preparation: "bỏ vỏ" },
      { name: "Chích thảo", amount: "1 lạng" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
    ]
  );

  await createFormula(
    sid,
    "Chi tử sị thang",
    "Sau khi phát hãn, thổ, hạ, hư phiền không ngủ được; nếu nặng thì trở trăn điên đảo, trong tâm ảo não (nhiệt còn lại quấy nhiễu trong ngực). Cấm dùng khi người vốn có chứng đi ngoài phân hơi nhão (tỳ vị hư hàn).",
    [
      { name: "Chi tử", amount: "14 quả", preparation: "bổ ra" },
      { name: "Đậu sị", amount: "4 cáp", preparation: "dùng vải đùm lại" },
    ]
  );

  await createFormula(
    sid,
    "Chi tử Cam thảo sị thang",
    "Như Chi tử sị thang, kiêm chứng khí kém trong ngực.",
    [
      { name: "Chi tử", amount: "14 quả", preparation: "xé ra" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Đậu sị", amount: "4 cáp", preparation: "dùng vải đùm lại" },
    ]
  );

  await createFormula(
    sid,
    "Chi tử Sinh khương sị thang",
    "Như Chi tử sị thang, kiêm chứng nôn mửa.",
    [
      { name: "Chi tử", amount: "14 quả", preparation: "xé ra" },
      { name: "Sinh khương", amount: "5 lạng", preparation: "thái mỏng" },
      { name: "Đậu sị", amount: "4 cáp", preparation: "dùng vải đùm lại" },
    ]
  );

  await createFormula(
    sid,
    "Chi tử Hậu phác thang",
    "Thương hàn sau khi hạ, tâm phiền, bụng đầy, nằm ngồi không yên (tà nhiệt đọng ở ngực, khí trệ ở bụng).",
    [
      { name: "Chi tử", amount: "14 quả", preparation: "xé ra" },
      { name: "Hậu phác", amount: "4 lạng", preparation: "nướng, bỏ vỏ" },
      { name: "Chỉ thực", amount: "4 quả", preparation: "ngâm nước, nướng vàng" },
    ]
  );

  await createFormula(
    sid,
    "Chi tử Can khương thang",
    "Thương hàn, thầy thuốc đã cho uống thuốc hoàn hạ mạnh, chứng mình nóng không rút mà hơi phiền (trong ngực và hoành cách mô có nhiệt, trong bụng có hàn — bài thuốc hàn nhiệt cùng dùng).",
    [
      { name: "Chi tử", amount: "14 quả", preparation: "xé ra" },
      { name: "Can khương", amount: "2 lạng" },
    ]
  );

  console.log("Hoàn tất batch 3 Thương hàn luận (6 phương thuốc, điều 74-96).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
