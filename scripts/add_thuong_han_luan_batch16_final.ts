// Thương hàn luận batch 16 (CUỐI CÙNG): điều 375-398 (trang 280-298) — hết
// chương Quyết âm, chương Hoắc loạn, và chương Âm dương dịch/Lao phục sau khi
// khỏi. Đây là batch cuối cùng xử lý trọn vẹn toàn bộ 302 trang sách. Liều
// lượng nguyên văn, không bịa thêm.
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
      authorOrOrg: "Trương Trọng Cảnh; bản dịch Việt ngữ — Nhóm Thương hàn luận K8A, Học viện Y dược học cổ truyền Việt Nam, NXB Y học và Thể dục thể thao, 1968",
      locator: "302 trang, điều 375-398 (trang 280-298) — hết Quyết âm + Hoắc loạn + Âm dương dịch/Lao phục (HẾT SÁCH)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const sid = source.id;

  await createFormula(
    sid,
    "Tứ nghịch gia Nhân sâm thang",
    "Sợ lạnh, mạch vi mà lại ỉa chảy, ỉa chảy hết là mất máu (hoắc loạn, âm dịch bị đoạt) — hồi dương kiêm sinh tân dưỡng huyết.",
    [
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Phụ tử", amount: "1 củ", preparation: "dùng sống, gọt bỏ vỏ, xẻ làm 8 miếng" },
      { name: "Can khương", amount: "1,5 lạng" },
      { name: "Nhân sâm", amount: "1 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Lý trung hoàn (và thang)",
    "Hoắc loạn, lạnh nhiều không uống nước (ôn trung bổ hư, chặn thổ tả). Cũng dùng khi bệnh nặng khỏi rồi hay nhổ lâu ngày không khỏi do tỳ vị hư hàn.",
    [
      { name: "Nhân sâm", amount: "3 lạng" },
      { name: "Can khương", amount: "3 lạng" },
      { name: "Bạch truật", amount: "3 lạng" },
      { name: "Chích thảo", amount: "3 lạng" },
    ]
  );

  await createFormula(
    sid,
    "Thông mạch tứ nghịch gia Trư đởm trấp thang",
    "Hết thổ tả, đổ mồ hôi mà chứng quyết lạnh, chân tay co quắp không giảm, mạch vi muốn tuyệt (âm kiệt dương vong — mở đường khí dương sinh ở hạ tiêu, bổ thêm tân dịch đã kiệt).",
    [
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Can khương", amount: "3 lạng" },
      { name: "Phụ tử", amount: "1 củ to", preparation: "dùng sống, gọt bỏ vỏ, xẻ làm 8 miếng" },
      { name: "Nước mật lợn", amount: "1/2 cáp" },
    ]
  );

  await createFormula(
    sid,
    "Thiêu côn tán",
    "Bệnh âm dương dịch (phạm phòng lúc thương hàn sắp khỏi): mình mẩy nặng nề, kém hơi, bụng dưới đau gò, ran đến bộ sinh dục co thắt, nóng xông lên ngực, đầu nặng, hoa mắt, chân gối co quắp.",
    [{ name: "Đũng quần phụ nữ đốt tro" }]
  );

  await createFormula(
    sid,
    "Chỉ thực Chi tử sị thang",
    "Đàn ông mới khỏi bệnh, vì làm lụng mệt nhọc quá mà bệnh tái phát (lao phục) — thanh nhiệt điều lý trung khí.",
    [
      { name: "Chỉ thực", amount: "3 quả", preparation: "nướng" },
      { name: "Chi tử", amount: "14 quả", preparation: "xẻ ra" },
      { name: "Hương sị", amount: "1 thăng", preparation: "bọc vải lụa" },
    ]
  );

  await createFormula(
    sid,
    "Mẫu lệ trạch tả tán",
    "Bệnh nặng mới khỏi, từ eo lưng trở xuống có thủy khí (thấp nhiệt ủng trệ, bàng quang không tả được — bài huyết trục thủy). Không dùng nếu thuộc tỳ hư không vận hóa hoặc thận hư có hàn.",
    [
      { name: "Mẫu lệ", preparation: "nướng" },
      { name: "Trạch tả" },
      { name: "Thục tất", preparation: "rửa nước nóng để khử mùi tanh" },
      { name: "Đình lịch tử", preparation: "sao" },
      { name: "Thương lục căn", preparation: "sao" },
      { name: "Hải tảo", preparation: "rửa sạch hết vị mặn" },
      { name: "Qua lâu căn" },
    ]
  );

  await createFormula(
    sid,
    "Trúc diệp thạch cao thang",
    "Thương hàn khỏi rồi người gầy yếu, kém hơi, khí nghịch muốn mửa (nguyên khí tổn thương, tân dịch không đủ, kiêm có dư nhiệt — tức Bạch hổ Nhân sâm thang gia giảm).",
    [
      { name: "Trúc diệp", amount: "2 nắm" },
      { name: "Thạch cao", amount: "1 cân" },
      { name: "Bán hạ", amount: "1/2 cân", preparation: "tẩy" },
      { name: "Mạch môn đông", amount: "2 thăng", preparation: "bỏ ruột" },
      { name: "Nhân sâm", amount: "2 lạng" },
      { name: "Chích thảo", amount: "2 lạng" },
      { name: "Gạo tẻ", amount: "1/2 thăng" },
    ]
  );

  console.log("HOÀN TẤT TOÀN BỘ 302 TRANG Thương hàn luận! Batch 16 (7 phương thuốc, điều 375-398).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
