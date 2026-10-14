// Bổ sung description + keySigns cho 8 Pattern thuộc nguồn "Mô hình bệnh-chứng hậu-chứng trạng
// (Ths Bs Võ Thanh Phong, 30 slide)", 2 nhóm: Tiền K dạ dày (4 thể) và Đới hạ (4 thể). Nguồn trình bày
// theo mô hình Bệnh-Chứng hậu-Chứng trạng (dùng cho mục đích minh họa mô hình biện chứng hiện đại hóa,
// trích dẫn y văn Trung Quốc), chỉ có 2 ca lâm sàng minh họa đầy đủ triệu chứng (Tỳ vị thấp nhiệt và Tỳ
// khí khuy hư); 6 thể còn lại chỉ có tên chứng + phương thuốc. keySigns/description của các thể còn lại
// suy luận theo tương quan chứng hậu-triệu chứng CHUẨN của tỳ vị/phụ khoa YHCT, khớp bối cảnh bệnh đã nêu
// (tiền ung thư dạ dày / đới hạ), không bịa thêm chi tiết lâm sàng cụ thể.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updates: { name: string; description: string; keySigns: string }[] = [
  {
    name: "Tỳ Vị thấp nhiệt (tiền K dạ dày)",
    description:
      "Thấp nhiệt uẩn kết trung tiêu (tỳ vị) trên nền bệnh tiền ung thư dạ dày (viêm dạ dày mạn teo kèm dị sản). Ca lâm sàng minh họa trong nguồn (nữ 66 tuổi, nội soi viêm dạ dày mạn teo kèm trợt, dị sản ruột nhẹ, dị sản không điển hình trung bình-nặng, Hp âm tính): đầy bụng khó tiêu nhiều năm, ợ hơi, ăn được, đại tiện 1 lần/ngày, lưỡi đỏ rêu nhớt, mạch tế huyền. Pháp trị: Thanh nhiệt giải độc, lý khí tiêu bĩ. Phương dược điển hình: Hoắc hương, Pháp bán hạ, Mộc hương, Tô ngạnh, Trần bì, Đại phúc bì, Thũng tiết phong (Sói rừng), Bạch hoa xà thiệt thảo, Khương hoàng, Bán chi liên, Cam thảo — kết hợp nhóm thanh nhiệt giải độc trừ thấp (Bạch hoa xà thiệt thảo, Bán chi liên — kháng ung thư, thúc đẩy apoptosis tế bào K) và lý khí tiêu bĩ.",
    keySigns:
      "Đầy bụng khó tiêu kéo dài, ợ hơi, ăn được, lưỡi đỏ, rêu nhớt (nhớt=thấp, đỏ=nhiệt), mạch tế huyền. Trên nền bệnh viêm dạ dày mạn teo kèm dị sản (nội soi).",
  },
  {
    name: "Tỳ Vị khí trệ (tiền K dạ dày)",
    description:
      "Khí cơ trung tiêu uất trệ trên nền bệnh tiền ung thư dạ dày — khác thể thấp nhiệt ở chỗ không có dấu hiệu thấp nhiệt rõ (rêu nhớt, lưỡi đỏ) mà chủ yếu biểu hiện khí trệ (trướng đau, ợ hơi nhiều, liên quan tình chí). Pháp trị (theo nguồn): dùng phương Tứ nghịch tán gia giảm (sơ can lý khí, hòa vị).",
    keySigns:
      "Đầy trướng thượng vị, ợ hơi nhiều, đau tức vùng thượng vị có thể liên quan đến tình chí/cảm xúc, ăn kém, rêu lưỡi mỏng trắng, mạch huyền. Trên nền bệnh viêm dạ dày mạn teo kèm dị sản.",
  },
  {
    name: "Tỳ Vị khí hư (tiền K dạ dày)",
    description:
      "Tỳ vị khí hư trên nền bệnh tiền ung thư dạ dày — vận hóa thất kiện lâu ngày (khác 2 thể trên ở tính chất HƯ chứng, bệnh trình dài hơn, không có dấu hiệu thực tà rõ). Pháp trị (theo nguồn): dùng phương Hương sa lục quân tử thang gia giảm (kiện tỳ ích khí, hành khí hòa vị).",
    keySigns:
      "Ăn kém, đầy bụng tăng sau ăn, mệt mỏi, sắc mặt vàng nhạt hoặc kém tươi, đại tiện phân nát/lỏng, lưỡi nhạt bệu có thể có dấu răng, rêu trắng mỏng, mạch hư nhược. Trên nền bệnh viêm dạ dày mạn teo kèm dị sản.",
  },
  {
    name: "Khí âm lưỡng hư (tiền K dạ dày)",
    description:
      "Giai đoạn bệnh tiến triển lâu dài hơn trên nền tiền ung thư dạ dày, cả khí và âm dịch đều hư tổn (nặng hơn thể tỳ vị khí hư đơn thuần) — vị âm hao tổn kèm khí hư nên vừa có dấu hiệu khô táo (âm hư) vừa có dấu hiệu mệt mỏi ăn kém (khí hư). Pháp trị (theo nguồn): dùng phương Tiêu bĩ phương gia giảm (ích khí dưỡng âm, tiêu bĩ).",
    keySigns:
      "Ăn kém kèm miệng khô họng khô (khác tỳ vị khí hư đơn thuần không khô), mệt mỏi, có thể gầy sút, đại tiện khô hoặc thất thường, lưỡi đỏ hoặc nhạt mà khô ít tân dịch, mạch tế nhược hoặc tế sác. Trên nền bệnh viêm dạ dày mạn teo kèm dị sản tiến triển.",
  },
  {
    name: "Thấp nhiệt uẩn kết (đới hạ)",
    description:
      "Thấp nhiệt uẩn kết hạ tiêu (thường tương ứng viêm âm đạo do nấm/vi khuẩn theo góc nhìn hiện đại trong nguồn) — bệnh vị tại hạ tiêu, chứng hậu thực/thấp nhiệt. Pháp trị (theo nguồn): Long đởm tả can thang (thanh nhiệt táo thấp làm chủ).",
    keySigns:
      "Đới hạ (khí hư) ra nhiều, màu vàng hoặc đục, có thể có mùi hôi, kèm ngứa rát âm hộ/âm đạo, tiểu tiện có thể ngắn vàng, lưỡi đỏ rêu vàng nhớt, mạch hoạt sác hoặc nhu sác. Bệnh cảnh tương ứng viêm âm đạo (thực chứng).",
  },
  {
    name: "Tỳ khí khuy hư (đới hạ)",
    description:
      "Tỳ khí hư yếu không thống nhiếp, thấp trọc hạ chú — ca lâm sàng minh họa trong nguồn (nữ 34 tuổi, bạch đới bất thường tái phát 1 năm, rõ 4-5 ngày sau sạch kinh, tiền sử viêm âm đạo do nấm đã điều trị, HPV dương tính, có vòng tránh thai): bạch đới nhiều dạng bã đậu, KHÔNG MÙI, KHÔNG NGỨA (khác thể thấp nhiệt có mùi hôi/ngứa), gây khó chịu âm hộ, kinh nguyệt bình thường, lưỡi nhợt bệu, rêu mỏng trắng, mạch hoạt tế. Pháp trị: Ích khí kiện tỳ, táo thấp chỉ đới (Phó Thanh Chủ Hoàn đới thang). Phương dược điển hình: Bắc hoàng kỳ, Phòng phong, Đảng sâm, Thổ phục linh, Bạch truật sống, Khổ sâm, Trần bì, Mẫu đơn bì, Bồ công anh, Bạch biển đậu, Thổ miết trùng, Đương quy, Xích tiểu đậu, Thăng ma, Sinh cam thảo — cơ chế: tỳ khí hư sinh thấp, thấp hạ chú nên kiện tỳ ích khí táo thấp chỉ đới là nguyên tắc xuyên suốt; bệnh lâu ngày 'cửu bệnh nhập lạc' nên gia Thổ miết trùng thông lạc; nếu kèm can huyết hư/can uất sinh nhiệt thì gia Uất kim, Bồ công anh, Kê huyết đằng sơ can thanh nhiệt điều huyết.",
    keySigns:
      "Bạch đới nhiều, dạng bã đậu, KHÔNG MÙI, KHÔNG NGỨA, gây khó chịu âm hộ; kinh nguyệt bình thường (không huyết khối, không thống kinh); lưỡi nhợt bệu, rêu mỏng trắng, mạch hoạt tế. Đặc trưng tái phát rõ sau sạch kinh 4-5 ngày.",
  },
  {
    name: "Tỳ Thận dương hư (đới hạ)",
    description:
      "Tỳ thận dương hư, hạ nguyên bất cố — bệnh trình lâu hơn thể tỳ khí hư, kèm thêm dấu hiệu thận dương hư toàn thân. Theo bối cảnh nguồn (hệ thống nguyên tắc dùng vị thuốc: tay chân lạnh gia Can khương/Phụ tử; đau lạnh gia Ngô thù du/Hương phụ/Ngải diệp; tiểu đêm lưng gối lạnh đau gia Nhục thung dung/Thỏ ty tử/Nhục quế/Tiên mao/Tiên linh tỳ/Bổ cốt chi) — các vị thuốc này cho thấy thể này có đặc trưng lâm sàng là lạnh (tay chân lạnh, đau lạnh, lưng gối lạnh đau, tiểu đêm nhiều).",
    keySigns:
      "Đới hạ trong loãng, lượng nhiều, kéo dài, kèm tay chân lạnh, sợ lạnh, lưng gối lạnh đau mỏi, tiểu đêm nhiều lần, lưỡi nhạt bệu, rêu trắng, mạch trầm trì hoặc trầm nhược.",
  },
  {
    name: "Can Thận âm hư (đới hạ)",
    description:
      "Can thận âm hư, hư nhiệt nội sinh — tương ứng bệnh cảnh viêm nội mạc tử cung trong mô hình bệnh-chứng của nguồn (bệnh vị Can Thận, chứng hậu uất nhiệt/tà xâm). Pháp trị (theo nguồn): Tư âm huyết, thanh hư nhiệt; phương Tri bá địa hoàng hoàn.",
    keySigns:
      "Đới hạ ít, màu vàng hoặc hồng nhạt, kèm ngũ tâm phiền nhiệt, lưng gối mỏi, chóng mặt ù tai, miệng khô họng khô, có thể kinh nguyệt không đều, lưỡi đỏ ít rêu, mạch tế sác.",
  },
];

