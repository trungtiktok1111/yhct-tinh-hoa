// Thương hàn luận batch 11: điều 233-254 (trang 200-214) — Nhân trần cao thang
// (phát vàng), Để đương thang (đã có), Ngô thù du thang, Ma tử nhân hoàn (tỳ
// ước), và 2 phương thông đại tiện ngoài đường uống (Mật tiễn đạo phương,
// Trư đởm trắc phương). Liều lượng nguyên văn, không bịa thêm.
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
      locator: "302 trang, điều 233-254 (trang 200-214), chương Dương minh",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Nhân trần cao thang",
    "Bệnh Dương minh phát sốt đổ mồ hôi (chỉ đổ mồ hôi đầu, mình không mồ hôi), tiểu tiện không lợi, khát muốn uống nước — ứ nhiệt ở phần lý, mình phát vàng.",
    [
      { name: "Nhân trần cao", amount: "6 lạng" },
      { name: "Chi tử", amount: "14 quả", preparation: "xẻ ra" },
      { name: "Đại hoàng", amount: "2 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Ngô thù du thang",
    "Ăn cơm muốn nôn, thuộc Dương minh trúng hàn (ôn trung giáng nghịch). Nếu uống thuốc vào lại nặng hơn là thuộc nhiệt tà ở thượng tiêu, không phải chứng này.",
    [
      { name: "Ngô thù du", amount: "1 thăng", preparation: "tẩy" },
      { name: "Nhân sâm", amount: "3 lạng" },
      { name: "Sinh khương", amount: "6 lạng", preparation: "thái mỏng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Ma tử nhân hoàn",
    "Mạch phù mà sáp: phù thời vị khí khỏe, sáp thời tiểu tiện đi luôn, phù sáp cùng kết hợp thì đại tiện rắn — chứng tỳ ước (thuốc nhuận tràng thông tiện, nhuận hạ từ từ).",
    [
      { name: "Ma tử nhân", amount: "2 thăng" },
      { name: "Thược dược", amount: "1/2 cân" },
      { name: "Chỉ thực", amount: "1/2 cân", preparation: "nướng" },
      { name: "Đại hoàng", amount: "1 cân", preparation: "bỏ vỏ" },
      { name: "Hậu phác", amount: "1 thước", preparation: "nướng, bỏ vỏ" },
      { name: "Hạnh nhân", amount: "1 thăng", preparation: "bỏ vỏ và đầu nhọn, rang nghiền nát" },
    ]
  );

  await createFormula(
    sid,
    "Mật tiễn đạo phương (phép thông khoan bằng mật)",
    "Bệnh Dương minh tân dịch kiệt ở trong, đại tiện rắn nhưng không phải chứng táo kết nhiệt thực — không thể công hạ bằng thuốc uống, dùng phép thông khoan tại chỗ (nhét hậu môn) để nhuận táo khi bệnh nhân mót đi ngoài.",
    [{ name: "Mật ong", amount: "7 cáp" }]
  );

  await createFormula(
    sid,
    "Trư đởm trắc phương",
    "Dùng thay/kèm Mật tiễn đạo phương để thông đại tiện khi tân dịch kiệt — mật lợn hòa giấm, rót vào hậu môn, thanh nhiệt thông lợi.",
    [{ name: "Mật lợn" }, { name: "Giấm" }]
  );

  console.log("Hoàn tất batch 11 Thương hàn luận (5 phương thuốc/phép, điều 233-254).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
