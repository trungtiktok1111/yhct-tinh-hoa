// Dữ liệu seed: phần Thái dương trúng phong / Thái dương thương hàn / Quế chi thang / Ma hoàng thang
// đã được đối chiếu với nguyên văn thật trong file của người dùng:
// "D:\Tài liệu đông y\tài liệu y học\BỆNH HỌC YHCT\LÝ LUẬN YHCT - R\thuong han luan Full (Repaired).pdf"
// (Bài giảng Thương Hàn - Thương hàn luận giảng nghĩa, Học viện Trung Y Nam Kinh Trung Quốc, NXB Y học),
// điều 12–13 (tr.42–44) và điều 35 (tr.67). Các mục khác (Pháp trị, Huyệt vị, Cảm mạo...) vẫn là dữ liệu
// MINH HỌA chưa đối chiếu nguồn thật — KHÔNG DÙNG ĐIỀU TRỊ cho đến khi được chuyên gia thẩm định.
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
      title: "Bài giảng Thương Hàn (Thương hàn luận giảng nghĩa)",
      sourceType: "Giáo trình dịch kinh điển",
      authorOrOrg: "Học viện Trung Y Nam Kinh Trung Quốc — NXB Y học (bản dịch)",
      locator: "Điều 12–13 (tr.42–44): Quế chi thang; Điều 35 (tr.67): Ma hoàng thang",
      usageRights: "Tài liệu nội bộ người dùng cung cấp — cần đối chiếu bản gốc Hán văn trước khi dùng thật",
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

  // 2. Chứng hậu — hai thể biểu hàn phân biệt theo Thương hàn luận (có mồ hôi / không mồ hôi)
  const thuongHanBieuThuc = await prisma.pattern.create({
    data: {
      name: "Thái dương thương hàn (biểu thực)",
      description:
        "Hàn tà bó chặt phần biểu, biểu khí uất lại. Theo Thương hàn luận điều 35: 'nhức đầu phát sốt, đau mình, đau lưng, đau khớp xương, ghê gió, không có mồ hôi mà suyễn thở'.",
      supportCriteria: "Đau mình, đau lưng, đau khớp xương, không ra mồ hôi, suyễn thở, sợ lạnh/ghê gió, phát sốt, nhức đầu",
      againstCriteria: "Ra mồ hôi tự nhiên (gợi ý biểu hư — Thái dương trúng phong, dùng Quế chi thang chứ không phải Ma hoàng thang)",
      keySigns: "Không ra mồ hôi, suyễn thở, đau nhức toàn thân",
      missingDataPrompts: "Cần hỏi rõ: có ra mồ hôi tự nhiên không, mức độ đau nhức, có suyễn thở không",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  const trungPhongBieuHu = await prisma.pattern.create({
    data: {
      name: "Thái dương trúng phong (biểu hư, vinh vệ bất hòa)",
      description:
        "Theo Thương hàn luận điều 12: 'mạch dương phù mà âm nhược, dương phù thì nhiệt tự phát, âm nhược thì mồ hôi tự ra, gai gai ớn lạnh, rợn rợn ghê gió, hâm hấp phát sốt, thở kêu nôn khan'.",
      supportCriteria: "Mạch phù hoãn, phát sốt, mồ hôi tự ra, sợ gió, ghê gió, nhức đầu, nôn khan",
      againstCriteria: "Đau khớp xương dữ dội, không ra mồ hôi, suyễn thở (gợi ý thương hàn biểu thực — Ma hoàng thang)",
      keySigns: "Mồ hôi tự ra, sợ gió, mạch phù hoãn",
      missingDataPrompts: "Cần hỏi: có ra mồ hôi tự nhiên không, mức độ sợ gió/sợ lạnh, có nôn khan không",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  await prisma.diseasePattern.createMany({
    data: [
      {
        diseaseId: camMao.id,
        patternId: thuongHanBieuThuc.id,
        relation: "có thể gặp",
        rationale: "Cảm mạo thể biểu thực (không mồ hôi) là một trong hai thể lâm sàng thường gặp.",
      },
      {
        diseaseId: camMao.id,
        patternId: trungPhongBieuHu.id,
        relation: "có thể gặp",
        rationale: "Cảm mạo thể biểu hư (có mồ hôi), cần phân biệt với thể biểu thực.",
      },
    ],
  });

  // 3. Pháp trị
  const tanOnGiaiBieu = await prisma.treatmentPrinciple.create({
    data: {
      name: "Tân ôn giải biểu",
      description: "Dùng vị thuốc cay ấm để phát tán phong hàn ở biểu.",
      goal: "Giải biểu, khu phong tán hàn, điều hòa dinh vệ.",
      scope: "Áp dụng cho chứng biểu hàn (biểu thực hoặc biểu hư) ở giai đoạn sớm.",
      limitations: "Không dùng khi đã có biểu nhiệt rõ hoặc chính khí quá hư nhược.",
      status: "APPROVED",
      sourceId: srcLyLuan.id,
    },
  });

  await prisma.patternPrinciple.createMany({
    data: [
      {
        patternId: thuongHanBieuThuc.id,
        principleId: tanOnGiaiBieu.id,
        rationale: "Biểu thực cần phát hãn mạnh (Ma hoàng thang).",
      },
      {
        patternId: trungPhongBieuHu.id,
        principleId: tanOnGiaiBieu.id,
        rationale: "Biểu hư cần giải cơ điều hòa vinh vệ (Quế chi thang), khác với biểu thực dùng phát hãn mạnh.",
      },
    ],
  });

  // 4. Vị thuốc
  const queChi = await prisma.herb.create({
    data: {
      standardName: "Quế chi",
      latinName: "Cinnamomi Ramulus",
      partUsed: "Cành non",
      natureFlavor: "Cay, ngọt, ấm",
      meridians: "Tâm, Phế, Bàng quang",
      actions: "Tuyên phát phần dương, thông dương khí",
      indications: "Thái dương trúng phong (biểu hư) và thương hàn (biểu thực, phối Ma hoàng)",
      dosage: "2–3 lạng theo cổ phương (cần đối chiếu quy đổi dược điển hiện hành)",
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
      actions: "Điều hòa phần âm, thông điều huyết mạch",
      indications: "Phối hợp Quế chi điều hòa dinh vệ",
      dosage: "3 lạng theo cổ phương (cần đối chiếu quy đổi)",
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
      actions: "Điều hòa các vị thuốc, hòa trung ích khí",
      indications: "Dùng làm sứ dược trong nhiều bài thuốc",
      dosage: "1–2 lạng theo cổ phương (cần đối chiếu quy đổi)",
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
      actions: "Tân tán, ấm dạ dày, chống mửa, giúp Quế chi thông dương",
      indications: "Hỗ trợ Quế chi trong Quế chi thang",
      dosage: "3 lạng theo cổ phương (cần đối chiếu quy đổi)",
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
      actions: "Ích khí hòa trung, giúp Bạch thược điều hòa phần âm",
      indications: "Phối hợp điều hòa dinh vệ cùng Quế chi, Sinh khương",
      dosage: "12 quả theo cổ phương (cần đối chiếu quy đổi)",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  const maHoang = await prisma.herb.create({
    data: {
      standardName: "Ma hoàng",
      partUsed: "Thân cành (bỏ mắt/đốt theo cổ phương)",
      actions: "Phát tán phong hàn, mở lông da, phát hãn, cắt cơn suyễn thở",
      indications: "Thương hàn biểu thực: không ra mồ hôi mà suyễn thở, đau nhức toàn thân",
      dosage: "3 lạng theo cổ phương (cần đối chiếu quy đổi dược điển hiện hành)",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  const hanhNhan = await prisma.herb.create({
    data: {
      standardName: "Hạnh nhân",
      partUsed: "Nhân hạt (bỏ vỏ và đầu nhọn)",
      actions: "Thông lợi phế khí, cắt cơn suyễn thở",
      dosage: "70 hạt theo cổ phương (cần đối chiếu quy đổi)",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
    },
  });

  // 5. Bài thuốc
  const queChiThang = await prisma.formula.create({
    data: {
      name: "Quế chi thang",
      origin: "Cổ điển",
      indications: "Thái dương trúng phong: mạch phù hoãn, phát sốt, mồ hôi tự ra, sợ gió, nhức đầu, nôn khan (điều 12–13).",
      preparation:
        "Sắc với nước, lọc bỏ bã, uống ấm. Uống xong húp cháo nóng loãng để trợ dược lực, đắp chăn cho ra mồ hôi dâm dấp (không để ra đầm dề). Nếu uống một lần đã ra mồ hôi khỏi bệnh thì ngừng, không cần uống hết thang.",
      modifications: "Gia giảm tùy mức độ biểu hư và triệu chứng kèm theo — cần chuyên gia xác nhận.",
      safetyNotes:
        "Cốt yếu ở chỗ CÓ ra mồ hôi — không dùng khi không ra mồ hôi (đó là chứng của Ma hoàng thang). Kiêng đồ sống lạnh, dầu mỡ, thịt miến, gia vị cay nồng (hành, tỏi, hẹ...), rượu sữa, đồ tanh hôi.",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
      principleId: tanOnGiaiBieu.id,
    },
  });

  await prisma.formulaIngredient.createMany({
    data: [
      { formulaId: queChiThang.id, herbId: queChi.id, amount: "3", unit: "lạng (cổ phương)", role: "Quân", note: "Tuyên phát phần dương, làm khí vận hành" },
      { formulaId: queChiThang.id, herbId: bachThuoc.id, amount: "3", unit: "lạng (cổ phương)", role: "Thần", note: "Điều hòa phần âm, phối Quế chi điều hòa dinh vệ" },
      { formulaId: queChiThang.id, herbId: sinhKhuong.id, amount: "3", unit: "lạng (cổ phương)", role: "Tá", note: "Giúp Quế chi thông phần dương" },
      { formulaId: queChiThang.id, herbId: daiTao.id, amount: "12", unit: "quả (cổ phương)", role: "Tá", note: "Giúp Bạch thược điều hòa phần âm" },
      { formulaId: queChiThang.id, herbId: camThao.id, amount: "2", unit: "lạng (cổ phương)", role: "Sứ", note: "Điều hòa các vị" },
    ],
  });

  const maHoangThang = await prisma.formula.create({
    data: {
      name: "Ma hoàng thang",
      origin: "Cổ điển",
      indications:
        "Thái dương thương hàn (biểu thực): nhức đầu phát sốt, đau mình, đau lưng, đau khớp xương, ghê gió, KHÔNG có mồ hôi mà suyễn thở (điều 35).",
      preparation:
        "Nấu Ma hoàng trước cho cạn bớt, vớt bọt, cho các vị còn lại vào sắc, lọc bỏ bã, uống ấm. Đắp chăn kín cho ra mồ hôi (không cần ăn cháo như Quế chi thang).",
      safetyNotes: "Là phương phát hãn mạnh (tuấn tễ) — không dùng khi biểu đã có mồ hôi hoặc chính khí hư.",
      status: "APPROVED",
      sourceId: srcThuongHan.id,
      principleId: tanOnGiaiBieu.id,
    },
  });

  await prisma.formulaIngredient.createMany({
    data: [
      { formulaId: maHoangThang.id, herbId: maHoang.id, amount: "3", unit: "lạng (cổ phương)", role: "Quân", note: "Phát tán phong hàn, phát hãn, cắt suyễn" },
      { formulaId: maHoangThang.id, herbId: queChi.id, amount: "2", unit: "lạng (cổ phương)", role: "Thần", note: "Thông dương khí, giúp Ma hoàng giải biểu phát hãn" },
      { formulaId: maHoangThang.id, herbId: hanhNhan.id, amount: "70", unit: "hạt (cổ phương)", role: "Tá", note: "Thông lợi phế khí, cắt cơn suyễn thở" },
      { formulaId: maHoangThang.id, herbId: camThao.id, amount: "1", unit: "lạng (cổ phương)", role: "Sứ", note: "Điều hòa trung tiêu" },
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

  console.log("Seed hoàn tất — phần Thái dương trúng phong/thương hàn + Quế chi/Ma hoàng thang có nguồn thật, phần còn lại vẫn là DEMO.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
