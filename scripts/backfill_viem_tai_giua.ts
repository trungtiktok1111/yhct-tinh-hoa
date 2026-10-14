// Bổ sung description + supportCriteria cho 18 Pattern thuộc nguồn "Viêm tai giữa theo Y học cổ truyền"
// (PDF: VIÊM TAI GIỮA theo YHCT.pdf). Các Pattern này trước đây chỉ có keySigns (trích bảng biện chứng
// luận trị của nguồn), chưa có description (cơ chế bệnh sinh) hay supportCriteria (tiêu chí chẩn đoán).
// description: suy luận cơ chế bệnh sinh theo lý luận YHCT chuẩn (tạng tượng/bát cương) nối triệu chứng
// với tên chứng — không bịa thêm triệu chứng/vị thuốc nào ngoài nguồn.
// supportCriteria: trích nguyên văn "Đặc điểm chẩn đoán" + "Chẩn đoán phân biệt" của nguồn (nội dung có
// thật trong PDF nhưng chưa được đưa vào DB).
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const commonSupport =
  "Đặc điểm chẩn đoán chung của Viêm tai giữa: tai căng đau, thính lực giảm. Chẩn đoán phân biệt: Chứng ráy tai bế tắc (tai căng đau, có cục ráy tai làm bế tắc tai); Chứng vật lạ vào tai (tai bế, đau, nếu trùng vào tai có cảm giác như trùng bò).";

const hoaMuSupport =
  "Đặc điểm chẩn đoán của Viêm tai giữa hóa mủ: tai đau, chảy mủ, thính lực giảm. Chẩn đoán phân biệt: Mụn tai (lỗ tai sưng đỏ, nổi mụn, lở loét chảy máu mủ); Chứng lở tai (lỗ tai sưng đỏ lở loét, chảy mủ hôi thối, màng tai không biến đổi). Biến chứng nặng: nếu đột nhiên mắt trợn ngược, mắt miệng méo, chảy nước dãi, hoặc sốt cao hôn mê, nôn mửa, co quắp — gọi là Hoàng nhĩ thương hàn (độc mủ xâm phạm não), cần cảnh giác cao.";

