// Thương hàn luận batch 10: điều 184-232 (trang 176-200) — đầu chương Dương
// minh (đề cương, biện chứng), Đại/Tiểu thừa khí thang, Trư linh thang. Phần
// lớn đoạn này là lý luận biện chứng thuần túy (không có phương mới) vì nhiều
// phương đã có từ trước (Bạch hổ thang, Chi tử sị thang, Tứ nghịch thang,
// Tiểu sài hồ thang, Điều vị thừa khí thang...). Liều lượng nguyên văn, không
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
      locator: "302 trang, điều 184-232 (trang 176-200), đầu chương Dương minh",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Đại thừa khí thang",
    "Bệnh Dương minh mạch trì, ra mồ hôi không sợ lạnh, mình nặng, khí đoản, bụng đầy mà suyễn có sốt cơn, chân tay dâm dấp ra mồ hôi (lý thực đã thành — công hạ mạnh). Cũng dùng khi sốt cơn, đại tiện phân hơi rắn; hoặc nói sảng mắt trực thị mạch huyền (còn sống được); hoặc nói sảng có phân táo 5-6 cục.",
    [
      { name: "Đại hoàng", amount: "4 lạng", preparation: "tẩy rượu" },
      { name: "Hậu phác", amount: "1/2 cân", preparation: "nướng, bỏ vỏ" },
      { name: "Chỉ thực", amount: "5 quả", preparation: "nướng" },
      { name: "Mang tiêu", amount: "3 cáp" },
    ]
  );

  await createFormula(
    sid,
    "Tiểu thừa khí thang",
    "Như Đại thừa khí thang nhưng bụng đầy lắm không thông mà chưa đến chân tay dâm dấp mồ hôi (táo kết chưa nặng — chỉ hơi hòa vị khí, không xổ mạnh). Dùng để thử xem có phân táo hay không (uống vào thấy trung tiện được là có phân táo).",
    [
      { name: "Đại hoàng", amount: "4 lạng", preparation: "tẩy rượu" },
      { name: "Hậu phác", amount: "2 lạng", preparation: "nướng, cạo bỏ vỏ" },
      { name: "Chỉ thực", amount: "3 quả", preparation: "to quả, nướng" },
    ]
  );

  await createFormula(
    sid,
    "Trư linh thang",
    "Bệnh Dương minh mạch phù phát sốt, khát muốn uống nước, tiểu tiện không lợi (tân dịch tổn hại kiêm thủy nhiệt tích ở trong — tư âm lợi thủy). Cấm dùng khi đổ nhiều mồ hôi mà khát (sẽ hại tân dịch thêm).",
    [
      { name: "Trư linh", amount: "1 lạng", preparation: "bỏ vỏ" },
      { name: "Phục linh", amount: "1 lạng" },
      { name: "Trạch tả", amount: "1 lạng" },
      { name: "A giao", amount: "1 lạng" },
      { name: "Hoạt thạch", amount: "1 lạng", preparation: "giã nát" },
    ]
  );

  console.log("Hoàn tất batch 10 Thương hàn luận (3 phương thuốc, điều 184-232).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
