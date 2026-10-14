// Thêm 5 bệnh từ các file .docx trong BỆNH HỌC YHCT: Bí tiểu sau sinh, Parkinson
// (góc nhìn YHCT), Phong thấp (chứng Tý), Hội chứng ống cổ chân (YHHĐ), Viêm xoang
// (kinh nghiệm Can Tổ Vọng). Chỉ nhập đúng nội dung có trong file, không bịa thêm;
// bài thuốc có liều cụ thể thì nhập đủ vị + liều, bài chỉ nêu tên thì chỉ tạo bản ghi tên.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function herb(name: string, sourceId: string) {
  let h = await prisma.herb.findFirst({ where: { standardName: name } });
  if (!h) h = await prisma.herb.create({ data: { standardName: name, status: "DRAFT", sourceId } });
  return h;
}

async function point(name: string, sourceId: string) {
  let p = await prisma.acupuncturePoint.findFirst({ where: { standardName: name } });
  if (!p) p = await prisma.acupuncturePoint.create({ data: { code: "", standardName: name, status: "DRAFT", sourceId } });
  return p;
}

async function makeFormula(opts: {
  name: string;
  indications: string;
  modifications?: string;
  sourceId: string;
  principleId: string;
  herbs?: [string, string?, string?][]; // [name, amount, note]
}) {
  const formula = await prisma.formula.create({
    data: {
      name: opts.name,
      origin: "cổ điển, gia giảm",
      indications: opts.indications,
      modifications: opts.modifications,
      status: "DRAFT",
      sourceId: opts.sourceId,
      principleId: opts.principleId,
    },
  });
  for (const [hname, amount, note] of opts.herbs ?? []) {
    const h = await herb(hname, opts.sourceId);
    await prisma.formulaIngredient.create({
      data: { formulaId: formula.id, herbId: h.id, amount: amount ? `${amount}g` : undefined, note },
    });
  }
  return formula;
}

