// Bổ sung description + supportCriteria cho 8 Pattern thuộc nguồn "Kinh nghiệm điều trị viêm xoang của
// Quốc y đại sư Can Tổ Vọng" (docx, 2 phần). Nguồn có mô tả cơ chế bệnh sinh rõ ràng cho viêm xoang cấp
// (3 thể) và mạn tính (4 thể), trước đây chỉ trích keySigns, chưa đưa cơ chế + bài thuốc điển hình vào DB.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const capMechanism =
  "Theo Can Tổ Vọng: viêm xoang cấp tính đa phần do phong hàn hoặc phong nhiệt xâm nhập, khiến phế mất khả năng thanh túc, tà độc trệ kết lại trong mũi, ngăn trở khí cơ, khiến thanh dương không thăng lên được, trọc âm che lấp ở trên mà thành bệnh.";

const manMechanism =
  "Theo Can Tổ Vọng: viêm xoang mạn tính (thứ phát sau cấp tính, tái phát nhiều lần khó lành) có 4 nguyên nhân/bệnh sinh thường gặp, có thể ảnh hưởng lẫn nhau: phế khí hư hàn + ngoại tà xâm nhập; can đởm uất nhiệt bốc lên thanh khiếu; tỳ hư thấp thịnh khiến thanh dương không thăng, trọc âm tràn lên trên; tủy hải trống rỗng, hư hỏa thượng viêm (tủy hải trống rỗng khiến tạng phủ thiếu nuôi dưỡng, cũng có thể dẫn đến phế tỳ hư nhược, thanh dương không thăng, tân dịch trọc hóa thành đàm).";

