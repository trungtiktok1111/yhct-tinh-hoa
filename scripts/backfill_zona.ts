// Bổ sung description + supportCriteria cho 3 Pattern thuộc nguồn "Điều trị Zona và đau sau Zona YHCT-PHCN"
// (Ths.Bs. Lê Đức Thịnh, 36 trang, mục III). Nội dung lấy từ sơ đồ cơ chế bệnh sinh (slide 27) và chi tiết
// từng thể (slide 29-31) có thật trong nguồn, chưa được đưa vào DB trước đây.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const commonMechanism =
  "Theo sơ đồ cơ chế bệnh sinh của nguồn: Tình chí uất kết → Can kinh uất nhiệt; Ẩm thực thất điều → Tỳ hư thấp uẩn; cả hai dòng này hội tụ gây 'Nhiệt độc tích tụ tại bì phu' → phát sinh chứng sang (tổn thương da dạng dải). Đồng thời, Huyết hư + Can dương vượng (ở người lão suy) và bản thân quá trình Lão suy đều góp phần gây 'Khí trệ huyết ứ' — khí trệ huyết ứ vừa do nhiệt độc bì phu kéo dài, vừa độc lập từ huyết hư/lão suy — và khí trệ huyết ứ là nguyên nhân trực tiếp gây ĐAU (đặc biệt là đau sau Zona/PHN kéo dài).";

const updates: { name: string; description: string; supportCriteria: string }[] = [
  {
    name: "Can kinh uất nhiệt (Zona)",
    description:
      commonMechanism +
      " Thể Can kinh uất nhiệt: do tình chí uất kết lâu ngày hóa hỏa, can kinh (đi qua sườn, nơi Zona hay gặp nhất) uất nhiệt, nhiệt độc theo kinh tràn ra bì phu gây dải sang thương đỏ, bóng nước CĂNG (nhiệt thịnh làm dịch cô đặc, bọng nước căng mọng — khác bọng nước chùng của tỳ hư thấp uẩn), đau bỏng rát châm chích (nhiệt tính viêm). Nhiệt nhiễu tâm nên tâm phiền; nhiệt thương tân nên họng khô đắng, phân khô nước tiểu vàng; lưỡi đỏ rêu vàng dày/mỏng, mạch huyền (chủ can) hoạt sác (chủ nhiệt) là dấu hiệu thực nhiệt điển hình.",
    supportCriteria:
      "Dải sang thương đỏ, bóng nước căng, đau bỏng rát châm chích. Tâm phiền, họng khô đắng, phân khô nước tiểu vàng. Lưỡi đỏ, rêu lưỡi vàng dày/mỏng. Mạch huyền hoạt sác. Điều trị: Long đởm tả can thang gia giảm.",
  },
  {
    name: "Tỳ hư thấp uẩn (Zona)",
    description:
      commonMechanism +
      " Thể Tỳ hư thấp uẩn: do ẩm thực thất điều tổn thương tỳ vị, tỳ hư vận hóa thất chức, thấp trọc nội sinh uẩn kết, thấp theo kinh lạc tràn ra bì phu gây sang thương màu hồng NHẠT (khác màu đỏ tươi của nhiệt thịnh), vỏ bóng nước CHÙNG (thấp trọc làm dịch loãng, bọng nước không căng như thể nhiệt). Tỳ hư vận hóa kém nên bụng đầy chướng, tiêu hóa kém, phân lỏng; lưỡi nhạt rêu trắng/nhớt (nhớt = dấu hiệu thấp); mạch trầm hoạt (trầm chủ lý, hoạt chủ thấp/thực tích).",
    supportCriteria:
      "Sang thương màu hồng nhạt, vỏ bóng nước chùng. Bụng đầy chướng, tiêu hóa kém, phân lỏng. Lưỡi nhạt, rêu lưỡi trắng/nhớt. Mạch trầm hoạt. Điều trị: Trừ thấp vị linh thang gia giảm.",
  },
  {
    name: "Khí trệ huyết ứ (Zona, đau sau Zona)",
    description:
      commonMechanism +
      " Thể Khí trệ huyết ứ: đặc trưng là 'đau kéo dài hệ quả' — tức giai đoạn sau, thường tương ứng đau sau Zona (PHN), khi nhiệt độc bì phu đã giảm nhưng khí huyết tại chỗ vẫn ứ trệ không thông (do tổn thương nhiệt độc kéo dài, hoặc do huyết hư/can dương vượng/lão suy làm khí huyết vận hành kém sẵn có). Khí trệ huyết ứ bất thông tắc thống nên đau dai dẳng là triệu chứng chủ yếu; lưỡi tím (ứ huyết) rêu trắng/vàng (tùy còn sót thấp hay nhiệt); mạch huyền (khí trệ) tế (huyết/khí hao tổn ở giai đoạn muộn).",
    supportCriteria:
      "Đau kéo dài là hệ quả (đặc trưng cho giai đoạn đau sau Zona/PHN). Lưỡi tím, rêu trắng/vàng. Mạch huyền tế. Điều trị: Sài hồ sơ can thang hợp Đào hồng tứ vật thang.",
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
