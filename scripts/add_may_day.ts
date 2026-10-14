// Thêm bệnh Mày đay (Ẩn chẩn) từ giáo án Bài 2 — Da liễu YHCT (Bai2_May_day.pptx).
// 6 thể lâm sàng đầy đủ pháp/phương/huyệt + 2 bài thuốc có thành phần cụ thể từ ca
// lâm sàng minh họa. Trích nguyên văn, không bịa thêm.
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

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Giáo án Bài 2 — Mày đay (Ẩn chẩn), Da liễu Y học cổ truyền",
      sourceType: "Giáo án lý thuyết",
      authorOrOrg: "Chương trình Cao đẳng — chuyên ngành YHCT; hình minh họa dẫn Kang S. et al., Fitzpatrick's Dermatology, 9th ed. (2019), Ch.41",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const disease = await prisma.disease.create({
    data: {
      name: "Mày đay",
      aliases: "Ẩn chẩn; Phong chẩn khối",
      nameModern: "Urticaria",
      definition:
        "YHHĐ: phản ứng của mao mạch trên da, gây phù cấp/mạn ở trung bì — sẩn phù màu hồng/đỏ, ranh giới rõ, ngứa, thường tự lặn dưới 24 giờ, không để lại dấu vết. Phân loại: cấp tính (<6 tuần) và mạn tính (≥6 tuần, tái phát gần như hàng ngày). YHCT gọi Ẩn chẩn hay Phong chẩn khối — 'ẩn' vì sẩn ẩn hiện thất thường, 'phong' vì đặc tính di chuyển, biến đổi nhanh giống Phong tà. Dịch tễ: ~15-25% dân số có ít nhất 1 đợt trong đời; thể mạn tính chiếm 25-30% số ca.",
      cause:
        "Ngoại nhân (Phong là chủ đạo): Phong hàn phạm biểu (Vệ khí hư, tấu lý sơ hở, Phong hàn xâm nhập → Vệ khí uất trệ, khí huyết không thông → sinh sẩn phù); Phong nhiệt phạm biểu (Phong + Nhiệt, hoặc Phong hàn uất lâu hóa Nhiệt, Doanh Vệ bất hòa → sẩn đỏ nóng rát). Bất nội ngoại nhân (thường gặp nhất): ẩm thực bất điều (thức ăn tanh/sống/lạnh/dễ dị ứng → Trường Vị thấp nhiệt nội sinh, uất ở bì phu), trùng tích/ký sinh trùng ruột (sinh thấp nhiệt, hóa sinh phong độc), dị ứng thuốc. Nội nhân (Thất tình, Chính khí hư): tình chí thất điều (Can khí uất kết hóa Hỏa hun đốt Huyết phận → sinh phong); Huyết hư sinh Phong (cơ địa Huyết hư — mạn tính, sau sinh, người già — vòng xoắn Phong-Táo-Huyết hư); Xung Nhâm bất điều (phụ nữ, tái phát theo chu kỳ kinh); Vệ khí bất cố (biểu hư bẩm sinh hoặc do bệnh lâu, dễ cảm phong tà tái phát).",
      differential:
        "Chàm cấp/Thấp sang: có mụn nước, rỉ dịch, tổn thương cố định kéo dài (Mày đay: sẩn phù khô, di chuyển, lặn nhanh <24h). Côn trùng đốt: có điểm đốt trung tâm, khu trú vùng hở, không lan tỏa. Hồng ban đa dạng: tổn thương hình bia bắn, cố định nhiều ngày, không di chuyển.",
      warnings:
        "Dấu hiệu cần chuyển cấp cứu Tây y NGAY: phù mạch môi/họng/thanh quản kèm khó thở, khó nuốt, tụt huyết áp (nghi sốc phản vệ). Nguyên tắc điều trị: giai đoạn cấp — sơ phong giải biểu là chính (Hàn thì tán hàn, Nhiệt thì thanh nhiệt), phối hợp thanh nhiệt lợi thấp nếu có yếu tố ăn uống; giai đoạn mạn — chú trọng 'trị bản' (dưỡng huyết, ích khí, cố biểu, điều Xung Nhâm), khu phong chỉ là 'trị tiêu', KHÔNG lạm dụng thuốc khu phong tính táo kéo dài (dễ hao Huyết, làm nặng vòng xoắn Phong-Táo-Huyết hư). Luôn khai thác kỹ tiền sử dị ứng thức ăn/thuốc. Huyệt chính trị Mày đay: Huyết hải, Khúc trì, Túc tam lý (khu phong, dưỡng huyết, kiện Tỳ). Hỗ trợ ngoài da (không thay thuốc uống): lá kinh giới, lá khế, lá đơn đỏ nấu nước tắm/xông giảm ngứa giai đoạn cấp.",
      status: "DRAFT",
      sourceId: source.id,
    },
  });

  type Pattern = {
    name: string;
    keySigns: string;
    principle: string;
    formula: string;
    points: string[];
    herbs?: [string, string?][];
  };
  const patterns: Pattern[] = [
    {
      name: "Phong hàn phạm biểu (Mày đay)",
      keySigns: "Sẩn trắng/hồng nhạt, gặp lạnh-gió nặng hơn, chườm ấm giảm, không khát. Lưỡi nhạt, rêu trắng mỏng; mạch phù khẩn.",
      principle: "Sơ phong tán hàn, điều hòa Doanh Vệ",
      formula: "Quế chi thang gia Kinh giới, Phòng phong",
      points: ["Phong trì", "Hợp cốc", "Huyết hải", "Cách du"],
    },
    {
      name: "Phong nhiệt phạm biểu (Mày đay)",
      keySigns: "Sẩn đỏ, nóng rát, gặp nóng/nắng nặng hơn, sốt nhẹ, khát nước, họng đỏ đau. Lưỡi đỏ, rêu vàng mỏng; mạch phù sác.",
      principle: "Sơ phong thanh nhiệt, điều hòa Doanh Vệ",
      formula: "Tiêu phong tán gia giảm (trị Mày đay)",
      points: ["Khúc trì", "Hợp cốc", "Huyết hải", "Đại chùy"],
      herbs: [["Kinh giới"], ["Phòng phong"], ["Thuyền thoái"], ["Ngưu bàng tử"], ["Sinh địa"], ["Kim ngân hoa"], ["Hoạt thạch"], ["Sinh cam thảo"]],
    },
    {
      name: "Trường Vị thấp nhiệt (Mày đay)",
      keySigns: "Sẩn kèm đau bụng, buồn nôn, chán ăn, đại tiện lỏng/táo; liên quan bữa ăn. Lưỡi đỏ, rêu vàng nhớt; mạch hoạt sác.",
      principle: "Thanh nhiệt lợi thấp, thông phủ tiết trọc, kiêm giải biểu",
      formula: "Phòng phong thông thánh tán gia giảm (trị Mày đay)",
      points: ["Túc tam lý", "Thiên khu", "Huyết hải", "Tam âm giao"],
    },
    {
      name: "Khí huyết hư / Huyết hư sinh phong (Mày đay)",
      keySigns: "Sẩn nhạt màu, hay nổi về chiều tối, tái phát dai dẳng; mệt mỏi, hoa mắt, ngủ kém. Lưỡi nhạt, ít rêu; mạch tế nhược.",
      principle: "Ích khí dưỡng huyết, khu phong nhuận táo",
      formula: "Đương quy ẩm tử gia giảm (trị Mày đay)",
      points: ["Huyết hải", "Túc tam lý", "Tam âm giao", "Khí hải", "Cách du"],
      herbs: [["Đương quy"], ["Bạch thược"], ["Xuyên khung"], ["Sinh địa"], ["Hoàng kỳ"], ["Kinh giới"], ["Phòng phong"], ["Bạch tật lê"]],
    },
    {
      name: "Xung Nhâm bất điều (Mày đay)",
      keySigns: "Sẩn xuất hiện/nặng lên theo chu kỳ kinh, có thể kèm rối loạn kinh nguyệt. Lưỡi nhạt tím hoặc điểm ứ huyết; mạch huyền tế.",
      principle: "Điều hòa Xung Nhâm, dưỡng huyết khu phong",
      formula: "Nhị chí hoàn hợp Tứ vật thang gia giảm (trị Mày đay)",
      points: ["Quan nguyên", "Tam âm giao", "Huyết hải", "Thái xung"],
    },
    {
      name: "Vệ khí bất cố (Mày đay)",
      keySigns: "Dễ ra mồ hôi, sợ gió, hay cảm mạo kèm nổi mày đay mỗi khi đổi thời tiết. Lưỡi nhạt, rêu trắng mỏng; mạch nhu hoãn.",
      principle: "Ích khí cố biểu, khu phong",
      formula: "Ngọc bình phong tán gia vị (trị Mày đay)",
      points: ["Phế du", "Túc tam lý", "Hợp cốc", "Đại chùy"],
    },
  ];

  for (const p of patterns) {
    const principle = await prisma.treatmentPrinciple.create({ data: { name: p.principle, status: "DRAFT", sourceId: source.id } });
    const pattern = await prisma.pattern.create({ data: { name: p.name, keySigns: p.keySigns, status: "DRAFT", sourceId: source.id } });
    await prisma.diseasePattern.create({ data: { diseaseId: disease.id, patternId: pattern.id, relation: "có thể gặp" } });
    await prisma.patternPrinciple.create({ data: { patternId: pattern.id, principleId: principle.id } });
    const formula = await prisma.formula.create({
      data: { name: p.formula, origin: "cổ điển, gia giảm", indications: `Mày đay — thể ${p.name}`, status: "DRAFT", sourceId: source.id, principleId: principle.id },
    });
    for (const [hname] of p.herbs ?? []) {
      const h = await herb(hname, source.id);
      await prisma.formulaIngredient.create({ data: { formulaId: formula.id, herbId: h.id } });
    }
    const protocol = await prisma.pointProtocol.create({
      data: { name: `Châm cứu — Mày đay thể ${p.name}`, goal: p.principle, status: "DRAFT", sourceId: source.id, principleId: principle.id },
    });
    for (const name of p.points) {
      await prisma.pointProtocolItem.create({ data: { protocolId: protocol.id, pointId: (await point(name, source.id)).id } });
    }
  }

  console.log("Đã thêm bệnh Mày đay (Ẩn chẩn) với 6 thể lâm sàng, bài thuốc, phác đồ châm cứu.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