const updates: { name: string; description: string; supportCriteria: string }[] = [
  {
    name: "Phong hàn xâm nhập (viêm xoang cấp)",
    description:
      capMechanism +
      " Thể phong hàn: hàn tà phạm phế, phế khí uất trệ, tấu lý bế tắc nên mũi nghẹt không thông, chảy nhiều nước mũi TRONG LOÃNG (hàn là âm tà, dịch loãng không đặc — khác phong nhiệt), mất khứu giác tạm thời; niêm mạc mũi NHỢT NHẠT và phù nề (hàn ngưng trệ, khí huyết không đến nuôi dưỡng nên nhợt — khác niêm mạc xung huyết đỏ của phong nhiệt); kèm sợ lạnh, đau đầu, ít mồ hôi (biểu hàn chứng), mạch phù khẩn (phù=biểu, khẩn=hàn). Điều trị: tân ôn giải biểu — Kinh phòng bại độc tán hợp Thương nhĩ tử tán (kinh giới, phòng phong, khương hoạt, bạch chỉ, tân di, bạc hà, cát cánh, cam thảo, thương nhĩ tử, xuyên khung).",
    supportCriteria:
      "Mũi nghẹt, chảy nhiều nước mũi TRONG LOÃNG, mất khứu giác tạm thời, niêm mạc mũi NHỢT NHẠT và phù nề, xoang mũi tiết nhiều dịch, kèm sợ lạnh, đau đầu, ít mồ hôi, mạch phù khẩn. Nguồn: Can Tổ Vọng, 'Kinh nghiệm điều trị viêm xoang' phần 1.",
  },
  {
    name: "Phong nhiệt xâm nhập (viêm xoang cấp)",
    description:
      capMechanism +
      " Thể phong nhiệt: nhiệt tà phạm phế, phế thất thanh túc, nhiệt chưng dịch mũi nên mũi nghẹt, chảy nhiều nước mũi MÀU VÀNG (nhiệt tà chưng đốt dịch — khác dịch trong loãng của phong hàn), khứu giác giảm/mất; niêm mạc mũi XUNG HUYẾT (nhiệt tính viêm, khác nhợt nhạt của hàn), chảy nhiều nước mũi vàng đặc; kèm phát sốt, đau đầu, RA MỒ HÔI (khác không mồ hôi của phong hàn), ho, miệng khô thích uống lạnh, rêu lưỡi vàng nhạt, mạch phù sác (phù=biểu, sác=nhiệt). Điều trị: sơ phong thanh nhiệt — Tang cúc ẩm hợp Thương nhĩ tử tán (tang diệp, cúc hoa, kim ngân hoa, liên kiều, bạc hà, thương nhĩ tử, tân di, tang bạch bì, cát cánh, ngư tinh thảo).",
    supportCriteria:
      "Mũi nghẹt, chảy nhiều nước mũi MÀU VÀNG, khứu giác giảm/mất, niêm mạc mũi XUNG HUYẾT, chảy nhiều nước mũi vàng đặc, kèm phát sốt, đau đầu, RA MỒ HÔI, ho, miệng khô thích uống nước lạnh, rêu lưỡi vàng nhạt, mạch phù sác. Nguồn: Can Tổ Vọng, 'Kinh nghiệm điều trị viêm xoang' phần 1.",
  },
  {
    name: "Phong nhiệt xâm nhập, nhiệt nặng (viêm xoang cấp)",
    description:
      capMechanism +
      " Thể phong nhiệt nặng hơn (nhiệt thịnh hơn thể phong nhiệt thông thường): tà nhiệt kháng thịnh nên sốt CAO (khác sốt nhẹ của thể phong nhiệt), đau đầu DỮ DỘI, chảy nước mũi vàng đục NHƯ MỦ (nhiệt thịnh hơn làm dịch đặc như mủ — nặng hơn thể phong nhiệt thông thường), miệng khô muốn uống nước, đại tiện bí kết (nhiệt thương tân dịch, trường táo), lưỡi đỏ rêu vàng, mạch sác. Điều trị: dùng pháp KHỔ HÀN để thanh nhiệt tả hỏa (mạnh hơn pháp sơ phong thanh nhiệt của thể trên) — Hoàng liên giải độc thang hợp Thương nhĩ tử tán (thương nhĩ tử, tang bạch bì, nga bất thực thảo, áp chích thảo, ngư tinh thảo, hoàng cầm, sơn chi tử, lô căn, bạc hà, tân di; nếu nước mũi lẫn máu gia sinh địa, đan bì).",
    supportCriteria:
      "Sốt CAO, đau đầu DỮ DỘI, chảy nước mũi vàng đục NHƯ MỦ, miệng khô muốn uống nước, đại tiện bí kết, lưỡi đỏ rêu vàng, mạch sác (nếu nước mũi lẫn máu là dấu hiệu nhiệt thịnh chước thương lạc mạch). Nguồn: Can Tổ Vọng, 'Kinh nghiệm điều trị viêm xoang' phần 1.",
  },
  {
    name: "Thanh dương không thăng (viêm xoang cấp)",
    description:
      capMechanism +
      " Thể thanh dương không thăng: thường gặp 7-10 ngày sau khi khởi phát (giai đoạn muộn của viêm xoang cấp, khi tà khí đã khốn tỳ làm thanh dương bất thăng, trọc âm thượng nghịch che lấp thanh khiếu) — chảy nước mũi nhiều KHÔNG CẦM ĐƯỢC, nghẹt mũi nghiêm trọng, đau đầu và TƯ DUY CHẬM CHẠP (đặc trưng — khác 3 thể trên là đau đầu đơn thuần), kèm chóng mặt, nặng nề, mắt nhìn mờ, tai cảm giác bị nghẹt, miệng dính nhớt (thấp trọc trở trệ), mạch nhu (chủ thấp). Điều trị: thanh dương hóa trọc — Hoắc hương chính khí tán hợp Thương nhĩ tử tán gia thăng ma, sài hồ, cát căn, mạn kinh tử (thương nhĩ tử, tân di, hoắc hương, trạch lan, cát cánh, ngư tinh thảo, mạn kinh tử, thăng ma, xương bồ).",
    supportCriteria:
      "Thường gặp 7-10 ngày sau khởi phát; chảy nước mũi nhiều KHÔNG CẦM ĐƯỢC, nghẹt mũi nghiêm trọng, đau đầu và TƯ DUY CHẬM CHẠP, kèm chóng mặt, nặng nề, mắt nhìn mờ, tai cảm giác bị nghẹt, miệng dính nhớt, mạch nhu. Nguồn: Can Tổ Vọng, 'Kinh nghiệm điều trị viêm xoang' phần 1.",
  },
  {
    name: "Phế khí hư hàn, ngoại tà xâm nhập (viêm xoang mạn)",
    description:
      manMechanism +
      " Thể phế khí hư hàn: phế khí hư nhược sẵn, dễ cảm ngoại hàn tà tái phát — nghẹt mũi LIÊN TỤC nhưng thuyên giảm trong môi trường ẤM (dương hư gặp ấm thì thông, đặc trưng hư hàn), nước mũi nhiều bất thường, TRONG LOÃNG KHÔNG ĐẶC, trầm trọng hơn khi gặp lạnh, niêm mạc mũi dính và NHỢT NHẠT, phì đại cuốn mũi dưới; toàn thân: sợ gió sợ lạnh, đại tiện phân lỏng, tiểu trong dài (dương hư hàn thịnh toàn thân), mạch tế. Điều trị: ôn phế trừ hàn — Ôn phế chỉ lưu đan, Ôn vệ thang gia các vị ôn thông khiếu (tất bạt, tất trừng già, tế tân).",
    supportCriteria:
      "Nghẹt mũi liên tục, THUYÊN GIẢM TRONG MÔI TRƯỜNG ẤM, nước mũi nhiều TRONG LOÃNG không đặc, nặng hơn khi gặp lạnh, niêm mạc mũi dính và nhợt nhạt, phì đại cuốn mũi dưới; sợ gió sợ lạnh, đại tiện lỏng, tiểu trong dài, mạch tế. Nguồn: Can Tổ Vọng, 'Kinh nghiệm điều trị viêm xoang' phần 2.",
  },
  {
    name: "Can đởm uất nhiệt (viêm xoang mạn)",
    description:
      manMechanism +
      " Thể can đởm uất nhiệt: can đởm hỏa thịnh tuần kinh bốc lên thanh khiếu (mũi) — mũi nghẹt, dịch mũi NHẦY ĐẶC VÀ ĐỤC NHƯ MỦ, đau đầu DỮ DỘI, miệng khô và ĐẮNG (đặc trưng can đởm hỏa — khác miệng khô đơn thuần của thể hàn), táo bón, buồn bực dễ cáu giận (can hỏa nhiễu), niêm mạc mũi xung huyết, lưỡi đỏ rêu vàng, mạch huyền sác CÓ LỰC (huyền=can, sác=nhiệt, có lực=thực chứng). Điều trị: tả can thanh phế — Ức kim tán, Long đởm tả can thang (long đởm thảo, hạ khô thảo, ngư tinh thảo, hoàng cầm, sơn chi tử, bạc hà, thương nhĩ tử, tang diệp, tang bạch bì, lô căn); có thể kết hợp Hoắc đởm hoàn.",
    supportCriteria:
      "Mũi nghẹt, dịch mũi nhầy đặc và đục như mủ, đau đầu dữ dội, miệng khô và ĐẮNG, táo bón, buồn bực dễ cáu giận, xung huyết niêm mạc mũi, lưỡi đỏ rêu vàng, mạch huyền sác có lực. Nguồn: Can Tổ Vọng, 'Kinh nghiệm điều trị viêm xoang' phần 2.",
  },
  {
    name: "Tỳ hư thấp thịnh (viêm xoang mạn)",
    description:
      manMechanism +
      " Thể tỳ hư thấp thịnh: tỳ hư vận hóa thất chức, thấp trọc nội sinh, thanh dương không thăng lên được khiến trọc âm che lấp ở trên — nghẹt mũi DAI DẲNG LIÊN TỤC, nước mũi nhiều, MÀU TRẮNG NHIỀU VÀNG ÍT, ĐẶC NHƯ KEO (thấp trọc ngưng kết), cuốn mũi to, niêm mạc trắng nhợt, có thể kèm tăng sản polyp; toàn thân: mệt mỏi, nhức đầu vừa phải, kém ăn, phân lỏng nát (tỳ hư vận hóa kém), lưỡi béo non có vết hằn răng (dấu hiệu tỳ hư thấp thịnh kinh điển). Nếu mũi nghẹt nặng kèm chóng mặt ù tai hay quên là dấu hiệu thanh dương không thăng rõ hơn, cần thêm thuốc thăng thanh khai khiếu. Điều trị: kiện tỳ hóa thấp — Lục quân tử thang hoặc Nhân sâm bạch truật tán hợp Nhị trần thang (đảng sâm, bạch truật, bạch biển đậu, phục linh, ý dĩ nhân, trần bì, pháp bán hạ, hoắc hương, bạch chỉ, tân di; có thể gia đình lịch tử tả phế hóa thấp; nếu thanh dương không thăng rõ gia thăng ma, cát căn, sài hồ).",
    supportCriteria:
      "Nghẹt mũi dai dẳng liên tục, nước mũi nhiều, MÀU TRẮNG NHIỀU VÀNG ÍT, ĐẶC NHƯ KEO, cuốn mũi to, niêm mạc trắng nhợt, có thể kèm tăng sản polyp; mệt mỏi, nhức đầu vừa phải, kém ăn, phân lỏng nát, LƯỠI BÉO NON CÓ VẾT HẰN RĂNG (dấu hiệu đặc trưng tỳ hư thấp thịnh). Nguồn: Can Tổ Vọng, 'Kinh nghiệm điều trị viêm xoang' phần 2.",
  },
  {
    name: "Tủy hải trống rỗng (viêm xoang mạn)",
    description:
      manMechanism +
      " Thể tủy hải trống rỗng: bệnh lâu năm, thận tinh hao tổn, tủy hải (não) không được nuôi dưỡng đầy đủ, hư hỏa thượng viêm — nước mũi tương đối nhiều, MÀU TRẮNG HOẶC ĐỤC, LOÃNG HOẶC ĐẶC, mũi tắc tương đối NHẸ (khác mũi tắc nặng của các thể thực/thấp), kèm chóng mặt, ù tai, DI TINH, ĐỚI HẠ NHIỀU (dấu hiệu thận hư đặc trưng — không có ở 3 thể trên), miệng khô họng táo, tâm phiền triều nhiệt (âm hư nội nhiệt), đại tiện thiên khô, lưỡi đỏ ít rêu, mạch tế sác (âm hư). Điều trị: bổ thận điền tủy, tư âm giáng hỏa — Lục vị địa hoàng hoàn, Tả quy hoàn; nếu nước mũi khó thu liễm hoặc chảy nước mắt nhiều khó kiểm soát dùng thêm Súc tuyền hoàn (ôn thận cố nhiếp).",
    supportCriteria:
      "Bệnh lâu năm; nước mũi màu trắng hoặc đục, loãng hoặc đặc, mũi tắc tương đối NHẸ; kèm chóng mặt, ù tai, DI TINH, ĐỚI HẠ NHIỀU, miệng khô họng táo, tâm phiền triều nhiệt, đại tiện khô, lưỡi đỏ ít rêu, mạch tế sác. Nguồn: Can Tổ Vọng, 'Kinh nghiệm điều trị viêm xoang' phần 2.",
  },
];

async function main() {
  for (const u of updates) {
    const p = await prisma.pattern.findFirst({ where: { name: { equals: u.name, mode: "insensitive" } } });
    if (!p) { console.log(`KHÔNG TÌM THẤY: ${u.name}`); continue; }
    await prisma.pattern.update({ where: { id: p.id }, data: { description: u.description, supportCriteria: u.supportCriteria } });
    console.log(`Đã cập nhật: ${u.name}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
