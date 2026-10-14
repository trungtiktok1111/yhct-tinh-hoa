// Bổ sung description + supportCriteria cho 6 Pattern thuộc nguồn "Bai2_May_day.pptx" (Giáo án Bài 2 —
// Mày đay/Ẩn chẩn, Da liễu YHCT). Nguồn có bảng biện chứng luận trị đầy đủ (triệu chứng, lưỡi-mạch, pháp,
// phương, huyệt) cho cả 6 thể — trước đây chỉ trích keySigns, chưa đưa cơ chế + điều trị đầy đủ vào DB.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updates: { name: string; description: string; supportCriteria: string }[] = [
  {
    name: "Phong hàn phạm biểu (Mày đay)",
    description:
      "Vệ khí hư, tấu lý sơ hở, phong hàn thừa cơ xâm nhập → vệ khí uất trệ ở biểu, khí huyết vận hành không thông → sinh sẩn phù. Hàn là âm tà nên sẩn trắng/hồng NHẠT (khác đỏ của phong nhiệt), gặp lạnh/gió nặng hơn, chườm ấm giảm (hàn gặp ấm thì tán); không khát (hàn không thương tân). Lưỡi nhạt rêu trắng mỏng, mạch phù khẩn (phù=biểu, khẩn=hàn). Pháp: Sơ phong tán hàn, điều hòa Doanh Vệ. Phương: Quế chi thang gia Kinh giới, Phòng phong. Huyệt: Phong trì, Hợp cốc, Huyết hải, Cách du.",
    supportCriteria:
      "Sẩn trắng/hồng nhạt, gặp lạnh-gió nặng hơn, chườm ấm giảm, không khát. Lưỡi nhạt, rêu trắng mỏng. Mạch phù khẩn. Nguồn: Giáo án Bài 2 Mày đay, Da liễu YHCT.",
  },
  {
    name: "Phong nhiệt phạm biểu (Mày đay)",
    description:
      "Phong kết hợp nhiệt tà, hoặc phong hàn uất lại ở biểu lâu ngày hóa nhiệt ('uất cửu hóa hỏa'), doanh vệ bất hòa → sẩn đỏ, nóng rát. Nhiệt tính thượng viêm nên gặp nóng/nắng nặng hơn (khác hàn gặp lạnh nặng); kèm sốt nhẹ, khát nước, họng đỏ đau (nhiệt thương tân). Lưỡi đỏ rêu vàng mỏng, mạch phù sác (phù=biểu, sác=nhiệt). Pháp: Sơ phong thanh nhiệt, điều hòa Doanh Vệ. Phương: Tiêu phong tán gia giảm, hoặc Ngân kiều tán. Huyệt: Khúc trì, Hợp cốc, Huyết hải, Đại chùy.",
    supportCriteria:
      "Sẩn đỏ, nóng rát, gặp nóng/nắng nặng hơn; sốt nhẹ, khát nước, họng đỏ đau. Lưỡi đỏ, rêu vàng mỏng. Mạch phù sác. Nguồn: Giáo án Bài 2 Mày đay, Da liễu YHCT.",
  },
  {
    name: "Trường Vị thấp nhiệt (Mày đay)",
    description:
      "Ăn thức ăn tanh/sống/lạnh hoặc dễ gây dị ứng (hải sản, trứng, đậu phộng...) → trường vị thấp nhiệt nội sinh, uất ở bì phu (thuộc LÝ chứng — khác 5 thể còn lại thuộc biểu). Thấp nhiệt khốn trung tiêu nên sẩn kèm đau bụng, buồn nôn, chán ăn, đại tiện lỏng/táo; liên quan rõ bữa ăn (yếu tố khởi phát đặc trưng). Lưỡi đỏ rêu vàng nhớt (nhớt=thấp), mạch hoạt sác (hoạt=thấp/thực, sác=nhiệt). Pháp: Thanh nhiệt lợi thấp, thông phủ tiết trọc, kiêm giải biểu. Phương: Phòng phong thông thánh tán gia giảm. Huyệt: Túc tam lý, Thiên khu, Huyết hải, Tam âm giao.",
    supportCriteria:
      "Sẩn kèm đau bụng, buồn nôn, chán ăn, đại tiện lỏng/táo; liên quan rõ bữa ăn. Lưỡi đỏ, rêu vàng nhớt. Mạch hoạt sác. Thuộc Lý chứng (khác 5 thể còn lại chủ yếu ở Biểu). Nguồn: Giáo án Bài 2 Mày đay, Da liễu YHCT.",
  },
  {
    name: "Khí huyết hư / Huyết hư sinh phong (Mày đay)",
    description:
      "Cơ địa huyết hư (bệnh mạn tính, phụ nữ sau sinh, người cao tuổi) — huyết hư không nuôi dưỡng được bì phu, sinh 'nội phong', tạo vòng xoắn Phong-Táo-Huyết hư khiến bệnh dai dẳng khó dứt. Đặc trưng: sẩn NHẠT MÀU (khác đỏ/trắng rõ của 2 thể ngoại cảm), hay nổi về CHIỀU TỐI (giờ âm huyết suy), tái phát dai dẳng; kèm mệt mỏi, hoa mắt, ngủ kém (huyết hư toàn thân). Lưỡi nhạt ít rêu, mạch tế nhược (hư chứng kinh điển). Pháp: Ích khí dưỡng huyết, khu phong nhuận táo. Phương: Đương quy ẩm tử gia giảm. Huyệt: Huyết hải, Túc tam lý, Tam âm giao, Khí hải.",
    supportCriteria:
      "Sẩn nhạt màu, hay nổi về chiều tối, tái phát dai dẳng; mệt mỏi, hoa mắt, ngủ kém. Lưỡi nhạt, ít rêu. Mạch tế nhược. Nguồn: Giáo án Bài 2 Mày đay, Da liễu YHCT.",
  },
  {
    name: "Xung Nhâm bất điều (Mày đay)",
    description:
      "Ở phụ nữ, hai mạch Xung-Nhâm (đều khởi từ bào trung, liên quan kinh nguyệt) mất điều hòa khiến mày đay tái phát THEO CHU KỲ KINH NGUYỆT (đặc trưng chẩn đoán riêng biệt của thể này — không gặp ở nam giới hoặc các thể khác). Có thể kèm rối loạn kinh nguyệt. Lưỡi nhạt tím hoặc có điểm ứ huyết (khí huyết xung nhâm ứ trệ), mạch huyền tế. Pháp: Điều hòa Xung Nhâm, dưỡng huyết khu phong. Phương: Nhị chí hoàn hợp Tứ vật thang gia giảm. Huyệt: Quan nguyên, Tam âm giao, Huyết hải, Thái xung.",
    supportCriteria:
      "Sẩn xuất hiện/nặng lên THEO CHU KỲ KINH NGUYỆT (đặc trưng chẩn đoán), có thể kèm rối loạn kinh nguyệt. Lưỡi nhạt tím hoặc có điểm ứ huyết. Mạch huyền tế. Nguồn: Giáo án Bài 2 Mày đay, Da liễu YHCT.",
  },
  {
    name: "Vệ khí bất cố (Mày đay)",
    description:
      "Tấu lý lỏng lẻo bẩm sinh (biểu hư) hoặc do bệnh lâu ngày, vệ khí không đủ sức cố biểu, dễ cảm phong tà mỗi khi thời tiết thay đổi — đặc trưng: dễ ra mồ hôi, sợ gió, hay cảm mạo KÈM NỔI MÀY ĐAY MỖI KHI ĐỔI THỜI TIẾT (yếu tố khởi phát đặc trưng = thay đổi thời tiết, khác thể Xung Nhâm là chu kỳ kinh, khác thể Trường Vị là bữa ăn). Lưỡi nhạt rêu trắng mỏng, mạch nhu hoãn (nhu=hư biểu). Pháp: Ích khí cố biểu, khu phong. Phương: Ngọc bình phong tán gia vị. Huyệt: Phế du, Túc tam lý, Hợp cốc, Đại chùy.",
    supportCriteria:
      "Dễ ra mồ hôi, sợ gió, hay cảm mạo kèm nổi mày đay MỖI KHI ĐỔI THỜI TIẾT. Lưỡi nhạt, rêu trắng mỏng. Mạch nhu hoãn. Nguồn: Giáo án Bài 2 Mày đay, Da liễu YHCT.",
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
