// Thêm nội dung từ "Mô hình bệnh – chứng hậu – chứng trạng" (ThS Võ Thanh Phong,
// 30 slide): lý luận mô hình 病-证-症 kết hợp YHHĐ+YHCT, Disease "Tiền ung thư dạ
// dày" + "Đới hạ" với chứng hậu/bài thuốc đủ vị-liều từ ca lâm sàng thật, và ghi
// chú ngắn về ứng dụng ở K vú. Trích nguyên văn, không bịa thêm.
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
      title: "Mô hình bệnh – chứng hậu – chứng trạng (病–证–症)",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS. Võ Thanh Phong — dẫn nhiều nghiên cứu Trung y hiện đại (Đồng Tiểu Lâm và khác)",
      locator: "30 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const principle = await prisma.treatmentPrinciple.create({
    data: {
      name: "Mô hình kết hợp Bệnh - Chứng hậu - Chứng trạng (病-证-症结合)",
      description:
        "Bệnh (病, theo YHHĐ): tận dụng nguyên nhân, cơ chế bệnh sinh, vị trí giải phẫu, kết hợp ưu thế cận lâm sàng hiện đại, nguyên tắc/mục tiêu điều trị, công cụ đánh giá tiên lượng. Chứng hậu (证, theo YHCT): bệnh vị, bệnh nhân, bệnh tính, bệnh thế trong giai đoạn nhất định — quan niệm chỉnh thể, đơn giản hóa tình huống đa bệnh lý, cá thể hóa điều trị, có ưu thế khi chỉ có triệu chứng mà không có bất thường thực thể. Chứng trạng (症): hiện tượng biểu hiện trong quá trình bệnh, mở rộng gồm cả bất thường cận lâm sàng — tác động vào chứng trạng giúp cải thiện nhanh/rõ, tận dụng kinh nghiệm dụng dược theo triệu chứng đơn lẻ.",
      goal: "Phát huy ưu điểm, bổ sung khiếm khuyết của YHCT và YHHĐ; hướng hiện đại hóa YHCT; tăng hiệu quả lâm sàng; giao tiếp tốt giữa YHHĐ và YHCT.",
      scope:
        "Vấn đề thực tế cần mô hình này giải quyết: bệnh nhân cùng bệnh (YHHĐ) nhưng biểu hiện không giống nhau hoàn toàn; bệnh nhân có triệu chứng nhưng không tìm ra bất thường thực thể; không phải bệnh nào cũng có liệu pháp can thiệp hiệu quả; tác dụng phụ của can thiệp đôi khi nhiều hơn lợi ích; YHCT không thể phân biệt rạch ròi một số bệnh lý chỉ bằng biện chứng.",
      limitations:
        "Biện bệnh (dùng vị thuốc theo chỉ số/bệnh lý cụ thể, không chỉ theo chứng hậu): tổn thương gan do thuốc → Nhân trần, Tam thất, Ngũ vị tử (bảo vệ gan, giảm transaminase); rối loạn lipid máu → Hồng khúc, Giảo cổ lam, Chế hà thủ ô; hạ đường huyết → Hoàng cầm, Hoàng liên, Thiên hoa phấn; hạ áp → Thiên ma, Câu đằng. Biện chứng trạng (dùng liều lớn 1 vị theo triệu chứng nổi trội, làm Quân dược): mất ngủ nhiều → Toan táo nhân liều lớn; đau nhiều → Xuyên ô liều lớn; ra mồ hôi nhiều → Long cốt, Mẫu lệ liều lớn.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  // ================= TIỀN UNG THƯ DẠ DÀY =================
  const tienKDaDay = await prisma.disease.create({
    data: {
      name: "Tiền ung thư dạ dày (viêm teo dạ dày mạn kèm dị sản)",
      nameModern: "Gastric precancerous lesion (viêm dạ dày mạn teo, dị sản ruột/không điển hình)",
      cause:
        "Theo mô hình Bệnh-Chứng hậu-Chứng trạng: Bệnh = Thấp, Nhiệt, Độc, Ứ gây 'ung' (khối u) → pháp: thanh nhiệt giải độc trừ thấp (Bạch hoa xà thiệt thảo, Bán chi liên — kháng ung thư, thúc đẩy apoptosis tế bào K) và hoạt huyết hóa ứ tiêu trưng (Khương hoàng, Toàn yết...).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  const tienKPatterns: [string, string][] = [
    ["Tỳ Vị thấp nhiệt (tiền K dạ dày)", "Thanh trọc an trung thang"],
    ["Tỳ Vị khí trệ (tiền K dạ dày)", "Tứ nghịch tán gia giảm"],
    ["Tỳ Vị khí hư (tiền K dạ dày)", "Hương sa lục quân tử thang gia giảm"],
    ["Khí âm lưỡng hư (tiền K dạ dày)", "Tiêu bĩ phương gia giảm"],
  ];
  for (const [patName, formulaName] of tienKPatterns) {
    const pattern = await prisma.pattern.create({ data: { name: patName, status: "DRAFT", sourceId: source.id } });
    await prisma.diseasePattern.create({ data: { diseaseId: tienKDaDay.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.formula.create({ data: { name: formulaName, origin: "hiện đại (dẫn nguồn nghiên cứu Trung y)", indications: `Tiền ung thư dạ dày — thể ${patName}`, status: "DRAFT", sourceId: source.id, principleId: principle.id } });
  }
  await prisma.formula.create({
    data: {
      name: "Bạch hoa xà thiệt thảo + Bán chi liên (biện bệnh — thanh nhiệt giải độc trừ thấp)",
      origin: "biện bệnh (dùng theo cơ chế bệnh lý, không chỉ theo chứng hậu)",
      indications: "Tiền ung thư dạ dày — kháng ung thư, thúc đẩy apoptosis tế bào K.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  const caseTienK = await prisma.formula.create({
    data: {
      name: "Phương dược gia giảm trị viêm dạ dày mạn teo + dị sản (ca lâm sàng)",
      origin: "hiện đại, gia giảm (ca lâm sàng)",
      indications:
        "Nữ 66 tuổi, đầy bụng khó tiêu nhiều năm. Nội soi: viêm dạ dày mạn teo kèm trợt, dị sản ruột nhẹ, dị sản không điển hình trung bình-nặng, Hp(-). Hiện đầy bụng, ợ hơi, ăn được, đại tiện 1 lần/ngày, lưỡi đỏ, rêu nhớt, mạch tế huyền.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  for (const [name, amount] of [
    ["Hoắc hương", "10g"], ["Pháp bán hạ", "15g"], ["Mộc hương", "10g (hậu hạ)"], ["Tô ngạnh", "15g"],
    ["Trần bì", "10g"], ["Đại phúc bì", "15g"], ["Thị đế", "10g"], ["Thũng tiết phong", "30g"],
    ["Bạch hoa xà thiệt thảo", "30g"], ["Khương hoàng", "15g"], ["Bán chi liên", "30g"], ["Cam thảo", "6g"],
  ] as [string, string][]) {
    const h = await herb(name, source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: caseTienK.id, herbId: h.id, amount } });
  }
  // Biện chứng trạng theo triệu chứng nổi trội (tiền K dạ dày) — ghi nhận cặp vị thuốc-triệu chứng, không tạo công thức đầy đủ
  await prisma.formula.create({
    data: {
      name: "Dụng dược theo chứng trạng nổi trội (tiền K dạ dày)",
      origin: "biện chứng trạng",
      indications:
        "Đau thượng vị: Khương hoàng, Diên hồ sách. Nóng rát thượng vị: Chi tử. Đầy bụng: Đại phúc bì, Chỉ xác. Buồn nôn/nôn: Hoắc hương, Sa nhân. Miệng đắng: Bồ công anh, Hoàng cầm. Mất ngủ: Trân châu mẫu (và vị khác bị cắt trong slide gốc).",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });

  // ================= ĐỚI HẠ =================
  const doiHa = await prisma.disease.create({
    data: {
      name: "Đới hạ (khí hư/bạch đới bất thường)",
      nameModern: "Viêm âm đạo / viêm cổ tử cung / viêm nội mạc tử cung (tùy nguyên nhân)",
      cause:
        "Theo mô hình Bệnh-Chứng hậu-Chứng trạng: Viêm âm đạo → bệnh vị Hạ tiêu, chứng hậu Thực/Thấp nhiệt → thanh nhiệt táo thấp làm chủ. Viêm cổ tử cung → bệnh vị CTC cơ nhục, chứng hậu Tỳ hư/tà luyến → kiện Tỳ ích khí làm chủ. Viêm nội mạc tử cung → bệnh vị Can Thận, chứng hậu uất nhiệt/tà xâm → tư âm huyết (và các pháp khác theo bản gốc).",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  const doiHaPatterns: [string, string][] = [
    ["Thấp nhiệt uẩn kết (đới hạ)", "Long đởm tả can thang"],
    ["Tỳ khí khuy hư (đới hạ)", "Phó Thanh Chủ Hoàn đới thang"],
    ["Tỳ Thận dương hư (đới hạ)", "Tri bá địa hoàng hoàn"],
    ["Can Thận âm hư (đới hạ)", "Tri bá địa hoàng hoàn"],
  ];
  for (const [patName, formulaName] of doiHaPatterns) {
    const pattern = await prisma.pattern.create({ data: { name: patName, status: "DRAFT", sourceId: source.id } });
    await prisma.diseasePattern.create({ data: { diseaseId: doiHa.id, patternId: pattern.id, relation: "có thể gặp" } });
    const existing = await prisma.formula.findFirst({ where: { name: { equals: formulaName, mode: "insensitive" } } });
    if (!existing) {
      await prisma.formula.create({ data: { name: formulaName, origin: "cổ điển/hiện đại", indications: `Đới hạ — thể ${patName}`, status: "DRAFT", sourceId: source.id, principleId: principle.id } });
    }
  }
  await prisma.formula.create({
    data: {
      name: "Dụng dược theo chứng trạng nổi trội (đới hạ)",
      origin: "biện chứng trạng",
      indications:
        "Đới hạ mùi hôi nặng: Bán chi liên, Xuyên tâm liên. Tiểu gắt buốt: Ngưu tất, Hổ trượng, Nhẫn đông đằng. Tay chân lạnh: Can khương, Phụ tử. Đau lạnh bụng: Ngô thù du, Hương phụ, Ngải diệp. Tiểu đêm, lưng gối lạnh (và triệu chứng khác bị cắt trong slide gốc).",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  const caseDoiHa = await prisma.formula.create({
    data: {
      name: "Phương dược gia giảm trị đới hạ (ca lâm sàng — kiện Tỳ ích khí, thanh nhiệt táo thấp)",
      origin: "hiện đại, gia giảm (ca lâm sàng)",
      indications:
        "Nữ 34 tuổi, 1 năm trước bạch đới bất thường tái phát, rõ nhất 4-5 ngày sau sạch kinh. Tiền sử viêm âm đạo do nấm (đã điều trị kháng nấm), HPV(+), có vòng tránh thai. Hiện bạch đới nhiều, dạng bã đậu, không mùi, không ngứa, gây khó chịu.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: principle.id,
    },
  });
  for (const [name, amount] of [
    ["Bắc hoàng kỳ", "60g"], ["Phòng phong", "20g"], ["Đảng sâm", "20g"], ["Thổ phục linh", "30g"],
    ["Bạch truật", "30g (sống)"], ["Khổ sâm", "20g"], ["Trần bì", "20g"], ["Mẫu đơn bì", "40g"],
    ["Bồ công anh", "30g"], ["Bạch biển đậu", "30g"], ["Thổ miết trùng", "12g"], ["Đương quy", "20g"], ["Xích tiểu đậu", "30g"],
  ] as [string, string][]) {
    const h = await herb(name, source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: caseDoiHa.id, herbId: h.id, amount } });
  }

  // ================= K VÚ (ghi chú ngắn, không đủ dữ liệu để lập Disease riêng) =================
  const pKVu = await prisma.treatmentPrinciple.create({
    data: {
      name: "Hỗ trợ YHCT giai đoạn củng cố K vú (theo thụ thể hormone)",
      description:
        "ER(+)/PR(+): điều trị hormone gây biểu hiện giống hội chứng tiền mãn kinh — biện chứng Thận khí hư, Xung Nhâm thất điều → pháp bổ tiên thiên, ích thận tinh; dùng Bạch hoa kỳ kỷ thang (Bạch hoa xà thiệt thảo, Nga truật, Ý dĩ nhân, Nữ trinh tử, Câu kỷ tử, Tang thầm, Hoàng kỳ). Her-2(+): xâm lấn cao, tiên lượng kém, tái phát/di căn cao hơn — lâm sàng biểu hiện Tỳ Thận lưỡng hư (Tỳ hư là chính): Tỳ Vị hư nhược → thấp khốn Tỳ Vị → thấp trọc trung trở → thấp nhiệt uẩn Vị; pháp ích khí kiện Tỳ, khứ thấp hóa đàm.",
      limitations:
        "Dụng dược theo chứng trạng kèm theo: mất ngủ/lo âu/trầm cảm → Toan táo nhân, Dạ giao đằng, Hợp hoan bì. Táo bón → Sinh Bạch truật 30-90g, Chỉ thực, Lai phục tử, Hỏa ma nhân, Khổ hạnh nhân. Rối loạn lipid máu → Hồng khúc, Tiêu tam tiên. Tăng acid uric máu → Tỳ giải, Thổ phục linh.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  const bachHoaKyKy = await prisma.formula.create({
    data: {
      name: "Bạch hoa kỳ kỷ thang",
      origin: "hiện đại (hỗ trợ K vú ER+/PR+)",
      indications: "Giai đoạn củng cố K vú ER(+)/PR(+), biểu hiện giống hội chứng tiền mãn kinh do điều trị hormone — Thận khí hư, Xung Nhâm thất điều.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: pKVu.id,
    },
  });
  for (const name of ["Bạch hoa xà thiệt thảo", "Nga truật", "Ý dĩ nhân", "Nữ trinh tử", "Câu kỷ tử", "Tang thầm", "Hoàng kỳ"]) {
    const h = await herb(name, source.id);
    await prisma.formulaIngredient.create({ data: { formulaId: bachHoaKyKy.id, herbId: h.id } });
  }

  console.log("Đã thêm lý luận Bệnh-Chứng hậu-Chứng trạng + Tiền ung thư dạ dày + Đới hạ (đủ ca lâm sàng) + hỗ trợ K vú.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
