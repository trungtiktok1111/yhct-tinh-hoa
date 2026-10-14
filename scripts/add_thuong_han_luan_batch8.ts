// Thương hàn luận batch 8: điều 155-170 (trang 152-164) — nhóm Tả tâm thang
// đầy đủ (Đại hoàng Hoàng liên, Phụ tử, Sinh khương, Cam thảo), Thập táo thang,
// Xích thạch chi Vũ dư lương thang, Toàn phúc đại giả thang, Quế chi nhân sâm
// thang. Liều lượng nguyên văn, không bịa thêm.
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
      locator: "302 trang, điều 155-170 (trang 152-164), chứng Bĩ",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Thập táo thang",
    "Thái dương trúng phong, ỉa chảy nôn khan, biểu chứng đã giải, dưới tâm rắn đầy đau lan xuống dưới sườn (chứng huyền ẩm — thủy tà kết tụ ở ngực sườn). Thuốc trục thủy mạnh.",
    [
      { name: "Nguyên hoa", preparation: "nướng" },
      { name: "Cam toại" },
      { name: "Đại kích" },
      { name: "Đại táo", amount: "10 quả", preparation: "to mập, nấu trước" },
    ]
  );

  await createFormula(
    sid,
    "Đại hoàng Hoàng liên tả tâm thang",
    "Chứng nhiệt bĩ: dưới tâm đầy tức, ấn vào thấy mềm, mạch trên bộ quan phù (nhiệt tà vô hình tụ lại).",
    [
      { name: "Đại hoàng", amount: "2 lạng" },
      { name: "Hoàng liên", amount: "1 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Phụ tử tả tâm thang",
    "Dưới tâm tức đầy mà lại sợ lạnh, đổ mồ hôi (nhiệt tích bên trong kiêm phần dương ngoài biểu hư — trong nhiệt ngoài hàn).",
    [
      { name: "Đại hoàng", amount: "2 lạng" },
      { name: "Hoàng liên", amount: "1 lạng" },
      { name: "Hoàng cầm", amount: "1 lạng" },
      { name: "Phụ tử", amount: "1 lạng", preparation: "nướng bóc bỏ vỏ, xẻ ra, nấu riêng lấy nước" },
    ]
  );

  await createFormula(
    sid,
    "Sinh khương tả tâm thang",
    "Thương hàn đổ mồ hôi giải rồi, vị khí không hòa, dưới tâm rắn đầy, ợ khan ra mùi đồ ăn, dưới sườn có thủy khí, trong bụng sôi lụp bụp, ỉa chảy.",
    [
      { name: "Sinh khương", amount: "4 lạng", preparation: "thái mỏng" },
      { name: "Chích thảo", amount: "3 lạng" },
      { name: "Nhân sâm", amount: "3 lạng" },
      { name: "Can khương", amount: "1 lạng" },
      { name: "Hoàng cầm", amount: "3 lạng" },
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Hoàng liên", amount: "1 lạng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Cam thảo tả tâm thang",
    "Thương hàn/trúng phong bị hạ nhầm, ỉa chảy ngày mấy mươi lần, cơm nước không tiêu hóa, bụng sôi lụp bụp, dưới tâm tức rắn mà đầy, nôn khan, tâm phiền (chứng hư bĩ, không phải kết nhiệt — trong vị hư, khách khí nghịch lên).",
    [
      { name: "Chích thảo", amount: "4 lạng" },
      { name: "Hoàng cầm", amount: "3 lạng" },
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
      { name: "Hoàng liên", amount: "1 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Xích thạch chi Vũ dư lương thang",
    "Thương hàn ỉa chảy không dứt sau khi đã dùng Tả tâm thang, hạ nhầm, Lý trung thang mà vẫn không cầm (ỉa chảy ở hạ tiêu do hoạt thoát, cần cố sáp — Lý trung thang chỉ chữa trung tiêu).",
    [
      { name: "Xích thạch chi", amount: "1 cân" },
      { name: "Thái nhất vũ dư lương", amount: "1 cân", preparation: "giã nát" },
    ]
  );

  await createFormula(
    sid,
    "Toàn phúc đại giả thang",
    "Thương hàn sau phát hãn, cho thổ, cho hạ, bệnh giải rồi, dưới tâm rắn đầy, ợ hơi không hết (dương khí trung cung hư, đàm ẩm tụ lại, vị khí nghịch lên).",
    [
      { name: "Toàn phúc hoa", amount: "3 lạng" },
      { name: "Nhân sâm", amount: "2 lạng" },
      { name: "Sinh khương", amount: "5 lạng" },
      { name: "Đại giả thạch", amount: "1 lạng" },
      { name: "Chích thảo", amount: "3 lạng" },
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Quế chi nhân sâm thang",
    "Bệnh Thái dương ngoại chứng chưa giải mà cho hạ nhiều lần, hợp với nhiệt mà ỉa chảy không dứt, dưới tâm đầy rắn, biểu lý không giải (ôn lý giải biểu).",
    [
      { name: "Quế chi", amount: "4 lạng", preparation: "thái riêng" },
      { name: "Chích thảo", amount: "4 lạng" },
      { name: "Bạch truật", amount: "3 lạng" },
      { name: "Nhân sâm", amount: "3 lạng" },
      { name: "Can khương", amount: "3 lạng" },
    ]
  );

  console.log("Hoàn tất batch 8 Thương hàn luận (8 phương thuốc, điều 155-170).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
