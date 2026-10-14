// Thêm 15 cổ phương nhóm Hoạt huyết - Chỉ huyết từ "Ứng dụng kê đơn lập phương. LẬP
// PHƯƠNG HOẠT HUYẾT - CHỈ HUYẾT. Ts Bs Trần Hoàng.pdf" (tr.45-75). Mỗi bài có đủ
// cấu tạo (vị + liều), cách dùng, công dụng, chủ trị — trích nguyên văn, dẫn nguồn
// cổ thư (Thương hàn luận, Kim quỹ yếu lược, Y lâm cải thác...). Không bịa thêm.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function herb(name: string, sourceId: string) {
  let h = await prisma.herb.findFirst({ where: { standardName: name } });
  if (!h) h = await prisma.herb.create({ data: { standardName: name, status: "DRAFT", sourceId } });
  return h;
}

type FormulaDef = {
  name: string;
  origin: string;
  herbs: [string, string?][];
  preparation: string;
  principleName: string;
  indications: string;
};

async function main() {
  const source = await prisma.source.create({
    data: {
      title: "Ứng dụng kê đơn lập phương — Lập phương Hoạt huyết - Chỉ huyết",
      sourceType: "Bài giảng",
      authorOrOrg: "ThS.Bs. Trần Hoàng — Bộ môn Nội khoa Đông y, Khoa YHCT, Đại học Y Dược TP.HCM",
      locator: "tr.45-75 (cổ phương, dẫn nguồn cổ thư cho từng bài)",
      usageRights: "Tài liệu nội bộ người dùng cung cấp",
    },
  });

  const formulas: FormulaDef[] = [
    {
      name: "Đào hạch thừa khí thang",
      origin: "cổ điển — Thương hàn luận",
      herbs: [["Đào nhân", "12g"], ["Quế chi", "6g"], ["Đại hoàng", "12g"], ["Cam thảo chích", "6g"], ["Mang tiêu", "6g"]],
      preparation: "Dùng 7 thăng nước, sắc còn 2 thăng, bỏ bã, thêm Mang tiêu, sắc nhỏ lửa thêm một lát, uống sau ăn 5 hợp, ngày 3 lần, cho đi cầu hơi lỏng là được.",
      principleName: "Phá huyết trục ứ (hạ tiêu súc huyết)",
      indications:
        "Hạ tiêu súc huyết: bụng dưới đau co thắt, sờ có hòn cục, tiểu tiện bình thường; nặng thì nói sảng phiền táo bứt rứt, có người như phát cuồng, đến đêm phát nhiệt; huyết ứ kinh bế, đau bụng kinh, mạch trầm thực mà sáp.",
    },
    {
      name: "Để đương thang",
      origin: "cổ điển — Thương hàn luận",
      herbs: [["Thủy điệt", "6g (nướng)"], ["Manh trùng", "6g (bỏ cánh chân, nướng)"], ["Đào nhân", "9g"], ["Đại hoàng", "9g (rửa rượu)"]],
      preparation: "Dùng 5 thăng nước, sắc còn 3 thăng, bỏ bã, uống ấm 1 thăng; chưa đại tiện được thì uống thêm.",
      principleName: "Phá huyết trục ứ (hạ tiêu súc huyết)",
      indications:
        "Hạ tiêu súc huyết: bụng dưới cứng đầy, tiểu tiện bình thường, đại tiện cứng mà sắc đen dễ đi, phát cuồng hoặc hay quên, hoặc phát vàng da, hoặc kinh nguyệt không thông, mạch trầm sáp.",
    },
    {
      name: "Huyết phủ trục ứ thang",
      origin: "cổ điển — Y lâm cải thác, quyển thượng",
      herbs: [["Đương quy", "9g"], ["Sinh địa", "9g"], ["Đào nhân", "12g"], ["Hồng hoa", "9g"], ["Chỉ xác", "6g"], ["Xích thược", "6g"], ["Sài hồ", "3g"], ["Cam thảo", "6g"], ["Cát cánh", "4.5g"], ["Xuyên khung", "4.5g"], ["Ngưu tất", "9g"]],
      preparation: "Sắc nước uống.",
      principleName: "Hoạt huyết khư ứ, hành khí chỉ thống",
      indications:
        "Huyết ứ trong ngực: đau ngực, đau đầu lâu ngày không khỏi, đau như kim châm có chỗ cố định; nấc cụt lâu ngày; nội nhiệt phiền muộn, tâm quý mất ngủ, cấp táo dễ giận, phát nhiệt buổi chiều; môi đen hoặc mắt tối đen, lưỡi đỏ sậm ám sắc đen hoặc có ban ứ huyết, mạch sáp hoặc huyền khẩn.",
    },
    {
      name: "Bổ dương hoàn ngũ thang",
      origin: "cổ điển — Y lâm cải thác, quyển hạ",
      herbs: [["Hoàng kỳ", "120g"], ["Đương quy", "6g"], ["Xích thược", "4.5g"], ["Địa long", "3g"], ["Xuyên khung", "3g"], ["Đào nhân", "3g"], ["Hồng hoa", "3g"]],
      preparation: "Sắc nước uống.",
      principleName: "Bổ khí, hoạt huyết, thông lạc",
      indications:
        "Trúng phong: bán thân bất toại, miệng mắt méo lệch, nói năng khó khăn, khóe miệng chảy nước dãi, tiểu tiện nhiều lần hoặc tiểu không kiểm soát, lưỡi hơi đen, rêu trắng, mạch hoãn.",
    },
    {
      name: "Ôn kinh thang",
      origin: "cổ điển — Kim quỹ yếu lược",
      herbs: [["Ngô thù du", "9g"], ["Đương quy", "6g"], ["Xuyên khung", "6g"], ["Thược dược", "6g"], ["Nhân sâm", "6g"], ["Quế chi", "6g"], ["A giao", "6g"], ["Sinh khương", "6g"], ["Mẫu đan bì", "6g (bỏ lõi)"], ["Cam thảo", "6g"], ["Bán hạ", "6g"], ["Mạch đông", "9g (bỏ lõi)"]],
      preparation: "Dùng 1 đấu nước sắc còn 3 thăng, uống ấm.",
      principleName: "Ôn kinh tán hàn, dưỡng huyết khư ứ",
      indications:
        "Xung Nhâm hư hàn, ứ trở bào cung: lậu hạ không ngừng (rong kinh, rong huyết), rối loạn kinh nguyệt sớm/muộn/kéo dài hoặc 1 tháng 2 lần hoặc kinh ngừng hẳn; chiều tối phát nhiệt, lòng bàn tay nóng, môi miệng khô táo, bụng dưới đau co thắt, đầy bụng, chất lưỡi đỏ bầm, mạch tế mà sáp. Cũng trị nữ hiếm muộn.",
    },
    {
      name: "Sinh hóa thang",
      origin: "cổ điển — Phó Thanh Chủ nữ khoa, Sản hậu thiên",
      herbs: [["Đương quy", "24g (toàn)"], ["Xuyên khung", "9g"], ["Đào nhân", "6g"], ["Can khương", "2g (sao đen)"], ["Cam thảo chích", "2g"]],
      preparation: "Dùng hoàng tửu làm nước sắc uống.",
      principleName: "Dưỡng huyết khư ứ, ôn kinh chỉ thống",
      indications: "Sản hậu ứ huyết đau bụng: ác lộ không ra, bụng dưới lạnh đau, lưỡi nhạt, rêu trắng trơn, mạch tế hoặc sáp.",
    },
    {
      name: "Đương quy thược dược tán",
      origin: "cổ điển — Kim quỹ yếu lược",
      herbs: [["Đương quy", "9g"], ["Thược dược", "10-30g"], ["Phục linh", "12g"], ["Bạch truật", "12g"], ["Trạch tả", "12g"], ["Xuyên khung", "6g"]],
      preparation: "Các vị tán bột, mỗi lần dùng 6g, uống với rượu, ngày 3 lần.",
      principleName: "Dưỡng Can hoạt huyết, kiện Tỳ trừ thấp",
      indications:
        "Can Tỳ lưỡng hư, huyết ứ thấp trệ: phụ nữ có thai hoặc kỳ kinh bụng đau co thắt liên miên kéo dài, xây xẩm chóng mặt, hồi hộp, hoặc phù chân, tiểu tiện không thông, lưỡi nhạt, rêu trắng nhớt.",
    },
    {
      name: "Đan sâm ẩm",
      origin: "cổ điển — Thời phương ca quát, quyển hạ",
      herbs: [["Đan sâm", "30g"], ["Đàn hương", "3g"], ["Sa nhân", "3g"]],
      preparation: "Lấy 1.5 chén nước sắc còn 7 phân để uống.",
      principleName: "Hoạt huyết khư ứ, hành khí chỉ thống",
      indications: "Khí trệ huyết ứ: Tâm Vị đau, đau có chỗ cố định, đau kiểu đau chói, chất lưỡi đỏ tối, mạch huyền.",
    },
    {
      name: "Thập khôi tán",
      origin: "cổ điển — Y phương loại tụ, quyển 150",
      herbs: [["Đại kế", ""], ["Tiểu kế", ""], ["Hà diệp", ""], ["Trắc bách diệp", ""], ["Mao căn", ""], ["Mẫu đan bì", ""], ["Đại hoàng", ""], ["Thiến thảo", ""], ["Tông lư bì", ""], ["Sơn chi", ""]],
      preparation: "Các vị (liều bằng nhau) sao đen tồn tính, nghiền bột, gói giấy để trên đất đậy chén 1 đêm cho ra hết hỏa độc. Dùng với nước cốt Liên ngẫu hoặc nước cốt củ cải trắng ~0.5 chén, thêm 15g thuốc, uống sau ăn.",
      principleName: "Lương huyết chỉ huyết, thanh nhiệt tả hỏa",
      indications: "Huyết nhiệt vọng hành: nôn ra máu, khạc ra máu, ho ra máu, chảy máu mũi, sắc huyết đỏ tươi, xuất huyết lượng nhiều, lưỡi đỏ, mạch sác.",
    },
    {
      name: "Tứ vị hoàn",
      origin: "cổ điển — Dương thị gia tàng phương, quyển 20",
      herbs: [["Hà diệp", ""], ["Ngải diệp", ""], ["Trắc bách diệp", ""], ["Sinh địa hoàng", ""]],
      preparation: "Các vị (liều bằng nhau) giã nát làm hoàn to như quả trứng gà, mỗi lần dùng 1 hoàn (120g), 3 chén nước sắc còn 1 chén, bỏ bã, uống ấm.",
      principleName: "Lương huyết chỉ huyết",
      indications: "Huyết nhiệt vọng hành: nôn ra máu, chảy máu mũi, sắc huyết đỏ tươi, miệng họng khô táo, lưỡi đỏ nứt, mạch huyền sác hữu lực.",
    },
    {
      name: "Khái huyết phương",
      origin: "cổ điển — Đan Khê tâm pháp, quyển 2",
      herbs: [["Thanh đại", "6g"], ["Qua lâu nhân", "9g"], ["Hải phấn", "9g"], ["Sơn chi", "9g"], ["Kha tử", "6g"]],
      preparation: "Các vị tán bột, luyện mật cùng nước cốt gừng làm hoàn uống.",
      principleName: "Thanh Can ninh Phế, lương huyết chỉ huyết",
      indications:
        "Can hỏa phạm Phế: ho khạc đàm đặc lẫn máu, ho khạc xong không thoải mái, tâm phiền dễ giận, ngực sườn đau, họng khô miệng đắng, gò má đỏ, táo bón, lưỡi đỏ rêu vàng, mạch huyền sác.",
    },
    {
      name: "Tiểu kế ẩm tử",
      origin: "cổ điển — Tế sinh phương",
      herbs: [["Sinh địa hoàng", "9g"], ["Tiểu kế căn", "9g"], ["Hoạt thạch", "9g"], ["Thông thảo", "9g"], ["Bồ hoàng", "9g"], ["Đạm trúc diệp", "9g"], ["Ngẫu tiết", "9g"], ["Đương quy", "9g"], ["Sơn chi nhân", "9g"], ["Cam thảo", "9g"]],
      preparation: "Các vị cắt nhỏ, mỗi lần dùng 15g nấu nước uống lúc bụng đói.",
      principleName: "Lương huyết chỉ huyết, lợi niệu thông lâm",
      indications: "Nhiệt kết hạ tiêu gây huyết lâm, niệu huyết: nước tiểu lẫn máu, tiểu nhiều lần, sắc đỏ, tiểu gắt nóng đau, lưỡi đỏ mạch sác.",
    },
    {
      name: "Hòe hoa tán",
      origin: "cổ điển — Phổ tế bản sự phương, quyển 5",
      herbs: [["Hòe hoa", "12g (sao)"], ["Trắc bách diệp", "12g (sao)"], ["Kinh giới tuệ", "6g"], ["Chỉ xác", "6g (bỏ ruột, sao cám)"]],
      preparation: "Các vị tán bột, dùng nước cơm loãng uống 6g thuốc lúc bụng đói trước bữa ăn.",
      principleName: "Thanh Trường chỉ huyết, sơ phong hành khí",
      indications:
        "Phong nhiệt thấp nhiệt úng át Trường đạo, tổn thương huyết lạc: đại tiện ra máu (trước/sau khi đi phân, hoặc lẫn trong phân), sắc huyết đỏ tươi hoặc ám đen, lưỡi đỏ, mạch sác hoặc huyền sác.",
    },
    {
      name: "Hoàng thổ thang",
      origin: "cổ điển — Kim quỹ yếu lược",
      herbs: [["Táo tâm hoàng thổ", "30g"], ["Bạch truật", "9g"], ["Phụ tử chế", "9g"], ["Can địa hoàng", "9g"], ["A giao", "9g"], ["Cam thảo", "9g"], ["Hoàng cầm", "9g"]],
      preparation: "Dùng 8 thăng nước sắc còn 3 thăng, chia 2 lần uống.",
      principleName: "Ôn dương kiện Tỳ, dưỡng huyết chỉ huyết",
      indications:
        "Tỳ dương bất túc, Tỳ bất thống huyết: đại tiện ra máu, nôn ra máu, chảy máu mũi, phụ nữ băng lậu; sắc huyết hơi đen, tứ chi không ấm, tinh thần mệt mỏi yếu sức, miệng nhạt không khát, sắc mặt vàng héo, lưỡi nhạt rêu trắng, mạch trầm tế vô lực.",
    },
    {
      name: "Giao ngải thang",
      origin: "cổ điển — Kim quỹ yếu lược",
      herbs: [["Xuyên khung", "6g"], ["A giao", "6g"], ["Cam thảo", "6g"], ["Ngải diệp", "9g"], ["Đương quy", "9g"], ["Thược dược", "12g"], ["Can địa hoàng", "12g"]],
      preparation: "Dùng 5 thang thuốc + 3 thăng rượu trắng, sắc còn 3 thăng, bỏ bã, hòa A giao cho tan hết, uống ấm 1 thăng, ngày 3 lần.",
      principleName: "Dưỡng huyết chỉ huyết, điều kinh an thai",
      indications:
        "Xung Nhâm hư tổn, huyết hư thiên hàn chứng: băng lậu hạ huyết, kinh nguyệt quá nhiều kéo dài không dứt; sản hậu/sau sảy thai tổn thương Xung Nhâm, huyết ra không ngừng; có thai ra huyết đau bụng; sắc huyết đỏ nhạt chất loãng, thắt lưng tê yếu, sắc mặt kém tươi, lưỡi nhạt, rêu trắng, mạch tế nhược.",
    },
  ];

  for (const f of formulas) {
    const principle = await prisma.treatmentPrinciple.create({
      data: { name: f.principleName, status: "DRAFT", sourceId: source.id },
    });
    const formula = await prisma.formula.create({
      data: {
        name: f.name,
        origin: f.origin,
        indications: f.indications,
        preparation: f.preparation,
        status: "DRAFT",
        sourceId: source.id,
        principleId: principle.id,
      },
    });
    for (const [name, amount] of f.herbs) {
      const h = await herb(name, source.id);
      await prisma.formulaIngredient.create({ data: { formulaId: formula.id, herbId: h.id, amount: amount || undefined } });
    }
  }

  console.log(`Đã thêm ${formulas.length} cổ phương nhóm Hoạt huyết - Chỉ huyết.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
