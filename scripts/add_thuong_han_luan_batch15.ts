// Thương hàn luận batch 15: điều 339-374 (trang 262-280) — chương Quyết âm:
// Ô mai hoàn (hồi quyết/giun), Đương quy tứ nghịch thang (2 biến thể), Ma
// hoàng thăng ma thang, Can khương Hoàng cầm Hoàng liên Nhân sâm thang, Bạch
// đầu ông thang (kiết lỵ thuộc nhiệt). Liều lượng nguyên văn, không bịa thêm.
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
      locator: "302 trang, điều 339-374 (trang 262-280), chương Quyết âm",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Ô mai hoàn",
    "Chứng hồi quyết (giun đũa quấy nhiễu): bệnh nhân yên tĩnh có lúc phiền, ăn vào mửa ra giun, hay mửa ra giun (trường vị hư hàn, giun ngoi lên). Kiêm trị chứng ỉa chảy kéo dài.",
    [
      { name: "Ô mai", amount: "300 quả" },
      { name: "Tế tân", amount: "6 lạng" },
      { name: "Can khương", amount: "10 lạng" },
      { name: "Hoàng liên", amount: "16 lạng" },
      { name: "Phụ tử", amount: "6 lạng", preparation: "nướng bóc bỏ vỏ" },
      { name: "Đương quy", amount: "4 lạng" },
      { name: "Thục tiêu", amount: "4 lạng", preparation: "sao cho đổ mồ hôi" },
      { name: "Quế chi", amount: "6 lạng", preparation: "bỏ vỏ" },
      { name: "Nhân sâm", amount: "6 lạng" },
      { name: "Hoàng bá", amount: "6 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Đương quy tứ nghịch thang",
    "Chân tay quyết lạnh, mạch tế muốn tuyệt (huyết hư hàn trệ, khí huyết không nhu dưỡng được chân tay — dưỡng huyết thông dương kiêm tán hàn).",
    [
      { name: "Đương quy", amount: "3 lạng" },
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "Thược dược", amount: "3 lạng" },
      { name: "Tế tân", amount: "3 lạng" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Thông thảo", amount: "2 lạng" },
      { name: "Đại táo", amount: "25 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Đương quy tứ nghịch gia Ngô thù du sinh khương thang",
    "Như Đương quy tứ nghịch thang nhưng người bệnh trong có hàn lâu ngày (gia Ngô thù du, Sinh khương để ôn trung tán hàn, hòa thêm rượu trắng).",
    [
      { name: "Đương quy", amount: "3 lạng" },
      { name: "Thược dược", amount: "3 lạng" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Thông thảo", amount: "2 lạng" },
      { name: "Đại táo", amount: "25 quả", preparation: "xẻ ra" },
      { name: "Quế chi", amount: "3 lạng" },
      { name: "Tế tân", amount: "3 lạng" },
      { name: "Sinh khương", amount: "1/2 cân", preparation: "thái mỏng" },
      { name: "Ngô thù du", amount: "2 thăng" },
    ]
  );

  await createFormula(
    sid,
    "Ma hoàng thăng ma thang",
    "Thương hàn 6-7 ngày, cho hạ nhiều rồi, mạch thốn trầm trì, chân tay quyết nghịch, mạch hạ bộ không đến, cổ họng không lợi, nhổ ra máu mủ, ỉa chảy không dứt (trên nóng dưới lạnh, chính khí hư, dương khí uất — thanh phần trên, ấm phần dưới).",
    [
      { name: "Ma hoàng", amount: "2,5 lạng", preparation: "bỏ mắt" },
      { name: "Thăng ma", amount: "1,1 lạng" },
      { name: "Đương quy", amount: "1,1 lạng" },
      { name: "Tri mẫu", amount: "18 thù" },
      { name: "Hoàng cầm", amount: "18 thù" },
      { name: "Nuy di", amount: "18 thù" },
      { name: "Thược dược", amount: "6 thù" },
      { name: "Thiên môn đông", amount: "6 thù", preparation: "bỏ tim" },
      { name: "Quế chi", amount: "6 thù", preparation: "bỏ vỏ" },
      { name: "Phục linh", amount: "6 thù" },
      { name: "Chích thảo", amount: "6 thù" },
      { name: "Thạch cao", amount: "6 thù", preparation: "giã nát, đựng túi vải" },
      { name: "Bạch truật", amount: "6 thù" },
      { name: "Can khương", amount: "6 thù" },
    ]
  );

  await createFormula(
    sid,
    "Can khương Hoàng cầm Hoàng liên Nhân sâm thang",
    "Thương hàn vốn do hàn mà ỉa chảy, thầy thuốc lại thổ cho hạ nữa, hàn bị cách trở, ăn vào miệng là mửa ngay (chứng hàn cách — hàn nhiệt cách trở trên dưới).",
    [
      { name: "Can khương", amount: "3 lạng" },
      { name: "Hoàng cầm", amount: "3 lạng" },
      { name: "Hoàng liên", amount: "3 lạng" },
      { name: "Nhân sâm", amount: "3 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Bạch đầu ông thang",
    "Kiết lỵ thuộc nhiệt, mót rặn; hoặc đi ỉa muốn uống nước (có nhiệt) — thanh nhiệt bình can cầm ỉa.",
    [
      { name: "Bạch đầu ông", amount: "2 lạng" },
      { name: "Hoàng bá", amount: "3 lạng" },
      { name: "Hoàng liên", amount: "3 lạng" },
      { name: "Trần bì", amount: "3 lạng" },
    ]
  );

  console.log("Hoàn tất batch 15 Thương hàn luận (6 phương thuốc, điều 339-374).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
