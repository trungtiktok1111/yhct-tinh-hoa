// DEMO — KHÔNG DÙNG ĐIỀU TRỊ
// Dữ liệu minh họa để chứng minh kiến trúc (bệnh -> chứng hậu -> pháp trị -> bài thuốc -> vị thuốc -> huyệt -> nguồn).
// Đây là kiến thức lý luận YHCT kinh điển, phổ biến trong giáo trình (không trích xuất từ file riêng của người dùng).
// Trước khi dùng cho mục đích thật, PHẢI được chuyên gia đối chiếu lại với tài liệu chính thức và thẩm định.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.formulaIngredient.deleteMany(),
    prisma.pointProtocolItem.deleteMany(),
    prisma.diseasePattern.deleteMany(),
    prisma.patternPrinciple.deleteMany(),
    prisma.claim.deleteMany(),
    prisma.formula.deleteMany(),
    prisma.pointProtocol.deleteMany(),
    prisma.manualTherapy.deleteMany(),
    prisma.acupuncturePoint.deleteMany(),
    prisma.herb.deleteMany(),
    prisma.treatmentPrinciple.deleteMany(),
    prisma.pattern.deleteMany(),
    prisma.disease.deleteMany(),
    prisma.clinicalCase.deleteMany(),
    prisma.source.deleteMany(),
  ]);

  const srcLyLuan = await prisma.source.create({
    data: {
      title: "Lý luận cơ bản Y học cổ truyền (giáo trình)",
      sourceType: "Giáo trình",
      authorOrOrg: "DEMO — cần thay bằng tài liệu chính thức đã thẩm định",
      usageRights: "Nội bộ demo",
    },
  });

  const srcThuongHan = await prisma.source.create({
    data: {
      title: "Thương hàn luận (kinh điển)",
      sourceType: "Kinh điển",
      authorOrOrg: "Trương Trọng Cảnh — DEMO, cần đối chiếu bản dịch chính thức",
    },
  });

  const srcChamCuu = await prisma.source.create({
    data: {
      title: "Châm cứu học cơ bản (giáo trình)",
      sourceType: "Giáo trình",
      authorOrOrg: "DEMO — cần thay bằng tài liệu chính thức đã thẩm định",
    },
  });

  // 1. Bệnh
  const camMao = await prisma.disease.create({
    data: {
      name: "Cảm mạo",
      aliases: "Cảm phong hàn; Cảm phong nhiệt",
      nameModern: "Nhiễm khuẩn hô hấp trên (tham khảo, không đồng nhất khái niệm)",
      definition: "Bệnh lý ngoại cảm thường gặp do phong hàn hoặc phong nhiệt xâm phạm phần biểu.",
      cause: "Ngoại tà (phong, hàn, nhiệt) thừa lúc chính khí suy xâm nhập biểu.",
      mechanism: "Phong hàn/phong nhiệt phạm biểu, vệ khí mất điều hòa, phế khí không tuyên giáng.",
      symptoms: "Sợ lạnh/sợ gió, có hoặc không sốt, đau đầu, ngạt mũi, chảy nước mũi, ho.",
      differential: "Cần phân biệt cảm phong hàn và cảm phong nhiệt qua tính chất sốt, mồ hôi, chất lưỡi, mạch.",
      warnings: "Theo dõi dấu hiệu bội nhiễm, sốt cao kéo dài hoặc triệu chứng nặng lên cần đánh giá theo YHHĐ.",
      status: "APPROVED",
      sourceId: srcLyLuan.id,
    },
  });

  // 2. Chứng hậu
  const phongHan = await prisma.pattern.create({
    data: {
      name: "Phong hàn phạm biểu",
      description: "Chứng hậu thuộc biểu hàn, do phong hàn xâm phạm cơ biểu.",
      supportCriteria: "Sợ lạnh nhiều, sốt nhẹ hoặc không sốt, không ra mồ hôi, rêu lưỡi trắng mỏng, mạch phù khẩn.",
      againstCriteria: "Sốt cao, khát nước, họng đỏ đau, rêu lưỡi vàng (gợi ý phong nhiệt thay vì phong hàn).",
      keySigns: "Sợ lạnh rõ, không ra mồ hôi, mạch phù khẩn.",
      missingDataPrompts: "Cần hỏi: có ra mồ hôi không, tính chất đờm, màu rêu lưỡi, mạch cụ thể.",
      status: "APPROVED",
      sourceId: srcLyLuan.id,
    },
  });

  await prisma.diseasePattern.create({
    data: {
      diseaseId: camMao.id,
      patternId: phongHan.id,
      relation: "có thể gặp",
      rationale: "Cảm mạo thể phong hàn là một trong hai thể lâm sàng thường gặp nhất.",
    },
  });

  // 3. Pháp trị
  const tanOnGiaiBieu = await prisma.treatmentPrinciple.create({
    data: {
      name: "Tân ôn giải biểu",
      description: "Dùng vị thuốc cay ấm để phát tán phong hàn ở biểu.",
      goal: "Giải biểu, khu phong tán hàn, điều hòa dinh vệ.",
      scope: "Áp dụng cho chứng biểu hàn (phong hàn phạm biểu) ở giai đoạn sớm.",
      limitations: "Không dùng khi đã có biểu nhiệt rõ hoặc chính khí quá hư nhược.",
      status: "APPROVED",
      sourceId: srcLyLuan.id,
    },
  });

  await prisma.patternPrinciple.create({
    data: {
      patternId: phongHan.id,
      principleId: tanOnGiaiBieu.id,
      rationale: "Chứng biểu hàn cần pháp cay ấm để phát tán, không dùng pháp thanh nhiệt.",
    },
  });

  // 4. Vị thuốc
  const queChi = await prisma.herb.create({
    data: {
      standardName: "Quế chi",
      latinName: "Cinnamomi Ramulus",
      partUsed: "Cành non",
      natureFlavor: "Cay, ngọt, ấm",
      meridians: "Tâm, Phế, Bàng quang",
      actions: "Phát hãn giải cơ, ôn thông kinh mạch",
      indications: "Cảm mạo phong hàn biểu hư, đau khớp do hàn",
      dosage: "3–9g/ngày (theo nguồn, cần đối chiếu khi dùng thật)",
      safetyNotes: "Thận trọng khi có nhiệt chứng, phụ nữ có thai cần tham khảo chuyên gia.",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  const bachThuoc = await prisma.herb.create({
    data: {
      standardName: "Bạch thược",
      latinName: "Paeoniae Radix Alba",
      natureFlavor: "Đắng, chua, hơi hàn",
      meridians: "Can, Tỳ",
      actions: "Dưỡng huyết liễm âm, hòa doanh",
      indications: "Phối hợp Quế chi điều hòa dinh vệ",
      dosage: "6–12g/ngày (theo nguồn)",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  const camThao = await prisma.herb.create({
    data: {
      standardName: "Cam thảo (chích)",
      latinName: "Glycyrrhizae Radix",
      natureFlavor: "Ngọt, bình",
      meridians: "Tỳ, Vị, Phế, Tâm",
      actions: "Điều hòa các vị thuốc, bổ trung ích khí",
      indications: "Dùng làm sứ dược trong nhiều bài thuốc",
      dosage: "3–6g/ngày (theo nguồn)",
      safetyNotes: "Dùng liều cao kéo dài có thể ảnh hưởng huyết áp/kali — cần thận trọng.",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  const sinhKhuong = await prisma.herb.create({
    data: {
      standardName: "Sinh khương",
      latinName: "Zingiberis Rhizoma Recens",
      natureFlavor: "Cay, ấm",
      meridians: "Phế, Tỳ, Vị",
      actions: "Phát hãn giải biểu, ôn trung chỉ ẩu",
      indications: "Hỗ trợ Quế chi phát tán phong hàn",
      dosage: "3–9g/ngày (theo nguồn)",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  const daiTao = await prisma.herb.create({
    data: {
      standardName: "Đại táo",
      latinName: "Jujubae Fructus",
      natureFlavor: "Ngọt, ấm",
      meridians: "Tỳ, Vị",
      actions: "Bổ trung ích khí, dưỡng huyết an thần",
      indications: "Phối hợp điều hòa dinh vệ cùng Quế chi, Sinh khương",
      dosage: "3–5 quả (theo nguồn)",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  // 5. Bài thuốc
  const queChiThang = await prisma.formula.create({
    data: {
      name: "Quế chi thang",
      origin: "Cổ điển",
      indications: "Cảm mạo phong hàn thể biểu hư (có ra mồ hôi, sợ gió).",
      preparation: "Sắc uống ấm, sau uống cháo loãng và giữ ấm để ra mồ hôi nhẹ.",
      modifications: "Gia giảm tùy mức độ biểu hư và triệu chứng kèm theo — cần chuyên gia xác nhận.",
      safetyNotes: "Không dùng khi biểu thực (không ra mồ hôi) hoặc có nhiệt chứng rõ.",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
      principleId: tanOnGiaiBieu.id,
    },
  });

  await prisma.formulaIngredient.createMany({
    data: [
      { formulaId: queChiThang.id, herbId: queChi.id, amount: "9", unit: "g", role: "Quân", note: "Phát tán phong hàn, giải cơ" },
      { formulaId: queChiThang.id, herbId: bachThuoc.id, amount: "9", unit: "g", role: "Thần", note: "Liễm âm hòa doanh, phối Quế chi điều hòa dinh vệ" },
      { formulaId: queChiThang.id, herbId: sinhKhuong.id, amount: "9", unit: "g", role: "Tá", note: "Hỗ trợ phát tán" },
      { formulaId: queChiThang.id, herbId: daiTao.id, amount: "3", unit: "quả", role: "Tá", note: "Hòa vị, hỗ trợ dinh khí" },
      { formulaId: queChiThang.id, herbId: camThao.id, amount: "6", unit: "g", role: "Sứ", note: "Điều hòa các vị" },
    ],
  });

  // 6. Huyệt vị
  const phongTri = await prisma.acupuncturePoint.create({
    data: {
      code: "GB20",
      standardName: "Phong trì",
      meridian: "Đởm",
      location: "Chỗ lõm giữa cơ ức đòn chũm và cơ thang, ngang mức bờ dưới xương chẩm.",
      actions: "Khu phong giải biểu, sáng mắt, thanh nhiệt",
      technique: "Châm xiên hướng mũi đối diện, độ sâu theo huấn luyện đã được phê duyệt.",
      contraindications: "Thận trọng với người có bất thường mạch máu vùng cổ; cần đào tạo đúng chuyên môn.",
      riskNotes: "Gần hành não và động mạch đốt sống — chỉ thực hiện bởi người đủ chuyên môn.",
      status: "APPROVED",
      sourceId: srcChamCuu.id,
    },
  });

  const hopCoc = await prisma.acupuncturePoint.create({
    data: {
      code: "LI4",
      standardName: "Hợp cốc",
      meridian: "Đại trường",
      location: "Giữa xương bàn tay 1 và 2, phía mu bàn tay.",
      actions: "Giải biểu, chỉ thống, thanh nhiệt",
      technique: "Châm thẳng 0.5–1 thốn (theo nguồn, cần đối chiếu đào tạo thực tế).",
      contraindications: "Thận trọng ở phụ nữ có thai.",
      status: "APPROVED",
      sourceId: srcChamCuu.id,
    },
  });

  const lietKhuyet = await prisma.acupuncturePoint.create({
    data: {
      code: "LU7",
      standardName: "Liệt khuyết",
      meridian: "Phế",
      location: "Trên lằn chỉ cổ tay 1.5 thốn, bờ ngoài xương quay.",
      actions: "Tuyên phế giải biểu, thông điều nhâm mạch",
      technique: "Châm xiên theo hướng khuỷu tay.",
      status: "APPROVED",
      sourceId: srcChamCuu.id,
    },
  });

  const phoiHuyetGiaiBieu = await prisma.pointProtocol.create({
    data: {
      name: "Phối huyệt giải biểu phong hàn",
      goal: "Hỗ trợ giải biểu cho chứng cảm mạo phong hàn.",
      conditions: "Dùng khi chứng còn ở biểu, chưa truyền lý.",
      warnings: "Không thay thế thuốc khi có dấu hiệu nặng hoặc nghi nhiễm trùng nặng.",
      status: "APPROVED",
      sourceId: srcChamCuu.id,
      principleId: tanOnGiaiBieu.id,
    },
  });

  await prisma.pointProtocolItem.createMany({
    data: [
      { protocolId: phoiHuyetGiaiBieu.id, pointId: phongTri.id, role: "Chủ huyệt", note: "Khu phong giải biểu" },
      { protocolId: phoiHuyetGiaiBieu.id, pointId: hopCoc.id, role: "Phối huyệt", note: "Tăng giải biểu, chỉ thống" },
      { protocolId: phoiHuyetGiaiBieu.id, pointId: lietKhuyet.id, role: "Phối huyệt", note: "Tuyên phế, hỗ trợ giải biểu" },
    ],
  });

  console.log("Seed DEMO hoàn tất — dữ liệu minh họa, không dùng điều trị thật.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
