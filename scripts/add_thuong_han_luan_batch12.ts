// Thương hàn luận batch 12: điều 255-281 (trang 214-227) — cuối chương Dương
// minh (phát vàng: Chi tử bá bì thang, Ma hoàng Liên kiều Xích tiểu đậu thang),
// toàn bộ chương Thiếu dương (chỉ lý luận, không có phương mới — dùng lại
// Tiểu sài hồ thang đã có), và đầu chương Thái âm (Quế chi gia Thược dược
// thang, Quế chi gia Đại hoàng thang). Liều lượng nguyên văn, không bịa thêm.
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
      locator: "302 trang, điều 255-281 (trang 214-227), cuối Dương minh + Thiếu dương + đầu Thái âm",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Chi tử bá bì thang",
    "Thương hàn mình vàng phát sốt (thấp nhiệt cùng bốc lên, không có lý chứng/biểu chứng rõ — thanh nhiệt tiết thấp).",
    [
      { name: "Chi tử", amount: "15 quả", preparation: "xé ra" },
      { name: "Chích thảo", amount: "1 lạng" },
      { name: "Hoàng bá", amount: "2 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Ma hoàng Liên kiều Xích tiểu đậu thang",
    "Thương hàn ứ nhiệt ở trong, mình vàng (biểu tà chưa giải, trong có thấp nhiệt — giải biểu tán hàn kiêm thanh thấp nhiệt).",
    [
      { name: "Ma hoàng", amount: "2 lạng", preparation: "bỏ mắt" },
      { name: "Liên kiều căn", amount: "2 lạng" },
      { name: "Hạnh nhân", amount: "10 hạt", preparation: "bỏ vỏ và đầu nhọn" },
      { name: "Xích tiểu đậu", amount: "1 thăng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xé ra" },
      { name: "Sinh tử bạch bì", amount: "1 thăng", preparation: "thái mỏng" },
      { name: "Sinh khương", amount: "2 lạng", preparation: "thái mỏng" },
      { name: "Chích thảo", amount: "2 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Quế chi gia Thược dược thang",
    "Vốn bệnh Thái dương, thầy thuốc cho hạ nhầm, bụng đầy có lúc đau, thuộc Thái âm (hư hàn — điều Tỳ hòa trung tiêu).",
    [
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "Thược dược", amount: "6 lạng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
    ]
  );

  await createFormula(
    sid,
    "Quế chi gia Đại hoàng thang",
    "Như Quế chi gia Thược dược thang nhưng rất thực mà đau (đồ thối nát tích trệ ở trường vị — trừ vật thối nát để hết đau). Người vị khí yếu, ỉa chảy liên tục thì nên giảm bớt liều Đại hoàng, Thược dược.",
    [
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "Đại hoàng", amount: "2 lạng" },
      { name: "Thược dược", amount: "6 lạng" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
    ]
  );

  console.log("Hoàn tất batch 12 Thương hàn luận (4 phương thuốc, điều 255-281 — hết Dương minh + Thiếu dương, đầu Thái âm).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