async function main() {
  // ================= BÍ TIỂU SAU SINH =================
  const srcBiTieu = await prisma.source.create({
    data: {
      title: "Bí tiểu sau sinh",
      sourceType: "Bài viết chuyên khoa",
      authorOrOrg: "BSCKI. Bùi Thị Yến Nhi — Bệnh viện Đại học Y Dược TPHCM, Cơ sở 3",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const biTieu = await prisma.disease.create({
    data: {
      name: "Bí tiểu sau sinh",
      nameModern: "Postpartum urinary retention",
      definition:
        "Người mẹ sau sinh hoặc sau khi rút sonde tiểu đã 6 giờ không thể tự đi tiểu hoặc tiểu rất ít, thể tích nước tiểu tồn lưu ở bàng quang >150mL mà vẫn chưa đi tiểu được.",
      cause:
        "Thường gặp nếu sinh con đầu lòng, chuyển dạ kéo dài, tổn thương tầng sinh môn độ 3-4, con quá to, dùng thuốc giảm đau/gây tê khi sinh. YHCT: sau khi gắng sức sinh, hao thương khí huyết; khí hư toàn thân khiến khí hóa/truyền tống bàng quang suy giảm, phế khí bất túc không thông điều thủy đạo; thận dương hư suy không ôn ấm được bàng quang. Hoặc do chuyển dạ kéo dài, tổn thương bàng quang gây khí trệ huyết ứ, nhiệt tà uất lại làm tắc nghẽn thủy đạo.",
      mechanism: "Không chỉ gây đau trướng bụng dưới mà còn có thể dẫn đến nhiễm trùng đường tiết niệu, ảnh hưởng phục hồi tử cung, mất máu nhiều sau sinh.",
      symptoms: "Đau vùng bụng dưới, có thể có cầu bàng quang, cần thông tiểu để giảm triệu chứng.",
      status: "DRAFT",
      sourceId: srcBiTieu.id,
    },
  });
  {
    const principle = await prisma.treatmentPrinciple.create({
      data: { name: "Bổ khí, ôn thận dương, hóa khí hành thủy", goal: "Thông lợi thủy đạo, tăng cường khí hóa bàng quang", status: "DRAFT", sourceId: srcBiTieu.id },
    });
    const pattern = await prisma.pattern.create({
      data: { name: "Khí hư, Thận dương hư (bí tiểu sau sinh)", description: "Khí hư toàn thân, phế khí bất túc, thận dương hư suy không ôn ấm được bàng quang.", status: "DRAFT", sourceId: srcBiTieu.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: biTieu.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    for (const name of ["Bổ trung ích khí thang gia vị (quế chi, thông thảo, phục linh)", "Tứ quân tử thang gia vị (nhục quế, sinh khương, xa tiền tử, mạch môn)", "Tế sinh thận khí hoàn"]) {
      await prisma.formula.create({ data: { name, origin: "cổ điển, gia giảm", indications: "Bí tiểu sau sinh — thể khí hư, thận dương hư", status: "DRAFT", sourceId: srcBiTieu.id, principleId: principle.id } });
    }

    const principle2 = await prisma.treatmentPrinciple.create({
      data: { name: "Hoạt huyết hóa ứ, hành khí lợi thủy (± thanh nhiệt giải độc, sơ Can)", status: "DRAFT", sourceId: srcBiTieu.id },
    });
    const pattern2 = await prisma.pattern.create({
      data: { name: "Khí trệ huyết ứ, kèm nhiệt tà (bí tiểu sau sinh)", description: "Tổn thương tại bàng quang khi sinh gây khí trệ, huyết ứ, nhiệt tà uất lại làm tắc nghẽn thủy đạo.", status: "DRAFT", sourceId: srcBiTieu.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: biTieu.id, patternId: pattern2.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern2.id, principleId: principle2.id } });
    for (const name of ["Tứ vật thang gia vị", "Tiểu kế ẩm tử"]) {
      await prisma.formula.create({ data: { name, origin: "cổ điển, gia giảm", indications: "Bí tiểu sau sinh — thể khí trệ huyết ứ, kèm nhiệt tà", status: "DRAFT", sourceId: srcBiTieu.id, principleId: principle2.id } });
    }

    const protocol = await prisma.pointProtocol.create({
      data: { name: "Châm cứu — Bí tiểu sau sinh", goal: "Thông lợi thủy đạo, tăng khí hóa bàng quang", status: "DRAFT", sourceId: srcBiTieu.id },
    });
    for (const name of ["Tam âm giao", "Thận du", "Khí hải", "Quan nguyên", "Thủy đạo", "Thái khê", "Âm lăng tuyền", "Hợp cốc", "Trung cực", "Bàng quang du"]) {
      await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: (await point(name, srcBiTieu.id)).id } });
    }
  }

  // ================= PARKINSON (góc nhìn YHCT) =================
  const srcParkinson = await prisma.source.create({
    data: { title: "Bệnh Parkinson theo góc nhìn Y học cổ truyền", sourceType: "Bài viết chuyên khoa", authorOrOrg: "Bs. Âu Văn Khê — Bệnh viện Đại học Y Dược TPHCM, Cơ sở 3", usageRights: "Tài liệu nội bộ người dùng cung cấp" },
  });
  await prisma.disease.create({
    data: {
      name: "Parkinson (góc nhìn YHCT)",
      aliases: "Chứng chấn chiên; Chứng ma mộc",
      nameModern: "Parkinson's disease",
      definition: "Rối loạn thoái hóa thần kinh mãn tính ảnh hưởng khả năng vận động; YHHĐ liên quan đến suy giảm/chết tế bào sản xuất dopamine trong não. YHCT xem là sự mất cân bằng khí huyết/âm dương trong cơ thể, không nhìn theo góc độ cụ thể như YHHĐ.",
      cause:
        "Khí huyết suy (thiếu hụt khí huyết, cơ thể không được nuôi dưỡng đầy đủ, gây run rẩy, cứng cơ); Thận khí hư (suy giảm khả năng kiểm soát cơ nhục, vận động); Phong tà xâm nhập (gây run rẩy, co giật); Đàm thấp ứ trệ (cản trở lưu thông khí huyết).",
      mechanism:
        "Khí huyết bất túc làm suy yếu tạng phủ và hệ thần kinh. Thận khí hư và Can khí uất: thận khí hư khiến tinh khí không đủ nuôi Can, Can khí uất giảm khả năng điều hòa khí huyết. Phong tà xâm nhập và nội phong gây rối loạn lưu thông khí huyết, mất kiểm soát cơ nhục. Đàm thấp ứ trệ làm suy giảm chức năng tạng phủ và kinh lạc.",
      warnings: "Điều trị YHCT (châm cứu, xoa bóp, thảo dược, thực dưỡng) nhằm cân bằng âm dương/khí huyết, bồi bổ thận khí, loại bỏ phong tà và đàm thấp — không có phác đồ huyệt/bài thuốc cụ thể trong nguồn này.",
      status: "DRAFT",
      sourceId: srcParkinson.id,
    },
  });

  // ================= PHONG THẤP (chứng Tý) =================
  const srcPhongThap = await prisma.source.create({
    data: { title: "Những điều chưa biết về bệnh Phong thấp theo Y học cổ truyền", sourceType: "Bài viết tổng hợp", authorOrOrg: "Tổng hợp — Zalo Hải Đường", usageRights: "Tài liệu nội bộ người dùng cung cấp" },
  });
  const phongThap = await prisma.disease.create({
    data: {
      name: "Phong thấp (chứng Tý)",
      aliases: "Tý chứng; Tê thấp",
      nameModern: "Thấp khớp (rheumatism, theo mô tả dân gian)",
      definition: "Bệnh lý chỉ tình trạng tắc nghẽn khí huyết trong kinh mạch do Phong, Hàn, Thấp, Nhiệt thừa lúc cơ thể hư xâm nhập, lưu trú tại kinh lộ, cơ nhục, khớp xương, làm tổn thương huyết mạch.",
      cause: "Nguyên khí hư yếu tạo cơ hội cho tà khí (Phong, Hàn, Thấp) từ bên ngoài xâm nhập; nếu khu trú lâu ở kinh lạc/khớp mà không hóa giải thì chuyển thành Nhiệt.",
      mechanism: "Tà khí thâm nhập cơ biểu và kinh lạc gây cản trở vận hành khí huyết, 'bất thông tắc thống' gây đau nhức cơ bắp, gân cốt, xương khớp co rút, tê bì. Nếu trị không đúng, bệnh nặng có thể chuyển vào Tâm qua mạch (Tâm ủy, khí đoản, đau căng lồng ngực), lâu ngày thành chứng Phong thấp tim (Tâm tý).",
      status: "DRAFT",
      sourceId: srcPhongThap.id,
    },
  });
  const phongThapPatterns: [string, string][] = [
    ["Hành tý (Phong thắng)", "Chỗ đau thay đổi, di chuyển khắp cơ thể; khớp xương đau nhức, hoặc hồng đỏ hoặc sưng; gân mạch co rút; khúc gập chân tay/cổ bất lợi (đầu gối, mắt cá, cùi chỏ, cổ tay tổn hại nhiều nhất); phát nhiệt ác hàn."],
    ["Thống tý (Hàn thắng)", "Thân đau, tay chân lạnh; khớp xương đau nhức, chỗ đau nhất định; ngày nhẹ đêm nặng; gặp nhiệt giảm đau, gặp lạnh đau hơn; chỗ đau da không hồng không nóng. (Còn gọi: Phong thấp lạnh, Tê thấp lạnh)"],
    ["Trứ tý (Thấp thắng)", "Toàn thân ớn lạnh; chân tay khớp xương đau nhức ê ẩm, nặng nề; đi đứng khó khăn; đau tại khu vực nhất định, thấp kết có nước; nằm trở mình khó khăn; ăn uống đầy ứ. (Còn gọi: Phong thấp tê, Tê thấp tê)"],
    ["Nhiệt tý (Nhiệt thắng)", "Gặp ấm nóng đau tăng, gặp lạnh giảm đau; miệng khô khát, phiền táo bất an; ngày nhẹ đêm nặng; nước tiểu vàng/đỏ, tiện bí; đau như lửa đốt dao cắt; gân mạch căng thẳng; phù thủng tăng mau, có thể thấy hồng ban/ẩn chẩn; khớp xương nhiều chỗ đau nhức. (Còn gọi: Phong thấp nhiệt, Tê thấp nhiệt)"],
  ];
  for (const [name, keySigns] of phongThapPatterns) {
    const pattern = await prisma.pattern.create({ data: { name, keySigns, status: "DRAFT", sourceId: srcPhongThap.id } });
    await prisma.diseasePattern.create({ data: { diseaseId: phongThap.id, patternId: pattern.id, relation: "có thể gặp" } });
  }

  // ================= HỘI CHỨNG ỐNG CỔ CHÂN (YHHĐ, tham khảo) =================
  const srcOngCoChan = await prisma.source.create({
    data: { title: "Hội chứng ống cổ chân (Tarsal Tunnel Syndrome)", sourceType: "Bài viết chuyên khoa YHHĐ", authorOrOrg: "Dr Alpha", usageRights: "Tài liệu nội bộ người dùng cung cấp" },
  });
  await prisma.disease.create({
    data: {
      name: "Hội chứng ống cổ chân",
      nameModern: "Tarsal Tunnel Syndrome (TTS)",
      definition: "Kết quả của sự chèn ép dây thần kinh chày đoạn xa dưới mạc giữ cơ gấp bàn chân ở mắt cá trong, gây đau và tê ở bàn chân. Trái ngược với hội chứng ống cổ tay (CTS) rất phổ biến, TTS đặc biệt hiếm. Có thể via thể trước (chèn ép dây thần kinh mác sâu ở mu bàn chân) hoặc thể sau (dây thần kinh chày).",
      cause: "Chấn thương (bong gân, gãy xương), thoái hóa xương hoặc rối loạn mô liên kết; hiếm gặp do giãn tĩnh mạch hoặc tổn thương khối (u mỡ, hạch, nang, túi thừa); thể trước có thể do chấn thương mu bàn chân, gập lòng bàn chân đột ngột quá biên độ, giày chật, ngồi xổm cúi người.",
      symptoms: "Đau quanh mắt cá chân trong, nóng rát, nặng hơn về đêm; dị cảm/mất cảm giác lòng bàn chân; teo cơ bàn chân nội tại (không đặc hiệu); dấu hiệu Tinel dương tính (không đặc hiệu). Thể trước: đau/tê/dị cảm mu bàn chân vùng gian cốt 1, không ảnh hưởng vận động trừ khi nhánh ngoài thần kinh mác sâu cũng bị.",
      differential: "Bệnh lý rễ thần kinh L5-S1/S1-S2, bệnh lý thần kinh chày đoạn gần, bệnh đa dây thần kinh (do tiểu đường), bệnh đám rối thắt lưng cùng, viêm khớp cổ chân. Phản xạ gân mắt cá chân bình thường trong TTS là dấu hiệu phân biệt quan trọng.",
      warnings: "Nhẹ: liệu pháp bảo tồn (thay đổi lối sống, thuốc giảm đau chống viêm, châm cứu, vật lý trị liệu, tránh hoạt động lặp lại). Nặng: cân nhắc phẫu thuật. Đây là tài liệu YHHĐ thuần, không có biện chứng/phác đồ YHCT trong nguồn.",
      status: "DRAFT",
      sourceId: srcOngCoChan.id,
    },
  });

  // ================= VIÊM XOANG (kinh nghiệm Can Tổ Vọng) =================
  const srcViemXoang = await prisma.source.create({
    data: {
      title: "Kinh nghiệm điều trị viêm xoang của Quốc y đại sư Can Tổ Vọng",
      sourceType: "Bài viết dịch, kinh nghiệm lâm sàng",
      authorOrOrg: "Can Tổ Vọng (giáo sư Đại học Trung y Nam Kinh); Bs Hiền Hương dịch — FB Nhân Y Hòa Đạo",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });
  const viemXoang = await prisma.disease.create({
    data: {
      name: "Viêm xoang",
      aliases: "Tị uyên; Não lậu",
      nameModern: "Viêm xoang (sinusitis) — cấp tính và mãn tính",
      definition:
        "Tình trạng viêm phổ biến ở niêm mạc xoang, thường thứ phát sau viêm mũi. Chia 2 loại: cấp tính (thứ phát sau viêm cấp khoang mũi, thường đơn độc) và mãn tính (trên cơ sở viêm xoang cấp, tái phát nhiều lần, khó lành). Xoang hàm trên tỷ lệ mắc cao nhất, tiếp theo xoang sàng, xoang trán; xoang bướm ít gặp.",
      cause:
        "Cấp tính: đa phần do phong hàn hoặc phong nhiệt xâm nhập, khiến phế mất khả năng thanh túc, tà độc trệ kết lại trong mũi, ngăn trở khí cơ, thanh dương không thăng, trọc âm che lấp ở trên. Mãn tính: phế khí hư hàn, ngoại tà xâm nhập; hoặc can đởm uất nhiệt bốc lên thanh khiếu; hoặc tỳ hư thấp thịnh, thanh dương không thăng, trọc âm tràn lên; hoặc tủy hải trống rỗng, hư hỏa thượng viêm — các nguyên nhân có thể ảnh hưởng lẫn nhau.",
      symptoms: "Nghẹt mũi, nhức đầu, chảy nhiều nước mũi là triệu chứng chính; kèm giảm/mất khứu giác. Mãn tính còn kèm chóng mặt mệt mỏi, buồn ngủ, thiếu năng lượng, giảm trí nhớ, khó tập trung.",
      warnings:
        "Gia giảm theo triệu chứng: chảy nước mũi nhiều → cát cánh, ngư tinh thảo; nước mũi trắng nhạt → bạch chỉ, tế tân; đục như mủ → long đởm thảo, hạ khô thảo; trong loãng khó thu lại → Súc tuyền hoàn ôn thận cố nhiếp; niêm mạc đỏ nhạt, nhạy cảm thuốc co mạch (thanh dương không thăng) → thăng ma, cát căn, xương bồ; niêm mạc đỏ sẫm, không nhạy cảm thuốc co mạch (khí trệ huyết ứ) → đào nhân, hồng hoa, đương quy vĩ; đau đầu → mạn kinh tử, hà diệp; đau trước trán (dương minh) → bạch chỉ; 2 bên thái dương (thiếu dương) → sài hồ; vùng chẩm (thái dương) → cát căn, khương hoạt; polyp (thấp trọc nội đình) → chú trọng thuốc hóa thấp.",
      status: "DRAFT",
      sourceId: srcViemXoang.id,
    },
  });

  // --- Cấp tính: 3 thể ---
  {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: "Tân ôn giải biểu (viêm xoang, phong hàn)", status: "DRAFT", sourceId: srcViemXoang.id } });
    const pattern = await prisma.pattern.create({
      data: { name: "Phong hàn xâm nhập (viêm xoang cấp)", keySigns: "Mũi nghẹt không thông, chảy nhiều nước mũi, mất khứu giác tạm thời, niêm mạc mũi nhợt nhạt phù nề, xoang mũi tiết nhiều dịch, sợ lạnh, đau đầu, ít ra mồ hôi, mạch phù khẩn.", status: "DRAFT", sourceId: srcViemXoang.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: viemXoang.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    await makeFormula({
      name: "Kinh phòng bại độc tán hợp Thương nhĩ tử tán",
      indications: "Viêm xoang cấp tính — thể phong hàn xâm nhập",
      sourceId: srcViemXoang.id,
      principleId: principle.id,
      herbs: [["kinh giới", "6"], ["phòng phong", "6"], ["khương hoạt", "6"], ["bạch chỉ", "6"], ["tân di", "10"], ["bạc hà", "6"], ["cát cánh", "6"], ["cam thảo", "3"], ["thương nhĩ tử", "10"], ["xuyên khung", "10"]],
    });
  }
  {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: "Sơ phong thanh nhiệt (viêm xoang, phong nhiệt)", status: "DRAFT", sourceId: srcViemXoang.id } });
    const pattern = await prisma.pattern.create({
      data: { name: "Phong nhiệt xâm nhập (viêm xoang cấp)", keySigns: "Mũi nghẹt không thông, chảy nhiều nước mũi màu vàng, khứu giác giảm/mất, niêm mạc mũi xung huyết, phát sốt, đau đầu ra mồ hôi, ho, miệng khô thích uống nước lạnh, rêu lưỡi vàng nhạt, mạch phù sác.", status: "DRAFT", sourceId: srcViemXoang.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: viemXoang.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    await makeFormula({
      name: "Tang cúc ẩm hợp Thương nhĩ tử tán",
      indications: "Viêm xoang cấp tính — thể phong nhiệt xâm nhập",
      sourceId: srcViemXoang.id,
      principleId: principle.id,
      herbs: [["tang diệp", "10"], ["cúc hoa", "10"], ["kim ngân hoa", "10"], ["liên kiều", "10"], ["bạc hà", "6"], ["thương nhĩ tử", "10"], ["tân di", "10"], ["tang bạch bì", "10"], ["cát cánh", "6"], ["ngư tinh thảo"]],
    });

    const principle1b = await prisma.treatmentPrinciple.create({ data: { name: "Khổ hàn thanh nhiệt tả hỏa (viêm xoang, nhiệt nặng)", status: "DRAFT", sourceId: srcViemXoang.id } });
    const pattern1b = await prisma.pattern.create({
      data: { name: "Phong nhiệt xâm nhập, nhiệt nặng (viêm xoang cấp)", keySigns: "Sốt cao, đau đầu dữ dội, chảy nước mũi vàng đục như mủ, miệng khô muốn uống nước, đại tiện bí kết, lưỡi đỏ rêu vàng, mạch sác.", status: "DRAFT", sourceId: srcViemXoang.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: viemXoang.id, patternId: pattern1b.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern1b.id, principleId: principle1b.id } });
    await makeFormula({
      name: "Hoàng liên giải độc thang hợp Thương nhĩ tử tán",
      indications: "Viêm xoang cấp tính — thể phong nhiệt, nhiệt nặng",
      modifications: "Nước mũi lẫn máu: gia sinh địa 10g, đan bì 6g.",
      sourceId: srcViemXoang.id,
      principleId: principle1b.id,
      herbs: [["thương nhĩ tử", "10"], ["tang bạch bì", "10"], ["nga bất thực thảo", "10"], ["áp chích thảo", "10"], ["ngư tinh thảo", "10"], ["hoàng cầm", "6"], ["sơn chi tử", "10"], ["lô căn", "30"], ["bạc hà", "6"], ["tân di", "10"]],
    });
  }
  {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: "Thanh dương hóa trọc (viêm xoang cấp)", status: "DRAFT", sourceId: srcViemXoang.id } });
    const pattern = await prisma.pattern.create({
      data: { name: "Thanh dương không thăng (viêm xoang cấp)", keySigns: "Thường gặp 7-10 ngày sau phát bệnh: chảy nước mũi nhiều không cầm, nghẹt mũi nghiêm trọng, đau đầu, tư duy chậm chạp, chóng mặt, nặng nề, mắt nhìn mờ, tai nghẹt, miệng dính nhớt, mạch nhu.", status: "DRAFT", sourceId: srcViemXoang.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: viemXoang.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    await makeFormula({
      name: "Hoắc hương chính khí tán hợp Thương nhĩ tử tán",
      indications: "Viêm xoang cấp tính — thể thanh dương không thăng",
      modifications: "Gia thăng ma, sài hồ, cát căn, mạn kinh tử để thăng thanh khai khiếu.",
      sourceId: srcViemXoang.id,
      principleId: principle.id,
      herbs: [["thương nhĩ tử", "10"], ["tân di", "10"], ["hoắc hương", "10"], ["trạch lan", "10"], ["cát cánh", "6"], ["ngư tinh thảo", "10"], ["mạn kinh tử", "10"], ["thăng ma", "3"], ["xương bồ", "3"]],
    });
  }

  // --- Mãn tính: 4 thể ---
  {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: "Ôn phế trừ hàn (viêm xoang mạn)", status: "DRAFT", sourceId: srcViemXoang.id } });
    const pattern = await prisma.pattern.create({
      data: { name: "Phế khí hư hàn, ngoại tà xâm nhập (viêm xoang mạn)", keySigns: "Nghẹt mũi liên tục, thuyên giảm trong môi trường ấm; nước mũi nhiều, trong loãng; nặng hơn khi gặp lạnh; niêm mạc mũi dính nhợt nhạt, phì đại cuốn mũi dưới; sợ gió sợ lạnh, đại tiện phân lỏng, nước tiểu trong dài, mạch tế.", status: "DRAFT", sourceId: srcViemXoang.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: viemXoang.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    for (const name of ["Ôn phế chỉ huyết đan", "Ôn vệ thang gia tất bạt, tất trừng già, tế tân"]) {
      await prisma.formula.create({ data: { name, origin: "cổ điển, gia giảm", indications: "Viêm xoang mãn tính — thể phế khí hư hàn", status: "DRAFT", sourceId: srcViemXoang.id, principleId: principle.id } });
    }
  }
  {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: "Tả Can thanh phế (viêm xoang mạn)", status: "DRAFT", sourceId: srcViemXoang.id } });
    const pattern = await prisma.pattern.create({
      data: { name: "Can đởm uất nhiệt (viêm xoang mạn)", keySigns: "Mũi nghẹt không thông, nhầy đặc đục như mủ, đau đầu dữ dội, miệng khô đắng, táo bón, buồn bực dễ cáu giận, xung huyết niêm mạc mũi, lưỡi đỏ rêu vàng, mạch huyền sác có lực.", status: "DRAFT", sourceId: srcViemXoang.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: viemXoang.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    await prisma.formula.create({ data: { name: "Ức kim tán", origin: "cổ điển", indications: "Viêm xoang mãn tính — thể can đởm uất nhiệt", status: "DRAFT", sourceId: srcViemXoang.id, principleId: principle.id } });
    await makeFormula({
      name: "Long đởm tả can thang (trị viêm xoang mạn, can đởm uất nhiệt)",
      indications: "Viêm xoang mãn tính — thể can đởm uất nhiệt",
      modifications: "Có thể kết hợp uống cùng Hoắc đởm hoàn, mỗi lần 5g, ngày 3 lần.",
      sourceId: srcViemXoang.id,
      principleId: principle.id,
      herbs: [["long đởm thảo", "3"], ["hạ khô thảo", "10"], ["ngư tinh thảo", "10"], ["hoàng cầm", "10"], ["sơn chi tử", "10"], ["bạc hà", "6"], ["thương nhĩ tử", "10"], ["tang diệp", "10"], ["tang bạch bì", "10"], ["lô căn", "30"]],
    });
  }
  {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: "Kiện Tỳ hóa thấp (viêm xoang mạn)", status: "DRAFT", sourceId: srcViemXoang.id } });
    const pattern = await prisma.pattern.create({
      data: { name: "Tỳ hư thấp thịnh (viêm xoang mạn)", keySigns: "Nghẹt mũi dai dẳng, nước mũi nhiều, màu trắng nhiều vàng ít, đặc như keo; cuốn mũi to, niêm mạc trắng nhợt; mệt mỏi, nhức đầu vừa, kém ăn, phân lỏng nát, lưỡi béo non, vết hằn răng ở rìa lưỡi. Nặng: nghẹt mũi nặng, chóng mặt ù tai, hay quên (thanh dương không thăng).", status: "DRAFT", sourceId: srcViemXoang.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: viemXoang.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    await makeFormula({
      name: "Lục quân tử thang (hoặc Nhân sâm bạch truật tán hợp Nhị trần thang)",
      indications: "Viêm xoang mãn tính — thể tỳ hư thấp thịnh",
      modifications: "Gia đình lịch tử 10g để tả phế hóa thấp; nặng (thanh dương không thăng): gia thăng ma, cát căn, sài hồ.",
      sourceId: srcViemXoang.id,
      principleId: principle.id,
      herbs: [["đảng sâm", "10"], ["bạch truật", "10"], ["bạch biển đậu", "10"], ["phục linh", "10"], ["ý dĩ nhân", "10"], ["trần bì", "6"], ["pháp bán hạ", "6"], ["hoắc hương", "6"], ["bạch chỉ", "6"], ["tân di", "10"]],
    });
  }
  {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: "Bổ thận điền tủy, tư âm giáng hỏa (viêm xoang mạn)", status: "DRAFT", sourceId: srcViemXoang.id } });
    const pattern = await prisma.pattern.create({
      data: { name: "Tủy hải trống rỗng (viêm xoang mạn)", keySigns: "Tiền sử bệnh lâu năm, nước mũi trắng/đục, loãng/đặc, mũi tắc nhẹ; chóng mặt, ù tai, di tinh, đới hạ nhiều, miệng khô họng táo, tâm phiền triều nhiệt, đại tiện khô, lưỡi đỏ ít rêu, mạch tế sác.", status: "DRAFT", sourceId: srcViemXoang.id },
    });
    await prisma.diseasePattern.create({ data: { diseaseId: viemXoang.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    for (const name of ["Lục vị địa hoàng hoàn", "Tả quy hoàn", "Súc tuyền hoàn (khi chảy nước mũi/nước mắt khó thu liễm)"]) {
      await prisma.formula.create({ data: { name, origin: "cổ điển", indications: "Viêm xoang mãn tính — thể tủy hải trống rỗng", status: "DRAFT", sourceId: srcViemXoang.id, principleId: principle.id } });
    }
  }

  console.log("Đã thêm 5 bệnh: Bí tiểu sau sinh, Parkinson (YHCT), Phong thấp (chứng Tý), Hội chứng ống cổ chân, Viêm xoang.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
