// Thương hàn luận batch 13: điều 282-306 (trang 227-242) — chương Thiếu âm,
// các phương điều trị Thiếu âm cảm hàn (nhóm Ma hoàng Phụ tử) và Thiếu âm
// nhiệt hóa/hàn hóa (Hoàng liên a giao thang, Phụ tử thang). Điều 282-301 là
// biện chứng/tiên lượng thuần túy (nhiều dấu hiệu tử vong — không có phương).
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
      locator: "302 trang, điều 282-306 (trang 227-242), chương Thiếu âm",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Ma hoàng Phụ tử Tế tân thang",
    "Bệnh Thiếu âm mới mắc lại phát sốt, mạch trầm (Thiếu âm cảm hàn — vừa bồi bổ vừa phát hãn).",
    [
      { name: "Ma hoàng", amount: "2 lạng", preparation: "bỏ mắt" },
      { name: "Tế tân", amount: "2 lạng" },
      { name: "Phụ tử", amount: "1 củ", preparation: "nướng, bóc bỏ vỏ, xé ra làm 8 miếng" },
    ]
  );

  await createFormula(
    sid,
    "Ma hoàng Phụ tử Cam thảo thang",
    "Bệnh Thiếu âm mắc đã 2-3 ngày, không có lý chứng — phát hãn nhẹ (tức Ma hoàng Phụ tử Tế tân thang bỏ Tế tân cay tán, gia Cam thảo ngọt hoãn).",
    [
      { name: "Ma hoàng", amount: "2 lạng", preparation: "bỏ mắt" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Phụ tử", amount: "1 củ", preparation: "nướng, bóc bỏ vỏ, xẻ làm 8 miếng" },
    ]
  );

  await createFormula(
    sid,
    "Hoàng liên a giao thang",
    "Mắc bệnh Thiếu âm đã 2-3 ngày trở lên, trong tâm phiền không ngủ được (Thiếu âm nhiệt hóa — âm hư dương thịnh, thủy khô hỏa bốc — tư âm giáng hỏa).",
    [
      { name: "Hoàng liên", amount: "4 lạng" },
      { name: "Hoàng cầm", amount: "2 lạng" },
      { name: "Thược dược", amount: "2 lạng" },
      { name: "Lòng đỏ trứng gà", amount: "2 quả" },
      { name: "A giao", amount: "3 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Phụ tử thang",
    "Bệnh Thiếu âm mới mắc 1-2 ngày, trong miệng hòa (không khát), lưng sợ lạnh (Thiếu âm hàn hóa — ôn kinh phù dương). Cũng dùng khi mình mẩy đau, chân tay lạnh, khớp xương nhức, mạch trầm.",
    [
      { name: "Phụ tử", amount: "2 củ", preparation: "nướng, bóc bỏ vỏ, xẻ ra làm 8 miếng" },
      { name: "Phục linh", amount: "3 lạng" },
      { name: "Nhân sâm", amount: "2 lạng" },
      { name: "Bạch truật", amount: "4 lạng" },
      { name: "Thược dược", amount: "3 lạng" },
    ]
  );

  console.log("Hoàn tất batch 13 Thương hàn luận (4 phương thuốc, điều 282-306).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
