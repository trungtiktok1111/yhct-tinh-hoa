// Thêm nội dung từ "Kê đơn lập phương theo YHCT. Lập phương lý khí. Lương y Hoàng
// Duy Tân.pptx" (60 slide): các bài thuốc lý khí có đủ vị/liều, nguyên tắc giáng
// khí/bổ khí, và phác đồ châm cứu sơ Can lý khí / bổ khí. Trích nguyên văn, dẫn
// nguồn cổ thư cho từng bài. Không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function herb(name: string, sourceId: string) {
  let h = await prisma.herb.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
  if (!h) h = await prisma.herb.create({ data: { standardName: name, status: "DRAFT", sourceId } });
  return h;
}
async function point(name: string, sourceId: string) {
  let p = await prisma.acupuncturePoint.findFirst({ where: { standardName: { equals: name, mode: "insensitive" } } });
  if (!p) p = await prisma.acupuncturePoint.create({ data: { code: "", standardName: name, status: "DRAFT", sourceId } });
  return p;
}

async function makeFormula(
  sourceId: string,
  principleId: string,
  name: string,
  origin: string,
  indications: string,
  herbs: [string, string?][],
  preparation?: string,
  modifications?: string
) {
  const formula = await prisma.formula.create({
    data: { name, origin, indications, preparation, modifications, status: "DRAFT", sourceId, principleId },
  });
  for (const [hname, amount] of herbs) {
    const h = await herb(hname, sourceId);
    await prisma.formulaIngredient.create({ data: { formulaId: formula.id, herbId: h.id, amount: amount || undefined } });
  }
  return formula;
}

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Kê đơn lập phương theo YHCT — Lập phương Lý khí",
      sourceType: "Bài giảng",
      authorOrOrg: "Lương y Hoàng Duy Tân",
      locator: "60 slide",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  let principle = await prisma.treatmentPrinciple.findFirst({ where: { name: "Lý khí" } });
  if (!principle) principle = await prisma.treatmentPrinciple.create({ data: { name: "Lý khí", status: "DRAFT", sourceId: source.id } });

  const pSoCanGiaiUat = await prisma.treatmentPrinciple.create({
    data: { name: "Sơ Can giải uất, điều khí", status: "DRAFT", sourceId: source.id },
  });
  await makeFormula(source.id, pSoCanGiaiUat.id, "Sài hồ sơ can tán", "cổ điển — Cảnh Nhạc toàn thư", "Sơ Can giải uất, điều khí chỉ thống. (Là bài Tứ nghịch tán thêm Xuyên khung, Hương phụ, dùng Chỉ xác thay Chỉ thực.)", [["Bạch thược", "12g"], ["Xuyên khung", "8g"], ["Hương phụ", "8g"], ["Sài hồ", "8g"], ["Chỉ xác", "8g"], ["Chích thảo (Cam thảo chích)", "4g"]], "Sắc uống.");

  const tieuDaoTan = await makeFormula(
    source.id, pSoCanGiaiUat.id, "Tiêu dao tán", "cổ điển — Hòa tễ cục phương",
    "Sơ Can kiện Tỳ, dưỡng huyết điều kinh. (Tiêu dao tán thiên dùng cho huyết hư Can uất — khác Sài hồ sơ can tán thiên về khí trệ.)",
    [["Sài hồ", "40g"], ["Đương quy", "40g"], ["Bạch thược", "40g"], ["Bạch truật", "40g"], ["Bạch linh", "40g"], ["Chích thảo (Cam thảo chích)", "20g"]],
    "Tán bột trộn đều, mỗi lần uống 12g với nước Gừng, sắc với Bạc hà. Có thể dùng thuốc thang."
  );
  await makeFormula(source.id, pSoCanGiaiUat.id, "Đan chi Tiêu dao tán", "cổ điển — Nội khoa trích yếu", "Tiêu dao tán gia Đan bì, Chi tử để thanh nhiệt lương huyết.", [], undefined, `Biến phương từ ${tieuDaoTan.name}, gia Đan bì, Chi tử.`);
  await makeFormula(source.id, pSoCanGiaiUat.id, "Hắc Tiêu dao tán", "cổ điển — Y lược lục thư, Nữ khoa chỉ yếu", "Tiêu dao tán gia Sinh địa hoặc Thục địa để dưỡng huyết.", [], undefined, `Biến phương từ ${tieuDaoTan.name}, gia Sinh địa hoặc Thục địa.`);

  await makeFormula(
    source.id, pSoCanGiaiUat.id, "Đan chi tiêu dao tán gia giảm (trị băng lậu do tử cung)", "cổ điển, gia giảm (ca lâm sàng)",
    "Chứng băng lậu do tử cung (tử cung xuất huyết công năng): kinh nguyệt ra không cầm hơn 40 ngày, máu đỏ sẫm có cục, bụng trướng đau, hồi hộp, sắc mặt trắng bạch, mạch Trầm Huyền hơi Sác, lưỡi đỏ rêu mỏng hơi vàng. Pháp trị: Sơ Can, giải uất, dưỡng huyết, lương huyết, chỉ huyết.",
    [["Sài hồ", "9g"], ["Hương phụ", "12g"], ["Bạch thược", "12-15g"], ["Đương quy", "10-12g"], ["Bạch truật", "9-12g"], ["Phục linh", "12-15g"], ["Đan bì", "9g"], ["Chi tử", "9g"], ["Hải phiêu tiêu", "12-15g"], ["Thiến thảo", "9-12g"], ["Bồ hoàng thán", "9g"], ["Sinh Mẫu lệ", "30g"], ["Cam thảo", "6g"]]
  );

  const pGiaiUat = await prisma.treatmentPrinciple.create({
    data: { name: "Giải uất, hành khí, khai uất giải trệ", status: "DRAFT", sourceId: source.id },
  });
  await makeFormula(
    source.id, pGiaiUat.id, "Việt cúc hoàn", "cổ điển — Đan Khê tâm pháp",
    "Giải uất, hành khí, hóa đàm, tiêu thực — trị Ngũ uất (khí, huyết, đàm, hỏa, thực).",
    [["Hương phụ", ""], ["Xuyên khung", ""], ["Thương truật", ""], ["Lục khúc", ""], ["Sơn chi tử", "(sao)"]],
    "Các vị lượng bằng nhau, tán bột, dùng nước làm hoàn, mỗi lần uống 8-12g với nước sôi ấm. Có thể dùng làm thuốc thang sắc uống."
  );
  await makeFormula(
    source.id, pGiaiUat.id, "Tứ ma ẩm", "cổ điển — Tế sinh phương",
    "Hành khí, giáng nghịch, khai uất — trị khí trệ, tức ngực, nôn ói. (Trầm hương, Tân lang, Ô dược phá khí giáng nghịch; Nhân sâm bổ hư yếu — công bổ kiêm dùng.)",
    [["Nhân sâm", ""], ["Tân lang", ""], ["Trầm hương", ""], ["Ô dược", ""]],
    "Các vị bằng nhau, mài sệt với nước, lấy khoảng 7/10 chén, đun sôi 3-5 lần, uống ấm."
  );
  await prisma.formula.create({
    data: { name: "Hương tô tán", origin: "cổ điển", indications: "Sơ Can lý khí, hòa trung giải biểu — cảm mạo khí trệ, phụ nữ kinh nguyệt không đều.", status: "DRAFT", sourceId: source.id, principleId: pGiaiUat.id },
  });
  await prisma.formula.create({
    data: { name: "Chỉ xác hoàn", origin: "cổ điển", indications: "Hành khí, tiêu trướng.", status: "DRAFT", sourceId: source.id, principleId: pGiaiUat.id },
  });

  const pKhoanHung = await prisma.treatmentPrinciple.create({
    data: { name: "Lý khí khoan hung, giáng nghịch (trị mai hạch khí)", status: "DRAFT", sourceId: source.id },
  });
  const banHaHauPhac = await makeFormula(
    source.id, pKhoanHung.id, "Bán hạ hậu phác thang", "cổ điển — Kim quỹ yếu lược",
    "Hành khí, giáng nghịch, hóa đàm, tán kết — trị mai hạch khí (cảm giác vướng nghẹn ở họng).",
    [["Bán hạ", "8-16g"], ["Hậu phác", "8-12g"], ["Phục linh", "12-16g"], ["Tô diệp", "6-12g"], ["Sinh khương", "8-12g"]],
    "Sắc, chia làm 4 lần uống ấm."
  );
  await makeFormula(
    source.id, pKhoanHung.id, "Mai hạch khí hàm hóa hoàn", "kinh nghiệm (Tào Bỉnh Chương truyền, ca lâm sàng)",
    `Trị mai hạch khí tái phát sau khi dùng ${banHaHauPhac.name} đỡ rồi ngưng thuốc 1-2 tuần lại tái phát: họng như có vật ngăn trở, nuốt không xuống, mửa không ra, khạc đờm/nước dãi, nghẹt như muốn chết.`,
    [["Bằng sa", "20g"], ["Ô mai nhục", "9g"], ["Thị sương", "9g"], ["Thanh diêm", "10g"]],
    "Các vị nghiền bột, luyện mật làm viên to như hạt anh đào, ngậm nuốt 6-7 viên mỗi ngày. Uống 1 tuần thấy thư thái, dùng thêm 1 tễ thì khỏi, không tái phát."
  );

  const pGiangKhi = await prisma.treatmentPrinciple.create({
    data: {
      name: "Giáng khí (Bình khí, Thuận khí)",
      description: "Đưa khí nghịch lên trở lại bình hòa, thuận chiều. Dùng trong các chứng Can khí nghịch lên, ngực bụng trướng đầy muốn tuyệt.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  await prisma.formula.create({
    data: {
      name: "Đinh hương thị đế thang",
      origin: "cổ điển",
      indications: "Phép giáng khí chỉ ách — Vị khí nghịch lên gây nấc liên tục (ách nghịch). Vị thuốc thường dùng: Đinh hương, Thị đế, Đao đậu tử, Sinh khương, Trần bì, Hậu phác (liều không nêu rõ trong nguồn).",
      status: "DRAFT",
      sourceId: source.id,
      principleId: pGiangKhi.id,
    },
  });

  const pBoKhi = await prisma.treatmentPrinciple.findFirst({ where: { name: "Bổ" } });
  const pBoKhiReal = pBoKhi ?? (await prisma.treatmentPrinciple.create({ data: { name: "Bổ khí, kiện Tỳ", status: "DRAFT", sourceId: source.id } }));
  await makeFormula(
    source.id, pBoKhiReal.id, "Bổ trung ích khí thang", "cổ điển — Tỳ Vị luận (Lý Đông Viên)",
    "Ích khí thăng dương, điều bổ Tỳ Vị. Trị Tỳ Vị khí hư: tinh thần mệt mỏi, sợ lạnh, tự ra mồ hôi hoặc phát sốt, mạch Hư không có sức, trung khí hạ hãm. Lý Đông Viên dựa ý Nội Kinh 'Hư tổn thì nên bổ, nhọc mệt thì nên ôn' mà chế ra — trị chứng vì ăn uống làm lụng nhọc mệt, Tỳ hư khí nhược, nội thương chứng nóng rét.",
    [["Hoàng kỳ", "15g"], ["Chích Cam thảo", "5g"], ["Nhân sâm", "10g"], ["Đương quy", "10g"], ["Trần bì", "6g"], ["Thăng ma", "3g"], ["Sài hồ", "3g"], ["Bạch truật", "10g"]],
    "Sắc nước uống."
  );
  await makeFormula(
    source.id, pBoKhiReal.id, "Bổ trung ích khí thang gia giảm (trị sa niêm mạc dạ dày)", "cổ điển, gia giảm (ca lâm sàng)",
    "Sa niêm mạc dạ dày: sau ăn dạ dày đau, ngày càng gầy, đi lại vận động khó khăn (X quang xác nhận sa niêm mạc dạ dày).",
    [["Đảng sâm", "15g"], ["Bạch truật", "10g"], ["Sài hồ", "6g"], ["Hoàng kỳ", "30g"], ["Thăng ma", "6g"], ["Trần bì", "10g"], ["Cam thảo", ""]]
  );
  await makeFormula(
    source.id, pBoKhiReal.id, "Tứ quân tử thang", "cổ điển — Hòa tễ cục phương",
    "Ích khí kiện Tỳ. Đại biểu loại thuốc bổ khí thăng dương, cam ôn trừ nhiệt — biện chứng dựa vào cơ thể mỏi mệt không sức, thiếu khí, tiếng nói yếu, sắc mặt vàng úa, mạch hư. Trị Tỳ Vị khí hư, tinh thần mệt mỏi, sợ lạnh, tự ra mồ hôi hoặc phát sốt, mạch Hư không sức, trung khí hạ hãm.",
    [["Nhân sâm", "10g"], ["Bạch truật", "10g"], ["Phục linh", "10g"], ["Chích Cam thảo", "6g"]],
    "Tán bột, mỗi lần 6g đem sắc uống; hoặc tán bột mịn làm hoàn, mỗi lần uống 6-9g, ngày 3 lần."
  );
  await prisma.formula.create({
    data: {
      name: "Lục quân tử thang",
      origin: "cổ điển (Tứ quân tử thang + Bán hạ, Trần bì)",
      indications: "Kiện Tỳ lý khí, hòa Vị chỉ ẩu.",
      status: "DRAFT",
      sourceId: source.id,
      principleId: pBoKhiReal.id,
    },
  });
  await prisma.formula.create({
    data: { name: "Độc sâm thang", origin: "cổ điển", indications: "Ích khí cố thoát, liễm hãn, dưỡng âm sinh tân.", status: "DRAFT", sourceId: source.id, principleId: pBoKhiReal.id },
  });

  // ================= CHÂM CỨU =================
  const protocolSoCan = await prisma.pointProtocol.create({
    data: { name: "Châm cứu — Sơ Can lý khí / khai uất", goal: "Sơ Can lý khí, khai uất", status: "DRAFT", sourceId: source.id, principleId: pSoCanGiaiUat.id },
  });
  for (const name of ["Thái xung", "Hành gian", "Kỳ môn", "Trung quản"]) {
    await prisma.pointProtocolItem.create({ data: { protocolId: protocolSoCan.id, pointId: (await point(name, source.id)).id } });
  }

  const protocolSuyen = await prisma.pointProtocol.create({
    data: {
      name: "Châm cứu — Ổn định cơn suyễn (khí nghịch)",
      goal: "Ổn định khí, nạp khí",
      conditions: "Hen suyễn — Phế khí thịnh (cao điểm giờ Dần 3-5g theo Reinberg); Nội Kinh: Phế chủ khí, Thận nạp khí.",
      warnings: "Cứu Định suyễn + Ngoại định suyễn + Suyễn tức để ổn định cơn; có thể dùng dầu nóng xoa ấm hoặc cao Ớt dán vào các huyệt.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });
  for (const name of ["Phế du", "Thận du"]) {
    await prisma.pointProtocolItem.create({ data: { protocolId: protocolSuyen.id, pointId: (await point(name, source.id)).id } });
  }

  // "Thăng ma", "Sài hồ" trong 2 nhóm dưới là VỊ THUỐC phối hợp thêm (không phải huyệt
  // châm) — nguồn liệt kê chung trong bảng châm cứu nhưng về bản chất là gia vị thuốc
  // thăng đề đi kèm; giữ riêng trong trường "conditions", không tạo huyệt giả.
  const boKhiPointGroups: [string, string[], string?][] = [
    ["Bổ khí toàn thân", ["Khí hải", "Túc tam lý", "Đản trung", "Trung quản", "Phế du"]],
    ["Thăng dương cử hãm", ["Bách hội", "Đản trung", "Túc tam lý"], "Phối hợp thêm vị thuốc thăng đề: Thăng ma, Sài hồ (uống, không phải huyệt châm)."],
    ["Kiện Tỳ ích khí", ["Trung quản", "Túc tam lý", "Tỳ du", "Bách hội"]],
    ["Ích Phế khí", ["Đản trung", "Phế du", "Khí hải", "Túc tam lý"]],
    ["Khí hư mệt mỏi, hơi ngắn", ["Túc tam lý", "Khí hải", "Đản trung", "Phế du"]],
    ["Sa tử cung, sa trực tràng", ["Bách hội", "Khí hải", "Túc tam lý"], "Phối hợp thêm vị thuốc thăng đề: Thăng ma, Sài hồ (uống, không phải huyệt châm)."],
    ["Ăn kém, tiêu chảy mạn", ["Trung quản", "Túc tam lý", "Tỳ du"]],
    ["Ra mồ hôi, sợ gió", ["Khí hải", "Phế du", "Đại chùy", "Bách hội"]],
    ["Sau bệnh nặng, nguyên khí hư", ["Khí hải", "Quan nguyên", "Mệnh môn", "Túc tam lý"]],
  ];
  for (const [goal, points, note] of boKhiPointGroups) {
    const protocol = await prisma.pointProtocol.create({
      data: { name: `Châm cứu bổ khí — ${goal}`, goal, conditions: note, status: "DRAFT", sourceId: source.id, principleId: pBoKhiReal.id },
    });
    for (const name of points) {
      await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: (await point(name, source.id)).id } });
    }
  }

  console.log("Đã thêm nội dung Lập phương Lý khí: bài thuốc + phác đồ châm cứu.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