const updates: { name: string; description: string; supportCriteria: string }[] = [
  {
    name: "Ngoại cảm phong hàn (viêm tai giữa)",
    description:
      "Phong hàn tà xâm phạm cơ biểu và kinh lạc vùng tai (thủ thiếu dương tam tiêu, túc thiếu dương đởm kinh đều đi qua tai), hàn tà ngưng trệ làm bế tắc kinh khí tại tai nên tai căng hơi đau, nghe tiếng kêu trong tai. Phong hàn phạm phế vệ nên nhức đầu, nghẹt mũi, chảy nước trong, sợ lạnh. Vệ dương bị uất, chính khí kháng tà ra ngoài nên mạch phù; hàn tà làm mạch đạo co thắt nên mạch khẩn.",
    supportCriteria: commonSupport,
  },
  {
    name: "Phong nhiệt xâm nhập tai",
    description:
      "Phong nhiệt tà xâm phạm kinh lạc vùng tai, nhiệt tính viêm thượng nên tai căng đau nhức nhiều hơn phong hàn, kèm sốt, đau đầu. Nhiệt tà phạm phế vệ nên nghẹt mũi chảy nước mũi; nhiệt thương tân dịch nên miệng khô họng ráo; nhiệt tại biểu nên đầu lưỡi đỏ, mạch phù sác (phù=biểu, sác=nhiệt).",
    supportCriteria: commonSupport,
  },
  {
    name: "Can hỏa nung đốt (tai)",
    description:
      "Túc thiếu dương đởm kinh đi qua tai nên khi can đởm hỏa thịnh, hỏa tà tuần kinh thượng viêm tại tai gây tai căng đau như bị chèn, tai kêu như tiếng ve (ve kêu là đặc trưng của hỏa nhiễu tai, khác tiếng kêu nhẹ của phong hàn/phong nhiệt). Can hỏa thượng xung đầu mắt nên chóng mặt hoa mắt; can hỏa nhiễu đởm nên miệng đắng, phiền táo; can khí uất hỏa nên ngực sườn đầy đau; nhiệt thịnh nên rêu lưỡi vàng, mạch huyền (chủ can bệnh).",
    supportCriteria: commonSupport,
  },
  {
    name: "Thấp khí đình trệ trong tai",
    description:
      "Thấp tà trọng trọc đình trệ tại tai (thuộc thanh khiếu, dễ bị thấp trọc che lấp) gây tai căng bế tắc, thính lực giảm — khác tính chất đau nhức của phong/hỏa, thấp tà biểu hiện chủ yếu là bế tắc và nặng nề. Thấp trở thanh dương không thăng lên đầu nên đầu căng nặng; thấp tính nê trệ nên rêu lưỡi trắng bệu; mạch hoãn là mạch thường gặp của thấp chứng.",
    supportCriteria: commonSupport,
  },
  {
    name: "Khí trệ huyết ứ (tai)",
    description:
      "Khí trệ lâu ngày dẫn đến huyết ứ tại lạc mạch vùng tai, khí huyết không thông nên tai căng bế tắc, tai ù, thính lực giảm — bệnh thường kéo dài hơn các thể ngoại cảm. Ứ huyết biểu hiện ở lưỡi tím hoặc có điểm ứ huyết; mạch huyền (khí trệ) sáp (huyết ứ) phản ánh cả hai cơ chế cùng tồn tại.",
    supportCriteria: commonSupport,
  },
  {
    name: "Tỳ Vị khí hư (tai)",
    description:
      "Tỳ vị là nguồn sinh hóa khí huyết; tỳ vị khí hư thì thanh dương bất thăng, tai (thanh khiếu) không được khí huyết nuôi dưỡng đầy đủ nên tai căng bế, ù tai, thính lực kém — đặc trưng là bệnh mạn tính kèm toàn thân suy nhược: ăn uống giảm sút, mệt mỏi, lưỡi lạt (nhạt), mạch nhược (vô lực, đặc trưng khí hư).",
    supportCriteria: commonSupport,
  },
  {
    name: "Can Thận âm hư (tai)",
    description:
      "Thận khai khiếu ở tai (thận chủ nhĩ); can thận đồng nguyên, âm dịch bất túc thì tai mất nuôi dưỡng nên tai căng, tai ù, thính lực giảm — là thể hư nhiệt mạn tính. Âm hư sinh nội nhiệt nên chóng mặt, ngủ kém, miệng khô, phiền nhiệt; thận âm hư cốt tủy không sung nên lưng đau; lưỡi đỏ ít rêu là dấu hiệu âm hư kinh điển.",
    supportCriteria: commonSupport,
  },
  {
    name: "Thể cấp tính — phong nhiệt, nhiệt độc xâm phạm Can Đởm",
    description:
      "Nguồn ghi rõ: 'Nguyên nhân: Do phong nhiệt, nhiệt độc xâm phạm Can – Đởm.' Phong nhiệt độc tà kết hợp can đởm hỏa thịnh nung đốt tai mạnh hơn hẳn các thể đơn thuần, nên đau dữ dội theo nhịp đập, đau từng cơn, lan ra xương chũm/nửa mặt/nửa đầu (đau nhiều về đêm do âm khí thịnh làm trở trệ khí huyết nặng hơn); tà nhiệt độc thịnh toàn thân nên sốt cao, tiêu chảy, mệt mỏi; nhiệt độc hóa mủ nên tai chảy mủ vàng đặc có dính máu; rêu lưỡi vàng mạch huyền sác là dấu hiệu can đởm thực hỏa. Điều trị: Sơ phong thanh nhiệt hoặc trừ thấp ở Can-Đởm, dùng Sài hồ sơ can thang gia giảm (Hoàng cầm, Chi tử, Long đởm, Bạc hà thanh nhiệt; Sài hồ sơ phong; Kim ngân trừ thấp tiêu độc; có máu mủ thêm Sinh địa 16g, Đơn bì 12g); hoặc Điều áp lưu khí ẩm, Nhĩ để tán, Bài nùng thang gia vị, Phổ tế tiêu độc ẩm. Thuốc nhỏ: Khô mai tán. Châm cứu: Nhĩ môn, Ế phong, Hợp cốc (Châm cứu đại thành); hoặc Lư tức, Nhĩ môn, Thính cung, Thính hội (Châm cứu học HongKong).",
    supportCriteria: commonSupport,
  },
  {
    name: "Thể mạn tính — Thấp nhiệt ở Can kinh, đợt cấp",
    description:
      "Thấp nhiệt tích tụ lâu ngày ở can kinh, gặp đợt cấp bùng phát gây tai đau nhức, mủ chảy đặc dính, mùi hôi, lượng nhiều — khác thể cấp tính nguyên phát ở chỗ đây là đợt bùng phát trên nền bệnh mạn tính đã có. Điều trị: Thanh Can, lợi thấp — Long đởm tả can thang gia giảm. Châm cứu: Ế phong, Nhĩ môn, Phong trì, Hợp cốc, Thái xung (Châm cứu học giảng nghĩa).",
    supportCriteria: hoaMuSupport,
  },
  {
    name: "Thể mạn tính — Thận hư hoặc âm hư hỏa vượng",
    description:
      "Bệnh mạn tính lâu ngày tổn thương thận âm, hư hỏa nội viêm nên mủ ra thường xuyên nhưng loãng (khác mủ đặc của thấp nhiệt), kèm tai ù nghe kém, hoa mắt chóng mặt, ngủ ít, lưng gối đau mỏi (đặc trưng thận hư), rêu lưỡi ít mạch tế sác (âm hư). Điều trị: Dưỡng âm, thanh nhiệt, bổ Thận, thông khiếu — Tri bá địa hoàng thang, Dương hòa thang, Nhĩ cam tán. Châm cứu: Nhĩ môn, Ế phong, Thận du, Tam âm giao, Thái khê (Châm cứu học giảng nghĩa).",
    supportCriteria: hoaMuSupport,
  },
  {
    name: "Thể mạn tính — Tỳ hư (thường gặp ở trẻ nhỏ)",
    description:
      "Tỳ hư vận hóa thất chức, đặc biệt thường gặp ở trẻ nhỏ (tỳ vị chưa kiện toàn) nên chảy mủ loãng kéo dài, kèm dấu hiệu tỳ hư toàn thân: sắc mặt vàng bủng, ăn kém, chậm tiêu, đại tiện loãng, mệt mỏi, mạch hoãn nhược. Điều trị: Kiện Tỳ, hóa thấp — Sâm linh bạch truật tán gia giảm. Châm cứu: Hợp cốc, Ế phong, Nhĩ môn (Châm cứu đại thành); hoặc Nhĩ môn, Ế phong, Thính hội, Phong trì, Túc tam lý (Châm cứu học giảng nghĩa); hoặc Ế phong, Hợp cốc/Phong trì, Thính cung, Ngoại quan — Ế phong/Thính cung/Nhĩ môn sơ thông kinh khí cục bộ, Phong trì hỗ trợ nếu đau lan gáy/xương chũm, Hợp cốc/Ngoại quan thanh nhiệt giải biểu (Chọn huyệt châm cứu); hoặc Lư tức, Nhĩ môn, Thính cung, Thính hội (Châm cứu học HongKong).",
    supportCriteria: hoaMuSupport,
  },
  {
    name: "Phong nhiệt xâm phạm tai (hóa mủ)",
    description:
      "Phong nhiệt tà xâm phạm tai gây viêm cấp tính của thể hóa mủ: tai căng tức bế tắc, hơi đau nhức, màng tai đỏ sưng — giai đoạn đầu trước khi hóa mủ rõ. Phong nhiệt phạm vệ nên phát sốt, đau đầu, nghẹt mũi chảy nước; rêu lưỡi vàng mạch phù sác là dấu hiệu phong nhiệt tại biểu.",
    supportCriteria: hoaMuSupport,
  },
  {
    name: "Can đởm thấp nhiệt (hóa mủ)",
    description:
      "Thấp nhiệt uẩn kết can đởm kinh (kinh đi qua tai) nung đốt mạnh hơn phong nhiệt đơn thuần nên tai căng đau nhức rõ rệt, ù tai, thính lực giảm, chảy mủ nước vàng đặc và hôi (đặc trưng thấp nhiệt — mủ đặc có mùi, khác mủ loãng của hư chứng). Can đởm thấp nhiệt thượng nhiễu nên chóng mặt hoa mắt, miệng đắng; thấp nhiệt hạ chú nên tiểu ngắn vàng; rêu lưỡi vàng dày là dấu hiệu thấp nhiệt điển hình.",
    supportCriteria: hoaMuSupport,
  },
  {
    name: "Âm hư hỏa vượng (hóa mủ)",
    description:
      "Âm dịch hư tổn lâu ngày, hư hỏa nội viêm nên tai chảy mủ lượng ÍT, khi chảy khi không (khác thực chứng mủ nhiều liên tục), mủ đặc dính hôi thối, thính lực giảm. Hư hỏa thượng viêm nên ngũ tâm phiền nhiệt, mặt đỏ; âm hư không tư nhuận nên họng khô miệng ráo; lưỡi đỏ ít rêu là dấu hiệu âm hư kinh điển. Điều trị: Tư âm giáng hỏa — Tri bá địa hoàng thang.",
    supportCriteria: hoaMuSupport,
  },
  {
    name: "Tỳ hư thấp thịnh (hóa mủ)",
    description:
      "Tỳ hư vận hóa thất chức, thấp trọc nội sinh lưu trệ lâu tại tai nên chảy mủ lâu ngày KHÔNG LÀNH (đặc trưng mạn tính dai dẳng do tỳ hư). Tỳ hư toàn thân nên mệt mỏi, ăn kém; tỳ hư huyết hóa sinh kém nên mặt vàng úa hoặc trắng xanh; thấp trọc thượng nhiễu nên chóng mặt hoa mắt; lưỡi lạt rêu lưỡi bệu là dấu hiệu tỳ hư thấp thịnh. Điều trị: Kiện Tỳ hóa thấp — Thác lý tiêu độc tán gia Địa phu tử.",
    supportCriteria: hoaMuSupport,
  },
  {
    name: "Nhiệt uất gây nhọt lở",
    description:
      "Nhiệt độc uất kết tại chỗ gây nung mủ cục bộ mạnh (khác nhiệt lan tỏa của phong nhiệt/can đởm thấp nhiệt): tai chảy mủ không thông lợi, sau tai sưng đỏ đau nóng, xoắn tai hướng về trước (dấu hiệu viêm cục bộ rõ), tai ra mủ nhiều, kèm phát sốt phiền khát toàn thân, rêu lưỡi vàng. Điều trị: Giải độc trừ mủ — Ngũ vị tiêu độc ẩm hợp Bài nùng tán.",
    supportCriteria: hoaMuSupport,
  },
  {
    name: "Huyết ứ bế tắc kinh lạc (tai)",
    description:
      "Mủ độc lưu cữu lâu ngày làm huyết ứ bế tắc kinh lạc vùng mặt (kinh lạc vùng tai liên hệ mặt), ứ huyết trở trệ gây mặt tê cứng, đột nhiên miệng mắt méo, miệng chảy nước dãi — đây là biến chứng thần kinh mặt do mủ độc/ứ huyết tắc kinh lạc lâu ngày, nặng hơn các thể trên; lưỡi đỏ tím hoặc có điểm ứ huyết là dấu hiệu ứ huyết. Điều trị: Hoạt huyết thông kinh lạc — Thông khiếu hoạt huyết thang.",
    supportCriteria: hoaMuSupport,
  },
  {
    name: "Mủ độc xâm phạm não",
    description:
      "Mức độ NẶNG NHẤT trong các biến chứng: mủ độc không được dẫn lưu, xâm phạm nội sọ gây mủ đen hôi thối, tai đau nhức, phát sốt, đau đầu dữ dội, nôn mửa, co cứng (dấu hiệu màng não/nội sọ) — tương ứng với 'Hoàng nhĩ thương hàn' mà nguồn mô tả (đột nhiên mắt trợn ngược, mắt miệng méo, chảy nước dãi, hoặc đột nhiên sốt cao hôn mê, nôn mửa, co quắp) — đây là cấp cứu cần phối hợp Tây y ngay. Lưỡi đỏ ít rêu là dấu hiệu nhiệt độc thương âm nặng. Điều trị: Lương huyết tức phong — Thanh ôn bại độc ẩm.",
    supportCriteria: hoaMuSupport + " CẢNH BÁO: đây là biến chứng nguy hiểm tính mạng, cần chuyển cấp cứu Tây y phối hợp ngay khi nghi ngờ.",
  },
];

async function main() {
  for (const u of updates) {
    const p = await prisma.pattern.findFirst({ where: { name: { equals: u.name, mode: "insensitive" } } });
    if (!p) {
      console.log(`KHÔNG TÌM THẤY: ${u.name}`);
      continue;
    }
    await prisma.pattern.update({
      where: { id: p.id },
      data: { description: u.description, supportCriteria: u.supportCriteria },
    });
    console.log(`Đã cập nhật: ${u.name}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
