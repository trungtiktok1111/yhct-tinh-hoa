// Thương hàn luận batch 7: điều 142-154 (trang 141-152) — Tiểu hãm hung thang,
// Văn cáp tán, nhóm Sài hồ hợp phương, Bán hạ tả tâm thang (chứng Bĩ).
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
      locator: "302 trang, điều 142-154 (trang 141-152)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Tiểu hãm hung thang",
    "Chứng Tiểu kết hung, chính ở dưới tâm, ấn vào thì đau, mạch phù hoạt (đờm với nhiệt kết lại tương đối nông — nhẹ hơn Đại hãm hung thang).",
    [
      { name: "Hoàng liên", amount: "1 lạng" },
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Qua lâu thực", amount: "1 quả (to)" },
    ]
  );

  await createFormula(
    sid,
    "Văn cáp tán",
    "Bệnh ở dương, dùng nước lạnh phun/dội vào làm nhiệt tà bị bức không lui, thêm phiền, da nổi gai ốc, muốn uống nước mà không khát.",
    [{ name: "Văn cáp", amount: "5 lạng" }]
  );

  await createFormula(
    sid,
    "Kim quĩ Văn cáp thang",
    "Dùng khi Văn cáp tán không đỡ — phương giải biểu thanh lý (tức Đại thanh long thang bỏ Quế chi gia Văn cáp).",
    [
      { name: "Văn cáp", amount: "5 lạng" },
      { name: "Ma hoàng", amount: "3 lạng" },
      { name: "Cam thảo", amount: "3 lạng" },
      { name: "Sinh khương", amount: "3 lạng" },
      { name: "Thạch cao", amount: "5 lạng" },
      { name: "Hạnh nhân", amount: "50 hạt" },
      { name: "Đại táo", amount: "12 quả" },
    ]
  );

  await createFormula(
    sid,
    "Tam vật tiểu bạch tán",
    "Chứng hàn thực kết hung, không có chứng sốt (đàm ẩm kết tụ ở trong ngực, không có dấu hiệu nhiệt — khác với nhiệt thực kết hung).",
    [
      { name: "Cát cánh", amount: "3 phần" },
      { name: "Ba đậu", amount: "1 phần", preparation: "bỏ vỏ và ruột, sao đen, nghiền nát" },
      { name: "Bối mẫu", amount: "3 phần" },
    ]
  );

  await createFormula(
    sid,
    "Sài hồ quế chi thang",
    "Thương hàn 6-7 ngày, phát sốt hơi sợ lạnh, chân tay khớp xương đau phiền (chứng Quế chi thang), hơi nôn, dưới tâm tức nhói (chứng Sài hồ thang) — hợp phương Thái dương kiêm Thiếu dương.",
    [
      { name: "Quế chi", amount: "1,5 lạng", preparation: "bỏ vỏ" },
      { name: "Thược dược", amount: "1,5 lạng" },
      { name: "Hoàng cầm", amount: "1,5 lạng" },
      { name: "Nhân sâm", amount: "1,5 lạng" },
      { name: "Chích thảo", amount: "1 lạng" },
      { name: "Bán hạ", amount: "2,5 cáp", preparation: "tẩy" },
      { name: "Đại táo", amount: "6 quả", preparation: "xẻ ra" },
      { name: "Sinh khương", amount: "1,5 lạng", preparation: "thái mỏng" },
      { name: "Sài hồ", amount: "4 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Sài hồ Quế chi Can khương thang",
    "Thương hàn 5-6 ngày đã phát hãn lại hạ, ngực sườn đầy hơi kết, tiểu tiện không lợi, khát mà không nôn, chỉ đổ mồ hôi đầu, nóng rét qua lại, tâm phiền (tà chưa giải khỏi Thiếu dương kiêm thủy ẩm). Ứng dụng rộng: chữa sốt rét lạnh nhiều nóng ít.",
    [
      { name: "Sài hồ", amount: "1/2 cân" },
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "Can khương", amount: "2 lạng" },
      { name: "Qua lâu căn", amount: "4 lạng" },
      { name: "Hoàng cầm", amount: "3 lạng" },
      { name: "Mẫu lệ", amount: "2 lạng", preparation: "nướng" },
      { name: "Chích thảo", amount: "2 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Bán hạ tả tâm thang",
    "Chứng Bĩ: dưới tâm đầy mà không đau (khác chứng kết hung là đầy mà rắn đau) — do nóng lạnh kết với nhau, thăng giáng mất bình thường.",
    [
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Hoàng cầm", amount: "3 lạng" },
      { name: "Can khương", amount: "3 lạng" },
      { name: "Nhân sâm", amount: "3 lạng" },
      { name: "Chích thảo", amount: "3 lạng" },
      { name: "Hoàng liên", amount: "1 lạng" },
      { name: "Đại táo", amount: "12 quả", preparation: "bổ ra" },
    ]
  );

  console.log("Hoàn tất batch 7 Thương hàn luận (7 phương thuốc, điều 142-154).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
