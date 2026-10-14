// Thêm lý luận "Hợp phương" (phối hợp cổ phương) + 17 hợp phương + 2 ca lâm sàng đầy
// đủ vị/liều từ "Lập phương trong đa bệnh lý. Ths Võ Thanh Phong.pptx" (32 slide).
// Hợp phương chỉ nêu tên 2 phương gốc + công dụng/chủ trị (không có bảng vị thuốc
// riêng trong nguồn) thì chỉ ghi nhận tên + công dụng, KHÔNG suy diễn thành phần.
// Formula trùng tên đã có (Huyết phủ trục ứ thang, Thanh ôn bại độc ẩm) thì bỏ qua,
// không tạo bản ghi trùng lặp.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function herb(name: string, sourceId: string) {
  let h = await prisma.herb.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
  if (!h) h = await prisma.herb.create({ data: { standardName: name, status: "DRAFT", sourceId } });
  return h;
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Lập phương trong đa bệnh lý (hợp phương)",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS. Võ Thanh Phong — dẫn các nghiên cứu Trung Quốc (Diệp Phóng, Giả Xuân Hoa, Lưu Công Vọng...)",
      locator: "32 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const principle = await prisma.treatmentPrinciple.create({
    data: {
      name: "Hợp phương (phối hợp cổ phương trị đa bệnh lý)",
      description:
        "Đa bệnh hình thành do: Đa bệnh nhân (kết hợp nhiều nguyên nhân: lục dâm, thất tình, ẩm thực, lao quyện; nhiều loại tà: đàm ứ hỗ kết, hàn nhiệt thác tạp, phong đàm ứ trở); Đa bệnh vị (nhiều tạng phủ/kinh lạc đồng thời tổn thương, truyền biến theo kinh mạch/tam tiêu/vệ khí dinh huyết/tạng phủ); Đa bệnh thế (bệnh là tiến trình động, chuyển hóa hư thực, hàn nhiệt). Hợp phương: khi có từ 2 chủ chứng trở lên cùng tồn tại, tái tổ hợp các phương dưới sự chỉ đạo của biện chứng luận trị (khác với kiêm chứng chỉ cần gia giảm). Mục đích: mở rộng phạm vi trị liệu, phát sinh công năng mới, giảm biến cố bất lợi.",
      goal: "Phối hợp phương chính xác cho đa bệnh phức tạp, lấy biện chứng luận trị làm nền tảng, luôn giữ vững chủ phương/chủ dược.",
      scope:
        "Căn cứ hợp phương: theo chứng hậu (trực tiếp, nhanh gọn nhưng dễ gò bó, vd Quế chi thang [sợ lạnh ít, sốt nhẹ, mình đau mỏi] hợp Tiểu sài hồ thang [nôn, dưới tâm đầy] → Sài hồ quế chi thang) hoặc theo bệnh cơ (lâm sàng không rõ, cần phân tích sâu, phạm vi rộng hơn, vd Quế chi khử thược dược thang [phù dương giải biểu] hợp Ma tân phụ tử thang [dương hư, hàn tà phạm Thái dương-Thiếu dương] → đều trị dương hư âm ngưng sinh thủy ẩm) — vận dụng linh hoạt cả hai trên lâm sàng. 3 hình thức: Kinh phương + Kinh phương, Kinh phương + Thời phương, Thời phương + Thời phương.",
      limitations:
        "Nguyên tắc: các phương khi hợp phải tuân theo lý pháp phương dược (vd Ma hoàng thang [phát hãn giải biểu] hợp Mẫu lệ tán [cố biểu chỉ hãn] là SAI lý pháp — mục đích ngược nhau); các phương có vị thuốc kiêng kị tương phản thì sai phương dược. Phải xuất phát từ nhu cầu trị pháp: Đồng pháp tương tu (Tứ quân tử thang + Tứ vật thang — cùng pháp bổ, hỗ trợ nhau); Dị pháp giao hỗ (Quế chi thang + Ngọc bình phong tán — pháp khác nhau, bổ trợ chéo); Đa pháp tạp nhữu (Ôn kinh thang = Quế chi thang + Ngô thù du + Tiểu bán hạ thang — nhiều pháp trộn). Quan hệ tầm quan trọng: Chủ-thứ (1 phương chủ, 1 phương hỗ trợ) hoặc Đối đẳng (khó phân chủ thứ) — luôn nắm vững chủ phương, chủ dược.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  type Combo = { name: string; parts: string; indications: string };
  const combos: Combo[] = [
    { name: "Đào nhân thang", parts: "Đào hạch thừa khí thang + Để đương thang", indications: "Hoạt huyết hóa ứ — Kinh nguyệt không thông" },
    { name: "Ôn tỳ thang", parts: "Đại hoàng cam thảo thang + Tứ nghịch gia nhân sâm thang", indications: "Công hạ hàn tích, ôn bổ tỳ dương — Hàn tích, phúc thống" },
    { name: "Phụ tử lý trung thang", parts: "Lý trung thang + Can khương phụ tử thang", indications: "Ôn dương khứ hàn, ích khí kiện tỳ — Tỳ vị hư hàn" },
    { name: "Quế linh bạch truật hoàn", parts: "Linh quế truật cam thang + Ngũ linh tán", indications: "Kiện tỳ lợi thấp chỉ thống — Trường mãn do các loại thấp, phong tý, nuy chứng, thống chứng" },
    { name: "Sài linh thang", parts: "Tiểu sài hồ thang + Ngũ linh tán", indications: "Hòa giải biểu lý, lợi thủy thẩm thấp — Thận bệnh, can bệnh, phong thấp, nham chứng" },
    { name: "Sài hồ kiến trung thang", parts: "Tiểu sài hồ thang + Tiểu kiến trung thang", indications: "Hòa giải khu cơ, ích khí kiến trung — Hư hàn phúc thống" },
    { name: "Tăng dịch thừa khí thang", parts: "Tăng dịch thang + Điều vị thừa khí thang", indications: "Tư âm tăng dịch, tiết nhiệt thông tiện — Nhiệt kết, âm khuy" },
    { name: "Vị linh thang", parts: "Ngũ linh tán + Bình vị tán", indications: "Hòa giải Thiếu dương, khử thấp hòa vị — Thấp ngược" },
    { name: "Sài bình thang", parts: "Tiểu sài hồ thang + Bạch hổ thang", indications: "Hòa sướng khí cơ, bổ điều huyết — Hư lao lâu ngày, vi hàn-vi nhiệt" },
    { name: "Thanh ôn bại độc ẩm", parts: "Bạch hổ thang + Tê giác địa hoàng thang + Hoàng liên giải độc thang + Thanh dinh thang", indications: "Thanh nhiệt giải độc, lương huyết tả hỏa — Ôn dịch nhiệt độc, khí huyết lưỡng phiền" },
    { name: "Huyết phủ trục ứ thang", parts: "Đào hồng tứ vật thang + Tứ nghịch tán", indications: "Hoạt huyết khứ ứ, hành khí chỉ thống — Huyết ứ ở hung trung" },
    { name: "Thanh thử ích khí thang", parts: "Bổ trung ích khí thang + Sinh mạch ẩm + Nhị diệu tán", indications: "Thanh thử ích khí, trừ thấp kiện tỳ — Cảm thử thấp ở người có sẵn khí hư" },
    { name: "Phòng phong thông thánh tán", parts: "Lương cách tán + Tứ vật thang", indications: "Sơ phong giải biểu, thanh nhiệt thông tiện — Phong nhiệt ủng thịnh, biểu lý đều thực" },
    { name: "Ngũ tích tán", parts: "Bình vị tán + Nhị trần thang + Tứ vật thang", indications: "Giải biểu tán hàn thấp, hóa tích — Ngoại cảm phong hàn, nội thương sinh lạnh, hàn thấp gây bệnh" },
    { name: "Tứ thần hoàn", parts: "Nhị thần hoàn + Ngũ vị tử tán", indications: "Ôn thận noãn tỳ, cố trường chỉ tả — Ngũ canh tả" },
    { name: "Ôn thanh ẩm", parts: "Tứ vật thang + Hoàng liên giải độc thang", indications: "Dưỡng huyết thanh hỏa, điều doanh giải độc — Huyết nhiệt uất kết gây bệnh da" },
  ];

  let createdCombo = 0;
  let skippedDup = 0;
  for (const c of combos) {
    const existing = await prisma.formula.findFirst({ where: { name: { equals: c.name, mode: "insensitive" } } });
    if (existing) {
      skippedDup++;
      continue;
    }
    await prisma.formula.create({
      data: { name: c.name, origin: `hợp phương = ${c.parts}`, indications: c.indications, status: "DRAFT", sourceId: source.id, principleId: principle.id },
    });
    createdCombo++;
  }

  // ================= 2 CA LÂM SÀNG — hợp phương đầy đủ vị/liều =================
  const thongKinhFormula = await prisma.formula.create({
    data: {
      name: "Tứ quân tử thang + Đào hồng tứ vật thang gia giảm (trị thống kinh, khí huyết lưỡng hư kiêm huyết ứ)",
      origin: "hợp phương, gia giảm (ca lâm sàng)",
      indications:
        "Thống kinh thể khí huyết lưỡng hư kiêm huyết ứ. Ca: nữ 26 tuổi, 3 năm trước phá thai bằng thuốc gây băng huyết nhiều, từ đó thống kinh; chu kỳ 28-31 ngày, 2 ngày đầu lượng nhiều, đau dữ dội, kinh hơi sẫm có cục; mệt mỏi, ăn được, lưỡi gầy mỏng chất nhợt, rêu trắng nhớt, mạch nhược.",
      modifications:
        "Lý khí chỉ thống: Hương phụ, Trần bì. Tư bổ can thận: Thỏ ty tử, Nữ trinh tử. Mới sạch kinh thì giảm hoạt huyết khứ ứ — bỏ Đào nhân, Hồng hoa; trọng trấn an thần thêm Toan táo nhân 30g, Bá tử nhân 15g, Long cốt 30g, Mẫu lệ 30g.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  const thongKinhHerbs: [string, string][] = [
    ["Thái tử sâm", "20g"], ["Sinh bạch truật", "12g"], ["Phục linh", "20g"], ["Cam thảo", "6g"],
    ["Đương quy", "20g"], ["Xuyên khung", "10g"], ["Sinh địa", "15g"], ["Thục địa", "15g"],
    ["Xích thược", "12g"], ["Bạch thược", "12g"], ["Đào nhân", "12g"], ["Hồng hoa", "10g"],
    ["Hương phụ", "12g"], ["Xuyên Ngưu tất", "20g"], ["Hoài Ngưu tất", "20g"],
  ];
  for (const [name, amount] of thongKinhHerbs) {
    const h = await herb(name, source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: thongKinhFormula.id, herbId: h.id, amount } });
  }

  const fdGerdFormula = await prisma.formula.create({
    data: {
      name: "Tiểu sài hồ thang + Bán hạ hậu phác thang gia giảm (trị rối loạn tiêu hóa chức năng + trào ngược dạ dày thực quản)",
      origin: "hợp phương, gia giảm (ca lâm sàng)",
      indications:
        "Nam 50 tuổi, ợ chua + đầy bụng 1 năm; khó chịu thượng vị, cồn cào, trung tiện nhiều, ruột sôi, tâm phiền mất ngủ, mệt mỏi, lưỡi bệu có dấu ấn răng, mạch huyền. YHHĐ: Rối loạn tiêu hóa chức năng (FD) + Trào ngược dạ dày thực quản (GERD). Pháp trị ban đầu (Hương sa lục quân thang gia giảm) chưa hết hẳn → đổi sang hợp phương này: bĩ mãn + tâm phiền dùng Tiểu sài hồ thang, mai hạch khí dùng Bán hạ hậu phác thang.",
      modifications: "Tái khám: cồn cào cải thiện rõ, dị vật họng giảm, hết trung tiện, hôi miệng giảm.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  const fdGerdHerbs: [string, string][] = [
    ["Sài hồ", "9g"], ["Hoàng cầm", "9g"], ["Nhân sâm", "9g"], ["Can khương", "6g"], ["Đại táo", "10g"],
    ["Bán hạ", "9g"], ["Chích thảo (Cam thảo chích)", "6g"], ["Hậu phác", "18g"], ["Tử tô cành", "18g"], ["Trần bì", "9g"],
  ];
  for (const [name, amount] of fdGerdHerbs) {
    const h = await herb(name, source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: fdGerdFormula.id, herbId: h.id, amount } });
  }

  console.log(`Đã thêm lý luận Hợp phương + ${createdCombo} hợp phương (bỏ qua ${skippedDup} trùng tên đã có) + 2 ca lâm sàng đầy đủ vị/liều.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
