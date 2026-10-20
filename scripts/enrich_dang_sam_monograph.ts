// Bổ sung đầy đủ nội dung bản thảo (monograph) cho "Đẳng sâm" từ đoạn văn người dùng dán trực
// tiếp trong hội thoại (nguồn gốc website/tài liệu gốc của đoạn văn không được nêu rõ — ghi nhận
// trung thực trong Source thay vì bịa tên tài liệu). Giữ nguyên các trường đã có từ bài giảng gốc
// (TVQK/công năng/liều dùng/an toàn) không bị mất — chỉ nối thêm/bổ sung, không ghi đè mù quáng.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const HERB_ID = "cmv6uwugd00fe119vkwjefpht"; // Đẳng sâm

async function main() {
  const herb = await prisma.herb.findUnique({ where: { id: HERB_ID } });
  if (!herb) {
    console.log("KHÔNG TÌM THẤY Đẳng sâm");
    return;
  }

  let source = await prisma.source.findFirst({
    where: { title: { equals: "Đẳng sâm — nội dung bản thảo do người dùng cung cấp", mode: "insensitive" } },
  });
  if (!source) {
    source = await prisma.source.create({
      data: {
        title: "Đẳng sâm — nội dung bản thảo do người dùng cung cấp",
        sourceType: "Nội dung người dùng dán trực tiếp trong hội thoại — nguồn gốc tài liệu/website gốc không được nêu rõ",
      },
    });
  }

  const mergedActions = herb.actions
    ? `${herb.actions}; Theo Đông y (nguồn bổ sung): thanh phế, ích khí, trừ phiền khát, bổ trung, sinh tân chỉ khát và hòa Tỳ Vị`
    : "Theo Đông y: thanh phế, ích khí, trừ phiền khát, bổ trung, sinh tân chỉ khát và hòa Tỳ Vị";

  const mergedDosage = herb.dosage
    ? `${herb.dosage}. (Nguồn khác ghi nhận: 8-20g/ngày, dạng sắc.)`
    : "8-20g/ngày, dạng sắc.";

  const mergedMeridians = herb.meridians?.trim() === "Tỳ, Phế"
    ? "Phế, Tỳ (kinh thủ thái âm Phế và túc thái âm Tỳ)"
    : herb.meridians;

  await prisma.herb.update({
    where: { id: HERB_ID },
    data: {
      aliases: herb.aliases ?? "Bạch đảng sâm; Đảng sâm; Lộ đảng sâm; Tây đảng sâm; Điều đảng sâm; Đông đảm sâm",
      latinName: "Codonopsis pilosula",
      family: "Hoa chuông (Campanulaceae)",
      partUsed: "Rễ (Radix Codonopsis)",
      distribution:
        "Loài thực vật có nguồn gốc từ Trung Quốc, phân bố chủ yếu ở một số tỉnh như Vân Nam, Tứ Xuyên, Cát Lâm, Hồ Bắc, Hà Nam, Thanh Hải, Sơn Tây, Cam Túc, Thiểm Tây, Ninh Hạ, Hắc Long Giang. Đã được trồng ở một số địa phương ở Việt Nam như Lâm Đồng, Quảng Nam, Kon Tum, Đà Nẵng, Hà Giang, Lạng Sơn, Lai Châu, Lào Cai, Cao Bằng.",
      botanicalDescription:
        "Đảng sâm là loài thực vật thân cỏ, dây leo quấn và sống nhiều năm. Thân cây có màu tím sẫm, phủ lông nhỏ, thưa nhưng không có lông ở phần ngọn; cây mọc bò trên mặt đất hoặc mọc leo nhờ các loài thực vật khác. Lá có màu xanh hơi vàng, hình trứng tròn và đuôi nhọn, lông nhung phủ trên bề mặt, mặt dưới màu xám, mép nguyên không có răng cưa. Hoa mọc ở nách lá, màu xanh nhạt hơi pha vàng; quả nhỏ, hạt màu nâu.",
      harvestProcessing:
        "Thu hái chủ yếu vào mùa đông khi cây rụng lá hoặc đợi đến mùa xuân năm sau, nhưng cần thu hái trước khi cây ra lộc mới. Sau khi đào rễ về, làm sạch đất cát, phân loại rễ và phơi cho khô.\nBào chế: (1) Rửa sạch đất cát, loại bỏ tạp chất và ủ nước trong 1 đêm; khi rễ mềm đem bào mỏng khoảng 1-2 ly, ngâm với nước gừng cho dược liệu bớt hàn và khỏi nê Tỳ, sau đó đem sao qua và dùng dần. (2) Hoặc sau khi thu hái đem phơi âm can, lăn se và để dùng dần; khi dùng lấy dược liệu sao với cám hoặc đất cho vàng.",
      storage:
        "Nơi khô ráo và thoáng mát. Cần đậy kín vì dược liệu rất dễ bị mốc và mọt. Có thể sấy diêm sinh định kỳ để chống mốc.",
      chemicalComposition:
        "Dược liệu chứa nhiều thành phần hóa học, bao gồm inulin, glucose, alkaloid, tangshenoside, choline, fructose, sucrose, đường, tinh bột, saponin.",
      meridians: mergedMeridians,
      actions: mergedActions,
      indications:
        "Chủ trị phế hư, người mệt, khát, thoát giang, tỳ vị hư yếu, ăn ít, khí huyết đều hư. Điều trị bệnh bạch huyết, tụy tạng, thiếu máu mãn tính, lỵ lâu ngày, khí suyễn, nội thương, hư lao, băng huyết, phát sốt.",
      modernPharmacology:
        "Tác dụng chống mệt mỏi và tăng khả năng thích nghi của cơ thể đối với môi trường; Dịch của dược liệu có tác dụng tăng cường độ co bóp, tăng trương lực và bảo vệ niêm mạc bị loét ở dạ dày; Tăng cường độ co bóp của tim, tăng áp và lưu lượng máu cho nội tạng, các chi, não; Giảm số lượng bạch cầu, tăng hồng cầu và đường huyết; Tăng cường khả năng miễn dịch của cơ thể, giảm ho, kháng viêm và long đờm; Làm hưng phấn tử cung, tăng nồng độ cortisone trong huyết tương và kháng lại trực khuẩn lao, trực khuẩn bạch hầu, phó trực khuẩn đại tràng, não mô cầu khuẩn, tụ cầu khuẩn vàng.",
      dosage: mergedDosage,
      sourceId: source.id,
    },
  });
  console.log("Đã bổ sung đầy đủ nội dung bản thảo cho Đẳng sâm.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