async function main() {
  for (const u of updates) {
    const p = await prisma.pattern.findFirst({ where: { name: { equals: u.name, mode: "insensitive" } } });
    if (!p) { console.log(`KHÔNG TÌM THẤY: ${u.name}`); continue; }
    await prisma.pattern.update({ where: { id: p.id }, data: { description: u.description, keySigns: u.keySigns } });
    console.log(`Đã cập nhật: ${u.name}`);
  }

  // Bổ sung symptoms cho 2 Disease liên quan (cùng nguồn)
  const tienK = await prisma.disease.findFirst({ where: { name: "Tiền ung thư dạ dày (viêm teo dạ dày mạn kèm dị sản)" } });
  if (tienK) {
    await prisma.disease.update({ where: { id: tienK.id }, data: {
      definition: "Viêm dạ dày mạn teo kèm dị sản ruột/dị sản không điển hình — tổn thương tiền ung thư dạ dày theo mô hình Bệnh-Chứng hậu-Chứng trạng (bệnh xác định theo YHHĐ qua nội soi/mô bệnh học; chứng hậu biện theo YHCT: tỳ vị thấp nhiệt, khí trệ, khí hư, khí âm lưỡng hư).",
      symptoms: "Đầy bụng khó tiêu kéo dài nhiều năm, ợ hơi, có thể đau thượng vị, buồn nôn, miệng đắng, mất ngủ, tức ngực — biểu hiện khác nhau tùy chứng hậu kèm theo (thấp nhiệt/khí trệ/khí hư/khí âm lưỡng hư). Chẩn đoán xác định dựa nội soi + mô bệnh học (dị sản ruột, dị sản không điển hình, nhiễm Hp).",
    }});
    console.log("Đã cập nhật Disease: Tiền ung thư dạ dày");
  }

  const doiHa = await prisma.disease.findFirst({ where: { name: "Đới hạ (khí hư/bạch đới bất thường)" } });
  if (doiHa) {
    await prisma.disease.update({ where: { id: doiHa.id }, data: {
      definition: "Tình trạng khí hư/bạch đới ra bất thường về lượng, màu sắc, mùi, hoặc kèm triệu chứng khó chịu tại chỗ — theo mô hình Bệnh-Chứng hậu-Chứng trạng, bệnh danh hiện đại tương ứng có thể là viêm âm đạo, viêm cổ tử cung, viêm nội mạc tử cung, hoặc viêm phần phụ tùy bệnh vị và chứng hậu kèm theo.",
      symptoms: "Lượng đới hạ nhiều/ít bất thường, tính chất (loãng/đặc, dạng bã đậu, có bọt), màu sắc (trắng, vàng, hồng), có mùi hôi hoặc không mùi, kèm ngứa rát âm hộ/âm đạo hoặc không ngứa, có thể kèm rối loạn kinh nguyệt, đau bụng dưới, tiểu buốt rắt tùy thể bệnh (thấp nhiệt uẩn kết/tỳ khí khuy hư/tỳ thận dương hư/can thận âm hư).",
    }});
    console.log("Đã cập nhật Disease: Đới hạ");
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
