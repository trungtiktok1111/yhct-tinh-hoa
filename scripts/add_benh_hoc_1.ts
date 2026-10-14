// Thêm 3 bệnh vào Bệnh học YHCT: Viêm tai giữa, Viêm tai giữa hóa mủ, Zona thần kinh + đau sau Zona.
// Nguồn: 2 file PDF trong D:\Tài liệu đông y\tài liệu y học\BỆNH HỌC YHCT\
// - "VIÊM TAI GIỮA theo YHCT.pdf"
// - "Điều trị Zona và đau sau Zona VLTL YHCT - Ths. Lê Đức Thịnh 36tr.pdf"
// Chỉ nhập đúng nội dung có trong file, không bịa thêm. Bài thuốc không có liệt kê
// vị thuốc trong nguồn thì vẫn tạo bản ghi Formula (để tra cứu tên) nhưng không gán
// Herb/liều lượng giả.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findPoint(name: string) {
  return prisma.acupuncturePoint.findFirst({ where: { standardName: name } });
}

async function main() {
  const srcNhiVYHCT = await prisma.source.create({
    data: {
      title: "Viêm tai giữa theo Y học cổ truyền",
      sourceType: "Tài liệu chuyên khoa",
      authorOrOrg: "DEMO — chưa rõ tác giả/đơn vị gốc, cần đối chiếu trước khi dùng thật",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const srcZona = await prisma.source.create({
    data: {
      title: "Điều trị Zona và đau sau Zona — YHCT và Phục hồi chức năng",
      sourceType: "Bài giảng",
      authorOrOrg: "Ths. Bs. Lê Đức Thịnh",
      locator: "36 trang, mục III. Quan điểm điều trị theo YHCT",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  // ================= VIÊM TAI GIỮA (thể viêm, Catarrhal Otitis Media) =================
  const viemTaiGiua = await prisma.disease.create({
    data: {
      name: "Viêm tai giữa",
      aliases: "Trung Nhĩ Viêm; Nhĩ bế; Nhĩ trưởng; Nhĩ nùng; Đình nhĩ; Thối tai; Tai chảy mủ; Sưng màng trống",
      nameModern: "Otitis Media (Catarrhal Otitis Media)",
      definition:
        "Viêm tai giữa là tình trạng viêm toàn bộ hệ thống hòm nhĩ và xương chũm (nằm sau màng nhĩ), thường có tạo dịch trong hòm nhĩ, dịch này có thể nhiễm trùng hoặc vô trùng. Là dạng bệnh thường gặp ở trẻ nhỏ.",
      cause:
        "YHHĐ: viêm nhiễm vùng mũi họng do vi trùng hoặc siêu vi; tắc vòi nhĩ (sùi, u vòm họng, viêm mũi xoang mủ); viêm nhiễm đường hô hấp, dị nguyên, bệnh lý trào ngược, không khí ô nhiễm, thời tiết lạnh. YHCT: do phong tà xâm nhập gây bế tắc kinh lạc, hoặc do Thận Tỳ hư tổn.",
      mechanism:
        "Nếu không chữa trị kịp thời có thể dẫn đến viêm tai xương chũm cấp, thủng màng nhĩ, giảm thính lực, xơ hóa màng nhĩ, liệt thần kinh mặt; nặng hơn có thể biến chứng trong sọ não (viêm màng não, áp xe não, áp xe ngoài màng cứng).",
      symptoms:
        "Khởi đầu đau tai, sau đó chảy nước tai và giảm sức nghe. Có thể kèm ù tai, chóng mặt, sốt, sưng sau tai, chán ăn, khó ngủ. Đặc điểm chẩn đoán: tai căng đau, thính lực giảm.",
      differential:
        "Chứng ráy tai bế tắc (tai căng đau, có cục ráy tai làm bế tắc tai); Chứng vật lạ vào tai (tai bế, đau, nếu trùng vào tai có cảm giác như trùng bò).",
      warnings:
        "Không tự dùng oxy già nhỏ tai (có thể làm bong biểu bì bảo vệ, chậm lành, gây chít hẹp ống tai). Không rắc thuốc bột kháng sinh viên vào tai (tá dược gây bít tắc dẫn lưu, có thể dẫn đến viêm xương chũm hoặc biến chứng nội sọ).",
      status: "DRAFT",
      sourceId: srcNhiVYHCT.id,
    },
  });

  const vtgPatternDefs = [
    {
      name: "Ngoại cảm phong hàn (viêm tai giữa)",
      keySigns: "Tai căng, hơi đau, nghe có tiếng kêu trong tai, nhức đầu, nghẹt mũi, tai bế, chảy nước trong, sợ lạnh, mạch Phù Khẩn.",
      principle: "Sơ phong tán hàn",
      formula: "Tân di tán",
    },
    {
      name: "Phong nhiệt xâm nhập tai",
      keySigns: "Tai căng, hơi đau nhức, tai có tiếng kêu, sốt, đau đầu, nghẹt mũi, chảy nước mũi, miệng khô họng ráo, đầu lưỡi đỏ, mạch Phù Sác.",
      principle: "Sơ phong thanh nhiệt",
      formula: "Ngân kiều tán",
    },
    {
      name: "Can hỏa nung đốt (tai)",
      keySigns: "Tai căng đau như bị chèn, tai kêu như tiếng ve, chóng mặt hoa mắt, miệng đắng, phiền táo, ngực sườn đầy đau, rêu lưỡi vàng, mạch Huyền.",
      principle: "Thanh tả Can hỏa",
      formula: "Long đởm tả can thang",
    },
    {
      name: "Thấp khí đình trệ trong tai",
      keySigns: "Tai căng bế tắc, thính lực giảm, đầu căng nặng, rêu lưỡi trắng bệu, mạch Hoãn.",
      principle: "Ôn tán thủy thấp",
      formula: "Chỉ khung tán",
    },
    {
      name: "Khí trệ huyết ứ (tai)",
      keySigns: "Tai căng, bế tắc, tai ù, thính lực giảm, chất lưỡi tím hoặc có điểm ứ huyết, mạch Huyền Sáp.",
      principle: "Hành khí hoạt huyết",
      formula: "Thông khiếu hoạt huyết thang gia Xương bồ",
    },
    {
      name: "Tỳ Vị khí hư (tai)",
      keySigns: "Tai căng bế, ù tai, thính lực kém, ăn uống giảm sút, mệt mỏi, lưỡi lạt, mạch Nhược.",
      principle: "Kiện Tỳ thông dương",
      formula: "Bổ trung ích khí thang gia Xương hồ, Bạch thược",
    },
    {
      name: "Can Thận âm hư (tai)",
      keySigns: "Tai căng, tai ù, thính lực giảm, chóng mặt, ù tai, ngủ kém, lưng đau, miệng khô, phiền nhiệt, lưỡi đỏ, ít rêu.",
      principle: "Dưỡng âm thông khiếu",
      formula: "Nhĩ lung tả nhụy hoàn gia Xương bồ, Bạch thược",
    },
  ];

  for (const d of vtgPatternDefs) {
    const principle = await prisma.treatmentPrinciple.create({
      data: { name: d.principle, status: "DRAFT", sourceId: srcNhiVYHCT.id },
    });
    const pattern = await prisma.pattern.create({
      data: {
        name: d.name,
        keySigns: d.keySigns,
        status: "DRAFT",
        sourceId: srcNhiVYHCT.id,
      },
    });
    await prisma.diseasePattern.create({
      data: { diseaseId: viemTaiGiua.id, patternId: pattern.id, relation: "có thể gặp" },
    });
    await prisma.patternPrinciple.create({
      data: { patternId: pattern.id, principleId: principle.id },
    });
    await prisma.formula.create({
      data: {
        name: d.formula,
        origin: "cổ điển",
        indications: `Viêm tai giữa — thể ${d.name}`,
        status: "DRAFT",
        sourceId: srcNhiVYHCT.id,
        principleId: principle.id,
      },
    });
  }

  // Thể cấp tính (nhiệt độc xâm phạm Can - Đởm) — có bài thuốc gia giảm cụ thể
  const principleCap = await prisma.treatmentPrinciple.create({
    data: {
      name: "Sơ phong thanh nhiệt / trừ thấp ở Can - Đởm",
      status: "DRAFT",
      sourceId: srcNhiVYHCT.id,
    },
  });
  const patternCap = await prisma.pattern.create({
    data: {
      name: "Thể cấp tính — phong nhiệt, nhiệt độc xâm phạm Can Đởm",
      keySigns:
        "Sốt (trẻ nhỏ thường sốt cao), mệt mỏi, tiêu chảy, đau tai dữ dội theo nhịp đập, đau lan ra xương chũm, nửa mặt, nửa đầu, đau nhiều về đêm, tai chảy mủ vàng đặc có dính máu, rêu lưỡi vàng, mạch Huyền Sác.",
      status: "DRAFT",
      sourceId: srcNhiVYHCT.id,
    },
  });
  await prisma.diseasePattern.create({
    data: { diseaseId: viemTaiGiua.id, patternId: patternCap.id, relation: "có thể gặp" },
  });
  await prisma.patternPrinciple.create({ data: { patternId: patternCap.id, principleId: principleCap.id } });
  const saiHoSoCanThangGiaGiam = await prisma.formula.create({
    data: {
      name: "Sài hồ sơ can thang gia giảm (trị viêm tai giữa cấp)",
      origin: "cổ điển, gia giảm",
      indications: "Viêm tai giữa thể cấp tính do phong nhiệt, nhiệt độc xâm phạm Can - Đởm",
      modifications: "Gia Hoàng cầm, Chi tử, Long đởm, Bạc hà (thanh nhiệt); Sài hồ (sơ phong); Kim ngân (trừ thấp, tiêu độc). Có máu mủ: thêm Sinh địa 16g, Đơn bì 12g.",
      status: "DRAFT",
      sourceId: srcNhiVYHCT.id,
      principleId: principleCap.id,
    },
  });
  for (const [name, amount] of [
    ["Hoàng cầm", null],
    ["Chi tử", null],
    ["Long đởm", null],
    ["Bạc hà", null],
    ["Sài hồ", null],
    ["Kim ngân", null],
    ["Sinh địa", "16g"],
    ["Đơn bì", "12g"],
  ] as const) {
    let herb = await prisma.herb.findFirst({ where: { standardName: name } });
    if (!herb) herb = await prisma.herb.create({ data: { standardName: name, status: "DRAFT", sourceId: srcNhiVYHCT.id } });
    await prisma.formulaIngredient.create({
      data: { formulaId: saiHoSoCanThangGiaGiam.id, herbId: herb.id, amount: amount ?? undefined, note: amount ? "khi có máu mủ" : undefined },
    });
  }

  // Thể mạn tính — 3 thể con
  const vtgManDefs = [
    {
      name: "Thể mạn tính — Thấp nhiệt ở Can kinh, đợt cấp",
      keySigns: "Tai đau nhức, mủ chảy đặc dính, mùi hôi, lượng nhiều.",
      principle: "Thanh Can, lợi thấp",
      formula: "Long đởm tả can thang gia giảm (trị viêm tai giữa mạn, thấp nhiệt ở Can kinh)",
      points: ["Ế phong", "Phong trì", "Hợp cốc", "Thái xung"],
    },
    {
      name: "Thể mạn tính — Thận hư hoặc âm hư hỏa vượng",
      keySigns: "Mủ ra thường xuyên, loãng, tai ù, nghe kém, hoa mắt, chóng mặt, ngủ ít, lưng gối đau mỏi, rêu lưỡi ít, mạch Tế Sác.",
      principle: "Dưỡng âm, thanh nhiệt, bổ Thận, thông khiếu",
      formula: "Tri bá địa hoàng thang / Dương hoà thang / Nhĩ cam tán",
      points: ["Ế phong", "Thận du", "Tam âm giao", "Thái khê"],
    },
    {
      name: "Thể mạn tính — Tỳ hư (thường gặp ở trẻ nhỏ)",
      keySigns: "Chảy mủ loãng kéo dài, sắc mặt vàng bủng, ăn kém, chậm tiêu, đại tiện loãng, mệt mỏi, mạch Hoãn Nhược.",
      principle: "Kiện Tỳ, hoá thấp",
      formula: "Sâm linh bạch truật tán gia giảm",
      points: ["Hợp cốc", "Ế phong", "Phong trì", "Túc tam lý"],
    },
  ];

  for (const d of vtgManDefs) {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: d.principle, status: "DRAFT", sourceId: srcNhiVYHCT.id } });
    const pattern = await prisma.pattern.create({ data: { name: d.name, keySigns: d.keySigns, status: "DRAFT", sourceId: srcNhiVYHCT.id } });
    await prisma.diseasePattern.create({ data: { diseaseId: viemTaiGiua.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    const formula = await prisma.formula.create({
      data: { name: d.formula, origin: "cổ điển", indications: `Viêm tai giữa — ${d.name}`, status: "DRAFT", sourceId: srcNhiVYHCT.id, principleId: principle.id },
    });
    const protocol = await prisma.pointProtocol.create({
      data: { name: `Châm cứu — ${d.name}`, goal: d.principle, status: "DRAFT", sourceId: srcNhiVYHCT.id, principleId: principle.id },
    });
    for (const pointName of d.points) {
      const point = await findPoint(pointName);
      if (point) {
        await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: point.id } });
      }
    }
  }

  // ================= VIÊM TAI GIỮA HÓA MỦ (Nhĩ Cam, Otitis media suppurativa) =================
  const viemTaiGiuaHoaMu = await prisma.disease.create({
    data: {
      name: "Viêm tai giữa hóa mủ",
      aliases: "Nhĩ Cam; Nhĩ thấp; Hoàng nhĩ thương hàn; Cấp tính hóa nùng tính trung nhĩ viêm; Tai chảy mủ",
      nameModern: "Otitis media suppurativa",
      definition:
        "Thể viêm tai giữa có hóa mủ, hay tái phát, lâu năm khó lành. Lâu ngày sau tai sưng nóng, lở loét chảy mủ; đột nhiên mắt trợn ngược, mắt miệng méo, chảy nước dãi, hoặc sốt cao hôn mê, nôn mửa, co quắp (gọi là Hoàng nhĩ thương hàn — biến chứng nặng).",
      cause: "Do thấp nhiệt, âm hư hỏa vượng, huyết ứ gây nên.",
      symptoms: "Tai căng đau, ù tai, thính lực giảm, đau lan lên đầu, chảy mủ. Bệnh hay tái phát. Đặc điểm chẩn đoán: tai đau, chảy mủ, thính lực giảm.",
      differential:
        "Mụn tai (lỗ tai sưng đỏ, nổi mụn, lở loét chảy máu mủ); Chứng lở tai (lỗ tai sưng đỏ lở loét, chảy mủ hôi thối, màng tai không biến đổi).",
      status: "DRAFT",
      sourceId: srcNhiVYHCT.id,
    },
  });

  const vtghmPatternDefs = [
    {
      name: "Phong nhiệt xâm phạm tai (hóa mủ)",
      keySigns: "Tai căng tức, bế tắc, hơi đau nhức, màng tai đỏ sưng, phát sốt, đau đầu, nghẹt mũi, chảy nước, rêu lưỡi vàng, mạch Phù Sác.",
      principle: "Sơ phong thanh nhiệt",
      formula: "Mạn kinh tử tán",
    },
    {
      name: "Can đởm thấp nhiệt (hóa mủ)",
      keySigns: "Tai căng đau nhức, ù tai, thính lực giảm, chảy mủ nước vàng đặc, hôi, chóng mặt hoa mắt, miệng đắng, tiểu tiện ngắn vàng, rêu lưỡi vàng dày.",
      principle: "Thanh can lợi thấp",
      formula: "Long đởm tả can thang",
    },
    {
      name: "Âm hư hỏa vượng (hóa mủ)",
      keySigns: "Tai chảy mủ lượng ít, khi chảy khi không, mủ đặc dính, hôi thối, thính lực giảm, ngũ tâm phiền nhiệt, mặt đỏ, họng khô miệng ráo, lưỡi đỏ ít rêu.",
      principle: "Tư âm giáng hỏa",
      formula: "Tri bá địa hoàng thang",
    },
    {
      name: "Tỳ hư thấp thịnh (hóa mủ)",
      keySigns: "Tai chảy mủ lâu ngày không lành, mệt mỏi, ăn kém, thính lực giảm, mặt vàng úa hoặc trắng xanh, chóng mặt hoa mắt, lưỡi lạt, rêu lưỡi bệu.",
      principle: "Kiện Tỳ hóa thấp",
      formula: "Thác lý tiêu độc tán gia Địa phu tử",
    },
    {
      name: "Nhiệt uất gây nhọt lở (tai)",
      keySigns: "Tai chảy mủ không thông lợi, sau tai sưng đỏ, đau nóng, xoắn tai hướng về trước, tai ra mủ, phát sốt, phiền khát, rêu lưỡi vàng.",
      principle: "Giải độc trừ mủ",
      formula: "Ngũ vị tiêu độc ẩm hợp Bài nùng tán",
    },
    {
      name: "Huyết ứ bế tắc kinh lạc (tai)",
      keySigns: "Tai chảy mủ không thông lợi, đau đầu, mặt tê cứng, đột nhiên miệng mắt méo, miệng chảy nước dãi, lưỡi đỏ tím hoặc có điểm ứ huyết.",
      principle: "Hoạt huyết thông kinh lạc",
      formula: "Thông khiếu hoạt huyết thang",
    },
    {
      name: "Mủ độc xâm phạm não",
      keySigns: "Tai chảy mủ không thông sướng, mủ đen hôi thối, tai đau nhức, phát sốt, đau đầu, nôn mửa, co cứng, lưỡi đỏ, ít rêu.",
      principle: "Lương huyết tức phong",
      formula: "Thanh ôn bại độc ẩm",
    },
  ];

  for (const d of vtghmPatternDefs) {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: d.principle, status: "DRAFT", sourceId: srcNhiVYHCT.id } });
    const pattern = await prisma.pattern.create({ data: { name: d.name, keySigns: d.keySigns, status: "DRAFT", sourceId: srcNhiVYHCT.id } });
    await prisma.diseasePattern.create({ data: { diseaseId: viemTaiGiuaHoaMu.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    await prisma.formula.create({
      data: { name: d.formula, origin: "cổ điển", indications: `Viêm tai giữa hóa mủ — thể ${d.name}`, status: "DRAFT", sourceId: srcNhiVYHCT.id, principleId: principle.id },
    });
  }

  // ================= ZONA (Herpes Zoster) + ĐAU SAU ZONA =================
  const zona = await prisma.disease.create({
    data: {
      name: "Zona thần kinh",
      aliases: "Herpes Zoster; Xà tuyến sang; Triền yêu; Hoả đơn; Xà đơn; Hoả đới sang; Tri thù sang; Tắng đới sang",
      nameModern: "Herpes Zoster (nhiễm trùng da do tái hoạt virus Varicella-zoster)",
      definition:
        "Bệnh nhiễm trùng da với biểu hiện là các ban đỏ, mụn nước, bọng nước tập trung thành đám, thành chùm dọc theo đường phân bố của thần kinh ngoại biên, thường ở 1 bên, không vượt đường giữa. Thường gặp nhất là Zona liên sườn và ngực bụng (~50% trường hợp). Hay gặp ở người già, người suy giảm miễn dịch (đặc biệt HIV/AIDS).",
      cause:
        "YHHĐ: do sự tái hoạt của virus Varicella-zoster (Human alphaherpesvirus 3, virus DNA hướng da và thần kinh) ẩn nấp trong các hạch thần kinh cảm giác sau lần nhiễm đầu (thủy đậu) hoặc tiêm vaccine thủy đậu giảm độc lực. YHCT (theo Đông y hiện đại): nhiệt độc/đàm nhiệt tích tụ tại bì phu; khí trệ huyết ứ; bệnh bản là Can kinh uất nhiệt, Tỳ hư thấp uẩn — do tình chí uất kết, ẩm thực thất điều, huyết hư kèm can dương vượng ở người lão suy.",
      mechanism:
        "VZV sau lần nhiễm đầu/vaccine lây truyền vào tế bào T, theo dẫn truyền ngược dòng và nhân lên ở neuron hạch rễ lưng, thần kinh sọ hoặc thần kinh thực vật. Khi tái hoạt, VZV theo đường dẫn truyền thuận dòng ảnh hưởng lên rễ thần kinh theo vùng chi phối.",
      symptoms:
        "Tiền triệu: dị cảm tại 1 vùng da (bỏng rát, châm chích, đau), nhất là về đêm, kéo dài 1-5 ngày. Khởi phát: mảng đỏ, nề nhẹ, đường kính ~10cm, gờ cao hơn mặt da, theo dọc đường phân bố thần kinh. Toàn phát: mụn nước/bọng nước tập trung thành đám như chùm nho, căng dịch trong rồi đục hoá mủ, vỡ đóng vảy tiết; thời gian lành sẹo 2-4 tuần. Đau có thể xuất hiện trước tổn thương da, kèm dị cảm, loạn cảm, thay đổi theo tuổi. Dạng đặc biệt: Zona mắt (10-15%, tổn thương dây V, nguy cơ viêm giác mạc/hoại tử võng mạc), Zona xương cùng (S2-S4, ảnh hưởng bàng quang), Zona hạch gối/hội chứng Ramsay Hunt (liệt mặt ngoại biên, nghe kém), Zona tai (dây VII).",
      warnings:
        "Biến chứng: đau sau Zona (PHN), tổn thương thần kinh sọ/bệnh lý tủy sống, liệt sau zona, viêm não màng não/viêm tiểu não, bệnh lý mạch máu. PHN (Post Herpetic Neuralgia) là đau thần kinh kéo dài tháng/năm sau Zona, tỉ suất 10-20% (đến 30% ở người cao tuổi). Nguồn: Bệnh Zona, Hướng dẫn chẩn đoán và điều trị các bệnh da liễu (QĐ 75/QĐ-BYT, 13/1/2015).",
      status: "DRAFT",
      sourceId: srcZona.id,
    },
  });

  const zonaPatternDefs = [
    {
      name: "Can kinh uất nhiệt (Zona)",
      keySigns:
        "Dải sang thương đỏ, bóng nước căng, đau bỏng rát châm chích; tâm phiền, họng khô đắng, phân khô nước tiểu vàng; lưỡi đỏ, rêu lưỡi vàng dày/mỏng; mạch huyền hoạt sác.",
      principle: "Thanh Can tả hỏa, giải độc (Zona)",
      formula: "Long đởm tả can thang gia giảm (trị Zona thể Can kinh uất nhiệt)",
    },
    {
      name: "Tỳ hư thấp uẩn (Zona)",
      keySigns: "Sang thương màu hồng nhạt, vỏ bóng nước chùng; bụng đầy chướng, tiêu hoá kém, phân lỏng; lưỡi nhạt, rêu lưỡi trắng/nhớt; mạch trầm hoạt.",
      principle: "Kiện Tỳ trừ thấp (Zona)",
      formula: "Trừ thấp vị linh thang gia giảm",
    },
    {
      name: "Khí trệ huyết ứ (Zona, đau sau Zona)",
      keySigns: "Đau kéo dài hệ quả (đau sau Zona); lưỡi tím, rêu trắng/vàng; mạch huyền tế.",
      principle: "Hành khí hoạt huyết, thông kinh lạc (Zona)",
      formula: "Sài hồ sơ can thang hợp Đào hồng tứ vật thang",
    },
  ];

  const zonaPointsByStage: Record<string, string[]> = {
    "Can kinh uất nhiệt (Zona)": ["Hợp cốc", "Khúc trì"],
    "Tỳ hư thấp uẩn (Zona)": ["Túc tam lý", "Tam âm giao"],
    "Khí trệ huyết ứ (Zona, đau sau Zona)": ["Nội quan", "Dương lăng tuyền"],
  };

  for (const d of zonaPatternDefs) {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: d.principle, status: "DRAFT", sourceId: srcZona.id } });
    const pattern = await prisma.pattern.create({ data: { name: d.name, keySigns: d.keySigns, status: "DRAFT", sourceId: srcZona.id } });
    await prisma.diseasePattern.create({ data: { diseaseId: zona.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    await prisma.formula.create({
      data: { name: d.formula, origin: "cổ điển, gia giảm", indications: `Zona thần kinh — thể ${d.name}`, status: "DRAFT", sourceId: srcZona.id, principleId: principle.id },
    });
    const protocol = await prisma.pointProtocol.create({
      data: {
        name: `Châm cứu Zona — ${d.name}`,
        goal: d.principle,
        conditions: "Phối hợp A thị huyệt (tại vùng đau/sang thương) và Hoa đà giáp tích — chưa có trong danh mục huyệt vị chuẩn của hệ thống, cần bổ sung riêng.",
        status: "DRAFT",
        sourceId: srcZona.id,
        principleId: principle.id,
      },
    });
    for (const pointName of zonaPointsByStage[d.name] ?? []) {
      const point = await findPoint(pointName);
      if (point) await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: point.id } });
    }
  }

  console.log("Đã thêm 3 bệnh:", viemTaiGiua.name, "|", viemTaiGiuaHoaMu.name, "|", zona.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
