// Thương hàn luận batch 6: điều 128-141 (trang 131-141) — chứng súc huyết
// (Để đương thang/hoàn) và chứng kết hung (Đại hãm hung hoàn/thang).
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
      locator: "302 trang, điều 128-141 (trang 131-141), chứng súc huyết và kết hung",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Để đương thang",
    "Bệnh Thái dương 6-7 ngày, biểu chứng vẫn còn, mạch vi mà trầm, không có chứng kết hung, người bệnh phát cuồng (nhiệt ở hạ tiêu kết với huyết — chứng súc huyết), bụng dưới rắn đầy, tiểu tiện lợi. Dược lực mạnh hơn Đào hạch thừa khí thang.",
    [
      { name: "Thủy điệp", amount: "30 con", preparation: "rang" },
      { name: "Manh trùng", amount: "30 con", preparation: "bỏ cánh, chân, rang" },
      { name: "Đào nhân", amount: "20 hạt", preparation: "bỏ vỏ và đầu nhọn" },
      { name: "Đại hoàng", amount: "3 lạng", preparation: "tẩy rượu" },
    ]
  );

  await createFormula(
    sid,
    "Để đương hoàn",
    "Bệnh thương hàn có sốt, bụng dưới đầy, tiểu tiện lợi (chứng súc huyết) — dùng thể hoàn để công theo lối hoãn, dược lực chậm hơn Để đương thang.",
    [
      { name: "Thủy điệp", amount: "20 con", preparation: "rang" },
      { name: "Manh trùng", amount: "20 con", preparation: "bỏ cánh, chân, rang" },
      { name: "Đào nhân", amount: "20 hạt", preparation: "bỏ vỏ và đầu nhọn" },
      { name: "Đại hoàng", amount: "3 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Đại hãm hung hoàn",
    "Chứng kết hung (Đại kết hung), gáy cũng cứng tựa như chứng nhu kinh — tà kết ở vị trí cao nên dùng thuốc hoàn (tác dụng hoà hoãn hơn) thay vì thuốc thang.",
    [
      { name: "Đại hoàng", amount: "1/2 cân" },
      { name: "Hạt đình lịch", amount: "1/2 thăng", preparation: "sao" },
      { name: "Mang tiêu", amount: "1/2 thăng" },
      { name: "Hạnh nhân", amount: "1/2 thăng", preparation: "bỏ vỏ và đầu nhọn, sao hắc" },
      { name: "Cam toại", amount: "1 thìa con" },
      { name: "Mật ong", amount: "2 cáp" },
    ]
  );

  await createFormula(
    sid,
    "Đại hãm hung thang",
    "Chứng kết hung nhiệt thực: dưới tâm đau, ấn vào rắn như đá, mạch trầm mà khẩn (thủy tà và nhiệt tà cấu kết ở vùng trên). Cũng dùng khi: Thái dương phát hãn 2 lần lại hạ, 5-6 ngày không đi đồng, lưỡi khô khát, từ dưới tâm đến bụng dưới rắn đầy đau không thể sờ.",
    [
      { name: "Đại hoàng", amount: "6 lạng", preparation: "bỏ vỏ" },
      { name: "Mang tiêu", amount: "1 thăng" },
      { name: "Cam toại", amount: "1 thìa con" },
    ]
  );

  console.log("Hoàn tất batch 6 Thương hàn luận (4 phương thuốc, điều 128-141).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
