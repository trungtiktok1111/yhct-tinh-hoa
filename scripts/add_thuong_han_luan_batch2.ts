// Thương hàn luận (bản dịch đầy đủ, 302 trang) — batch 2: các phương thuốc có
// thành phần + liều lượng đầy đủ từ điều 36 đến điều 73 (trang 67-95), chương
// Thái dương. File đã marked "partial" từ trước (chỉ có Quế chi thang/Ma hoàng
// thang) — batch này bổ sung 12 phương mới, chưa xử lý hết toàn bộ 302 trang.
// Liều lượng lấy nguyên văn (lạng/thăng/cáp theo đơn vị cổ), không bịa thêm.
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
      data: {
        formulaId: formula.id,
        herbId,
        amount: ing.amount,
        preparation: ing.preparation,
      },
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
      locator: "302 trang, điều 36-73 (trang 67-95), chương Thái dương",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Đại thanh long thang",
    "Thái dương trúng phong, mạch phù khẩn, phát sốt sợ lạnh, mình đau nhức, không ra mồ hôi mà buồn phiền vật vã (biểu hàn kiêm lý nhiệt). Cấm dùng khi mạch vi nhược, tự đổ mồ hôi (sẽ gây quyết nghịch, gân thịt máy giật).",
    [
      { name: "Ma hoàng", amount: "6 lạng", preparation: "bỏ mắt" },
      { name: "Quế chi", amount: "2 lạng", preparation: "bỏ vỏ" },
      { name: "Cam thảo", amount: "2 lạng" },
      { name: "Hạnh nhân", amount: "40 quả", preparation: "bỏ vỏ và đầu nhọn" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
      { name: "Đại táo", amount: "10 quả", preparation: "xé ra" },
      { name: "Thạch cao", amount: "1 cục bằng quả trứng gà", preparation: "giã nhỏ" },
    ]
  );

  await createFormula(
    sid,
    "Tiểu thanh long thang",
    "Thương hàn biểu chứng không giải, dưới tâm có thủy khí: nôn khan, phát sốt mà ho, hoặc khát, hoặc ỉa chảy, hoặc nghẹn, hoặc tiểu tiện không thông lợi, bụng dưới đầy hoặc suyễn thở.",
    [
      { name: "Ma hoàng", amount: "3 lạng", preparation: "bỏ mắt" },
      { name: "Thược dược", amount: "3 lạng" },
      { name: "Can khương", amount: "3 lạng" },
      { name: "Ngũ vị tử", amount: "1/2 thăng" },
      { name: "Cam thảo", amount: "3 lạng" },
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Tế tân", amount: "3 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Can khương phụ tử thang",
    "Sau khi hạ rồi lại phát hãn, ban ngày buồn phiền vật vã không ngủ được, ban đêm yên tĩnh, không nôn không khát, không có biểu chứng, mạch trầm vi, mình không nóng dữ (dương khí sắp tiêu hết, chứng nguy cấp cần hồi dương).",
    [
      { name: "Can khương", amount: "1 lạng" },
      { name: "Phụ tử", amount: "1 củ", preparation: "dùng sống, bỏ vỏ, xẻ làm 8 miếng" },
    ]
  );

  await createFormula(
    sid,
    "Quế chi gia Thược dược Sinh khương Nhân sâm Tân gia thang",
    "Sau khi phát hãn, mình đau nhức, mạch trầm trì (hao tổn dinh huyết, cân mạch mất nuôi dưỡng).",
    [
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "Thược dược", amount: "4 lạng" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Nhân sâm", amount: "3 lạng" },
      { name: "Đại táo", amount: "21 quả", preparation: "xẻ ra" },
      { name: "Sinh khương", amount: "4 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Ma hoàng Hạnh nhân Cam thảo Thạch cao thang",
    "Sau khi phát hãn, mồ hôi ra mà suyễn, không có chứng nóng dữ (nhiệt tà bức bách vào phế).",
    [
      { name: "Ma hoàng", amount: "4 lạng", preparation: "bỏ mắt" },
      { name: "Hạnh nhân", amount: "50 hạt", preparation: "bỏ vỏ và đầu nhọn" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Thạch cao", amount: "1/2 cân", preparation: "giã, túi vải bọc lại" },
    ]
  );

  await createFormula(
    sid,
    "Quế chi Cam thảo thang",
    "Phát hãn nhiều quá, người tự chắp tay để lên ngực, tâm hồi hộp, muốn được ấn tay vào (tổn hại tâm dương).",
    [
      { name: "Quế chi", amount: "4 lạng", preparation: "bỏ vỏ" },
      { name: "Cam thảo", amount: "2 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Phục linh Quế chi Cam thảo Đại táo thang",
    "Sau khi phát hãn, dưới rốn máy động bần bật, muốn phát chứng bôn đồn (tâm dương không phấn chấn, thủy khí xông lên).",
    [
      { name: "Phục linh", amount: "1/2 cân" },
      { name: "Quế chi", amount: "4 lạng", preparation: "bỏ vỏ" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Đại táo", amount: "15 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Hậu phác Sinh khương Bán hạ Cam thảo Nhân sâm thang",
    "Sau khi phát hãn mà bụng chướng đầy (Tỳ Vị bị tổn thương, mất chức năng kiện vận, khí trệ).",
    [
      { name: "Hậu phác", amount: "1/2 cân", preparation: "nướng bỏ vỏ" },
      { name: "Sinh khương", amount: "1/2 cân", preparation: "thái mỏng" },
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Cam thảo", amount: "2 lạng" },
      { name: "Nhân sâm", amount: "1 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Phục linh Quế chi Bạch truật Cam thảo thang",
    "Thương hàn, sau khi cho thổ hoặc hạ mà vùng vị quản đầy ách lên khí xung lên ngực, đứng dậy thì đầu choáng váng, mạch trầm khẩn (tỳ dương hư, thủy khí nghịch lên). Nếu phát hãn nhầm thì thân thể run rảy lảo đảo.",
    [
      { name: "Phục linh", amount: "4 lạng" },
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "Bạch truật", amount: "2 lạng" },
      { name: "Cam thảo", amount: "2 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Thược dược Cam thảo Phụ tử thang",
    "Phát hãn rồi mà bệnh không giải, trái lại sợ lạnh là bệnh đã hư (dương hư, âm không đủ).",
    [
      { name: "Thược dược", amount: "3 lạng" },
      { name: "Chích thảo", amount: "3 lạng" },
      { name: "Phụ tử", amount: "1 củ", preparation: "nướng cạo bỏ, xé ra làm 8 miếng" },
    ]
  );

  await createFormula(
    sid,
    "Phục linh tứ nghịch thang",
    "Phát hãn hoặc hạ rồi mà bệnh vẫn không giải, buồn phiền vật vã (âm dương đều hư, thủy hỏa không giúp nhau).",
    [
      { name: "Phục linh", amount: "4 lạng" },
      { name: "Nhân sâm", amount: "1 lạng" },
      { name: "Phụ tử", amount: "1 củ", preparation: "dùng sống, bóc bỏ vỏ, xẻ ra làm 8 miếng" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Can khương", amount: "1,5 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Ngũ linh tán",
    "Bệnh Thái dương sau khi phát hãn, mạch phù, tiểu tiện không lợi, hơi sốt mà tiêu khát (nước đọng không khí hóa được, biểu chưa giải). Thương hàn đổ mồ hôi mà khát cũng dùng bài này; không khát thì dùng Phục linh Cam thảo thang.",
    [
      { name: "Trư linh", amount: "18 thù", preparation: "bỏ vỏ" },
      { name: "Trạch tả", amount: "1 lạng 6 thù" },
      { name: "Bạch truật", amount: "18 thù" },
      { name: "Phục linh", amount: "18 thù" },
      { name: "Quế chi", amount: "1/2 lạng", preparation: "bỏ vỏ" },
    ]
  );

  console.log("Hoàn tất batch 2 Thương hàn luận (12 phương thuốc, điều 36-73).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
