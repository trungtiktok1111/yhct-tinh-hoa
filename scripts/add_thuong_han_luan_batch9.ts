// Thương hàn luận batch 9: điều 171-183 (trang 164-175) — cuối chương Thái
// dương (Qua đế tán, Bạch hổ thang, Hoàng cầm/Hoàng liên thang, nhóm Phụ tử
// trị phong thấp, Chích Cam thảo thang/Phục mạch thang). Liều lượng nguyên
// văn, không bịa thêm. Đây là batch cuối cùng của chương Thái dương — điều
// 184 trở đi bắt đầu chương Dương minh.
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
      locator: "302 trang, điều 171-183 (trang 164-175), cuối chương Thái dương",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Qua đế tán",
    "Bệnh như chứng Quế chi nhưng đầu không đau, gáy không cứng, mạch thốn hơi phù, giữa ngực đầy rắn, khí xông lên cổ họng, thở không được (đàm thực ở ngực — dùng phép thổ). Không dùng cho người mất máu, hư yếu.",
    [
      { name: "Qua đế", amount: "1 phân", preparation: "sao vàng" },
      { name: "Xích tiểu đậu", amount: "1 phân", preparation: "sao vàng" },
      { name: "Hương sị" },
    ]
  );

  await createFormula(
    sid,
    "Bạch hổ gia Nhân sâm thang",
    "Thương hàn sau khi cho thổ/hạ, 7-8 ngày không giải, nhiệt kết ở lý, biểu lý đều nhiệt, khát lắm muốn uống nước đến mấy thăng, lưỡi khô ráo phiền (thanh tiết lý nhiệt kiêm sinh tân dịch). Cũng dùng khi: thương hàn không nóng dữ, miệng ráo khát, tâm phiền, lưng hơi lạnh; hoặc khát muốn uống nước mà không có biểu chứng. Cấm dùng khi còn biểu chứng (mạch phù phát sốt không mồ hôi).",
    [
      { name: "Tri mẫu", amount: "6 lạng" },
      { name: "Thạch cao", amount: "1 cân", preparation: "giã" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Gạo tẻ", amount: "6 cáp" },
      { name: "Nhân sâm" },
    ]
  );

  await createFormula(
    sid,
    "Hoàng cầm thang",
    "Hợp bệnh Thái dương Thiếu dương, tự ỉa chảy (tà ở dưới, nhiệt ở trong — thanh lý nhiệt). Nếu nôn thì gia Bán hạ, Sinh khương.",
    [
      { name: "Hoàng cầm", amount: "3 lạng" },
      { name: "Thược dược", amount: "2 lạng" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Hoàng liên thang",
    "Thương hàn trong ngực có nhiệt, trong dạ dày có tà khí, trong bụng đau, muốn nôn mửa (thượng nhiệt hạ hàn — thuốc hàn nhiệt dùng chung).",
    [
      { name: "Hoàng liên", amount: "3 lạng" },
      { name: "Chích thảo", amount: "3 lạng" },
      { name: "Can khương", amount: "3 lạng" },
      { name: "Quế chi", amount: "3 lạng" },
      { name: "Nhân sâm", amount: "2 lạng" },
      { name: "Bán hạ", amount: "1/2 thăng", preparation: "tẩy" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Quế chi Phụ tử thang",
    "Thương hàn 8-9 ngày, phong thấp va chạm nhau, mình mẩy đau phiền không thể tự trở trăn, không nôn không khát, mạch phù hư mà sáp (ôn kinh trừ thấp).",
    [
      { name: "Quế chi", amount: "4 lạng", preparation: "bỏ vỏ" },
      { name: "Phụ tử", amount: "3 củ", preparation: "nướng bóc vỏ, xẻ ra" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
      { name: "Chích thảo", amount: "2 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Khử Quế gia Bạch truật thang",
    "Như Quế chi Phụ tử thang nhưng người bệnh đại tiện rắn, tiểu tiện lợi (phong đã lui mà thấp còn — kiện tỳ táo thấp, không cần thông dương nữa nên khử Quế).",
    [
      { name: "Phụ tử", amount: "3 củ", preparation: "nướng, bóc bỏ vỏ, xé ra" },
      { name: "Bạch truật", amount: "4 lạng" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Đại táo", amount: "12 quả", preparation: "xẻ ra" },
    ]
  );

  await createFormula(
    sid,
    "Cam thảo Phụ tử thang",
    "Phong thấp va chạm nhau, xương khớp đau phiền, đau siết không co duỗi được, động đến đau dữ dội, đổ mồ hôi, khí đoản, tiểu tiện không lợi, ghê gió, không muốn cởi áo, hoặc mình sưng nhẹ (phong thấp thịnh mà dương khí kém, phong thấp đã vào sâu khớp xương nên dùng Cam thảo làm quân để công từ từ).",
    [
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Phụ tử", amount: "2 củ", preparation: "thui, gọt bỏ vỏ, xẻ ra" },
      { name: "Bạch truật", amount: "2 lạng" },
      { name: "Quế chi", amount: "4 lạng", preparation: "bỏ vỏ" },
    ]
  );

  await createFormula(
    sid,
    "Bạch hổ thang",
    "Thương hàn mạch phù hoạt (biểu lý đều nhiệt — Thái dương hóa nhiệt chuyển thành Dương minh, nhiệt thịnh gây đổ nhiều mồ hôi, phiền khát).",
    [
      { name: "Tri mẫu", amount: "6 lạng" },
      { name: "Thạch cao", amount: "1 cân", preparation: "giã" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Gạo tẻ", amount: "6 cáp" },
    ]
  );

  await createFormula(
    sid,
    "Chích Cam thảo thang (Phục mạch thang)",
    "Thương hàn, mạch kết đại, tâm động hồi hộp (tâm huyết không đủ, tâm dương không phấn chấn — thông dương phục mạch, tư âm bổ huyết).",
    [
      { name: "Chích thảo", amount: "4 lạng" },
      { name: "Sinh khương", amount: "3 lạng", preparation: "thái mỏng" },
      { name: "Nhân sâm", amount: "2 lạng" },
      { name: "Sinh địa", amount: "1 cân" },
      { name: "Quế chi", amount: "3 lạng", preparation: "bỏ vỏ" },
      { name: "A giao", amount: "2 lạng" },
      { name: "Mạch môn", amount: "1/2 cân", preparation: "bỏ tim" },
      { name: "Ma nhân", amount: "1/2 thăng" },
      { name: "Đại táo", amount: "30 quả", preparation: "xẻ ra" },
    ]
  );

  console.log("Hoàn tất batch 9 Thương hàn luận (9 phương thuốc, điều 171-183 — hết chương Thái dương).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
